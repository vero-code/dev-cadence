---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Scaffold React 19 app & log hackathons to pipeline table**
  Becomes usable: A running side-panel / preview app with the Dev Cadence steampunk automaton branding, month selector, and "+ Log Hackathon" modal that captures title, deadline, status, dates, and color/emoji, rendering immediately in an interactive pipeline table with edit and delete controls.
  Why now: Bootstraps the React 19 + Vite project, dual storage bridge (`storage.js`), component structure, and base styling so every subsequent slice builds directly on working code.
  PRD ref: `prd.md > The Core Journey` (steps 1–5), `prd.md > Features and Behavior > 1. Panel Lifecycle & In-Context Docking`, `prd.md > Features and Behavior > 2. Hackathon Logging & Management`
  Spec ref: `spec.md > Components > Component: App`, `spec.md > Components > Component: Header`, `spec.md > Components > Component: LogModal`, `spec.md > Components > Component: PipelineTable`, `spec.md > Stack`
  Build: Initialize React 19 + Vite scaffold, configure CSS design system with custom properties and steampunk automaton theme, implement `storage.js` dual-storage bridge, create `App.jsx`, `Header.jsx`, `LogModal.jsx`, and `PipelineTable.jsx`.
  Verify (mechanical): Run `npm run build` to confirm zero compilation errors; verify test script adds a hackathon and renders it with correct status chip in the pipeline table.
  Learner check: Open the app preview, click "+ Log Hackathon", log a test hackathon (e.g., "Cloud Sprint", deadline 10/24, status "Early application", dates 13–22), and confirm it appears in the pipeline table with its status chip.
  Commit: `feat: scaffold React 19 side panel and log hackathons to pipeline table`

- [x] **2. Monthly calendar grid with date shading and split-cell overlaps**
  Becomes usable: A visual 7-day monthly calendar grid where logged hackathons shade their work date ranges with their chosen color and emoji, marked with deadline flags (`🏁`). Overlapping hackathons dynamically split day cells into multi-color gradients with dual chips, surfacing a conflict tooltip on hover and filtering the table on click.
  Why now: This is the unique kernel of Dev Cadence—delivering it early ensures the visual pacing and collision mechanics are tangible and verified before adding additional features.
  PRD ref: `prd.md > Features and Behavior > 3. Visual Monthly Calendar & Overlap Splitting`, `prd.md > The Core Journey` (step 6)
  Spec ref: `spec.md > Components > Component: CalendarGrid`, `spec.md > utils/calendarUtils.js`
  Build: Create `calendarUtils.js` for date math and multi-hackathon collision detection; build `CalendarGrid.jsx` rendering day cells, deadline flags, color fills, split-cell CSS gradients, and conflict hover tooltips; link calendar clicks to table row highlights.
  Verify (mechanical): Run calendar verification script with two overlapping events (e.g. Oct 13–22 and Oct 20–26); verify date collision math generates split styling on overlapping days 20, 21, and 22.
  Learner check: Look at the calendar grid, see your logged dates highlighted with your chosen color and emoji, and add an overlapping event to see the days split cleanly with the conflict tooltip.
  Commit: `feat: add monthly calendar grid with split-cell overlap visualization`

- [x] **3. Workload capacity calculator and rest days guardrail**
  Becomes usable: The capacity bar dynamically computes total committed days vs. remaining free days in the active month, comparing them against the user's rest day target (configurable in SettingsModal). If free days drop below the rest target, a prominent amber warning badge triggers with clear overload feedback.
  Why now: Completes the core value proposition of Dev Cadence—transforming the planner from a passive calendar into an active capacity guardrail that prevents overcommitment.
  PRD ref: `prd.md > Features and Behavior > 4. Workload Capacity Calculation & Rest Warnings`, `prd.md > The Core Journey` (step 7)
  Spec ref: `spec.md > Components > Component: CapacityBar`, `spec.md > Components > Component: SettingsModal`
  Build: Implement `CapacityBar.jsx` calculating committed and free days in the active month; implement `SettingsModal.jsx` to let users adjust target rest days and average turnaround time; wire up dynamic warning state when free days < rest target.
  Verify (mechanical): Test capacity calculation with 10 target rest days and 25 committed work days in a 31-day month; verify warning pill renders with text flagging the 4-day buffer shortage.
  Learner check: Open Settings, set your rest target (e.g. 10 days), log enough hackathons to exceed the capacity, and verify the amber warning alerts you that your rest buffer is exceeded.
  Commit: `feat: add capacity calculator and rest days overcommitment guardrail`

- [x] **4. Chrome extension packaging and side panel integration**
  Becomes usable: A complete Manifest V3 Chrome Extension package ready to load into Chrome via "Load unpacked", sliding out smoothly as a native side panel on any `devpost.com` page, with icons, toolbar action, and complete local persistence.
  Why now: Packages the built application into the final submission form factor so you can try it live alongside Devpost and record your 1-minute demo video.
  PRD ref: `prd.md > Screens and Layout > 1. Header Bar`, `prd.md > The Core Journey` (step 1)
  Spec ref: `spec.md > Stack > Extension Architecture`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Configure `manifest.json` with `side_panel`, `storage`, and `tabs` permissions, generate extension icons (16, 48, 128), update `vite.config.js` to bundle `manifest.json` and assets into `dist/`, verify `chrome.sidePanel` opening behavior on Devpost.
  Verify (mechanical): Run `npm run build`; verify `dist/manifest.json`, `dist/index.html`, and extension assets exist with valid Manifest V3 syntax.
  Learner check: Load the unpacked extension from `dist/` into Chrome (`chrome://extensions`), open a Devpost hackathon page, click the Dev Cadence icon, and see the side panel open directly beside Devpost.
  Commit: `feat: package manifest v3 chrome extension with side panel integration`

## Hands-on Checkpoints

- [x] Early usable behavior explored — Slice 2 (interactive calendar with split-cell overlaps)
- [x] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Make color and emoji optional in LogModal, and remove checkered flag (🏁) from event emojis to reserve exclusively for deadlines
- [x] Centralize palette, emojis, statuses, weekdays, and months constants into src/constants.js
- [x] Anchor floating tooltip popover directly next to clicked calendar cell with booking icon (dashed selection dismisses on clicking outside)
- [x] Render Log Hackathon popup card over the lower section with a soft dimmed backdrop covering the button and table without layout shift
- [x] Add confirmation modal before deleting a hackathon to prevent accidental loss
- [x] Allow saving hackathons with only an emoji and truly optional color (removed forced cyan fallbacks in calendar, table, and form defaults)
- [x] Pin Capacity Bar inside a sticky footer at the bottom of the screen with frosted glass dock styling
- [x] Display Available days (emerald green segment) on the Capacity progress track alongside Work and Target Rest
- [x] Redesign pipeline table into a compact card-based list to prevent long hackathon names from getting squished in side panel
- [x] Internal table card scrolling with theme scrollbars to keep side panel view height locked (no page overflow)
- [x] Extract MonthNavigator component and place it inline opposite the Monthly Schedule title
- [x] Embed Pipeline Tracker header, filter chip, and "+ Log Hackathon" button directly inside the table card
- [x] Position 3-dots kebab menu in the top-right corner of each card and status chip in the bottom-right corner (with elevated z-index stacking to prevent sibling card overlap and outside click / Esc dismiss)
- [x] Replace header theme switch button with a Settings cog icon (opening SettingsModal)
- [x] Integrate interactive theme picker cards directly into SettingsModal
- [x] Add future-ready engineer profile avatar badge into header actions (styled with matching rounded-square silhouette)
- [x] Add Tracker layout view toggle (compact cards vs classic table) and fix top hover border clipping
- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Focused alternative — evaluated planning/verification velocity on React 19 Chrome extension and resolved kick-the-tires UX friction by adding calendar-driven range selection.
Route and stops: 1. `src/utils/calendarUtils.js` (collision math & split gradients), 2. `src/components/CalendarGrid.jsx` (calendar range selection & hover preview), 3. `src/utils/storage.js` (dual storage bridge).
Edit outcome: Implemented calendar range selection & modal prefill, verified mechanically with `npm run build`, and verified as Chrome side panel extension.
Reflection: Addressed during final review and captured in App Map ("Context-first input over form-first guessing").
Activity mode: focused alternative

## Revisions

- Final Review refinement: Added direct calendar-driven date range selection (Option 3). Users can click a start day and an end day directly on the calendar grid to visually set work dates without blind-guessing in a pop-up. Keeps "+ Log Hackathon" button and adds a "Pick on Calendar" shortcut within the modal.
- Side Panel Ergonomics & Theme Alignment: Redesigned the horizontal hackathon table into a vertical compact card list (`PipelineTable`), locked the main layout height to prevent window scrollbars in the Chrome side panel, enabled internal list scrolling with theme-aware thin scrollbars, separated `MonthNavigator` inline next to the calendar title, and embedded the Tracker header and action button directly inside the table card.
- Theme Contrast & Stability: Fixed modal close button hover state in light/parchment theme to remain distinct and dark brown (`#78350f`) instead of fading into white, and stabilized footer capacity metric values to retain consistent colors without dynamic warning-state shifting.
- Table Mode, Typography & Danger Zone: Refined table view with fixed layout, ellipsis truncation, 3-dots kebab action menu, and adjacent dates/deadline stack (no horizontal scrolling). Added typography presets (Cinzel, Sans, Mono, Serif) and font size scaling in Settings, plus two-click confirmed data reset functions (Clear Hackathons and Factory Reset). Synchronized Target Rest metric number to purple (`#818cf8` / `#6366f1`) matching its progress bar scale.
- Calendar Popover & Card Clarity: Added direct event edit icon button (✏️) inside day popover list. Removed overlapping day glow to keep calendar view calm, highlighting strictly the current day (TODAY badge). Removed fuzzy blur/box-shadow on card indicator bars for crisp, sharp edges.
- Fonts, Tooltip Stability & Form Range Glow: Added Bahnschrift and Bebas Neue Bold font presets with live CSS tokens. Eliminated tooltip horizontal scrollbar caused by pencil hover scaling. Connected real-time dashed border highlighting on the calendar grid whenever the create/edit hackathon modal is open.
- Devpost Profile Integration & Constants Centralization: Replaced profile icon with custom automaton robot avatar artwork (`/avatar.png`), connected direct link to `https://devpost.com/software/dev-cadence` (`target="_blank"`), and centralized all font presets, font sizes, and themes into `src/constants.js`.
- GitHub Repo Constant, Cinzel Automaton Preset & Work Metric Centering: Extracted `GITHUB_REPO_URL` into `constants.js`, replaced Bebas font with classical antique `Cinzel Automaton` (`⚙️ Cinzel Automaton`), and centered the Work metric text perfectly both vertically and horizontally in the footer capacity bar.
- Global Font Unification & Settings Real-Time Live Preview: Unified heading and body typography tokens (`--font-heading` and `--font-main`) across all presets so the entire app switches fonts consistently, added global form element font inheritance, and enabled real-time live preview for themes, fonts, and sizes during settings selection with smooth non-jarring persistence upon saving.
- Dynamic Avg. Work Days Range Selection & Two-Column Settings Layout: Initialized calendar dashed range selection and event creation to span the configured `Avg. Work Days per Hackathon` duration instead of a single day, while preserving interactive custom day selection, and placed target rest and average sprint inputs side-by-side in a single row (`.form-row-2`).
- Settings Auto-Save & Clean Modal Dismiss: Replaced explicit Save/Cancel buttons with seamless real-time auto-saving on any theme, typography, rest target, or sprint duration change, complete with an `Auto-saved` indicator and dedicated single Close action.
- Devpost Classic Navy Theme Restoration: Restored the original launch theme from the initial release as the first option in the theme picker (🌐 Devpost Classic Navy). Features the authentic deep obsidian navy palette (`#070d19`), electric cyan primary buttons (`#0891b2` → `#06b6d4`) with dark navy lettering, glowing cyan sidepanel borders, clean modern sans typography, and classic Devpost capacity metrics.
- Theme Streamlining & Strict User-Font Enforcement: Removed redundant duplicate "Midnight Dark" theme, establishing 3 clear distinct themes (Devpost Classic Navy, Rich Automaton Dark, Light Parchment & Brass). Decoupled typography declarations from theme containers and enforced user-selected font presets (`Bahnschrift`, `Cinzel`, `Sans`, `Mono`) strictly across every theme and element without theme-level font overriding.
- Bidirectional Calendar & Form Synchronization: Fully linked the create/edit hackathon form (`LogModal`) with the interactive calendar (`CalendarGrid`) and capacity bar. When the form is open, modifying Start Date, End Date, or Deadline immediately updates the calendar highlight in real-time, displaying dynamic translucent color fill, pulsing dashed borders, START/END badges, animated 🏁 deadline flag, draft emoji, and header sync banner. Changing dates across months automatically navigates the calendar. Clicking any calendar cell while the form is open directly updates the form's active date inputs with two-step sprint range selection.
- Clean Day-Filter-Free Tracker & Active Month Scope: Eliminated day-by-day cell filtering from Tracker table (`PipelineTable`) so clicking calendar days never hides active sprint hackathons. The tracker displays all hackathons for the currently viewed month (including sprints spanning across month boundaries), perfectly matching the calendar's active month without showing other months.
- Settings Two-Column Layout & Typography Simplification: Removed JetBrains Mono (`mono`) leaving three primary fonts (`Bahnschrift`, `Cinzel Automaton`, `Modern Geometric`). Redesigned the Settings modal layout to place Theme and Typography side-by-side in balanced two-column vertical stacks with identical button heights, checkmarks (`✓`), and live font previews, keeping the font size scaler centered directly below.
- Visual & Ergonomic Polish (Footer Links, Aged Gear & Tracker Filter): Restyled footer links (`Privacy Policy`, `Terms of Use`, `Contact`) from browser-default blue to muted slate (`#64748b`), harmonizing with the dark Devpost navy theme without eye glare. Changed `vero-code` author link to match the Tracker heading text (`var(--text-main)` / `#f8fafc`). Replaced flat Windows emoji gear with an authentic aged mechanical clockwork cogwheel SVG (`AgedGearIcon`) featuring bronze/steel patina, hub, spokes, and smooth hover rotation in both header and settings modal. Upgraded the Tracker header with a clean vector checklist badge icon, an interactive status filter dropdown with filter arrows (`FilterArrowsIcon`) and chevron next to the title, and replaced raw emoji view toggles (`🗂️` / `📊`) with sleek vector card/table SVG icons.
