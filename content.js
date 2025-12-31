/**
 * Content Script for LeetCode to GitHub Sync Extension
 * Runs on LeetCode pages to detect and extract submission data
 */

console.log('LeetCode to GitHub Sync: Content script loaded');

/**
 * Detect if we're on a submission details page
 */
function isSubmissionPage() {
  return window.location.href.includes('/submissions/detail/');
}

/**
 * Detect if we're on a problem page
 */
function isProblemPage() {
  return window.location.href.match(/leetcode\.com\/problems\/[^\/]+\/?$/);
}

/**
 * Initialize page-specific features based on current URL
 */
function initializePage() {
  console.log('Initializing page:', window.location.href);

  if (isSubmissionPage()) {
    console.log('On submission details page');
    // TODO: Add sync button, extract data, etc.
  } else if (isProblemPage()) {
    console.log('On problem page');
    // TODO: Add any problem page specific features
  }
}

/**
 * Monitor URL changes for SPA navigation
 * LeetCode uses client-side routing, so we need to detect URL changes
 */
function observePageChanges() {
  let lastUrl = window.location.href;

  // Use MutationObserver to detect DOM changes that indicate navigation
  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;

    // Check if URL has changed
    if (currentUrl !== lastUrl) {
      console.log('Page navigation detected:', lastUrl, '->', currentUrl);
      lastUrl = currentUrl;
      onPageChange();
    }
  });

  // Observe the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('Page change observer started');
}

/**
 * Handle page navigation events
 */
function onPageChange() {
  console.log('Handling page change');

  // Wait a bit for the page to load before initializing
  setTimeout(() => {
    initializePage();
  }, 1000);
}

/**
 * Listen for messages from popup or background
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);

  switch (message.type) {
    case 'TRIGGER_SYNC':
      handleTriggerSync()
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep channel open for async response

    case 'EXTRACT_SUBMISSION':
      handleExtractSubmission()
        .then(data => sendResponse({ success: true, data }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep channel open for async response

    default:
      sendResponse({ success: false, error: 'Unknown message type' });
      return false;
  }
});

/**
 * Handle trigger sync message from popup
 */
async function handleTriggerSync() {
  console.log('Trigger sync requested');

  // TODO: Extract submission data and send to background
  // This will be implemented in later commits

  return { message: 'Sync triggered' };
}

/**
 * Handle extract submission data request
 */
async function handleExtractSubmission() {
  console.log('Extract submission requested');

  // TODO: Extract actual submission data from DOM
  // This will be implemented in later commits

  return { message: 'Extraction not yet implemented' };
}

// Initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    observePageChanges();
  });
} else {
  // DOM already loaded
  initializePage();
  observePageChanges();
}
