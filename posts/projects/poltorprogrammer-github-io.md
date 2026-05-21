---
title: "PoltorProgrammer Garden"
subtitle: "Personal portfolio, resources index, blog posts, and interactive project digital garden."
visibility: "public"
category: ["tools", "designs"]
tech_stack: ["HTML", "CSS", "JavaScript"]
status: "Active Development"
github_url: "https://github.com/PoltorProgrammer/PoltorProgrammer.github.io"
demo_url: "https://poltorprogrammer.github.io"
hidden: false
---

# PoltorProgrammer.github.io — Personal Digital Garden

Your personal slice of the internet — an elegant, fast, and responsive digital garden designed to showcase your extensive programming portfolio, cataloged repositories, writings, and resources.

## Overview

Unlike heavy, dependency-bloated portfolio frameworks, this website is built on **vanilla web technologies (HTML5, CSS3, and JavaScript)** to guarantee instantaneous loading speeds, ease of customization, and perfect performance across mobile and desktop displays.

## Key Features

- **Dynamic Markdown Parsing** — Features a client-side parser (inspired by **RenderDown**) that reads `.md` files dynamically, allowing new projects to be cataloged by dropping in a simple Markdown file.
- **Dynamic Search & Filtering** — Instant search index that scans titles, subtitles, and tech stack badges across all projects with zero input lag.
- **Domain Mappings** — Categorized filters for Nature, AI & Data, Medical, Language, Designs, Tools, Blogs, and Games.
- **Sleek Typography & Aesthetics** — Modern typography powered by Google Fonts (Inter) combined with fluid grid systems, CSS variables, and high-quality dark mode and custom category gradients.
- **Background Interactive Particles** — Responsive canvas particles that add interactive visual feedback to the Hero section of the homepage.

## Core File Tree

```
├── index.html        # Main landing and domain explorer
├── garden.html       # Dynamic project grid catalog
├── contact.html      # Personal contact page
├── project.html      # Individual project markdown renderer
├── projects/
│   ├── index.json    # Active project slugs index
│   └── *.md          # Individual project files (like this one!)
├── css/
│   └── style.css     # CSS variables, tokens, and layouts
└── js/
    ├── main.js       # Main grid orchestrator and search system
    ├── reader.js     # Client-side markdown processor
    └── particles.js  # Canvas animations for the Hero area
```

> [!TIP]
> To add a new project, simply write a new Markdown file in the `projects/` directory containing the frontmatter details, and add its name slug into `projects/index.json`. The site will automatically build the card, associate the category styling, and compile the details!
