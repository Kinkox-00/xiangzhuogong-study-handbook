import { mkdir, readFile, writeFile, rename, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID, createHash } from 'node:crypto'

export const MAX_FILE_SIZE = 100 * 1024 * 1024
export const EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'md', 'csv', 'zip', 'png', 'jpg', 'jpeg']
export const MANIFEST = 'docs/.vitepress/attachments.json'
export class UserError extends Error {
  constructor(message, status = 400) { super(message); this.status = status }
}
export async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, 'utf8')) } catch (error) {
    if (error.code === 'ENOENT' && fallback !== undefined) return fallback
    throw error
  }
}
export async function writeJson(file, value) {
  const temporary = file + '.' + randomUUID() + '.tmp'
  await writeFile(temporary, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  await rename(temporary, file)
}
export function validateUpload({ courseId, title, description = '', rightsConfirmed, fileName, size }, courseIds) {
  if (!courseIds.includes(courseId)) throw new UserError('请选择有效课程。')
  if (typeof title !== 'string' || !title.trim() || title.length > 120) throw new UserError('附件名称须为 1–120 个字符。')
  if (typeof description !== 'string' || description.length > 1000) throw new UserError('说明不能超过 1000 个字符。')
  if (rightsConfirmed !== true) throw new UserError('请确认你有权公开分发该文件。')
  if (typeof fileName !== 'string' || /[\\/\x00-\x1f]/.test(fileName) || fileName.length > 200) throw new UserError('文件名无效。')
  const extension = fileName.split('.').at(-1).toLowerCase()
  if (!EXTENSIONS.includes(extension)) throw new UserError('不支持此文件类型。')
  if (!Number.isSafeInteger(size) || size <= 0 || size > MAX_FILE_SIZE) throw new UserError('文件须大于 0 字节，且不超过 100 MB。', 413)
  return { courseId, title: title.trim(), description: description.trim(), fileName, extension }
}

export class AttachmentStore {
  constructor(root, courseIds) {
    this.root = root
    this.courseIds = courseIds
    this.directory = join(root, '.attachments')
    this.records = join(this.directory, 'drafts.json')
    this.operation = join(this.directory, 'operation.json')
    this.manifest = join(root, MANIFEST)
  }
  async init() { await mkdir(join(this.directory, 'files'), { recursive: true }) }
  async drafts() { return readJson(this.records, []) }
  async published() { return readJson(this.manifest) }
  async pending() { return readJson(this.operation, null) }
  async get(id) {
    if (!/^[a-f0-9-]{36}$/.test(id)) throw new UserError('附件不存在。', 404)
    const draft = (await this.drafts()).find((file) => file.id === id)
    if (!draft) throw new UserError('附件不存在。', 404)
    return draft
  }
  filePath(draft) { return join(this.directory, 'files', draft.id + '.' + draft.extension) }
  async update(draft) {
    const records = await this.drafts()
    const index = records.findIndex(({ id }) => id === draft.id)
    if (index < 0) records.push(draft)
    else records[index] = draft
    await writeJson(this.records, records)
  }
  async add(fields, bytes) {
    const input = validateUpload({ ...fields, size: bytes.length }, this.courseIds)
    if (input.extension === 'pdf' && !bytes.subarray(0, 1024).includes(Buffer.from('%PDF-'))) throw new UserError('文件内容不是可识别的 PDF。')
    const digest = createHash('sha256').update(bytes).digest('hex')
    if ((await this.drafts()).some((item) => item.sha256 === digest && item.courseId === input.courseId && !item.discarded)) throw new UserError('该文件已在本课程的管理列表中。', 409)
    const draft = { ...input, id: randomUUID(), size: bytes.length, sha256: digest, createdAt: new Date().toISOString(), rightsConfirmedAt: new Date().toISOString() }
    await writeFile(this.filePath(draft), bytes, { flag: 'wx' })
    await this.update(draft)
    return draft
  }
  async discard(id) {
    if ((await this.published()).some((file) => file.id === id)) throw new UserError('已发布的附件请使用撤下操作。')
    const draft = await this.get(id)
    if (draft.assetId || draft.uploadAttemptedAt) throw new UserError('该附件尝试过远程上传，请使用撤下草稿操作。')
    await this.update({ ...draft, discarded: true })
  }
  async bytes(draft) {
    const file = this.filePath(draft)
    const info = await stat(file)
    if (info.size !== draft.size) throw new UserError('本地草稿文件已发生变化。')
    const data = await readFile(file)
    if (createHash('sha256').update(data).digest('hex') !== draft.sha256) throw new UserError('本地草稿校验失败。')
    return data
  }
}
