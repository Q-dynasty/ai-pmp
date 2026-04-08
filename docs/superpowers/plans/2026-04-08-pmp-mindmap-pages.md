# PMP Mindmap Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real Mermaid rendering for the PMP mindmap pages and make the learning pack ready for GitHub Pages hosting.

**Architecture:** Keep `pmp-learning/mindmaps/*.md` as the source of truth, generate browser-ready HTML pages from those Markdown Mermaid blocks, vendor Mermaid locally into the site during build, and publish `pmp-learning/` as a static artifact with GitHub Pages.

**Tech Stack:** Node.js, Mermaid, HTML5, CSS3, vanilla JavaScript, GitHub Actions, POSIX shell, `node:test`

---

## File Structure

### Files to create

- `package.json` — scripts and dependencies for build/test
- `scripts/build-mindmaps-lib.mjs` — markdown parsing and HTML generation helpers
- `scripts/build-mindmaps.mjs` — site build entry for Mermaid pages and local asset copy
- `scripts/build-mindmaps.test.mjs` — tests for markdown extraction and HTML output
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment workflow
- `.gitignore` — ignore build-time dependencies and local scratch files
- `README.md` — deployment and local preview instructions
- `pmp-learning/404.html` — custom Pages-friendly not-found page

### Files to modify

- `scripts/verify-pmp-learning.sh`
- `pmp-learning/index.html`
- `pmp-learning/10-思维导图.md`
- `pmp-learning/mindmaps/styles.css`
- `pmp-learning/mindmaps/index.html`

## Execution Outline

1. Add failing Node tests for Mermaid markdown extraction and page HTML generation.
2. Implement the build library and build entry script.
3. Install Mermaid and verify the build copies a local runtime file into the site.
4. Update the mindmap pages and site entry points to reflect real rendered diagrams.
5. Add GitHub Pages workflow, README instructions, and a custom `404.html`.
6. Extend the shell verifier for the new files and Mermaid markers.
7. Run tests, build, and structural verification before completion.
