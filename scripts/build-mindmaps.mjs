import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildMindmapHtml, extractMindmapFromMarkdown } from "./build-mindmaps-lib.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const mindmapsDir = path.join(projectRoot, "pmp-learning", "mindmaps");
const vendorDir = path.join(projectRoot, "pmp-learning", "assets", "vendor");
const vendorSource = path.join(
  projectRoot,
  "node_modules",
  "mermaid",
  "dist",
  "mermaid.min.js"
);
const vendorTarget = path.join(vendorDir, "mermaid.min.js");

const pages = [
  {
    source: "pmp-overview.md",
    output: "pmp-overview.html",
    eyebrow: "Overview Map",
    description:
      "这页先帮你建立全局框架：PMBOK 7 负责理解项目管理逻辑，PMBOK 6 负责考试结构，强化层负责最后的记忆与复盘。"
  },
  {
    source: "pmbok6-exam-map.md",
    output: "pmbok6-exam-map.html",
    eyebrow: "Process Recall Map",
    description:
      "这一页专门用于五大过程组回忆，帮助你快速找出每个过程放在哪一组，不要求在这里硬背完整 ITTO。"
  },
  {
    source: "sprint-review-map.md",
    output: "sprint-review-map.html",
    eyebrow: "Sprint Review Map",
    description:
      "最后冲刺时，把最常考、最容易混淆、最适合口诀压缩的内容放在同一页反复刷，能更快形成短时回忆路径。"
  }
];

async function build() {
  await mkdir(vendorDir, { recursive: true });
  await copyFile(vendorSource, vendorTarget);

  for (const page of pages) {
    const sourcePath = path.join(mindmapsDir, page.source);
    const outputPath = path.join(mindmapsDir, page.output);
    const markdown = await readFile(sourcePath, "utf8");
    const { title, mermaid } = extractMindmapFromMarkdown(markdown);
    const html = buildMindmapHtml({
      title,
      eyebrow: page.eyebrow,
      description: page.description,
      mermaid,
      backHref: "index.html",
      sourceHref: page.source
    });

    await writeFile(outputPath, html, "utf8");
  }
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
