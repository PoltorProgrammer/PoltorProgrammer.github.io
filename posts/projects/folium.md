---
title: "Folium"
subtitle: "Production-grade botanical cataloging ecosystem for the UAB campus — React Native, Supabase, and PostGIS."
visibility: "private"
category: ["natural", "botanics"]
tech_stack: ["React Native", "Expo", "Supabase", "PostGIS", "TypeScript"]
status: "Completed — May 2026"
github_url: ""
demo_url: ""
hidden: false
---

# Folium — Community Botanical Cataloging Platform

**Folium** is a production-grade native mobile application that enables community-driven botanical cataloging and biodiversity monitoring at bounded geographic locations. Built as a capstone project (TFG) at Universitat Autònoma de Barcelona, it is deployed as a citizen science platform for the UAB Campus with an architecture designed to replicate across any delimited territory — university campuses, nature reserves, or urban parks.

## Problem

Biodiversity monitoring at institutional scale faces a fundamental data gap: field surveys are expensive, infrequent, and dependent on specialist availability. Meanwhile, the daily foot traffic of hundreds of students and researchers on a campus like UAB's represents a largely untapped observational resource. Existing global platforms like iNaturalist lack the geographic scoping, institutional role hierarchies, and campus-specific gamification needed to motivate and organize that local community effectively. The scientific validity of crowd-sourced data also demands a structured trust model — raw volume of votes is not equivalent to expert agreement.

## Solution

Folium solves this by combining three interlocking systems: a mobile-first observation capture flow (camera + GPS + AI pre-identification), an expert-weighted consensus validation engine, and a social gamification layer that rewards quality contribution over quantity. The result is a self-sustaining data pipeline where the campus community produces scientific-grade biodiversity records at near-zero operational cost.

The platform was submitted to the Google Play Store in May 2026 and is scheduled for its first institutional pilot at the UAB Campus (Cerdanyola del Vallès) in June 2026.

## Core Features

### Galeria (Species Gallery)

A searchable, filterable catalog of all botanical species documented on campus. Users browse by growth form (tree, shrub, herb, climber), taxonomic family, or protected/invasive status. Each species page aggregates morphological traits from all validated community observations, displays quality-ranked community photographs with a like/dislike voting system, and maps every geolocated sighting directly on campus. This is the platform's reference layer — the living record of what grows where.

### Observació (Guided Observation Capture)

A five-step guided workflow designed to produce scientifically useful records from non-specialist users:

1. **Camera capture** — high-resolution photo via `expo-camera` with direct sensor access
2. **GPS tagging** — sub-meter coordinate from `expo-location` (superior to browser geolocation) with a manual override modal for corrections
3. **AI pre-identification** — PlantNet API (Pl@ntNet consortium: INRAE, CIRAD, INRIA, IRD) suggests the most likely species with a confidence score; the user reviews and can override
4. **Trait completion** — growth form, leaf characteristics, flower symmetry, fruit type, and dominant color (extracted from the photo via an integrated color eyedropper tool that returns a HEX value)
5. **Submission** — image uploaded to Supabase Storage, observation metadata written to PostgreSQL; if offline, queued to SQLite for background sync on connectivity restore

### Mapa (Interactive Geospatial Map)

A Google Maps base layer rendering all validated observations as geolocated markers. At high densities, Supercluster automatically groups markers to prevent visual noise, zooming out to cluster and in to individual pins. Users filter by taxonomic family, observation status, and date range. Coordinates for protected species are automatically blurred to a 5 km grid at the API layer — the blur happens server-side, never client-side, so the raw coordinates remain protected even if requests are intercepted.

### Feed & Validació (Social Feed and Validation)

The engine that converts raw observations into scientific records. The feed presents recent community observations chronologically; the Validation Swiper lets users rapidly affirm (swipe right) or dispute (swipe left) an identification with a card-based UX. Each swipe triggers a vote insertion, recalculates the observation's confidence score, and may promote or archive it automatically.

The validation model is explicitly epistemic — votes carry rank-weighted authority rather than counting equally:

| Rank | Confirmation | Flag |
|---|---|---|
| Student (rank 1) | +5 pts | −5 pts |
| Expert (rank 2) | +25 pts | −15 pts |
| Professor (rank 3) | +50 pts (sufficient alone) | −30 pts |

An observation reaches `community_verified` at ≥ 50 confidence points (10 student agreements, or 2 expert confirmations, or 1 professor confirmation) and `scientifically_validated` via single professor confirmation or sustained cumulative consensus. Observations are auto-archived at a moderation score of ≤ −60 without requiring manual review. A Correction Sheet (Fitxa de Correcció) allows users to document specific morphological disagreements.

### Perfil (User Profile)

Personal statistics, earned badges, rank progression, saved botanical lists, and voted photos history in a single screen. The account settings section covers username/full-name editing and a complete GDPR compliance block: Privacy Policy modal (permanent URL, in-app linked), CC BY-NC 4.0 attribution explanation, and a self-serve account deletion flow that is fully Article 17 compliant (described in the Legal section below).

## Architecture

### Mobile Application

Built with **Expo (React Native 0.81.5)** and **TypeScript 5.x in strict mode**, with file-based routing via Expo Router. The tab navigation structure mirrors the five primary feature areas. All taxonomic data structures, coordinate schemas, API payloads, and database interface types are strictly typed to prevent runtime data corruption in scientific records. The UI is built on React Native Paper (MD3) with a custom botanical design system (`BotanicColors`) using a warm cream palette (`#F3EDE5` background, `#5C7A5E` primary green, `#6B4F3A` brown) that references Catalan naturalist illustration tradition.

### Backend Infrastructure

All backend services run on **Supabase** (EU-hosted, Frankfurt):

- **Database:** PostgreSQL 15 with PostGIS extension for native geospatial queries
- **Auth:** Supabase Auth with JWT tokens + Google OAuth 2.0 (`folium://` redirect scheme); sessions persisted across restarts via AsyncStorage
- **Storage:** S3-compatible buckets for observation images and user avatars; avatars fall back to a procedurally generated 300×300 px pastel canvas with a centered nature emoji
- **Edge Functions:** Deno runtime serverless functions execute consensus recalculation on vote insertion, auto-promote or archive observations, and trigger expert alert queues
- **Row Level Security:** RLS policies on every table; protected species coordinates filtered at query time in SECURITY DEFINER functions; JWT validated on every operation

### Database Schema (Key Tables)

**`profiles`** — User identity and reputation: UUID PK (1:1 with Supabase Auth), username, full_name, avatar_url, rank_level (1/2/3), reputation_score, role (student/expert/professor/admin), observation_count.

**`species`** — Master botanical dictionary: scientific_name (Latin binomial, unique), GBIF cross-reference ID, localized common names (Catalan/Spanish/English), taxonomic family, is_protected flag (triggers coordinate blur), is_alien flag (invasive species), aggregated_traits JSONB (consensus morphological characterization from all validated observations).

**`observations`** — Community data stream: PostGIS Geography column for precise coordinates, status enum (pending / community_verified / scientifically_validated), confidence_score (cumulative rank-weighted votes), moderation_score (quality/spam; auto-archives at ≤ −60), observed_traits JSONB, images JSONB array with per-photo like/dislike counters, parent_id FK for conflict-fork disagreements, editions JSONB audit log of trait changes with contributor attribution.

**`validations`** — Consensus votes with composite unique constraint on (observation_id, user_id) preventing double-voting.

**Supporting tables:** `media_votes` (granular photo quality ranking), `reports` (content moderation flags with rank-weighted impact), `plant_lists` + `plant_list_items` (user-created botanical collections).

### Build & Deployment

- **EAS Build** generates managed `.aab` (Android) and `.ipa` (iOS) binaries
- **Fastlane** automates Play Store submission (build → sign → upload → release track)
- **EAS Update** enables over-the-air JS patches post-launch without store review cycles — critical for the pilot phase
- **Resend** handles transactional emails (account deletion confirmations, expert alerts)

## Technology Stack

| Layer | Technology |
|---|---|
| Mobile Framework | Expo 52 (React Native 0.81.5) + TypeScript 5 strict |
| Navigation | Expo Router (file-based) |
| UI | React Native Paper 5.15 + custom BotanicColors system |
| Camera | expo-camera v17 |
| Location | expo-location v19 (sub-meter GPS) |
| Maps | react-native-maps 1.20 + Supercluster 8.0 (clustering) |
| AI Species ID | PlantNet API (Pl@ntNet consortium) |
| Authentication | Supabase Auth + Google OAuth 2.0 |
| Database | PostgreSQL 15 + PostGIS (via Supabase) |
| Serverless | Supabase Edge Functions (Deno runtime) |
| Storage | Supabase Storage (S3-compatible) |
| Email | Resend |
| Build | EAS Build + Fastlane |
| OTA Updates | EAS Update |
| Language | TypeScript (strict mode throughout) |

## Gamification & Social Layer

The reputation system is designed to reward sustained, quality contribution rather than raw activity:

- **Reputation Score:** Points accumulate from observations submitted, validations received, and badge triggers
- **Rank Progression:** Student → Expert → Professor via administrator role elevation, reflecting demonstrated expertise
- **Global Leaderboard:** Ranked by reputation_score with weekly and all-time views
- **Achievement Badges:** Triggered on first observation, first validation received, expert agreement milestone, and taxonomic diversity milestones
- **Push Notifications:** Via EAS Notifications for badge delivery and incoming validation alerts

The design deliberately mimics the social dynamics of academic peer review: contribution is public, ranks confer real authority in the validation model, and the leaderboard creates accountability without anonymity.

## Legal & Compliance Framework

### GDPR (EU Regulation 2016/679)

All data stored in Supabase's EU-hosted instance (Frankfurt). The Privacy Policy is permanently hosted and linked in-app, disclosing data categories, legal bases (scientific research under Art. 6(1)(e)), retention periods, and user rights.

**Right to Erasure (Article 17)** is implemented as a self-serve flow within Settings. A secure RPC function (`public.delete_account()`) with SECURITY DEFINER privileges:
- Hard-deletes personal activity: votes, validations, reports, saved lists, profile
- Anonymizes observations: sets `user_id = NULL`, preserving the scientific record under the GDPR §17(3) archival/research exception
- Cascades to Auth user deletion
- Sends a deletion confirmation email via Resend

A contextual pre-permission screen appears before the OS GPS prompt, explaining the scientific purpose of location access before the system dialog appears.

### Creative Commons BY-NC 4.0 International

All user-generated content (photos, observation records, trait data) is licensed CC BY-NC 4.0 upon submission. Users retain copyright; the platform receives a non-exclusive, royalty-free, perpetual license for the citizen science mission. This ensures free access for academic and educational use while prohibiting unauthorized commercial redistribution. The license terms are disclosed in-app in the Privacy & Legal settings section.

### Content Moderation

The `reports` table stores user-submitted flags via an in-app Report button. Each report carries rank-weighted impact on the target's `moderation_score`. This satisfies the Google Play Store's UGC safety requirement and protects data integrity without relying exclusively on manual administrator review.

## Development Timeline

The project ran from January to May 2026 as a single-developer full-stack effort across five phases:

| Phase | Period | Deliverable |
|---|---|---|
| 1. Pivot & Definition | January 2026 | Citizen science model specification; tech stack decision |
| 2. Core Infrastructure | February 2026 | Database schema; Supabase configuration; Expo scaffold; authentication |
| 3. Feature Development | March 2026 | Geospatial map; species gallery; guided observation capture flow |
| 4. Social & Gamification | April 2026 | Consensus validation engine; social feed; leaderboard and badges |
| 5. Legal & Deployment | May 2026 | GDPR tools; CC licensing; Play Store submission via Fastlane |

Three formal progress reviews with the academic tutor structured each phase transition (January, March, May 2026).

## Budget

Total project investment: **USD 25.00**

| Item | Cost |
|---|---|
| Google Play Developer Account (one-time) | $25.00 |
| Supabase (DB, Auth, Storage, Edge Functions) | Free tier |
| Expo EAS Build & Update | Free tier |
| GitHub (version control) | Free |
| Resend (transactional email, 100/day) | Free tier |
| PlantNet API (academic/research use) | Free |
| Apple Developer Program | Not purchased (iOS via Expo Go for demo) |

All services operate within free tiers, sufficient for the academic pilot scale and early adoption phases. The architecture is designed to scale to paid tiers incrementally as user volume grows.

## Academic Context

**Degree:** Biologia Ambiental (Environmental Biology)  
**Faculty:** Facultat de Biociències, Universitat Autònoma de Barcelona  
**Typology:** Projecte Industrial (Industrial Project, typology c)  
**Academic Year:** 2025–2026

Folium was evaluated as an Industrial Project TFG — a typology emphasizing applied engineering deliverables over theoretical research. The final grade formula weights the academic tutor (50%: progress reports + final written memory) and a committee panel (50%: poster, oral defense, Q&A). The platform's Play Store submission and documented pilot deployment serve as the concrete deliverable supporting both evaluation tracks.

> [!NOTE]
> The source code repository is private. The Google Play Store listing and this portfolio post are the primary public-facing references for the project.

### Project Deliverables

Here you can view and download the official academic deliverables submitted for the evaluation:

<div class="attachments-container">
<!-- Card 1: Written Memory -->
<div class="attachment-card">
<div class="attachment-preview">
<img src="assets/posts/folium/folium-project_documentation-memory-preview.png" alt="Project Memory Preview">
<div class="attachment-overlay">
<a href="javascript:openPdfModal('assets/posts/folium/folium-project_documentation-memory.pdf', 'Project Memory / Thesis')" class="overlay-btn btn-open" title="Open Preview"><i class="fas fa-eye"></i> Open</a>
<a href="assets/posts/folium/folium-project_documentation-memory.pdf" download class="overlay-btn" title="Download"><i class="fas fa-download"></i> Download</a>
</div>
</div>
<div class="attachment-header">
<div class="attachment-icon"><i class="fas fa-file-pdf"></i></div>
<div class="attachment-meta">
<span class="attachment-name" title="folium-project_documentation-memory.pdf">folium-project_documentation-memory.pdf</span>
<span class="attachment-size">2.1 MB</span>
</div>
<a href="assets/posts/folium/folium-project_documentation-memory.pdf" download class="attachment-download-btn" title="Download"><i class="fas fa-download"></i></a>
</div>
</div>

<!-- Card 2: Academic Poster -->
<div class="attachment-card">
<div class="attachment-preview">
<img src="assets/posts/folium/folium-project_documentation-poster-preview.jpg" alt="Academic Poster Preview">
<div class="attachment-overlay">
<a href="javascript:openPdfModal('assets/posts/folium/folium-project_documentation-poster.pdf', 'Academic Poster')" class="overlay-btn btn-open" title="Open Preview"><i class="fas fa-eye"></i> Open</a>
<a href="assets/posts/folium/folium-project_documentation-poster.pdf" download class="overlay-btn" title="Download"><i class="fas fa-download"></i> Download</a>
</div>
</div>
<div class="attachment-header">
<div class="attachment-icon"><i class="fas fa-file-pdf"></i></div>
<div class="attachment-meta">
<span class="attachment-name" title="folium-project_documentation-poster.pdf">folium-project_documentation-poster.pdf</span>
<span class="attachment-size">9.4 MB</span>
</div>
<a href="assets/posts/folium/folium-project_documentation-poster.pdf" download class="attachment-download-btn" title="Download"><i class="fas fa-download"></i></a>
</div>
</div>
</div>

**Status:** Submitted to Google Play Store — May 2026 | Pilot deployment at UAB Campus — June 2026
