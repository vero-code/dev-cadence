# Dev Cadence — Hackathon Capacity & Pacing Planner

> **An in-context Chrome Extension side panel for Devpost that helps serial hackathon participants pace monthly workload, visualize multi-event date collisions with split cells, and monitor rest day buffers to turn registrations into actual submissions.**

![React 19](https://img.shields.io/badge/React-19.0.0-61dafb?logo=react&logoColor=black)
![Vite 6](https://img.shields.io/badge/Vite-6.0.5-646cff?logo=vite&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Manifest_V3-Side_Panel-4285f4?logo=google-chrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 💡 The Problem

Serial hackathon competitors frequently register for multiple concurrent hackathons on Devpost ([`devpost.com`](https://devpost.com)). In practice, tracking workload across disconnected Google Sheets and Google Calendar entries leads to:

1. **Blind Overcommitment:** Logging registrations without visualizing whether active work dates overlap.
2. **Date Collisions:** Unnoticed clashing crunch periods, simultaneous submissions, and sprint bottlenecks.
3. **Burnout & Dropouts:** Zero visibility into remaining rest day buffers, turning enthusiastic registrations into last-minute no-shows.

**Dev Cadence** solves this by docking directly alongside Devpost inside Chrome's native Side Panel as a real-time capacity guardrail and visual schedule planner.

---

## ✨ Features

### 📅 1. Visual Monthly Calendar & Overlap Splitting (*The Kernel*)
- **7-Day Monthly Grid:** Displays an interactive calendar where active hackathons shade their dedicated work periods with custom theme colors and emoji badges.
- **Split-Cell Gradient Collision Shader:** When two or more hackathons overlap on the same calendar days, the cells dynamically split into multi-color diagonal CSS gradients (`linear-gradient(135deg, ...)`) with multi-event badges and conflict markers (`⚡`).
- **Deadline Flags & Conflict Tooltips:** Submission deadlines are clearly flagged (`🏁`). Hovering over any day reveals a detailed breakdown of all active events, submission deadlines, and overlap warnings.

### 🎯 2. Direct Calendar Date Range Selection
- **Click-to-Schedule:** Click a start day on the calendar, hover to see a luminous preview ribbon, and click an end day to instantly define your hackathon duration.
- **Auto-Prefill:** Automatically pre-fills the logging form with the chosen dates—no blind date-guessing or mental math required.
- **"Pick on Calendar" Action:** Inside the logging modal, click *"Pick on Calendar"* anytime to minimize the form and select dates directly on the visual grid.

### 🛡️ 3. Capacity Guardrail & Rest Buffer Alert
- **Dynamic Capacity Bar:** Computes total committed work days vs. remaining free days in the active month.
- **Configurable Rest Targets:** Set your target monthly rest days (e.g., 8–12 days) and average turnaround sprint duration in Settings.
- **Amber Overload Pill:** If scheduled work commitments encroach on your required rest buffer, Dev Cadence immediately triggers a prominent amber warning pill alerting you to the shortage.

### 📋 4. Pipeline Spreadsheet Tracker
- **Structured Table View:** Tracks Hackathon Name, Submission Deadline, Application Status, and Work Dates window in a compact spreadsheet interface.
- **Status Chips:** Distinct colored chips for *Not registered*, *Early application*, *Waiting for API key*, *Considering*, *In progress*, and *Submitted*.
- **Day Filtering & In-Place Actions:** Click any calendar day to filter the pipeline table to active hackathons on that day; edit and delete entries in place.

### 🧩 5. In-Context Chrome Side Panel & Dual Storage Bridge
- **Native Chrome Side Panel API (`chrome.sidePanel`):** Docks seamlessly on the right side of any Devpost hackathon page via Manifest V3 background service worker.
- **Unified Dual-Storage Bridge:** Uses `chrome.storage.local` inside the extension for persistent local storage across browser restarts, and automatically falls back to `window.localStorage` when running in a local Vite dev server.

---

## 🎨 Design System: Steampunk Automaton

Dev Cadence features a bespoke **Steampunk Automaton** aesthetic tailored for developers:

| Token | Value | Purpose |
| :--- | :--- | :--- |
| **Deep Space Navy** | `#070d19` | Dark glassmorphic container background |
| **Electric Cyan** | `#06b6d4` | Code glyph `{}` glow, selection ribbons, primary buttons |
| **Warm Brass / Amber** | `#f59e0b` | Automaton cogs, rest day warnings, start badges |
| **Emerald Green** | `#10b981` | Safe buffer indicators and registered status chips |
| **Monospace Font** | `'JetBrains Mono'` | Numeric dates, day counts, and status tags |
| **Interface Font** | `'Plus Jakarta Sans'` | Clean, modern developer typography |

---

## 🛠️ Tech Stack & Architecture

- **UI Framework:** [React 19](https://react.dev/) (`react: ^19.0.0`, `react-dom: ^19.0.0`)
- **Build Tool:** [Vite 6](https://vite.dev/) with relative asset resolution (`base: './'`)
- **Styling:** Vanilla CSS with design system custom properties, CSS grid, and glassmorphic backdrop filters
- **Extension Platform:** Chrome Extension Manifest V3 (`side_panel`, `storage`, background service worker)

### Project Structure

```text
dev-cadence/
├── public/
│   ├── background.js       # Manifest V3 service worker (openPanelOnActionClick)
│   ├── icon16.png          # Extension toolbar icon (16x16)
│   ├── icon48.png          # Extension management icon (48x48)
│   ├── icon128.png         # Chrome Web Store & installation icon (128x128)
│   ├── logo.jpg            # Dev Cadence automaton brand logo
│   └── manifest.json       # Manifest V3 configuration
├── src/
│   ├── components/
│   │   ├── CalendarGrid.jsx    # Monthly calendar, split-cell shader, range selection
│   │   ├── CapacityBar.jsx     # Workload capacity calculator & rest alert pill
│   │   ├── Header.jsx          # Automaton branding, month navigation, settings trigger
│   │   ├── LogModal.jsx        # Hackathon logging modal with color/emoji picker
│   │   ├── PipelineTable.jsx   # Spreadsheet tracker with status chips & actions
│   │   └── SettingsModal.jsx   # Rest target & turnaround configuration
│   ├── utils/
│   │   ├── calendarUtils.js    # Matrix generation, collision math & split gradients
│   │   └── storage.js          # Dual chrome.storage.local / localStorage bridge
│   ├── App.jsx                 # Top-level state coordinator & range selection handler
│   ├── index.css               # Steampunk design tokens, calendar styles & animations
│   └── main.jsx                # React 19 DOM entry point
├── devpost/
│   ├── checklist.md        # Step-by-step verified build checklist
│   ├── prd.md              # Product Requirements Document
│   ├── scope.md            # Proof of Concept boundary & kernel definition
│   └── spec.md             # Technical architecture specification
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- Google Chrome browser (v114+ with native Side Panel support)

### 1. Local Development (Browser Preview)

To run the application in the browser dev server:

```bash
# Clone the repository
git clone https://github.com/vero-code/dev-cadence.git
cd dev-cadence

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Data will persist to browser `localStorage`.

---

### 2. Chrome Extension Build & Installation

To build and load Dev Cadence as a native Chrome Side Panel extension:

```bash
# Build the production extension package
npm run build
```

This compiles the extension into the [`dist/`](dist) folder with relative assets and Manifest V3 compatibility.

#### Load Unpacked Extension into Chrome:
1. Open Google Chrome and navigate to:
   ```text
   chrome://extensions
   ```
2. Enable the **Developer mode** toggle in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the [`dist`](dist) directory inside this repository (`dev-cadence/dist`).
5. Click the **Extensions** (puzzle piece) icon in Chrome's toolbar and **pin** Dev Cadence.
6. Open [devpost.com/hackathons](https://devpost.com/hackathons) and click the Dev Cadence icon to launch the side panel!

---

## 🧪 Verification & Testing

- **Overlap Splitting:** Log two hackathons with overlapping dates (e.g., Oct 13–22 and Oct 20–26). Notice days 20, 21, and 22 render with diagonal split gradients and the collision indicator badge (`⚡`).
- **Capacity Guardrail:** In Settings, set your Target Rest Days to `10`. Log hackathons occupying 25 days in a 31-day month. Observe the amber overload pill flag the 4-day rest shortage.
- **Calendar Range Selection:** Click Day 14 on the grid (`START`), hover to Day 22, and click again. The Log Modal opens automatically with Start Date `2026-10-14` and End Date `2026-10-22` pre-filled.
- **Extension Persistence:** Add or modify hackathons in the side panel, close the panel, and reopen it to verify seamless data retention via `chrome.storage.local`.

---

## 📜 Devpost Hackathon Context

This project was conceived, planned, and built as part of the **Build With AI: Basics** learning hackathon on Devpost, strictly following the structured Devpost Learn skill pack:
- [`devpost/scope.md`](devpost/scope.md) — Finding the unique kernel and defining the POC boundary.
- [`devpost/prd.md`](devpost/prd.md) — Product definition, core journeys, and state boundaries.
- [`devpost/spec.md`](devpost/spec.md) — Technical blueprint, React 19 architecture, and extension lifecycle.
- [`devpost/checklist.md`](devpost/checklist.md) — End-to-end slice-by-slice verification and commits.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
