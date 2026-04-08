function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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
      <p class="section-link"><a href="${sourceHref}">查看 Mermaid 源文件</a></p>
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
