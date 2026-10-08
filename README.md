# Dev Cadence — Hackathon Capacity & Pacing Planner

> **Chrome Side Panel extension for Devpost. Paces monthly workload, flags date collisions with split cells, and guards rest buffers to turn registrations into submissions.**

![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![Vite 6](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Manifest_V3-Side_Panel-4285f4?logo=google-chrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 💡 The Problem

Logging multiple hackathons across disconnected calendars causes:

1. **Overcommitment:** Registering without seeing overlapping sprint dates.
2. **Date Collisions:** Unnoticed clashing crunch periods and simultaneous deadlines.
3. **Burnout:** Zero visibility into remaining rest days, leading to missed submissions.

**Dev Cadence** lives directly inside Chrome's Side Panel next to Devpost as a real-time capacity guardrail.

---

## ✨ Features

### 📅 1. Monthly Calendar & Collision Shader
- **Interactive Grid:** Displays active hackathon sprint periods with custom colors and emojis.
- **Split-Cell Gradients:** Overlapping hackathons dynamically split cells diagonally (`linear-gradient`) with collision badges (`⚡`).
- **Clean Day Numbers:** Numbers stay clear at the top; `START` / `END` badges and emojis sit neatly at the bottom.
- **Deadlines & Popovers:** Submission deadlines are flagged (`🏁`). Click any busy day for quick event details and edit triggers.

### 🔄 2. Real-Time Form & Calendar Sync
- **Smart Range Anchor:** Click any empty day to auto-span a sprint by your configured turnaround. Click later days to dynamically stretch or shrink the sprint; click before the start to shift the start date; click the start day again to deselect.
- **Live Preview Aura:** Editing dates in the form instantly highlights the calendar with a glowing dashed aura, translucent tint, and animated deadline flag (`🏁`).
- **Date Safety Guard:** Automatically enforces `startDate <= endDate` and prevents invalid date collisions.

### 🛡️ 3. Tri-Color Capacity Guardrail & Rest Buffer
- **Tri-Color Capacity Bar:** Visual breakdown of your monthly days:
  - 🔵 **Blue (Sprint Days):** Total scheduled hackathon commitment.
  - 🟣 **Purple (Available Buffer):** Free days remaining before dipping into rest.
  - 🟢 **Green (Target Rest):** Protected recharge buffer (configured in Settings, e.g. 8–12 days).
- **Burnout Warning:** Prominent overload badge alerts you when work encroaches on your rest buffer.

### 📋 4. Dual-Layout Tracker (Cards & Table)
- **Cards & Table Modes:** Switch between compact cards (optimized for side panels) and a classic table view.
- **Status Filter:** Filter entries instantly (*Interested*, *Planning*, *In Progress*, *Submitted*).
- **Active Month Scope:** Shows all hackathons active in the current month, including multi-month sprints.
- **In-Place Actions:** 3-dots menu for fast editing and confirmed deletion.

### 🎨 5. Multi-Theme Engine & Custom Typography
- **3 Built-In Themes:**
  - 🌐 **Devpost Classic Navy:** Deep obsidian navy, electric cyan, and glowing borders.
  - ⚙️ **Rich Automaton Dark:** Clockwork steampunk, warm brass, and mechanical gears.
  - 📜 **Light Parchment & Brass:** Warm paper, sepia tones, and bronze accents.
- **3 Font Presets:** `Bahnschrift` (Technical), `Cinzel Automaton` (Serif), `Modern Geometric` (Sans).
- **Font Scaling:** *Compact*, *Normal*, and *Large* sizing with live preview and auto-save.

### 🔒 6. 100% Local-First & Zero Telemetry
- **No Cloud, No Trackers:** Zero accounts, zero external APIs, zero tracking cookies.
- **Dual Storage:** Uses `chrome.storage.local` in the extension with fallback to `localStorage`.
- **Danger Zone:** 1-click verified *Clear Hackathons* and complete *Factory Reset*.
- **Legal Center:** Integrated *Privacy Policy* and *Terms of Use* dialog in the footer.

---

## 🎨 Theme Tokens

| Token | Devpost Classic Navy | Rich Automaton Dark | Light Parchment | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Background** | `#070d19` | `#0c0804` | `#fbf6ee` | Panel background |
| **Primary Accent** | `#06b6d4` (Cyan) | `#f59e0b` (Amber) | `#b8860b` (Gold) | Active buttons & highlights |
| **Selection Aura** | `rgba(6, 182, 212, 0.35)` | `rgba(245, 158, 11, 0.3)` | `rgba(184, 134, 11, 0.2)` | Dashed calendar glow |
| **Safe Buffer** | `#10b981` (Emerald) | `#10b981` (Emerald) | `#15803d` (Green) | Rest indicators & submissions |

---

## 🛠️ Tech Stack & Structure

- **Framework:** [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- **Styling:** Vanilla CSS with CSS tokens, container queries, and backdrop blur
- **Platform:** Chrome Extension Manifest V3 (`side_panel`, `storage`, background worker)
- **Built With AI:** Developed via **Devpost Learn Skill Pack** (`1-start` &rarr; `6-ship`) inside **Google Antigravity** using Flipped Interaction.

```text
dev-cadence/
├── public/                 # Extension manifest, icons, service worker
├── src/
│   ├── components/
│   │   ├── CalendarGrid.jsx    # Calendar, split-cell shader, range sync
│   │   ├── CapacityBar.jsx     # Workload capacity bar & rest alert
│   │   ├── ConfirmModal.jsx    # Deletion confirmation dialog
│   │   ├── Footer.jsx          # Capacity bar, author & legal links
│   │   ├── Header.jsx          # Branding, avatar & gear trigger
│   │   ├── Icons.jsx           # Precision vector SVG icons
│   │   ├── LegalModal.jsx      # Privacy Policy & Terms of Use
│   │   ├── LogModal.jsx        # Hackathon form with live sync
│   │   ├── MonthNavigator.jsx  # Inline month navigation
│   │   ├── PipelineTable.jsx   # Dual-view tracker (Cards/Table)
│   │   └── SettingsModal.jsx   # Themes, fonts, targets & Danger Zone
│   ├── utils/
│   │   ├── calendarUtils.js    # Matrix math, collisions & gradients
│   │   └── storage.js          # Dual chrome.storage / localStorage bridge
│   ├── App.jsx                 # State coordinator & sync orchestration
│   ├── constants.js            # Themes, typography presets & colors
│   └── index.css               # Design tokens, layouts & animations
├── devpost/                # Scope, PRD, spec, and build checklist
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
4. Pin Dev Cadence and click its icon on any Devpost page.

---

## 🧪 Quick Test

- **Collision Split:** Log two overlapping hackathons (e.g. Oct 13–20 and Oct 18–25) to see diagonal split cells with `⚡`.
- **Live Sync:** Open Log Modal and change dates; watch the calendar update in real-time with cyan glow.
- **Rest Alert:** Set Target Rest Days to `10` in Settings and log 25 work days to trigger the overload pill.
- **Dual Views:** Switch between Cards and Table views in the Tracker header.
- **Themes & Fonts:** Open Settings to toggle themes and typography with instant preview.

---

## 📄 License

[MIT License](LICENSE) &bull; Built for **Build With AI: Basics** on Devpost.
