# 湘卓工学习手册

开放共享的工程课程学习资料，收录量化工程分析、计算机系统和自动控制原理，并预留数理综合（一）、数理综合（二）课程入口。

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

尚未填充的课程可将 `chapters` 保持为空数组，网站会显示“待补充”，且不会计入学习专题数。数理综合（一）、（二）的内容目录分别为 `docs/courses/math-physics-1/`、`docs/courses/math-physics-2/`。

## 课程附件

在项目目录双击 `附件管理.cmd`，或运行 `npm run attachments`，然后打开终端显示的本机地址（默认 `http://127.0.0.1:5174`）。这是仅供维护者使用的本机管理页，不会部署到公网。

1. 选择课程、文件及附件名称，确认有公开分发权后点击“保存草稿”。草稿只在本机 `.attachments/` 下，已从 Git 中排除。
2. 检查草稿，点击“公开发布”并确认。文件会上传到本站 GitHub 仓库的 `course-attachments` Release，下载目录提交到 `main`，随后 Netlify 自动更新网站。GitHub 文件在网站部署前就已公开。
3. 各课程首页与侧栏均有“附件下载”入口。访客无需登录即可下载；投稿仍通过反馈页收集，不开放匿名上传。
4. “撤下”会更新网站目录并删除 GitHub 上对应的附件。本机备份保留；已被他人下载的文件无法收回。

单个附件上限为 100 MB，支持 PDF、Office 文档、文本、CSV、ZIP、PNG 和 JPEG。文件不放入 Git 仓库，避免大文件拖慢网站。GitHub 的可访问性会影响下载速度。系统做类型与完整性检查，但不提供病毒扫描。

发布前需在 VS Code 或 Git 中完成 GitHub 登录，并保持本站 `main` 分支已提交且与远程同步。管理服务复用 Git Credential Manager，凭据不会写入文件、发送到浏览器或部署到网站。若同步失败，按提示处理后点“重试同步”；不要删除 `.attachments/operation.json`。同一项目只运行一个管理服务。

本功能未收录任何教材原文。确认框只记录维护者的确认，不代替版权授权。不要公开分发没有授权的完整教材；优先发布原创笔记或取得许可的资料。

## 参与贡献

欢迎通过 Issue 提交问题，或通过 Pull Request 改进笔记。请说明修改理由、出处与适用条件；数学内容应核对公式、推导与边界条件。删除或更名页面时，注意保持旧链接可访问。

本站课程材料为搬运与复习整理，仅供学习交流；第三方材料的权利归原权利人所有。如有侵权或内容不当，请联系删除。
