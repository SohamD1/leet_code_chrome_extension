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
 * Extract submission data from LeetCode page
 * @returns {Object} Submission data
 */
function extractSubmissionData() {
  console.log('Extracting submission data from page');

  // Extract problem slug from URL
  const urlMatch = window.location.href.match(/leetcode\.com\/problems\/([^\/]+)/);
  const problemSlug = urlMatch ? urlMatch[1] : 'unknown';

  // Try to find problem title
  let problemTitle = 'Unknown Problem';
  const titleElement = document.querySelector('[data-cy="question-title"]') ||
                       document.querySelector('a[href*="/problems/"]') ||
                       document.querySelector('.text-title-large');
  if (titleElement) {
    problemTitle = titleElement.textContent.trim();
    // Remove problem number if present (e.g., "1. Two Sum" -> "Two Sum")
    problemTitle = problemTitle.replace(/^\d+\.\s*/, '');
  }

  // Extract problem ID from title or URL
  let problemId = '0';
  const idMatch = window.location.href.match(/\/problems\/.*?\/submissions\/(\d+)/);
  if (idMatch) {
    problemId = idMatch[1];
  }

  // Try to find difficulty
  let difficulty = 'Medium';
  const difficultyElement = document.querySelector('[class*="diff"]') ||
                            document.querySelector('.text-difficulty-easy') ||
                            document.querySelector('.text-difficulty-medium') ||
                            document.querySelector('.text-difficulty-hard');
  if (difficultyElement) {
    const diffText = difficultyElement.textContent.toLowerCase();
    if (diffText.includes('easy')) difficulty = 'Easy';
    else if (diffText.includes('medium')) difficulty = 'Medium';
    else if (diffText.includes('hard')) difficulty = 'Hard';
  }

  // Try to extract code from various possible locations
  let code = '';
  const codeElement = document.querySelector('code[class*="language"]') ||
                      document.querySelector('pre') ||
                      document.querySelector('[class*="monaco-editor"]');
  if (codeElement) {
    code = codeElement.textContent || codeElement.innerText || '';
  }

  // Try to extract language
  let language = 'javascript';
  const languageElement = document.querySelector('[class*="lang"]') ||
                          document.querySelector('button[id*="lang"]');
  if (languageElement) {
    const langText = languageElement.textContent.toLowerCase();
    if (langText.includes('python')) language = 'python';
    else if (langText.includes('java')) language = 'java';
    else if (langText.includes('c++')) language = 'cpp';
    else if (langText.includes('javascript')) language = 'javascript';
    else if (langText.includes('typescript')) language = 'typescript';
    else if (langText.includes('go')) language = 'go';
    else if (langText.includes('rust')) language = 'rust';
  }

  // Try to extract status
  let status = 'Unknown';
  const statusElement = document.querySelector('[class*="accepted"]') ||
                        document.querySelector('[class*="Accepted"]') ||
                        document.querySelector('.text-green-500');
  if (statusElement) {
    status = 'Accepted';
  }

  // Try to extract runtime
  let runtime = 'N/A';
  const runtimeElement = document.querySelector('[class*="runtime"]');
  if (runtimeElement) {
    runtime = runtimeElement.textContent.trim();
  }

  // Try to extract memory
  let memory = 'N/A';
  const memoryElement = document.querySelector('[class*="memory"]');
  if (memoryElement) {
    memory = memoryElement.textContent.trim();
  }

  const submissionData = {
    problemTitle,
    problemId,
    problemSlug,
    difficulty,
    code,
    language,
    status,
    runtime,
    memory,
    timestamp: new Date().toISOString(),
    url: window.location.href
  };

  console.log('Extracted submission data:', submissionData);
  return submissionData;
}

/**
 * Handle trigger sync message from popup
 */
async function handleTriggerSync() {
  console.log('Trigger sync requested');

  try {
    // Extract submission data from the page
    const submissionData = extractSubmissionData();

    // Send to background script for syncing to GitHub
    const response = await chrome.runtime.sendMessage({
      type: 'SYNC_SUBMISSION',
      data: submissionData
    });

    if (response && response.success) {
      console.log('Sync request sent successfully:', response);
      return { message: 'Sync completed', result: response.result };
    } else {
      throw new Error(response?.error || 'Sync failed');
    }
  } catch (error) {
    console.error('Error in handleTriggerSync:', error);
    throw error;
  }
}

/**
 * Handle extract submission data request
 */
async function handleExtractSubmission() {
  console.log('Extract submission requested');

  try {
    const submissionData = extractSubmissionData();
    return submissionData;
  } catch (error) {
    console.error('Error extracting submission:', error);
    throw error;
  }
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
