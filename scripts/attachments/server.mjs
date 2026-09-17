import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, dirname, join } from 'node:path'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { parseArgs } from 'node:util'
import { h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Upload, Download, Trash2, Send, FileText, RefreshCw } from 'lucide-vue-next'
import { courses, repository, siteUrl } from '../../docs/.vitepress/courses.mjs'
import { AttachmentStore, MAX_FILE_SIZE, EXTENSIONS, UserError } from './store.mjs'
import { Publisher, GitRepository, GitHubAssets } from './publisher.mjs'

const directory = dirname(fileURLToPath(import.meta.url))
const BODY_LIMIT = MAX_FILE_SIZE + 1024 * 1024
const icons = { upload: Upload, download: Download, trash: Trash2, send: Send, file: FileText, refresh: RefreshCw }
const publicFiles = { '/': ['index.html', 'text/html; charset=utf-8'], '/client.js': ['client.js', 'text/javascript; charset=utf-8'], '/style.css': ['style.css', 'text/css; charset=utf-8'] }

async function body(request) {
  if (Number(request.headers['content-length']) > BODY_LIMIT) throw new UserError('文件不能超过 100 MB。', 413)
  const chunks = []; let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > BODY_LIMIT) throw new UserError('文件不能超过 100 MB。', 413)
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}
function authorized(header, token) {
  const actual = Buffer.from(header || '')
  const expected = Buffer.from('Bearer ' + token)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export async function createAttachmentServer({ root = resolve(directory, '../..'), store = new AttachmentStore(root, courses.map(({ id }) => id)), publisher } = {}) {
  await store.init()
  publisher ??= new Publisher(store, new GitRepository(root, repository), new GitHubAssets(root, repository))
  const token = randomBytes(32).toString('hex')
  let busy = false
  const server = createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('X-Frame-Options', 'DENY')
    response.setHeader('Referrer-Policy', 'no-referrer')
    response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'")
    const json = (value, status = 200) => { response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); response.end(JSON.stringify(value)) }
    let locked = false
    try {
      const host = `127.0.0.1:${server.address().port}`
      if (request.headers.host !== host) throw new UserError('拒绝非本机访问。', 403)
      const url = new URL(request.url, `http://${host}`)
      if (request.method === 'GET' && publicFiles[url.pathname]) {
        const [file, type] = publicFiles[url.pathname]
        let data = await readFile(join(directory, file), 'utf8')
        if (file === 'index.html') data = data.replace('SESSION_TOKEN', token)
        response.writeHead(200, { 'Content-Type': type }); return response.end(data)
      }
      if (request.method === 'GET' && url.pathname.startsWith('/icons/')) {
        const icon = icons[url.pathname.slice(7).replace(/\.svg$/, '')]
        if (!icon) throw new UserError('不存在的图标。', 404)
        response.writeHead(200, { 'Content-Type': 'image/svg+xml' })
        return response.end(await renderToString(h(icon, { size: 20 })))
      }
      if (!url.pathname.startsWith('/api/')) throw new UserError('页面不存在。', 404)
      if (!authorized(request.headers.authorization, token)) throw new UserError('管理会话无效，请刷新管理页。', 401)
      if (request.method !== 'GET') {
        if (request.headers.origin !== `http://${host}`) throw new UserError('请求来源不正确。', 403)
        if (busy) throw new UserError('正在处理另一项操作，请稍候。', 409)
        busy = true; locked = true
      }
      if (request.method === 'GET' && url.pathname === '/api/state') {
        const published = await store.published()
        const pending = await store.pending()
        return json({ courses: courses.map(({ id, title }) => ({ id, title })), published, drafts: (await store.drafts()).filter((file) => !file.discarded && !published.some((item) => item.id === file.id)), pending: pending ? { action: pending.action, title: pending.entry.title, phase: pending.phase } : null, busy, maxFileSize: MAX_FILE_SIZE, extensions: EXTENSIONS, repository, siteUrl })
      }
      const match = url.pathname.match(/^\/api\/drafts\/([a-f0-9-]{36})(?:\/(download|publish|withdraw))?$/)
      if (match && request.method === 'GET' && match[2] === 'download') {
        const draft = await store.get(match[1])
        if (draft.discarded) throw new UserError('草稿已移除。', 404)
        const data = await store.bytes(draft)
        response.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename="attachment.${draft.extension}"; filename*=UTF-8''${encodeURIComponent(draft.fileName)}`, 'Content-Length': data.length })
        return response.end(data)
      }
      if (request.method === 'POST' && url.pathname === '/api/drafts') {
        if (!request.headers['content-type']?.startsWith('multipart/form-data;')) throw new UserError('请选择文件后上传。')
        let form
        try { form = await new Request(`http://${host}`, { method: 'POST', headers: { 'Content-Type': request.headers['content-type'] }, body: await body(request) }).formData() } catch (error) {
          if (error instanceof UserError) throw error
          throw new UserError('无法读取上传内容。')
        }
        for (const key of new Set(form.keys())) if (form.getAll(key).length !== 1 || !['file', 'courseId', 'title', 'description', 'rightsConfirmed'].includes(key)) throw new UserError('上传字段无效。')
        const file = form.get('file')
        if (!file || typeof file.arrayBuffer !== 'function') throw new UserError('请选择一个文件。')
        const draft = await store.add({ courseId: form.get('courseId'), title: form.get('title'), description: form.get('description') || '', rightsConfirmed: form.get('rightsConfirmed') === 'true', fileName: file.name }, Buffer.from(await file.arrayBuffer()))
        return json({ draft, message: '草稿已保存到本机，尚未公开。' }, 201)
      }
      if (match && request.method === 'DELETE' && !match[2]) { await store.discard(match[1]); return json({ message: '草稿已从列表移除，本机备份保留。' }) }
      if (match && request.method === 'POST' && match[2] === 'publish') return json(await publisher.publish(match[1]))
      if (match && request.method === 'POST' && match[2] === 'withdraw') return json(await publisher.cancelDraft(match[1]))
      const removal = url.pathname.match(/^\/api\/attachments\/([a-f0-9-]{36})\/remove$/)
      if (removal && request.method === 'POST') return json(await publisher.remove(removal[1]))
      if (request.method === 'POST' && url.pathname === '/api/retry') return json(await publisher.retry())
      throw new UserError('操作不存在。', 404)
    } catch (error) {
      if (!response.headersSent) json({ error: error instanceof UserError ? error.message : '操作失败。请检查本地文件或重试。' }, error instanceof UserError ? error.status : 500)
    } finally { if (locked) busy = false }
  })
  server.requestTimeout = 360000
  return { server, store }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { port: { type: 'string', default: '5174' } } })
  const port = Number(values.port)
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('端口须在 1024–65535 之间。')
  const { server } = await createAttachmentServer()
  server.on('error', (error) => { console.error(error.code === 'EADDRINUSE' ? `端口 ${port} 已被使用。请打开已有管理页，或用 --port 指定另一端口。` : '附件管理服务启动失败。'); process.exitCode = 1 })
  server.listen(port, '127.0.0.1', () => console.log(`附件管理（仅本机）：http://127.0.0.1:${port}\n关闭此窗口或按 Ctrl+C 停止。`))
}
