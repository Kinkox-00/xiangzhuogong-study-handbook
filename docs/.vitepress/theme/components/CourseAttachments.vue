<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { Download, FileText, Send } from 'lucide-vue-next'
import attachments from '../../attachments.json'
import { coursePath } from '../../courses.mjs'

const props = defineProps({ course: { type: Object, required: true } })
const files = computed(() => attachments.filter((file) => file.courseId === props.course.id))
const feedback = computed(() => withBase('/feedback') + '?type=' + encodeURIComponent('内容投稿') + '&page=' + encodeURIComponent(coursePath(props.course)) + '&title=' + encodeURIComponent(props.course.title + ' · 附件投稿'))
const sizeLabel = (size) => size >= 1048576 ? (size / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.ceil(size / 1024)) + ' KB'
</script>

<template>
  <section class="course-attachments" aria-labelledby="附件下载">
    <h2 id="附件下载">附件下载 <a class="header-anchor" href="#附件下载" aria-label="附件下载的永久链接">&#8203;</a></h2>
    <ul v-if="files.length" class="attachment-list">
      <li v-for="file in files" :key="file.id">
        <FileText :size="23" aria-hidden="true" />
        <div class="attachment-info">
          <strong>{{ file.title }}</strong>
          <p v-if="file.description">{{ file.description }}</p>
          <small>{{ file.format }} · {{ sizeLabel(file.size) }} · {{ file.publishedAt.slice(0, 10) }}</small>
        </div>
        <a class="attachment-download" :href="file.url" target="_blank" rel="noopener noreferrer" :aria-label="`下载：${file.title}`"><Download :size="17" aria-hidden="true" />下载</a>
      </li>
    </ul>
    <p v-else class="attachment-empty">暂无公开附件。</p>
    <p class="attachment-contribute"><a :href="feedback"><Send :size="14" aria-hidden="true" />投稿课程资料</a><span v-if="files.length">文件由 GitHub 提供下载。</span></p>
  </section>
</template>
