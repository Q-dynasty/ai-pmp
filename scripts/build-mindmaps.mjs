import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildMindmapHtml,
  buildMindmapIndexHtml,
  extractMindmapPackFromMarkdown
} from "./build-mindmaps-lib.mjs";

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
const sourcePack = path.join(mindmapsDir, "pmp-brainmap-pack.md");

async function build() {
  await mkdir(vendorDir, { recursive: true });
  await copyFile(vendorSource, vendorTarget);

  const markdown = await readFile(sourcePack, "utf8");
  const pack = extractMindmapPackFromMarkdown(markdown);

  const indexHtml = buildMindmapIndexHtml(pack);
  await writeFile(path.join(mindmapsDir, "index.html"), indexHtml, "utf8");

  for (const page of pack.pages) {
    const outputPath = path.join(mindmapsDir, `${page.slug}.html`);
    const html = buildMindmapHtml({
      title: page.title,
      eyebrow: page.eyebrow,
      description: page.description,
      mermaid: page.mermaid,
      backHref: "index.html"
    });

    await writeFile(outputPath, html, "utf8");
  }
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
