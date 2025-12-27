/**
 * Background Service Worker for LeetCode to GitHub Sync Extension
 */

console.log('Background service worker loaded');

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  // Message handling will be implemented here
  sendResponse({ success: true });
});

// Extension installed/updated listener
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);

  if (details.reason === 'install') {
    // Set default settings on first install
    chrome.storage.sync.set({
      autoSync: false,
      fileStructure: 'by-difficulty',
      fileNaming: 'problem-name',
      githubBranch: 'main'
    });

    // Open options page on first install
    chrome.runtime.openOptionsPage();
  }
});
