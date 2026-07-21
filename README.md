# 🔐 QuantumShield
> **Enterprise Quantum-Safe Cryptography Migration Toolkit**  
> Developed by Team **HackXO** for **CXO-INNOFEST 2026** (Problem Statement **PS 013**)

[![Production Site](https://img.shields.io/badge/Production-Live-success?style=flat&color=0066cc)](https://cywayz-cxo-innofest.vercel.app)
[![GitHub Code](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/psryogeshwar-14/QuantumShield)
[![NIST Aligned](https://img.shields.io/badge/NIST-FIPS_203_/_204_/_205_/_206-purple)](#-certified-nist-mappings)

---

## 🌐 Live URL
*   **Production Deployment:** [https://cywayz-cxo-innofest.vercel.app](https://cywayz-cxo-innofest.vercel.app)
*   **Pitch Slide Deck:** [https://cywayz-cxo-innofest.vercel.app/idea_ppt_template.html](https://cywayz-cxo-innofest.vercel.app/idea_ppt_template.html)
*   **Attestation Declaration:** [https://cywayz-cxo-innofest.vercel.app/attestation_template.html](https://cywayz-cxo-innofest.vercel.app/attestation_template.html)

---

## ⚡ The Challenge (Q-Day & Shor's Threat)
Legacy asymmetric cryptography (RSA, ECC, Diffie-Hellman) securing global communications is highly vulnerable to **Shor's Algorithm** executed on cryptanalytically relevant quantum computers. Hostile actors are actively executing **"Harvest Now, Decrypt Later"** campaigns—intercepting and storing encrypted corporate traffic today to decrypt tomorrow.

Organizations face critical exposure because:
1.  They lack automated visibility into where legacy cryptographic keys are deployed.
2.  Migration paths are complex and require years of staging.
3.  Transition compliance must align directly with the final **NIST FIPS** post-quantum standards.

---

## 🛠️ The Solution: QuantumShield
**QuantumShield** is a premium, client-side toolkit designed to help CISOs, security architects, and audit teams map legacy liabilities, calculate quantum vulnerability indices, and simulate a safe transition roadmap.

### 🌟 Core Capabilities
*   **Automated Cryptographic Asset Scanner:** Secure, client-side CSV/JSON configuration uploader that parses active certificate lists and algorithm strengths.
*   **Interactive Multi-Factor Risk Assessment:** Real-time risk scoring using Shor's and Grover's algorithm complexity metrics, data sensitivity modifiers, and exposure duration.
*   **NIST-Aligned Compliance Auditor:** Complete audit matrix mapping infrastructure assets against NIST, CNSA, and ISO/IEC regulatory frameworks.
*   **Dynamic Gantt Roadmap Simulator:** Real-time Gantt timeline sliders allowing users to model phase resource changes and view forecast dates instantly.
*   **Hybrid Cryptography Demo:** Live in-browser hybrid key agreement executing real **Web Crypto API (RSA-OAEP/AES-256-GCM)** alongside simulated **ML-KEM (Kyber-1024)** wrapping.
*   **Executive PDF Report:** Compile and download high-fidelity, client-side executive readiness summaries including action plans and compliance logs.

---

## ✨ Specialist Engineering & Polish Details
Aligned with the **UI/UX PRO MAX** guidelines, the interface leverages three core specialist engineering disciplines:

### ⚡ 1. Emil Kowalski Skill (Interaction & Micro-animations)
*   **Lerping Cursor Follower:** A glowing radial light gradient follows the pointer using a velocity-lag lerp function for organic movement.
*   **3D Card perspective:** Hovering over dashboard panels triggers a subtle `3-degree` perspective tilt mapped to cursor offset coordinates.
*   **Spring-Physics Counters:** Numerical metrics overshoot their target value slightly and settle using spring damping models for visual delight.
*   **Staggered Reveals:** Table rows and inventory lists slide in sequentially with a staggered delay.

### 💎 2. Impeccable Skill (Pixel-Perfect Polish)
*   **Rotating Conic Borders:** Glassmorphic cards feature thin animated borders that rotate using CSS `@property` angle variables.
*   **Magnetic Button Pulls:** Primary CTAs drift towards the pointer within target zones to highlight interactivity.
*   **Shimmering Glows:** Heading typography and active progress sweeps use moving linear gradients.
*   **Menu Morphing:** Smartphone navigation hamburger icons morph into a close 'X' via transition transformations.

### 🧪 3. Teste Skill (Verification & Correctness)
*   **Real Web Crypto API:** Executes actual cryptographic wrapping inside the user's browser (no backend key leaks).
*   **PDF Synthesis:** Merges `jsPDF` and `html2canvas` to render pixel-perfect multi-page report downloads.
*   **Formula Audit:** Validates regulatory scores based on standardized cryptographic weightings.

---

## 🏗️ Tech Stack
*   **Frontend Logic:** Vanilla Javascript (ES6+, Web Crypto API)
*   **Styling System:** Vanilla CSS3 (Custom variables, glassmorphic filters, keyframes)
*   **Charts & Visuals:** Chart.js
*   **PDF Generation:** jsPDF + html2canvas
*   **Deployment Hosting:** Vercel

---

## 📦 Project Architecture
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

## 🚀 Local Setup & Running
This is a static client-side project requiring no compilation.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/psryogeshwar-14/QuantumShield.git
    cd QuantumShield
    ```
2.  **Open in your browser:**
    *   **macOS Chrome:** `open -a "Google Chrome" index.html`
    *   **macOS Safari:** `open -a "Safari" index.html`
3.  **Run locally via Node.js HTTP-Server (optional):**
    ```bash
    npx http-server .
    ```

---

## 📜 Certified NIST Mappings
QuantumShield maps legacy assets to the final post-quantum standards defined by NIST:
*   **FIPS 203 (ML-KEM):** Lattice-based key encapsulation mechanisms (previously Crystals-Kyber).
*   **FIPS 204 (ML-DSA):** Lattice-based digital signature algorithm (previously Crystals-Dilithium).
*   **FIPS 205 (SLH-DSA):** Stateful hash-based signature backup (previously SPHINCS+).
*   **FIPS 206 (FN-DSA):** FALCON signature scheme backup.
*   **NIST SP 800-208:** Stateful hash-based signature schemes (XMSS/LMS).
