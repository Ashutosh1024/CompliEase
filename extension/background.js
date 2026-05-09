// CompliEase Portal Bridge — background.js (Service Worker)

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('[CompliEase] Portal Bridge installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_TOKEN') {
    chrome.storage.local.get('ce_token').then(s => sendResponse({ token: s.ce_token || null }));
    return true; // async
  }
  if (msg.type === 'PORTAL_DETECTED') {
    // Update badge to show portal is supported
    chrome.action.setBadgeText({ text: '✓', tabId: sender.tab?.id });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId: sender.tab?.id });
  }
});

// Clear badge when navigating away from gov portals
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const supportedDomains = [
      'udyamregistration.gov.in', 'startupindia.gov.in', 'gst.gov.in',
      'reg.gst.gov.in', 'return.gst.gov.in', 'foscos.fssai.gov.in',
      'kviconline.gov.in', 'gem.gov.in', 'mudra.org.in',
      'epfindia.gov.in', 'esic.in', 'incometax.gov.in'
    ];
    const isSupported = supportedDomains.some(d => tab.url?.includes(d));
    chrome.action.setBadgeText({ text: isSupported ? '●' : '', tabId });
    if (isSupported) chrome.action.setBadgeBackgroundColor({ color: '#5b5ef4', tabId });
  }
});
