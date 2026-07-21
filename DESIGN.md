# QuantumShield Brand & Design Specification
*Integrating the Cywayz Brand System with Premium Cyberpunk UX Layouts*

This document defines the unified design system for **QuantumShield (PS 013)**, combining the official **Cywayz brand assets** (leading color and typography choices) with **high-end cybernetic layout references** (leading UI layout, spacing, and micro-interactions).

---

## 1. Brand Color System (Cywayz Led)

The color palette is derived directly from the Cywayz logo and brand visuals, set against a dark-mode space backdrop.

### A. Core Brand Identity
*   **Cywayz Blue:** `#0066cc` (Primary brand color for focus indicators and highlights)
*   **Cywayz Orange:** `#f39c12` (Alert indicator and active highlight accent)
*   **Cywayz Green:** `#2ecc71` (Quantum-Safe verification states and success badges)

### B. Interface Canvas & Backgrounds
*   **Base Canvas (`--bg-primary`):** `#050918` (Ultra-deep space midnight blue)
*   **Surface Containers (`--bg-secondary`):** `#0a0e27` (Deep space navy for sidebars, overlays, and header blocks)
*   **Card Background (`--bg-card`):** `rgba(255, 255, 255, 0.04)` (Semi-transparent backdrop-filtered glass surface)

### C. UI Accents & Glows
*   **Active Neon Purple (`--purple`):** `#7c3aed` (Gradient base for buttons and glowing status accents)
*   **Active Neon Cyan (`--cyan`):** `#06b6d4` (Gradient end for buttons and scan log indicators)
*   **Glow Backdrops:** `rgba(124, 58, 237, 0.25)` (Shadow drop indicators for high-priority cards)

---

## 2. Typography & Hierarchy (Cywayz Led)

We use clean geometric shapes for corporate visibility and structural readability.

*   **Primary Typeface:** `'Inter', system-ui, sans-serif` (Provides high legibility for executive screens and tabular lists)
*   **Technical Typeface:** `'JetBrains Mono', 'Fira Code', monospace` (Used for cryptographic keys, hashes, algorithms, and console logs)

### Font Scale & Spacing
*   **H1 (Page Title):** `1.875rem` | Bold (900) | Letter-spacing: `-0.03em` | Linear text-gradient fill
*   **H2 (Section/Card Title):** `1.5rem` | Semi-Bold (700) | Letter-spacing: `-0.02em`
*   **H3 (Sub-component Labels):** `0.875rem` | Uppercase | Letter-spacing: `0.08em` | Accent color
*   **Body Copy:** `0.875rem` | Regular (400) | Line-height: `1.6` | Color: `#94a3b8`

---

## 3. Layout & Spacing (Reference Led)

The layout uses a modern dashboard system featuring grid-alignments, floating controls, and clean vertical hierarchies.

*   **Subtle Grid Overlay:** A background grid pattern overlay (`1px solid rgba(255, 255, 255, 0.03)`) gives the canvas a technical, precise structure.
*   **Core Spacing scale:**
    *   Content Margins: `2rem 2.5rem`
    *   Item Gaps: `1rem` to `1.5rem` for responsive column spacing
    *   Card Inner Padding: `1.5rem`
*   **Border Radii:**
    *   Glass cards and containers: `16px`
    *   Buttons, Inputs, Selection menus: `10px`
    *   Pills and Badges: `99px` (fully rounded caps)

---

## 4. Component Design Tokens (Reference Led)

### A. High-Contrast Glass Cards
*   **Visual Structure:** Curved `16px` boundaries with a thin `1px solid rgba(255, 255, 255, 0.08)` border.
*   **Interactive State:** A conic gradient hover border rotates dynamically on hover using CSS `@property --angle`.
*   **3D Tilt:** JS calculates the mouse pointer offset relative to the card center, translating it into a subtle `3deg` perspective tilt on mouseover.

### B. Button Systems
*   **Primary Button:** Styled with a solid gradient (`#7c3aed` to `#5b21b6`), rounded corner profiles, and a magnetic translation offset that moves towards the cursor. Includes a subtle white indicator arrow (`→`) to suggest momentum.
*   **Outline Button:** Clear background with a thin `1px` border using `--border-color`. Fades text color on hover.
*   **Floating Action Button (FAB):** Rounded gradient circles (`#0066cc` to `#7c3aed`) with icons (e.g. arrow-up) to support floating quick-actions.

### C. Pill Badges
*   **Problem Statement Pill (`PS 013`):** Semi-transparent dark gray backgrounds, small-caps text, positioned neatly above card headers.
*   **Semantic Risk Badges:** Uses color codes to denote threat level at a glance:
    *   `Critical`: Red border + background (`rgba(239,68,68,0.15)`)
    *   `High`: Orange border + background (`rgba(245,158,11,0.15)`)
    *   `Medium`: Cyan border + background (`rgba(6,182,212,0.15)`)
    *   `Safe`: Green border + background (`rgba(16,185,129,0.15)`)

### D. Overlay Panels & Modals
*   **Backdrop:** Dark overlay `rgba(0,0,0,0.5)` with `backdrop-filter: blur(4px)` to maintain focus.
*   **Close Action:** Floating round dismiss button (`x` icon inside a round dark circle) placed at the top-right corner.
