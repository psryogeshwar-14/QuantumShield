# QuantumShield Developer Guide (CLAUDE.md)
*Build Instructions, Commands, and Architectural Guidelines*

---

## 1. System Commands & Diagnostics

This project is a static front-end web application requiring no compilation step.

### Local Development / Running
*   **Launch Page (macOS Chrome):**
    ```bash
    open -a "Google Chrome" "index.html"
    ```
*   **Launch Page (macOS Safari):**
    ```bash
    open -a "Safari" "index.html"
    ```

---

## 2. Project Architecture & File Structure

```
├── index.html              # Main HTML5 SPA structure and CDN loads
├── sitemap.xml             # Search engine sitemap for logical section indexing
├── idea_ppt_template.html  # Responsive HTML 16:9 solution presentation slides
├── attestation_template.html # Formal Declaration of Originality print layout
├── CONTEXT.md              # Technical facts (Shor's, Grover's, NIST FIPS standards)
├── COPY.md                 # Text copy, titles, descriptions, and page-level SEO plan
├── DESIGN.md               # Visual token manifest (Cywayz Brand colors, spacing, CSS beziers)
├── CLAUDE.md               # Developer guidelines and commands
├── css/
│   └── styles.css          # Core Design System, responsive grid layout, and spring physics
└── js/
    ├── app.js              # Core app controller, navigation state, calculations, PDF export
    └── crypto-demo.js      # Real Web Crypto API and simulated Kyber hybrid wrapping
```

---

## 3. Core Development Guidelines

### A. The Structural Donor Principle
*   Treat any pasted or template HTML elements strictly as **structural donors**. 
*   Replace all generic layout placeholders with actual content.
*   Do not leave any unstyled default controls; every component must adapt the dark-cyberglass style theme.

### B. The Copy Mandate
*   **Never invent copy**, statistics, testimonials, press mentions, or algorithm metrics.
*   All headlines, content cards, notifications, and metadata must pull from or match [COPY.md](file:///Volumes/PSR%20USB/5.%20All%20Projects%20SNPSU/CXO-INNOFEST/COPY.md) exactly.

### C. Design Tokens Alignment
*   **Never use hardcoded hex or RGB colors** in inline styles or ad-hoc CSS rules.
*   All colors, borders, shadows, transitions, and text headers must resolve to the custom properties defined in [DESIGN.md](file:///Volumes/PSR%20USB/5.%20All%20Projects%20SNPSU/CXO-INNOFEST/DESIGN.md) (e.g., `--cyan` for Cywayz Blue, `--orange` for Cywayz Orange, `--green` for Cywayz Green).

### D. SPA State & SEO updates
*   When adding page templates, register them in the `seoData` dictionary in `js/app.js` and link them to the navigation transitions to preserve unified SPA SEO indexing.
