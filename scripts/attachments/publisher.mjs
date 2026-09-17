import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { MANIFEST, UserError, writeJson } from './store.mjs'

const execute = promisify(execFile)
const TAG = 'course-attachments'
const hash = (text) => createHash('sha256').update(text).digest('hex')

export class GitRepository {
  constructor(root, repository) { this.root = root; this.repository = repository }
  async run(...args) {
    try {
      const result = await execute('git', args, { cwd: this.root, windowsHide: true, timeout: 120000, env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'Never' } })
      return result.stdout.trim()
    } catch { throw new UserError('Git 同步失败。请检查网络、GitHub 登录和仓库状态，然后重试。', 409) }
  }
  async clean() {
    if (await this.run('status', '--porcelain')) throw new UserError('项目还有未提交的修改。请先提交并同步网站，再发布附件。', 409)
  }
  async validateRepository() {
    if (await this.run('branch', '--show-current') !== 'main') throw new UserError('请切换到 main 分支后发布。', 409)
    const remote = await this.run('remote', 'get-url', 'origin')
    if (![this.repository, this.repository + '.git', this.repository.replace('https://github.com/', 'git@github.com:') + '.git'].includes(remote)) throw new UserError('origin 不是本站的 GitHub 仓库。', 409)
  }
  async preflight() {
    await this.validateRepository()
    await this.clean()
    await this.run('fetch', 'origin', 'main')
    const head = await this.run('rev-parse', 'HEAD')
    if (head !== await this.run('rev-parse', 'origin/main')) throw new UserError('本地与 GitHub 尚未同步。请先同步网站代码。', 409)
    return head
  }
  async unchanged(head) {
    await this.clean()
    if (head !== await this.run('rev-parse', 'HEAD')) throw new UserError('上传期间项目发生了修改。文件已保留，请同步代码后重试。', 409)
  }
}

// Reuse Git Credential Manager in memory; credentials never reach the browser or disk.
async function credential(root, repo) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['credential', 'fill'], { cwd: root, windowsHide: true, env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'Never' }, stdio: ['pipe', 'pipe', 'ignore'] })
    let output = ''
    const timer = setTimeout(() => child.kill(), 30000)
    child.stdout.on('data', (chunk) => { output += chunk })
    child.on('error', () => { clearTimeout(timer); reject(new UserError('无法读取 GitHub 登录信息。')) })
    child.on('close', (code) => {
      clearTimeout(timer)
      const token = output.split(/\r?\n/).find((line) => line.startsWith('password='))?.slice(9)
      output = ''
      if (code || !token) reject(new UserError('请先在 VS Code 中登录 GitHub 并成功推送一次，再重试。', 401))
      else resolve(token)
    })
    child.stdin.end(`protocol=https\nhost=github.com\npath=${repo}.git\n\n`)
  })
}

export class GitHubAssets {
  constructor(root, repository) { this.root = root; this.repo = new URL(repository).pathname.slice(1) }
  async request(path, { method = 'GET', body, upload = false, missing = false } = {}) {
    const token = await credential(this.root, this.repo)
    let response
    try {
      response = await fetch(`https://${upload ? 'uploads' : 'api'}.github.com${path}`, {
        method, redirect: 'error', signal: AbortSignal.timeout(upload ? 300000 : 45000),
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10', 'Content-Type': upload ? 'application/octet-stream' : 'application/json', 'User-Agent': 'study-handbook-attachments' },
        body: body === undefined ? undefined : upload ? body : JSON.stringify(body)
      })
    } catch { throw new UserError('无法连接 GitHub。请检查网络后重试；本地草稿不会丢失。', 502) }
    if (response.status === 404 && missing) return null
    if (!response.ok) throw new UserError(`GitHub 返回 ${response.status}，请检查账号权限或稍后重试。`, 502)
    return response.status === 204 ? null : response.json()
  }
  async find(draft, release) {
    const base = `/repos/${this.repo}/releases`
    release ??= await this.request(`${base}/tags/${TAG}`, { missing: true })
    if (!release) return null
    const name = `${draft.courseId}--${draft.id}.${draft.extension}`
    for (let page = 1; ; page++) {
      const assets = await this.request(`${base}/${release.id}/assets?per_page=100&page=${page}`)
      const asset = assets.find((item) => item.name === name)
      if (asset) return asset
      if (assets.length < 100) return null
    }
  }
  async upload(draft, bytes) {
    const base = `/repos/${this.repo}/releases`
    let release = await this.request(`${base}/tags/${TAG}`, { missing: true })
    if (!release) release = await this.request(base, { method: 'POST', body: { tag_name: TAG, target_commitish: 'main', name: '课程附件', body: '湘卓工学习手册的公开课程附件。请仅发布原创、已获授权或许可公开分发的资料。', make_latest: 'false' } })
    const name = `${draft.courseId}--${draft.id}.${draft.extension}`
    let asset = await this.find(draft, release)
    if (!asset) asset = await this.request(`${base}/${release.id}/assets?${new URLSearchParams({ name, label: draft.title })}`, { method: 'POST', upload: true, body: bytes })
    if (asset.state !== 'uploaded' || asset.size !== draft.size || (asset.digest && asset.digest !== `sha256:${draft.sha256}`)) throw new UserError('远程附件校验不一致。请在 GitHub 的课程附件 Release 中检查该文件后重试。', 409)
    const expected = `https://github.com/${this.repo}/releases/download/${TAG}/${name}`
    if (asset.browser_download_url !== expected) throw new UserError('远程下载地址校验失败。')
    return { assetId: asset.id, assetName: name, url: expected }
  }
  async remove(assetId) {
    if (!Number.isSafeInteger(assetId) || assetId <= 0) throw new UserError('远程附件编号无效。')
    await this.request(`/repos/${this.repo}/releases/assets/${assetId}`, { method: 'DELETE', missing: true })
  }
  async cancel(draft) {
    const asset = await this.find(draft)
    if (asset) await this.remove(asset.id)
  }
}

export class Publisher {
  constructor(store, git, assets) { this.store = store; this.git = git; this.assets = assets }
  async available() {
    if (await this.store.pending()) throw new UserError('还有一次发布未完成，请先点击“重试同步”。', 409)
  }
  async publish(id) {
    await this.available()
    const draft = await this.store.get(id)
    if (draft.discarded) throw new UserError('该草稿已移除。')
    if ((await this.store.published()).some((file) => file.id === id)) throw new UserError('该文件已提交发布。')
    const head = await this.git.preflight()
    const bytes = await this.store.bytes(draft)
    draft.uploadAttemptedAt = new Date().toISOString()
    await this.store.update(draft)
    const asset = await this.assets.upload(draft, bytes)
    await this.store.update({ ...draft, ...asset })
    await this.git.unchanged(head)
    const entry = { id: draft.id, courseId: draft.courseId, title: draft.title, description: draft.description, fileName: draft.fileName, format: draft.extension.toUpperCase(), size: draft.size, sha256: draft.sha256, publishedAt: new Date().toISOString(), ...asset }
    return this.commit('publish', entry, [...await this.store.published(), entry], head)
  }
  async remove(id) {
    await this.available()
    const entry = (await this.store.published()).find((file) => file.id === id)
    if (!entry) throw new UserError('附件不存在。', 404)
    const head = await this.git.preflight()
    return this.commit('remove', entry, (await this.store.published()).filter((file) => file.id !== id), head)
  }
  async cancelDraft(id) {
    await this.available()
    if ((await this.store.published()).some((file) => file.id === id)) throw new UserError('该文件已提交发布，请使用撤下操作。')
    const draft = await this.store.get(id)
    if (draft.uploadAttemptedAt || draft.assetId) await this.assets.cancel(draft)
    await this.store.update({ ...draft, discarded: true, assetId: undefined, uploadAttemptedAt: undefined, url: undefined })
    return { message: '已移除草稿，并撤下该草稿的远程附件。本机备份保留。' }
  }
  async commit(action, entry, manifest, head) {
    const original = await readFile(this.store.manifest, 'utf8')
    const content = JSON.stringify(manifest, null, 2) + '\n'
    const operation = { action, entry, beforeCommit: head, original, contentHash: hash(content), phase: 'commit' }
    await writeJson(this.store.operation, operation)
    await writeFile(this.store.manifest, content)
    return this.retry()
  }
  async retry() {
    const operation = await this.store.pending()
    if (!operation) throw new UserError('没有待重试的发布。')
    await this.git.validateRepository()
    if (hash(await readFile(this.store.manifest, 'utf8')) !== operation.contentHash) throw new UserError('附件目录已被另外修改。请先核对目录，不会自动覆盖。', 409)
    if (operation.phase === 'commit') {
      const head = await this.git.run('rev-parse', 'HEAD')
      if (head === operation.beforeCommit) {
        // --only commits this manifest, preserving any unrelated staging area.
        await this.git.run('commit', '--only', '-m', `${operation.action === 'publish' ? 'Publish' : 'Remove'} course attachment ${operation.entry.id}`, '--', MANIFEST)
      } else {
        if (await this.git.run('rev-parse', 'HEAD^') !== operation.beforeCommit || await this.git.run('diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD') !== MANIFEST) throw new UserError('发布期间 Git 历史发生变化，请人工核对后再继续。', 409)
      }
      operation.commit = await this.git.run('rev-parse', 'HEAD')
      operation.phase = 'push'
      await writeJson(this.store.operation, operation)
    }
    if (operation.phase === 'push') {
      await this.git.unchanged(operation.commit)
      await this.git.run('push', 'origin', 'main')
      operation.phase = 'cleanup'
      await writeJson(this.store.operation, operation)
    }
    if (operation.action === 'remove') {
      await this.assets.remove(operation.entry.assetId)
      const draft = (await this.store.drafts()).find((item) => item.id === operation.entry.id)
      if (draft) await this.store.update({ ...draft, discarded: true, assetId: undefined, url: undefined })
    }
    await writeJson(this.store.operation, null)
    return { message: operation.action === 'publish' ? '已提交发布，网站更新需要稍等片刻。' : '已撤下远程文件，网站目录将在部署后更新。', commit: operation.commit }
  }
}
