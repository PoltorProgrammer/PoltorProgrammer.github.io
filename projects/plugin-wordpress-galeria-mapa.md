---
title: "Plugin Wordpress Galeria Mapa"
subtitle: "Custom WordPress plugin integrating Leaflet.js to map and display UAB botanical galleries."
visibility: "public"
category: ["nature", "tools"]
tech_stack: ["PHP", "JavaScript", "Leaflet.js"]
status: "Completed — May 2025"
github_url: "https://github.com/PoltorProgrammer/Plugin_Worpress_Galeria_Mapa"
demo_url: ""
hidden: false
---

# Plugin Wordpress Galeria Mapa

A custom WordPress plugin developed to integrate interactive botanical map layers, geolocation markers, and high-fidelity plant profiles directly into the official UAB campus blogs.

## Overview

University blogs and department sites require a simple, native way to showcase botanical discoveries without building custom micro-sites from scratch. This PHP and JavaScript plugin exposes easy shortcodes to embed maps powered by **Leaflet.js**, linking physical coordinates on campus to specific plants in the academic catalog.

## Key Features

- **Leaflet.js Integration** — Lightweight, highly responsive maps that display campus-specific tiles and marker clusters.
- **Shortcode Powered** — Simple WordPress shortcodes (`[botanical_map]`) allowing department writers to insert maps on any post or page.
- **Custom Marker Modals** — Clicking a map marker opens a customized popup displaying the plant's scientific name, family, thumbnail image, and a link to its full gallery description.
- **Responsive Controls** — Integrated zoom, layer switching, and fullscreen support optimized for both mobile screens and desktop monitors.

## How it Works

The plugin registers custom assets within the WordPress hook ecosystem:

1. **PHP Core** — Hooks into `wp_enqueue_scripts` to load Leaflet resources only when the shortcode is called, keeping page speeds optimal.
2. **Data Parsing** — Enqueues and parses local geo-coordinate files or queries to build marker datasets.
3. **Frontend Rendering** — Renders the interactive canvas on the client side with lightweight custom JavaScript.

> [!IMPORTANT]
> The plugin is fully optimized for performance, utilizing marker clustering to prevent performance degradation when displaying hundreds of botanical data points simultaneously.
