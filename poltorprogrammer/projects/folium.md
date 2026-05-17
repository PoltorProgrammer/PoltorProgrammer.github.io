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

# Folium — Botanical Cataloging App

Biodiversity monitoring at fine geographic scales faces a persistent gap between generic citizen science platforms and the specific operational needs of bounded locations. **Folium** bridges that gap for the UAB (Universitat Autònoma de Barcelona) campus.

## Overview

Folium is a full-stack mobile application designed for fine-grained botanical cataloging. It allows campus users to identify, document, and geolocate plant species, contributing to a live biodiversity map maintained through PostGIS spatial queries.

## Key Accomplishments

- **Consensus-based validation model** adapted from iNaturalist's Research Grade system — observations require multi-user agreement before being marked verified
- **Row-Level Security (RLS)** in Supabase to protect sensitive coordinate data from unauthorized access
- **Pl@ntNet API** integration for automated plant pre-identification with confidence scoring
- **GDPR Article 17** self-serve account and data erasure function
- **Offline-first** architecture with optimistic local writes and background sync on connectivity restore

## Architecture

The system uses a hub-and-spoke data model. Observations flow from the mobile client through Supabase's real-time layer into a PostGIS-enabled PostgreSQL database, enabling spatial queries at both the species and habitat level.

The mobile client is built with React Native and Expo, targeting both iOS and Android from a single codebase, with a shared TypeScript domain layer between client and edge functions.

## Development Context

Folium was developed as a TFG (Treball de Fi de Grau) project at UAB. The scope covers the full engineering lifecycle: requirements gathering with the campus biology department, system design, implementation, field testing, and a formal defence.

> [!IMPORTANT]
> This repository is private. The source code is not publicly accessible.
