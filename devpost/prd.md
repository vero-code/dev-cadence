---
doc: prd
status: approved
---

# Dev Cadence — Product Requirements

An in-context Chrome extension side panel that helps Devpost hackathon participants realistically schedule work dates, visualize commitments vs. target rest days, and track their application pipeline directly beside active hackathon pages.

Source: `scope.md > The Unique Kernel` and `scope.md > The Core Loop`.

## The Core Journey
1. **Launch:** The user is browsing hackathons on Devpost. They click the Dev Cadence browser extension icon, and the panel slides out smoothly from the right side of the screen.
2. **First-Run State:** On first use, the user sees the Dev Cadence header with the automaton logo, a month title (e.g., "October Goals"), an empty calendar with the prompt *"Add a hackathon to start planning"*, an empty pipeline table, and a capacity bar showing 0 committed days.
3. **Log Hackathon:** The user clicks the prominent **"Log Hackathon"** button. A clean modal/form appears.
4. **Input Details:** The user enters:
   - **Hackathon Name** (e.g., "AI Basics Hackathon")
   - **Submission Deadline** (e.g., Oct 24)
   - **Application Status** (*Not registered*, *Early application*, *Waiting for API key*, *Considering*, or custom)
   - **Projected Work Dates** (e.g., Oct 13 to Oct 22)
   - **Color & Emoji Picker** (e.g., Cyan, Amber, Emerald, Violet + optional emoji chip)
5. **Instant Visual Update:** Upon clicking Save:
   - The calendar immediately shades days 13 through 22 with the chosen color and places the emoji badge.
   - The pipeline table adds a row with Title, Deadline, Status badge, and Work Dates range.
6. **Overlap Handling:** If the user logs a second hackathon whose work dates overlap with the first (e.g., Oct 20 to 26), calendar cells for the overlapping days (Oct 20–22) automatically split to display both colors and emojis, providing instant collision visibility.
7. **Workload Guardrail & Warning:** The user sets their desired monthly rest days (e.g., 8 days off) in Settings. As hackathons are logged, Dev Cadence calculates remaining free days. If remaining free days fall below the target rest threshold, a visual amber overcommitment warning triggers on the capacity bar.
8. **Management:** The user can edit or delete any logged hackathon directly from the pipeline table, switch between months using `<` and `>`, and rest assured that all data persists across page reloads and tab navigation.

## Screens and Layout
A unified, responsive side panel (approx. 380px–420px wide) docked to the right of Devpost:

1. **Header Bar:**
   - Dev Cadence logo (Steampunk Automaton holding glowing cyan `{}` code glyph and ink quill).
   - Month Navigator: `<` [Month Year] `>` with editable month goal title (e.g., "October Goals").
   - Settings button (opens rest-day target & turnaround config).
2. **Capacity & Workload Bar:**
   - Real-time metrics chip: `Committed: X days | Free: Y days | Target Rest: Z days`.
   - Dynamic status pill: `On Track (Healthy Cadence)` or `⚠️ Overcommitted (Rest buffer exceeded)`.
3. **Action Bar:**
   - Primary **+ Log Hackathon** button.
4. **Monthly Calendar Grid:**
   - 7-column standard monthly grid (Mon–Sun or Sun–Sat).
   - Day cells with day numbers, submission deadline flags (`🏁`), and shaded work date blocks.
   - Overlap display: multi-color split background or stacked emoji chips for days with multiple concurrent commitments.
5. **Pipeline Status Table:**
   - Clean tabular view below the calendar.
   - Columns: **Name**, **Deadline**, **Application Status** (color-coded badge), **Work Dates**, and **Actions** (✏️ Edit, 🗑️ Delete).
6. **Log / Edit Modal:**
   - Accessible overlay containing Name, Deadline date picker, Status dropdown/input, Work Dates range picker, and Color/Emoji selector.
7. **Settings Flyout / Modal:**
   - Target rest days per month input (default: 8 days).
   - Average project turnaround estimate (days).

## Look and Feel
Blends the mechanical precision of the user's custom automaton logo with Devpost's modern developer aesthetic:
- **Base Canvas:** Deep midnight navy and slate (`#0b1329`, `#131f37`) that frames Devpost comfortably without distraction.
- **Primary Energy:** Radiant electric cyan and teal (`#00A389`, `#06b6d4`, `#38bdf8`) inspired by the glowing `{}` code spark and Devpost’s brand accents.
- **Mechanical Accents:** Warm brass, bronze, and glowing vacuum-tube amber (`#f59e0b`, `#d97706`, `#b45309`) for gears, deadline flags, rest warnings, and table highlights.
- **Typography:** `Plus Jakarta Sans` or `Inter` for crisp readability, with `JetBrains Mono` for dates, counters, and capacity metrics.
- **Atmosphere:** Polished glassmorphism cards, glowing status dots, and smooth transitions on hover and state changes.

## Features and Behavior

### 1. Panel Lifecycle & In-Context Docking
Source: `scope.md > The Core Loop`
- The extension panel sits cleanly alongside Devpost pages.
- Can be collapsed or opened with a single click.
- Preserves state across browser tab switches and Devpost navigation.
  - [ ] Opening the extension slides out the panel smoothly without breaking page layout.
  - [ ] Closing and reopening preserves the active view and inputs.

### 2. Hackathon Logging & Management
Source: `scope.md > The POC Boundary`
- Users can log new hackathons, edit existing ones, and delete cancelled ones.
- Required fields: Name, Deadline date, Application Status, Work date range, Color/Emoji.
  - [ ] Submitting the form validates that dates are valid and title is non-empty.
  - [ ] Editing an entry immediately updates both the calendar shading and table row.
  - [ ] Deleting an entry removes its work dates from the calendar and recalculates monthly capacity.

### 3. Visual Monthly Calendar & Overlap Splitting
Source: `scope.md > What "Working" Looks Like`
- Calendar accurately displays the days of the selected month.
- Work date ranges are painted with the hackathon's chosen color/emoji.
- Days with deadlines feature a distinct milestone marker (`🏁`).
  - [ ] Single hackathon days display full colored fill or distinct tinted pill with emoji.
  - [ ] Overlapping dates between two or more hackathons split the day cell proportionally (e.g., dual-tone vertical/diagonal split or dual chips).
  - [ ] Navigating `<` and `>` changes the displayed month and renders that month's scheduled events.

### 4. Workload Capacity Calculation & Rest Warnings
Source: `scope.md > The Unique Kernel`
- Automatically calculates total committed work days in the current month.
- Calculates remaining free days (`Total Days in Month - Committed Days`).
- Compares remaining free days against user's target rest days.
  - [ ] If remaining free days >= target rest days: capacity bar shows normal healthy status.
  - [ ] If remaining free days < target rest days: capacity bar flags an amber/red overcommitment warning with clear copy (e.g. *"Only 4 free days remaining — 4 days short of your 8-day rest target"*).

### 5. Local Storage Persistence
Source: `scope.md > The POC Boundary`
- All hackathons, settings (rest days target), and custom statuses are saved to browser local storage.
  - [ ] Reloading the browser page retains all logged hackathons and configuration.
  - [ ] Data requires no network calls, cloud accounts, or remote database.

## States and Boundaries
- **First Use / Empty State:**
  - Calendar shows blank month with message: *"Add a hackathon to start planning"*.
  - Table displays empty state prompt: *"No hackathons logged for this month yet"*.
  - Capacity bar shows `0 committed days | 31 free days`.
- **Active / Normal State:**
  - Populated calendar with colored work blocks and deadline markers.
  - Populated pipeline table with actionable Edit/Delete controls.
- **Overlap State:**
  - Days with 2+ hackathons render split-color blocks so collisions are immediately evident.
- **Overcommitted / Warning State:**
  - When committed days leave fewer free days than the user's rest target, warning banner highlights the strain.
- **Persistence Boundary:**
  - All data lives in local browser storage (`localStorage` / `chrome.storage.local`). Zero third-party data tracking.

## Product Decisions
- **Side Panel Form Factor:** Keeps planning strictly in-context on Devpost so users never have to context-switch to detached spreadsheets.
- **Split Cells for Overlapping Dates:** Rather than blocking overlaps or overwriting colors, splitting the cell highlights schedule friction while giving the user autonomy to decide if they can handle concurrent sprints.
- **Configurable Rest Days Guardrail:** Keeps capacity assessment simple and honest by letting the user set their own rest day threshold rather than relying on an opaque machine learning estimate.
- **Steampunk / Automaton Aesthetic:** Incorporates the user's signature automaton logo (ink quill + gears + glowing code spark) with Devpost's tech styling to create an inspiring, crafted developer tool.

## What We're Building
- Complete Chrome extension side panel interface.
- Monthly calendar with date blocking, deadline markers, and multi-hackathon split cells.
- Real-time capacity calculator (committed days vs. free days vs. target rest days) with warning state.
- Interactive pipeline table with Name, Deadline, Status, Work Dates, and Edit/Delete.
- Log / Edit Hackathon modal with color and emoji pickers.
- Month navigation and persistent local storage.

## Deferred From the POC
- **Automated Devpost Tab Scraping:** Automatically parsing deadline and hackathon title from the active DOM (deferred to avoid brittle DOM selector issues in the 2–4 hour PoC).
- **Google Calendar 2-Way Sync:** Pushing work blocks to external calendar or syncing Google Calendar events (deferred to avoid OAuth/API complexity).
- **Multi-Month Timeline Gantt View:** Viewing an entire year-long hackathon horizon.

## Non-Goals
- Multi-user team collaboration, shared project boards, or team chat.
- Cloud database backend and user authentication.
- Global hackathon discovery directory (Devpost already handles discovery).

## Open Questions
- None blocking technical specification. All core interactions, layouts, states, and criteria are fully resolved.
