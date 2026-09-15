<script setup>
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { ArrowRight, Search, X, BookOpen, ChevronRight, History, Github, MessageSquare } from 'lucide-vue-next'
import { courses, repository, coursePath, chapterPath } from '../../courses.mjs'

const query = ref('')
const category = ref('全部课程')
const categories = ['全部课程', ...new Set(courses.map((course) => course.category))]
const lastRead = ref(null)
const matches = computed(() => courses.filter((course) => {
  const text = [course.title, course.description, course.scope, ...course.chapters.flatMap((chapter) => [chapter.title, chapter.description, chapter.keywords])].join(' ').toLowerCase()
  return (category.value === '全部课程' || category.value === course.category) && query.value.trim().toLowerCase().split(/\s+/).every((word) => text.includes(word))
}))
const chapterCount = courses.reduce((count, course) => count + course.chapters.length, 0)
const entries = [
  { course: courses[0], chapter: courses[0].chapters[0], name: '图与矩阵', subtitle: '把连接关系写进矩阵' },
  { course: courses[0], chapter: courses[0].chapters[1], name: '变分与最优控制', subtitle: '从目标函数开始推导' },
  { course: courses[1], chapter: courses[1].chapters[0], name: '虚拟内存与 Cache', subtitle: '串起地址翻译的每一步', hash: '#虚拟内存与-cache' },
  { course: courses[2], chapter: courses[2].chapters[0], name: '状态空间求解', subtitle: '从系统方程到状态响应', hash: '#状态空间求解' }
]

function reset() { query.value = ''; category.value = '全部课程' }
function clearHistory() {
  lastRead.value = null
  try { localStorage.removeItem('handbook:last-read') } catch { /* Storage may be disabled. */ }
}
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('handbook:last-read') || 'null')
    if (saved && courses.some((course) => course.chapters.some((chapter) => saved.path?.split('#')[0] === withBase(chapterPath(course, chapter))))) lastRead.value = saved
  } catch { lastRead.value = null }
})
</script>

<template>
  <main class="catalog" id="main-content">
    <header class="catalog-intro">
      <div>
        <p class="eyebrow"><span class="edition-mark"></span>开放课程笔记 <span class="eyebrow-divider">/</span> 学习 · 梳理 · 分享</p>
        <h1>湘卓工学习手册<span class="title-period">.</span></h1>
        <p class="catalog-description">让零散的知识，成为有迹可循的学习路径。</p>
        <p class="catalog-subtitle">课程笔记、解题方法与例题解析，与你一起持续补全。</p>
      </div>
      <dl class="catalog-stats">
        <div><dt>收录课程</dt><dd>{{ String(courses.length).padStart(2, '0') }}</dd></div>
        <div><dt>学习专题</dt><dd>{{ String(chapterCount).padStart(2, '0') }}</dd></div>
      </dl>
    </header>
    <div v-if="lastRead" class="resume-reading">
      <History :size="18" aria-hidden="true" /><span>上次读到</span>
      <a :href="lastRead.path">{{ lastRead.title }} <ArrowRight :size="16" aria-hidden="true" /></a>
      <button class="icon-button" aria-label="清除上次阅读记录" title="清除阅读记录" @click="clearHistory"><X :size="17" /></button>
    </div>
    <section class="catalog-section" aria-labelledby="courses-title">
      <div class="section-heading">
        <div class="section-title"><BookOpen :size="21" aria-hidden="true" /><h2 id="courses-title">课程目录</h2></div>
        <label class="catalog-search"><Search :size="18" aria-hidden="true" /><span class="sr-only">筛选课程或知识点</span><input v-model="query" type="search" placeholder="查找课程或知识点" /><button v-if="query" class="icon-button" title="清除筛选" aria-label="清除筛选" @click="query = ''"><X :size="16" /></button></label>
      </div>
      <div class="catalog-filters" role="group" aria-label="课程分类">
        <button v-for="item in categories" :key="item" :aria-pressed="category === item" :class="{ active: category === item }" @click="category = item">{{ item }}<span v-if="item === '全部课程'">{{ courses.length }}</span></button>
        <span class="result-count" aria-live="polite">{{ matches.length }} 门课程</span>
      </div>
      <div v-if="matches.length" class="catalog-grid">
        <article v-for="course in matches" :key="course.id" class="catalog-card" :class="`accent-${course.color}`">
          <a :href="withBase(coursePath(course))" class="course-art" :aria-label="`进入${course.title}`"><span class="art-caption">{{ course.number }} <span>{{ course.english }}</span></span><img :src="withBase(course.image)" :alt="course.imageAlt" width="720" height="300" /></a>
          <div class="course-card-body">
            <div class="course-category">{{ course.category }}<span>{{ course.chapters.length }} 个专题</span></div>
            <h3><a :href="withBase(coursePath(course))">{{ course.title }}</a></h3>
            <p class="course-description">{{ course.description }}</p><p class="course-scope">{{ course.scope }}</p>
            <details class="course-chapters" :open="query.trim() ? true : undefined"><summary>课程目录 <ChevronRight :size="16" aria-hidden="true" /></summary><ul><li v-for="chapter in course.chapters" :key="chapter.slug"><a :href="withBase(chapterPath(course, chapter))">{{ chapter.title }}<ArrowRight :size="15" aria-hidden="true" /></a></li></ul></details>
            <a class="course-enter" :href="withBase(coursePath(course))">进入课程<ArrowRight :size="18" aria-hidden="true" /></a>
          </div>
        </article>
      </div>
      <div v-else class="empty-results" role="status"><Search :size="28" aria-hidden="true" /><h3>暂时没有匹配的课程</h3><p>试试“图论”“Cache”或“控制”，也可以查看全部课程。</p><button class="text-button" @click="reset">重置筛选 <ArrowRight :size="16" /></button></div>
    </section>
    <section class="topic-section" aria-labelledby="topics-title">
      <div class="section-heading"><h2 id="topics-title">从一个知识点开始</h2><span class="section-note">概念 → 方法 → 例题</span></div>
      <div class="topic-links"><a v-for="entry in entries" :key="entry.name" :href="withBase(chapterPath(entry.course, entry.chapter) + (entry.hash || ''))"><span class="topic-course">{{ entry.course.title }}</span><strong>{{ entry.name }}</strong><span class="topic-description">{{ entry.subtitle }}</span><ArrowRight :size="19" aria-hidden="true" /></a></div>
    </section>
    <section class="contribute-band">
      <div><span class="eyebrow">由学习者共同整理</span><h2>一份笔记，也可以帮助下一位同学。</h2><p>发现一处错误，补上一段推导，分享一种更清楚的解法。</p></div>
      <div class="contribute-actions"><a class="primary-link" :href="withBase('/feedback')"><MessageSquare :size="17" aria-hidden="true" />反馈与投稿</a><a class="secondary-link" :href="repository" target="_blank" rel="noopener noreferrer"><Github :size="17" aria-hidden="true" />GitHub<ArrowRight :size="15" aria-hidden="true" /></a></div>
    </section>
  </main>
</template>
