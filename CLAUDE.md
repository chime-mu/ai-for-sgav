# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular-based workshop site for a 2.5-hour course on using AI in coding, targeted at Angular developers at SGAV (Slots- og Kulturstyrelsen). The site itself is built with AI as a meta-demonstration.

**Domain:** `ai-for-sgav.dk`
**Hosting:** Netlify with two subdomains:
- `live.ai-for-sgav.dk` - Built live during workshop
- `backup.ai-for-sgav.dk` - Pre-built backup version

## Git Commit Guidelines

**IMPORTANT:** All commit messages MUST include the prompts given to Claude Code in the commit message body. This creates a transparent audit trail showing how the site was built with AI assistance.

**Format:**
```
Brief commit title

Detailed description of changes made.

Prompt: [The exact prompt given to Claude Code]

🤖 Generated with Claude Code (https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Example:** If the prompt was "Update CLAUDE.md - Make sure it has everything necessary given we have now built most of the app. Also add commit messages should include the prompts given to claude - including this", include that exact text in the commit message.

## Architecture Decisions

**Framework:** Angular 19 with standalone components (no NgModules)
**UI Framework:** None - pure Angular components
**Styling:** Simple CSS (no framework to minimize complexity)
**Content Management:** JSON file (`src/assets/content.json`) - separates content from code
**Language:** Danish (for Danish audience)
**State Management:**
- Signal-based state for UI state (view switching, expand/collapse)
- RxJS BehaviorSubjects in services for async data and navigation state
**Routing:** No traditional Angular routing - uses view switching via signals
**Collapsible Elements:** Native HTML `<details>` and `<summary>` elements

## Content Structure

The site has three main sections driven by `src/assets/content.json`:

1. **Slides (Principper)** - 10 presentation slides with:
   - Keyboard navigation (arrow keys)
   - Collapsible detail text using native `<details>` element
   - One image per slide with fallback to placeholder
   - Progress indicator (current/total + visual progress bar)
   - Navigation buttons with keyboard hints

2. **Exercises (Øvelser)** - 10 exercises grouped by category:
   - **Categories:** "Start her", "Test og kvalitet", "Den virkelige verden", "Ødelæg ting (med vilje)", "For de ambitiøse"
   - Each exercise has difficulty badge (begynder/øvet/avanceret)
   - Collapsible detail sections with short/full descriptions
   - Scroll-friendly list (not slides)
   - View switched via tab navigation in header

3. **Rotating Footer** - Angular jokes (deferred - not implemented yet)

## Key Components

Actual file structure:
```
src/app/
  components/
    header/
      header.component.ts         - Tab navigation (Principper/Øvelser)
      header.component.html
      header.component.css
    slides/
      slides-container.component.ts   - Main presentation container
      slides-container.component.html
      slides-container.component.css
    exercises/
      exercises-container.component.ts    - Exercise list with categories
      exercises-container.component.html
      exercises-container.component.css
      exercise-category.component.ts      - Category group component
      exercise-category.component.html
      exercise-category.component.css
      exercise-item.component.ts          - Individual exercise card
      exercise-item.component.html
      exercise-item.component.css
  services/
    content-loader.service.ts      - Loads and caches content.json
    slides-state.service.ts        - Manages slide navigation state
    keyboard-navigation.service.ts - Arrow key event handling
  models/
    content.model.ts              - TypeScript interfaces for data
```

### Component Details

**HeaderComponent**
- Tab navigation for switching between "Principper" and "Øvelser" views
- Emits `viewChange` events to parent (App component)
- Uses `ViewType` type definition: `'slides' | 'exercises'`

**SlidesContainerComponent**
- Integrates `KeyboardNavigationService` for arrow key navigation
- Uses `SlidesStateService` for slide state management
- Displays current slide with title, keywords, image, and collapsible details
- Shows progress indicator with visual progress bar
- Navigation buttons with keyboard shortcuts hint
- Implements OnInit/OnDestroy for proper cleanup

**ExercisesContainerComponent**
- Groups exercises by category using RxJS operators
- Renders `ExerciseCategoryComponent` for each category
- Shows loading state while content loads

**ExerciseCategoryComponent**
- Presentational component for a category group
- Receives category name and exercises array as inputs
- Renders `ExerciseItemComponent` for each exercise

**ExerciseItemComponent**
- Individual exercise card with expand/collapse functionality
- Uses Angular signals for expanded state management
- Difficulty badge with Danish labels (Begynder/Øvet/Avanceret)
- Shows `shortDescription` by default, `fullDescription` when expanded

## Services

**ContentLoaderService**
- Loads content from `/assets/content.json` via HttpClient
- Uses BehaviorSubject for reactive state management with caching
- Provides separate observables:
  - `content$` - full content object
  - `slides$` - slides array only
  - `exercises$` - exercises array only
  - `jokes$` - Angular jokes array only
- Methods: `reloadContent()`, `getCurrentContent()` (synchronous snapshot)
- Error handling with console logging

**SlidesStateService**
- Manages slide navigation state using BehaviorSubjects
- Provides observables:
  - `currentSlide$` - current slide object
  - `currentIndex$` - current index (0-based)
  - `totalSlides$` - total slide count
- Navigation methods with bounds checking:
  - `next()` - go to next slide
  - `previous()` - go to previous slide
  - `goToSlide(index)` - jump to specific slide
  - `reset()` - return to first slide

**KeyboardNavigationService**
- Listens for ArrowLeft and ArrowRight keyboard events globally
- Prevents default scroll behavior for arrow keys
- Emits navigation direction: `'next' | 'previous'`
- Auto-starts listening on service instantiation
- Methods: `startListening()`, `stopListening()`, `navigate(direction)`

## Models

TypeScript interfaces in `src/app/models/content.model.ts`:

```typescript
interface Metadata {
  version: string;
  lastUpdated: string;
  workshopDuration: string;
}

interface Slide {
  id: string;
  slideNumber: number;
  title: string;
  keywords: string;
  details: string;
  image: string;
  imageAlt: string;
  duration?: string;
  speakerNotes?: string;
}

interface Resource {
  title: string;
  url: string;
  type: string;
}

interface Exercise {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  shortDescription: string;
  fullDescription: string;
  estimatedTime?: string;
  resources?: Resource[];
}

interface Content {
  metadata: Metadata;
  slides: Slide[];
  exercises: Exercise[];
  angularJokes: string[];
}
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

Actual structure in `src/assets/content.json`:

```json
{
  "metadata": {
    "version": "string",
    "lastUpdated": "YYYY-MM-DD",
    "workshopDuration": "string (e.g., '150 minutes')"
  },
  "slides": [
    {
      "id": "string",
      "slideNumber": number,
      "title": "string",
      "keywords": "string",
      "details": "string (expandable)",
      "image": "images/slides/filename.jpg",
      "imageAlt": "string",
      "duration": "~X minutes (optional)",
      "speakerNotes": "string (optional)"
    }
  ],
  "exercises": [
    {
      "id": "string",
      "title": "string",
      "difficulty": "beginner|intermediate|advanced",
      "category": "string (e.g., 'Start her', 'Test og kvalitet')",
      "shortDescription": "string",
      "fullDescription": "string (expandable)",
      "estimatedTime": "X minutter (optional)",
      "resources": [
        {
          "title": "string",
          "url": "string",
          "type": "string"
        }
      ] // optional array
    }
  ],
  "angularJokes": ["string array"]
}
```

**Current Content:**
- 10 slides with all images present in `src/assets/images/slides/`
- 10 exercises across 5 categories
- 8 Angular jokes in Danish

## Special Requirements

- **Keyboard Navigation:** Arrow keys for slide navigation
- **Fullscreen-Friendly:** Slides should work well in fullscreen presentation mode
- **Toggle Visibility:** Exercises section can be hidden/shown via tab navigation
- **Collapsible Content:** Both slide details and exercise details expand/collapse using native `<details>` elements
- **Image Styling:** Professional with borders, all images present in assets
- **Accessibility:** Focus styles, ARIA attributes, keyboard navigation, screen reader support

## Global Styles

Located in `src/styles.css`:

**Features:**
- CSS reset with universal `box-sizing: border-box`
- System font stack for optimal performance and native feel
- Accessible focus styles (2px solid outline with offset)
- Responsive image defaults (max-width: 100%, height: auto)
- Screen reader utility class (`.sr-only`)
- Smooth scroll behavior
- Clean, minimal styling approach

## Deployment

Deploy to Netlify with automatic builds from GitHub. Configuration is in `netlify.toml`:

```toml
[build]
  publish = "dist/ai-for-sgav/browser"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Note:** The `[[redirects]]` section configures SPA (Single Page Application) routing, ensuring all paths serve index.html for client-side navigation.

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

✅ **Fully Implemented:**

**Foundation (Phase 1)**
- Angular 19 standalone components architecture
- Content loading service with RxJS and caching
- TypeScript models for type safety
- JSON-based content management

**Slides Feature (Phase 2)**
- SlidesContainerComponent with full presentation mode
- Keyboard navigation service (arrow keys)
- Slides state management service
- Progress indicator with visual progress bar
- Collapsible slide details using native `<details>` elements
- Image loading with fallback support
- All 10 slide images present

**Exercises Feature (Phase 3)**
- ExercisesContainerComponent with category grouping
- ExerciseCategoryComponent for grouped display
- ExerciseItemComponent with signal-based expand/collapse
- Difficulty badges with Danish labels
- Tab navigation via HeaderComponent
- All 10 exercises across 5 categories

**Polish & Deployment (Phase 5)**
- Global styles with accessibility features
- Netlify configuration with SPA redirects
- Professional image styling
- Focus management and ARIA attributes
- Responsive design
- Screen reader support

**Not Implemented:**
- Phase 4: Rotating footer with Angular jokes (intentionally deferred)

**Testing Status:**
- Component spec files exist with default scaffolding
- Unit tests may need implementation if required

**Deployment Ready:**
- Production build configured: `npm run build`
- Output: `dist/ai-for-sgav/browser` (~48 kB gzipped)
- Netlify configuration complete
- Ready for deployment to both `live.ai-for-sgav.dk` and `backup.ai-for-sgav.dk` subdomains
