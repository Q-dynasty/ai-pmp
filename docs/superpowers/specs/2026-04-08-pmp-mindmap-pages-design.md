# PMP 脑图渲染与 GitHub Pages 托管设计

## 背景

现有 `pmp-learning/` 已经具备本地学习首页、Markdown 知识库和脑图源码，但脑图浏览页仍是人工整理的结构卡片，并不是真正由 Mermaid 渲染生成。

用户的新目标有两个：

- 在线文档需要真正支持思维导图渲染
- 整套资料需要适合放到 GitHub Pages 上稳定托管

## 设计选择

本次采用“纯静态站点 + 本地 Mermaid 资源 + GitHub Pages 工作流”的方案。

原因如下：

- 站点仍然是纯 HTML/CSS/JS，适合 GitHub Pages 直接托管
- Mermaid 不走第三方 CDN，而是随站点一起发布，减少外部依赖带来的不稳定
- 脑图源码继续保留为 Markdown Mermaid，便于后续维护
- 通过构建脚本从源码生成浏览页，避免手工维护脑图页面和源码之间的偏差

## 目标结果

实现完成后，交付应满足以下条件：

- `pmp-learning/mindmaps/*.html` 页面使用 Mermaid 实际渲染脑图
- Mermaid 浏览页依然保留原有暖色阅读风格，并支持移动端
- 本地构建时会把 Mermaid 浏览器运行文件复制到站点资源目录
- GitHub Pages 可通过工作流直接发布 `pmp-learning/` 为在线文档站点
- 仓库中包含最少必要的说明文件，帮助用户在 GitHub 上启用 Pages

## 结构设计

### 1. 脑图源码层

继续以以下 Markdown 文件作为脑图“单一事实来源”：

- `pmp-learning/mindmaps/pmp-overview.md`
- `pmp-learning/mindmaps/pmbok6-exam-map.md`
- `pmp-learning/mindmaps/sprint-review-map.md`

### 2. 构建层

新增 Node 构建脚本，负责：

- 读取 Markdown 文件
- 提取标题和 Mermaid 代码块
- 生成对应 HTML 脑图页
- 复制 Mermaid ESM 文件到站点资源目录

### 3. 站点层

站点继续以 `pmp-learning/` 作为发布根目录，并补齐：

- Mermaid 运行依赖的本地资源
- GitHub Pages 友好的 `404.html`
- 部署说明和工作流

## 验证策略

实现后至少要验证：

- Node 单元测试通过
- 构建脚本能成功生成脑图页
- 结构校验脚本覆盖新增文件和关键标记
- 脑图页 HTML 中确实包含 Mermaid 渲染容器和本地 Mermaid 入口
