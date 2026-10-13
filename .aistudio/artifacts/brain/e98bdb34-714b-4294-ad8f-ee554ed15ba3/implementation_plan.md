# Implementation Plan: Eliminate Text Flickering & Mobile Layout Overhaul

Fix all text flickering/jitter across the application and execute a complete mobile-first responsive overhaul so Rayhan Gazi's portfolio renders smoothly, crisply, and without layout flaws on any mobile screen.

---

## 1. Root Cause Analysis

### A. Text Flickering Causes
1. **Double Transition & Animation Conflicts**:
   - `App.tsx` wraps `<main>` in `animate-in fade-in duration-300`.
   - Simultaneously, `CoolPageTransition.tsx` mounts a full-screen overlay during navigation with `animate-in fade-in`, causing double-render opacity transitions where text visibly flashes and snaps between alpha levels.
2. **Subpixel Font Shifting on Transform/Hover**:
   - Project cards, buttons, and KPI boxes apply CSS hover transforms (`hover:-translate-y-1`, `group-hover:scale-105`) without 3D acceleration or backface-visibility containment. In Chromium and WebKit, this causes typography to alternate between subpixel antialiasing and grayscale rendering, producing a jarring visual "shake" or flicker.
   - Text elements lacking `transform-gpu` or `backface-visibility: hidden` trigger layout recalculations and repaint flashes during scroll and mouse movement.
3. **Live Telemetry & Ping Redraw Cycles**:
   - In `AdminPageView.tsx`, pulsing and pinging badges (`animate-ping`, `animate-pulse`) trigger repaints on adjacent typography containers without layer isolation (`isolate transform-gpu`).

### B. Mobile Layout Breakpoints & Pain Points
1. **Navigation Bar & Mobile Drawer**:
   - On small screens (< 380px), title badges and action controls crowd together; mobile menu dropdown needs clean touch padding (≥ 44px targets) and backdrop blur without scroll locks or clipping.
2. **Hero Section on Mobile**:
   - Headline sizing (`text-4xl sm:text-5xl md:text-6xl`) can cause awkward wrapping on 360px–390px screens.
   - Action buttons need mobile-friendly full-width or auto-flex stacking.
   - 4-column KPI strip below the hero needs 2x2 grid math with safe padding so metric labels don't clip.
3. **Gallery, Category Filters & Subcategories**:
   - Category selector tabs wrap into jagged multi-line blocks on phones unless formatted as a smooth horizontal scrolling pill rail (`overflow-x-auto no-scrollbar`).
   - Share buttons, search inputs, and subcategory chips need touch-first single-column stacking on mobile.
4. **Project Cards**:
   - Project cards on mobile must be optimized for single-column presentation (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).
   - Video thumbnail containers (16:9 and vertical 9:16) need explicit aspect ratio preservation and touch-safe interaction states without sticky hover effects on touch devices (`@media (hover: hover)`).
5. **Video Playback Modal**:
   - On mobile phones, modal padding and fixed height can clip the close button or bottom controls; requires safe-area padding (`pb-safe`) and fluid responsive scaling.
6. **Admin Hub on Mobile**:
   - Tab buttons and date-range controls require horizontal swipe rails.
   - Daily chart needs responsive column scaling or horizontal scroll containment so bars don't collapse.
   - Event activity feed cards need mobile card-wrap layouts instead of table-like horizontal overflow.

---

## 2. Proposed Changes

### Phase 1: CSS & Font Rendering Stabilization (Anti-Flicker)
- **`src/index.css`**:
  - Add global `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;` to `:root` and `body`.
  - Add universal utility `.gpu-stabilize`: `transform: translateZ(0); backface-visibility: hidden; perspective: 1000px; will-change: transform;` to lock typography during hover transforms.
  - Fix keyframe opacity ranges in `fadeInSmooth` and `cyanPulse` to prevent 0-to-1 alpha flashing.
  - Disable sticky desktop hover transforms on touch devices with `@media (hover: none)`.

### Phase 2: Page Transitions & Component Anti-Flicker Fixes
- **`src/components/CoolPageTransition.tsx` & `src/App.tsx`**:
  - Remove duplicate fade-in animations on `<main>` so only one coordinated transition executes.
  - Ensure `CoolPageTransition` uses fixed layer isolation with `will-change: opacity` and `pointer-events-none` so underlying text never flashes during mounting/unmounting.
- **`src/components/Hero.tsx`**:
  - Apply `transform-gpu backface-hidden` to headline, kicker, and director credentials.
  - Stabilize pulsing live dot using isolated pseudo-elements to avoid layout repaints.
- **`src/components/Gallery.tsx`**:
  - Add `transform-gpu backface-hidden` to `ProjectCard` title, client name, and duration badges.
  - Scope card hover transforms so text stays rock-solid during mouseenter and mouseleave.
- **`src/components/pages/AdminPageView.tsx`**:
  - Isolate live indicators (`animate-ping`) into independent composite layers (`isolate transform-gpu`) so ticker updates do not flicker table text or chart headers.

### Phase 3: Mobile Layout Overhaul
- **`src/components/Navbar.tsx`**:
  - Redesign mobile navigation bar: brand title truncation safeguard, compact live badge, and high-contrast hamburger toggle (≥ 44px touch target).
  - Enhance mobile drawer menu with smooth glassmorphism, responsive item spacing, and touch-friendly direct page links.
- **`src/components/Hero.tsx`**:
  - Make typography fluid: `text-3xl xs:text-4xl sm:text-5xl lg:text-6xl` with tightened tracking.
  - Ensure CTA buttons stack gracefully (`flex-col sm:flex-row w-full sm:w-auto`).
  - Format KPI metric cards for mobile: compact 2-column grid (`grid-cols-2 lg:grid-cols-4`) with clear padding and no text overlap.
- **`src/components/Gallery.tsx`**:
  - Category selector: add mobile horizontal swipe rail (`flex overflow-x-auto no-scrollbar gap-2 pb-2`) with active glowing cyan states.
  - Subcategory chips and search filter: stack search bar and category share buttons cleanly on screens < 640px.
  - Project cards grid: responsive 1-column on mobile (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`), mobile-optimized badge sizing and title typography.
- **`src/components/VideoModal.tsx`**:
  - Mobile full-width responsive dialog with top safe-area close button (`top-3 right-3 p-2.5 touch-target`).
  - Fluid video aspect ratio wrapper (`aspect-video` / vertical `aspect-[9/16]`) fitting within mobile viewport without clipping.
- **`src/components/pages/AdminPageView.tsx`**:
  - Admin tabs and date selector: responsive horizontal scrolling rail.
  - Daily traffic chart: minimum width with responsive scroll container so daily bars remain legible on small screens.
  - Telemetry breakdown cards: single-column stack on mobile with full-width progress bars.
  - Real-time activity stream: mobile card layout showing event type, title, location, and timestamp without clipping.
- **`src/components/pages/ShowreelView.tsx`, `ReviewsView.tsx`, `ContactView.tsx`**:
  - Mobile audit for container padding (`px-4 sm:px-6 lg:px-8`), form field touch targets, and responsive typography.

---

## 3. Verification & Testing Plan

1. **Anti-Flicker Verification**:
   - Navigate between Home, Projects, Showreel, Reviews, Contact, and Admin repeatedly — verify zero text flashing or opacity stutter during transitions.
   - Hover and scroll vigorously over project cards and metric cards — verify typography remains razor-sharp with no subpixel jump or blur shifts.
   - Observe Admin traffic stream and chart — verify ping indicators and counter updates do not cause adjacent text jitter.
2. **Mobile Viewport Testing**:
   - Test responsive widths: 360px (compact Android), 390px (iPhone 12/13/14), 414px (iPhone Plus/Max), 768px (iPad/tablet).
   - Verify:
     - Navbar hamburger opens cleanly, links navigate without overlap.
     - Hero CTA buttons and KPI cards fit comfortably without horizontal scrollbar on body.
     - Gallery category tabs can be scrolled horizontally with finger swipe.
     - Project cards display thumbnail, title, client, and tools cleanly on mobile screens.
     - Video modal opens cleanly with fully visible video player and easily tappable close button.
     - Admin panel charts and tables adapt to mobile screens without breaking viewport.
3. **Build & Lint Verification**:
   - Run `npm run lint` (`tsc --noEmit`) to ensure 0 TypeScript errors.
   - Run `npm run build` (`vite build`) to verify clean production compilation.
