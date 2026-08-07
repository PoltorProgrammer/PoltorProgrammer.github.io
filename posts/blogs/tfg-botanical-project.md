---
title: "Building a Botanical Gallery: From the UAB Campus to the Web"
subtitle: "How a university thesis became a full data pipeline, a custom WordPress plugin, and a spatial map of living plant specimens"
date: "2024-07-01"
tags: ["thesis", "biology", "botany", "web-dev", "spatial", "wordpress"]
projects: ["tfg-galeria-botanica", "editor-dades-galeria", "plugin-wordpress-galeria-mapa", "memoria-tfg", "analisi-sus"]
cover_color: "nature"
---

# The Origin of the Project

My university thesis at the **Universitat Autònoma de Barcelona (UAB)** started from a straightforward question: *could the biodiversity of the campus be made accessible and usable by students, researchers, and curious visitors?*

The UAB campus is unusual. It holds a remarkable concentration of plant species — trees, shrubs, and herbaceous plants dispersed across hectares of academic grounds. Most of them are unlabelled, unknown, and effectively invisible to anyone walking by. The goal of my TFG (Treball de Fi de Grau) was to change that.

## What the Project Became

What started as a documentation exercise grew into a full software project with multiple interconnected components. Here is how the repositories fit together.

---

## The Gallery — Data and Visualization

The central piece is the **botanical gallery** itself: a structured database of species found on campus, each with photographs, taxonomic classification, phenological data, and geolocation. The gallery was built as a standalone web application that lets users browse species by family, filter by flowering period, and explore a spatial map of where each specimen can be found.

The gallery was built entirely in-house — no CMS, no third-party database. It reads from a custom JSON structure designed to balance expressiveness with simplicity.

## The Editor — Managing the Data

Data entry for a botanical catalogue is non-trivial. Every record requires cross-referenced Latin names, multiple photographs, hand-measured coordinates, and phenological observations. A manual JSON editor would have been a constant source of human error.

So I built a **dedicated data editor** — a browser-based tool with form validation, image preview, coordinate pickers, and automatic JSON serialization. The editor acts as an internal CMS for the gallery: fill out a structured form and it produces a valid data record ready to merge.

This separation of concerns — viewer vs. editor — turned out to be one of the best architectural decisions of the project. The gallery code never needed to handle input validation or dirty state, and the editor never needed to know how data was rendered.

## The WordPress Plugin — Integration with University Infrastructure

The UAB uses WordPress for departmental and faculty websites. Rather than asking biology departments to link out to an external site, I built a **WordPress plugin** that embeds the gallery directly into any WordPress page via a shortcode.

The plugin exposes an interactive **Leaflet.js map** with clickable plant markers, species cards, and filtering controls — all self-contained in a PHP + JavaScript bundle that installs cleanly without modifying the theme or core WordPress files.

This was my first serious encounter with the WordPress plugin architecture, and it forced me to think carefully about namespacing, asset enqueueing, and the tension between plugin portability and site customization.

## The Thesis Document — Academic Documentation

The formal academic thesis (*Memoria TFG*) covers the full project from biological methodology to software architecture. It includes field observation protocols, the data model rationale, usability study results, and a critical reflection on what worked and what I would do differently.

The document is available publicly as a PDF export and as structured Markdown source. Writing it in Markdown first and then converting to PDF gave me version-controlled, diff-friendly documentation — a habit I have kept ever since.

## Usability Study — Evaluating the Interface

The final component was a structured usability evaluation using the **System Usability Scale (SUS)** applied to the gallery interface. Participants from the biology faculty tested the gallery with a set of predefined tasks, and I collected both quantitative scores and qualitative feedback.

The analysis revealed patterns that shaped a late round of UI revisions — particularly around the map interaction model and the species detail view layout.

---

## What I Learned

**Biological naming is harder than it looks.** Latin nomenclature has synonyms, revisions, and contested classifications. A seemingly simple field like `species_name` hides real complexity.

**The editor is not optional.** Any project with structured data that humans need to enter will suffer without a purpose-built editing interface. Building it is not overhead — it is the difference between a maintainable dataset and a mess.

**Integration constraints are real.** The WordPress plugin had to work inside an institution's technology stack, which meant accepting limitations: PHP version pinning, plugin API stability, no access to server configuration. Designing for that environment from the beginning would have saved time.

**User testing changes your mind.** I thought the map was intuitive. The participants did not agree. Watching someone struggle with an interface you built is the most direct form of design feedback available.

## The Result

The botanical gallery of the UAB campus is live, documented, and extensible. The data editor is still the tool used to maintain and expand the catalogue.

More importantly, the project left behind a set of repositories that are independently useful — a gallery that can be adapted for any botanical collection, an editor that generalizes to any structured catalogue, and a WordPress plugin pattern that can be reused for similar institutional integrations.
