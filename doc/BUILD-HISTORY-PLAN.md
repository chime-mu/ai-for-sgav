# BUILD HISTORY FEATURE - Implementation Plan

## Feature Overview

**Goal:** Create a new top-level navigation section that showcases how this website was built using AI assistance, displaying the complete git commit history with prompts used.

**Purpose:**
- Meta-demonstration: Show workshop participants the actual build process
- Transparency: Display all AI prompts used to build the site
- Educational: Demonstrate iterative AI-assisted development workflow

**User Experience:**
- New navigation tab: "Byggehistorik" (Build History)
- List view: Commit summaries with timestamps
- Detail view: Expandable commits showing full messages and prompts
- Chronological order: Newest commits first

---

## Architecture Decisions

### Data Source Strategy

**Option 1: Static JSON File (RECOMMENDED)**
- Extract git history once and commit as JSON
- Manually update when adding new features
- Pros: Fast, no runtime git dependencies, works in production
- Cons: Requires manual updates
- **Decision:** Use this approach for simplicity and performance

**Option 2: Runtime Git Extraction**
- Use git commands at build time or runtime
- Pros: Always up-to-date
- Cons: Complex, requires git in build environment, slower
- **Decision:** Not selected (over-engineered for this use case)

### Data Structure

**Location:** `/src/assets/build-history.json`

```json
{
  "metadata": {
    "lastUpdated": "YYYY-MM-DD HH:mm:ss",
    "totalCommits": number,
    "extractedBy": "git log command"
  },
  "commits": [
    {
      "sha": "string (full SHA)",
      "shaShort": "string (7-char)",
      "author": "Name <email>",
      "timestamp": "ISO 8601 string",
      "timestampReadable": "DD. MMM YYYY, HH:mm",
      "summary": "1-2 line summary (first line of commit message)",
      "fullMessage": "Complete commit message body",
      "prompt": "Extracted prompt from message (if present)",
      "filesChanged": number,
      "insertions": number,
      "deletions": number,
      "phase": "string (e.g., 'Phase 1', 'Documentation', 'Fix')"
    }
  ]
}
```

### Component Architecture

```
src/app/components/
  build-history/
    build-history-container.component.ts    - Main container
    build-history-container.component.html
    build-history-container.component.css
    commit-list-item.component.ts           - Individual commit card
    commit-list-item.component.html
    commit-list-item.component.css
```

**Pattern:** Follow existing exercises pattern (container + item components)

### Service Layer

No new service needed initially. If needed later:
- `BuildHistoryService` to load and filter commits
- Similar pattern to `ContentLoaderService`

---

## Data Extraction Process

### Git Command to Extract History

```bash
git log --all --pretty=format:'{"sha":"%H","shaShort":"%h","author":"%an <%ae>","timestamp":"%aI","summary":"%s","fullMessage":"%B"},' --numstat | awk 'BEGIN{print "{"} {print} END{print "}"}'
```

**Better Approach:** Manual script to generate clean JSON

### Extraction Script (Bash)

```bash
#!/bin/bash
# extract-commits.sh - Run from project root

echo '{'
echo '  "metadata": {'
echo '    "lastUpdated": "'$(date -u +"%Y-%m-%d %H:%M:%S")'",  '
echo '    "totalCommits": '$(git rev-list --count HEAD)','
echo '    "extractedBy": "extract-commits.sh"'
echo '  },'
echo '  "commits": ['

# Get all commits
git log --all --reverse --format='%H|%h|%an <%ae>|%aI|%s|%b' | while IFS='|' read sha shaShort author timestamp summary body; do
  # Extract stats
  stats=$(git show --shortstat --format="" $sha | tail -1)

  # Parse prompt from body (line starting with "Prompt:")
  prompt=$(echo "$body" | grep -i "^Prompt:" | sed 's/^Prompt: //')

  # Determine phase from summary
  phase="Other"
  if [[ $summary == *"Phase 1"* ]]; then phase="Phase 1"; fi
  if [[ $summary == *"Phase 2"* ]]; then phase="Phase 2"; fi
  if [[ $summary == *"Phase 3"* ]]; then phase="Phase 3"; fi
  if [[ $summary == *"Phase 5"* ]]; then phase="Phase 5"; fi
  if [[ $summary == docs:* ]]; then phase="Documentation"; fi
  if [[ $summary == fix:* ]]; then phase="Fix"; fi

  # Format timestamp for Danish locale (approximation)
  timestampReadable=$(date -d "$timestamp" +"%-d. %b %Y, %H:%M" 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S" "$timestamp" +"%-d. %b %Y, %H:%M")

  # Escape JSON strings
  summary_escaped=$(echo "$summary" | sed 's/"/\\"/g' | sed "s/'/\\'/g")
  body_escaped=$(echo "$body" | sed 's/"/\\"/g' | sed "s/'/\\'/g" | tr '\n' ' ')
  prompt_escaped=$(echo "$prompt" | sed 's/"/\\"/g' | sed "s/'/\\'/g")

  cat <<EOF
    {
      "sha": "$sha",
      "shaShort": "$shaShort",
      "author": "$author",
      "timestamp": "$timestamp",
      "timestampReadable": "$timestampReadable",
      "summary": "$summary_escaped",
      "fullMessage": "$body_escaped",
      "prompt": "$prompt_escaped",
      "phase": "$phase"
    },
EOF
done | sed '$ s/,$//'  # Remove trailing comma from last item

echo '  ]'
echo '}'
```

### Manual JSON Creation (SIMPLER)

For this project, manually create the JSON from the 10 commits already identified in research.

---

## Implementation Phases

### Phase 1: Data Extraction and JSON File

**Goal:** Extract git history and create build-history.json

**Steps:**
1. Run `git log --all --format=fuller` and manually document all 10 commits
2. For each commit, extract:
   - Full SHA and short SHA (7 chars)
   - Author name and email
   - ISO timestamp and Danish-formatted readable timestamp
   - Summary (first line of commit message)
   - Full message body
   - Extract "Prompt:" line if present
   - Determine phase from commit message prefix
3. Create `/src/assets/build-history.json` following the data structure
4. Include metadata: lastUpdated, totalCommits
5. Order commits newest-first in the array
6. Validate JSON syntax

**Success Criteria:**
- ✅ JSON file exists at correct path
- ✅ Valid JSON syntax (test with `jq` or JSON validator)
- ✅ All 10 commits present with complete data
- ✅ Prompts correctly extracted for commits that have them
- ✅ Timestamps in both ISO and Danish readable format

**Prompts to use:**
- "Create build-history.json by extracting all git commits with SHA, author, timestamp, summary, full message, and prompts"
- "Order commits newest-first and format timestamps in Danish"

---

### Phase 2: TypeScript Models and Data Loading

**Goal:** Create type-safe interfaces and integrate with ContentLoaderService

**Steps:**
1. Add interfaces to `/src/app/models/content.model.ts`:
   ```typescript
   export interface BuildHistoryMetadata {
     lastUpdated: string;
     totalCommits: number;
     extractedBy: string;
   }

   export interface Commit {
     sha: string;
     shaShort: string;
     author: string;
     timestamp: string;
     timestampReadable: string;
     summary: string;
     fullMessage: string;
     prompt?: string;
     filesChanged?: number;
     insertions?: number;
     deletions?: number;
     phase: string;
   }

   export interface BuildHistory {
     metadata: BuildHistoryMetadata;
     commits: Commit[];
   }
   ```

2. Update `/src/app/services/content-loader.service.ts`:
   - Add `private buildHistorySubject$` BehaviorSubject
   - Add `buildHistory$` and `commits$` observables
   - Add `loadBuildHistory()` method to fetch from `/assets/build-history.json`
   - Call `loadBuildHistory()` in constructor

3. Test data loading in browser console

**Success Criteria:**
- ✅ TypeScript interfaces defined
- ✅ No compilation errors
- ✅ Build history loads successfully
- ✅ `commits$` observable emits commit array
- ✅ Type safety enforced throughout

**Prompts to use:**
- "Add BuildHistory, Commit, and BuildHistoryMetadata interfaces to content.model.ts"
- "Update ContentLoaderService to load build-history.json and provide commits$ observable"

---

### Phase 3: Build History Components

**Goal:** Create UI components to display commit history

#### 3.1: Create Container Component

**Steps:**
1. Generate component: `npx ng generate component components/build-history/build-history-container`
2. Inject `ContentLoaderService`
3. Subscribe to `commits$` observable
4. Create template with:
   - Header: "Sådan byggede vi dette site" (How we built this site)
   - Intro text explaining the feature
   - List of commits using `CommitListItemComponent`
   - Loading state while data loads
5. Add basic styling (consistent with slides/exercises containers)

**Template Structure:**
```html
<div class="build-history-container">
  <header class="build-history-header">
    <h1>Sådan byggede vi dette site</h1>
    <p class="intro">
      Dette site blev bygget med AI-assistance. Herunder kan du se den fulde byggehistorik
      med alle prompts, der blev brugt til at udvikle sitet.
    </p>
    <p class="metadata">
      {{ (commits$ | async)?.length }} commits siden
      {{ metadata?.lastUpdated | date:'d. MMM yyyy' }}
    </p>
  </header>

  <div class="commits-list" *ngIf="commits$ | async as commits; else loading">
    <app-commit-list-item
      *ngFor="let commit of commits"
      [commit]="commit">
    </app-commit-list-item>
  </div>

  <ng-template #loading>
    <p class="loading">Indlæser byggehistorik...</p>
  </ng-template>
</div>
```

#### 3.2: Create Commit List Item Component

**Steps:**
1. Generate component: `npx ng generate component components/build-history/commit-list-item`
2. Add `@Input() commit!: Commit;`
3. Add `expanded = signal(false);` for expand/collapse state
4. Create template with:
   - Summary + timestamp (always visible)
   - Phase badge
   - Expand/collapse button
   - Collapsible detail section (full message + prompt)
5. Style with card design (similar to exercise items)

**Template Structure:**
```html
<div class="commit-card" [class.expanded]="expanded()">
  <div class="commit-header" (click)="expanded.set(!expanded())">
    <div class="commit-summary-line">
      <span class="phase-badge" [attr.data-phase]="commit.phase">
        {{ commit.phase }}
      </span>
      <h3 class="commit-summary">{{ commit.summary }}</h3>
    </div>
    <div class="commit-meta">
      <time [attr.datetime]="commit.timestamp">{{ commit.timestampReadable }}</time>
      <span class="sha">{{ commit.shaShort }}</span>
      <button class="expand-btn" [attr.aria-expanded]="expanded()">
        {{ expanded() ? '▲' : '▼' }}
      </button>
    </div>
  </div>

  <div class="commit-details" *ngIf="expanded()">
    <div class="detail-section">
      <h4>Commit detaljer</h4>
      <dl>
        <dt>SHA:</dt>
        <dd><code>{{ commit.sha }}</code></dd>
        <dt>Author:</dt>
        <dd>{{ commit.author }}</dd>
        <dt>Tidspunkt:</dt>
        <dd>{{ commit.timestamp | date:'full' }}</dd>
      </dl>
    </div>

    <div class="detail-section" *ngIf="commit.fullMessage">
      <h4>Fuld commit besked</h4>
      <pre class="commit-message">{{ commit.fullMessage }}</pre>
    </div>

    <div class="detail-section prompt-section" *ngIf="commit.prompt">
      <h4>🤖 AI Prompt brugt</h4>
      <blockquote class="prompt">{{ commit.prompt }}</blockquote>
    </div>
  </div>
</div>
```

**Success Criteria:**
- ✅ Components render without errors
- ✅ Commits display in list format
- ✅ Expand/collapse works smoothly
- ✅ All data fields display correctly
- ✅ Prompts are highlighted when present
- ✅ Responsive design works on mobile

**Prompts to use:**
- "Create BuildHistoryContainerComponent that displays a list of commits from the commits$ observable"
- "Create CommitListItemComponent with expandable details showing full message and AI prompts"

---

### Phase 4: Navigation Integration

**Goal:** Add "Byggehistorik" tab to main navigation

**Steps:**
1. Update `/src/app/components/header/header.component.ts`:
   - Extend `ViewType` type: `export type ViewType = 'slides' | 'exercises' | 'history';`
2. Update `/src/app/components/header/header.component.html`:
   - Add third button: "Byggehistorik"
   - Wire click event to emit viewChange
3. Update `/src/app/app.ts`:
   - Import `BuildHistoryContainerComponent`
   - Add to component imports array
4. Update `/src/app/app.html`:
   - Add `@else if (activeView() === 'history')` case
   - Render `<app-build-history-container />`
5. Test navigation between all three views

**Success Criteria:**
- ✅ Three tabs visible in header
- ✅ Clicking "Byggehistorik" shows build history view
- ✅ Navigation works smoothly between all views
- ✅ Active tab styling correct
- ✅ No console errors

**Prompts to use:**
- "Add 'history' to ViewType and create a third navigation tab for 'Byggehistorik' in HeaderComponent"
- "Update App component to render BuildHistoryContainerComponent when activeView is 'history'"

---

### Phase 5: Styling and Polish

**Goal:** Professional styling consistent with existing design

**Steps:**
1. Style commit cards with:
   - Card-based design (similar to exercise items)
   - Hover effects
   - Smooth expand/collapse transitions
   - Phase badge colors (different color per phase)
2. Add phase badge color scheme:
   - Phase 1: Blue
   - Phase 2: Green
   - Phase 3: Orange
   - Phase 5: Purple
   - Documentation: Gray
   - Fix: Red
3. Style prompt sections with distinct visual treatment:
   - Border or background color
   - Monospace font for code
   - Icon indicator (🤖)
4. Add responsive breakpoints
5. Ensure accessibility:
   - ARIA labels for expand buttons
   - Keyboard navigation support
   - Focus styles
   - Semantic HTML

**CSS Structure (commit-list-item.component.css):**
```css
.commit-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;
}

.commit-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.commit-header {
  padding: 1rem;
  cursor: pointer;
  user-select: none;
}

.commit-summary-line {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.phase-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  white-space: nowrap;
}

.phase-badge[data-phase="Phase 1"] { background: #3b82f6; color: white; }
.phase-badge[data-phase="Phase 2"] { background: #10b981; color: white; }
.phase-badge[data-phase="Phase 3"] { background: #f59e0b; color: white; }
.phase-badge[data-phase="Phase 5"] { background: #8b5cf6; color: white; }
.phase-badge[data-phase="Documentation"] { background: #6b7280; color: white; }
.phase-badge[data-phase="Fix"] { background: #ef4444; color: white; }

.commit-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.875rem;
  color: #666;
}

.sha {
  font-family: 'Courier New', monospace;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
}

.commit-details {
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  background: #f9fafb;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.prompt-section {
  background: #fffbeb;
  border-left: 4px solid #f59e0b;
  padding: 1rem;
  border-radius: 4px;
}

.prompt {
  font-style: italic;
  margin: 0.5rem 0 0 0;
  color: #78350f;
}

pre.commit-message {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: white;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}
```

**Success Criteria:**
- ✅ Professional, polished appearance
- ✅ Consistent with existing design language
- ✅ Smooth animations and transitions
- ✅ Accessible to keyboard and screen readers
- ✅ Responsive on mobile devices
- ✅ Phase badges clearly differentiate commit types

**Prompts to use:**
- "Style the build history components with card design, phase badges, and smooth transitions"
- "Add responsive styling and accessibility features to commit list"

---

## Component Responsibilities

| Component | Responsibility | Dependencies |
|-----------|---------------|--------------|
| `BuildHistoryContainerComponent` | Main container, loads commits from service | `ContentLoaderService` |
| `CommitListItemComponent` | Display individual commit with expand/collapse | None (presentational) |

---

## TypeScript Interfaces Summary

```typescript
// In content.model.ts

export interface BuildHistoryMetadata {
  lastUpdated: string;
  totalCommits: number;
  extractedBy: string;
}

export interface Commit {
  sha: string;
  shaShort: string;
  author: string;
  timestamp: string;  // ISO 8601
  timestampReadable: string;  // Danish format
  summary: string;
  fullMessage: string;
  prompt?: string;
  filesChanged?: number;
  insertions?: number;
  deletions?: number;
  phase: string;
}

export interface BuildHistory {
  metadata: BuildHistoryMetadata;
  commits: Commit[];
}
```

---

## Technical Considerations

### 1. Data Update Strategy

**Challenge:** How to update build-history.json when new commits are added?

**Solutions:**
- **Manual update:** Run script and commit new JSON (simple, transparent)
- **Pre-commit hook:** Auto-update JSON before each commit (complex, might be circular)
- **Build-time script:** Update during `npm run build` (good for production)

**Recommendation:** Manual updates with script. Document in CLAUDE.md.

### 2. Prompt Extraction

**Challenge:** Reliably extract prompts from commit messages

**Solutions:**
- Look for line starting with `Prompt:`
- Handle variations: "Prompt used:", "User prompt:", etc.
- Regex: `/^Prompt:?\s*(.+)$/im`
- Handle multi-line prompts

**Recommendation:** Standardize on `Prompt:` prefix (already in guidelines)

### 3. Danish Date Formatting

**Challenge:** Format timestamps in Danish

**Solutions:**
- Pre-format in JSON (simple, works everywhere)
- Use Angular date pipe with Danish locale
- Custom pipe for Danish formatting

**Recommendation:** Pre-format in JSON for simplicity

### 4. Performance

**Consideration:** 10 commits is small, but could grow

**Solutions:**
- Virtual scrolling for >50 commits
- Pagination
- Search/filter functionality

**Recommendation:** No optimization needed for current scope

### 5. Accessibility

**Requirements:**
- Keyboard navigation for expand/collapse
- ARIA labels: `aria-expanded`, `aria-label`
- Focus management
- Screen reader announcements
- Semantic HTML (`<time>`, `<article>`, `<dl>`)

---

## Testing Checklist

### Unit Tests
- [ ] BuildHistoryContainerComponent renders
- [ ] CommitListItemComponent accepts commit input
- [ ] Expand/collapse signal updates correctly
- [ ] ContentLoaderService loads build history
- [ ] Commits$ observable emits data

### Integration Tests
- [ ] Navigation to history view works
- [ ] Commits display in list
- [ ] Expand button toggles details
- [ ] All commit data renders correctly
- [ ] Prompts display when present

### Manual Testing
- [ ] All three navigation tabs work
- [ ] Build history loads without errors
- [ ] Expand/collapse is smooth
- [ ] Phase badges display correct colors
- [ ] Timestamps are readable in Danish
- [ ] Full commit messages display correctly
- [ ] Prompts are highlighted appropriately
- [ ] Responsive on mobile (test @320px, @768px, @1024px)
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Screen reader announces state changes
- [ ] Works in Safari, Chrome, Firefox
- [ ] No console errors or warnings

### Accessibility Tests
- [ ] Run axe DevTools (0 violations)
- [ ] Test with keyboard only (no mouse)
- [ ] Test with VoiceOver/NVDA screen reader
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Focus indicators visible
- [ ] ARIA attributes correct

---

## Timeline Estimate

| Phase | Estimated Time | Complexity |
|-------|---------------|------------|
| Phase 1: Data extraction | 30-45 min | Low |
| Phase 2: TypeScript models | 15-20 min | Low |
| Phase 3: Components | 60-90 min | Medium |
| Phase 4: Navigation | 20-30 min | Low |
| Phase 5: Styling | 45-60 min | Medium |
| **Total** | **2.5 - 4 hours** | **Medium** |

**Buffer:** +30 min for testing and bug fixes

**Total with buffer:** 3-4.5 hours

---

## Success Criteria

### Definition of Done

1. ✅ build-history.json exists with all 10 commits
2. ✅ TypeScript interfaces defined and type-safe
3. ✅ BuildHistoryContainerComponent displays commit list
4. ✅ CommitListItemComponent expands/collapses smoothly
5. ✅ "Byggehistorik" tab in navigation works
6. ✅ All commit data displays correctly (SHA, author, time, message, prompt)
7. ✅ Phase badges colored appropriately
8. ✅ Prompts highlighted when present
9. ✅ Responsive design works on mobile
10. ✅ Accessibility requirements met (keyboard, screen reader, ARIA)
11. ✅ No console errors or TypeScript errors
12. ✅ Production build succeeds (`npm run build`)
13. ✅ Documentation updated in CLAUDE.md

### User Acceptance Criteria

- Workshop participants can view complete build history
- Each commit clearly shows what was built
- AI prompts are visible and educational
- Interface is intuitive and professional
- Reinforces the "built with AI" meta-demonstration

---

## Future Enhancements (Out of Scope)

- Search/filter commits by keyword
- Filter by phase
- Timeline visualization
- Diff viewer for file changes
- Link to GitHub commit URLs
- Real-time updates from git
- Export build history as PDF
- Statistics dashboard (commits per day, lines changed, etc.)

---

## References

- Existing components: `exercises/`, `slides/`
- Data pattern: `content.json`, `ContentLoaderService`
- Navigation pattern: `HeaderComponent`, `ViewType`
- Git log documentation: `man git-log`
- TypeScript interfaces: `content.model.ts`

---

## Notes

- This feature showcases the meta aspect of the workshop: the site itself demonstrates AI-assisted development
- Transparency in showing all prompts builds trust and educational value
- Keep implementation simple and maintainable (avoid over-engineering)
- Follow existing patterns for consistency
- Prioritize accessibility and responsive design
