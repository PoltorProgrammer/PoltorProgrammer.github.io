---
title: "Analisi SUS"
subtitle: "SUS (System Usability Scale) usability analyzer to evaluate user experience and generate interactive charts."
visibility: "public"
category: ["nature", "tools"]
tech_stack: ["Python", "Pandas"]
status: "Completed — May 2025"
github_url: "https://github.com/PoltorProgrammer/Analisi_SUS"
demo_url: ""
hidden: false
---

# Analisi SUS (System Usability Scale)

A custom usability analytics and reporting script developed in Python to parse, compute, and visualize survey responses using the standard **System Usability Scale (SUS)** framework.

## Overview

Software quality is determined not just by feature sets, but by how easily target audiences can navigate interfaces. To mathematically assess the usability of the **UAB Botanical Gallery** and **Folium** applications, this Python script automates the scoring algorithm of SUS surveys and generates clean visual summaries for academic publication.

## Key Features

- **Automated Score Calculations** — Converts 5-point Likert scale question configurations into standard SUS scores (from 0 to 100).
- **Pandas Ingestion** — Reads survey answers directly from CSV exports (e.g., from Google Forms, Kobotoolbox, or Excel matrices).
- **Statistical Analytics** — Calculates the overall mean score, standard deviations, median scores, and percentile rankings.
- **Data Visualization** — Generates charts showing the score distribution, acceptability thresholds (e.g., "Acceptable", "Marginal", "Unacceptable"), and grade mappings (A+ to F).

## Understanding SUS Scoring

The script processes ten standard statements (alternating between positive and negative):
1. For odd-numbered questions: `Score = Response - 1`
2. For even-numbered questions: `Score = 5 - Response`
3. The sum of these values is multiplied by `2.5` to yield the final SUS score.

```python
# Core logic snippet
def calculate_sus(row):
    odd_sum = sum(row[odd_cols]) - len(odd_cols)
    even_sum = (5 * len(even_cols)) - sum(row[even_cols])
    return (odd_sum + even_sum) * 2.5
```

> [!TIP]
> A SUS score above **68** is considered average. The UAB Botanical Cataloging interfaces achieved exceptional usability benchmarks throughout our field trials.
