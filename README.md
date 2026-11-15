# Archit Gupta — Resume Website

My personal resume website, built with plain HTML and styled with CSS for the
Web Development mid-term project.

**Live site:** https://ar970.github.io/portfolio-iimb/

## What's on the page

| Section | What it shows |
|---------|---------------|
| Hero | Name, rotating roles, intro, quick stats |
| About | My story, quick facts, focus areas and toolbox (bento grid) |
| Education | IIM Bangalore and Mesa School of Business |
| Experience | Vyaasa, Go Zero, Nutri Ladooz, the brands I built, leadership roles |
| Projects | 12 filterable project cards, each with a details pop-up |
| Journey | The longer story in three acts, with photos and voice notes |
| Awards | Hackathon and competition results with a photo collage |
| Contact | Email, LinkedIn, GitHub and a contact form |

## Folder structure

```
.
├── index.html          # all content and page structure
├── css/
│   └── style.css       # every style: tokens, layout, components, animations
├── js/
│   └── script.js       # small enhancements (menu, filters, pop-up, scroll effects)
└── assets/
    ├── images/         # photos and logos
    ├── audio/          # voice notes used in the Journey section
    └── docs/           # capstone reports (PDF)
```

## Design choices

- **Fonts (Google Fonts):** Fraunces for headings, DM Sans for body text,
  DM Mono for small labels and dates.
- **Colours:** warm paper background with ink-black outlines, and three accents —
  tangerine, emerald and marigold — defined once as CSS variables in `:root`.
- **Layout:** Flexbox for the navigation bar and rows, CSS Grid for the hero,
  bento grid, project cards and timelines.
- **Positioning:** sticky navigation and section headings, absolutely positioned
  badges around the portrait, and a tilted photo collage.
- **Motion:** CSS keyframe animations and transitions (word rotator, ticker,
  floating badges, hover lifts), plus scroll reveals. Everything switches off for
  visitors who prefer reduced motion.

## Run it locally

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.
