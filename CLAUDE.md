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
- The palette is taken from the VXN faceplates themselves: near-black charcoal
  surfaces, ice-blue panel headers, ember-orange controls
- Display type is Space Grotesk, mono is JetBrains Mono (both from Google
  Fonts, linked in `partials/head.html`); body text uses the system sans stack
- `--accent` is a CSS custom property. It defaults to the brand ember, and each
  product overrides it inline from its `accent` front-matter key, so a product
  page, its showcase block and its buttons pick up that synth's own colour
- Responsive; honours `prefers-reduced-motion`

**Layout Features:**
- Sticky translucent header; nav (Products, Blog, Repos, Store, Contact) from
  `[menus.main]` in hugo.toml, entries with `params.external = true` open in a
  new tab
- Templates are full-bleed: `baseof.html` no longer constrains width. Each
  section supplies its own `.wrap` (max 1180px) or `.wrap .wrap-prose`
  (max 46rem, for running text)
- Homepage: hero (headline, CTA, spec chips, tilted faceplate stack) → one
  showcase slab per VXN product, alternating sides → other products → blog
- Product pages: hero with faceplate shot and a browser CTA, gallery, sound
  examples, prose, a repeat web-demo call-out, downloads, cross-links to the
  rest of the range
- No sidebar — the monthly archive is a jump-link row on `/posts/`

**Key Template Files:**
- `themes/vulpus-labs/layouts/_default/baseof.html` - header, content, footer
- `themes/vulpus-labs/layouts/index.html` - homepage
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
- `webdemo` - path to the browser build, e.g. `/products/vxn-2/web/`
- `formats` - array shown as chips, e.g. `["CLAP", "VST3"]`
- `[[downloads]]` - `platform`, `format`, `arch`, and either `asset` (a GitHub
  release asset name, resolved to
  `https://github.com/<repo>/releases/download/<release>/<asset>`) or a full
  `url`
- `[[extras]]` - `label` plus `asset`/`url`, for manuals and side artifacts
- `[[audio]]` - either `file` (a glob matched against the page bundle's
  resources) or `url` (a path served from `static/`, e.g.
  `/media/ravel_vxn1.m4a`), plus optional `title` and `caption` (rendered as
  markdown, so it can carry attribution links). A `file` entry
  renders only once the file exists, so entries can be declared before the audio
  lands; a `url` entry always renders, so the file has to be there.

Product pages that carry audio or screenshots must be page bundles
(`content/products/<name>/index.md`) so the media sits beside the copy.
