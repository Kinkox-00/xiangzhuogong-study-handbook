import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import CourseCatalog from './components/CourseCatalog.vue'
import CourseOverview from './components/CourseOverview.vue'
import FeedbackChannels from './components/FeedbackChannels.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('CourseCatalog', CourseCatalog)
    app.component('CourseOverview', CourseOverview)
    app.component('FeedbackChannels', FeedbackChannels)
  }
}
