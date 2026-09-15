<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { ArrowRight } from 'lucide-vue-next'
import { courses, chapterPath } from '../../courses.mjs'
const { frontmatter } = useData()
const course = computed(() => courses.find((item) => item.id === frontmatter.value.course))
</script>
<template>
  <div v-if="course" class="course-overview" :class="`accent-${course.color}`">
    <p class="eyebrow">{{ course.english }} <span>/ {{ course.chapters.length }} 个专题</span></p><h1>{{ course.title }}</h1>
    <p class="overview-description">{{ course.description }}</p><p class="overview-scope">{{ course.scope }}</p>
    <div class="chapter-list"><a v-for="(chapter, index) in course.chapters" :key="chapter.slug" :href="withBase(chapterPath(course, chapter))"><span class="chapter-number">{{ String(index + 1).padStart(2, '0') }}</span><span><strong>{{ chapter.title }}</strong><small>{{ chapter.description }}</small></span><ArrowRight :size="19" aria-hidden="true" /></a></div>
  </div>
</template>
