import test from "node:test";
import assert from "node:assert/strict";

import {
  buildMindmapHtml,
  extractMindmapFromMarkdown,
  extractMindmapPackFromMarkdown
} from "./build-mindmaps-lib.mjs";

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

test("extractMindmapPackFromMarkdown returns multiple page definitions from one source", () => {
  const markdown = `# PMP 纯脑图学习包

## 总脑图
> slug: master-map
> eyebrow: Master Map
> description: 先看总图再分支攻克

\`\`\`mermaid
mindmap
  root((总图))
    核心
\`\`\`

## 口诀记忆图
> slug: memory-map
> eyebrow: Memory Map
> description: 最后冲刺反复刷

\`\`\`mermaid
mindmap
  root((口诀))
    启规执监收
\`\`\`
`;

  const result = extractMindmapPackFromMarkdown(markdown);

  assert.equal(result.packTitle, "PMP 纯脑图学习包");
  assert.equal(result.pages.length, 2);
  assert.deepEqual(result.pages[0], {
    title: "总脑图",
    slug: "master-map",
    eyebrow: "Master Map",
    description: "先看总图再分支攻克",
    mermaid: ["mindmap", "  root((总图))", "    核心"].join("\n")
  });
  assert.equal(result.pages[1].slug, "memory-map");
});

test("buildMindmapHtml embeds local mermaid runtime for pure brainmap page", () => {
  const html = buildMindmapHtml({
    title: "PMP 核心知识图",
    eyebrow: "Core Knowledge Map",
    description: "用来建立整体骨架。",
    mermaid: ["mindmap", "  root((PMP))", "    PMBOK 7"].join("\n"),
    backHref: "index.html"
  });

  assert.match(html, /<title>PMP 核心知识图<\/title>/);
  assert.match(html, /class="mermaid"/);
  assert.match(html, /mindmap\n  root\(\(PMP\)\)\n    PMBOK 7/);
  assert.match(html, /\.\.\/assets\/vendor\/mermaid\.min\.js/);
  assert.match(html, /返回思维导图总入口/);
  assert.doesNotMatch(html, /查看 Mermaid 源文件/);
});
