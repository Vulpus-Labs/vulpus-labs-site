# Vulpus Labs Website

The official website for Vulpus Labs - independent software development with innovative ideas, ergonomically thoughtful execution, and transparent open source.

## Quick Start

```bash
# Start development server with drafts
hugo server --buildDrafts

# Build for production
hugo

# Create new post
hugo new content posts/my-new-post.md
```

The development server will be available at http://localhost:1313/

## Theme Features

The custom "vulpus-labs" theme provides:

- **Modern, tech-centric design** with a dark color scheme
- **Responsive layout** that works on desktop and mobile
- **Homepage** displaying the three most recent posts
- **Sidebar** with:
  - Customizable resource links (docs, repos, products)
  - Monthly archive navigation
- **Clean typography** optimized for reading technical content
- **Code highlighting** for technical posts

## Configuration

Edit `hugo.toml` to customize:

- Site title and description
- Sidebar resource links
- Base URL and language settings

### Adding Sidebar Links

Edit the `[[params.links]]` sections in `hugo.toml`:

```toml
[[params.links]]
title = 'Documentation'
url = '/docs/'
icon = '📚'
```

## Content Structure

- `content/posts/` - Blog posts
- `content/docs/` - Documentation pages
- `content/products/` - Product pages

## Front Matter

Add these fields to your post front matter:

```toml
+++
title = 'Post Title'
date = '2025-11-05'
draft = false
readingTime = 5  # Optional: estimated reading time in minutes
+++
```

## Brand Elements

- **Logo**: `themes/vulpus-labs/assets/logo.png` - stylized fox head (60x60px in header)
- **Tagline**: "know many things"
- **Colors**: Dark blue/gray tech aesthetic
- **Values**: Independent, Innovative, Transparent

To replace the logo, simply update `themes/vulpus-labs/assets/logo.png` with your own image.

## License

Content and custom theme are part of the Vulpus Labs project.
