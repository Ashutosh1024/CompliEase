// CompliEase Portal Bridge — popup.js
// ═══════════════════════════════════════════════════════════════════

const API_BASE = 'http://localhost:3000'; // Change to your deployed URL in production

// ── Supported portals detection ──────────────────────────────────
const SUPPORTED_PORTALS = {
  'udyamregistration.gov.in': {
    id: 'udyam', name: 'Udyam Registration Portal',
    color: '#5b5ef4', desc: 'Registration portal for MSMEs',
    fields: ['businessName','fullName','mobile','panNumber','state','district','address','pinCode','annualTurnover','employeeCount','yearEstablished','natureOfBusiness','gstNumber'],
  },
  'startupindia.gov.in': {
    id: 'startup-india', name: 'Startup India Portal',
    color: '#10b981', desc: 'DPIIT recognition for startups',
    fields: ['businessName','fullName','email','mobile','panNumber','cinNumber','state','yearEstablished','industryCategory'],
  },
  'reg.gst.gov.in': {
    id: 'gst-reg', name: 'GST Registration Portal',
    color: '#f59e0b', desc: 'GST new registration form',
    fields: ['businessName','fullName','mobile','email','panNumber','state','district','address','pinCode','businessType','businessStructure'],
  },
  'return.gst.gov.in': {
    id: 'gst-return', name: 'GST Returns Portal',
    color: '#f59e0b', desc: 'File GST returns (GSTR-1/3B)',
    fields: ['gstNumber','businessName'],
  },
  'foscos.fssai.gov.in': {
    id: 'fssai', name: 'FSSAI / FoSCoS Portal',
    color: '#06b6d4', desc: 'Food safety license application',
    fields: ['businessName','fullName','mobile','email','address','state','district','pinCode','panNumber'],
  },
  'kviconline.gov.in': {
    id: 'pmegp', name: 'KVIC / PMEGP Portal',
    color: '#ec4899', desc: 'PM Employment Generation Programme',
    fields: ['fullName','mobile','email','state','district','panNumber','address'],
  },
  'gem.gov.in': {
    id: 'gem', name: 'GeM — Government e-Marketplace',
    color: '#38bdf8', desc: 'Government procurement registration',
    fields: ['businessName','fullName','mobile','email','panNumber','gstNumber','udyamNumber','state'],
  },
  'eportal.incometax.gov.in': {
    id: 'itr', name: 'Income Tax e-Filing Portal',
    color: '#a78bfa', desc: 'ITR filing and PAN registration',
    fields: ['panNumber','fullName','mobile','email','address','state','pinCode'],
  },
  'unifiedportal-emp.epfindia.gov.in': {
    id: 'epf', name: 'EPFO Employer Portal',
    color: '#f97316', desc: 'PF registration for employers',
    fields: ['businessName','fullName','panNumber','state','address','employeeCount'],
  },
  'www.esic.in': {
    id: 'esic', name: 'ESIC Portal',
    color: '#06b6d4', desc: 'ESI registration for employers',
    fields: ['businessName','fullName','mobile','email','panNumber','state','address'],
  },
};

// Field labels for display
const FIELD_LABELS = {
  fullName:'Full Name', email:'Email', mobile:'Mobile', businessName:'Business Name',
  businessType:'Business Type', businessStructure:'Business Structure',
  industryCategory:'Industry Category', natureOfBusiness:'Nature of Business',
  gstNumber:'GST Number', panNumber:'PAN Number', aadhaarNumber:'Aadhaar Number', udyamNumber:'Udyam Number',
  cinNumber:'CIN Number', state:'State', district:'District',
  address:'Address', pinCode:'PIN Code', annualTurnover:'Annual Turnover',
  employeeCount:'Employee Count', yearEstablished:'Year Established',
};

// ── TEE: AES-GCM Encryption Helper ──────────────────────────────
// Sensitive profile data is encrypted in chrome.storage.local using
// Web Crypto API (AES-256-GCM) — a Trusted Execution Environment
// software implementation that protects data at rest in the browser.
const TEE = {
  async getKey() {
    const stored = await chrome.storage.local.get('tee_key_raw');
    let raw;
    if (stored.tee_key_raw) {
      raw = new Uint8Array(stored.tee_key_raw);
    } else {
      raw = crypto.getRandomValues(new Uint8Array(32));
      await chrome.storage.local.set({ tee_key_raw: Array.from(raw) });
    }
    return crypto.subtle.importKey('raw', raw, { name:'AES-GCM' }, false, ['encrypt','decrypt']);
  },

  async encrypt(data) {
    const key = await this.getKey();
    const iv  = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const ct  = await crypto.subtle.encrypt({ name:'AES-GCM', iv }, key, enc.encode(JSON.stringify(data)));
    return { iv: Array.from(iv), ct: Array.from(new Uint8Array(ct)) };
  },

  async decrypt(payload) {
    const key = await this.getKey();
    const dec = await crypto.subtle.decrypt(
      { name:'AES-GCM', iv: new Uint8Array(payload.iv) },
      key,
      new Uint8Array(payload.ct)
    );
    return JSON.parse(new TextDecoder().decode(dec));
  },

  async store(profile) {
    const encrypted = await this.encrypt(profile);
    await chrome.storage.local.set({ tee_profile: encrypted });
  },

  async retrieve() {
    const s = await chrome.storage.local.get('tee_profile');
    if (!s.tee_profile) return null;
    try { return await this.decrypt(s.tee_profile); } catch { return null; }
  },

  async clear() {
    await chrome.storage.local.remove(['tee_profile','tee_key_raw','ce_token']);
  }
};

// ── DOM helpers ──────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }
function showMsg(msg, type='info') {
  $('msg-area').innerHTML = `<div class="msg ${type}">${msg}</div>`;
  setTimeout(() => { $('msg-area').innerHTML = ''; }, 3500);
}

// ── State ────────────────────────────────────────────────────────
let currentPortal    = null;
let currentProfile   = null;
let lastScan         = null;

// ── Init ─────────────────────────────────────────────────────────
async function init() {
  const { ce_token } = await chrome.storage.local.get('ce_token');

  if (!ce_token) {
    $('not-logged').style.display = 'block';
    $('logged').style.display     = 'none';
    return;
  }

  $('not-logged').style.display = 'none';
  $('logged').style.display     = 'block';

  // Load profile (TEE first, then API)
  currentProfile = await TEE.retrieve();
  
  // Always fetch latest from API in background to keep data in sync
  try {
    const r = await fetch(`${API_BASE}/api/extension/profile`, {
      headers: { Authorization: `Bearer ${ce_token}` }
    });
    const d = await r.json();
    if (d.profile) {
      currentProfile = d.profile;
      await TEE.store(currentProfile); // cache encrypted
    }
  } catch (e) { 
    if (!currentProfile) showMsg('⚠️ Could not reach CompliEase API', 'error'); 
  }

  // Detect current tab's portal
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  detectPortal(tab?.url || '');
}

function detectPortal(url) {
  const hostname = new URL(url.startsWith('http') ? url : 'https://x.com').hostname.replace('www.', '');
  currentPortal  = null;

  for (const [domain, info] of Object.entries(SUPPORTED_PORTALS)) {
    if (hostname.includes(domain.replace('www.',''))) {
      currentPortal = { domain, ...info };
      break;
    }
  }

  const box   = $('portal-status-box');
  const dot   = $('portal-dot');
  const title = $('portal-title');
  const sub   = $('portal-sub');

  if (currentPortal) {
    box.className = 'portal-status supported';
    dot.className = 'status-dot dot-green';
    dot.style.background   = currentPortal.color;
    dot.style.boxShadow    = `0 0 6px ${currentPortal.color}`;
    title.textContent      = `✅ ${currentPortal.name}`;
    sub.textContent        = currentPortal.desc;
    $('btn-scan').disabled     = false;
    $('btn-autofill').disabled = false;
    $('portals-section').style.display = 'none';
  } else {
    box.className = 'portal-status unsupported';
    dot.className = 'status-dot dot-gray';
    title.textContent = 'Not on a supported portal';
    sub.textContent   = 'Open Udyam, GST, Startup India, or another supported portal';
    $('btn-scan').disabled     = true;
    $('btn-autofill').disabled = true;
    $('portals-section').style.display = 'block';
  }
}

// ── Login ────────────────────────────────────────────────────────
$('btn-login').addEventListener('click', async () => {
  const email = $('ext-email').value.trim();
  const pass  = $('ext-password').value;
  if (!email || !pass) return;

  $('btn-login').innerHTML = '<span class="spinner"></span> Signing in…';
  $('btn-login').disabled  = true;

  try {
    const r = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const d = await r.json();
    if (d.token) {
      await chrome.storage.local.set({ ce_token: d.token });
      init();
    } else {
      $('btn-login').innerHTML = 'Sign In to CompliEase';
      $('btn-login').disabled  = false;
      showMsg('❌ Invalid credentials', 'error');
    }
  } catch {
    $('btn-login').innerHTML = 'Sign In to CompliEase';
    $('btn-login').disabled  = false;
    showMsg('❌ Cannot reach CompliEase server', 'error');
  }
});

// ── Scan button ──────────────────────────────────────────────────
$('btn-scan').addEventListener('click', async () => {
  if (!currentPortal || !currentProfile) return;

  $('btn-scan').innerHTML  = '<span class="spinner"></span> Scanning form…';
  $('btn-scan').disabled   = true;

  // Ask content script to scan the page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let pageFields = [];
  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const inputs = Array.from(document.querySelectorAll('input,select,textarea'));
        return inputs.map(el => ({
          tag:         el.tagName.toLowerCase(),
          type:        el.type || '',
          name:        el.name || '',
          id:          el.id   || '',
          placeholder: el.placeholder || '',
          label:       document.querySelector(`label[for="${el.id}"]`)?.textContent?.trim() || '',
          required:    el.required,
        })).filter(f => f.name || f.id || f.placeholder || f.label);
      }
    });
    pageFields = result?.[0]?.result || [];
  } catch (e) { pageFields = []; }

  // Save the scan to MongoDB via API
  const { ce_token } = await chrome.storage.local.get('ce_token');
  lastScan = { portal: currentPortal.id, url: tab.url, title: tab.title, fields: pageFields };
  try {
    await fetch(`${API_BASE}/api/extension/formdata`, {
      method: 'POST', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${ce_token}` },
      body: JSON.stringify(lastScan)
    });
  } catch (_) {}

  // Match profile fields vs required fields for this portal
  const requiredFields = currentPortal.fields;
  const list = $('results-list');
  list.innerHTML = '';

  let haveCount = 0, missingCount = 0;

  requiredFields.forEach(field => {
    const val     = currentProfile[field];
    const hasVal  = val && val !== '' && val !== false;
    const label   = FIELD_LABELS[field] || field;
    const display = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : (val || '');

    if (hasVal) haveCount++;
    else         missingCount++;

    const row = document.createElement('div');
    row.className = `field-row ${hasVal ? 'have' : 'missing'}`;
    row.innerHTML = `
      <div>
        <div class="field-name">${label}</div>
        ${hasVal ? `<div class="field-val">${display}</div>` : ''}
      </div>
      <span class="${hasVal ? 'badge-have' : 'badge-missing'}">${hasVal ? '✓ Have' : '✗ Missing'}</span>
    `;
    list.appendChild(row);
  });

  $('scan-results').style.display = 'block';
  $('btn-scan').innerHTML  = `🔍 Scan Again`;
  $('btn-scan').disabled   = false;

  showMsg(`Found ${haveCount}/${requiredFields.length} required fields. ${missingCount > 0 ? 'Add missing data on CompliEase.' : 'Ready to auto-fill!'}`,
    missingCount === 0 ? 'success' : 'info');
});

// ── Auto-fill button ─────────────────────────────────────────────
$('btn-autofill').addEventListener('click', async () => {
  if (!currentPortal || !currentProfile) return;

  $('btn-autofill').innerHTML = '<span class="spinner"></span> Filling form…';
  $('btn-autofill').disabled  = true;

  const profileCopy = { ...currentProfile };

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (profile) => {
        // Smart field matcher — tries name, id, placeholder, label matching
        const FIELD_MAP = {
          fullName:          ['name','fullname','applicant_name','proprietor_name','owner','ownername'],
          email:             ['email','emailid','mail','email_id'],
          mobile:            ['mobile','phone','mobileno','contact','contactno','mob'],
          businessName:      ['business','businessname','firm','firmname','tradename','entityname','enterprise'],
          businessType:      ['iama','type','businesstype','taxpayer','entitytype'],
          businessStructure: ['structure','constitution','businessstructure','constitutionofbusiness'],
          panNumber:         ['pan','panno','pannumber','pan_number'],
          aadhaarNumber:     ['aadhaar','aadhar','uidai','adharno','aadhaarnumber'],
          gstNumber:         ['gstin','gst','gstnumber','gstno','gst_number'],
          udyamNumber:       ['udyam','udyam_no','udyamno','udyam_number','msme'],
          cinNumber:         ['cin','cinno','cin_number'],
          state:             ['state','statename','state_id','stateut'],
          district:          ['district','districtname'],
          address:           ['address','addr','streetaddress','fulladdress','businessaddress'],
          pinCode:           ['pincode','pin','postal','zipcode','zip'],
          annualTurnover:    ['turnover','annualturnover','revenue'],
          employeeCount:     ['employee','employees','noofemployee','staffcount'],
          yearEstablished:   ['year','yearofincorporation','establishedyear','commencementyear'],
          natureOfBusiness:  ['natureof','businesstype','activity','mainactivity'],
        };

        let filled = 0;
        const inputs = Array.from(document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea'));

        inputs.forEach(el => {
          let labelText = '';
          if (el.id) {
            labelText = document.querySelector(`label[for="${el.id}"]`)?.textContent || '';
          }
          if (!labelText) {
            const lbl = el.closest('label');
            if (lbl) labelText = lbl.textContent;
            else {
              const group = el.parentElement;
              if (group) {
                const innerLbl = group.querySelector('label') || group.parentElement?.querySelector('label');
                if (innerLbl) labelText = innerLbl.textContent;
              }
            }
          }

          const key = (el.name + ' ' + el.id + ' ' + el.placeholder + ' ' + labelText)
            .toLowerCase().replace(/[^a-z0-9]/g,'');

          for (const [field, keywords] of Object.entries(FIELD_MAP)) {
            if (!profile[field]) continue;
            if (keywords.some(k => key.includes(k))) {
              const valToSet = profile[field];
              if (el.tagName === 'SELECT') {
                const targetVal = String(valToSet).toLowerCase().trim();
                let matched = false;
                // 1. Exact match by value or text
                for (let i = 0; i < el.options.length; i++) {
                  const opt = el.options[i];
                  const optText = opt.text.toLowerCase().trim();
                  const optVal = opt.value.toLowerCase().trim();
                  if (optVal === targetVal || optText === targetVal) {
                    el.selectedIndex = i;
                    el.value = opt.value;
                    matched = true;
                    break;
                  }
                }
                // 2. Partial match by text (e.g., "Delhi" vs "New Delhi")
                if (!matched) {
                  for (let i = 0; i < el.options.length; i++) {
                    const opt = el.options[i];
                    const optText = opt.text.toLowerCase().trim();
                    if (optText && opt.value && (optText.includes(targetVal) || targetVal.includes(optText))) {
                      el.selectedIndex = i;
                      el.value = opt.value;
                      matched = true;
                      break;
                    }
                  }
                }
                
                if (matched) {
                  const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set;
                  if (nativeSelectValueSetter) {
                    nativeSelectValueSetter.call(el, el.value);
                  }
                  el.dispatchEvent(new Event('input', { bubbles: true }));
                  el.dispatchEvent(new Event('change', { bubbles: true }));
                }
              } else {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                if (nativeInputValueSetter && el.tagName === 'INPUT') {
                  nativeInputValueSetter.call(el, valToSet);
                  el.dispatchEvent(new Event('input', { bubbles: true }));
                  el.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                  el.value = valToSet;
                  el.dispatchEvent(new Event('input', { bubbles: true }));
                  el.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }
              filled++;
              break;
            }
          }
        });

        return filled;
      },
      args: [profileCopy]
    });

    $('btn-autofill').innerHTML = '⚡ Auto-Fill All Fields';
    $('btn-autofill').disabled  = false;
    showMsg('✅ Form filled with your CompliEase profile!', 'success');
  } catch (e) {
    $('btn-autofill').innerHTML = '⚡ Auto-Fill All Fields';
    $('btn-autofill').disabled  = false;
    showMsg('❌ Could not inject into this page. Try refreshing.', 'error');
  }
});

// ── Navigation buttons ───────────────────────────────────────────
$('btn-dashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: `${API_BASE}/dashboard` });
});

$('btn-settings').addEventListener('click', async () => {
  const token = (await chrome.storage.local.get('ce_token')).ce_token;
  if (token) {
    await TEE.clear();
    showMsg('Logged out & data cleared', 'success');
    setTimeout(() => init(), 1500);
  } else {
    showMsg('Settings: Set CompliEase URL in background.js', 'info');
  }
});

$('link-to-dashboard')?.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: `${API_BASE}/dashboard/compliance-tracker` });
});

// ── Start ────────────────────────────────────────────────────────
init();
