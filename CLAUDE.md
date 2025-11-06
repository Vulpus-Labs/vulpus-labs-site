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

The custom "vulpus-labs" theme embodies the brand values:

**Brand Identity:**
- Independent, innovative, transparent software development
- Logo: `themes/vulpus-labs/assets/logo.png` - stylized fox head
- Tagline: "know many things" (inspired by Archilochus)

**Visual Design:**
- Modern, tech-centric dark theme
- Color scheme: Dark blues and grays with bright accent colors
- Typography optimized for technical content
- Responsive layout (desktop and mobile)

**Layout Features:**
- Homepage shows three most recent posts
- Persistent sidebar with:
  - Resource links (configurable in hugo.toml)
  - Monthly archive navigation with post counts
- Clean post cards with metadata (date, reading time)
- Code-friendly styling for technical content

**Key Template Files:**
- `themes/vulpus-labs/layouts/_default/baseof.html` - Base structure with header, content wrapper, sidebar, footer
- `themes/vulpus-labs/layouts/index.html` - Homepage with recent posts
- `themes/vulpus-labs/layouts/partials/sidebar.html` - Sidebar with links and archives
- `themes/vulpus-labs/assets/css/main.css` - Complete styling (processed by Hugo Pipes)

**Front Matter:**
Posts should include `readingTime` parameter (minutes) for display in post cards.
