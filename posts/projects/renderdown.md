---
title: "RenderDown"
subtitle: "A single static web page that turns Markdown into a searchable, self-contained HTML notes viewer or a clean, print-styled PDF."
visibility: "public"
category: "tools"
tech_stack: ["HTML", "CSS", "JavaScript"]
status: "Released"
github_url: "https://github.com/PoltorProgrammer/RenderDown"
demo_url: "https://poltorprogrammer.github.io/RenderDown/"
hidden: false
---

# RenderDown — MD Notes Studio

RenderDown is a lightweight, serverless web tool designed to convert Markdown documents into rich, interactive outputs directly in the browser. It serves two primary workflows: exporting a searchable, dark-themed HTML notes viewer and generating clean, print-ready PDFs.

## What It Produces

- **A Searchable Notes Viewer**: A self-contained, offline-ready HTML file with a sidebar table of contents, full-text search, scroll-spy navigation, breadcrumbs, and LaTeX math support via MathJax.
- **A Print-Styled PDF**: A clean, professionally styled document generated natively using the browser's "Save as PDF" print stream.

No installation, no external build steps, and no backend server required. Simply paste your Markdown or drop in a `.md` file, view the live preview, and download either format.

## Features & Tech Stack

- **Browser-Only Architecture**: Operates entirely client-side. The page can be loaded directly from local storage (`index.html`) or hosted statically (e.g., GitHub Pages).
- **Offline Exports**: The exported HTML notes viewer inlines `marked.js` so it functions fully offline, while MathJax is dynamically loaded from a CDN as needed.
- **Interactive Preview**: Features a live side-by-side editing and previewing pane.

## How to Use

1. Open `index.html` in any web browser or visit the [Live Demo](https://poltorprogrammer.github.io/RenderDown/).
2. Paste Markdown text or drag-and-drop a `.md` file into the editor.
3. Preview the rendered document in real-time.
4. Export the document:
   - Click **Download Viewer** to save a standalone interactive notes page.
   - Click **Download PDF** to open the print interface (ensure pop-ups are allowed) and select **Save as PDF**.

## Project Structure

| File / Folder | Description |
|---|---|
| `index.html` | The main editor UI and orchestrator. |
| `assets/app.js` | Manages file reading, drag-and-drop events, and template generation. |
| `assets/viewer-template.js` | The layout and script template used for exporting the interactive notes viewer. |
| `assets/print-template.js` | The styling template for generating clean PDF exports. |
| `legacy/` | Contains the original Node.js and Python/pandoc local scripts for comparison. |

## Relation to This Portfolio

The Markdown parsing and static conversion mechanisms used to generate the project logs on this portfolio website are inspired by the templates and concepts designed in RenderDown.
