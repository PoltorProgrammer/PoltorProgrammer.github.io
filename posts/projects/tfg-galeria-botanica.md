---
title: "TFG Galeria Botanica"
subtitle: "Main cataloging gallery repository for the UAB Faculty of Biosciences flora project."
visibility: "public"
category: ["nature", "botanics"]
tech_stack: ["HTML", "CSS", "JavaScript"]
status: "Completed — May 2025"
github_url: "https://github.com/PoltorProgrammer/TFG_Galeria_Botanica_Maig_2025"
demo_url: "https://poltorprogrammer.github.io/TFG_Galeria_Botanica_Maig_2025"
hidden: false
---

# TFG Galeria Botànica (May 2025)

The main visualization and user-facing presentation layer for the UAB (Universitat Autònoma de Barcelona) botanical cataloging project. This repository hosts the public gallery showcasing the diverse flora of the Faculty of Biosciences.

## Overview

Developed as part of your Bachelor's Thesis (TFG), this web application serves as a clean, responsive interface for students, researchers, and campus visitors to explore documented botanical species. It bridges scientific accuracy with intuitive visual learning.

## Key Features

- **Dynamic Plant Catalog** — Responsive grid display of cataloged campus flora with high-resolution imagery and scientific names.
- **Advanced Filtering** — Sort and search plants by family, common names, location, and flowering periods.
- **Taxonomic Classification** — Detailed taxonomical profiling for each species, including Kingdom, Division, Class, Order, Family, Genus, and Species.
- **Responsive Layout** — Designed to be fully responsive for field use on mobile devices while conducting campus botanical tours.

## Core Structure

```
├── index.html        # Main landing and gallery interface
├── css/
│   └── main.css      # Core styles, variables and layout
├── js/
│   ├── gallery.js    # Ingestion and rendering of plant data
│   └── search.js     # Search indexes and filters
└── data/
    └── plants.json   # Structured JSON database of cataloged flora
```

## Academic Context

This gallery represents the interface component of the TFG workflow. It allows users to visually inspect and search the data gathered in the field using **Folium** and managed via the **Editor Dades Galeria** tool.

> [!NOTE]
> All botanical species displayed in this gallery have been academically validated by Faculty experts prior to publication.
