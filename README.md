# PMP 在线学习文档

这是一个适合零基础快速备考 PMP 的静态学习站点，包含：

- 30 天学习路径
- PMBOK 7 与 PMBOK 6 双主线资料
- B 站视频精选与摘要
- 高频考点、口诀与记忆卡
- 3 张可在线渲染的 Mermaid 思维导图

## 本地使用

推荐使用 Node 20 及以上版本。

1. 安装依赖：`npm install`
2. 构建脑图页：`npm run build`
3. 执行整体验证：`npm run verify`
4. 本地预览：`python3 -m http.server 4173 -d pmp-learning`

然后访问：

- `http://localhost:4173`

## GitHub Pages 部署

仓库已经包含 GitHub Pages 工作流：`.github/workflows/deploy-pages.yml`

你只需要：

1. 把当前目录初始化为 Git 仓库并推送到 GitHub
2. 保持默认分支为 `main` 或 `master`
3. 在 GitHub 仓库的 Pages 设置里选择 `GitHub Actions` 作为部署来源
4. 推送后等待 Actions 执行完成

工作流会自动：

- 安装依赖
- 构建 Mermaid 脑图页
- 校验站点结构
- 将 `pmp-learning/` 发布为 GitHub Pages 站点

## Git 仓库建议

- 推荐只提交站点与脚本，不提交本地教材 PDF
- 当前项目已默认忽略 `*.pdf`、`node_modules/` 和本地 `.superpowers/` 目录
- 如果后续需要单独管理教材，请使用私有云盘或私有仓库

## 站点入口

- 首页：`pmp-learning/index.html`
- Markdown 总览：`pmp-learning/00-学习总览.md`
- 脑图总入口：`pmp-learning/mindmaps/index.html`
