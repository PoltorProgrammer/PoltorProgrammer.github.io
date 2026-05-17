---
title: "Audio Diarizer App"
subtitle: "Web application wrapper to upload audio files and display speaker segmented transcriptions."
visibility: "public"
category: ["ai", "tools"]
tech_stack: ["JavaScript"]
status: "Active Development"
github_url: "https://github.com/PoltorProgrammer/audio-diarizer-app"
demo_url: ""
hidden: false
---

# Audio Diarizer Web App

An interactive web-based front-end interface built to upload audio recording files, communicate with diarizer services, and display speaker-segmented transcriptions alongside interactive audio waveforms.

## Overview

While Python diarizers perform high-quality acoustic separations, users require a friendly, visual way to interact with the results. This repository provides a modern web interface that renders interactive transcripts, complete with colored speaker indicators and clickable time-stamps.

## Key Features

- **Audio Drag-and-Drop** — Simple, clean upload panel supporting MP3, WAV, and M4A clinical recordings.
- **Waveform Visualization** — Interactive audio waves (utilizing libraries like `wavesurfer.js`) that highlight speaker divisions in real-time.
- **Segmented Transcripts** — Renders text in a conversational script format, grouping sentences under distinct speaker badges.
- **Correction Editor** — Click directly on a transcript section to manually correct speaker labels or text entries before exporting data.

## Connection with MediXtract

This application served as the experimental frontend prototype for MediXtract's consultation audio processing tab. It helped test user experience challenges when reviewing and correcting automated transcriptions in the field.

> [!NOTE]
> This repository is a customized fork, tailored to provide visual controls for multi-speaker audios in educational and medical trials.
