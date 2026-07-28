# MedPath UK reference e-book generator

Generates a print-ready reference guide from the **same data the site uses**
(specialty scoring matrices, the Arabic layer, the resources library, and the
official links). Two outputs, one per language:

- `dist/medpath-guide-en.html` — English, left-to-right
- `dist/medpath-guide-ar.html` — Arabic, right-to-left (Cairo font)

It never invents a score: only specialties whose criteria are verified against
an official source get a scoring matrix; the rest are listed as "no published
score", exactly as the site treats them.

## Regenerate

From the repo root (with the portable Node on PATH):

```bash
node_modules/.bin/tsx tools/ebook/generate.ts
```

The `dist/` output is git-ignored — regenerate it whenever the scoring data,
Arabic layer, resources, or links change, and the book updates itself.

## Turn it into a PDF

Open either HTML file in Chrome and **Print → Save as PDF** (enable
"Background graphics"). This gives the best quality, including correct Arabic
shaping.

This tool lives under `tools/` and is **not** part of the deployed app — it is
excluded from `tsconfig` and the Railway build.
