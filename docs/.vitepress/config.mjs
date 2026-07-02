import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '湘卓工学习手册',
  description: '面向湘卓工课程的复习笔记、题型模板与考前清单',
  cleanUrls: true,
  markdown: {
    math: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '课程',
        items: [
          { text: '量化工程分析', link: '/courses/quant-engineering/' },
          { text: '计算机系统', link: '/courses/computer-systems/' },
          { text: '自动控制原理', link: '/courses/automatic-control/' }
        ]
      },
      { text: '反馈', link: '/feedback' }
    ],
    sidebar: {
      '/courses/quant-engineering/': [
        {
          text: '量化工程分析',
          items: [
            { text: '课程总览', link: '/courses/quant-engineering/' },
            { text: '图论基础', link: '/courses/quant-engineering/graph-theory' },
            { text: '最优化控制方法', link: '/courses/quant-engineering/optimal-control' },
            { text: '拉格朗日力学', link: '/courses/quant-engineering/lagrange' },
            { text: '自行车与轮式机器人运动学', link: '/courses/quant-engineering/kinematics' }
          ]
        }
      ],
      '/courses/computer-systems/': [
        {
          text: '计算机系统',
          items: [
            { text: '课程总览', link: '/courses/computer-systems/' },
            { text: '期末复习总表', link: '/courses/computer-systems/exam-review' }
          ]
        }
      ],
      '/courses/automatic-control/': [
        {
          text: '自动控制原理',
          items: [
            { text: '课程总览', link: '/courses/automatic-control/' },
            { text: '现代控制高频题型', link: '/courses/automatic-control/modern-control' },
            { text: '镇定与解耦', link: '/courses/automatic-control/stabilization-decoupling' }
          ]
        }
      ],
      '/courses/template/': [
        {
          text: '课程模板',
          items: [
            { text: '课程首页模板', link: '/courses/template/' }
          ]
        }
      ]
    },
    outline: {
      label: '本页目录',
      level: [2, 3]
    },
    search: {
      provider: 'local'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },
    footer: {
      message: '资料均为搬运与课程复习整理，仅供学习交流；如有侵权或内容不当，请联系删除。',
      copyright: '贡献者：林可轩 · 邮箱：kinoja@hnu.edu.cn · 联系方式：18806567606'
    }
  },
  lastUpdated: true
})
