import test from "node:test";
import assert from "node:assert/strict";

import { buildMindmapHtml, extractMindmapFromMarkdown } from "./build-mindmaps-lib.mjs";

test("extractMindmapFromMarkdown returns title and mermaid code", () => {
  const markdown = `# 示例脑图

\`\`\`mermaid
mindmap
  root((Start))
    Branch
\`\`\`
`;

  const result = extractMindmapFromMarkdown(markdown);

  assert.equal(result.title, "示例脑图");
  assert.equal(
    result.mermaid,
    ["mindmap", "  root((Start))", "    Branch"].join("\n")
  );
});

test("extractMindmapFromMarkdown throws when mermaid block is missing", () => {
  assert.throws(
    () => extractMindmapFromMarkdown("# 只有标题"),
    /Missing Mermaid block/
  );
});

test("buildMindmapHtml embeds local mermaid runtime and diagram source", () => {
  const html = buildMindmapHtml({
    title: "PMP 全局总图",
    eyebrow: "Overview Map",
    description: "用来建立整体骨架。",
    mermaid: ["mindmap", "  root((PMP))", "    PMBOK 7"].join("\n"),
    backHref: "index.html",
    sourceHref: "pmp-overview.md"
  });

  assert.match(html, /<title>PMP 全局总图<\/title>/);
  assert.match(html, /class="mermaid"/);
  assert.match(html, /mindmap\n  root\(\(PMP\)\)\n    PMBOK 7/);
  assert.match(html, /\.\.\/assets\/vendor\/mermaid\.min\.js/);
  assert.match(html, /返回思维导图总入口/);
  assert.match(html, /查看 Mermaid 源文件/);
});
