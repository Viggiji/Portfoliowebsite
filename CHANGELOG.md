# Portfolio Website — Change Log & Context Documentation

> **Purpose:** This file tracks every version, decision, and change made to the portfolio website across conversations so that context is never lost.

---

## 🏗️ Project Overview

| Key | Value |
|---|---|
| **Owner** | Vighnesh Garg (`@Viggiji`) |
| **Stack** | React 18 + Vite 5 + Framer Motion 11 |
| **Design System** | "The Kinetic Architect" (from Stitch) — Brutalist, IDE-inspired, dark terminal aesthetic |
| **Stitch Project ID** | `9345815580396066032` |
| **Fonts** | Space Grotesk (headlines), Inter (body), Fira Code (mono/labels) |
| **Color Palette** | Primary `#8ff5ff` (Cyber Blue), Secondary `#2ff801` (Neon Green), Tertiary `#65afff`, BG `#0e0e0e` |
| **Location (data)** | Mathura, UP — India |
| **College** | SRMIST KTR (Kattankulathur, Tamil Nadu) |
| **Coordinates** | LAT 12.8237 / LONG 80.0444 (SRMIST KTR) |

---

## 📁 Current File Structure (as of v0.3)

```
Portfoliowebsite/
├── index.html                  # Vite entry
├── old_index.html              # Original static HTML (archived)
├── package.json                # React 18, Framer Motion, Lucide, Vite
├── vite.config.js
├── tailwind.config.js          # TailwindCSS present but barely used
├── postcss.config.js
├── profpic.jpg                 # Profile picture (19KB)
├── public/
├── dist/                       # Build output
├── src/
│   ├── main.jsx                # React entry
│   ├── App.jsx                 # Main app – all sections
│   ├── index.css               # Global styles & CSS vars
│   ├── data.js                 # All personal data (PERSON, SOCIALS, SKILLS, etc.)
│   └── components/
│       ├── Preloader.jsx       # Terminal boot-sequence preloader
│       ├── AudioPlayer.jsx     # YouTube BGM (Playing God – Polyphia)
│       ├── GitHubProjects.jsx  # Live GitHub API project cards
│       ├── RepoDetail.jsx      # Modal for GitHub repo details
│       ├── ProjectDetail.jsx   # Modal for curated project details (unused atm)
│       └── SkillsSection.jsx   # 4-panel skill tags grid
```

---

## 📦 Current Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "framer-motion": "^11.0.8",
  "lucide-react": "^0.359.0"
}
```

---

## 🗂️ Conversation History

### Conversation 1 — Cloning Repo (2026-04-06)
- Cloned `https://github.com/Viggiji/Portfoliowebsite`

### Conversation 2 — Modernizing with React (2026-04-06)
- Converted static HTML → React + Vite
- Created component structure
- Added Framer Motion animations

### Conversation 3 — Integrating Stitch (2026-04-09–10)
- Connected to Stitch MCP, pulled "React Portfolio Site" design
- Created `Preloader.jsx` with cinematic 7-8s boot sequence + click-to-enter
- Created `AudioPlayer.jsx` (YouTube hidden iframe, Playing God – Polyphia)
- Applied Stitch design tokens to CSS variables
- Fixed blank screen rendering issue (deferred main content mount)
- Created all 6 components in current structure

---

## 🎨 Stitch Design System: "The Kinetic Architect"

### Key Design Principles
1. **Intentional Asymmetry** — "heavy-left" layout like a code editor
2. **Tonal Depth** — depth via surface color layering, not shadows
3. **No-Line Rule** — no 1px borders for sections; use BG shifts + negative space
4. **Code Comments as Labels** — e.g. `// 01. Portfolio`
5. **Ambient Glows** — box-shadow with primary color at 10% opacity, 40px blur
6. **Ghost Border** — 1px border at 15% opacity `outline-variant` token
7. **Glassmorphism** — `backdrop-filter: blur(12px)` on floating cards

### Surface Hierarchy
| Layer | Token | Color |
|---|---|---|
| The Void (Base) | `surface` | `#0e0e0e` |
| The Canvas (Sections) | `surface-container-low` | `#131313` |
| The Module (Cards) | `surface-container-high` | `#20201f` @ 60% opacity + 20px blur |
| The Interaction | `surface-bright` | `#2c2c2c` |

### Screens in Stitch
1. **Developer Portfolio - Main Landing** (`8081b54b256c431db95164702c1ad9fe`) — 2560×5540
2. **System Boot - Pre-loader** (`93f0b3eb24b44f48ba5fca750b609ca7`) — 2560×2048
3. **Project Detail - Tech Showcase** (`d5633178225e42a192c4b2af093dfe33`) — 2560×3506

---

## 📝 Current Section Layout in App.jsx

1. **Preloader** — Terminal boot with progress bar, click to enter
2. **Nav** — Fixed top bar with nav links
3. **// 01. About** — Name (h1), bio, CTA buttons, profile photo, principles panel, education panel
4. **// 02. Skills** — 4 glass panels (Tech Stack, Currently Learning, Soft Skills, Hobbies)
5. **// 03. Projects** — Live GitHub API grid, click for modal detail
6. **// 04. Contact** — Email CTA + social links panel
7. **Footer** — Location + status

---

## 🔧 Known Issues (as of v0.3) — ALL RESOLVED IN v1.0
- ~~About section in Stitch had a "code block" style~~ → **FIXED**: Bio now displayed in terminal code-block with ScrambledText
- ~~Profile photo card is too small~~ → **FIXED**: Enlarged to 240×240px with glass shimmer overlay
- ~~Coordinates hardcoded to NYC~~ → **FIXED**: Updated to SRMIST KTR LAT_12.8237 / LONG_80.0444
- ~~Preloader dates all show static "01.03.2024"~~ → **FIXED**: Random date generation each load
- ~~Preloader boot messages are too generic~~ → **FIXED**: Tacky messages (Chai, WiFi, Anime Backlog, Guitar Strings, Football Reflexes)
- ~~No proper volume control~~ → **FIXED**: Counter-based volume (slot-machine style) in slide-out panel
- ~~Social links are basic list~~ → **FIXED**: BounceCards with generated gradient card images
- ~~Skills section is static tags~~ → **FIXED**: Carousel-based sliding skill categories
- ~~Principles & Academics in About~~ → **FIXED**: Moved to new §05 Chronicle section
- ~~Projects use only live GitHub API~~ → **FIXED**: CardSwap + side info panel

---

## ✅ v1.0 — React Bits Integration (2026-04-10)

### New Dependencies Added
```json
{
  "gsap": "latest",
  "ogl": "latest",
  "three": "latest",
  "@react-three/fiber": "^8",
  "@react-three/drei": "^9",
  "maath": "latest"
}
```

### New Components Created (`src/components/reactbits/`)
| Component | Source | Purpose |
|---|---|---|
| `CountUp.jsx` | React Bits | Animated count-up number in preloader |
| `GradientText.jsx` + CSS | React Bits | Animated gradient text for loading % |
| `DecryptedText.jsx` | React Bits | Decrypt-on-scroll text for all section headings |
| `FuzzyText.jsx` | React Bits | Canvas-based glitch text for name display |
| `ScrambledText.jsx` | React Bits | Character-by-character reveal for bio |
| `Dock.jsx` + CSS | React Bits | macOS-style magnifying dock navigation |
| `Counter.jsx` + CSS | React Bits | Slot-machine animated volume control |
| `BounceCards.jsx` + CSS | React Bits | Interactive social link cards |
| `CardSwap.jsx` + CSS | React Bits (GSAP) | Stacking card animation for projects |
| `Carousel.jsx` + CSS | Custom (Framer) | Sliding carousel for skill categories |
| `FaultyTerminal.jsx` + CSS | React Bits (OGL/WebGL) | Matrix-style background shader |

### Changes to Existing Files

#### `data.js`
- Added `PERSON.college` and `PERSON.coordinates`
- Added `cardImage` property to each social link
- Added `NAV_ITEMS[4]` — Chronicle section
- Added `PLAYLIST` array with 2 songs (Polyphia + Marcin)

#### `Preloader.jsx`
- Replaced static % rendering with `CountUp` + `GradientText`
- Updated boot messages to tacky/personal ones
- Randomized dates with `randomDate()` generator
- Updated coordinates to SRMIST KTR

#### `AudioPlayer.jsx`
- Complete rewrite with slide-out panel (left side)
- `Counter` component for volume display
- Playlist support with next track button (loops)
- Both tracks: Playing God (Polyphia) + Bite Your Nails (Marcin)

#### `SkillsSection.jsx`
- Wrapped skill panels in `Carousel` component
- Each category is its own slide with auto-play

#### `GitHubProjects.jsx`
- Replaced grid with `CardSwap` (left) + info panel (right)
- Removed `RepoDetail` modal dependency
- `onFrontChange` callback updates info panel

#### `App.jsx` (Major Rewrite)
- Removed old top nav bar
- Added `Dock` navigation at bottom center
- `FuzzyText` for name display (canvas-based glitch effect)
- `ScrambledText` bio inside terminal code-block panel
- `DecryptedText` on all section headings (§01–§05 tags + H2s)
- Profile photo enlarged (240px) with glass shimmer overlay + college label
- `FaultyTerminal` WebGL background on Projects section (green tint)
- `FaultyTerminal` WebGL background on Contact section (cyan tint)
- `BounceCards` for social links (with gradient card images)
- New §05 Chronicle section (Principles + Academics moved here)
- Footer has bottom margin for Dock clearance
- Removed `RepoDetail` import and modal

#### `index.css`
- Added `@keyframes glassShimmer` for photo overlay
- Added `.bio-scramble` styling
- Added responsive breakpoint for mobile

### Generated Assets (`public/`)
- `social_github.png` — Abstract gradient card with GitHub logo
- `social_linkedin.png` — Abstract gradient card with LinkedIn logo
- `social_leetcode.png` — Abstract gradient card with LeetCode logo
- `social_email.png` — Abstract gradient card with email icon

---

## 📁 Updated File Structure (v1.0)

```
Portfoliowebsite/
├── CHANGELOG.md                    # This file
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── profpic.jpg
│   ├── social_github.png          # [NEW] Generated
│   ├── social_linkedin.png        # [NEW] Generated
│   ├── social_leetcode.png        # [NEW] Generated
│   └── social_email.png           # [NEW] Generated
├── src/
│   ├── main.jsx
│   ├── App.jsx                    # [REWRITTEN] Full React Bits integration
│   ├── index.css                  # [MODIFIED] New animations + responsive
│   ├── data.js                    # [MODIFIED] Playlist, coordinates, cards
│   └── components/
│       ├── Preloader.jsx          # [REWRITTEN] CountUp + GradientText
│       ├── AudioPlayer.jsx        # [REWRITTEN] Slide-out + Counter + Playlist
│       ├── GitHubProjects.jsx     # [REWRITTEN] CardSwap + Info Panel
│       ├── SkillsSection.jsx      # [REWRITTEN] Carousel-based
│       ├── RepoDetail.jsx         # [UNUSED] No longer imported
│       ├── ProjectDetail.jsx      # [UNUSED]
│       └── reactbits/             # [NEW] All React Bits components
│           ├── CountUp.jsx
│           ├── GradientText.jsx + .css
│           ├── DecryptedText.jsx
│           ├── FuzzyText.jsx
│           ├── ScrambledText.jsx
│           ├── Dock.jsx + .css
│           ├── Counter.jsx + .css
│           ├── BounceCards.jsx + .css
│           ├── CardSwap.jsx + .css
│           ├── Carousel.jsx + .css
│           └── FaultyTerminal.jsx + .css
```

---

## 📝 Updated Section Layout (v1.0)

1. **Preloader** — Terminal boot w/ CountUp+GradientText %, random dates, tacky logs, click-to-enter
2. **§01. About** — FuzzyText name, code-block bio (ScrambledText), glass photo, CTA buttons, location
3. **§02. Skills** — Carousel slides of skill categories (Tech, Learning, Soft, Hobbies)
4. **§03. Projects** — FaultyTerminal BG, CardSwap left + info panel right (GitHub API)
5. **§04. Signal (Contact)** — FaultyTerminal BG, CTA email + BounceCards social links
6. **§05. Chronicle** — Principles panel + Academics panel
7. **Footer** — Copyright + location
8. **Dock** — Fixed bottom center macOS-style navigation (all 5 sections)
9. **AudioPlayer** — Fixed bottom left, slide-out panel, Counter volume, 2-track playlist

---

## ✅ v1.1 — UI Fixes & Polish (2026-04-10)

### Changes Made

#### `Preloader.jsx`
- Logo text changed from `THE_KINETIC_ARCHITECT` → `VIGHNESH_GARG`

#### `App.jsx`
- **FluidGlassPhoto**: Replaced static photo with Three.js glass distortion component (mouse-following iridescent lens shader)
- **Photo size**: Increased from 240px → 340px, grid column 320px → 380px
- **Removed SRMIST KTR label** from beneath profile photo
- **Signal section**: Wrapped heading text with `DecryptedText` (hover scramble on "collaborations") and body paragraph with `ScrambledText`
- **Projects section**: Added `marginTop: 24` to push CardSwap area lower

#### `SkillsSection.jsx`
- Complete redesign: now shows **4 separate carousels** (one per skill category)
- Each carousel is a React Bits-style draggable horizontal track with bordered container + rounded items
- Each skill is its own carousel card with colored accent bar

#### `Carousel.jsx` + `Carousel.css`
- Replaced custom flat carousel with proper React Bits-style draggable horizontal carousel
- Proper grabbed/grabbing cursor states
- Bordered container with rounded inner items
- Dark theme adapted: ghost borders, terminal styling

#### `FluidGlassPhoto.jsx` [NEW]
- Three.js canvas-based glass distortion overlay
- Fragment shader creates iridescent ripple effect (primary cyan, secondary green, tertiary blue)
- Glass lens follows mouse pointer for interactive feel
- Circular crop with glow border, wrapped in 50% border-radius

#### `data.js`
- Added B.Tech CSE with SWE at SRMIST KTR, 9.24 CGPA (till 3rd Sem) to EDUCATION array

---

## ✅ v1.2 — Scramble Polish, Deployment Prep & Security (2026-04-11)

### Changes Made

#### `ScrambledText.jsx` — Complete Rewrite
- **3 rendering modes** via `per` prop:
  - `per="word"` — each word scrambles individually on hover
  - `per="line"` — each sentence (split by `.`) scrambles individually on hover
  - Default — whole block scrambles on hover
- IntersectionObserver for initial reveal animation
- Exported named components: `ScrambleWord`, `PerWordScramble`, `PerLineScramble`

#### `App.jsx`
- **Bio section**: Uses `per="line"` — each sentence on its own numbered line, only the hovered line scrambles
- **Signal section**: Uses `per="word"` with themed colors:
  - "open" → `var(--secondary)` (green)
  - "collaborations" → `var(--primary)` (cyan, italic, glow)
  - "interesting projects." → `var(--tertiary)` (blue)
  - Description paragraph → monospace `per="word"` scramble

#### `data.js`
- Replaced placeholder `vighneshgarg@example.com` → `YOUR_EMAIL_HERE` with ⚠️ TODO markers

#### `.gitignore` [NEW]
- Excludes: `node_modules/`, `dist/`, `.env*`, IDE files, OS files, `.gemini/`
