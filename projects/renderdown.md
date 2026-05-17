---
title: "RenderDown"
subtitle: "A lightweight browser-based Markdown preview tool with a custom parser — no installation, no build step, no dependencies."
visibility: "public"
category: "tools"
tech_stack: ["HTML", "CSS", "JavaScript"]
status: "Released"
github_url: "https://github.com/PoltorProgrammer/RenderDown"
demo_url: ""
hidden: false
---

# RenderDown — Markdown Preview Tool

RenderDown is a browser-based tool for previewing how Markdown files render as HTML. It ships with a custom-built parser rather than relying on external libraries, keeping the entire project self-contained and dependency-free.

## Why It Exists

Testing Markdown rendering before integrating files into a larger system usually means spinning up a dev environment or depending on a specific library's interpretation of the spec. RenderDown removes that friction — open the HTML file locally, drop in a `.md` file, and see exactly how it renders.

## What It Supports

- Headers (H1–H6)
- Text formatting: **bold**, *italic*, ~~strikethrough~~
- Lists: ordered, unordered, nested, and task lists
- Blockquotes
- Fenced and inline code blocks
- Links and images
- Horizontal rules

> [!TIP]
> The parser includes smart detection to avoid false positives — for example, initials like "A. Smith" are not misread as ordered list markers.

## How to Use

1. Open `index.html` directly in any browser
2. Upload a `.md` file using the file picker
3. The rendered HTML preview appears instantly

No server required. Works fully offline.

## Project Structure

| File | Role |
|---|---|
| `index.html` | UI and file upload interface |
| `style.css` | Preview and app styling |
| `app.js` | File handling and orchestration |
| `markdown-parser.js` | Core conversion engine |

## Relation to This Portfolio

The Markdown rendering system powering this very portfolio — parsing frontmatter and converting project `.md` files to HTML — draws directly from the parsing approach developed in RenderDown.
