# Rayhan Gazi — Video Editor & Post-Production Portfolio

A minimalist, high-impact video editing portfolio for Rayhan Gazi, engineered to showcase commercial, creator, music video, and vertical short-form projects. The platform features an interactive Bento media gallery with cinematic hover states, a multi-source fast video player (YouTube, Google Drive, direct MP4/WebM), authentic client testimonials with performance metrics, an inquiry contact system, and a PIN-secured Content Management System (CMS) for instant portfolio updates.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and design decisions are tailored to your confirmed preferences and video editing industry standards:

- **Confirmed Categories**: Filterable project catalog featuring **Commercials**, **YouTube**, **Music Videos**, and **Short-Form** (9:16 vertical reels/TikToks).
- **Aesthetic Direction**: Cinematic obsidian minimalism (`#090A0F` deep dark canvas, hairline borders `#1F2430`, muted slate typography, and warm amber/gold focal highlights `#E5A93C`).
- **Video Source Flexibility**: Unified video modal supporting:
  1. **YouTube** (automatic ID extraction, privacy-enhanced embeds, auto-generated HQ thumbnails)
  2. **Google Drive** (preview & direct streaming link conversion)
  3. **Direct Video URLs / Cloud-hosted MP4/WebM** with native custom HTML5 playback controls
- **Content Management System (CMS)**: Built-in Admin Dashboard secured by a custom PIN (`default: 1234`, customizable), allowing real-time project creation, edits, deletion, category assignment, video URL testing, testimonial updates, and JSON backup export/import.
- **Client Inquiry Flow**: Dedicated contact form with project type selector, timeline, budget range, and immediate submission response.

---

## 1. Overview & Core Concept

- **What It Does**: Provides video creators, directors, brands, and marketing agencies with a rapid, lag-free showroom of Rayhan Gazi’s video editing work. Prospective clients can filter by format (commercials, YouTube edits, music videos, 9:16 vertical reels), watch high-definition videos instantly without navigating away, review verified client testimonials, and book projects through a streamlined inquiry form.
- **Target Audience**: YouTubers, commercial creative directors, brand marketers, music producers, and agencies seeking high-retention video editors and colorists.
- **Key Value**: Replaces clumsy link trees or laggy video drives with an editorial, high-prestige digital showroom that proves editing mastery, retention metrics, and client reliability.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **First Impression & Hero Showreel**: Visitors land on an architectural split-screen hero: Rayhan Gazi's positioning statement on the left with stats ("180M+ Total Views", "450+ Videos Delivered", "48h Fast Turnaround"), and a featured cinematic showreel preview on the right with a 1-click "Play Showreel" modal trigger.
2. **Interactive Portfolio Gallery**:
   - Clean category switcher: *All Projects*, *Commercials*, *YouTube*, *Music Videos*, *Short-Form*.
   - Bento-style layout featuring dynamic cards: 16:9 widescreen cards for commercials/YouTube alongside vertical 9:16 cards for TikTok/Reels.
   - Hover micro-interactions: Smooth image zoom, metadata reveal (runtime, pacing style, tools used like Premiere Pro/After Effects/DaVinci Resolve), and an animated play indicator.
3. **Universal Video Player Lightbox**:
   - Clicking any project opens a sleek cinema modal with backdrop blur.
   - Handles aspect ratio automatically: 16:9 landscape vs. 9:16 vertical reel viewport.
   - Shows project context: client/channel, Rayhan’s role (Offline Editor, Colorist, Motion Graphics), and retention highlights.
4. **Client Social Proof & Testimonials**:
   - Curated cards highlighting quantifiable outcomes (e.g. "+34% Average Retention Rate", "2.4M organic YouTube views", "Delivered 12 episodes under tight deadlines").
   - Includes client avatars, company/channel handles, and verified project links.
5. **Direct Client Inquiry & Contact Form**:
   - Input fields: Name, Email, Project Category, Estimated Budget, Timeline, and Project Link / Details.
   - Live client-side validation with instant visual confirmation and mailto backup.
6. **Built-in Admin CMS (PIN-Secured)**:
   - Discreet "Admin CMS" access in footer or header action.
   - PIN-protected authentication modal.
   - Complete project manager: Add new project, edit existing projects, upload/paste custom thumbnail URLs, test video URLs with live preview, update client testimonials, and export/import portfolio data in JSON format for permanent backups.

### Visual Identity & Theme Tokens

- **Palette**:
  - Neutral Canvas (60%): `#090A0F` (Deep Obsidian Cinema Black) and `#0F121C` (Subtle Structural Surface).
  - Structural Hairlines & Dividers (30%): `rgba(255, 255, 255, 0.08)` and `#1F2432`.
  - Focal Accents (10%): Warm Amber / Film Gold (`#F59E0B` / `#E5A93C`) and Electric Cyan Glow (`#38BDF8`) for playback scrubber and active states.
  - Text Hierarchy: High-contrast pure white `#F8FAFC` for headlines, muted slate `#94A3B8` for body copy, and `#64748B` for metadata.
- **Typography**:
  - Display & Headings: `Plus Jakarta Sans` / `Outfit` (Bold architectural geometry with tight tracking).
  - Body & Form Controls: `Plus Jakarta Sans` / `DM Sans` (Clean, highly legible line height `1.6`).
  - Numbers & Metrics: Tabular figures (`tabular-nums font-mono`) for runtime, views, and turnaround stats.
- **Layout Restraint**:
  - Zero-pill metadata rule: Category and runtime tags displayed as quiet inline typography with dot separators (`Commercial · 0:45 · Color Grade`), never rounded static pill enclosures.
  - No fake AI jargon, no arbitrary telemetry bars, and no broken external images.

---

## 3. Key Product Decisions & Trade-Offs

- **Multi-Source Video Engine**:
  - *Chosen Approach*: Unified video player adapter that detects YouTube URLs (extracting IDs and embedding with privacy mode), Google Drive links (transforming `/view` or `/open` URLs into clean `/preview` embeds), and direct media URLs (rendering native HTML5 video with controls).
  - *Why*: Video editors keep footage across YouTube, Drive client folders, and direct MP4 clips. The portfolio must play all three without breaking.
- **Built-in LocalStorage CMS with Import/Export Backup**:
  - *Chosen Approach*: Reactive local persistence initialized with high-quality default projects, fully editable via a PIN-locked modal, paired with 1-click JSON backup export and import.
  - *Why*: Instant, zero-friction client updates without waiting for external database provisioning or ongoing hosting bills, while guaranteeing total portability and safe restore.
- **Aspect Ratio Awareness for Short-Form Content**:
  - *Chosen Approach*: Dynamic lightbox modal dimensions adapting between landscape 16:9 and vertical 9:16 based on the project type.
  - *Why*: Short-form (Reels/TikTok/Shorts) look awkward when letterboxed into landscape players. A dedicated phone-frame modal delivers the authentic mobile viewing experience.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        RAYHAN GAZI PORTFOLIO                           │
│                                                                        │
│  ┌──────────────────────┐  ┌────────────────────────────────────────┐  │
│  │   Top Bar Contract   │  │ Brand: "RAYHAN GAZI" — Video Editor    │  │
│  │    (1-Line, 3-Zone)  │  │ Nav: Works · Showreel · Proof · Contact │  │
│  │                      │  │ Action: "Get in Touch" / "Admin CMS"    │  │
│  └──────────────────────┘  └────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Hero Split Section: Typography + Stats + Featured Showreel Reel  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Bento Works Gallery: Category Filter Buttons                     │  │
│  │ (Commercials · YouTube · Music Videos · Short-Form)              │  │
│  │ ┌────────────────────────┐  ┌──────────────────────────────────┐ │  │
│  │ │ 16:9 Wide Showcase     │  │ 9:16 Vertical Reel Cards         │ │  │
│  │ │ Hover Zoom + Play Icon │  │ Dynamic Aspect Ratio Cards       │ │  │
│  │ └────────────────────────┘  └──────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────┐  ┌────────────────────────────────────────┐  │
│  │ Client Testimonials  │  │ Client Quotes + Metrics + Channel Badges│  │
│  └──────────────────────┘  └────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────┐  ┌────────────────────────────────────────┐  │
│  │ Direct Contact Form  │  │ Name · Email · Budget · Scope · Submit │  │
│  └──────────────────────┘  └────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Universal Modal Layer: Video Player Lightbox / PIN Admin CMS     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Entities

- **`Project`**:
  - `id`: string
  - `title`: string
  - `client`: string
  - `category`: `'commercial'` | `'youtube'` | `'music_video'` | `'short_form'`
  - `aspectRatio`: `'16:9'` | `'9:16'`
  - `videoSource`: `'youtube'` | `'gdrive'` | `'direct'`
  - `videoUrl`: string
  - `thumbnailUrl`: string
  - `duration`: string (e.g. `'1:15'`)
  - `tools`: string[] (e.g. `['Premiere Pro', 'DaVinci Resolve', 'After Effects']`)
  - `metrics`: string (e.g. `'4.2M Views · +42% Retention'`)
  - `description`: string
  - `featured`: boolean
- **`Testimonial`**:
  - `id`: string
  - `clientName`: string
  - `clientRole`: string
  - `companyOrChannel`: string
  - `avatarUrl`: string
  - `metricHighlight`: string
  - `quote`: string
- **`CMSState`**:
  - Authenticated session with PIN verification.
  - Active editing state with full CRUD operations.
  - One-click JSON data export and import for seamless multi-device updates.
