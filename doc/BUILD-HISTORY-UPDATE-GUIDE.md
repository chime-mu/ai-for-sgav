# Build History Update Guide

This document provides step-by-step instructions for updating `/src/assets/build-history.json` when new commits are added to the repository. Use this as a prompt for Claude Code when the build history needs refreshing.

## When to Update

Update `build-history.json` after:
- Completing a new feature or phase
- Making significant commits with AI prompts
- Before deployment to production
- When demonstrating the AI-assisted development process

## Quick Start Prompt for Claude Code

```
Please update /src/assets/build-history.json with the latest git commits.
Follow the process in @doc/BUILD-HISTORY-UPDATE-GUIDE.md
```

---

## Data Extraction Process

### Step 1: Get Total Commit Count

```bash
git rev-list --count HEAD
```

This gives you the `totalCommits` number for metadata.

### Step 2: Extract All Commits

Run this command to get all commit data in a structured format:

```bash
git log --all --reverse --format='%H|%h|%an <%ae>|%aI|%s|%b---COMMIT-SEP---'
```

**Format Breakdown:**
- `%H` = Full SHA hash
- `%h` = Short SHA (7 chars)
- `%an <%ae>` = Author name and email
- `%aI` = ISO 8601 timestamp
- `%s` = Commit subject (summary)
- `%b` = Commit body (full message)
- `---COMMIT-SEP---` = Separator between commits

### Step 3: Process Each Commit

For each commit, extract and format:

#### A. Basic Metadata
- **sha**: Full hash from `%H`
- **shaShort**: Short hash from `%h` (first 7 characters)
- **author**: Format as "Name <email>" from `%an <%ae>`
- **timestamp**: ISO 8601 format from `%aI`

#### B. Readable Timestamp (Danish Format)
Convert ISO timestamp to Danish format: `"DD. mmm YYYY, HH:MM"`

**Example conversions:**
- `2025-11-27T08:41:21+01:00` → `"27. nov 2025, 08:41"`
- `2025-11-27T07:29:10+01:00` → `"27. nov 2025, 07:29"`

**Month abbreviations (Danish):**
- jan, feb, mar, apr, maj, jun, jul, aug, sep, okt, nov, dec

Use JavaScript to format:
```javascript
const date = new Date(isoTimestamp);
const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const timestampReadable = `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
```

#### C. Summary
Use the commit subject (`%s`) as-is for the summary field.

**Example:** `"feat: Phase 1 - Build History data extraction and JSON file creation"`

#### D. Full Message
Extract the full commit body (`%b`) as the `fullMessage`.

**Processing:**
- Preserve all text from commit body
- Include multi-line descriptions
- Keep formatting (newlines, bullets)
- Remove only the `---COMMIT-SEP---` separator

#### E. Extract AI Prompt

**Prompt Patterns to Look For:**

1. **Single Prompt Pattern:**
```
Prompt: "The exact prompt text here"
```

2. **Multiple Prompts Pattern:**
```
Prompts used:
"""
User: "First prompt"

Claude response...

User: "Second prompt"
"""
```

3. **Quoted Dialogue Pattern:**
```
Prompt used:
"""
User: "When running ng serve i get zsh: command not found: ng"
User: "Please adjust the README accordingly"
"""
```

**Extraction Logic:**
- Search commit body for lines starting with `Prompt:` or `Prompts used:`
- If found:
  - Extract everything after `Prompt: "` until the closing `"`
  - OR extract the full triple-quoted block after `Prompts used:`
- If NOT found (early commits): set `prompt` to `null`
- Clean up extracted text:
  - Remove markdown formatting if present
  - Preserve original wording exactly
  - Don't truncate or summarize

**Examples:**
- Found: `"Update CLAUDE.md with Build History feature documentation"`
- Found: `"Plan phase 3"`
- Not found: `null`

#### F. Determine Phase

Analyze the commit summary and body to identify the phase:

**Phase Detection Rules:**

1. **Explicit Phase Mentions** (highest priority):
   - Look for `Phase 1`, `Phase 2`, `Phase 3`, `Phase 5` in subject or body
   - Example: `"feat: Phase 3 - Build History UI components"` → `"Phase 3"`

2. **Commit Type Prefixes** (if no explicit phase):
   - `docs:` → `"Documentation"`
   - `fix:` → `"Fix"`
   - First commit, no prefix → `"Setup"`

3. **Content-Based Classification** (fallback):
   - Mentions "plan" or "planning" → `"Planning"`
   - Initial setup commits → `"Setup"`
   - Everything else → Use the commit type or `"Other"`

**Phase Values Used:**
- `"Phase 1"`, `"Phase 2"`, `"Phase 3"`, `"Phase 5"`
- `"Documentation"`
- `"Fix"`
- `"Setup"`
- `"Planning"`

**Example Mapping:**
```
"feat: Phase 1 - Project foundation..." → "Phase 1"
"docs: Update CLAUDE.md..." → "Documentation"
"fix: Configure angular.json..." → "Fix"
"Initial commit: PRD" → "Setup"
"docs: Add comprehensive implementation plan..." → "Planning"
```

---

## JSON Structure

The final JSON file should have this exact structure:

```json
{
  "metadata": {
    "lastUpdated": "YYYY-MM-DDTHH:MM:SS+TZ",
    "totalCommits": <number>,
    "extractedBy": "Claude Code - Build History extraction"
  },
  "commits": [
    {
      "sha": "full-40-char-hash",
      "shaShort": "7-char",
      "author": "Name <email>",
      "timestamp": "YYYY-MM-DDTHH:MM:SS+TZ",
      "timestampReadable": "DD. mmm YYYY, HH:MM",
      "summary": "Commit subject line",
      "fullMessage": "Full commit body text...",
      "prompt": "Extracted prompt or null",
      "phase": "Phase X or type"
    }
  ]
}
```

### Commit Ordering

**IMPORTANT:** List commits in **newest-first** order (reverse chronological).

- First commit in array = Most recent commit
- Last commit in array = Initial commit

This ensures users see the latest changes first when viewing build history.

---

## Step-by-Step Update Process

### 1. Extract Git Data

```bash
# Get total commits
TOTAL=$(git rev-list --count HEAD)

# Get current timestamp
NOW=$(date -u +"%Y-%m-%dT%H:%M:%S+00:00")

# Extract all commits
git log --all --format='%H|%h|%an <%ae>|%aI|%s|%b---COMMIT-SEP---'
```

### 2. Parse Each Commit

For each commit separated by `---COMMIT-SEP---`:

1. Split on `|` to get: SHA, short SHA, author, timestamp, subject, body
2. Format `timestampReadable` using the ISO timestamp
3. Extract `prompt` from the body using patterns above
4. Determine `phase` from subject/body
5. Clean and prepare `fullMessage`

### 3. Build JSON Structure

```javascript
{
  metadata: {
    lastUpdated: NOW,
    totalCommits: TOTAL,
    extractedBy: "Claude Code - Build History extraction"
  },
  commits: [
    // Array of commit objects, newest first
  ]
}
```

### 4. Validate Output

Before writing the file, validate:

✅ **Syntax:** Valid JSON (no trailing commas, proper escaping)
✅ **Completeness:** All commits present (count matches `git rev-list --count HEAD`)
✅ **Prompts:** Prompts extracted where present (check recent commits)
✅ **Ordering:** Newest commit first in array
✅ **Timestamps:** Both ISO and Danish formats present
✅ **Phases:** All commits have a phase classification

### 5. Write to File

Overwrite `/src/assets/build-history.json` with the new data.

### 6. Test

```bash
# Validate JSON syntax
node -e "JSON.parse(require('fs').readFileSync('src/assets/build-history.json', 'utf8'))"

# Check commit count matches
git rev-list --count HEAD
# Compare with totalCommits in JSON
```

---

## Example: Processing a Single Commit

**Git Output:**
```
10d5c58f|10d5c58|Michael Arnoldus <ma@goodmonday.io>|2025-11-27T08:05:12+01:00|feat: Phase 3 - Build History UI components and navigation integration|Created components...

Prompts used:
"""
User: "Plan phase 3"

Claude presented plan...
"""

🤖 Generated with Claude Code
---COMMIT-SEP---
```

**Processed JSON Object:**
```json
{
  "sha": "10d5c58f1234567890abcdef1234567890abcdef",
  "shaShort": "10d5c58",
  "author": "Michael Arnoldus <ma@goodmonday.io>",
  "timestamp": "2025-11-27T08:05:12+01:00",
  "timestampReadable": "27. nov 2025, 08:05",
  "summary": "Phase 3 - Build History UI components and navigation integration",
  "fullMessage": "Created components...\n\nPrompts used:\n\"\"\"\nUser: \"Plan phase 3\"\n\nClaude presented plan...\n\"\"\"\n\n🤖 Generated with Claude Code",
  "prompt": "Plan phase 3",
  "phase": "Phase 3"
}
```

---

## Common Issues and Solutions

### Issue: Prompts Not Extracted

**Symptom:** `prompt` field is `null` for recent commits
**Solution:**
- Check commit message format
- Look for `Prompt:` or `Prompts used:` in body
- Verify triple-quoted sections are captured
- Early commits may legitimately have no prompts

### Issue: Wrong Commit Order

**Symptom:** Oldest commits appear first
**Solution:**
- Ensure array is reversed after parsing
- Newest commit should be index 0
- Use `git log` without `--reverse` OR reverse the array after building

### Issue: Invalid JSON

**Symptom:** JSON parse errors
**Solution:**
- Check for trailing commas
- Escape double quotes in strings: `\"`
- Escape backslashes: `\\`
- Validate with JSON linter before writing

### Issue: Missing Timestamps

**Symptom:** `timestampReadable` is wrong format
**Solution:**
- Use Danish month abbreviations (lowercase): jan, feb, mar, etc.
- Format: "27. nov 2025, 08:41" (note lowercase month, 24-hour time)
- Parse ISO timestamp correctly with timezone

### Issue: Phase Misclassification

**Symptom:** Wrong phase assigned
**Solution:**
- Check commit subject first for "Phase X"
- Then check body content
- Use commit type prefix (`docs:`, `feat:`, `fix:`) as fallback
- Default to commit type for unclear cases

---

## Maintenance Notes

### When Adding New Phase Types

If a new phase or category is introduced:

1. Update phase detection rules above
2. Add new phase badge color in commit-list-item.css
3. Document new phase in CLAUDE.md
4. Regenerate build-history.json with new classification

### Incremental Updates vs Full Regeneration

**Incremental (NOT RECOMMENDED):**
- Manually add new commits to array
- Risk of inconsistency

**Full Regeneration (RECOMMENDED):**
- Run extraction process from scratch
- Ensures all commits follow same formatting
- Catches any retroactive corrections
- Only takes a few seconds

**Best Practice:** Always regenerate the entire file.

---

## Automation Script (Optional)

A Node.js script can automate this process. The script should:

1. Run git log command
2. Parse output
3. Format timestamps
4. Extract prompts
5. Determine phases
6. Build JSON
7. Write file
8. Validate

**Location:** Could be added to `/scripts/update-build-history.js` if needed.

---

## Summary Checklist

When updating build-history.json:

- [ ] Extract all commits with `git log`
- [ ] Parse each commit into structured data
- [ ] Format Danish timestamps correctly
- [ ] Extract AI prompts from commit bodies
- [ ] Classify commits by phase
- [ ] Order commits newest-first
- [ ] Update metadata (lastUpdated, totalCommits)
- [ ] Validate JSON syntax
- [ ] Test file loads in application
- [ ] Commit the updated build-history.json

---

## Quick Reference

**Command to get commit data:**
```bash
git log --all --format='%H|%h|%an <%ae>|%aI|%s|%b---COMMIT-SEP---'
```

**Danish month abbreviations:**
jan, feb, mar, apr, maj, jun, jul, aug, sep, okt, nov, dec

**Prompt extraction patterns:**
- `Prompt: "..."`
- `Prompts used:\n"""\n...\n"""`

**Phase detection:**
1. Look for "Phase X" in text
2. Check commit type prefix (docs:, fix:, feat:)
3. Analyze content for "planning", "setup", etc.

**File location:**
`/src/assets/build-history.json`

---

## Example Complete Update Session

```bash
# 1. Get total commits
git rev-list --count HEAD
# Output: 15

# 2. Extract commits
git log --all --format='%H|%h|%an <%ae>|%aI|%s|%b---COMMIT-SEP---' > /tmp/commits.txt

# 3. Process with script or manually build JSON

# 4. Validate
node -e "JSON.parse(require('fs').readFileSync('src/assets/build-history.json', 'utf8'))" && echo "✅ Valid JSON"

# 5. Verify in browser
npm start
# Navigate to Byggehistorik tab and check commits display

# 6. Commit
git add src/assets/build-history.json
git commit -m "docs: Update build history with latest commits"
```

---

## Version History

- **v1.0** (2025-11-27) - Initial guide created
- Document created during Build History feature development
- Based on actual implementation in commits c15585b through d59f56e
