# Privacy Policy — Dev Cadence

**Last Updated:** November 19, 2026  
**Developer:** Veronika Kashtanova ([GitHub Repository](https://github.com/vero-code))

## 1. Local-First Architecture
Dev Cadence is built on a local-first philosophy. We do not collect, sell, or track personal identity, browsing history, or analytics telemetry. There are no remote user databases or advertising trackers.

## 2. Local Storage & Permissions
All sprints, dates, statuses, themes, and capacity preferences are stored locally on your device using `chrome.storage.local` (or browser `localStorage` in web mode).

- `sidePanel` & `storage`: Render the planner UI and persist your data locally.
- `activeTab`, `scripting`, and host permissions (`<all_urls>`): Used strictly on demand when you explicitly click **"Extract from Page"** to read the active tab's URL, title, and selected or visible text. The extension never reads pages in the background or tracks browsing history.

## 3. Hybrid AI Processing & Contact Form
- **Hybrid AI:** When you explicitly trigger AI features (*Extract from Page* or *AI Pace Advisor*), prompts run locally on your device via Chrome's built-in **Gemini Nano** model whenever available. Only when on-device inference is unavailable does the request fall back to **Firebase AI Logic (Gemini)** secured by **Firebase App Check**.
- **Contact Form:** If you voluntarily submit the Contact form inside the extension, the message you enter is sent to the developer via a Discord webhook solely to handle your feedback or support request.

## 4. Data Ownership & Deletion
You can export, import, clear sprints, or perform a full Factory Reset at any time via **Settings -> Data Management**. Uninstalling the extension also removes all local extension storage.

## 5. Open Source Transparency
Dev Cadence is open source under the Apache License 2.0. The full source code is publicly auditable at https://github.com/vero-code/dev-cadence.