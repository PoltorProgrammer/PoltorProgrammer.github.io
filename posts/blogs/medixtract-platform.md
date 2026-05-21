---
title: "MediXtract: Architecting a Clinical Data Extraction Platform"
subtitle: "From scattered Python scripts to an end-to-end NLP pipeline for structured medical document processing"
date: "2026-01-15"
tags: ["ai", "nlp", "medical", "architecture", "platform", "python"]
projects: ["medixtract", "architect-medixtract", "google-dlp-sensitive-data", "medixtract-platform-v0", "audio-diarizer", "audio-diarizer-app"]
cover_color: "medical"
---

# The Problem

Clinical documents — discharge summaries, radiology reports, specialist letters — contain information that is enormously valuable for research, quality monitoring, and patient safety review. But they are written in natural language, inconsistently structured, and dense with domain-specific abbreviations.

Extracting structured data from these documents manually is slow, expensive, and does not scale. The goal of **MediXtract** is to automate that extraction using language models and NLP pipelines.

## How the Project Grew

MediXtract did not start as a platform. It started as a single Python script that extracted a handful of specific fields from a specific type of clinical report. As the scope grew — more document types, more fields, more users, more languages — the architecture had to evolve.

Here is how the repositories reflect that evolution.

---

## The Architecture Design — Before Writing Code

Before the current version of the platform, I wrote an extensive **architecture document** for MediXtract. This was an experiment in doing system design first, implementation second.

The architecture repo contains diagrams, data flow specifications, API contract drafts, and a rationale document for the major technical decisions: why FastAPI over Flask, why PostgreSQL over a document store, and how the extraction pipeline is modelled as a DAG of configurable stages.

Writing the architecture first revealed several assumptions I would have coded myself into had I started with implementation. In particular, the extraction model was initially conceived as a single LLM call. The architecture review pushed it toward a multi-stage pipeline — classification, extraction, validation, post-processing — which made the system far more debuggable and modular.

## Data Privacy — Handling Sensitive Clinical Text

Clinical documents are full of protected health information: names, dates, identifiers, diagnosis codes. Any system that processes them must handle PII with care.

The **Google DLP integration** repo covers the integration of Google Cloud's Data Loss Prevention API to detect and de-identify sensitive fields before documents enter the extraction pipeline. This acts as a pre-processing stage that replaces real values with synthetic tokens — allowing the NLP models to operate on structurally valid text without seeing actual patient data.

This was a critical constraint that shaped the pipeline architecture. De-identification is not just a compliance step: it also makes extracted data safer to log, cache, and audit.

## The First Version — Learning What Not to Do

The **v0 platform** is the first end-to-end implementation. It is functional but shows all the signs of a system built before its full scope was understood: a monolithic FastAPI application, no extraction stage separation, prompt templates baked into the code, a single-tenant assumption throughout.

I keep v0 public because it is an honest record of how the system started. It is also genuinely useful as a reference for the simplest possible implementation of the core extraction loop — fetch document, call LLM, return JSON.

The jump from v0 to the current architecture is where most of the interesting engineering happened.

## Audio Transcription — Expanding the Input Surface

Not all clinical documentation is written. Physician dictations, patient interviews, and ward rounds are frequently recorded audio. The **audio diarizer** and its companion **application** handle transcription and speaker attribution for clinical audio files.

The diarizer uses Whisper for transcription combined with a speaker diarization model to produce timestamped, speaker-labelled transcripts. The application wraps this into a usable interface — file upload, processing status, and a structured transcript viewer — that connects to the same extraction pipeline used for text documents.

Adding audio as an input source required rethinking the pipeline's input normalization step. The system now treats "normalize input to plain text" as the first universal stage, after which all document types converge to the same extraction path.

## The Current Platform — MediXtract

The **main MediXtract repository** is the current state of the platform: a multi-tenant FastAPI backend with a modular extraction pipeline, a PostgreSQL store for results and audit logs, and a React-based front end for document submission and result review.

The extraction pipeline is configured via YAML: you specify document types, field definitions, extraction prompts, and validation rules. A new document type can be added without touching the core code — only a new configuration file.

---

## Key Technical Decisions

**Multi-stage pipelines beat single-call extraction.** A single LLM call for the whole document produces outputs that are hard to debug when they are wrong. Breaking extraction into stages — identify relevant sections, extract fields, validate outputs — makes each failure point visible and fixable independently.

**De-identification must be early.** Any log, trace, or error that happens after de-identification is safe. Any log that happens before is a liability. Making PII removal the first step in the pipeline ensures that nothing downstream ever sees raw patient data.

**Configuration over code for domain logic.** Extraction rules, field definitions, and prompt templates change frequently as the clinical domain expands. Keeping these in YAML files rather than Python code means domain experts can propose changes without needing a development environment.

**The v0 is worth keeping.** Seeing where you started is useful. The simplicity of v0 is a reminder that many problems do not need the full platform — they need the extraction loop and nothing else.

## Where It Is Going

The immediate roadmap includes:

- Feedback-driven few-shot pool management: when a clinician corrects an extracted value, that correction updates the few-shot examples for that document type
- Support for FHIR resources as structured output targets
- A batch submission API for bulk document processing
- A benchmark suite for measuring extraction accuracy across document types

MediXtract is the most technically ambitious project I have worked on, and the one where the gap between "working prototype" and "production-ready system" has been most instructive to close — a gap I am still closing.
