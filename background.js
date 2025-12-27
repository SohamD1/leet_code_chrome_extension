/**
 * Background Service Worker for LeetCode to GitHub Sync Extension
 */

console.log('Background service worker loaded');

// Message type constants
const MessageTypes = {
  SYNC_SUBMISSION: 'SYNC_SUBMISSION',
  TEST_GITHUB_CONNECTION: 'TEST_GITHUB_CONNECTION'
};

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  // Handle different message types
  switch (message.type) {
    case MessageTypes.SYNC_SUBMISSION:
      handleSyncSubmission(message.data)
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep message channel open for async response

    case MessageTypes.TEST_GITHUB_CONNECTION:
      handleTestGitHubConnection()
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep message channel open for async response

    default:
      console.warn('Unknown message type:', message.type);
      sendResponse({ success: false, error: 'Unknown message type' });
      return false;
  }
});

/**
 * Handle syncing a submission to GitHub
 * @param {Object} submissionData - The submission data from LeetCode
 * @returns {Promise<Object>}
 */
async function handleSyncSubmission(submissionData) {
  console.log('Handling sync submission:', submissionData);

  try {
    // Get settings from storage
    const settings = await chrome.storage.sync.get([
      'githubToken',
      'githubRepo',
      'githubOwner',
      'githubBranch'
    ]);

    // Validate settings
    if (!settings.githubToken || !settings.githubRepo || !settings.githubOwner) {
      throw new Error('GitHub settings not configured. Please configure in options.');
    }

    // TODO: Implement actual GitHub sync logic
    // This will be implemented in later commits

    return {
      message: 'Sync submission handler called',
      data: submissionData
    };
  } catch (error) {
    console.error('Error in handleSyncSubmission:', error);
    throw error;
  }
}

/**
 * Test GitHub API connection
 * @returns {Promise<Object>}
 */
async function handleTestGitHubConnection() {
  console.log('Testing GitHub connection');

  try {
    // Get settings from storage
    const settings = await chrome.storage.sync.get([
      'githubToken',
      'githubOwner'
    ]);

    // Validate settings
    if (!settings.githubToken) {
      throw new Error('GitHub token not configured');
    }

    // TODO: Implement actual GitHub API test
    // This will be implemented in later commits

    return {
      message: 'GitHub connection test handler called',
      configured: !!settings.githubToken
    };
  } catch (error) {
    console.error('Error in handleTestGitHubConnection:', error);
    throw error;
  }
}

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
