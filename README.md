# Dev Cadence — Build & Rest Capacity Planner

![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![Vite 6](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)
![Firebase 13.4](https://img.shields.io/badge/Firebase_AI_Logic-13.4-ffca28?logo=firebase&logoColor=black)
![Gemini 4 Hydrogen](https://img.shields.io/badge/Gemini_4_Hydrogen-Hybrid_AI-8e75b2?logo=googlegemini&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Manifest_V3-Side_Panel-4285f4?logo=google-chrome&logoColor=white)

Chrome Side Panel extension to pace monthly sprint workload, flag date collisions with split cells, and guard your rest buffer.

> [![Video tutorial on Dev Cadence](https://img.youtube.com/vi/HrIht2-ZHvk/hqdefault.jpg)](https://youtu.be/HrIht2-ZHvk)

---

## 💡 The Problem

Logging multiple projects and sprints across disconnected calendars causes:

1. **Overcommitment:** Planning new work without seeing overlapping sprint dates.
2. **Date Collisions:** Unnoticed clashing crunch periods and simultaneous deadlines.
3. **Burnout:** Zero visibility into remaining rest days, leading to missed deadlines.

**Dev Cadence** lives directly inside Chrome's Side Panel as a real-time capacity guardrail.

---

## ✨ Features

### 📅 1. Monthly Calendar & Collision Shader
- **Interactive Grid:** Displays active sprint periods with custom colors and emojis.
- **Split-Cell Gradients:** Overlapping sprints dynamically split cells diagonally (`linear-gradient`) with collision badges (`⚡`).
- **Clean Day Numbers:** Numbers stay clear at the top; `START` / `END` / `1 DAY` badges and emojis sit neatly at the bottom.
- **Deadlines & Popovers:** Deadlines are flagged (`🏁`). Hover any busy day for quick event details.

### 🔄 2. Real-Time Form & Calendar Sync
- **Smart Range Anchor:** Click any day to auto-span a sprint by your configured `Build Days`. Click later days to stretch or shrink the sprint; click before the start to shift the start date.
- **Live Preview Aura:** Editing dates in the inline form instantly highlights the calendar with a dashed aura, translucent tint, and animated deadline flag (`🏁`).
- **Date Validation:** Enforces valid `Start Date`, `End Date`, and optional `Deadline` ranges on save.

### 🛡️ 3. Tri-Color Capacity Guardrail & Rest Buffer
- **Compact Capacity Bar:** Visual breakdown of your monthly days (`BUILD`, `FREE`, `REST X/Yd`):
  - 🔵 **Blue (Build):** Scheduled sprint days in the month.
  - 🟢 **Green (Free):** Available days remaining before dipping into rest.
  - 🟣 **Purple (Rest):** Protected recharge buffer (`0–31` days configured in Settings).

### 📋 4. Dual-Layout Tracker (Cards & Table)
- **Cards & Table Modes:** Switch between compact cards and a table view.
- **Status Filter:** Filter entries by lifecycle status (*Interest*, *Join*, *Early*, *Draft*, *Done*).
- **Active Month Scope:** Shows all sprints active in the selected month, including multi-month sprints.
- **In-Place Actions:** 3-dots menu for editing and confirmed deletion.

### 🎨 5. Multi-Theme Engine & Custom Typography
- **3 Built-In Themes:** `Ocean Slate`, `Rich Dark`, and `Warm Vellum`.
- **3 Font Presets:** `Bahnschrift`, `Marcellus`, and `Plus Jakarta Sans`.
- **Font Scaling:** `90%`, `100%`, and `110%` scaling via CSS tokens with auto-save.

### 🔒 6. Local-First & Data Portability
- **Local Storage:** Uses `chrome.storage.local` in the extension with fallback to `localStorage`.
- **JSON Backup:** 1-click `Export JSON` and `Import JSON` to move data between devices.
- **Data Management:** Verified `Clear Sprints` and `Reset All` controls, plus `Legal` and `Contact Support` modals.

---

## 📦 Changelog

### v0.3.0 *(November 17, 2026)*

- Added an AI settings tab to check Chrome on-device AI (`Gemini Nano`) status and download the local model.

- Migrated font sizes across the app to CSS scale tokens (`10/12/14px`, `12/14/16px`, `14/16/18px`) and replaced `Cinzel` with `Marcellus`.

- Defaulted the calendar to the current month and added a header logo click to return to the current month.

- Made the main panel scrollable between the fixed header and footer, and opened Analytics in the full panel view with a return action.

- Converted the Sprint form into an inline card, aligned `Start Date`, `End Date`, and `Deadline` in one row, and made `Deadline` optional.

- Removed silent date auto-correction and added inline validation errors, including `Deadline` range checks against start and end dates.

- Added single-day (`1 DAY`) event support and responsive layout rules for multiple badges (`TODAY`, `START`, `END`) and emojis in calendar cells.

- Updated the color and emoji palette for visibility across light and dark themes, and added screen-reader labels (`aria-label`, `aria-pressed`).

- Added descriptions to status dropdown options, updated theme names, and replaced hackathon/Devpost labels with universal sprint terminology.

- Extracted `SprintLinkButton` with an updated tooltip and replaced emojis in the Sprint form and Settings buttons with vector SVG icons.

- Redesigned `CapacityBar` into a compact single-line summary (`BUILD`, `FREE`, `REST X/Yd`) and unified segment colors across themes.

- Updated `Settings -> General` with dropdown selectors, a single row for `Build Days`, `Rest Days` (`0–31`), and `Hover` with info tooltips, plus local JSON backup (`Export JSON` / `Import JSON`).

- Added a `Contact Support` modal with Discord webhook delivery, updated the license to Apache 2.0, simplified footer links, and moved the version label to Settings.

- Added ESLint configuration, split all components and CSS files under 250 lines into domain modules, and removed unused styles and exports.

### v0.2.0 *(October 20, 2026)*

- Added a hackathon URL field.

- Added monthly hackathon count badges by status.

- Updated status colors and names to align with the Devpost hackathon lifecycle.

- Added analytics to estimate event durations and average work days.

- Improved Tracker navigation with month switching.

- Added Schedule highlighting for Tracker items on hover, with an option to disable the effect.

- Refined Table View by removing emoji clutter.

- Improved Tracker sorting by start date.

---

## 🛠️ Tech Stack & Structure

- **Framework:** [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- **Styling:** Modular Vanilla CSS with CSS tokens and responsive scaling
- **Platform:** Chrome Extension Manifest V3 (`side_panel`, `storage`, background worker)
- **Hybrid AI:** [Firebase AI Logic](https://firebase.google.com/docs/ai-logic/hybrid) (`firebase ^13.4.0`), Firebase App Check, Chrome Prompt API (`Gemini Nano` on-device), and `gemini-4-hydrogen` cloud fallback

```text
dev-cadence/
├── public/                 # Extension manifest, icons, service worker
├── src/
│   ├── components/         # Calendar, Tracker, CapacityBar, Header, Footer, SVG icons
│   │   └── modals/         # Inline LogModal, Settings, Analytics, Legal, Contact, Confirm
│   ├── hooks/              # Storage state and calendar selection flow hooks
│   ├── styles/             # Modular domain stylesheets (calendar, tracker, modals, analytics)
│   ├── utils/              # Date math, range preview, validation, and storage bridge
│   ├── App.jsx             # Root state coordinator
│   ├── constants.js        # Themes, typography presets, status options, and limits
│   └── index.css           # Stylesheet entry point
└── package.json
```

---

## 🚀 Quick Start

### Local Preview
```bash
git clone https://github.com/vero-code/dev-cadence.git
cd dev-cadence
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### Chrome Extension Build
```bash
npm run build
```
1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select the `dist/` folder.
4. Pin Dev Cadence and open it in the Chrome Side Panel.

---

## 🧪 Quick Test

- **Collision Split:** Log two overlapping sprints (e.g. Nov 13–20 and Nov 18–25) to see diagonal split cells.
- **Live Sync:** Open the Sprint form and change dates; watch the calendar update in real time.
- **Rest Buffer:** Adjust `Rest Days` in Settings and see the `REST X/Yd` indicator update in the Capacity Bar.
- **Backup & Restore:** Export your sprints to JSON in `Settings -> Data Management` and import them back.

---

## 📄 License

[Apache License 2.0](LICENSE). Originally created for [Build With AI: Basics](https://devpost.com/software/dev-cadence) on Devpost as a hackathon pacing planner; expanded into a general-purpose sprint capacity planner for developers as part of **#BuildHybridAI 2026**.
