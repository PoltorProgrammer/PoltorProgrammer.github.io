---
title: "Folium: End-to-End Design and Implementation of a Location-Scoped Citizen Science App for Botanical Cataloging"
subtitle: "How a single developer built, deployed, and shipped a Play Store app for community botanical monitoring — with expert-weighted consensus, PostGIS spatial queries, and full GDPR compliance"
date: "2026-05-25"
tags: ["citizen-science", "mobile", "react-native", "biodiversity", "supabase", "typescript", "GDPR", "expo"]
projects: ["folium"]
cover_color: "nature"
---

## App Demo

<!-- Replace the URL below with your YouTube / Vimeo link once the video is uploaded -->
<!-- Example: https://www.youtube.com/watch?v=YOUR_VIDEO_ID -->

<div class="video-demo-container">
    <div class="video-column">
        <video src="assets/posts/folium/folium-app_demo-video.mp4" controls autoplay muted loop playsinline></video>
    </div>
    <div class="desc-column">
        <span class="video-badge">Screen Recording</span>
        <h3>Application Walkthrough</h3>
        <p>A screen recording of the Folium mobile application demonstrating the guided observation flow (including sub-meter GPS tagging and PlantNet AI suggestions), the interactive geospatial map, and the card-swipe validation interface.</p>
    </div>
</div>

---

# The Problem with Global Platforms at Local Scale

My previous TFG at UAB produced a botanical gallery of campus plant species — a structured dataset, a web viewer, a WordPress plugin. It worked. But it was static. Someone had to go out, measure, photograph, and manually enter every record. That process does not scale, and it does not survive the graduation of the person who built it.

The logical next question was: *could the campus community maintain and expand that record themselves?*

Platforms like iNaturalist exist for exactly this purpose, and they are genuinely impressive. But they are built for the world, not for a campus. There is no concept of institutional role hierarchy — a UAB biology professor carries the same observational authority as a casual user in Reykjavik. There is no location-scoped gamification that rewards you specifically for documenting what grows between the Faculty of Biosciences and the student cafeteria. And there is no mechanism for the institution to assign trust levels that reflect real-world credentialed expertise.

Folium started from that gap.

## The Citizen Science Model

Before writing a single line of code, I had to decide what kind of data quality guarantee the platform would make. Citizen science has a reputation problem: the data is abundant but noisy, and downstream researchers often cannot tell which records to trust.

The answer I settled on is borrowed from two existing systems and combined into something new. iNaturalist uses a Research Grade threshold — an observation reaches it when the community agrees on the identification. ICO (Institut Català d'Ornitologia) uses expert alert queues, where credentialed specialists can fast-track records that matter. Folium merges both into a single continuous confidence spectrum.

Every validation vote carries rank-weighted authority. A student vote is worth 5 points. An expert is worth 25. A professor is worth 50 — enough alone to certify a record as scientifically validated. The thresholds are not binary: an observation moves from `pending` to `community_verified` at 50 points (ten student agreements, two expert confirmations, or one professor stamp), and from there to `scientifically_validated` via sustained consensus or direct professor review. The confidence score is always visible. Downstream users can apply their own quality threshold without waiting for the platform to make a binary call.

This design decision shaped everything that came after. It meant I needed a role system, a voting table with rank-weighted semantics, serverless functions to recalculate state on every vote insertion, and a UI that makes the validation gesture fast enough to do dozens of times in a session. The card-swipe interface for the Validation Swiper came directly from that constraint — it had to be effortless.

## Choosing the Stack

I knew the app needed to be native mobile. A web app wrapped in a WebView would have meant losing direct camera sensor access and sub-meter GPS precision — both of which matter for the scientific validity of submitted records. A photo taken through a web camera API and a coordinate rounded to browser geolocation accuracy are measurably worse for botanical field data than what a native SDK gives you.

The question was Expo versus bare React Native. I chose Expo for a specific reason: EAS Build gives a solo developer a managed build pipeline without maintaining a Mac for iOS compilation or a dedicated Android CI environment. For an academic project with a hard submission deadline, that operational simplicity was worth every constraint the managed workflow imposes.

For the backend, Supabase was the right call. PostgreSQL with PostGIS gives real spatial queries — I am not doing geospatial filtering in application logic on a JSON field, I am running `ST_DWithin` and `ST_Buffer` at the database layer. Supabase also bundles authentication, storage, Edge Functions, and Row Level Security into a single platform, which means I am not stitching together four different services with four different billing accounts and four different failure modes. For a solo developer building a production app with a five-month runway, that consolidation is a strategic decision, not just a convenience.

The one external service I added was PlantNet. Their API covers academic and research use at no cost, and the Pl@ntNet consortium (INRAE, CIRAD, INRIA, IRD) has taxonomic coverage that would take years to replicate. The integration is advisory-only by design: PlantNet pre-populates the species field with its top-ranked candidate, the user reviews and overrides before submission, and the final identification is always attributed to a human. Machine suggestion feeding community consensus — not replacing it.

## The Validation Layer in Practice

Implementing the confidence model was the most technically interesting part of the project. The naive implementation would recalculate confidence scores in a cron job or on-demand. I needed it to happen in real time, on vote insertion, with automatic status promotion.

The solution is a Supabase Edge Function (Deno runtime) triggered on every insert into the `validations` table. It reads the current vote distribution for that observation, applies rank weights, recalculates the confidence score, and writes the new status back in a single transaction. If the threshold is crossed, the observation is promoted. If the moderation score drops below −60 (via report flags), the observation is auto-archived without requiring administrator intervention. No polling, no manual review queue for routine cases.

The rank weights also apply to content moderation. Reports carry weighted impact on the target observation's `moderation_score`, meaning an expert flagging something as problematic has more consequence than a student doing the same — which mirrors how institutional credibility works in practice.

One detail I am particularly glad I got right: protected species. Coordinates for species marked `is_protected` in the species table are blurred to a 5 km grid *at the query layer*, inside a SECURITY DEFINER function, before the data ever leaves the database. The mobile client never receives the precise coordinate. This is not just good practice — it is the only approach that actually protects the data, because anything enforced only on the client can be bypassed.

## GDPR Was Not Optional

I knew going in that GDPR compliance would be required for Play Store approval, but I underestimated how much thought the right implementation requires. The surface area is larger than "add a privacy policy."

The most interesting piece is Article 17 — the Right to Erasure. A naive implementation deletes the user's account and cascades to delete all their observations. But that destroys scientific records that the community has already validated and that other users have built on top of. The correct interpretation of GDPR §17(3) permits retaining data for archival and scientific research purposes even after an erasure request — provided the data is anonymized.

The implementation is a single RPC function (`public.delete_account()`) with SECURITY DEFINER privileges. It hard-deletes personal activity: votes, validation records, reports, saved plant lists, the profile row. It anonymizes observations by setting `user_id = NULL`, preserving the scientific record while severing the personal link. It cascades to the Auth user deletion and triggers a confirmation email via Resend. The whole flow is self-serve from within the app's Settings screen — no support ticket, no waiting period, no administrator approval. That is what compliance actually means.

I also added a contextual pre-permission screen that appears before the OS GPS dialog. It explains in plain language why location access is needed and what it is used for, before the system prompt appears. This is not a regulatory requirement — it is just good practice, and it makes a measurable difference in permission acceptance rates.

## The Play Store Submission

Fastlane handles the build and submission pipeline. The Fastfile defines lanes for Android (EAS build → `.aab` → Play Store upload) and iOS (EAS build → `.ipa` → TestFlight). The production build uses EAS's managed infrastructure, which means I am not storing signing keys locally or running a custom Gradle environment.

The Play Store review checklist turned out to be substantial. Beyond the privacy policy and account deletion flow, it required: content moderation functionality for user-generated content, permission strings in the device's primary language (Catalan, in this case), a reviewer test account with pre-seeded content, and a support contact visible in the app. Every item on that list has a documented reason — the Play Store review process has clearly been shaped by the kinds of compliance failures that historically got apps removed.

EAS Update gives me over-the-air JavaScript patches for post-launch fixes. During the pilot phase at UAB, this matters: if something breaks in the first week of real user traffic, I can push a fix without waiting for a store review cycle.

## What the Numbers Look Like

The total project investment was 25 USD — the Google Play Developer account fee, which is a one-time charge. Supabase, EAS, GitHub, Resend, and PlantNet all operate within free tiers. For an academic pilot expected to reach a few hundred users on a single campus, the free tiers are not a compromise — they are the correct operational choice. The architecture scales to paid tiers if the pilot succeeds and the platform expands to other institutions.

## What I Would Do Differently

**The observation form is too long.** Five steps was the right number for ensuring data quality, but the UX friction is real. I would redesign the trait completion step to use visual selectors with illustrations rather than dropdowns — something closer to a field guide than a form.

**TypeScript strict mode from day one.** I enforced it throughout, but there were moments early in development where I added `// @ts-ignore` and came back to fix it later. Every single one of those was hiding a real bug. Strict mode is not overhead — it is a guarantee that the data flowing between your mobile client, your edge functions, and your database tables is what you think it is. For a project handling GPS coordinates and taxonomic identifiers, that guarantee has real scientific consequences.

**Start the legal layer earlier.** I left GDPR and CC licensing until the final phase, which meant some of the data model decisions earlier in the project had to be revisited. The erasure logic, in particular, influenced the `observations` schema — specifically the decision to use `user_id = NULL` for anonymization rather than a separate anonymized-observations table. That decision should have been made in February, not April.

## The Result

Folium is submitted to the Google Play Store and scheduled for its first pilot deployment at the UAB Campus in June 2026. The platform generates scientific-grade biodiversity records from non-specialist users, costs essentially nothing to operate at pilot scale, and is designed so that the campus community can maintain and expand the species catalogue after I graduate.

Whether the gamification is strong enough to sustain engagement beyond the initial novelty period is the open question. That is what the pilot will answer.

The source code is private, but the architecture, the compliance approach, and the design decisions are documented here and in the project post. If you are building something in the same space — citizen science, community monitoring, institutional biodiversity tools — I am happy to talk through the specifics.

## Project Documentation

Here you can view and download the official academic deliverables submitted for the Final Degree Project (TFG) at UAB.

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

---

## Data Erasure Requests

To request the deletion of your Folium account and all associated personal data, please contact:

**poltorprogrammer@gmail.com**

Include the username or email address linked to your account. Your data will be permanently deleted within 30 days in accordance with GDPR Article 17. Observation records contributed to the scientific catalogue will be anonymised and retained as permitted under GDPR §17(3) for archival and research purposes.
