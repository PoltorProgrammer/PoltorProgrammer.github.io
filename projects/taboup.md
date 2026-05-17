---
title: "Taboup"
subtitle: "A team-based word-guessing party game — digital platform meets printable board, inspired by the classic Tabú."
visibility: "public"
category: "games"
tech_stack: ["HTML", "CSS", "JavaScript"]
status: "Released"
github_url: "https://github.com/PoltorProgrammer/Taboup"
demo_url: "https://poltorprogrammer.github.io/Taboup/"
hidden: false
---

# Taboup — Party Word Game

Taboup is a browser-based party game inspired by the classic *Tabú*. It pairs a digital interface for card management, scoring, and timing with a printable physical board that teams advance across as they play.

## How It Works

One player gives verbal clues to help their team guess a target word — without saying any of the forbidden words listed on the card. A lateral arbiter (a player from the opposing team seated adjacent) monitors for violations.

The digital platform handles everything that would otherwise require a referee:

- Displays one card at a time with the target word and its forbidden terms
- **Correct** button registers a point and advances to the next card
- **Pass** button skips the card (up to 3 per round)
- **Error** button ends the round immediately for a rule violation
- Countdown timer — 60 or 120 seconds depending on board position

## Communication Rules

The rules are deliberately strict to keep the game competitive:

- No saying the forbidden words or any of their derivatives
- No marking syllables with pauses, sounds, or gestures
- No translation, spelling out letters, or mime
- Synonyms and definitions are fair game

## Board & Scoring

The printable board introduces spatial variation to the scoring:

- Standard spaces: one correct answer advances one space
- **Purple zones**: require three correct answers for a single space
- **Clock symbols**: grant double time for the following round

Teams define their own win condition before starting — first to the finish line, most spaces after X rounds, or furthest after a fixed play time.

## Setup

- Seat players in an alternating A-B-A-B circle
- Turns pass anti-clockwise
- Even team sizes recommended (4, 6, or 8 players); odd numbers require a designated neutral guesser
