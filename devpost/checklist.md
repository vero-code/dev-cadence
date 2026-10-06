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
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Enable calendar-driven date range selection: click start & end days on the calendar to highlight selection and open the Log Modal with dates pre-filled, while preserving the "+ Log Hackathon" button
- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence:
Route and stops:
Edit outcome:
Reflection:
Activity mode:

## Revisions

- Final Review refinement: Added direct calendar-driven date range selection (Option 3). Users can click a start day and an end day directly on the calendar grid to visually set work dates without blind-guessing in a pop-up. Keeps "+ Log Hackathon" button and adds a "Pick on Calendar" shortcut within the modal.
