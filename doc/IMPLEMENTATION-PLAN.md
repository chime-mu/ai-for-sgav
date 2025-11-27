# Implementation Plan: AI Workshop Site

## Project Overview

Building an Angular-based workshop site for a 2.5-hour AI coding course targeted at SGAV Angular developers. The site demonstrates AI-assisted development by being built with AI itself.

## Architecture Decisions

### Image Storage Strategy

**Folder Structure:**
```
src/assets/
  images/
    slides/
      slide-01-three-types.jpg
      slide-02-pixie-dust.jpg
      slide-03-sorcerer-apprentice.jpg
      slide-04-new-world.jpg
      slide-05-axe.jpg
      slide-06-structure-chaos.jpg
      slide-07-it-works.jpg
      slide-08-no-experts.jpg
      slide-09-practical-techniques.jpg
      slide-10-have-fun.jpg
```

**Image Reference in JSON:**
- Store relative paths from `assets/` base: `"image": "images/slides/slide-01-three-types.jpg"`
- This keeps content.json editable without touching code
- Supports future CDN migration (just change base path in service)
- Include `imageAlt` field for accessibility

### Content Structure

All content stored in `src/assets/content.json` with schema:

```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2024-11-27",
    "workshopDuration": "150 minutes"
  },
  "slides": [
    {
      "id": "three-types",
      "slideNumber": 1,
      "title": "De tre slags",
      "keywords": "Pixie dust, Troldmandens lærling, En ny verden",
      "details": "Detaljeret tekst der vises når man folder ud...",
      "image": "images/slides/slide-01-three-types.jpg",
      "imageAlt": "Tidlige biler der ligner hestevogne"
    }
  ],
  "exercises": [
    {
      "id": "hello-world",
      "title": "Hello World",
      "difficulty": "beginner",
      "category": "Start her",
      "shortDescription": "Få en simpel Angular-komponent til at køre med AI-hjælp.",
      "fullDescription": "Etablér at dit setup virker...",
      "estimatedTime": "15 minutes"
    }
  ],
  "angularJokes": [
    "OnInit, OnDestroy, OnPray, OnCry.",
    "Jeg elsker Angular. Stockholm-syndrom er også kærlighed."
  ]
}
```

**Key Features:**
- Flat structure for easy manual editing
- `id` fields enable direct URL linking (future feature)
- `imageAlt` for accessibility without code changes
- Separate content from code completely

### Component Architecture

```
AppComponent (root, navigation management)
├── HeaderComponent (tabs: "Principper" | "Øvelser")
├── SlidesContainerComponent
│   ├── SlidesViewerComponent (displays current slide, keyboard nav)
│   └── ProgressIndicatorComponent (shows "3/10" progress)
├── ExercisesContainerComponent
│   ├── ExerciseCategoryComponent (groups by difficulty)
│   │   └── ExerciseItemComponent (individual collapsible exercise)
└── FooterComponent (rotating jokes)
```

**Services:**
- `ContentLoaderService` - Loads and caches content.json
- `SlidesStateService` - Manages current slide, navigation state
- `KeyboardNavigationService` - Handles arrow key events

### Commit Message Strategy

Every commit includes the prompt used to generate that feature:

```
[Type]: Feature description

Prompt used:
"""
[Full prompt text here]
"""

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

This creates a traceable history of how the site was built with AI.

## Implementation Phases

### Phase 1: Project Foundation

**Goal:** Set up Angular project and content infrastructure

1. **Create Angular project**
   - Command: `ng new ai-for-sgav --routing=false --style=css`
   - Use standalone components (Angular modern approach)

2. **Set up folder structure**
   ```
   src/app/
     components/
       slides/
       exercises/
       footer/
       header/
     services/
     models/
   src/assets/
     images/slides/
     content.json
   ```

3. **Create content.json schema**
   - Define complete JSON structure with all fields
   - Add placeholder data for testing
   - Include all 10 slides and exercises

4. **Build ContentLoaderService**
   - HTTP GET to load `assets/content.json`
   - Cache result in BehaviorSubject
   - Error handling if JSON fails to load

**Prompts to use:**
- "Create an Angular service that loads a JSON file from assets, caches it in a BehaviorSubject, and provides Observables for slides, exercises, and jokes"

### Phase 2: Slides Feature

**Goal:** Build presentation mode with keyboard navigation

5. **Build SlidesStateService**
   - Manages current slide index
   - `next()`, `prev()`, `goToSlide(index)` methods
   - Exposes `currentSlide$` Observable
   - Keyboard event handling

6. **Build SlidesViewerComponent**
   - Displays current slide (title, keywords, image)
   - Collapsible details section
   - Image rendering with error fallback
   - Template: large text, professional styling

7. **Add keyboard navigation**
   - Listen for ArrowLeft/ArrowRight at component level
   - Call SlidesStateService methods
   - Prevent default scroll behavior
   - Show keyboard hints in UI

8. **Build ProgressIndicatorComponent**
   - Display "3/10" counter
   - Visual progress bar
   - Subscribe to SlidesStateService

9. **Style for fullscreen presentation**
   - Large fonts for projector visibility
   - Professional image borders
   - Clean layout with good spacing
   - Fullscreen-friendly CSS

**Prompts to use:**
- "Create an Angular service that manages slide state with next/prev navigation and exposes the current slide as an Observable"
- "Create an Angular component that displays a slide with title, keywords, collapsible details, and an image. Add keyboard navigation with arrow keys."
- "Create a progress indicator component showing current slide number and total, with a visual progress bar"

### Phase 3: Exercises Feature

**Goal:** Build scrollable exercise list with collapsible sections

10. **Build ExerciseItemComponent**
    - Display exercise title and short description
    - Collapsible full description
    - Toggle state management
    - Difficulty badge

11. **Build ExerciseCategoryComponent**
    - Group exercises by difficulty level
    - Category header (e.g., "Start her", "Test og kvalitet")
    - Pass exercises to ExerciseItemComponent

12. **Build ExercisesContainerComponent**
    - Load all exercises from service
    - Group by category
    - Toggle visibility (can hide entire section)
    - Scroll-friendly list layout

13. **Style for readability**
    - Card-based layout
    - Clear visual hierarchy
    - Smooth collapse/expand animations
    - Responsive spacing

**Prompts to use:**
- "Create an Angular component for a collapsible exercise item that shows a title, short description, and expandable full description"
- "Create a container component that groups exercises by difficulty category (beginner, intermediate, advanced) and displays them as a scrollable list"

### Phase 4: Navigation & Footer

**Goal:** Add tab navigation and rotating footer

14. **Build HeaderComponent**
    - Two tabs: "Principper" and "Øvelser"
    - Active state styling
    - Emit navigation events to parent
    - Clean, simple design

15. **Build FooterComponent**
    - Display random joke from list
    - Rotate joke on slide change
    - Simple, unobtrusive styling
    - Sticky to bottom

16. **Wire up navigation in AppComponent**
    - Tab switching logic
    - Show/hide slides vs exercises
    - Manage global state
    - Connect keyboard navigation

17. **Add global CSS styling**
    - CSS variables for colors, fonts, spacing
    - Consistent design language
    - Mobile-responsive breakpoints
    - Professional, clean aesthetic

**Prompts to use:**
- "Create a header component with two tabs (Principper and Øvelser) that emits events when clicked"
- "Create a footer component that displays a random Angular joke from a list and rotates the joke when triggered"

### Phase 5: Content & Deployment

**Goal:** Finalize content and deploy to production

18. **Generate/source all slide images**
    - Create or find 10 professional images
    - Resize and optimize for web
    - Save with descriptive names in `assets/images/slides/`
    - Add alt text to content.json

19. **Populate complete content.json**
    - Write all 10 slide contents (Danish)
    - Write all 10 exercise descriptions
    - Add 8-10 Angular jokes
    - Verify JSON structure

20. **End-to-end testing**
    - Test keyboard navigation (arrow keys work)
    - Test all collapsible sections
    - Test tab switching
    - Test on mobile/tablet/desktop
    - Test footer rotation
    - Verify images load correctly

21. **Deploy to Netlify**
    - Connect GitHub repo to Netlify
    - Configure build: `ng build`
    - Set up two subdomains:
      - `live.ai-for-sgav.dk` - for live building during workshop
      - `backup.ai-for-sgav.dk` - pre-built backup version
    - Test deployment

**Prompts to use:**
- "Help me configure Netlify to deploy this Angular app with custom subdomains"

## Component Responsibilities

| Component/Service | Responsibility |
|---|---|
| `AppComponent` | Tab switching, route slides vs exercises view |
| `HeaderComponent` | Tab UI, emit navigation events |
| `SlidesViewerComponent` | Display current slide, handle image rendering |
| `ProgressIndicatorComponent` | Show slide progress (counter + bar) |
| `ExerciseItemComponent` | Individual exercise card, toggle details |
| `ExerciseCategoryComponent` | Group exercises by difficulty |
| `ExercisesContainerComponent` | Full exercise list, toggle visibility |
| `FooterComponent` | Display and rotate Angular jokes |
| `ContentLoaderService` | Load and cache content.json |
| `SlidesStateService` | Manage current slide, navigation logic |
| `KeyboardNavigationService` | Listen for arrow keys, emit events |

## Key Technical Considerations

### Image Handling
- Use `<img [src]="'assets/' + slide.image" [alt]="slide.imageAlt">` in templates
- Add error handler → show placeholder if image fails
- Consider lazy loading for performance
- Professional styling with borders

### Content Loading
- Load content.json once in `AppComponent.ngOnInit()`
- Store in BehaviorSubject in ContentLoaderService
- All components inject service and subscribe to data
- Add loading state and error handling

### Keyboard Navigation
- Bind arrow keys at component level
- Use `@HostListener` decorator for key events
- Call `preventDefault()` to avoid page scroll
- Disable when focus is on text input (exercises filter)

### Styling Approach
- CSS variables for consistent theming
- Mobile-first responsive design
- Presentation mode: large fonts, high contrast
- Footer sticky positioning (no flexbox needed)

### Accessibility
- ARIA labels for all interactive elements
- Alt text for all images (in JSON)
- Keyboard navigation fully functional
- Tab order follows visual flow
- Color contrast meets WCAG AA standards

## Live Demo Preparation

The rotating footer component is designed to be built live during the workshop intro (5-7 minutes).

**Pre-demo setup:**
- Angular project already initialized with `ng new`
- Dev server ready to start (`ng serve`)
- JSON file with jokes already in place
- VS Code or editor open and ready

**Demo flow:**
1. Show empty Angular project
2. Prompt: "Lav en footer-komponent der viser en tilfældig joke fra en liste"
3. Generate code, insert into project
4. Show result in browser
5. Prompt: "Gør den pænere" or "Tilføj animation"
6. Show improved result

**Fallback plan:**
- If demo fails, switch to backup site
- Say: "Lad mig vise jer én jeg lavede i går"
- Continue with workshop content

## Testing Checklist

Before deployment, verify:

- [ ] All 10 slides display correctly
- [ ] Images load with proper alt text
- [ ] Keyboard navigation works (ArrowLeft, ArrowRight)
- [ ] Progress indicator updates correctly
- [ ] All exercise details expand/collapse
- [ ] Exercises grouped by difficulty correctly
- [ ] Tab switching between Principper and Øvelser works
- [ ] Footer displays random jokes
- [ ] Footer rotates jokes on navigation
- [ ] Responsive on mobile/tablet/desktop
- [ ] Fullscreen mode works for presentation
- [ ] No console errors
- [ ] JSON parses correctly
- [ ] All links/resources in exercises work
- [ ] Site works without JavaScript (graceful degradation)

## Deployment Configuration

**Netlify setup:**
1. Connect GitHub repository
2. Build command: `ng build`
3. Publish directory: `dist/ai-for-sgav`
4. Configure custom domain: `ai-for-sgav.dk`
5. Set up subdomains:
   - Branch `main` → `live.ai-for-sgav.dk`
   - Branch `backup` → `backup.ai-for-sgav.dk`

**Environment variables:** None needed (all content in JSON)

**Build settings:**
- Node version: 18.x or higher
- Angular CLI: Latest version
- Build optimization: Production mode

## Success Criteria

The project is complete when:

1. ✅ All slides display with images and collapsible details
2. ✅ Keyboard navigation works smoothly
3. ✅ All exercises are listed with collapsible content
4. ✅ Footer rotates Angular jokes
5. ✅ Tab switching works between sections
6. ✅ Site is responsive on all devices
7. ✅ Deployed to both live and backup subdomains
8. ✅ All content is in JSON (separate from code)
9. ✅ Every commit includes the prompt used
10. ✅ Site can be presented fullscreen on projector

## Timeline Estimate

- **Phase 1:** 2-3 hours (project setup, content structure)
- **Phase 2:** 3-4 hours (slides feature)
- **Phase 3:** 2-3 hours (exercises feature)
- **Phase 4:** 2-3 hours (navigation and footer)
- **Phase 5:** 3-4 hours (content creation, testing, deployment)

**Total:** 12-17 hours of development time

## Next Steps

1. Confirm this plan aligns with your vision
2. Begin Phase 1: Initialize Angular project
3. Set up git repository with proper .gitignore
4. Start implementing components one phase at a time
5. Commit each feature with prompts in commit messages
