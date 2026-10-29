# Portfolio — Sanjay Chowdary Jampani

Static personal site. Plain HTML, CSS and ES-module JS, no build step.
GSAP, ScrollTrigger, Flip and Lenis are vendored in `scripts/vendor/`.
Layout and motion are from the open "Breaking Code" template by
Alluri Lakshman Narendra; the content is mine.

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Edit

- Text and numbers: `index.html` (sections commented `00`–`05`; stats use `data-count`).
- Colours, type, spacing: `styles/tokens.css`.
- Résumé: replace `assets/resume.pdf`.

## Deploy

Vercel, framework "Other", no build command. `vercel.json` sets cache headers.
