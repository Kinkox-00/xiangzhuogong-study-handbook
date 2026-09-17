<script setup>
import { computed, onMounted, ref } from 'vue'
import { Copy, Check, Mail, Github, ExternalLink } from 'lucide-vue-next'
import { repository } from '../../courses.mjs'
const type = ref('错误反馈'), page = ref(''), title = ref(''), copied = ref(false), fallback = ref(false)
const template = computed(() => `课程名称：\n页面链接或章节名称：${title.value}${page.value ? '\n' + page.value : ''}\n问题类型：${type.value}\n具体说明：\n建议修改内容：\n资料来源（如有）：\n可选署名：`)
const subject = computed(() => `湘卓工学习手册 · ${type.value}${title.value ? ' · ' + title.value : ''}`)
const mailto = computed(() => `mailto:kinoja@hnu.edu.cn?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(template.value)}`)
const issue = computed(() => `${repository}/issues/new?title=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(template.value)}`)
onMounted(() => {
  const params = new URLSearchParams(location.search); title.value = params.get('title') || ''
  if (['错误反馈', '缺漏补充', '内容投稿', '侵权与删除请求'].includes(params.get('type'))) type.value = params.get('type')
  const path = params.get('page') || ''
  if (path.startsWith('/courses/') && !path.startsWith('//')) page.value = new URL(path, location.origin).href
})
async function copy() {
  try { await navigator.clipboard.writeText(template.value); copied.value = true; fallback.value = false }
  catch { fallback.value = true }
}
</script>
<template>
  <div class="feedback-channels">
    <label class="feedback-type">反馈类型<select v-model="type" @change="copied = false"><option>错误反馈</option><option>缺漏补充</option><option>内容投稿</option><option>侵权与删除请求</option></select></label>
    <p v-if="title" class="feedback-context">相关页面：{{ title }}</p>
    <div class="feedback-options"><a :href="mailto"><Mail :size="23" aria-hidden="true" /><strong>邮件联系</strong><span>适合发送截图、资料与删除请求。</span><small>kinoja@hnu.edu.cn <ExternalLink :size="14" /></small></a><a :href="issue" target="_blank" rel="noopener noreferrer"><Github :size="23" aria-hidden="true" /><strong>GitHub Issue</strong><span>公开讨论问题，跟进修改进展。</span><small>提交问题 <ExternalLink :size="14" /></small></a></div>
    <div class="submission-template"><div><strong>反馈与投稿模板</strong><button class="icon-button" :title="copied ? '已复制' : '复制投稿模板'" :aria-label="copied ? '已复制' : '复制投稿模板'" @click="copy"><Check v-if="copied" :size="18" /><Copy v-else :size="18" /></button></div><pre>{{ template }}</pre><p v-if="copied" role="status">模板已复制。</p><label v-if="fallback">自动复制不可用，请选中模板复制。<textarea readonly :value="template" @focus="$event.target.select()" /></label></div>
  </div>
</template>
