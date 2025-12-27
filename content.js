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
 * Listen for messages from popup or background
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);

  // Message handling will be implemented here
  sendResponse({ success: true });
});

// Log current page type
if (isSubmissionPage()) {
  console.log('On submission page');
} else if (isProblemPage()) {
  console.log('On problem page');
}
