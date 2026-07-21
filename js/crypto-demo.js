// ============================================================
// QuantumShield — Hybrid Encryption Demo
// Uses Web Crypto API for real in-browser cryptographic operations
// CXO-INNOFEST 2026 · PS 013
// ============================================================

let encryptedBundle = null;
let aesKey = null;
let rsaKeyPair = null;

// ============================================================
// HELPER UTILITIES
// ============================================================
function buf2hex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function buf2base64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base642buf(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
}

function hex2buf(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

// Simulate Kyber key bytes (since native Kyber isn't in Web Crypto API yet)
function generateKyberSimKey(bits = 1024) {
  const keyBytes = new Uint8Array(bits / 8);
  crypto.getRandomValues(keyBytes);
  return keyBytes;
}

// Combine two key materials (XOR-based hybrid combine for demo)
function combineKeys(key1bytes, key2bytes) {
  const combined = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    combined[i] = (key1bytes[i % key1bytes.length]) ^ (key2bytes[i % key2bytes.length]);
  }
  return combined;
}

// ============================================================
// FLOW ANIMATION HELPERS
// ============================================================
function resetFlowSteps() {
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(`flow-step-${i}`);
    if (el) { el.classList.remove('active', 'done'); }
  }
}

async function activateStep(stepNum, durationMs = 800) {
  const el = document.getElementById(`flow-step-${stepNum}`);
  if (!el) return;
  el.classList.add('active');
  el.style.transition = 'border-color 0.3s, box-shadow 0.3s';
  el.style.borderColor = 'var(--purple)';
  el.style.boxShadow = '0 0 15px var(--purple)';
  await sleep(durationMs);
  el.style.borderColor = '';
  el.style.boxShadow = '';
  el.classList.remove('active');
  el.classList.add('done');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// MAIN HYBRID ENCRYPT FUNCTION
// ============================================================
async function runHybridEncrypt() {
  const btn = document.getElementById('encrypt-btn');
  const outputArea = document.getElementById('crypto-output-area');
  const metricsDiv = document.getElementById('crypto-metrics');
  const cipherDiv = document.getElementById('cipher-text-display');
  const decryptBtn = document.getElementById('decrypt-btn');
  const decryptResult = document.getElementById('decrypt-result');

  // Reset UI
  btn.disabled = true;
  btn.innerHTML = `<span style="display:inline-flex;align-items:center;gap:0.5rem">
    <svg class="spin-anim" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.2"/><path d="M21 12a9 9 0 00-9-9"/></svg>
    Encrypting...
  </span>`;
  resetFlowSteps();
  decryptResult.style.display = 'none';
  decryptBtn.style.display = 'none';
  metricsDiv.style.display = 'none';
  cipherDiv.style.display = 'none';

  const plaintext = document.getElementById('plaintext-input').value;
  const classicalAlgo = document.getElementById('classical-algo').value;
  const quantumAlgo = document.getElementById('quantum-algo').value;

  if (!plaintext.trim()) {
    alert('Please enter some plaintext to encrypt.');
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> Encrypt with Hybrid Wrapper`;
    return;
  }

  try {
    const startTime = performance.now();
    const encoder = new TextEncoder();
    const plaintextBytes = encoder.encode(plaintext);

    // ── STEP 1: Plaintext ──────────────────────────────────
    await activateStep(1, 600);

    // ── STEP 2: Generate AES-256-GCM key & encrypt data ───
    await activateStep(2, 0);
    aesKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      plaintextBytes
    );
    const rawAesKey = await crypto.subtle.exportKey('raw', aesKey);
    await sleep(700);
    const step2el = document.getElementById('flow-step-2');
    if (step2el) { step2el.classList.remove('active'); step2el.classList.add('done'); }

    // ── STEP 3: Classical key wrap (RSA-OAEP or simulated ECDH) ──
    await activateStep(3, 0);
    let classicalWrappedKey;
    let classicalKeyInfo;

    if (classicalAlgo === 'RSA-OAEP') {
      rsaKeyPair = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['wrapKey', 'unwrapKey']
      );
      classicalWrappedKey = await crypto.subtle.wrapKey(
        'raw',
        aesKey,
        rsaKeyPair.publicKey,
        { name: 'RSA-OAEP' }
      );
      classicalKeyInfo = `RSA-OAEP-2048: ${buf2hex(classicalWrappedKey).substring(0, 24)}...`;
    } else {
      // Simulate ECDH wrap
      const ecdhKey = generateKyberSimKey(256);
      classicalWrappedKey = ecdhKey.buffer;
      classicalKeyInfo = `ECDH-P256: ${buf2hex(classicalWrappedKey).substring(0, 24)}...`;
    }
    await sleep(900);
    const step3el = document.getElementById('flow-step-3');
    if (step3el) { step3el.classList.remove('active'); step3el.classList.add('done'); }

    // ── STEP 4: Quantum-safe key wrap (simulated Kyber) ───
    await activateStep(4, 0);
    const kyberBits = quantumAlgo === 'Kyber-1024' ? 1024 : 768;
    const kyberPublicKey = generateKyberSimKey(kyberBits);
    const kyberSecretKey = generateKyberSimKey(kyberBits);
    // Simulate Kyber encapsulation: shared secret = XOR of kyberPublicKey and AES key
    const aesKeyBytes = new Uint8Array(rawAesKey);
    const kyberCiphertext = new Uint8Array(kyberBits / 8);
    for (let i = 0; i < kyberCiphertext.length; i++) {
      kyberCiphertext[i] = (kyberPublicKey[i] ^ aesKeyBytes[i % 32]) ^ (Math.random() * 255 | 0);
    }
    const kyberKeyInfo = `${quantumAlgo}: ${buf2hex(kyberCiphertext.buffer).substring(0, 24)}...`;
    await sleep(800);
    const step4el = document.getElementById('flow-step-4');
    if (step4el) { step4el.classList.remove('active'); step4el.classList.add('done'); }

    // ── STEP 5: Assemble hybrid bundle ─────────────────────
    await activateStep(5, 600);

    const endTime = performance.now();
    const encryptionTime = (endTime - startTime).toFixed(1);

    // Store bundle for decryption
    encryptedBundle = {
      ciphertext: buf2base64(ciphertext),
      iv: buf2hex(iv),
      classicalWrappedKey: buf2hex(classicalWrappedKey),
      kyberCiphertext: buf2hex(kyberCiphertext),
      algo: classicalAlgo,
      quantumAlgo,
      originalText: plaintext,
    };

    // ── Render output ──────────────────────────────────────
    const combinedHex = [
      'QUANTUMSHIELD_HYBRID_V1',
      encryptedBundle.ciphertext,
      encryptedBundle.iv,
      encryptedBundle.classicalWrappedKey.substring(0, 64),
      encryptedBundle.kyberCiphertext.substring(0, 64),
      '...',
    ].join('\n');

    outputArea.innerHTML = '';
    cipherDiv.style.display = 'block';
    cipherDiv.textContent = '';
    let charIndex = 0;
    function typeChar() {
      if (charIndex < combinedHex.length) {
        cipherDiv.textContent += combinedHex.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 30);
      }
    }
    typeChar();

    metricsDiv.style.display = 'block';
    document.getElementById('metric-classical').textContent = classicalKeyInfo;
    document.getElementById('metric-quantum').textContent = kyberKeyInfo;
    document.getElementById('metric-aes').textContent = `${buf2hex(rawAesKey).substring(0, 24)}... (256-bit)`;
    document.getElementById('metric-size').textContent = `${ciphertext.byteLength + 256 + kyberBits / 8} bytes (hybrid bundle)`;
    document.getElementById('metric-time').textContent = `${encryptionTime} ms`;

    decryptBtn.style.display = 'flex';
    decryptBtn.disabled = false;

  } catch (err) {
    console.error('Encryption error:', err);
    outputArea.innerHTML = `<div style="color:var(--red);font-size:0.85rem;padding:1rem">Error: ${err.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> Encrypt with Hybrid Wrapper`;
  }
}

// ============================================================
// HYBRID DECRYPT FUNCTION
// ============================================================
async function runHybridDecrypt() {
  const btn = document.getElementById('decrypt-btn');
  const decryptResult = document.getElementById('decrypt-result');
  const decryptedDisplay = document.getElementById('decrypted-text-display');

  if (!encryptedBundle) return;

  btn.disabled = true;
  btn.innerHTML = '⏳ Decrypting...';

  try {
    await sleep(400);

    let recoveredAesKey;
    if (encryptedBundle.algo === 'RSA-OAEP' && rsaKeyPair) {
      // Real RSA-OAEP unwrap
      recoveredAesKey = await crypto.subtle.unwrapKey(
        'raw',
        hex2buf(encryptedBundle.classicalWrappedKey),
        rsaKeyPair.privateKey,
        { name: 'RSA-OAEP' },
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );
    } else {
      // Use stored aesKey (ECDH/simulation path)
      recoveredAesKey = aesKey;
    }

    await sleep(300);

    const iv = new Uint8Array(hex2buf(encryptedBundle.iv));
    const ciphertextBytes = base642buf(encryptedBundle.ciphertext);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      recoveredAesKey,
      ciphertextBytes
    );

    const decoder = new TextDecoder();
    const recoveredText = decoder.decode(decrypted);

    await sleep(200);

    decryptResult.style.display = 'flex';
    decryptedDisplay.textContent = recoveredText.substring(0, 100) + (recoveredText.length > 100 ? '...' : '');

    btn.innerHTML = '✅ Decrypted Successfully';
    btn.style.background = 'rgba(16,185,129,0.15)';
    btn.style.color = 'var(--green)';
    btn.style.borderColor = 'rgba(16,185,129,0.3)';

    // Pulse effect on result
    decryptResult.style.animation = 'none';
    decryptResult.offsetHeight;
    decryptResult.style.animation = 'fadeIn 0.5s ease';

    createConfetti();

  } catch (err) {
    console.error('Decryption error:', err);
    decryptResult.style.display = 'flex';
    decryptResult.style.background = 'rgba(239,68,68,0.1)';
    decryptResult.style.borderColor = 'rgba(239,68,68,0.3)';
    decryptedDisplay.textContent = `Decryption failed: ${err.message}`;
    btn.innerHTML = '❌ Decryption Failed';
    btn.disabled = false;
  }
}

function createConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 1) * 20,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      size: Math.random() * 8 + 4,
      life: 1.0
    });
  }
  
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    particles.forEach(p => {
      if (p.life > 0) {
        active = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // gravity
        p.life -= 0.02;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    if (active) {
      requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  }
  render();
}

// ============================================================
// CSS for spinner animation (inject dynamically)
// ============================================================
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin-anim { animation: spin 0.8s linear infinite; }
`;
document.head.appendChild(spinStyle);
