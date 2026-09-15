import { defineConfig } from 'vitepress'
import { courses, coursePath, chapterPath, repository, siteUrl } from './courses.mjs'

export default defineConfig({
  lang: 'zh-CN',
  title: '湘卓工学习手册',
  description: '开放共享的工程课程笔记、知识梳理、解题方法与例题解析。',
  cleanUrls: true,
  scrollOffset: 150,
  head: [
    ['meta', { name: 'theme-color', content: '#187b63' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/images/favicon.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: '湘卓工学习手册' }],
    ['meta', { property: 'og:image', content: siteUrl + '/images/social.png' }]
  ],
  sitemap: { hostname: siteUrl, transformItems: (items) => items.filter((item) => !item.url.includes('/template/')) },
  transformPageData(pageData) {
    const path = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: siteUrl + '/' + path }],
      ['meta', { property: 'og:title', content: pageData.title + ' | 湘卓工学习手册' }],
      ['meta', { property: 'og:description', content: pageData.description || '课程笔记、解题方法与例题解析，由学习者共同整理。' }],
      ['meta', { property: 'og:url', content: siteUrl + '/' + path }]
    )
  },
  markdown: { math: true, theme: { light: 'github-light', dark: 'github-dark' } },
  themeConfig: {
    nav: [
      { text: '课程目录', link: '/', activeMatch: '^/$' },
      { text: '课程', items: courses.map((course) => ({ text: course.title, link: coursePath(course) })) },
      { text: '关于手册', link: '/about' },
      { text: '反馈与投稿', link: '/feedback' }
    ],
    sidebar: Object.fromEntries(courses.map((course) => [coursePath(course), [{
      text: course.title,
      items: [{ text: '课程概览', link: coursePath(course) }, ...course.chapters.map((chapter) => ({ text: chapter.title, link: chapterPath(course, chapter) }))]
    }]])),
    socialLinks: [{ icon: 'github', link: repository, ariaLabel: 'GitHub 代码与内容仓库' }],
    outline: { label: '本页目录', level: 2 },
    sidebarMenuLabel: '课程目录',
    returnToTopLabel: '回到顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到正文',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索笔记', buttonAriaLabel: '搜索全部课程笔记' },
          modal: {
            displayDetails: '显示详细内容', resetButtonTitle: '清除搜索', backButtonTitle: '关闭搜索', noResultsText: '没有找到相关笔记',
            footer: { selectText: '打开', selectKeyAriaLabel: '回车', navigateText: '切换', navigateUpKeyAriaLabel: '向上', navigateDownKeyAriaLabel: '向下', closeText: '关闭', closeKeyAriaLabel: '退出' }
          }
        },
        miniSearch: {
          // Chinese bigrams support partial terms without a remote search service.
          options: { tokenize: (text) => (text.toLowerCase().match(/[a-z0-9_]+|[\u3400-\u9fff]+/g) || []).flatMap((part) => /^[\u3400-\u9fff]+$/.test(part) && part.length > 1 ? [...part].slice(0, -1).map((char, index) => char + part[index + 1]) : [part]) },
          searchOptions: { combineWith: 'AND', fuzzy: false, prefix: true, boost: { title: 4, text: 2, titles: 1 } }
        }
      }
    },
    editLink: { pattern: repository + '/edit/main/docs/:path', text: '在 GitHub 上改进本页' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最近更新', formatOptions: { dateStyle: 'medium' } },
    notFound: { code: '404', title: '这页笔记还没有找到', quote: '页面可能已移动，可以回到课程目录继续学习。', linkLabel: '返回课程目录', linkText: '返回课程目录' }
  },
  lastUpdated: true
})
