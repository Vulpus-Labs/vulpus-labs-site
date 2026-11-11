# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Vulpus Labs website (vulpuslabs.com) built with Hugo static site generator (v0.145.0+extended).

## Development Commands

### Local Development
```bash
# Start development server with drafts
hugo server --buildDrafts

# Start development server (production-like)
hugo server

# Build the site
hugo

# Create new content
hugo new content posts/my-post.md
hugo new content <section>/<filename>.md
```

## Architecture

### Site Structure
- `content/` - Markdown content files organized by section
- `layouts/` - Site-level template overrides
- `themes/vulpus-labs/` - Custom theme for the site
  - `layouts/` - Theme templates (list pages, single pages, partials, shortcodes)
  - `static/` - Theme static assets (CSS, JS, images)
  - `assets/` - Theme assets processed by Hugo Pipes
- `static/` - Site-level static files (served as-is from root)
- `assets/` - Site-level assets for Hugo Pipes processing
- `data/` - Data files (JSON, YAML, TOML) for use in templates
- `i18n/` - Translation files for internationalization
- `archetypes/` - Content templates for `hugo new` command

### Template Hierarchy
Hugo uses a template lookup order. Site-level layouts in `layouts/` override theme layouts. Key template types:
- `_default/baseof.html` - Base template defining overall structure
- `_default/list.html` - List pages (section indexes)
- `_default/single.html` - Single content pages
- `partials/` - Reusable template components
- `index.html` - Homepage template

### Configuration
Site configuration is in `hugo.toml` at the root. Key settings:
- `baseURL` - Production site URL (https://vulpuslabs.com/)
- `theme` - Active theme name (vulpus-labs)
- `title` - Site title
- `params.description` - Site description shown on homepage
- `params.links` - Sidebar resource links (docs, repos, products)

### Theme Design

The custom "vulpus-labs" theme presents the products as a portfolio: the site
exists to get people playing the browser builds and then downloading the
plugins.

**Brand Identity:**
- Independent, innovative, transparent software development
- Logo: `themes/vulpus-labs/assets/logo.png` - stylized fox head (white, on transparent)
- Tagline: "know many things" (inspired by Archilochus)

**Visual Design:**
- Quiet dark style: warm charcoal surfaces, soft off-white text, hairline
  rules, small radii, no glows, gradients or 3D effects
- Type is a single serif family, Source Serif 4, for headings and body, with
  IBM Plex Mono for code (both from Google Fonts, linked in
  `partials/head.html`); labels and chips use small caps
- `--accent` is a CSS custom property. Each product overrides it inline from
  its `accent` front-matter key. Nothing paints `--accent` directly: the CSS
  derives `--tone` (the accent mixed toward a warm grey) plus `--accent-soft` and
  `--accent-line` and `--tone-fill` (the darker button fill), and redeclares them on any element whose `style` sets
  `--accent`, so product colours stay muted
- Responsive; honours `prefers-reduced-motion`

**Layout Features:**
- Sticky header; nav (Products, Blog, Repos, Store, Contact) from
  `[menus.main]` in hugo.toml, entries with `params.external = true` open in a
  new tab
- Templates are full-bleed: `baseof.html` no longer constrains width. Each
  section supplies its own `.wrap` (max 1180px) or `.wrap .wrap-prose`
  (max 46rem, for running text)
- Homepage: hero (headline, spec chips, then every web-demo product's
  faceplate side by side, each with its own play link) → one
  showcase slab per product with a `webdemo` (PolyKritter, vxn-1c, vxn-2b), alternating sides → other products → blog
- Product pages: hero with faceplate shot and a browser CTA, gallery, sound
  examples, prose, a repeat web-demo call-out, downloads, cross-links to the
  rest of the range
- No sidebar — the monthly archive is a jump-link row on `/posts/`

**Key Template Files:**
- `themes/vulpus-labs/layouts/_default/baseof.html` - header, content, footer
- `themes/vulpus-labs/layouts/index.html` - homepage; its copy comes from
  `content/_index.md` (front matter `hero`, `synths`, `others`, `blog`; the
  body is the hero paragraph)
- `themes/vulpus-labs/layouts/products/single.html` - product page
- `themes/vulpus-labs/layouts/products/list.html` - products index
- `themes/vulpus-labs/layouts/_default/single.html` - posts and standalone
  pages; the date line is omitted when the page has no date (e.g. /contact/)
- `themes/vulpus-labs/layouts/partials/shot.html` - a faceplate screenshot in a
  faux plugin window; resizes to webp and can wrap the shot in a link
- `themes/vulpus-labs/layouts/partials/product-showcase.html` - one product as a
  showcase slab, shared by the homepage and the products index
- `themes/vulpus-labs/layouts/partials/os-icon.html` - platform glyph for download cards
- `themes/vulpus-labs/assets/css/main.css` - complete styling (Hugo Pipes)

**Product screenshots:**

Product page bundles carry `faceplate.png` (the hero shot) and any number of
`faceplate-<detail>.png` files, which render as a gallery below the hero. They
are generated from the shipped web builds:

```bash
npm i puppeteer                          # not committed; the site has no build deps
node scripts/capture-faceplates.mjs
```

Regenerate them whenever a synth's faceplate changes. Hugo resizes them to webp
at build time, so commit the full-size PNGs.

**Front Matter:**

Posts should include `readingTime` parameter (minutes) for display in post cards.

Products (`type = "products"`) use:

- `range = "vxn"` - groups the page into the VXN range on the homepage and
  products list
- `accent` - hex colour driving `--accent` on that product's pages and cards
- `tagline` - one line under the title; `blurb` - the extra sentence shown in
  showcase slabs
- `version` - display version (`v0.1.1`); `release` - the git tag downloads
  resolve against
- `releaseRepo` - overrides `params.releaseRepo` in hugo.toml (default
  `Vulpus-Labs/vxn-1`)
- `webdemo` - path to the browser build, e.g. `/products/vxn-2b/web/`
- `formats` - array shown as chips, e.g. `["CLAP", "VST3"]`
- `demoNote` - replaces the line under the hero's browser button (default:
  "No install, no account… or plug in a MIDI controller"), for a demo that
  differs, e.g. one without Web MIDI; `demoPitch` - likewise for the
  "Still deciding?" call-out's sentence. Both are rendered as markdown
- `[[downloads]]` - `platform`, `format`, `arch`, and either `asset` (a GitHub
  release asset name, resolved to
  `https://github.com/<repo>/releases/download/<release>/<asset>`) or a full
  `url`
- `[install]` - `clap` and `vst3`, the installed bundle filenames (e.g.
  `vxn1b.clap`). They fill in the `xattr` de-quarantine commands in the callout
  under the download grid; without them the callout falls back to a generic path
- `[[extras]]` - `label` plus `asset`/`url`, for manuals and side artifacts
- `store` - the product's store page (KVR Marketplace). When set, the hero and
  the downloads section offer "Buy on <storeName>" in place of the download
  grid; `storeName` defaults to "KVR Marketplace"
- `storeSoon` - markdown shown in the downloads section while there is neither
  a `store` nor `downloads` (e.g. "coming soon to KVR Marketplace")
- `manual` - path to the product's manual page, e.g. `/manuals/vxn-1c/`; adds a
  Manual button to the hero
- `[[legacy]]` - a superseded product still offered for download, rendered as
  a "Previous version" section (`#previous`) below the downloads: `title`,
  `version`, `release`, optional `repo`, `note` (markdown), `[legacy.install]`
  and `[[legacy.downloads]]` as above. vxn-1c carries VXN1b's, vxn-2b VXN2's;
  `/products/vxn-1b/` and `/products/vxn-2/` redirect to them
  (`static/_redirects`)
- `[[audio]]` - either `file` (a glob matched against the page bundle's
  resources) or `url` (a path served from `static/`, e.g.
  `/media/ravel_vxn1.m4a`), plus optional `title` and `caption` (rendered as
  markdown, so it can carry attribution links). A `file` entry
  renders only once the file exists, so entries can be declared before the audio
  lands; a `url` entry always renders, so the file has to be there.

**Manuals** (`/manuals/`, `layouts/manuals/`): one page bundle per manual,
`content/manuals/<name>/index.md` beside its PDF and a `faceplate.png` cover.
Front matter: `title`, `date`, `weight`, `platform` (a chip, e.g. "Voltage
Modular module"), `accent`, `summary`, `pdf` (the bundle's file name), `pages`,
and optionally `store`. The PDFs are built in their own repositories (e.g.
`vm-pro/poly-kritter/manual/build.sh`) and copied in.

Product pages that carry audio or screenshots must be page bundles
(`content/products/<name>/index.md`) so the media sits beside the copy.
