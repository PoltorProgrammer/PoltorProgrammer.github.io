---
title: "Google DLP Sensitive Data"
subtitle: "De-identifies clinical records and PII secure pipelines using the Google Cloud DLP API."
visibility: "public"
category: ["ai", "medical"]
tech_stack: ["Python", "GCP DLP API"]
status: "Released"
github_url: "https://github.com/PoltorProgrammer/Google-DLP-Sensitive-Data-Protection"
demo_url: ""
hidden: false
---

# Google DLP Sensitive Data Protection

A secure data processing pipeline written in Python that leverages the **Google Cloud DLP (Data Loss Prevention) API** to automate the detection, classification, and redaction of Personally Identifiable Information (PII) and Protected Health Information (PHI) from unstructured clinical documents.

## Overview

When processing medical records for research, training datasets, or auditing, protecting patient privacy is a critical legal and ethical requirement under regulations like GDPR and HIPAA. This project implements a modular, high-throughput de-identification wrapper that redacts sensitive text (such as names, IDs, addresses, and telephone numbers) before data is processed by downstream AI agents.

## Key Features

- **Automated PII/PHI Detection** — Uses Google Cloud's extensive list of built-in infoTypes (e.g., `PERSON_NAME`, `PHONE_NUMBER`, `EMAIL_ADDRESS`, `IP_ADDRESS`, `US_SOCIAL_SECURITY_NUMBER`).
- **Flexible De-identification Methods** — Supports full redaction (removing text), masking (replacing characters with `*`), or cryptographic tokenization (replacing sensitive fields with reversible unique hashes).
- **Multi-format Support** — Handles plain text, CSV rows, and structured JSON inputs.
- **Robust Error Handling & Limits** — Handles API quotas, retries, and large-file splitting automatically.

## Sample Python Implementation

```python
from google.cloud import dlp_v2

def deidentify_text(project_id, text, info_types):
    dlp = dlp_v2.DlpServiceClient()
    parent = f"projects/{project_id}"
    
    # Configure infoTypes to search for
    inspect_config = {"info_types": [{"name": it} for it in info_types]}
    
    # Configure masking action
    deidentify_config = {
        "info_type_transformations": {
            "transformations": [{
                "primitive_transformation": {
                    "character_mask_config": {"masking_character": "*"}
                }
            }]
        }
    }
    
    # Request execution
    response = dlp.deidentify_content(
        request={
            "parent": parent,
            "deidentify_config": deidentify_config,
            "inspect_config": inspect_config,
            "item": {"value": text},
        }
    )
    return response.item.value
```

> [!WARNING]
> Running this script requires an active Google Cloud Platform (GCP) project with the DLP API enabled and credentials exported locally via the `GOOGLE_APPLICATION_CREDENTIALS` environment variable.
