<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { ChevronRight, Link, MessageSquare, ChevronsUpDown, ChevronsDownUp, Minus, Plus, ArrowUp } from 'lucide-vue-next'
import { findCourse, coursePath } from '../../courses.mjs'
const route = useRoute()
const { page, frontmatter } = useData()
const course = computed(() => findCourse('/' + page.value.relativePath))
const isArticle = computed(() => !!course.value && !frontmatter.value.course)
const size = ref(16), progress = ref(0), allOpen = ref(false), exampleCount = ref(0), status = ref(''), copyFallback = ref('')
const feedbackLink = computed(() => withBase('/feedback') + '?page=' + encodeURIComponent(route.path) + '&title=' + encodeURIComponent(page.value.title))
let observer, resizeObserver, frame, saveTimer, messageTimer
let articlePath = '', articleTitle = '', currentAnchor = ''
const details = () => [...document.querySelectorAll('.vp-doc details')]
function persist() {
  if (!articlePath) return
  try { localStorage.setItem('handbook:last-read', JSON.stringify({ path: articlePath + currentAnchor, title: articleTitle })) } catch { /* Reading remains available without storage. */ }
}
function measure() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const doc = document.querySelector('.VPDoc .vp-doc')
    if (!doc || !isArticle.value) return
    const top = doc.getBoundingClientRect().top + window.scrollY
    const distance = Math.max(1, doc.scrollHeight - window.innerHeight + 160)
    progress.value = Math.min(100, Math.max(0, Math.round((window.scrollY - top + 130) / distance * 100)))
    const headings = [...doc.querySelectorAll('h2[id], h3[id]')].filter((heading) => heading.getClientRects().length && heading.getBoundingClientRect().top < 180)
    currentAnchor = headings.length ? '#' + headings.at(-1).id : ''
    clearTimeout(saveTimer); saveTimer = setTimeout(persist, 250)
  })
}
function syncExamples() { const examples = details(); exampleCount.value = examples.length; allOpen.value = examples.length > 0 && examples.every((example) => example.open); measure() }
function toggleExamples() { const open = !allOpen.value; details().forEach((example) => { example.open = open }); syncExamples() }
function setSize(value) {
  size.value = Math.min(20, Math.max(16, value))
  document.documentElement.style.setProperty('--reading-size', size.value + 'px')
  try { localStorage.setItem('handbook:font-size', String(size.value)) } catch { /* Optional preference. */ }
  measure()
}
function revealHash() {
  if (!window.location.hash) return
  let id
  try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
  const target = document.getElementById(id)
  if (!target) return
  let parent = target.parentElement, changed = false
  while (parent) { if (parent.tagName === 'DETAILS' && !parent.open) { parent.open = true; changed = true }; parent = parent.parentElement }
  if (changed) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }))
}
function notify(text) { status.value = text; clearTimeout(messageTimer); messageTimer = setTimeout(() => { status.value = '' }, 3000) }
async function copySection() {
  const url = new URL(window.location.href)
  url.hash = currentAnchor
  try { await navigator.clipboard.writeText(url.href); copyFallback.value = ''; notify('章节链接已复制') }
  catch { copyFallback.value = url.href; notify('请选中下方链接复制') }
}
async function bindPage() {
  persist(); observer?.disconnect(); resizeObserver?.disconnect()
  await nextTick()
  articlePath = isArticle.value ? route.path : ''; articleTitle = page.value.title; currentAnchor = ''; progress.value = 0; copyFallback.value = ''; status.value = ''
  const doc = document.querySelector('.VPDoc .vp-doc')
  if (!doc) return
  observer = new MutationObserver(syncExamples)
  observer.observe(doc, { subtree: true, attributes: true, attributeFilter: ['open'] })
  resizeObserver = new ResizeObserver(measure); resizeObserver.observe(doc)
  revealHash(); syncExamples()
}
onMounted(() => {
  try { const saved = Number(localStorage.getItem('handbook:font-size')); if ([16, 18, 20].includes(saved)) setSize(saved) } catch { /* Use default. */ }
  bindPage()
  window.addEventListener('scroll', measure, { passive: true }); window.addEventListener('resize', measure); window.addEventListener('hashchange', revealHash); window.addEventListener('pagehide', persist)
})
watch(() => route.path, bindPage, { flush: 'post' })
onBeforeUnmount(() => {
  persist(); observer?.disconnect(); resizeObserver?.disconnect(); cancelAnimationFrame(frame); clearTimeout(saveTimer); clearTimeout(messageTimer)
  window.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); window.removeEventListener('hashchange', revealHash); window.removeEventListener('pagehide', persist)
})
function backToTop() { window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }) }
</script>
<template>
  <nav class="doc-breadcrumb" aria-label="当前位置"><a :href="withBase('/')">课程目录</a><template v-if="course"><ChevronRight :size="13" /><a v-if="isArticle" :href="withBase(coursePath(course))">{{ course.title }}</a><span v-else>{{ course.title }}</span></template><template v-if="!course"><ChevronRight :size="13" /><span>{{ page.title }}</span></template></nav>
  <div v-if="isArticle" class="reading-tools">
    <div class="reading-toolbar" role="group" aria-label="阅读工具"><span class="reading-label">学习笔记 <span>{{ progress }}%</span></span><div class="reading-actions">
      <button class="icon-button" aria-label="缩小字号" title="缩小字号" :disabled="size <= 16" @click="setSize(size - 2)"><Minus :size="16" /></button><span class="font-size-label" aria-live="polite">{{ size }}</span><button class="icon-button" aria-label="放大字号" title="放大字号" :disabled="size >= 20" @click="setSize(size + 2)"><Plus :size="16" /></button><span class="tool-divider"></span>
      <button v-if="exampleCount" class="icon-button" :title="allOpen ? '收起全部例题' : '展开全部例题'" :aria-label="allOpen ? '收起全部例题' : '展开全部例题'" :aria-pressed="allOpen" @click="toggleExamples"><ChevronsDownUp v-if="allOpen" :size="18" /><ChevronsUpDown v-else :size="18" /></button>
      <button class="icon-button" title="复制当前章节链接" aria-label="复制当前章节链接" @click="copySection"><Link :size="17" /></button><a class="icon-button" :href="feedbackLink" title="反馈本页问题" aria-label="反馈本页问题"><MessageSquare :size="17" /></a>
    </div></div>
    <div class="reading-progress" role="progressbar" aria-label="阅读位置" :aria-valuenow="progress" :aria-valuemin="0" :aria-valuemax="100"><span :style="{ width: progress + '%' }"></span></div>
    <p v-if="status" class="tool-status" role="status">{{ status }}</p><input v-if="copyFallback" class="copy-fallback" aria-label="章节链接" :value="copyFallback" readonly @focus="$event.target.select()" />
    <button v-if="progress > 5" class="back-to-top icon-button" title="回到顶部" aria-label="回到顶部" @click="backToTop"><ArrowUp :size="20" /></button>
  </div>
</template>
