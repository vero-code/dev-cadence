---
doc: spec
status: approved
---

# Dev Cadence — Technical Specification

## How This Works, In Plain Language
Dev Cadence is a Chrome Extension built with React 19 and Vite that operates as a native browser side panel alongside Devpost.

When a user browses hackathons on Devpost, they click the extension icon to slide open the panel. Inside, the app maintains an in-memory React state synchronized with a lightweight dual-storage helper: it writes to `chrome.storage.local` when running inside the extension, and automatically falls back to browser `localStorage` during local development with Vite.

The panel features four core pieces working together:
1. **Capacity Calculator:** Computes total booked days in the selected month, calculates remaining free days, and compares them against the user's personal rest day target. If remaining days fall short of target rest, an amber alert badge alerts the user of overcommitment before they sign up.
2. **Monthly Calendar Grid:** Generates a 7-day grid of the active month. When hackathons are logged with start and end dates, the corresponding days are shaded with that hackathon's chosen color and marked with its emoji. If multiple hackathons share days, the day cell splits dynamically into a multi-color gradient with both emoji chips. Hovering or clicking a split day surfaces a tooltip listing the conflicting events.
3. **Pipeline Table:** Displays active hackathons in a clean spreadsheet format (Name, Deadline, Status badge, Work Dates) with instant Edit and Delete actions.
4. **Log / Edit Modal:** A form overlay for capturing and validating hackathon details, deadlines, and color/emoji assignments.

## The Core Journey Through the System
1. **Launch:** The user clicks the Dev Cadence icon on a Devpost page. Chrome opens the native side panel loading `index.html`.
   *PRD ref:* `prd.md > The Core Journey` (Step 1) and `prd.md > Features and Behavior > 1. Panel Lifecycle & In-Context Docking`.
2. **Initial State Load:** `App.jsx` mounts and calls `useStorage()` to fetch `hackathons`, `settings`, and the active month. If empty, the calendar renders the empty prompt *"Add a hackathon to start planning"* and the capacity bar displays 0 committed days.
   *PRD ref:* `prd.md > States and Boundaries > First Use / Empty State`.
3. **Logging an Event:** The user clicks "+ Log Hackathon". `LogModal.jsx` opens. The user inputs Title, Deadline, Status, Date Range, and selects a Color/Emoji. Upon clicking Save:
   - The new item is appended to the `hackathons` state array.
   - `storage.js` persists the updated array to storage.
   - `CalendarGrid.jsx` re-renders and colors the dates.
   - `CapacityBar.jsx` recalculates committed days and updates free days.
   - `PipelineTable.jsx` displays the new row.
   *PRD ref:* `prd.md > The Core Journey` (Steps 3–5) and `prd.md > Features and Behavior > 2. Hackathon Logging & Management`.
4. **Collision & Overlap Feedback:** If two logged events overlap, `calendarUtils.js` identifies the intersection and applies a split CSS gradient to the overlapping day cells. Hovering or clicking displays a conflict tooltip and highlights matching rows in the table.
   *PRD ref:* `prd.md > The Core Journey` (Step 6) and `prd.md > Features and Behavior > 3. Visual Monthly Calendar & Overlap Splitting`.
5. **Overcommitment Warning:** If total committed days leave fewer free days than `settings.targetRestDays`, `CapacityBar.jsx` renders an amber warning pill.
   *PRD ref:* `prd.md > The Core Journey` (Step 7) and `prd.md > Features and Behavior > 4. Workload Capacity Calculation & Rest Warnings`.

## Stack
- **Framework:** React 19 ([React Docs](https://react.dev/))
  - *Rationale:* Component-driven architecture allows clean separation between the calendar grid, capacity metrics, and pipeline table with reactive state updates.
- **Build Tool & Bundler:** Vite ([Vite Docs](https://vitejs.dev/))
  - *Rationale:* Instant hot-module-replacement (HMR) for fast local development, compiling directly to a clean `dist/` directory that Chrome loads as an unpacked extension.
- **Extension Architecture:** Chrome Extension Manifest V3 ([Chrome Extensions Side Panel Docs](https://developer.chrome.com/docs/extensions/reference/api/sidePanel))
  - *Rationale:* Manifest V3 `side_panel` provides a native, non-intrusive container docked alongside Devpost that persists across page navigations without iframe or z-index collisions.
- **Styling:** Modern Vanilla CSS with CSS Custom Properties
  - *Rationale:* Complete visual control to render the custom Steampunk Automaton + Devpost aesthetic (deep navy `#070d19`, electric cyan `#06b6d4`, warm brass/amber `#f59e0b`) without Tailwind build overhead.
- **Icons / Badges:** Unicode symbols and custom SVG icons embedded inline.
- **Storage:** `chrome.storage.local` with automatic fallback to `window.localStorage` ([Chrome Storage Docs](https://developer.chrome.com/docs/extensions/reference/api/storage)).

## Where It Runs and How Someone Tries It
- **Local Development & Preview:**
  - Command: `npm run dev`
  - Opens local dev server (e.g., `http://localhost:5173`) with live reload and automatic `localStorage` persistence.
- **Chrome Extension Mode (Load Unpacked):**
  - Command: `npm run build`
  - In Chrome, navigate to `chrome://extensions`.
  - Enable **Developer mode** (toggle in upper right).
  - Click **Load unpacked** and select the project's `dist/` directory.
  - Navigate to any Devpost page (`https://devpost.com`) and click the Dev Cadence icon to open the side panel.
- **Hackathon Demo Recording:**
  - Record the screen with Devpost open on the left and the Dev Cadence side panel open on the right. Show logging an event, the calendar split cell update, and the rest day capacity warning in under 60 seconds.

## Look and Feel
Carried directly from `prd.md > Look and Feel` and the user's custom automaton logo:
- **Palette:**
  - Background: Deep slate/midnight navy (`#070d19`, `#0f172a`, card: `rgba(18, 27, 49, 0.8)`)
  - Primary Glow: Radiant electric cyan / Devpost teal (`#06b6d4`, `#22d3ee`, `#00A389`)
  - Mechanical Accents: Warm brass, bronze, and vacuum-tube amber (`#f59e0b`, `#d97706`, `#b45309`)
  - Status Indicators: Emerald (`#10b981`) for on-track, Rose (`#f43f5e`) for critical deadlines
- **Typography:** `Plus Jakarta Sans` for clean interface copy, `JetBrains Mono` for dates, counters, and metrics.
- **Card Styling:** Glassmorphism cards with fine 1px translucent borders, glowing accents, and smooth 0.2s CSS transitions.

## Components

### Component: App (`src/App.jsx`)
- Top-level container managing application state (`hackathons`, `settings`, `currentMonthYear`, `activeFilter`).
- Coordinates child modals (`LogModal`, `SettingsModal`).
- Implements `prd.md > Features and Behavior > 1. Panel Lifecycle & In-Context Docking`.

### Component: Header (`src/components/Header.jsx`)
- Displays Dev Cadence brand with the automaton emblem.
- Month selector controls: `< [Month Year] >` allowing navigation between planning months.
- Settings gear button to open `SettingsModal`.
- Implements `prd.md > Screens and Layout > 1. Header Bar`.

### Component: CapacityBar (`src/components/CapacityBar.jsx`)
- Calculates committed days from `hackathons` overlapping the active month.
- Calculates remaining free days (`daysInMonth - committedDays`).
- Displays the comparison against `settings.targetRestDays`.
- Renders dynamic status pill: `Healthy Cadence` or `⚠️ Overcommitted (Rest buffer exceeded)`.
- Implements `prd.md > Features and Behavior > 4. Workload Capacity Calculation & Rest Warnings`.

### Component: CalendarGrid (`src/components/CalendarGrid.jsx`)
- Renders the 7-day monthly grid for the current month.
- Renders day numbers, milestone deadline flags (`🏁`), and colored work date blocks.
- On date collisions, dynamically splits the cell (e.g. dual-color linear gradient) and displays badges for each hackathon.
- Renders hover tooltip with event details on split days; clicking a day filters the table below.
- Empty state: displays *"Add a hackathon to start planning"*.
- Implements `prd.md > Features and Behavior > 3. Visual Monthly Calendar & Overlap Splitting`.

### Component: PipelineTable (`src/components/PipelineTable.jsx`)
- Renders spreadsheet-style list of hackathons for the current month.
- Columns: Color indicator, Hackathon Name, Deadline, Application Status chip, Work Dates, and Edit/Delete action buttons.
- Highlights row when corresponding day is hovered in the calendar.
- Implements `prd.md > Features and Behavior > 2. Hackathon Logging & Management`.

### Component: LogModal (`src/components/LogModal.jsx`)
- Accessible modal for adding or editing a hackathon.
- Form inputs: Title, Deadline (date), Status (dropdown: *Considering*, *Not registered*, *Early application*, *Waiting for API key*, or custom text), Work Start Date, Work End Date, Color palette selector, and Emoji chip picker.
- Validates date ranges before submission.
- Implements `prd.md > Screens and Layout > 6. Log / Edit Modal`.

### Component: SettingsModal (`src/components/SettingsModal.jsx`)
- Modal for configuring personal capacity preferences:
  - Target Rest Days per Month (number, default: 8)
  - Average Project Turnaround (days, default: 10)
- Implements `prd.md > Screens and Layout > 7. Settings Flyout / Modal`.

## Data Model

### Hackathon Entity
```typescript
interface Hackathon {
  id: string;               // Unique UUID/timestamp
  name: string;             // Hackathon title
  deadline: string;         // ISO date "YYYY-MM-DD"
  status: string;           // "Not registered" | "Early application" | "Waiting for API key" | "Considering" | custom
  startDate: string;        // ISO date "YYYY-MM-DD"
  endDate: string;          // ISO date "YYYY-MM-DD"
  color: string;            // Hex code (e.g. "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6")
  emoji: string;            // Single emoji (e.g. "⚡", "🚀", "🛠️", "💡")
}
```

### Settings Entity
```typescript
interface UserSettings {
  targetRestDays: number;   // Minimum desired days off per month (default: 8)
  avgTurnaroundDays: number;// Typical days needed per project (default: 10)
}
```

### Storage Shape
```json
{
  "dev_cadence_hackathons": [ ...Hackathon ],
  "dev_cadence_settings": { "targetRestDays": 8, "avgTurnaroundDays": 10 }
}
```
State updates trigger an immediate write to `chrome.storage.local` (or `localStorage`). On reload, state hydrates synchronously from storage.

## File Structure

```
dev-cadence/
├── manifest.json              # Chrome Extension Manifest V3 configuration
├── index.html                 # HTML entry point for side panel & Vite dev preview
├── vite.config.js             # Vite configuration with copy plugin for manifest & icons
├── package.json               # Dependencies (React, Vite) and scripts
├── public/                    # Extension static assets
│   ├── icon16.png             # Extension toolbar icons
│   ├── icon48.png
│   ├── icon128.png
│   └── logo.jpg               # Custom Steampunk Automaton emblem
├── src/
│   ├── main.jsx               # React DOM root render
│   ├── App.jsx                # Main layout, state container, and modal controls
│   ├── index.css              # Global tokens, reset, typography, and dark theme
│   ├── components/
│   │   ├── Header.jsx         # Branding, month navigation, settings trigger
│   │   ├── CapacityBar.jsx    # Committed vs free days vs rest target warning
│   │   ├── CalendarGrid.jsx   # Monthly calendar grid with split-cell overlaps
│   │   ├── PipelineTable.jsx  # Spreadsheet table with status chips & edit/delete
│   │   ├── LogModal.jsx       # Hackathon add/edit form dialog
│   │   └── SettingsModal.jsx  # Rest days target settings dialog
│   └── utils/
│       ├── storage.js         # Unified chrome.storage.local / localStorage bridge
│       └── calendarUtils.js   # Month day generator, overlap detector, date math
├── devpost/                   # Hackathon curriculum planning workspace
│   ├── learner-profile.md
│   ├── scope.md
│   ├── scope.html
│   ├── prd.md
│   ├── prd.html
│   ├── spec.md
│   └── spec.html
└── LICENSE                    # MIT License
```

## External Services and Dependencies
- **Chrome Extension API (`chrome.sidePanel`, `chrome.storage`):** Built into Chromium browsers. Zero external network calls, zero rate limits, zero costs.
- **Google Fonts (Plus Jakarta Sans, JetBrains Mono):** Loaded via CDN or system fallback.
- **Zero Third-Party Cloud Backend:** Complete client-side operation ensures 100% data privacy and zero latency.

## Important Failure Modes
1. **Running outside Chrome Extension context:**
   - *Failure:* Calling `chrome.storage.local` throws `undefined` in standard browser dev server (`npm run dev`).
   - *Fallback:* `storage.js` wraps calls in an environment check; automatically falls back to `window.localStorage` so development and preview remain 100% functional.
2. **End date before start date:**
   - *Failure:* User enters a work end date earlier than the start date.
   - *Fallback:* `LogModal.jsx` performs validation, highlights the offending field in red, and disables the Save button until valid.
3. **Corrupted local storage:**
   - *Failure:* Invalid JSON in storage.
   - *Fallback:* `storage.js` catches parse errors and safely initializes with an empty array `[]` rather than crashing the React tree.

## What Was Simplified and Why
- **`chrome.sidePanel` over DOM content script injection:** Using the native side panel API eliminates complex iframe resizing, z-index fights, and Devpost stylesheet bleed while natively docking alongside Devpost.
- **Client-Side Storage over Cloud Sync:** Local storage eliminates authentication flows, database setup, and internet dependency, keeping the proof of concept fast and private for the hackathon.
- **Manual Logging over DOM Web Scraping:** Eliminates fragile DOM selectors that break whenever Devpost updates class names, ensuring 100% reliable entry during the hackathon demo.

## Decisions and Open Issues
- **Learner-Selected Stack:** React 19 + Vite chosen for component modularity, fast live development, and smooth extension bundling.
- **Split-Cell Overlap Interaction:** Confirmed that overlapping calendar days render split backgrounds/chips, surface a hover tooltip detailing conflicting events, and filter the table on click.
- **Learner Uncertainty / Focus Area:** The learner wanted to evaluate the Devpost Learn Skill Pack and agent velocity. To optimize this, the spec provides a dual-mode dev workflow (`npm run dev` for instant preview, `npm run build` for Chrome unpacked extension) so the entire build can be verified step-by-step with zero friction.
- **Open Issues:** None. All technical contracts, data models, component boundaries, and file structures are established.
