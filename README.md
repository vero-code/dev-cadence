# Dev Cadence — Build & Rest Capacity Planner

![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![Vite 6](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)
![Firebase AI Logic](https://img.shields.io/badge/Firebase_AI_Logic-13.4-ffca28?logo=firebase&logoColor=black)
![Gemini 4 Hydrogen](https://img.shields.io/badge/Gemini_4_Hydrogen-Hybrid_AI-8e75b2?logo=googlegemini&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Manifest_V3-Side_Panel-4285f4?logo=google-chrome&logoColor=white)
![Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-green)

Chrome Side Panel extension to schedule developer sprints, flag overlapping dates with split cells, guard your monthly rest buffer, and get on-demand Hybrid AI assistance (on-device **Gemini Nano** with **Firebase AI Logic** cloud fallback).

*Video tutorial on Dev Cadence v0.2.0:*
> [![Video tutorial on Dev Cadence](https://img.youtube.com/vi/HrIht2-ZHvk/hqdefault.jpg)](https://youtu.be/HrIht2-ZHvk)

---

## The Problem

Logging multiple hackathons, bounties, and projects across disconnected calendars causes:

1. **Overcommitment:** Planning new work without seeing overlapping sprint dates.
2. **Date Collisions:** Unnoticed clashing crunch periods and simultaneous deadlines.
3. **Burnout:** Zero visibility into remaining rest days, leading to missed deadlines.

**Dev Cadence** lives directly inside Chrome's Side Panel as a real-time capacity guardrail.

---

## Features

### 🤖 1. Privacy-First Hybrid AI (`Firebase AI Logic`)
- **Extract from Page:** Click **Extract from Page** inside the Sprint form on any standard webpage to read the active tab's selected or visible text on demand, extract structured JSON (`title`, `deadline`) via `Schema` constraints, and auto-fill the form's **Title**, **URL**, and **Deadline**.
- **AI Pace Advisor:** Appears in the Capacity Bar when sprints overlap or your monthly rest buffer is short (hidden for past months). Deterministic JavaScript computes exact overlapping dates, deadline priority, and rest deficit, while Hybrid AI turns those facts into a concise markdown recommendation.
- **Transparent Execution:** Displays an `On-Device` (Chrome built-in **Gemini Nano**) or `Cloud` (**Gemini 4 Hydrogen** fallback via Firebase AI Logic) badge, supports click-to-stop cancellation (`AbortController`), and automatically hides the AI badge if you manually edit extracted fields.
- **Production App Check:** Secured with Firebase App Check via a `CustomProvider` backed by a **Firebase Cloud Function (2nd Gen)** (`getAppCheckToken`) restricted to allowed extension origins.

### 📅 2. Monthly Calendar
- **Interactive Grid:** Displays active sprint periods with custom colors and emojis.
- **Split-Cell Gradients:** Overlapping sprints dynamically split cells diagonally (`linear-gradient`).
- **Day Numbers:** Numbers stay clear at the top; `TODAY`, `START`, `END`, `1 DAY` badges and emojis sit neatly at the bottom. Bottom cell indicators follow a priority (`START` / `END` / `1 DAY` → sprint emojis → `TODAY`) so cells stay uncluttered.
- **Deadlines & Popovers:** Deadlines are flagged (`🏁`). Click or hover any busy day for quick event details.

### 🔄 3. Real-Time Form & Calendar Sync
- **Smart Range Anchor:** Click any day to auto-span a sprint by your configured `Build Days`. Click later days to stretch or shrink the sprint; click before the start to shift the start date.
- **Calendar Preview:** Editing dates in the inline form highlights the sprint range with a dashed border, soft tint, `START` / `END` badges, and deadline flag (`🏁`).
- **Tracker Hover Highlight:** Hovering a saved sprint in the Tracker highlights its range and deadline on the calendar (can be toggled in Settings).
- **Date & Overlap Validation:** Enforces valid `Start Date`, `End Date`, optional `Deadline`, and a max of 2 overlapping sprints per day.

### 🛡️ 4. Tri-Color Capacity Guardrail & Rest Buffer
- **Compact Capacity Bar:** Visual breakdown of your monthly days (`BUILD`, `FREE`, `REST X/Yd`):
  - 🔵 **Blue (Build):** Scheduled sprint days in the month.
  - 🟢 **Green (Free):** Available days remaining before dipping into rest.
  - 🟣 **Purple (Rest):** Protected recharge buffer (`0–31` days configured in Settings).

### 📋 5. Dual-Layout Tracker (Cards & Table)
- **Cards & Table Modes:** Switch between compact cards and a table view, sorted by earliest deadline first.
- **Status Filter:** Filter entries by lifecycle status (*Interest*, *Join*, *Early*, *Draft*, *Done*).
- **Month-Aware List:** Shows every sprint touching the selected month, including sprints that span across two months.

### 🎨 6. Multi-Theme Engine & Custom Typography
- **3 Built-In Themes:** `Ocean Slate`, `Obsidian Brass`, and `Warm Vellum` (default).
- **3 Font Presets:** `Bahnschrift`, `Geometric` (`Plus Jakarta Sans`), and `Marcellus`.
- **Font Scaling:** `90%`, `100%`, and `110%` scaling via CSS tokens with auto-save.

### 🔒 7. Local-First & Data Portability
- **Local Storage:** Uses `chrome.storage.local` in the extension with fallback to `localStorage`.
- **JSON Backup:** 1-click `Export JSON` and `Import JSON` to move data between devices.
- **Data Management & Transparency:** Verified `Clear Sprints` and `Factory Reset` controls, `Legal` and `Contact Support` modals, and a public [Privacy Policy](PRIVACY.md).

---

## What Was Built During #BuildHybridAI 2026

Dev Cadence originally existed before November 11, 2026 (`v0.2.0` tag) as a local-only Chrome Side Panel hackathon tracker with no AI or Firebase integration.

During **#BuildHybridAI 2026** (from `v0.2.0` to `v1.0.0`), the project was expanded into a universal Hybrid AI capacity planner:

- **Firebase AI Logic Hybrid Inference (`src/utils/hybridAi.js`):** Integrated `firebase ^13.4.0` (`InferenceMode.PREFER_ON_DEVICE` with `gemini-4-hydrogen` cloud fallback), structured JSON output (`Schema`), and cancelable generation (`AbortController` + abort racing for on-device calls).
- **Firebase App Check + Cloud Functions (`functions/index.js`):** Implemented a 2nd Gen Cloud Function (`getAppCheckToken`) using `firebase-admin/app-check` with origin validation to mint production App Check tokens for Chrome Extension MV3 `CustomProvider`.
- **Active-Tab Sprint Extractor (`src/components/modals/AiExtractBar.jsx`):** Added `activeTab`, `scripting`, and on-demand page extraction to auto-fill sprint title, URL, and deadline from any webpage, with live `On-Device` / `Cloud` source badges.
- **Deterministic + Hybrid AI Pace Advisor (`src/utils/scheduleAdvisor.js`, `src/components/CapacityBar.jsx`):** Built pure JS overlap detection, deadline-priority sorting, and rest-deficit calculation paired with Hybrid AI buddy phrasing rendered via `react-markdown`.
- **Universal Rebrand & UX Overhaul:** Removed platform-specific lock-in, added on-device AI setup settings, local JSON export/import, Apache 2.0 license, and [PRIVACY.md](PRIVACY.md) for Chrome Web Store submission (see the full list of UI/UX updates in the Changelog below v0.3.0/v1.0.0).

---

## Changelog

### v1.0.0 *(November 19, 2026)*
- Integrated **Firebase AI Logic** (`PREFER_ON_DEVICE` Gemini Nano + `gemini-4-hydrogen` cloud fallback) and **Firebase App Check** (`CustomProvider` + 2nd Gen Cloud Function `getAppCheckToken`).
- Added **Extract from Page** in the Sprint form using `activeTab` + `scripting` and structured JSON output (`Schema`), with `On-Device` / `Cloud` badges (`AiSourceBadge`) that hide if extracted fields are manually edited.
- Added **AI Pace Advisor** in `CapacityBar` with deterministic overlap & rest-deficit analysis (`scheduleAdvisor.js`), friendly buddy tone, `react-markdown` rendering, collapse toggle, scrollable output, and past-month hiding.
- Added cancelable AI generation (`AbortController` with animated loading dots) and shared deadline-first sprint sorting between Tracker and AI advisor.
- Limited daily sprint overlap to max 2, defaulted new sprint start dates to today, and refined calendar cell badge priority (`START`/`END`/`1 DAY` → emojis → `TODAY`) with dimmed unrelated emojis during preview.
- Set **Warm Vellum** as the default theme, added a back button to the inline Sprint form, centered the header subtitle, and grouped all project constants.
- Updated `LegalModal` and added [PRIVACY.md](PRIVACY.md) for Chrome Web Store release.

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

## Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite 6](https://vite.dev/) + `react-markdown`
- **Styling:** Modular Vanilla CSS with CSS tokens and responsive scaling
- **Platform:** Chrome Extension Manifest V3 (`sidePanel`, `storage`, `activeTab`, `scripting`, background service worker)
- **Hybrid AI & Backend:** [Firebase AI Logic](https://firebase.google.com/docs/ai-logic/hybrid) (`firebase ^13.4.0`), Firebase App Check (`CustomProvider`), Firebase Cloud Functions 2nd Gen (`firebase-functions ^7.0.0`, `firebase-admin ^13.6.0`, Node 24), Chrome Prompt API (`Gemini Nano`), and `gemini-4-hydrogen` cloud fallback

```text
dev-cadence/
├── functions/              # Firebase Cloud Functions 2nd Gen (App Check token minter)
├── public/                 # Extension manifest, icons, background service worker
├── src/
│   ├── components/         # Calendar, Tracker, CapacityBar, AiSourceBadge, Header, Footer, SVG icons
│   │   └── modals/         # Inline LogModal, AiExtractBar, Settings, Analytics, Legal, Contact, Confirm
│   ├── hooks/              # Storage state and calendar selection flow hooks
│   ├── styles/             # Modular domain stylesheets (calendar, tracker, modals, analytics)
│   ├── utils/              # Hybrid AI, schedule advisor, Nano status, date math, validation, storage
│   ├── App.jsx             # Root state coordinator
│   ├── constants.js        # Themes, typography presets, AI config, status options, and limits
│   └── index.css           # Stylesheet entry point
├── PRIVACY.md              # Public privacy policy
├── LICENSE                 # Apache License 2.0
└── package.json
```

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/vero-code/dev-cadence.git
cd dev-cadence
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in your Firebase Web App credentials and App Check endpoint:
```bash
cp .env.example .env
```
If deploying the App Check Cloud Function yourself, also configure `functions/.env` from `functions/.env.example` (`APPCHECK_WEB_APP_ID`, `ALLOWED_EXTENSION_IDS`) and run `firebase deploy --only functions`.

### 3. Local Preview or Chrome Extension Build
- **Web preview:** run `npm run dev` and open [http://localhost:5173](http://localhost:5173).
- **Chrome Extension:**
  ```bash
  npm run build
  ```
  1. Open `chrome://extensions` in Chrome and enable **Developer mode**.
  2. Click **Load unpacked** and select the `dist/` folder.
  3. Pin **Dev Cadence** and open it in the Chrome Side Panel.

---

## Quick Test

- **Hybrid AI Extract from Page:** Open any hackathon or project page, click `+` in Tracker, click **Extract from Page**, and confirm title, URL, deadline, and the `On-Device` / `Cloud` badge populate automatically.
- **Hybrid AI Pace Advisor:** Log two overlapping sprints (or lower available rest days below `Rest Days`), then click **AI Pace Advisor** in the bottom Capacity Bar. Click again while analyzing to test cancellation.
- **Collision Split & Live Sync:** Edit dates in the Sprint form and watch diagonal split cells and live preview aura update in real time.
- **Backup & Restore:** Export sprints to JSON in `Settings -> Data Management` and import them back.
- **On-Device Model Inspection:** Tested locally in Chrome with `nano_v3_gpu_high_tier_model` (**Gemini Nano**). You can inspect the installed model and status at `chrome://on-device-internals`, or check/download it via `Settings -> AI`.

---

## License

[Apache License 2.0](LICENSE). Expanded into a Hybrid AI capacity planner for developers during [#BuildHybridAI 2026](https://devpost.com/software/dev-cadence-ai). Originally created for [Build With AI: Basics](https://devpost.com/software/dev-cadence) as a hackathon pacing planner.