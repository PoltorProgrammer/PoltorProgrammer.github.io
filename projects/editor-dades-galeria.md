---
title: "Editor Dades Galeria"
subtitle: "Interactive plant catalog editor and manager for the UAB campus botanical database."
visibility: "public"
category: ["nature", "tools"]
tech_stack: ["HTML", "JavaScript"]
status: "Completed — May 2025"
github_url: "https://github.com/PoltorProgrammer/Editor_Dades_Galeria"
demo_url: ""
hidden: false
---

# Editor Dades Galeria

An interactive, browser-based administrative utility designed to manage, edit, and compile structured botanical datasets for the UAB Faculty of Biosciences.

## Overview

Maintaining an accurate botanical database can be challenging when handling complex taxonomic schemas. **Editor Dades Galeria** solves this by providing a zero-dependency local web utility where administrators can upload their `plants.json` file, add or modify botanical listings, validate fields, and download the compiled JSON output directly in-browser.

## Key Features

- **Local File Processing** — Upload and parse existing JSON botanical data entirely client-side. No databases or API configurations required.
- **Form-Based Editing** — Clean forms with strict input rules for taxonomic hierarchies (e.g., Family, Genus, Species), descriptions, flowering seasons, and image references.
- **Schema Validation** — Real-time checks to ensure required fields are fully completed, avoiding malformed records in the production gallery.
- **Direct Export** — Compile and download the updated database as a standardized, minimized, or pretty-printed JSON file.

## Why It Matters

This utility serves as the bridge between raw fieldwork inputs and the public-facing WordPress or HTML galleries. By abstracting JSON structures into an easy-to-use visual editor, it prevents manual syntax errors (like missing commas or unclosed brackets) during database updates.

> [!TIP]
> The editor contains built-in search filters so you can locate and modify existing species profiles in seconds, even within large databases of hundreds of entries.
