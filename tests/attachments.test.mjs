import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'
import { request as httpRequest } from 'node:http'
import { AttachmentStore, validateUpload, MAX_FILE_SIZE, MANIFEST, UserError } from '../scripts/attachments/store.mjs'
import { createAttachmentServer } from '../scripts/attachments/server.mjs'
import { GitRepository, GitHubAssets, Publisher } from '../scripts/attachments/publisher.mjs'
import { courses, repository } from '../docs/.vitepress/courses.mjs'

const input = { courseId: 'automatic-control', title: '测试笔记', description: '本地测试', rightsConfirmed: true, fileName: 'notes.txt', size: 4 }
const ids = courses.map(({ id }) => id)
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'study-attachments-'))
  // Only remove this test's own newly created temporary directory.
  t.after(async () => {
    const target = resolve(root)
    assert.ok(target.startsWith(resolve(tmpdir()) + sep + 'study-attachments-'))
    await rm(target, { recursive: true, force: true })
  })
  await mkdir(join(root, 'docs/.vitepress'), { recursive: true })
  await writeFile(join(root, MANIFEST), '[]\n')
  const store = new AttachmentStore(root, ids); await store.init()
  return { root, store }
}

test('upload validation rejects unsafe names, courses, rights, types and sizes', () => {
  assert.equal(validateUpload(input, ids).extension, 'txt')
  for (const change of [{ courseId: 'unknown' }, { title: ' ' }, { title: 'a'.repeat(121) }, { rightsConfirmed: false }, { fileName: '../x.pdf' }, { fileName: '..\\x.pdf' }, { fileName: 'x\n.pdf' }, { fileName: 'x.exe' }, { size: 0 }, { size: MAX_FILE_SIZE + 1 }]) assert.throws(() => validateUpload({ ...input, ...change }, ids), UserError)
})
test('private drafts preserve bytes, reject duplicates, validate PDFs and detect tampering', async (t) => {
  const { store } = await fixture(t)
  const bytes = Buffer.from('attachment test')
  const draft = await store.add(input, bytes)
  assert.deepEqual(await store.bytes(draft), bytes)
  assert.deepEqual(await store.published(), [])
  await assert.rejects(store.add(input, bytes), /已在本课程/)
  await assert.rejects(store.add({ ...input, fileName: 'bad.pdf' }, bytes), /不是可识别/)
  await assert.rejects(store.get('../../etc/passwd'), /不存在/)
  await writeFile(store.filePath(draft), 'tampered')
  await assert.rejects(store.bytes(draft), /发生变化/)
  await store.discard(draft.id)
  assert.equal((await store.get(draft.id)).discarded, true)
  await store.add(input, bytes)
})
test('local HTTP API checks session, origin and host; multipart upload/download works', async (t) => {
  const { root, store } = await fixture(t)
  let publishes = 0
  const { server } = await createAttachmentServer({ root, store, publisher: { publish: async () => { publishes++; return { message: 'ok' } } } })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections() }))
  const origin = `http://127.0.0.1:${server.address().port}`
  const html = await (await fetch(origin)).text()
  const token = html.match(/name="attachment-session" content="([a-f0-9]+)"/)[1]
  const headers = { Authorization: 'Bearer ' + token, Origin: origin }
  assert.equal((await fetch(origin + '/api/state')).status, 401)
  const wrongHostStatus = await new Promise((resolve, reject) => {
    const request = httpRequest(origin + '/api/state', { headers: { ...headers, Host: 'evil.example' } }, (response) => { response.resume(); resolve(response.statusCode) })
    request.on('error', reject); request.end()
  })
  assert.equal(wrongHostStatus, 403)
  assert.equal((await fetch(origin + '/api/retry', { method: 'POST', headers: { ...headers, Origin: 'https://evil.example' } })).status, 403)
  assert.equal((await fetch(origin + '/.attachments/drafts.json', { headers })).status, 404)
  const form = new FormData()
  for (const [key, value] of Object.entries(input)) if (!['fileName', 'size'].includes(key)) form.set(key, String(value))
  form.set('file', new Blob(['private file']), 'notes.txt')
  const uploaded = await fetch(origin + '/api/drafts', { method: 'POST', headers, body: form })
  assert.equal(uploaded.status, 201)
  const { draft } = await uploaded.json()
  assert.equal((await (await fetch(origin + '/api/state', { headers })).json()).drafts.length, 1)
  const download = await fetch(origin + `/api/drafts/${draft.id}/download`, { headers })
  assert.equal(await download.text(), 'private file')
  assert.equal(download.headers.get('content-type'), 'application/octet-stream')
  assert.equal(publishes, 0)
  await fetch(origin + `/api/drafts/${draft.id}`, { method: 'DELETE', headers })
  assert.equal((await fetch(origin + `/api/drafts/${draft.id}/download`, { headers })).status, 404)
  form.append('file', new Blob(['other file']), 'other.txt')
  assert.equal((await fetch(origin + '/api/drafts', { method: 'POST', headers, body: form })).status, 400)
})

async function publisherFixture(t) {
  const { root, store } = await fixture(t)
  const remote = join(root, 'remote.git')
  const git = new GitRepository(root, repository)
  await git.run('init', '-b', 'main')
  await git.run('config', 'user.email', 'test@example.invalid')
  await git.run('config', 'user.name', 'Attachment Test')
  await git.run('init', '--bare', remote)
  await writeFile(join(root, '.gitignore'), '.attachments/\nremote.git/\n')
  await git.run('add', '.gitignore', MANIFEST)
  await git.run('commit', '-m', 'Initialize test')
  await git.run('remote', 'add', 'origin', remote)
  await git.run('push', '-u', 'origin', 'main')
  git.validateRepository = async () => {
    assert.equal(await git.run('branch', '--show-current'), 'main')
    assert.equal((await git.run('remote', 'get-url', 'origin')).replaceAll('\\', '/'), remote.replaceAll('\\', '/'))
  }
  let uploads = 0, removes = 0, failRemove = false
  const assets = {
    upload: async (draft, bytes) => { uploads++; assert.equal(bytes.length, draft.size); return { assetId: 42, assetName: draft.id + '.txt', url: 'https://github.com/example/test/releases/download/course-attachments/test.txt' } },
    remove: async (id) => { assert.equal(id, 42); removes++; if (failRemove) throw new UserError('删除失败') }
  }
  const publisher = new Publisher(store, git, assets)
  const draft = await store.add(input, Buffer.from('test content'))
  return { root, store, git, publisher, draft, metrics: () => ({ uploads, removes }), failRemoval: (value) => { failRemove = value } }
}
test('publish commits only the index, then removal deletes the remote asset', async (t) => {
  const { store, git, publisher, draft, metrics } = await publisherFixture(t)
  await publisher.publish(draft.id)
  assert.equal((await store.published())[0].title, input.title)
  assert.equal(await git.run('diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'), MANIFEST)
  assert.equal(await store.pending(), null)
  assert.equal(await git.run('rev-parse', 'HEAD'), await git.run('rev-parse', 'origin/main'))
  await publisher.remove(draft.id)
  assert.deepEqual(await store.published(), [])
  assert.deepEqual(metrics(), { uploads: 1, removes: 1 })
})
test('dirty/unpushed work blocks publication before any upload', async (t) => {
  const { root, git, publisher, draft, metrics } = await publisherFixture(t)
  await writeFile(join(root, 'unrelated.txt'), 'user work')
  await assert.rejects(publisher.publish(draft.id), /未提交/)
  await git.run('add', 'unrelated.txt'); await git.run('commit', '-m', 'Unpushed user work')
  await assert.rejects(publisher.publish(draft.id), /尚未同步/)
  assert.equal(metrics().uploads, 0)
})
test('push and cleanup failures can resume without duplicate upload or commit', async (t) => {
  const { store, git, publisher, draft, metrics, failRemoval } = await publisherFixture(t)
  const run = git.run.bind(git)
  let failPush = true
  git.run = async (...args) => { if (args[0] === 'push' && failPush) throw new UserError('断网'); return run(...args) }
  await assert.rejects(publisher.publish(draft.id), /断网/)
  const head = await git.run('rev-parse', 'HEAD')
  assert.equal((await store.pending()).phase, 'push')
  await assert.rejects(publisher.publish(draft.id), /未完成/)
  failPush = false
  await publisher.retry()
  assert.equal(await git.run('rev-parse', 'HEAD'), head)
  assert.equal(metrics().uploads, 1)
  failRemoval(true)
  await assert.rejects(publisher.remove(draft.id), /删除失败/)
  assert.equal((await store.pending()).phase, 'cleanup')
  failRemoval(false)
  await publisher.retry()
  assert.equal(await store.pending(), null)
  assert.equal((await store.get(draft.id)).discarded, true)
})
test('uncertain upload is not labeled private and can be withdrawn', async (t) => {
  const { store, git, draft } = await publisherFixture(t)
  let cancelled = false
  const publisher = new Publisher(store, git, {
    upload: async () => { throw new UserError('上传响应中断') },
    cancel: async (file) => { assert.equal(file.id, draft.id); cancelled = true }
  })
  await assert.rejects(publisher.publish(draft.id), /上传响应中断/)
  assert.ok((await store.get(draft.id)).uploadAttemptedAt)
  await assert.rejects(store.discard(draft.id), /尝试过远程/)
  await publisher.cancelDraft(draft.id)
  assert.equal(cancelled, true)
  assert.equal((await store.get(draft.id)).discarded, true)
})
test('GitHub assets are reused after interrupted responses and verified by size and digest', async () => {
  const client = new GitHubAssets('.', repository)
  const draft = { id: 'original-unique-id', courseId: 'automatic-control', extension: 'txt', size: 4, sha256: 'a'.repeat(64) }
  const name = `${draft.courseId}--${draft.id}.txt`
  const asset = { id: 123, name, state: 'uploaded', size: 4, digest: 'sha256:' + draft.sha256, browser_download_url: repository + '/releases/download/course-attachments/' + name }
  let requests = 0
  client.request = async (path, options = {}) => {
    requests++; assert.equal(options.method, undefined)
    if (path.includes('/tags/')) return { id: 20 }
    return [asset]
  }
  assert.equal((await client.upload(draft, Buffer.from('test'))).assetId, 123)
  assert.equal(requests, 2)
  asset.digest = 'sha256:' + 'b'.repeat(64)
  await assert.rejects(client.upload(draft, Buffer.from('test')), /校验不一致/)
})
test('a newly created release receives the original bytes without publishing them in Git', async () => {
  const client = new GitHubAssets('.', repository)
  const draft = { id: 'new-test-id', courseId: 'automatic-control', extension: 'txt', size: 4, sha256: 'a'.repeat(64), title: 'My notes' }
  const bytes = Buffer.from('test')
  let uploaded = false
  client.request = async (path, options = {}) => {
    if (path.includes('/tags/')) return null
    if (options.method === 'POST' && !options.upload) { assert.equal(options.body.tag_name, 'course-attachments'); assert.equal(options.body.make_latest, 'false'); return { id: 25 } }
    if (options.upload) { uploaded = true; assert.deepEqual(options.body, bytes); return { id: 42, state: 'uploaded', size: 4, digest: 'sha256:' + draft.sha256, browser_download_url: repository + '/releases/download/course-attachments/automatic-control--new-test-id.txt' } }
    return []
  }
  assert.equal((await client.upload(draft, bytes)).assetId, 42)
  assert.ok(uploaded)
})
test('public attachment index has valid course metadata and trusted download URLs', async () => {
  const manifest = JSON.parse(await readFile(new URL('../docs/.vitepress/attachments.json', import.meta.url), 'utf8'))
  assert.equal(new Set(manifest.map((file) => file.id)).size, manifest.length)
  for (const file of manifest) {
    assert.ok(ids.includes(file.courseId)); assert.ok(file.title && file.description !== undefined)
    assert.ok(file.size > 0 && file.size <= MAX_FILE_SIZE)
    assert.ok(Number.isFinite(Date.parse(file.publishedAt)))
    assert.match(file.sha256, /^[a-f0-9]{64}$/)
    assert.ok(file.url.startsWith(repository + '/releases/download/course-attachments/'))
    assert.ok(Number.isSafeInteger(file.assetId))
  }
})
