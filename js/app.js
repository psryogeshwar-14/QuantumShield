// ============================================================
// QuantumShield — Main Application Logic (Advanced Edition)
// CXO-INNOFEST 2026 · PS 013
// ============================================================

// ============================================================
// DATA: Cryptographic Inventory (Default Initial State)
// ============================================================
let INVENTORY = [
  // TLS Certificates
  { id: 1, asset: 'api.acmecorp.com', category: 'TLS Certificate', algo: 'RSA-2048', keySize: '2048 bits', threat: 'Shor\'s Algorithm', risk: 'critical', sensitivity: 'high', migrateDays: 90, pqcReplace: 'ML-KEM + ML-DSA' },
  { id: 2, asset: 'www.acmecorp.com', category: 'TLS Certificate', algo: 'ECC P-256', keySize: '256 bits', threat: 'Shor\'s Algorithm', risk: 'critical', sensitivity: 'medium', migrateDays: 60, pqcReplace: 'ML-KEM + ML-DSA' },
  { id: 3, asset: 'internal.acmecorp.com', category: 'TLS Certificate', algo: 'RSA-4096', keySize: '4096 bits', threat: 'Shor\'s Algorithm', risk: 'critical', sensitivity: 'critical', migrateDays: 120, pqcReplace: 'ML-KEM + SLH-DSA' },
  { id: 4, asset: 'vpn.acmecorp.com', category: 'TLS Certificate', algo: 'ECDSA P-384', keySize: '384 bits', threat: 'Shor\'s Algorithm', risk: 'critical', sensitivity: 'critical', migrateDays: 90, pqcReplace: 'FN-DSA (FALCON)' },
  // API Auth
  { id: 5, asset: 'Auth Service (JWT)', category: 'API Authentication', algo: 'RS256 (RSA)', keySize: '2048 bits', threat: 'Shor\'s Algorithm', risk: 'critical', sensitivity: 'critical', migrateDays: 180, pqcReplace: 'ML-DSA (CRYSTALS-Dilithium)' },
  { id: 6, asset: 'Webhook Signing', category: 'API Authentication', algo: 'HMAC-SHA256', keySize: '256 bits', threat: 'Grover\'s (minor)', risk: 'low', sensitivity: 'medium', migrateDays: 0, pqcReplace: 'HMAC-SHA256 (safe)' },
  { id: 7, asset: 'OAuth2 (PKCE)', category: 'API Authentication', algo: 'ECDH P-256', keySize: '256 bits', threat: 'Shor\'s Algorithm', risk: 'critical', sensitivity: 'high', migrateDays: 120, pqcReplace: 'ML-KEM-768' },
  { id: 8, asset: 'Service Mesh mTLS', category: 'API Authentication', algo: 'ECDSA P-256', keySize: '256 bits', threat: 'Shor\'s Algorithm', risk: 'critical', sensitivity: 'high', migrateDays: 150, pqcReplace: 'ML-DSA + ML-KEM' },
  // Databases
  { id: 9, asset: 'PostgreSQL (prod)', category: 'Database Encryption', algo: 'AES-256-CBC', keySize: '256 bits', threat: 'Grover\'s → 128-bit', risk: 'low', sensitivity: 'critical', migrateDays: 0, pqcReplace: 'AES-256-GCM (safe)' },
  { id: 10, asset: 'Key Management (KMS)', category: 'Database Encryption', algo: 'RSA-2048 wrap', keySize: '2048 bits', threat: 'Shor\'s Algorithm', risk: 'critical', sensitivity: 'critical', migrateDays: 60, pqcReplace: 'ML-KEM-1024' },
  { id: 11, asset: 'MongoDB (analytics)', category: 'Database Encryption', algo: 'AES-128-CBC', keySize: '128 bits', threat: 'Grover\'s → 64-bit', risk: 'high', sensitivity: 'medium', migrateDays: 45, pqcReplace: 'AES-256-GCM' },
  { id: 12, asset: 'Redis (cache)', category: 'Database Encryption', algo: 'None / Plaintext', keySize: 'N/A', threat: 'Immediate Risk', risk: 'critical', sensitivity: 'medium', migrateDays: 30, pqcReplace: 'Enable TLS + AES-256' },
  // Code Signing
  { id: 13, asset: 'CI/CD Pipeline Sign', category: 'Code Signing', algo: 'RSA-SHA256', keySize: '2048 bits', threat: 'Shor\'s Algorithm', risk: 'critical', sensitivity: 'high', migrateDays: 90, pqcReplace: 'SLH-DSA (SPHINCS+)' },
  { id: 14, asset: 'App Release Cert', category: 'Code Signing', algo: 'ECDSA P-256', keySize: '256 bits', threat: 'Shor\'s Algorithm', risk: 'critical', sensitivity: 'high', migrateDays: 90, pqcReplace: 'FN-DSA (FALCON)' },
  { id: 15, asset: 'Root CA (Internal)', category: 'Code Signing', algo: 'RSA-4096', keySize: '4096 bits', threat: 'Shor\'s Algorithm', risk: 'critical', sensitivity: 'critical', migrateDays: 365, pqcReplace: 'ML-DSA + SLH-DSA' },
  { id: 16, asset: 'SSH Keys (servers)', category: 'Code Signing', algo: 'Ed25519', keySize: '255 bits', threat: 'Shor\'s Algorithm', risk: 'high', sensitivity: 'high', migrateDays: 60, pqcReplace: 'ML-DSA (Dilithium)' },
];

let globalGaugeChart = null;
let globalAlgoChart = null;
let globalCategoryChart = null;
let globalReportChart = null;

// ============================================================
// CALCULATE RISKS & TOTALS
// ============================================================
function getRiskCounts() {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  INVENTORY.forEach(a => {
    if (counts[a.risk] !== undefined) counts[a.risk]++;
  });
  return counts;
}

function calculateOverallRiskScore() {
  if (INVENTORY.length === 0) return 0;
  let totalScore = 0;
  INVENTORY.forEach(a => {
    if (a.risk === 'critical') totalScore += 95;
    else if (a.risk === 'high') totalScore += 70;
    else if (a.risk === 'medium') totalScore += 45;
    else totalScore += 15;
  });
  return Math.round(totalScore / INVENTORY.length);
}

// ============================================================
// NAVIGATION
// ============================================================
let currentSection = 'dashboard';

const seoData = {
  dashboard: {
    title: 'Quantum Risk Dashboard | QuantumShield',
    desc: 'Evaluate your organization\'s post-quantum cryptographic risk profile, track legacy RSA/ECC exposure, and monitor the Q-Day transition timeline.'
  },
  scanner: {
    title: 'Cryptographic Inventory Scanner | QuantumShield',
    desc: 'Scan public cloud, API gateways, and database credentials to discover and audit quantum-vulnerable cryptographic cipher suites.'
  },
  risk: {
    title: 'Quantum Risk & Threat Assessment | QuantumShield',
    desc: 'Analyze quantum threat parameters of Shor\'s and Grover\'s algorithms, and map data sensitivity against cryptographic shelf-life.'
  },
  compliance: {
    title: 'Compliance & Regulatory Audit | QuantumShield',
    desc: 'Audit cryptographic readiness against federal guidelines, including FIPS 140-3, FedRAMP, PCI-DSS v4.0, HIPAA, and GDPR Article 32.'
  },
  roadmap: {
    title: 'NIST PQC Migration Roadmap | QuantumShield',
    desc: 'Establish a phased post-quantum cryptography transition roadmap aligned with FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), and FIPS 205 (SLH-DSA).'
  },
  crypto: {
    title: 'Hybrid Encryption Wrapper Demo | QuantumShield',
    desc: 'Test real-time hybrid key encapsulation wrapper performance combining classical RSA-OAEP with post-quantum ML-KEM / Kyber.'
  },
  crypto: {
    title: 'Hybrid Encryption Wrapper Demo | QuantumShield',
    desc: 'Test real-time hybrid key encapsulation wrapper performance combining classical RSA-OAEP with post-quantum ML-KEM / Kyber.'
  },
  skills: {
    title: 'Specialist Skills & Developer Profile | QuantumShield',
    desc: 'Examine demonstrated development capabilities: Emil Kowalski micro-interactions, Impeccable polish, and Teste verification procedures.'
  },
  report: {
    title: 'Executive Security Report | QuantumShield',
    desc: 'Download the comprehensive quantum readiness report detailing legacy algorithm counts, compliance logs, and wave actions.'
  }
};

async function navigate(section) {
  const oldTarget = document.querySelector('.page-section.active');
  const navItem = document.querySelector(`[data-section="${section}"]`);
  
  if (oldTarget && oldTarget.id !== `section-${section}`) {
    oldTarget.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    oldTarget.style.opacity = '0';
    oldTarget.style.transform = 'translateY(-10px)';
    await new Promise(r => setTimeout(r, 300));
    oldTarget.classList.remove('active');
    oldTarget.style.opacity = '';
    oldTarget.style.transform = '';
  } else if (!oldTarget) {
     document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  }

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  const target = document.getElementById(`section-${section}`);
  if (target) {
    target.classList.add('active');
    target.style.opacity = '0';
    target.style.transform = 'translateY(20px)';
    void target.offsetWidth;
    target.style.transition = 'opacity 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    target.style.opacity = '1';
    target.style.transform = 'translateY(0)';
  }

  if (navItem) navItem.classList.add('active');
  currentSection = section;

  // Dynamically update SEO Metadata
  if (seoData[section]) {
    document.title = seoData[section].title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', seoData[section].desc);
  }

  if (section === 'dashboard') {
    destroyCharts();
    initDashboard();
  }
  if (section === 'risk') renderRiskSection();
  if (section === 'compliance') renderCompliance();
  if (section === 'roadmap') renderRoadmap();
  if (section === 'skills') {
    // Refresh reveals inside skills page
    document.querySelectorAll('#section-skills .reveal').forEach(el => {
      el.classList.remove('visible');
      void el.offsetWidth;
      el.classList.add('visible');
    });
  }
  if (section === 'report') renderReport();
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function destroyCharts() {
  if (globalGaugeChart) globalGaugeChart.destroy();
  if (globalAlgoChart) globalAlgoChart.destroy();
  if (globalCategoryChart) globalCategoryChart.destroy();
  if (globalReportChart) globalReportChart.destroy();
}

// ============================================================
// PARTICLE BACKGROUND
// ============================================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '124,58,237' : '6,182,212',
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
      ctx.fill();
    });

    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x, dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ============================================================
// DASHBOARD CHARTS
// ============================================================
function initDashboard() {
  const counts = getRiskCounts();

  // Animate counters
  animateCounter('stat-critical', counts.critical);
  animateCounter('stat-high', counts.high);
  animateCounter('stat-medium', counts.medium);
  animateCounter('stat-safe', counts.low);

  const score = calculateOverallRiskScore();
  const scoreLabelEl = document.getElementById('gauge-score');
  if (scoreLabelEl) scoreLabelEl.textContent = score;

  const riskLabelEl = document.getElementById('gauge-risk-label');
  const statusNoteEl = document.getElementById('gauge-status-note');
  let riskLabelText = 'SAFE';
  let statusNoteText = 'Your systems are quantum-safe. Maintain continuous monitoring.';
  let gaugeColor = '#10b981';

  if (score >= 75) {
    riskLabelText = 'CRITICAL';
    statusNoteText = 'Your org is <strong>highly exposed</strong> to quantum threats. Immediate action required on RSA and ECC assets.';
    gaugeColor = '#ef4444';
  } else if (score >= 45) {
    riskLabelText = 'HIGH RISK';
    statusNoteText = 'Multiple vulnerable assets detected. Prioritize KMS and Public TLS upgrades.';
    gaugeColor = '#f59e0b';
  } else if (score >= 20) {
    riskLabelText = 'MEDIUM';
    statusNoteText = 'Low exposure. Plan standard migration timelines for legacy components.';
    gaugeColor = '#06b6d4';
  }

  if (riskLabelEl) {
    riskLabelEl.textContent = riskLabelText;
    riskLabelEl.style.color = gaugeColor;
  }
  if (scoreLabelEl) {
    scoreLabelEl.style.color = gaugeColor;
  }
  if (statusNoteEl) {
    statusNoteEl.innerHTML = statusNoteText;
  }

  // Risk Gauge Chart
  const gaugeCanvas = document.getElementById('risk-gauge-chart');
  if (gaugeCanvas) {
    const gaugeCtx = gaugeCanvas.getContext('2d');
    globalGaugeChart = new Chart(gaugeCtx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [score, 100 - score],
          backgroundColor: [gaugeColor, 'rgba(255,255,255,0.06)'],
          borderWidth: 0,
          circumference: 270,
          rotation: 225,
        }]
      },
      options: {
        responsive: false,
        cutout: '75%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        animation: { duration: 1500, easing: 'easeInOutQuart' },
      }
    });
  }

  // Algorithm exposure breakdown
  const algoCanvas = document.getElementById('algo-breakdown-chart');
  if (algoCanvas) {
    const algoCtx = algoCanvas.getContext('2d');
    const algoCounts = {};
    INVENTORY.forEach(a => { algoCounts[a.algo] = (algoCounts[a.algo] || 0) + 1; });
    const sortedAlgos = Object.entries(algoCounts).sort((a, b) => b[1] - a[1]).slice(0, 7);
    globalAlgoChart = new Chart(algoCtx, {
      type: 'bar',
      data: {
        labels: sortedAlgos.map(a => a[0]),
        datasets: [{
          label: 'Assets',
          data: sortedAlgos.map(a => a[1]),
          backgroundColor: sortedAlgos.map(([algo]) => {
            if (algo.includes('RSA') || algo.includes('ECC') || algo.includes('ECDSA') || algo.includes('ECDH') || algo.includes('Ed25519')) return 'rgba(239,68,68,0.7)';
            if (algo.includes('AES-128') || algo.includes('None')) return 'rgba(245,158,11,0.7)';
            return 'rgba(16,185,129,0.7)';
          }),
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,14,39,0.95)',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
          }
        },
        scales: {
          x: {
            ticks: { color: '#64748b', font: { size: 10, family: 'JetBrains Mono' } },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          y: {
            ticks: { color: '#64748b', stepSize: 1 },
            grid: { color: 'rgba(255,255,255,0.04)' },
            beginAtZero: true,
          }
        },
        animation: { duration: 1200, easing: 'easeInOutQuart' },
      }
    });
  }

  // Category Risk
  const catCanvas = document.getElementById('category-risk-chart');
  if (catCanvas) {
    const catCtx = catCanvas.getContext('2d');
    const categories = ['TLS Certificate', 'API Authentication', 'Database Encryption', 'Code Signing'];
    const catRisks = categories.map(cat => {
      const assets = INVENTORY.filter(a => a.category === cat);
      if (assets.length === 0) return 0;
      const criticals = assets.filter(a => a.risk === 'critical' || a.risk === 'high').length;
      return Math.round((criticals / assets.length) * 100);
    });
    globalCategoryChart = new Chart(catCtx, {
      type: 'radar',
      data: {
        labels: categories.map(c => c.replace(' ', '\n')),
        datasets: [{
          label: 'Quantum Risk %',
          data: catRisks,
          backgroundColor: 'rgba(124,58,237,0.15)',
          borderColor: '#7c3aed',
          pointBackgroundColor: '#7c3aed',
          pointBorderColor: '#7c3aed',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,14,39,0.95)',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            callbacks: { label: ctx => `Risk Exposure: ${ctx.raw}%` }
          }
        },
        scales: {
          r: {
            ticks: { color: '#475569', backdropColor: 'transparent', font: { size: 10 } },
            grid: { color: 'rgba(255,255,255,0.07)' },
            pointLabels: { color: '#94a3b8', font: { size: 10 } },
            min: 0, max: 100,
          }
        },
        animation: { duration: 1400, easing: 'easeInOutQuart' },
      }
    });
  }
}

function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  
  let current = parseInt(el.textContent) || 0;
  let velocity = 0;
  const tension = 0.08;
  const friction = 0.75;
  
  function step() {
    const diff = target - current;
    velocity += diff * tension;
    velocity *= friction;
    current += velocity;
    
    if (Math.abs(diff) < 0.1 && Math.abs(velocity) < 0.1) {
      current = target;
      el.textContent = Math.round(current);
    } else {
      el.textContent = Math.round(current);
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

// ============================================================
// UPLOADER LOGIC
// ============================================================
function triggerFileInput() {
  const fileInput = document.getElementById('asset-file-input');
  if (fileInput) fileInput.click();
}

function handleDragOver(e) {
  e.preventDefault();
  const zone = document.getElementById('drop-zone');
  if (zone) zone.classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  const zone = document.getElementById('drop-zone');
  if (zone) zone.classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  const zone = document.getElementById('drop-zone');
  if (zone) zone.classList.remove('dragover');
  
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    parseAssetFile(e.dataTransfer.files[0]);
  }
}

function handleFileUpload(e) {
  if (e.target.files && e.target.files[0]) {
    parseAssetFile(e.target.files[0]);
  }
}

function parseAssetFile(file) {
  const reader = new FileReader();
  
  const extension = file.name.split('.').pop().toLowerCase();
  
  reader.onload = function(evt) {
    try {
      const text = evt.target.result;
      let parsedData = [];
      
      if (extension === 'json') {
        parsedData = JSON.parse(text);
        if (!Array.isArray(parsedData)) parsedData = [parsedData];
      } else if (extension === 'csv') {
        parsedData = parseCSV(text);
      }
      
      if (parsedData.length === 0) {
        throw new Error('No valid cryptographic assets found in file.');
      }
      
      // Map loaded data to standard schema
      INVENTORY = parsedData.map((item, index) => {
        const asset = item.asset || item.Endpoint || `Asset-${index + 1}`;
        const category = item.category || item.Category || 'TLS Certificate';
        const algo = item.algo || item.Algorithm || 'RSA-2048';
        const keySize = item.keySize || item.KeySize || '2048 bits';
        const sensitivity = (item.sensitivity || item.Sensitivity || 'medium').toLowerCase();
        
        // Auto-assign threat / risk
        let risk = 'low';
        let threat = 'Symmetric (safe)';
        let pqcReplace = 'AES-256-GCM';
        
        const algoUpper = algo.toUpperCase();
        if (algoUpper.includes('RSA') || algoUpper.includes('ECC') || algoUpper.includes('ECDSA') || algoUpper.includes('ECDH') || algoUpper.includes('ED25519')) {
          risk = 'critical';
          threat = "Shor's Algorithm";
          pqcReplace = algoUpper.includes('DH') || algoUpper.includes('KEM') ? 'ML-KEM' : 'ML-DSA';
        } else if (algoUpper.includes('AES-128') || algoUpper.includes('MD5') || algoUpper.includes('SHA1')) {
          risk = 'high';
          threat = 'Grover\'s / Hash weakening';
          pqcReplace = 'Upgrade to AES-256 / SHA-3';
        } else if (algoUpper.includes('NONE') || algoUpper.includes('PLAIN')) {
          risk = 'critical';
          threat = 'No encryption';
          pqcReplace = 'Enable TLS / AES';
        }
        
        return {
          id: index + 1,
          asset,
          category,
          algo,
          keySize,
          threat,
          risk,
          sensitivity,
          migrateDays: risk === 'critical' ? 90 : risk === 'high' ? 180 : 0,
          pqcReplace
        };
      });
      
      alert(`Successfully loaded ${INVENTORY.length} assets from ${file.name}. Starting inventory scan...`);
      startScan();
      
    } catch (err) {
      alert(`Failed to parse file: ${err.message}`);
    }
  };
  
  reader.readAsText(file);
}

function parseCSV(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const list = [];
  
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    if (row.length === headers.length) {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = row[idx];
      });
      list.push(obj);
    }
  }
  return list;
}

// ============================================================
// SCANNER RUNNING LOGIC
// ============================================================
function startScan() {
  const btn = document.getElementById('scan-btn');
  if (btn) btn.disabled = true;

  const progressArea = document.getElementById('scan-progress-area');
  progressArea.style.display = 'block';
  progressArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const scanLog = document.getElementById('scan-log');
  scanLog.innerHTML = '';
  const progressBar = document.getElementById('scan-progress-bar');
  const statusText = document.getElementById('scan-status-text');

  // Reset target statuses
  ['tls','api','db','code'].forEach(t => {
    const el = document.getElementById(`status-${t}`);
    if (el) { el.textContent = 'Pending'; el.className = 'target-status'; }
    const res = document.getElementById(`result-${t}`);
    if (res) res.innerHTML = '';
  });
  document.getElementById('scan-results-table').style.display = 'none';

  // Build dynamic scan sequence based on current inventory
  const sequence = [
    { delay: 200, log: '[info] Initializing QuantumShield Scanner v1.0...', type: 'info' },
    { delay: 450, log: `[info] Target loaded: ${INVENTORY.length} endpoints to audit`, type: 'info' },
  ];

  let currentDelay = 700;
  const categories = {
    'TLS Certificate': { target: 'tls', doneFlag: 'doneTls', name: 'TLS certificate scan' },
    'API Authentication': { target: 'api', doneFlag: 'doneApi', name: 'API authentication scan' },
    'Database Encryption': { target: 'db', doneFlag: 'doneDb', name: 'Database encryption scan' },
    'Code Signing': { target: 'code', doneFlag: 'doneCode', name: 'Code signing / PKI audit' }
  };

  Object.entries(categories).forEach(([catName, meta]) => {
    const assets = INVENTORY.filter(a => a.category === catName);
    
    // Add start block
    sequence.push({
      delay: currentDelay,
      log: `[scan] Starting ${meta.name}...`,
      type: 'info',
      target: meta.target,
      progress: Math.min(95, Math.round((currentDelay / 4000) * 100))
    });
    currentDelay += 400;

    // Add log lines for each asset in the category
    assets.forEach(a => {
      const isVulnerable = a.risk === 'critical' || a.risk === 'high';
      sequence.push({
        delay: currentDelay,
        log: `[${isVulnerable ? 'warn' : 'ok'}] ${a.asset} → ${a.algo} — ${isVulnerable ? 'QUANTUM VULNERABLE' : 'QUANTUM SAFE'}`,
        type: a.risk === 'critical' ? 'critical' : a.risk === 'high' ? 'warn' : 'ok'
      });
      currentDelay += 300;
    });

    // Add done block
    const doneObj = {
      delay: currentDelay,
      log: `[ok] Finished ${meta.name}`,
      type: 'ok',
      progress: Math.min(95, Math.round((currentDelay / 4000) * 100))
    };
    doneObj[meta.doneFlag] = true;
    sequence.push(doneObj);
    currentDelay += 400;
  });

  // Final step
  const finalCriticalCount = INVENTORY.filter(a => a.risk === 'critical' || a.risk === 'high').length;
  sequence.push({
    delay: currentDelay,
    log: `[done] Audit complete! Identified ${finalCriticalCount} quantum-vulnerable items out of ${INVENTORY.length} scanned.`,
    type: 'ok',
    progress: 100,
    done: true
  });

  // Run sequence
  sequence.forEach(step => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = `log-line log-${step.type}`;
      line.textContent = step.log;
      scanLog.appendChild(line);
      scanLog.scrollTop = scanLog.scrollHeight;

      if (step.progress) {
        progressBar.style.width = step.progress + '%';
        statusText.textContent = step.log.replace('[scan] ', '').replace('[ok] ', '').replace('[done] ', '');
      }

      if (step.target) {
        const el = document.getElementById(`status-${step.target}`);
        if (el) { el.textContent = 'Scanning...'; el.className = 'target-status scanning'; }
      }

      if (step.type === 'critical') {
        let shakeOffset = 2;
        let shakes = 0;
        const body = document.body;
        function shakeStep() {
          if (shakes >= 6) {
            body.style.transform = 'translateX(0px)';
            return;
          }
          body.style.transform = `translateX(${shakeOffset}px)`;
          shakeOffset = -shakeOffset;
          shakes++;
          requestAnimationFrame(() => setTimeout(shakeStep, 30));
        }
        shakeStep();
      }

      if (step.doneTls) markTargetDone('tls', INVENTORY.filter(a => a.category === 'TLS Certificate'));
      if (step.doneApi) markTargetDone('api', INVENTORY.filter(a => a.category === 'API Authentication'));
      if (step.doneDb) markTargetDone('db', INVENTORY.filter(a => a.category === 'Database Encryption'));
      if (step.doneCode) markTargetDone('code', INVENTORY.filter(a => a.category === 'Code Signing'));

      if (step.done) {
        statusText.textContent = `✅ Scan complete! ${INVENTORY.length} assets audited.`;
        if (btn) {
          btn.disabled = false;
          btn.textContent = '🔄 Re-scan';
        }
        document.getElementById('scan-time').textContent = new Date().toLocaleTimeString();
        renderInventoryTable();
        document.getElementById('scan-results-table').style.display = 'block';
        
        // Recompute and update dashboard indicators
        destroyCharts();
        initDashboard();
        
        // Sync Compliance tab values automatically
        renderCompliance();
      }
    }, step.delay);
  });
}

function markTargetDone(target, items) {
  const statusEl = document.getElementById(`status-${target}`);
  if (statusEl) { statusEl.textContent = 'Done ✓'; statusEl.className = 'target-status done'; }
  const resultEl = document.getElementById(`result-${target}`);
  if (resultEl) {
    if (items.length === 0) {
      resultEl.innerHTML = '<span style="font-size:0.7rem;color:var(--text-muted)">No assets in this category</span>';
      return;
    }
    resultEl.innerHTML = items.map(a => {
      const badgeCls = a.risk === 'critical' ? 'tag-critical' : a.risk === 'high' ? 'tag-high' : a.risk === 'medium' ? 'tag-medium' : 'tag-safe';
      return `<span class="result-tag ${badgeCls}">${a.algo}</span>`;
    }).join('');
  }
}

function renderInventoryTable() {
  const tbody = document.getElementById('inventory-tbody');
  
  if(!document.getElementById('stagger-row-style')) {
    const st = document.createElement('style');
    st.id = 'stagger-row-style';
    st.textContent = `
      @keyframes rowReveal {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .stagger-row {
        opacity: 0;
        animation: rowReveal 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      }
    `;
    document.head.appendChild(st);
  }

  tbody.innerHTML = INVENTORY.map((a, i) => `
    <tr class="stagger-row" style="animation-delay: ${i * 30}ms;">
      <td>${a.asset}</td>
      <td><span style="font-size:0.7rem;color:var(--text-muted)">${a.category}</span></td>
      <td style="font-family:var(--mono);font-size:0.78rem">${a.algo}</td>
      <td style="font-family:var(--mono);font-size:0.78rem">${a.keySize}</td>
      <td style="font-size:0.78rem;color:var(--text-muted)">${a.threat}</td>
      <td style="font-family:var(--mono);font-size:0.72rem;color:var(--purple-light)">${a.pqcReplace}</td>
      <td><span class="risk-badge risk-${a.risk}">${a.risk}</span></td>
    </tr>
  `).join('');
}

// ============================================================
// COMPLIANCE AUDIT ENGINE
// ============================================================
function renderCompliance() {
  const total = INVENTORY.length;
  if (total === 0) return;

  const criticals = INVENTORY.filter(a => a.risk === 'critical').length;
  const highs = INVENTORY.filter(a => a.risk === 'high').length;
  
  // Calculate compliance ratios
  // FedRAMP: Penalized by all criticals (especially internal CAs, KMS, TLS)
  const fedrampVulnerables = INVENTORY.filter(a => (a.risk === 'critical' || a.risk === 'high') && (a.category === 'TLS Certificate' || a.category === 'Code Signing')).length;
  const fedrampScore = Math.max(0, Math.round(((total - fedrampVulnerables) / total) * 100));

  // PCI-DSS: Penalized by TLS cert vulnerabilities or DB plaintext encryption
  const pciVulnerables = INVENTORY.filter(a => (a.risk === 'critical') && (a.category === 'TLS Certificate' || a.asset.toLowerCase().includes('prod') || a.algo.includes('None'))).length;
  const pciScore = Math.max(0, Math.round(((total - pciVulnerables) / total) * 100));

  // HIPAA: Health records. Fails if high sensitivity databases use vulnerable keys
  const hipaaVulnerables = INVENTORY.filter(a => (a.risk === 'critical' || a.risk === 'high') && a.sensitivity === 'critical').length;
  const hipaaScore = Math.max(0, Math.round(((total - hipaaVulnerables) / total) * 100));

  // GDPR: Penalized if state-of-the-art metrics are failing (any critical score)
  const gdprScore = Math.max(0, Math.round(((total - criticals) / total) * 100));

  updateFrameworkUI('fedramp', fedrampScore, 'FedRAMP / FIPS');
  updateFrameworkUI('pci', pciScore, 'PCI-DSS v4.0');
  updateFrameworkUI('hipaa', hipaaScore, 'HIPAA');
  updateFrameworkUI('gdpr', gdprScore, 'GDPR (Art 32)');

  // Build Audit findings log
  const logBox = document.getElementById('compliance-logs');
  logBox.innerHTML = '';
  
  const findings = [];
  INVENTORY.forEach(a => {
    if (a.risk === 'critical') {
      findings.push({
        status: 'FAIL',
        cls: 'fail',
        msg: `Asset "${a.asset}" (${a.algo}) violates compliance due to Shor's vulnerability. Requires ${a.pqcReplace} transition.`
      });
    } else if (a.risk === 'high') {
      findings.push({
        status: 'WARN',
        cls: 'warn',
        msg: `Asset "${a.asset}" (${a.algo}) has weakened symmetric strength (Grover's exposure). Suggest upgrading to 256-bit keys.`
      });
    }
  });

  if (findings.length === 0) {
    logBox.innerHTML = '<div class="audit-line"><span class="audit-tag pass">[PASS]</span><span class="audit-msg">All systems compliant with quantum-safe cryptographic guidelines!</span></div>';
  } else {
    logBox.innerHTML = findings.map(f => `
      <div class="audit-line">
        <span class="audit-tag ${f.cls}">[${f.status}]</span>
        <span class="audit-msg">${f.msg}</span>
      </div>
    `).join('');
  }
}

function updateFrameworkUI(id, score, name) {
  const card = document.getElementById(`framework-${id}`);
  if (!card) return;

  const statusEl = card.querySelector('.compliance-status');
  const labelEl = card.querySelector('.ring-label');
  const ring = document.getElementById(`ring-${id}`);

  labelEl.textContent = `${score}%`;

  const targetOffset = 251.2 - (251.2 * (score / 100));
  let currentOffset = parseFloat(ring.getAttribute('stroke-dashoffset')) || 251.2;
  
  let velocity = 0;
  function animateRing() {
    const diff = targetOffset - currentOffset;
    velocity += diff * 0.05;
    velocity *= 0.8;
    currentOffset += velocity;
    
    if (Math.abs(diff) < 0.1 && Math.abs(velocity) < 0.1) {
      currentOffset = targetOffset;
      ring.setAttribute('stroke-dashoffset', currentOffset);
    } else {
      ring.setAttribute('stroke-dashoffset', currentOffset);
      requestAnimationFrame(animateRing);
    }
  }
  requestAnimationFrame(animateRing);

  let statusText = 'Compliant';
  let statusClass = 'status-pass';
  let ringColor = 'var(--green)';

  if (score < 50) {
    statusText = 'Non-Compliant';
    statusClass = 'status-fail';
    ringColor = 'var(--red)';
  } else if (score < 90) {
    statusText = 'At Risk';
    statusClass = 'status-warning';
    ringColor = 'var(--orange)';
  }

  statusEl.textContent = statusText;
  statusEl.className = `compliance-status ${statusClass}`;
  ring.style.stroke = ringColor;
}

// ============================================================
// RISK ASSESSMENT
// ============================================================
function renderRiskSection() {
  renderHeatmap();
  renderRiskTable();
}

function renderHeatmap() {
  const container = document.getElementById('risk-heatmap');
  if (!container) return;
  const categories = ['TLS Certificate', 'API Authentication', 'Database Encryption', 'Code Signing'];
  const sensitivities = ['Public', 'Medium', 'High', 'Critical'];

  // Map inventory data to heatmap counts
  const cellCounts = Array(4).fill(0).map(() => Array(4).fill(0));
  
  INVENTORY.forEach(a => {
    const catIdx = categories.indexOf(a.category);
    const sensIdx = sensitivities.map(s => s.toLowerCase()).indexOf(a.sensitivity);
    if (catIdx !== -1 && sensIdx !== -1) {
      cellCounts[catIdx][sensIdx]++;
    }
  });

  const heatLabels = ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  let html = `<div class="heatmap-col-labels">`;
  sensitivities.forEach(s => { html += `<div class="heatmap-col-label">${s}</div>`; });
  html += `</div>`;

  categories.forEach((cat, i) => {
    html += `<div class="heatmap-row">
      <div class="heatmap-label">${cat}</div>`;
    sensitivities.forEach((_, j) => {
      const count = cellCounts[i][j];
      let level = 0;
      if (count > 4) level = 4;
      else if (count > 2) level = 3;
      else if (count > 1) level = 2;
      else if (count > 0) level = 1;
      
      html += `<div class="heatmap-cell heat-${level}" title="${cat} + ${sensitivities[j]} data = ${count} Assets (${heatLabels[level]} risk)">${count} Assets</div>`;
    });
    html += `</div>`;
  });

  container.innerHTML = html;
}

function renderRiskTable() {
  const tbody = document.getElementById('risk-tbody');
  if (!tbody) return;
  const scoreMap = { critical: 95, high: 70, medium: 45, low: 15 };
  const timeMap = { critical: '30–90 days', high: '45–60 days', medium: '6 months', low: 'No action' };
  const priorityMap = { critical: '🔴 P1 — Immediate', high: '🟠 P2 — Short-term', medium: '🟡 P3 — Medium-term', low: '🟢 P4 — Monitor' };

  tbody.innerHTML = INVENTORY.map((a, i) => {
    const score = scoreMap[a.risk];
    const bar = `<div style="display:flex;align-items:center;gap:0.5rem">
      <div style="flex:1;height:6px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${score}%;background:${score > 80 ? '#ef4444' : score > 60 ? '#f59e0b' : score > 30 ? '#06b6d4' : '#10b981'};border-radius:99px"></div>
      </div>
      <span style="font-size:0.72rem;font-weight:700;color:${score > 80 ? 'var(--red)' : score > 60 ? 'var(--orange)' : 'var(--cyan)'}">${score}</span>
    </div>`;
    return `<tr class="stagger-row" style="animation-delay: ${i * 30}ms;">
      <td>${a.asset}</td>
      <td style="font-family:var(--mono);font-size:0.78rem">${a.algo}</td>
      <td><span class="risk-badge risk-${a.sensitivity === 'critical' ? 'critical' : a.sensitivity === 'high' ? 'high' : 'medium'}">${a.sensitivity}</span></td>
      <td style="min-width:180px">${bar}</td>
      <td style="font-size:0.78rem;color:var(--text-muted)">${timeMap[a.risk]}</td>
      <td style="font-size:0.78rem">${priorityMap[a.risk]}</td>
    </tr>`;
  }).join('');
}

// ============================================================
// ROADMAP LOGIC (INTERACTIVE CONFIG)
// ============================================================
let ganttConfig = {
  p1: 2,
  p2: 2,
  p3: 3,
  p4: 1
};

function updateRoadmapConfig() {
  ganttConfig.p1 = parseInt(document.getElementById('slider-p1').value);
  ganttConfig.p2 = parseInt(document.getElementById('slider-p2').value);
  ganttConfig.p3 = parseInt(document.getElementById('slider-p3').value);
  ganttConfig.p4 = parseInt(document.getElementById('slider-p4').value);

  document.getElementById('label-p1').textContent = `${ganttConfig.p1} Qtr${ganttConfig.p1 > 1 ? 's' : ''}`;
  document.getElementById('label-p2').textContent = `${ganttConfig.p2} Qtr${ganttConfig.p2 > 1 ? 's' : ''}`;
  document.getElementById('label-p3').textContent = `${ganttConfig.p3} Qtr${ganttConfig.p3 > 1 ? 's' : ''}`;
  document.getElementById('label-p4').textContent = `${ganttConfig.p4} Qtr${ganttConfig.p4 > 1 ? 's' : ''}`;

  renderRoadmap();
}

function renderRoadmap() {
  renderGantt();
  renderPhases();
}

function renderGantt() {
  const quarters = ['Q1 \'26', 'Q2 \'26', 'Q3 \'26', 'Q4 \'26', 'Q1 \'27', 'Q2 \'27', 'Q3 \'27', 'Q4 \'27'];
  
  // Calculate starts dynamically based on durations
  const startP1 = 0;
  const startP2 = startP1 + ganttConfig.p1;
  const startP3 = startP2 + ganttConfig.p2;
  const startP4 = startP3 + ganttConfig.p3;

  const tasks = [
    { label: 'Phase 1: Inventory & Audit', start: startP1, duration: ganttConfig.p1, phase: 1 },
    { label: 'Phase 2: Pilot Migrations', start: startP2, duration: ganttConfig.p2, phase: 2 },
    { label: 'TLS → ML-KEM + ML-DSA', start: startP2, duration: Math.min(ganttConfig.p2, 2), phase: 2 },
    { label: 'Phase 3: Full PQC Migration', start: startP3, duration: ganttConfig.p3, phase: 3 },
    { label: 'API Auth → ML-DSA', start: startP3, duration: Math.min(ganttConfig.p3, 2), phase: 3 },
    { label: 'KMS → ML-KEM-1024', start: startP3, duration: Math.min(ganttConfig.p3, 1), phase: 3 },
    { label: 'Phase 4: Retire Legacy', start: startP4, duration: ganttConfig.p4, phase: 4 },
  ];

  const phaseColors = { 1: 'gantt-phase-1', 2: 'gantt-phase-2', 3: 'gantt-phase-3', 4: 'gantt-phase-4' };

  let html = `<div class="gantt-header">
    <div class="gantt-header-cell">Task</div>
    ${quarters.map(q => `<div class="gantt-header-cell">${q}</div>`).join('')}
  </div>`;

  tasks.forEach(task => {
    html += `<div class="gantt-row">
      <div class="gantt-label">${task.label}</div>`;
    for (let i = 0; i < 8; i++) {
      if (i === task.start && task.duration > 0 && i < 8) {
        const span = Math.min(task.duration, 8 - i);
        html += `<div class="gantt-block ${phaseColors[task.phase]}" style="grid-column: span ${span}">${task.label}</div>`;
        i += span - 1;
      } else {
        html += `<div class="gantt-cell"></div>`;
      }
    }
    html += `</div>`;
  });

  document.getElementById('gantt-chart').innerHTML = html;
}

function renderPhases() {
  const startP1 = 0;
  const startP2 = startP1 + ganttConfig.p1;
  const startP3 = startP2 + ganttConfig.p2;
  const startP4 = startP3 + ganttConfig.p3;

  const phases = [
    {
      cls: 'p1', num: 'Phase 01', title: '🔍 Inventory & Risk Assessment',
      timeline: `Q${(startP1%4)+1} '26 - Q${((startP1+ganttConfig.p1-1)%4)+1} '26`,
      desc: 'Establish a complete cryptographic inventory across all systems. Prioritize assets by risk and data sensitivity.',
      tasks: [
        'Deploy QuantumShield scanner org-wide',
        'Map all RSA, ECC, DH usage across services',
        'Classify data sensitivity and assign risk scores',
        'Identify "Harvest Now, Decrypt Later" exposure',
      ]
    },
    {
      cls: 'p2', num: 'Phase 02', title: '🧪 Pilot Migrations',
      timeline: `Q${(startP2%4)+1} '26 - Q${((startP2+ganttConfig.p2-1)%4)+1} '26`,
      desc: 'Run hybrid (classical + PQC) encryption on non-critical systems to validate implementation and performance.',
      tasks: [
        'Implement ML-KEM-768 on test TLS endpoints',
        'Deploy hybrid encryption wrappers in API gateway',
        'Test ML-DSA (Dilithium) for JWT signing',
      ]
    },
    {
      cls: 'p3', num: 'Phase 03', title: '🚀 Full PQC Migration',
      timeline: `Q${(startP3%4)+1} '27 - Q${((startP3+ganttConfig.p3-1)%4)+1} '27`,
      desc: 'Migrate all critical systems to NIST PQC standards. Rebuild internal PKI with quantum-safe algorithms.',
      tasks: [
        'Replace all TLS certs with ML-KEM + ML-DSA',
        'Migrate KMS key wrapping to ML-KEM-1024 (FIPS 203)',
        'Enable AES-256-GCM across all databases',
      ]
    },
    {
      cls: 'p4', num: 'Phase 04', title: '🔒 Legacy Retirement',
      timeline: `Q${(startP4%4)+1} '28 - Q${((startP4+ganttConfig.p4-1)%4)+1} '28`,
      desc: 'Fully deprecate classical asymmetric cryptography. Enforce quantum-safe policies org-wide.',
      tasks: [
        'Deprecate all RSA and ECC certificates',
        'Block legacy TLS 1.2 with RSA cipher suites',
        'Implement PQC-only policy enforcement',
      ]
    }
  ];

  document.getElementById('phases-grid').innerHTML = phases.map(p => `
    <div class="phase-card ${p.cls}">
      <div class="phase-num">${p.num} · ${p.timeline}</div>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <ul class="phase-tasks">
        ${p.tasks.map(t => `<li>${t}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// ============================================================
// EXECUTIVE REPORT GENERATION
// ============================================================
function renderReport() {
  document.getElementById('report-date').textContent = new Date().toLocaleString('en-IN', {
    dateStyle: 'long', timeStyle: 'short'
  });

  const counts = getRiskCounts();
  const score = calculateOverallRiskScore();

  document.getElementById('report-summary').innerHTML = `
    <p>QuantumShield conducted a comprehensive cryptographic audit of <strong>Acme Corp's</strong> infrastructure, scanning <strong>${INVENTORY.length} cryptographic assets</strong> across TLS certificates, API authentication, database encryption, and code signing systems.</p>
    <p>The total threat index is rated at <strong>${score}/100</strong>. <strong>${counts.critical} assets are classified as CRITICAL</strong> due to Shor's algorithm vulnerability.</p>
    <p>The "Harvest Now, Decrypt Later" threat is the most urgent concern — adversaries are already harvesting TLS-encrypted traffic for future decryption. Long-lived sensitive data (financial, medical, IP) is particularly at risk.</p>
  `;

  // Report Chart (Doughnut)
  const reportCanvas = document.getElementById('report-chart');
  if (reportCanvas) {
    const reportCtx = reportCanvas.getContext('2d');
    globalReportChart = new Chart(reportCtx, {
      type: 'doughnut',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Safe'],
        datasets: [{
          data: [counts.critical, counts.high, counts.medium, counts.low],
          backgroundColor: ['rgba(239,68,68,0.8)', 'rgba(245,158,11,0.8)', 'rgba(6,182,212,0.8)', 'rgba(16,185,129,0.8)'],
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.1)',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', padding: 16, font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: 'rgba(10,14,39,0.95)',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
          }
        },
      }
    });
  }

  // Report inventory table
  const actionMap = {
    critical: 'Migrate immediately to NIST PQC',
    high: 'Upgrade key size or replace algorithm',
    medium: 'Monitor and plan migration',
    low: 'No action required'
  };
  const timelineMap = {
    critical: '< 90 days',
    high: '< 6 months',
    medium: '6–12 months',
    low: 'Ongoing monitoring'
  };
  document.getElementById('report-inventory-tbody').innerHTML = INVENTORY.map((a, i) => `
    <tr class="stagger-row" style="animation-delay: ${i * 30}ms;">
      <td>${a.asset}</td>
      <td style="font-family:var(--mono);font-size:0.78rem">${a.algo}</td>
      <td><span class="risk-badge risk-${a.risk}">${a.risk}</span></td>
      <td style="font-size:0.78rem;color:var(--text-secondary)">${actionMap[a.risk]}</td>
      <td style="font-size:0.78rem;font-family:var(--mono)">${timelineMap[a.risk]}</td>
    </tr>
  `).join('');

  // Report actions list
  const actions = [
    {
      priority: 'immediate', label: 'Immediate (< 30 days)',
      title: '🚨 Upgrade Vulnerable Databases',
      desc: 'Upgrade MongoDB or Redis caches to use robust AES-256 with key wrapping immediately.'
    },
    {
      priority: 'immediate', label: 'Immediate (< 60 days)',
      title: '🔑 Replace KMS RSA-2048 Key Wrapping',
      desc: 'Replace with ML-KEM-1024 (FIPS 203) to prevent harvest attacks on encrypted keys.'
    },
    {
      priority: 'short', label: 'Short-term (< 6 months)',
      title: '🌐 Migrate Public TLS to ML-KEM + ML-DSA',
      desc: 'All public TLS endpoints use quantum-vulnerable algorithms. Deploy hybrid TLS using Kyber-768.'
    },
  ];

  document.getElementById('report-actions').innerHTML = actions.map(a => `
    <div class="action-item">
      <span class="action-priority priority-${a.priority}">${a.label}</span>
      <div>
        <h4>${a.title}</h4>
        <p>${a.desc}</p>
      </div>
    </div>
  `).join('');
}

// ============================================================
// PREMIUM CLIENT-SIDE PDF EXPORT
// ============================================================
async function exportPDF() {
  const btn = document.getElementById('download-pdf-btn');
  btn.disabled = true;
  btn.textContent = 'Generating PDF...';

  const element = document.getElementById('report-container');
  
  // Clone element to apply light printing optimizations
  const opt = {
    margin: 10,
    filename: 'QuantumShield_Readiness_Report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#050918' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    const canvas = await html2canvas(element, opt.html2canvas);
    const imgData = canvas.toDataURL('image/png');
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210 - (opt.margin * 2);
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = opt.margin;

    pdf.addImage(imgData, 'PNG', opt.margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + opt.margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', opt.margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(opt.filename);
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('Failed to generate premium PDF: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Export Premium PDF';
  }
}

// ============================================================
// INIT
// ============================================================
function initMicroAnimations() {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = 'position:fixed;width:400px;height:400px;background:radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(0,0,0,0) 70%);border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);z-index:9999;mix-blend-mode:screen;';
  document.body.appendChild(glow);

  let cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2;
  let glowX = cursorX, glowY = cursorY;

  window.addEventListener('mousemove', e => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  function renderGlow() {
    glowX += (cursorX - glowX) * 0.15;
    glowY += (cursorY - glowY) * 0.15;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(renderGlow);
  }
  requestAnimationFrame(renderGlow);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  if(!document.getElementById('reveal-style')) {
    const style = document.createElement('style');
    style.id = 'reveal-style';
    style.textContent = `
      .visible { opacity: 1 !important; transform: translateY(0) !important; }
    `;
    document.head.appendChild(style);
  }

  document.querySelectorAll('.glass-card, .stat-card, .threat-info-card, .nist-card, .phase-card, .compliance-framework-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    el.style.setProperty('--delay', `${(index % 10) * 50}ms`);
    el.style.transitionDelay = 'var(--delay)';
    observer.observe(el);
  });

  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -3;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 3;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.1s ease-out';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
  });

  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      if (dist < 100) {
        const x = (e.clientX - centerX) * 0.1;
        const y = (e.clientY - centerY) * 0.1;
        btn.style.transform = `translate(${Math.max(-4, Math.min(4, x))}px, ${Math.max(-4, Math.min(4, y))}px)`;
        btn.style.transition = 'transform 0.1s linear';
      } else {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      }
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
  });
}

// ============================================================
// MOBILE SIDEBAR TOGGLE
// ============================================================
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const btn = document.getElementById('mobile-menu-btn');
  const backdrop = document.getElementById('sidebar-backdrop');
  
  const isOpen = sidebar.style.transform === 'translateX(0px)';
  
  if (isOpen) {
    sidebar.style.transform = 'translateX(-100%)';
    btn.classList.remove('open');
    backdrop.classList.remove('visible');
    setTimeout(() => { backdrop.style.display = 'none'; }, 400);
  } else {
    backdrop.style.display = 'block';
    requestAnimationFrame(() => {
      sidebar.style.transform = 'translateX(0px)';
      btn.classList.add('open');
      backdrop.classList.add('visible');
    });
  }
}

// ============================================================
// INIT
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initMicroAnimations();
  initDashboard();
  navigate('dashboard');
  
  // Dismiss loading overlay with smooth fade
  setTimeout(() => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('hidden');
  }, 600);
});
