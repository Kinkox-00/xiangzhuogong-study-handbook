const $ = (selector) => document.querySelector(selector)
const token = $('meta[name="attachment-session"]').content
let state, working = false
const sizeLabel = (bytes) => bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.ceil(bytes / 1024)) + ' KB'

function notice(message, error = false) {
  $('#notice').textContent = message
  $('#notice').classList.toggle('error', error)
  $('#notice').setAttribute('role', error ? 'alert' : 'status')
}
async function api(path, method = 'GET') {
  const response = await fetch(path, { method, headers: { Authorization: 'Bearer ' + token } })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || '请求失败，请重试。')
  return data
}
function icon(name) { const image = document.createElement('img'); image.src = `/icons/${name}.svg`; image.alt = ''; return image }
function confirmAction(message, label) {
  const dialog = $('#confirm-dialog')
  $('#confirm-message').textContent = message
  $('#confirm-accept').textContent = label
  dialog.returnValue = ''
  return new Promise((resolve) => { dialog.addEventListener('close', () => resolve(dialog.returnValue === 'accept'), { once: true }); dialog.showModal() })
}
function button(label, iconName, handler, iconOnly = false) {
  const node = document.createElement('button'); node.type = 'button'; node.title = label; node.setAttribute('aria-label', label)
  node.append(icon(iconName)); if (!iconOnly) node.append(document.createTextNode(label)); else node.className = 'icon-button'
  node.disabled = working; node.addEventListener('click', handler); return node
}
async function operation(message, task) {
  working = true; setBusy(); notice(message)
  try { const result = await task(); notice(result?.message || '已完成。') }
  catch (error) { notice(error.message || '无法连接管理服务，请确认服务仍在运行。', true) }
  finally { working = false; try { await refresh() } catch { notice('无法连接管理服务，请重新启动附件管理。', true) }; setBusy() }
}
function setBusy() {
  $('#upload-fields').disabled = working || !state
  document.querySelectorAll('button').forEach((node) => { node.disabled = working || (node.dataset.publish === 'true' && Boolean(state?.pending)) })
}
async function preview(file) {
  await operation('正在读取本机文件…', async () => {
    const response = await fetch(`/api/drafts/${file.id}/download`, { headers: { Authorization: 'Bearer ' + token } })
    if (!response.ok) throw new Error((await response.json()).error)
    const url = URL.createObjectURL(await response.blob())
    const link = document.createElement('a'); link.href = url; link.download = file.fileName; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 60000)
    return { message: '已下载本机草稿。' }
  })
}
function fileRow(file, published) {
  const row = document.createElement('li')
  const fileIcon = icon('file'); fileIcon.className = 'file-icon'; row.append(fileIcon)
  const info = document.createElement('div'); info.className = 'file-info'
  const title = document.createElement('strong'); title.textContent = file.title; info.append(title)
  const meta = document.createElement('p'); meta.textContent = `${state.courses.find((course) => course.id === file.courseId)?.title || file.courseId} · ${file.format || file.extension.toUpperCase()} · ${sizeLabel(file.size)}`; info.append(meta)
  if (file.description) { const description = document.createElement('p'); description.textContent = file.description; info.append(description) }
  if (!published) { const status = document.createElement('p'); status.className = 'file-status'; status.textContent = file.assetId ? '文件已上传 GitHub，网站目录尚未发布' : file.uploadAttemptedAt ? '曾尝试远程上传，请重试发布或撤下草稿以核对状态' : '仅保存在本机'; info.append(status) }
  const actions = document.createElement('div'); actions.className = 'file-actions'
  if (published) {
    const download = document.createElement('a'); download.className = 'button icon-button'; download.href = file.url; download.target = '_blank'; download.rel = 'noopener noreferrer'; download.title = '下载 ' + file.title; download.setAttribute('aria-label', download.title); download.append(icon('download')); actions.append(download)
    actions.append(button('撤下 ' + file.title, 'trash', async () => {
      if (await confirmAction(`撤下“${file.title}”？\n\n将删除 GitHub 上的公开附件并更新网站。本机草稿备份会保留。`, '确认撤下')) operation('正在撤下附件…', () => api(`/api/attachments/${file.id}/remove`, 'POST'))
    }, true))
  } else {
    actions.append(button('下载草稿 ' + file.title, 'download', () => preview(file), true))
    const publish = button(file.uploadAttemptedAt ? '重试发布' : '公开发布', 'send', async () => {
      if (await confirmAction(`公开发布“${file.title}”？\n\n文件将上传至公开的 GitHub 附件区，任何人都可下载，并触发网站更新。请确认你拥有公开分发的权利。`, '确认公开发布')) operation('正在上传并同步网站，请保持管理服务运行…', () => api(`/api/drafts/${file.id}/publish`, 'POST'))
    }); publish.dataset.publish = 'true'; publish.disabled = working || Boolean(state.pending); actions.append(publish)
    const remote = file.assetId || file.uploadAttemptedAt
    actions.append(button((remote ? '撤下草稿 ' : '移除草稿 ') + file.title, 'trash', async () => {
      if (await confirmAction(`移除“${file.title}”？${remote ? '同时撤下该草稿已经上传的 GitHub 附件。' : ''}本机备份仍会保留。`, remote ? '撤下草稿' : '移除草稿')) operation('正在移除草稿…', () => api(`/api/drafts/${file.id}${remote ? '/withdraw' : ''}`, remote ? 'POST' : 'DELETE'))
    }, true))
  }
  row.append(info, actions); return row
}
async function refresh() {
  state = await api('/api/state')
  const selected = $('#course').value
  $('#course').replaceChildren(...state.courses.map((course) => new Option(course.title, course.id)))
  if (selected) $('#course').value = selected
  $('#file').accept = state.extensions.map((extension) => '.' + extension).join(',')
  for (const key of ['drafts', 'published']) {
    $('#' + key).replaceChildren(...state[key].map((file) => fileRow(file, key === 'published')))
    $('#' + (key === 'drafts' ? 'draft' : 'published') + '-count').textContent = state[key].length
    $('#' + (key === 'drafts' ? 'draft' : 'published') + '-empty').hidden = Boolean(state[key].length)
  }
  $('#pending').hidden = !state.pending
  if (state.pending) $('#pending-text').textContent = `${state.pending.title}：${state.pending.phase === 'cleanup' ? '网站已同步，远程文件清理待完成。' : '同步中断，草稿与操作记录已保留。'}`
  setBusy()
}
$('#file').addEventListener('change', () => {
  const file = $('#file').files[0]
  $('#file-info').textContent = file ? file.name + ' · ' + sizeLabel(file.size) : '单个文件不超过 100 MB'
  if (file && !$('#title').value) $('#title').value = file.name.replace(/\.[^.]+$/, '').slice(0, 120)
})
$('#upload-form').addEventListener('submit', (event) => {
  event.preventDefault()
  const file = $('#file').files[0]
  if (!file || file.size <= 0 || file.size > state.maxFileSize) return notice('请选择大于 0 字节且不超过 100 MB 的文件。', true)
  const form = new FormData(event.currentTarget); form.set('rightsConfirmed', String($('#rights').checked))
  operation('正在保存到本机…', () => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest(); request.open('POST', '/api/drafts'); request.setRequestHeader('Authorization', 'Bearer ' + token); request.timeout = 360000
    $('#upload-progress').hidden = false; $('#upload-progress').value = 0
    request.upload.onprogress = (event) => { if (event.lengthComputable) { const percent = Math.round(event.loaded / event.total * 100); $('#upload-progress').value = percent; $('#progress-label').textContent = percent + '%' } }
    request.onload = () => {
      let result
      try { result = JSON.parse(request.responseText) } catch { return reject(new Error('管理服务返回异常，请刷新后重试。')) }
      if (request.status >= 200 && request.status < 300) { const course = $('#course').value; $('#upload-form').reset(); $('#course').value = course; $('#file-info').textContent = '单个文件不超过 100 MB'; resolve(result) }
      else reject(new Error(result.error || '保存失败。'))
    }
    request.onerror = request.ontimeout = () => reject(new Error('保存中断，请检查管理服务后重试。'))
    request.onloadend = () => { $('#upload-progress').hidden = true; $('#progress-label').textContent = '' }
    request.send(form)
  }))
})
$('#retry').addEventListener('click', () => operation('正在继续上一次同步…', () => api('/api/retry', 'POST')))
refresh().then(() => notice('')).catch((error) => notice(error.message, true))
