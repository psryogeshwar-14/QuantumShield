# QuantumShield CONTEXT

## Project Identity
- **Project Name:** QuantumShield
- **Tagline:** Quantum-Safe Cryptography Migration Toolkit
- **Problem Statement Number:** PS 013
- **Event:** CXO-INNOFEST 2026 / Cywayz CXO Hackathon
- **Organization Simulated:** Acme Corp
- **Tool Version:** QuantumShield v1.0

## The Problem (with proof)
**What is the quantum threat?**
- **Shor's Algorithm:** Breaks Asymmetric Crypto. Quantum computers running Shor's algorithm can break RSA, ECC, and Diffie-Hellman in polynomial time — rendering all public-key infrastructure obsolete. Affects: RSA, ECC, DH, DSA, ECDSA.
- **Grover's Algorithm:** Weakens Symmetric Crypto. Grover's algorithm provides a quadratic speedup for brute-force attacks, effectively halving the security of symmetric keys and hash functions. Affects: AES-128 → 64-bit, SHA-256 → 128-bit.
- **Harvest Now, Decrypt Later (HNDL):** Data Already at Risk. Adversaries are harvesting encrypted data today to decrypt once quantum computers exist. Long-lived sensitive data is already compromised.

**Q-Day Timeline:** 
Cryptographically-Relevant Quantum Computer (CRQC) expected by 2029–2031. Timeline: 2026–2030 (Immediate action needed).

**Why this matters NOW:** 
Nation-state actors are already harvesting encrypted traffic for future decryption. Real-world data sensitivity categories particularly at risk include financial, medical, IP, and government records.

## The Numbers
**Default Inventory:** 16 assets across 4 categories (TLS Certificate, API Authentication, Database Encryption, Code Signing).

**16 Assets List:**
1. api.acmecorp.com | TLS Certificate | RSA-2048 | 2048 bits | Shor's Algorithm | critical | high | 90 days | ML-KEM + ML-DSA
2. www.acmecorp.com | TLS Certificate | ECC P-256 | 256 bits | Shor's Algorithm | critical | medium | 60 days | ML-KEM + ML-DSA
3. internal.acmecorp.com | TLS Certificate | RSA-4096 | 4096 bits | Shor's Algorithm | critical | critical | 120 days | ML-KEM + SLH-DSA
4. vpn.acmecorp.com | TLS Certificate | ECDSA P-384 | 384 bits | Shor's Algorithm | critical | critical | 90 days | FN-DSA (FALCON)
5. Auth Service (JWT) | API Authentication | RS256 (RSA) | 2048 bits | Shor's Algorithm | critical | critical | 180 days | ML-DSA (CRYSTALS-Dilithium)
6. Webhook Signing | API Authentication | HMAC-SHA256 | 256 bits | Grover's (minor) | low | medium | 0 days | HMAC-SHA256 (safe)
7. OAuth2 (PKCE) | API Authentication | ECDH P-256 | 256 bits | Shor's Algorithm | critical | high | 120 days | ML-KEM-768
8. Service Mesh mTLS | API Authentication | ECDSA P-256 | 256 bits | Shor's Algorithm | critical | high | 150 days | ML-DSA + ML-KEM
9. PostgreSQL (prod) | Database Encryption | AES-256-CBC | 256 bits | Grover's → 128-bit | low | critical | 0 days | AES-256-GCM (safe)
10. Key Management (KMS) | Database Encryption | RSA-2048 wrap | 2048 bits | Shor's Algorithm | critical | critical | 60 days | ML-KEM-1024
11. MongoDB (analytics) | Database Encryption | AES-128-CBC | 128 bits | Grover's → 64-bit | high | medium | 45 days | AES-256-GCM
12. Redis (cache) | Database Encryption | None / Plaintext | N/A | Immediate Risk | critical | medium | 30 days | Enable TLS + AES-256
13. CI/CD Pipeline Sign | Code Signing | RSA-SHA256 | 2048 bits | Shor's Algorithm | critical | high | 90 days | SLH-DSA (SPHINCS+)
14. App Release Cert | Code Signing | ECDSA P-256 | 256 bits | Shor's Algorithm | critical | high | 90 days | FN-DSA (FALCON)
15. Root CA (Internal) | Code Signing | RSA-4096 | 4096 bits | Shor's Algorithm | critical | critical | 365 days | ML-DSA + SLH-DSA
16. SSH Keys (servers) | Code Signing | Ed25519 | 255 bits | Shor's Algorithm | high | high | 60 days | ML-DSA (Dilithium)

**Risk Score Formula:** critical=95, high=70, medium=45, low=15, averaged across inventory.
**Default Overall Risk Score:** 78/100 (CRITICAL) in HTML, dynamically calculated to 82/100.
**Risk Counts:** 12 Critical, 2 High Risk, 0 Medium Risk, 2 Quantum-Safe (Low Risk).

**Compliance Score Formulas:**
- **FedRAMP / FIPS:** `Math.max(0, Math.round(((total - fedrampVulnerables) / total) * 100))` where vulnerables = (critical or high) AND (TLS Certificate or Code Signing).
- **PCI-DSS v4.0:** `Math.max(0, Math.round(((total - pciVulnerables) / total) * 100))` where vulnerables = critical AND (TLS Certificate OR asset includes 'prod' OR algo includes 'None').
- **HIPAA:** `Math.max(0, Math.round(((total - hipaaVulnerables) / total) * 100))` where vulnerables = (critical or high) AND sensitivity is 'critical'.
- **GDPR (Article 32):** `Math.max(0, Math.round(((total - criticals) / total) * 100))`

## NIST PQC Standards (the solution)
- **FIPS 203:** ML-KEM (CRYSTALS-Kyber) — Key Encapsulation Mechanism — replaces RSA & ECDH key exchange
- **FIPS 204:** ML-DSA (CRYSTALS-Dilithium) — Lattice-Based Digital Signatures — replaces RSA & ECDSA signatures
- **FIPS 205:** SLH-DSA (SPHINCS+) — Hash-Based Signatures — Stateless hash-based backup signer
- **FIPS 206:** FN-DSA (FALCON) — Compact Lattice Signatures — Low-bandwidth signature replacement
- **Reference:** NIST SP 800-208

## Algorithm Security Comparison Table
| Algorithm | Type | Classical Security | Quantum Security | Key Size | Status |
|---|---|---|---|---|---|
| RSA-2048 | Asymmetric (Classical) | 112-bit | 0-bit ❌ | 2048 bits | DEPRECATED |
| ECC P-256 | Asymmetric (Classical) | 128-bit | 0-bit ❌ | 256 bits | DEPRECATED |
| AES-256 | Symmetric | 256-bit | 128-bit ✓ | 256 bits | SAFE |
| ML-KEM / Kyber-1024 | Lattice-based KEM | 256-bit | 256-bit ✓ | 1568 bytes | NIST FIPS 203 |
| ML-DSA / Dilithium3 | Lattice-based DSA | 256-bit | 256-bit ✓ | 1952 bytes | NIST FIPS 204 |
| SLH-DSA / SPHINCS+ | Hash-based Sig | 256-bit | 256-bit ✓ | 49856 bytes | NIST FIPS 205 |

## Hybrid Encryption Model
- **Formula:** Classical (RSA-OAEP / ECDH) ⊕ Quantum-Safe (ML-KEM / Kyber) = Hybrid Shared Secret
- **Implementation:** AES-256-GCM for data encryption, RSA-OAEP for classical key wrapping, simulated Kyber-1024 for quantum-safe key wrapping.
- **Web Crypto API Usage:** Uses `crypto.subtle.generateKey` and `crypto.subtle.encrypt` for AES-256-GCM and RSA-OAEP wrapping. Uses `crypto.getRandomValues` and XOR simulation for Kyber.

## Migration Roadmap Phases
- **Phase 1: Inventory & Audit (default 2 quarters)**
  - Deploy QuantumShield scanner org-wide
  - Map all RSA, ECC, DH usage across services
  - Classify data sensitivity and assign risk scores
  - Identify "Harvest Now, Decrypt Later" exposure
- **Phase 2: Pilot Migrations (default 2 quarters)**
  - Implement ML-KEM-768 on test TLS endpoints
  - Deploy hybrid encryption wrappers in API gateway
  - Test ML-DSA (Dilithium) for JWT signing
- **Phase 3: Full PQC Migration (default 3 quarters)**
  - Replace all TLS certs with ML-KEM + ML-DSA
  - Migrate KMS key wrapping to ML-KEM-1024 (FIPS 203)
  - Enable AES-256-GCM across all databases
- **Phase 4: Legacy Retirement (default 1 quarter)**
  - Deprecate all RSA and ECC certificates
  - Block legacy TLS 1.2 with RSA cipher suites
  - Implement PQC-only policy enforcement

## Voice & Tone
- **Target Audience:** C-suite executives, CISOs, security architects.
- **Tone:** Authoritative but accessible, urgency without panic, data-driven.
- **Key Messaging Pillars:** 
  1. Urgency (Q-Day is coming, data being harvested now)
  2. Proof (NIST standards exist)
  3. Action (clear, prioritized migration path)

## Specialist Skill Manifest
The design and functionality of the QuantumShield platform are structured around three specialized engineering capabilities:

1. **Emil Kowalski Skill (Interaction & Micro-animations):**
   - **Theory:** High-fidelity micro-interactions reduce cognitive load and enhance spatial orientation by providing instant, physics-based visual feedback.
   - **Implementations:** 3D perspective mouse tracking, lerped cursor glowing radial backdrops, spring- physics mathematical counters, and staggered animation reveals.

2. **Impeccable Skill (Pixel-Perfect Polish & Style):**
   - **Theory:** Immaculate styling builds immediate enterprise trust and demonstrates high-grade execution.
   - **Implementations:** Conic gradient border elements utilizing CSS `@property` angle variables, magnetic button hover attractions, glistening text and progress indicator shimmers, custom-styled scrollbars, and hamburger menu-icon transitions.
   - **Status:** Selected as user's favorite (`SLASH POLISH`).

3. **Teste Skill (Cryptographic Verification & Math Audit):**
   - **Theory:** Rigorous verification ensures correct mathematical alignment, functional standards compliance, and threat mitigation validity.
   - **Implementations:** Web Crypto API keys generation, simulated Kyber key encapsulation packaging, dynamic regulatory framework calculations, and client-side high-fidelity PDF synthesis.

