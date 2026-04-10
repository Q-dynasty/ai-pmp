# PMP Brainmap Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the current PMP learning pack into a pure brainmap-driven learning experience that integrates core concepts, memory aids, and distilled video insights into Mermaid mindmaps generated from one Markdown source.

**Architecture:** Replace the current multi-source mindmap flow with one master Markdown pack under `pmp-learning/mindmaps/`. Extend the Node build tooling to parse multiple brainmap sections from that file and generate four published Mermaid pages plus an updated entry page. Keep supporting pages lightweight and make the mindmap pack the primary study path.

**Tech Stack:** Node.js, Mermaid, HTML5, CSS3, vanilla JavaScript, Markdown, POSIX shell, `node:test`

---

## File Structure

### Files to create

- `pmp-learning/mindmaps/pmp-brainmap-pack.md` — single source of truth for the pure brainmap pack

### Files to modify

- `scripts/build-mindmaps-lib.mjs`
- `scripts/build-mindmaps.mjs`
- `scripts/build-mindmaps.test.mjs`
- `scripts/verify-pmp-learning.sh`
- `pmp-learning/index.html`
- `pmp-learning/07-B站视频精选与摘要.md`
- `pmp-learning/10-思维导图.md`
- `pmp-learning/mindmaps/index.html`

## Execution Outline

1. Add failing tests for parsing a single Markdown pack into multiple brainmap pages.
2. Extend the build library and build script to generate the new pages from one source file.
3. Write the new master brainmap pack with integrated concept explanation, memory hooks, and distilled video insights.
4. Update the brainmap entry flow and supporting pages so the brainmap pack becomes the primary study path.
5. Extend verification to cover the new source file and generated pages.
6. Run `npm run verify`, then push the refactor if verification passes.
