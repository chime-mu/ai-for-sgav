# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular-based workshop site for a 2.5-hour course on using AI in coding, targeted at Angular developers at SGAV (Slots- og Kulturstyrelsen). The site itself is built with AI as a meta-demonstration.

**Domain:** `ai-for-sgav.dk`
**Hosting:** Netlify with two subdomains:
- `live.ai-for-sgav.dk` - Built live during workshop
- `backup.ai-for-sgav.dk` - Pre-built backup version

## Architecture Decisions

**Framework:** Pure Angular (no UI framework)
**Styling:** Simple CSS (no framework to minimize complexity)
**Content Management:** JSON file (`src/assets/content.json`) - separates content from code
**Language:** Danish (for Danish audience)

## Content Structure

The site has three main sections driven by `src/assets/content.json`:

1. **Slides (Principper)** - 6-12 presentation slides with:
   - Keyboard navigation (arrow keys)
   - Collapsible detail text
   - One image per slide
   - Progress indicator

2. **Exercises (Øvelser)** - Grouped by difficulty:
   - Hidden during intro, toggled when ready
   - Collapsible detail sections
   - Scroll-friendly list (not slides)

3. **Rotating Footer** - Angular jokes that rotate on each page view

## Key Components

Expected file structure:
```
src/app/components/
  slides/       - Presentation mode with keyboard nav
  exercises/    - Collapsible exercise list
  footer/       - Rotating jokes component
```

## Development Commands

This project uses Angular CLI locally via npm scripts. Angular CLI is NOT installed globally.

```bash
# Development server (recommended)
npm start

# Or using npx
npx ng serve

# Build for production
npm run build

# Run tests
npm test

# Generate new component
npx ng generate component components/component-name

# Run single test file
npx ng test --include='**/component-name.component.spec.ts'
```

**Important:** Always use `npm start` or `npx ng` commands. Do not use bare `ng` commands as Angular CLI is not globally installed.

## Live Demo Component

The rotating footer component is designed to be built live during the workshop intro (5-7 minutes). This demonstrates AI-assisted development to participants. Have the Angular project pre-initialized with `ng new` and the JSON file ready before the demo.

## Content JSON Schema

```json
{
  "slides": [
    {
      "id": "string",
      "title": "string",
      "keywords": "string",
      "details": "string (expandable)",
      "image": "filename.jpg"
    }
  ],
  "exercises": [
    {
      "id": "string",
      "title": "string",
      "difficulty": "beginner|intermediate|advanced",
      "shortDescription": "string",
      "fullDescription": "string (expandable)"
    }
  ],
  "angularJokes": ["string array"]
}
```

## Special Requirements

- **Keyboard Navigation:** Arrow keys for slide navigation
- **Fullscreen-Friendly:** Slides should work well in fullscreen presentation mode
- **Toggle Visibility:** Exercises section can be hidden/shown
- **Collapsible Content:** Both slide details and exercise details should expand/collapse
- **Image Styling:** Professional with borders, not stock photos

## Deployment

Deploy to Netlify with automatic builds from GitHub. Configuration is in `netlify.toml`:

```toml
[build]
  publish = "dist/ai-for-sgav/browser"
  command = "npm run build"
```

### Netlify Setup
1. Connect GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist/ai-for-sgav/browser`
4. Configure two subdomain environments:
   - `live.ai-for-sgav.dk` - for live building during workshop
   - `backup.ai-for-sgav.dk` - pre-built backup version

### Production Build
Run `npm run build` to create production build. Output will be in `dist/ai-for-sgav/browser`.
Bundle size: ~48 kB (gzipped)

## Current Status

✅ **Implemented Features:**
- **Phase 1:** Project foundation with Angular, content structure, and loader service
- **Phase 2:** Slides feature with keyboard navigation and presentation mode
- **Phase 3:** Exercises feature with collapsible items and tab navigation
- **Phase 5:** Polish, placeholder images, global styles, and deployment config

**Not Implemented:**
- Phase 4: Rotating footer with Angular jokes (deferred)

**Ready for deployment to Netlify**
