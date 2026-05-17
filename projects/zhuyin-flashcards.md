---
title: "Zhuyin Flashcards"
subtitle: "Interactive Bopomofo flashcards with automatically generated audio files to assist vocabulary acquisition."
visibility: "public"
category: "language"
tech_stack: ["HTML", "CSS", "Python"]
status: "Released"
github_url: "https://github.com/PoltorProgrammer/Zhuyin_flashcards_interactivas"
demo_url: ""
hidden: false
---

# Zhuyin Interactive Flashcards

An interactive, responsive browser-based language learning app developed to accelerate Mandarin Bopomofo (Zhuyin) phonetic mastery, utilizing programmatically compiled pronunciation audios.

## Overview

Mandarin Chinese learners transitioning to traditional phonetic systems (Zhuyin / Bopomofo) often struggle with auditory recognition of individual symbols and combinations. **Zhuyin Flashcards** addresses this by combining a modern, interactive card-flipping card interface with automated, high-quality audio files generated via a Python compiler script.

## Key Features

- **Interactive Card Deck** — Responsive 3D flip card animations showing the Zhuyin symbol on the front and Pinyin, description, and example characters on the back.
- **Synthesized Audio** — Automated Python script that generates distinct audio clips for each phonetic tone using text-to-speech engines (e.g., `gTTS` or local synthesizers).
- **Responsive Layout** — Beautifully styled with premium color palettes, optimized for learning on cell phones during daily commutes.
- **Categorized Decks** — Group cards by Consonants, Vowels, Medials, or Combined structures to study at your own pace.

## Python Audio Builder Script

The repository includes a Python utility in `scripts/audio_builder.py` that iterates over a structured dictionary of symbols and spits out optimized, low-weight MP3 assets:

```python
import os
from gtts import gTTS

# Sample generator loop
symbols = {"ㄅ": "b", "ㄆ": "p", "ㄇ": "m", "ㄈ": "f"}
for symbol, pinyin in symbols.items():
    tts = gTTS(text=symbol, lang='zh-TW')
    tts.save(f"audio/{pinyin}.mp3")
```

> [!TIP]
> Use these flashcards daily alongside your **Zhuyin Keyboard** to quickly lock down your auditory and typographic fluency with traditional Chinese phonetics.
