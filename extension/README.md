# CompliEase Portal Bridge — Chrome Extension

## How to Install

1. Open Chrome → go to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select this `extension/` folder
5. The CompliEase icon will appear in your Chrome toolbar

## How to Use

### Step 1 — Sign In
- Click the CompliEase icon
- Enter your CompliEase email and password
- Your profile is loaded and **AES-256 encrypted locally** (TEE protection)

### Step 2 — Visit a Government Portal
Supported portals (extension auto-detects):
| Portal | URL |
|--------|-----|
| Udyam Registration | udyamregistration.gov.in |
| Startup India | startupindia.gov.in |
| GST Registration | reg.gst.gov.in |
| GST Returns | return.gst.gov.in |
| FSSAI / FoSCoS | foscos.fssai.gov.in |
| KVIC / PMEGP | kviconline.gov.in |
| GeM | gem.gov.in |
| Income Tax e-Portal | eportal.incometax.gov.in |
| EPFO | unifiedportal-emp.epfindia.gov.in |
| ESIC | www.esic.in |

### Step 3 — Scan Form (Button 1)
- Click **"🔍 Scan Form — Check My Data"**
- The extension scans all form fields on the page
- Shows which required data you **HAVE** ✓ and which is **MISSING** ✗
- Saves the scan to your CompliEase database
- Click **"Add them on CompliEase →"** to fill in missing details

### Step 4 — Auto-Fill (Button 2)
- Once you have all the data, click **"⚡ Auto-Fill All Fields"**
- The extension intelligently matches your profile to every form field
- Works with React/Angular/jQuery forms using native event dispatching

## Security — TEE (Trusted Execution Environment)

Your profile data is protected by a **software TEE** using:
- **AES-256-GCM** encryption via Web Crypto API
- Random 256-bit key generated per device, stored in chrome.storage.local
- Profile data is never stored in plaintext — always encrypted at rest
- All API calls use your **JWT Bearer token** (30-day expiry)
- Extension never stores your password

## Data Storage in CompliEase MongoDB

Every form scan is saved to the `formscans` collection:
```json
{
  "userId": "...",
  "portal": "udyam",
  "url": "https://udyamregistration.gov.in/...",
  "title": "Udyam Registration",
  "fields": [{ "name": "...", "id": "...", "placeholder": "..." }],
  "updatedAt": "2025-05-10T..."
}
```
Next time you visit the same portal, your data is pre-loaded from the database.

## For Production

Change `API_BASE` in `popup.js` from `http://localhost:3000` to your deployed URL:
```js
const API_BASE = 'https://your-compliease-domain.com';
```
