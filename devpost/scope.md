---
doc: scope
status: approved
---

# Dev Cadence

A browser extension side panel running alongside Devpost that helps participants realistically pace their hackathon workload, visualize free versus committed days, and turn registrations into completed submissions.

## The Unique Kernel
An in-context side panel directly on Devpost that pairs a visual monthly commitment calendar with an active pipeline table. Instead of a generic to-do list, it focuses specifically on capacity planning—revealing whether you actually have the open work dates to finish what you register for before the deadline hits.

## Who It's For
Serial and aspiring Devpost hackathon participants who find themselves registering for multiple exciting events but struggle to complete and submit projects due to poor time visibility and fragmented tools (juggling Google Calendar, Google Sheets, and email reminders).

## The Core Loop
1. The user browses hackathons on Devpost.
2. They open the Dev Cadence side panel on the right without leaving the page.
3. They log an event of interest (or candidate event), setting its deadline, current status, and proposed work date window.
4. The calendar instantly blocks out those work days, displays remaining free days, and updates the active pipeline table.
5. The user checks today's focus and assesses whether their month's capacity is realistic before committing further.

## Inspiration & Identity
- **Form factor:** A clean, unobtrusive Chrome extension side panel docked to the right of Devpost.
- **Mental model:** Grounded in a proven spreadsheet tracking workflow: Title, Deadline, Application Status (e.g., *Considering*, *Not registered*, *Early application*, *Waiting for API key*), and dedicated Work Dates windows (e.g., *01–10*, *13–22*).
- **Tone:** Focused, realistic, motivating, and lightweight.

## Why This Matters to the Learner
"I’ve noticed a huge discrepancy for many participants between the number of hackathons they register for and the number of projects they actually submit. Very few people have a submission count that matches their participation count. It’s a shame, because many great ideas never get presented due to poor management. One of the main reasons is the inability to see the big picture. The solution needs to work in the background. People can be trained, but they need guidance—someone to take them by the hand and show them how to plan directly on the Devpost page."

## What "Working" Looks Like
In a 1-minute demo video:
1. The user has Devpost open with various hackathons.
2. Clicking the extension slides out the Dev Cadence panel from the right.
3. The user clicks "Log Hackathon" and inputs details (name, deadline, work dates, stage like *registration* or *considering*).
4. The calendar instantly populates with the scheduled work dates and deadline marker, and a new row appears in the pipeline table.
5. The panel clearly shows booked days vs. available free days in the month.

## The POC Boundary
- **Chrome extension panel** that opens cleanly alongside Devpost pages.
- **Monthly calendar view** showing committed hackathon blocks and available open days.
- **Log Hackathon modal / quick-entry** to specify Title, Deadline, Work Dates, and Application Status.
- **Pipeline table** displaying tracked hackathons with current stage and key dates.
- **Local persistence** (Chrome local storage / browser storage) so planning survives page reloads with zero backend setup.

## Later
- Automated DOM scraping from the active Devpost tab to pre-fill hackathon title and deadline with one click.
- Algorithmic workload recommendation calculating realistic capacity based on past submission completion rate and rest-day requirements.
- External Google Calendar two-way synchronization.
- Browser notification reminders for approaching work dates and deadlines.

## Explicitly Cut
- **Team collaboration and shared workspaces:** Cut to keep the PoC strictly focused on individual participant capacity planning.
- **Heavy backend authentication / cloud database:** Cut in favor of local storage to ensure the PoC is zero-friction, private, and runs entirely in-browser.
- **Global hackathon discovery feed:** Cut because Devpost already provides the browsing interface on the left side of the screen.
