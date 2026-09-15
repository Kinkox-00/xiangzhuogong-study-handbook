# 湘卓工学习手册

开放共享的工程课程学习资料，收录量化工程分析、计算机系统和自动控制原理。

- 网站：https://quant-engineering-review-kinoja.netlify.app
- 反馈：kinoja@hnu.edu.cn
- 贡献者：林可轩

## 本地运行

使用 Node.js 20.19 或兼容版本，执行 `npm ci`，然后执行 `npm run dev`。
`npm run build` 生成静态网站，`npm run preview` 预览构建结果。

## 增加与维护课程

1. 在 `docs/courses/` 中建立课程目录，每个专题使用一个 Markdown 文件。
2. 在 `docs/.vitepress/courses.mjs` 登记课程名称、介绍及章节；首页、顶部菜单、侧栏与课程概览共同使用这份数据。
3. 课程首页 frontmatter 设置 `title`、`description` 和 `course`（与登记的 id 相同），正文加入 `<CourseOverview />`。
4. 知识点使用二级、三级标题。例题使用 `::: details 例题名称` 折叠块。
5. 行内公式使用单个美元符号，独立公式使用双美元符号。表格公式中的竖线请用 `\lvert`、`\rvert` 等 LaTeX 命令。
6. 提交前运行 `npm test` 检查课程目录与文件，再运行 `npm run build` 构建。推送到 GitHub 的 `main` 后，Netlify 自动部署。

首页课程示意图位于 `docs/public/images/`，公共说明位于 `docs/about.md`，反馈入口位于 `docs/feedback.md`。

## 贡献说明

欢迎通过 Issue 提交问题，或通过 Pull Request 改进笔记。请说明修改理由、出处与适用条件；数学内容应核对公式、推导与边界条件。删除或更名页面时，注意保持旧链接可访问。

本站课程材料为搬运与复习整理，仅供学习交流；第三方材料的权利归原权利人所有。如有侵权或内容不当，请联系删除。
