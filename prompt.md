# Project Prompts Log

This document records the prompt history and specifications used to generate and develop the Singapore Public Transit Interface (`mcp-bus`).

---

## Prompt 1: Initial App Creation & Design System

```markdown
Build me an app with screens that look like this. You can hotlink images from the html
```

### Attached Design Specification:
- **Project Name:** Singapore Public Transit Interface
- **Visual Style & Identity:**
  - High-contrast Singapore public utility signage and modern corporate transit interface.
  - Primary: Deep SBS Transit Purple/Magenta (`#6E1D74`, `#520059`)
  - Secondary Accent: Dynamic Transit Orange (`#D9531E`, `#AB3600`)
  - Canvas: Anti-glare Neutral (`#F7F7FA`)
  - Cards: Crisp White (`#FFFFFF`) with subtle hairline borders (`#E5E5EB`)
- **LTA Datamall Telemetry Crowding Scale:**
  - Seats Available: Green (`#00875A`) on `#E6F4EA`
  - Standing Available: Amber (`#D97706`) on `#FEF3C7`
  - Limited Standing (Full): Red (`#DC2626`) on `#FEE2E2`
  - Wheelchair Accessible Bus (WAB): Accessibility Blue (`#0065FF`)
- **Typography:**
  - Headings & Display: `Plus Jakarta Sans`
  - Transit Numbers, 5-digit Stop Codes & Countdown ETAs: `Space Grotesk` (tabular figures)
  - Body & Metadata: `Work Sans`
- **Core Components & Screens:**
  - Live arrival countdown timers (1st, 2nd, and 3rd bus timings side-by-side with pulsing `"Arr"`)
  - Bus fleet indicators: Double Decker (`DD`), Single Decker (`SD`), Bendy (`BD`)
  - Interactive route progression inspector modal with live fleet positions
  - Integrated Transport Hub berth directory (Jurong East, Tampines, Bishan, Woodlands)
  - Singapore multimodal schematic transit map (EWL, NSL, NEL, DTL, CCL)
  - LTA distance-based fare calculator with SimplyGo card type rates (Adult, Student, Senior)
  - Live LTA disruption & weather advisory notifications banner
  - Dual responsive modes: Smartphone Commuter Frame (390px thumb zone) & Full Desktop Dashboard

---

## Prompt 2: GitHub Repository Setup & Push

```bash
git push https://<GITHUB_PERSONAL_ACCESS_TOKEN>@github.com/hongsiew85-dot/mcp-bus.git
```

- Initialized git repository on branch `main`
- Added remote `origin` pointing to `https://github.com/hongsiew85-dot/mcp-bus.git`
- Committed and pushed initial application build

---

## Prompt 3: Backend API Architecture & LTA Datamall Integration

```text
1) create a /api folder under the project main to store all the apis
2) create a /api/health.js to monitor if the apis are working
3) integrate the LTA bus information endpoint GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
Header:  AccountKey: 

# BusStopCode is the only required parameter.
# Add &ServiceNo=7 to ask about one service only.
# Refreshes every 20 seconds. JSON comes back by default.
i will add the LTA_ACCOUNT_KEY in vercel environment variables later
```

- Created `/api` directory compatible with Vercel Serverless Functions and local Vite development
- Implemented `/api/health.js` for uptime and LTA API key detection
- Implemented `/api/bus-arrival.js` to securely proxy LTA Datamall v3 `BusArrival` with server-side `AccountKey` injection and 20-second cache policy
- Added fallback simulation mode for previewing before setting the key in Vercel
- Added frontend API diagnostic modal and added stop `04121` (People's Park Ctr) to catalog
- Updated `.env.example` with `LTA_ACCOUNT_KEY`

---

## Prompt 4: Prompt Log Archival

```text
create a prompt.md containing all my prompts located at project main
```

- Generated `prompt.md` documenting all prompt sequences, requirements, and implemented architectural features.
