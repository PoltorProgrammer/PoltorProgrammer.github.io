---
title: "Bingo Checker"
subtitle: "Interactive card generator and real-time validation utility for Bingo systems."
visibility: "public"
category: "games"
tech_stack: ["HTML", "JavaScript"]
status: "Released"
github_url: "https://github.com/PoltorProgrammer/Bingo_Checker"
demo_url: ""
hidden: false
---

# Bingo Checker & Card Generator

An interactive, responsive browser-based utility developed to generate, track, and validate Bingo cards in real time, ensuring fair play and immediate win verification.

## Overview

Traditional bingo games suffer from validation delays — looking up printed card IDs manually when a player shouts "Bingo!". **Bingo Checker** automates this by maintaining a digital card matrix in-memory, letting game moderators input called numbers and instantly check if any generated card has secured a winning row, column, or diagonal pattern.

## Key Features

- **Card Generator** — Instantly prints or displays randomized, standard-compliant 5x5 Bingo cards (75-ball or 90-ball options).
- **Interactive Moderator Dashboard** — A clickable grid of numbers (1 to 75/90) allowing moderators to easily track called numbers.
- **Instant Validation** — Scans all active cards against called numbers to alert the moderator the exact millisecond a "Line" or "Bingo" pattern is achieved.
- **Zero Server Setup** — Operates entirely locally inside your browser, making it perfect for family gatherings or local community events.

## Validation Pattern Algorithm

The script scans for coordinates inside each card matrix:
- **Rows:** `[[0,1,2,3,4], [5,6,7,8,9], ...]`
- **Columns:** `[[0,5,10,15,20], [1,6,11,16,21], ...]`
- **Diagonals:** `[[0,6,12,18,24], [4,8,12,16,20]]`

> [!TIP]
> You can open this page on multiple tablets or mobile phones simultaneously to let players mark their cards digitally, completely eliminating the need for physical ink and paper card sets.
