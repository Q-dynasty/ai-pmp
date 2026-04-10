function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function requireMetadata(body, key, sectionTitle) {
  const pattern = new RegExp(`^>\\s*${key}:\\s*(.+)$`, "m");
  const match = body.match(pattern);

  if (!match) {
    throw new Error(`Missing ${key} metadata in section: ${sectionTitle}`);
  }

  return match[1].trim();
}

export function extractMindmapFromMarkdown(markdown) {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const mermaidMatch = markdown.match(/```mermaid\s*([\s\S]*?)```/m);

  if (!titleMatch) {
    throw new Error("Missing title heading");
  }

  if (!mermaidMatch) {
    throw new Error("Missing Mermaid block");
  }

  return {
    title: titleMatch[1].trim(),
    mermaid: mermaidMatch[1].trim()
  };
}

export function extractMindmapPackFromMarkdown(markdown) {
  const packTitleMatch = markdown.match(/^#\s+(.+)$/m);

  if (!packTitleMatch) {
    throw new Error("Missing pack title heading");
  }

  const pages = [];
  const sections = markdown.split(/^##\s+/m).slice(1);

  for (const section of sections) {
    const lines = section.split("\n");
    const title = lines.shift()?.trim();
    const body = lines.join("\n").trim();

    if (!title) {
      throw new Error("Missing section title");
    }

    const mermaidMatch = body.match(/```mermaid\s*([\s\S]*?)```/m);

    if (!mermaidMatch) {
      throw new Error(`Missing Mermaid block in section: ${title}`);
    }

    pages.push({
      title,
      slug: requireMetadata(body, "slug", title),
      eyebrow: requireMetadata(body, "eyebrow", title),
      description: requireMetadata(body, "description", title),
      mermaid: mermaidMatch[1].trim()
    });
  }

  if (pages.length === 0) {
    throw new Error("Missing mindmap sections");
  }

  return {
    packTitle: packTitleMatch[1].trim(),
    pages
  };
}

export function buildMindmapHtml({
  title,
  eyebrow,
  description,
  mermaid,
  backHref,
  sourceHref
}) {
  const mermaidMarkup = escapeHtml(mermaid);
  const safeTitle = escapeHtml(title);
  const safeEyebrow = escapeHtml(eyebrow);
  const safeDescription = escapeHtml(description);
  const sourceLink = sourceHref
    ? `      <p class="section-link"><a href="${sourceHref}">查看 Mermaid 源文件</a></p>\n`
    : "";

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="page-shell">
    <div class="top-links">
      <a class="back-link" href="${backHref}">返回思维导图总入口</a>
      <a class="back-link secondary-link" href="../index.html">返回学习包首页</a>
    </div>

    <section class="hero-panel">
      <p class="eyebrow">${safeEyebrow}</p>
      <h1>${safeTitle}</h1>
      <p class="lead">${safeDescription}</p>
${sourceLink}      <p class="lead">直接按脑图看知识点、判断抓手、记忆口诀和视频精华，不需要来回跳文档。</p>
    </section>

    <section class="diagram-shell" aria-label="${safeTitle} Mermaid 脑图">
      <div class="diagram-meta">
        <span class="branch-chip">Mermaid Render</span>
        <span class="status-pill" data-render-status>正在渲染脑图...</span>
      </div>
      <div class="diagram-frame">
        <pre class="mermaid">${mermaidMarkup}</pre>
      </div>
    </section>

    <section class="note-panel">
      <p>这张脑图由当前目录下的 Mermaid 源文件实时生成，适合部署到 GitHub Pages 后直接在线查看。</p>
    </section>
  </main>

  <script src="../assets/vendor/mermaid.min.js"></script>
  <script>
    const statusNode = document.querySelector("[data-render-status]");
    const diagramNode = document.querySelector(".mermaid");

    const renderMindmap = async () => {
      try {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "base",
        themeVariables: {
          primaryColor: "#d8ebe5",
          primaryTextColor: "#1f2328",
          primaryBorderColor: "#1f6f5f",
          lineColor: "#174d42",
          tertiaryColor: "#fff8ec",
          fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
        }
      });

      await mermaid.run({ nodes: [diagramNode] });
      document.documentElement.classList.add("mermaid-ready");
      statusNode.textContent = "脑图渲染完成";
      } catch (error) {
      document.documentElement.classList.add("mermaid-failed");
      statusNode.textContent = "渲染失败，已保留源码";
      console.error(error);
      }
    };

    renderMindmap();
  </script>
</body>
</html>
`;
}

export function buildMindmapIndexHtml({ packTitle, pages }) {
  const cards = pages
    .map(
      (page, index) => `      <article class="branch-card">
        <span class="branch-chip">Step ${index + 1}</span>
        <h2>${escapeHtml(page.title)}</h2>
        <p>${escapeHtml(page.description)}</p>
        <p><a href="${escapeHtml(page.slug)}.html">进入脑图页面</a></p>
      </article>`
    )
    .join("\n\n");

  const order = pages
    .map(
      (page, index) =>
        `        <li>第 ${index + 1} 步看 <a href="${escapeHtml(page.slug)}.html">${escapeHtml(page.title)}</a>，${escapeHtml(page.description)}</li>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(packTitle)}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="page-shell">
    <a class="back-link" href="../index.html">返回学习包首页</a>

    <section class="hero-panel">
      <p class="eyebrow">Pure Brainmap Pack</p>
      <h1>${escapeHtml(packTitle)}</h1>
      <p class="lead">这套内容改成“纯脑图学习法”后，核心知识、记忆辅助和视频精华都被压缩进图里，适合快速看、反复刷、考前复盘。</p>
      <ol class="reading-order">
${order}
      </ol>
    </section>

    <section class="card-grid" aria-label="纯脑图学习包入口卡片">
${cards}
    </section>

    <section class="note-panel">
      <p>当前入口页由单一 Markdown 主源文件生成，维护时优先更新脑图包源文件，不需要分散改多张说明页。</p>
    </section>
  </main>
</body>
</html>
`;
}
