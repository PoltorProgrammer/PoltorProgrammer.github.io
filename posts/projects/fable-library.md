---
title: "Fable Library"
subtitle: "A portable operating system for AI agents — drop this folder into any project, point the agent at START.md, and get structured reasoning, checklists, and token-efficient best practices on demand."
visibility: "public"
category: ["ai", "tools"]
tech_stack: ["Markdown", "Node.js", "Claude Code", "AI Agents"]
status: "Active"
github_url: "https://github.com/PoltorProgrammer/fable-library"
demo_url: ""
hidden: false
---

# Fable Library — Portable AI Agent OS

Fable Library is a folder you drop into the root of any project. Point an AI agent at `START.md` and it detects the project type, loads the right playbook, and maintains state across sessions in `PROJECT.md`.

## What It Is

A structured knowledge system built to work with the most advanced AI models. It covers the full development lifecycle — from zero-code kickoff interviews through architecture decisions, security, deployment checklists, and how to keep token usage lean.

## Why It Exists

Working at the frontier of AI-assisted development means the bottleneck is rarely writing code — it is structuring the collaboration so the model does the right things in the right order without burning context on things it already knows. Fable Library is the answer to that problem.

## What's Inside

- **Core playbooks** — principles, reasoning templates, recovery decision trees, checklists, security, roadmaps
- **Stack guides** — Astro, Vite/React, Node, Python, Vanilla Web, Ruby, VSCode extensions, mobile
- **Overlays** — Zoho, Google Cloud (load additively on top of any stack)
- **Claude Code skills** — `/fable`, `/kickoff`, `/draft`, `/harvest`, `/preflight`, `/seo-audit`
- **Diagnostics** — `env-probe.mjs` scans the environment and flags committed secrets; `selfcheck.mjs` verifies library integrity

## Design Philosophy

Token economy over completeness. Boot loads three files. Everything else loads on demand via a routing table in `START.md`. No file exceeds ~120 lines. Detection lives in both prose and executable form — they must be kept in sync.

> [!NOTE]
> Built entirely during the limited availability windows of Fable 5 — the most advanced AI model available at the time. The library itself is a product of the methodology it documents.
