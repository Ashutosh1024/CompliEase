// CompliEase Portal Bridge — content.js
// Runs on supported government portals

const SUPPORTED_DOMAINS = [
  'udyamregistration.gov.in', 'startupindia.gov.in',
  'reg.gst.gov.in', 'return.gst.gov.in', 'gst.gov.in',
  'foscos.fssai.gov.in', 'kviconline.gov.in', 'gem.gov.in',
  'mudra.org.in', 'epfindia.gov.in', 'esic.in', 'incometax.gov.in'
];

const currentHost = location.hostname.replace('www.', '');
const isSupported = SUPPORTED_DOMAINS.some(d => currentHost.includes(d.replace('www.','')));

if (isSupported) {
  // Notify background script that we're on a supported portal
  chrome.runtime.sendMessage({ type: 'PORTAL_DETECTED', host: currentHost });

  // Show a subtle banner at the bottom of the page
  const banner = document.createElement('div');
  banner.id = 'compliease-banner';
  banner.style.cssText = `
    position: fixed; bottom: 16px; right: 16px; z-index: 999999;
    background: linear-gradient(135deg, #0b0f1e, #1a1040);
    border: 1px solid rgba(91,94,244,0.5);
    border-radius: 12px; padding: 10px 16px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 4px 24px rgba(91,94,244,0.3);
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 13px; color: #e8ecf8;
    cursor: pointer;
    animation: ceSlideIn 0.4s ease;
  `;
  banner.innerHTML = `
    <div style="width:28px;height:28px;background:linear-gradient(135deg,#5b5ef4,#7c3aed);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">🛡️</div>
    <div>
      <div style="font-weight:700;font-size:12px;color:#fff;">CompliEase Detected</div>
      <div style="font-size:11px;color:#8494bc;">Click extension icon to auto-fill</div>
    </div>
    <div id="ce-banner-close" style="margin-left:6px;color:#3e4f72;font-size:16px;font-weight:700;cursor:pointer;padding:0 4px;">×</div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes ceSlideIn {
      from { transform: translateX(120px); opacity: 0; }
      to   { transform: translateX(0);     opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(banner);

  document.getElementById('ce-banner-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    banner.style.display = 'none';
  });

  // Auto-dismiss after 5 seconds
  setTimeout(() => { if (banner) banner.style.display = 'none'; }, 5000);
}
