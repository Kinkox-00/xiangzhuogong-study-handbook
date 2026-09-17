<script setup>
import { withBase } from 'vitepress'
import { BookOpen, ArrowUpRight } from 'lucide-vue-next'
import { repository } from '../../courses.mjs'
</script>
<template>
  <footer class="site-footer"><div class="footer-inner">
    <div class="footer-top"><a class="footer-brand" :href="withBase('/')"><BookOpen :size="20" aria-hidden="true" />湘卓工学习手册</a><nav aria-label="页脚导航"><a :href="withBase('/about')">关于手册</a><a :href="withBase('/feedback')">反馈与联系</a><a :href="repository" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight :size="14" aria-hidden="true" /></a></nav></div>
    <p>资料均为搬运与课程复习整理，仅供学习交流；如有侵权或内容不当，请联系删除。</p>
    <div class="footer-bottom"><span>贡献者：24级林可轩、25级笪智杰</span><a href="mailto:kinoja@hnu.edu.cn">kinoja@hnu.edu.cn</a><a href="tel:18806567606">18806567606</a><span class="footer-note">与同学分享，也与同学一起完善。</span></div>
  </div></footer>
</template>
