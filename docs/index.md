---
layout: home

hero:
  name: 湘卓工学习手册
  text: 用 Markdown 维护的课程复习站
  tagline: 面向期末复习、题型梳理、公式模板和自测讲解。
  actions:
    - theme: brand
      text: 进入量化工程分析
      link: /courses/quant-engineering/
    - theme: alt
      text: 查看全部课程
      link: "#当前课程"

features:
  - title: Markdown 维护
    details: 新增知识点时直接写标题和正文，适合多人持续补充。
  - title: LaTeX 公式
    details: 使用 MathJax 渲染积分、偏导、矩阵、分段函数和 Riccati 方程。
  - title: 静态部署
    details: 构建后是静态网页，可部署到 GitHub Pages、Netlify 或学校服务器。
---

## 当前课程

<div class="course-grid">
  <div class="course-card">
    <h3>量化工程分析</h3>
    <p>图论、动态系统最优化控制方法、拉格朗日力学、自行车与轮式机器人运动学。</p>
    <a href="/courses/quant-engineering/">打开课程</a>
  </div>
  <div class="course-card">
    <h3>计算机系统</h3>
    <p>计算机组成、数据表示、指令系统、存储层次、操作系统接口等内容入口。</p>
    <a href="/courses/computer-systems/">打开课程</a>
  </div>
  <div class="course-card">
    <h3>自动控制原理</h3>
    <p>经典控制、现代控制、状态空间、稳定性、能控能观与控制系统设计入口。</p>
    <a href="/courses/automatic-control/">打开课程</a>
  </div>
</div>

发现错误、缺漏，或者想投稿更好的讲解与例题，可以前往 [反馈与联系](/feedback)。

## 内容维护约定

- 每门课程放在 `docs/courses/课程名/` 目录下。
- 每个大章节用一个 Markdown 文件维护。
- 标题会自动生成本页目录和锚点。
- 公式优先写成块级公式，阅读体验更稳定。
