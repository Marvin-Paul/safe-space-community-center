# Safe Space Community Center — website

A fast, accessible, single-page website for **Safe Space Community Center (SSCC)**, a community-based organisation in Kireka Kamuli, Wakiso District, Uganda.

The site is built from the organisation's profile: vision, mission, values, programmes, membership, governance, financial accountability and contact details.

## Preview it

Open `index.html` directly in a browser, or serve the folder locally:

```powershell
python -m http.server 5173 --directory .
```

Then visit <http://localhost:5173>.

## Files

```
website/
├── index.html            # All page content and structure
├── assets/
│   ├── css/styles.css    # Design system, layout and responsive rules
│   ├── js/main.js        # Navigation, reveals, counters, accordion, form
│   └── img/
│       ├── logo.png          # Full logo (footer, social card)
│       ├── logo-mark.png     # Shield mark (header)
│       ├── favicon.png
│       ├── apple-touch-icon.png
│       ├── og-image.png      # Social sharing preview
│       └── photo-1/2/3.jpg   # Section photographs
└── README.md
```

No build step, no framework, no dependencies. Fonts load from Google Fonts (Fraunces + Manrope) with system fallbacks.

## Editing content

All copy lives in `index.html`, grouped by section with clear anchors:

- `#top` — hero
- `#about` — who we are, vision, mission, organisation details
- `#values` — five core values
- `#work` — programmes and annual campaigns
- `#impact` — commitment statistics
- `#membership` — member categories, eligibility, how to join
- `#governance` — leadership, meetings, finances, code of conduct
- `#partner` — partnership invitation
- `#donate` — donor enquiry section
- `#contact` — contact details and message form

To change the colour palette or type scale, edit the custom properties at the top of `assets/css/styles.css` (`--forest`, `--clay`, `--sand`, etc.).

## Contact form

The form validates in the browser and then opens the visitor's email app with a pre-filled message to `safespacecc01@gmail.com`. No server or third-party form service is required. To collect submissions server-side later, replace the `mailto:` hand-off in `assets/js/main.js` with a `fetch()` call to your form endpoint.

## Images

The site includes three photographs in `assets/img/` (`photo-1.jpg`, `photo-2.jpg`, `photo-3.jpg`) placed in the About, Work and Membership sections. To replace them, keep the same file names and update the `width`/`height` attributes in `index.html` if the aspect ratio changes. All images are lazy-loaded.

## Logo

The organisation's logo lives in `assets/img/`. `logo-mark.png` is the shield-only crop used in the header; `logo.png` is the full logo used in the footer. If you replace the artwork, keep the same file names and update the `width`/`height` attributes in `index.html` if the aspect ratio changes.

## Design notes

The site uses a warm, editorial visual identity: forest green `#0E3B32`, sand `#F6F1E7`, cream `#FCFAF5`, clay `#B4552F` and gold `#DDA84A`. Typography pairs Fraunces (display) with Manrope (body). The hero and section illustrations are inline SVG so they stay sharp at any size and add no download weight.

Content was trimmed to keep sections scannable: short ledes, compact lists, and accordion-gated detail in governance.

## Accessibility and performance

- Semantic landmarks, one `h1`, labelled form fields and a skip link
- Visible focus states and `prefers-reduced-motion` support
- Responsive from 360px to wide desktop
- Lightweight assets: the hero artwork is inline SVG and the logo files are optimised
- Works without JavaScript: content stays visible and the accordion opens by default

## Content source

Built from *Safe Space Community Center — Organizational Profile* (constitution adopted 27 August 2026).
