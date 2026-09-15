<script setup>
import DefaultTheme from 'vitepress/theme'
import { BookOpen } from 'lucide-vue-next'
import ReadingTools from './components/ReadingTools.vue'
import SiteFooter from './components/SiteFooter.vue'
const { Layout } = DefaultTheme
</script>
<template>
  <Layout>
    <template #nav-bar-title-before><BookOpen class="nav-brand-icon" :size="23" aria-hidden="true" /></template>
    <template #doc-before><ReadingTools /></template>
    <template #layout-bottom><SiteFooter /></template>
  </Layout>
</template>
