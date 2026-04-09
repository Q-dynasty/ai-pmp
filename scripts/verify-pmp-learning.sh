#!/usr/bin/env sh
set -eu

script_dir=$(
  CDPATH= cd -- "$(dirname "$0")" && pwd
)
project_root=$(
  CDPATH= cd -- "$script_dir/.." && pwd
)

cd "$project_root"

missing=0

if command -v rg >/dev/null 2>&1; then
  search_fixed() {
    rg -q --fixed-strings "$1" "$2"
  }
else
  search_fixed() {
    grep -Fq -- "$1" "$2"
  }
fi

require_dir() {
  if [ ! -d "$1" ]; then
    printf 'MISSING DIR: %s\n' "$1"
    missing=1
  fi
}

require_file() {
  if [ ! -f "$1" ]; then
    printf 'MISSING FILE: %s\n' "$1"
    missing=1
  fi
}

require_text() {
  file="$1"
  pattern="$2"
  if ! search_fixed "$pattern" "$file"; then
    printf 'MISSING TEXT: %s -> %s\n' "$file" "$pattern"
    missing=1
  fi
}

require_mermaid() {
  file="$1"
  require_text "$file" '```mermaid'
  require_text "$file" "mindmap"
}

require_dir "scripts"
require_dir "research"
require_dir "pmp-learning"
require_dir "pmp-learning/assets"
require_dir "pmp-learning/assets/vendor"

require_file "package.json"
require_file "package-lock.json"
require_file "README.md"
require_file ".gitignore"
require_file ".github/workflows/deploy-pages.yml"
require_file "scripts/verify-pmp-learning.sh"
require_file "scripts/build-mindmaps-lib.mjs"
require_file "scripts/build-mindmaps.mjs"
require_file "scripts/build-mindmaps.test.mjs"
require_file "research/bilibili-video-notes.md"
require_file "pmp-learning/index.html"
require_file "pmp-learning/404.html"
require_file "pmp-learning/.nojekyll"
require_file "pmp-learning/assets/styles.css"
require_file "pmp-learning/assets/app.js"
require_file "pmp-learning/assets/vendor/mermaid.min.js"
require_file "pmp-learning/00-学习总览.md"
require_file "pmp-learning/01-30天计划.md"
require_file "pmp-learning/02-PMBOK7-12原则.md"
require_file "pmp-learning/03-PMBOK7-8绩效域.md"
require_file "pmp-learning/04-PMBOK6-五大过程组.md"
require_file "pmp-learning/05-PMBOK6-十大知识领域.md"
require_file "pmp-learning/06-49过程速记.md"
require_file "pmp-learning/07-B站视频精选与摘要.md"
require_file "pmp-learning/08-高频考点与易错点.md"
require_file "pmp-learning/09-口诀与记忆卡.md"
require_file "pmp-learning/10-思维导图.md"
require_file "pmp-learning/mindmaps/index.html"
require_file "pmp-learning/mindmaps/styles.css"
require_file "pmp-learning/mindmaps/pmp-overview.html"
require_file "pmp-learning/mindmaps/pmbok6-exam-map.html"
require_file "pmp-learning/mindmaps/sprint-review-map.html"
require_file "pmp-learning/mindmaps/pmp-overview.md"
require_file "pmp-learning/mindmaps/pmbok6-exam-map.md"
require_file "pmp-learning/mindmaps/sprint-review-map.md"

if [ "$missing" -ne 0 ]; then
  exit 1
fi

require_text "pmp-learning/index.html" 'section id="overview"'
require_text "pmp-learning/index.html" 'section id="roadmap"'
require_text "pmp-learning/index.html" 'section id="pmbok7"'
require_text "pmp-learning/index.html" 'section id="pmbok6"'
require_text "pmp-learning/index.html" 'section id="videos"'
require_text "pmp-learning/index.html" 'section id="memory"'
require_text "pmp-learning/index.html" 'section id="mindmaps"'
require_text "pmp-learning/index.html" 'data-filter="understand"'
require_text "pmp-learning/index.html" 'data-filter="exam"'
require_text "pmp-learning/index.html" 'data-filter="sprint"'
require_text "pmp-learning/index.html" "00-学习总览.md"
require_text "pmp-learning/index.html" "01-30天计划.md"
require_text "pmp-learning/index.html" "02-PMBOK7-12原则.md"
require_text "pmp-learning/index.html" "04-PMBOK6-五大过程组.md"
require_text "pmp-learning/index.html" "07-B站视频精选与摘要.md"
require_text "pmp-learning/index.html" "08-高频考点与易错点.md"
require_text "pmp-learning/index.html" "10-思维导图.md"
require_text "pmp-learning/index.html" "mindmaps/index.html"
require_text "pmp-learning/index.html" "打开完整视频精选与摘要"
require_text "pmp-learning/index.html" "思维导图总入口"
require_text "pmp-learning/index.html" "Mermaid 渲染"
require_text "pmp-learning/index.html" "GitHub Pages"
require_text "pmp-learning/00-学习总览.md" "# 学习总览"
require_text "pmp-learning/00-学习总览.md" "## 双主线怎么配合"
require_text "pmp-learning/00-学习总览.md" "## 对应资料入口"
require_text "pmp-learning/00-学习总览.md" "10-思维导图.md"
require_text "pmp-learning/00-学习总览.md" "[PMBOK 7 的 12 项原则](02-PMBOK7-12原则.md)"
require_text "pmp-learning/00-学习总览.md" "[思维导图](10-思维导图.md)"
require_text "pmp-learning/01-30天计划.md" "# 30 天学习计划"
require_text "pmp-learning/01-30天计划.md" "| Day | 主题 | 必读 | 视频 | 复习动作 |"
require_text "pmp-learning/02-PMBOK7-12原则.md" "# PMBOK 7 的 12 项原则"
require_text "pmp-learning/02-PMBOK7-12原则.md" "| 原则 | 白话解释 | 高频提醒 |"
require_text "pmp-learning/03-PMBOK7-8绩效域.md" "# PMBOK 7 的 8 个绩效域"
require_text "pmp-learning/03-PMBOK7-8绩效域.md" "| 绩效域 | 关注重点 | 和第六版的连接 |"
require_text "pmp-learning/04-PMBOK6-五大过程组.md" "# PMBOK 6 的五大过程组"
require_text "pmp-learning/05-PMBOK6-十大知识领域.md" "# PMBOK 6 的十大知识领域"
require_text "pmp-learning/06-49过程速记.md" "# 49 过程速记"
require_text "pmp-learning/06-49过程速记.md" "## 49 过程矩阵"
require_text "research/bilibili-video-notes.md" "# Bilibili PMP 视频调研记录"
require_text "research/bilibili-video-notes.md" "## 筛选日期"
require_text "research/bilibili-video-notes.md" "## 检索关键词"
require_text "research/bilibili-video-notes.md" "## 筛选说明"
require_text "research/bilibili-video-notes.md" "## 候选视频"
require_text "research/bilibili-video-notes.md" "项目经理PMP-100分钟串讲"
require_text "research/bilibili-video-notes.md" "〖PMP第七版课程〗2025年PMP项目管理之八大绩效域知识精华~PMP免费培训课程，助你轻松获得PMP证书"
require_text "research/bilibili-video-notes.md" "（附2026年）PMP项目管理《PMBOK指南》第七版精讲视频课程（零基础通关PMP）！"
require_text "research/bilibili-video-notes.md" "〖PMBOK第七版〗PMP认证考试全套精讲课程，免费学习（配套文档资料）"
require_text "research/bilibili-video-notes.md" "PMP第七版课程〖2023年最新版PMP〗乐凯PMP精讲课程，考PMP的同学必看"
require_text "research/bilibili-video-notes.md" "PMP第七版〖机构收费课程完整版免费看〗2023年PMP项目管理认证考试零基础一次通过PMP项目管理考试骐迹教育"
require_text "research/bilibili-video-notes.md" "〖收藏！〗B站最高效的PMP备考，136分钟讲清楚 PMP项目管理的核心考点！"
require_text "research/bilibili-video-notes.md" "〖PMP第七版教材〗敏捷项目管理知识全面解读精讲教程（考点精讲，案例试题，建议收藏）！"
require_text "pmp-learning/07-B站视频精选与摘要.md" "# B 站视频精选与摘要"
require_text "pmp-learning/07-B站视频精选与摘要.md" "## 使用方法"
require_text "pmp-learning/07-B站视频精选与摘要.md" "## 入门类"
require_text "pmp-learning/07-B站视频精选与摘要.md" "## 系统课类"
require_text "pmp-learning/07-B站视频精选与摘要.md" "## 冲刺类"
require_text "pmp-learning/07-B站视频精选与摘要.md" "筛选日期：2026-04-08"
require_text "pmp-learning/07-B站视频精选与摘要.md" "项目经理PMP-100分钟串讲"
require_text "pmp-learning/07-B站视频精选与摘要.md" "〖PMP第七版课程〗2025年PMP项目管理之八大绩效域知识精华~PMP免费培训课程，助你轻松获得PMP证书"
require_text "pmp-learning/07-B站视频精选与摘要.md" "（附2026年）PMP项目管理《PMBOK指南》第七版精讲视频课程（零基础通关PMP）！"
require_text "pmp-learning/07-B站视频精选与摘要.md" "〖PMBOK第七版〗PMP认证考试全套精讲课程，免费学习（配套文档资料）"
require_text "pmp-learning/07-B站视频精选与摘要.md" "PMP第七版课程〖2023年最新版PMP〗乐凯PMP精讲课程，考PMP的同学必看"
require_text "pmp-learning/07-B站视频精选与摘要.md" "PMP第七版〖机构收费课程完整版免费看〗2023年PMP项目管理认证考试零基础一次通过PMP项目管理考试骐迹教育"
require_text "pmp-learning/07-B站视频精选与摘要.md" "〖收藏！〗B站最高效的PMP备考，136分钟讲清楚 PMP项目管理的核心考点！"
require_text "pmp-learning/07-B站视频精选与摘要.md" "〖PMP第七版教材〗敏捷项目管理知识全面解读精讲教程（考点精讲，案例试题，建议收藏）！"
require_text "pmp-learning/08-高频考点与易错点.md" "# 高频考点与易错点"
require_text "pmp-learning/09-口诀与记忆卡.md" "# 口诀与记忆卡"
require_text "pmp-learning/10-思维导图.md" "# 思维导图"
require_text "pmp-learning/10-思维导图.md" "mindmaps/index.html"
require_text "pmp-learning/10-思维导图.md" "Mermaid 渲染页"
require_text "pmp-learning/10-思维导图.md" "GitHub Pages"
require_text "pmp-learning/mindmaps/index.html" "PMP 全局总图"
require_text "pmp-learning/mindmaps/index.html" "第六版考试框架图"
require_text "pmp-learning/mindmaps/index.html" "冲刺记忆图"
require_text "pmp-learning/mindmaps/index.html" "Mermaid"
require_text "pmp-learning/mindmaps/index.html" "GitHub Pages"
require_text "pmp-learning/mindmaps/pmp-overview.html" 'class="mermaid"'
require_text "pmp-learning/mindmaps/pmp-overview.html" "../assets/vendor/mermaid.min.js"
require_text "pmp-learning/mindmaps/pmp-overview.html" "查看 Mermaid 源文件"
require_text "pmp-learning/mindmaps/pmbok6-exam-map.html" 'class="mermaid"'
require_text "pmp-learning/mindmaps/pmbok6-exam-map.html" "../assets/vendor/mermaid.min.js"
require_text "pmp-learning/mindmaps/pmbok6-exam-map.html" "data-render-status"
require_text "pmp-learning/mindmaps/sprint-review-map.html" 'class="mermaid"'
require_text "pmp-learning/mindmaps/sprint-review-map.html" "../assets/vendor/mermaid.min.js"
require_text "pmp-learning/mindmaps/sprint-review-map.html" "Mermaid Render"
require_text "pmp-learning/assets/app.js" "aria-pressed"
require_text "pmp-learning/assets/app.js" "applyFilter(initial)"
require_text "package.json" '"build": "node scripts/build-mindmaps.mjs"'
require_text "package.json" '"verify": "npm test && npm run build && sh scripts/verify-pmp-learning.sh"'
require_text "README.md" "GitHub Pages"
require_text "README.md" "npm run build"
require_text "README.md" "python3 -m http.server 4173 -d pmp-learning"
require_text ".github/workflows/deploy-pages.yml" "actions/deploy-pages@v4"
require_text ".github/workflows/deploy-pages.yml" "actions/upload-pages-artifact@v4"
require_text ".github/workflows/deploy-pages.yml" "path: pmp-learning"
require_text ".github/workflows/deploy-pages.yml" "npm ci"
require_text "pmp-learning/404.html" "这个页面没找到"
require_text "pmp-learning/404.html" "mindmaps/index.html"
require_mermaid "pmp-learning/mindmaps/pmp-overview.md"
require_mermaid "pmp-learning/mindmaps/pmbok6-exam-map.md"
require_mermaid "pmp-learning/mindmaps/sprint-review-map.md"

if [ "$missing" -ne 0 ]; then
  exit 1
fi

printf 'OK: verification passed\n'
