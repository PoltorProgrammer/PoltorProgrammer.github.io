---
title: "Fable 5: The Window, the Work, and the Library"
subtitle: "How I used a brief window of access to the most advanced AI model to shield two projects and build a reusable knowledge system that now lives inside every project I build"
date: "2026-07-07"
tags: ["AI", "tools", "claude", "fable", "agents", "workflow"]
projects: ["fable-library", "medixtract"]
cover_color: "ai"
---

# The Window

Not every tool you depend on is always there. Fable 5 — the most capable AI model I have worked with — was available for a window. Not permanently, not on demand. A window.

When it opened, I knew exactly what I wanted to do with it. Not just use it to write code faster. Use it to think harder, build better structures, and capture what I had been learning in a form that would outlast the session.

That is where **Fable Library** started.

---

## What I Used It For

The first thing I pointed Fable 5 at was **MediXtract** — the clinical data extraction platform I had been building for months. MediXtract is the kind of project where the gap between a working prototype and a production-ready system is enormous. Complex pipeline architecture, sensitive data handling, multi-stage extraction logic, compliance constraints.

Having access to the best available model meant I could reason through the hard parts properly. Not just get code that ran — get code that was designed well, with the tradeoffs understood and documented. Fable 5 did not just help me write MediXtract. It helped me think about what MediXtract should be.

---

## The Library

The other thing I built during that window was the library itself.

I had been accumulating knowledge for months: good prompting patterns, stack-specific gotchas, kickoff workflows, security checklists, reasoning templates, agent management principles. It was all scattered — notes here, a markdown file there, things I remembered from past sessions that I would never remember again next time.

Fable Library is the crystallised form of all of that. A portable folder. Drop it into any project root. Point an agent at `START.md`. The agent detects the project type, loads the right playbook, and maintains memory across sessions in `PROJECT.md`.

It covers:

- **Core principles** — 20 operating rules: ground truth discipline, change discipline, failure honesty, security
- **Reasoning templates** — structured chain-of-thought for debugging, features, refactors, architecture decisions
- **Recovery decision trees** — what to do when builds fail, deps break, git gets messy, deploys go wrong
- **Pre-commit and pre-deploy checklists** — the gate rituals that prevent the embarrassing mistakes
- **Stack guides** — Astro, Vite/React, Node, Python, vanilla web, Ruby, mobile, VSCode extensions
- **Claude Code skills** — `/kickoff`, `/draft`, `/harvest`, `/preflight`, `/seo-audit`, `/fable`
- **Prompting and agent management** — how to design the collaboration itself, not just the code

The library is not a chatbot. It is a structured knowledge system that makes an AI agent more effective by giving it the right context at boot without burning tokens on things it already knows.

---

## Then It Went Away

Then the window closed.

I had MediXtract partially through a critical phase. I had the library mostly built but not finished. I had a list of things I wanted to do with the extractions — a knowledge base, a search interface, a way to query the structured outputs that the pipeline had been producing.

I documented everything carefully. The decision log in `PROJECT.md`. The open threads. The gotchas. The reasoning behind every major architectural choice.

That is exactly what the library is designed for — making context survive the gap between sessions. When the model comes back, or when a different model picks up the work, the state is there.

---

## And Then It Came Back

The window opened again.

With the library already built and the state preserved, picking up exactly where I left off cost almost nothing. `PROJECT.md` reconstructed the context. `START.md` loaded the right playbooks. The open threads from the previous session became the agenda for the new one.

The knowledge extraction work — the part I had not been able to finish — came together. The pipeline that takes unstructured clinical documents and produces structured, queryable data now works end to end. The library itself was completed and versioned. The Claude Code skills were written and tested.

---

## What the Library Does Now

Every project I start now gets a copy of `_fable-library/` in its root.

The boot cost is three file reads and one script run. Everything else loads on demand. A new project gets a full kickoff interview, a stack proposal, a risk register, an estimate, and a ready-to-use `PROJECT.md` before a single line of code is written.

The token economics are real. Loading only what is needed, keeping files under 120 lines, maintaining state across sessions instead of re-establishing it from scratch every time — these things add up. The model thinks more clearly when it is not spending context budget on orientation.

> [!NOTE]
> Fable Library is public. You can drop it into any project and point Claude Code, Cursor, or any capable agent at `START.md`. The skills folder gives you slash commands for the full workflow.

---

## The Lesson

The most valuable thing I built during those windows was not a feature. It was the structure that makes every future session better than the one before.

That is what Fable Library is. Not a project that closes. A system that grows.
