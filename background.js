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
 * Make a request to GitHub API
 * @param {string} endpoint - API endpoint (e.g., '/repos/owner/repo/contents/path')
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>}
 */
async function githubAPIRequest(endpoint, options = {}) {
  const settings = await chrome.storage.sync.get(['githubToken']);

  if (!settings.githubToken) {
    throw new Error('GitHub token not configured');
  }

  const url = `https://api.github.com${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${settings.githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    let errorMessage = `GitHub API error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Get file content from GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - File path
 * @param {string} branch - Branch name
 * @returns {Promise<Object|null>} File data or null if not found
 */
async function getFileContent(owner, repo, path, branch = 'main') {
  try {
    console.log(`Getting file: ${owner}/${repo}/${path} on ${branch}`);

    const endpoint = `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const data = await githubAPIRequest(endpoint);

    return data;
  } catch (error) {
    // If file doesn't exist, return null
    if (error.message.includes('404')) {
      console.log('File not found:', path);
      return null;
    }
    throw error;
  }
}

/**
 * Create or update a file in GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - File path
 * @param {string} content - File content (will be base64 encoded)
 * @param {string} message - Commit message
 * @param {string} branch - Branch name
 * @param {string|null} sha - File SHA (required for updates)
 * @returns {Promise<Object>}
 */
async function createOrUpdateFile(owner, repo, path, content, message, branch = 'main', sha = null) {
  console.log(`Creating/updating file: ${owner}/${repo}/${path}`);

  const endpoint = `/repos/${owner}/${repo}/contents/${path}`;

  // Base64 encode the content
  const encodedContent = btoa(unescape(encodeURIComponent(content)));

  const body = {
    message,
    content: encodedContent,
    branch
  };

  // If SHA is provided, this is an update
  if (sha) {
    body.sha = sha;
  }

  const data = await githubAPIRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body)
  });

  return data;
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
      'githubOwner',
      'githubRepo'
    ]);

    // Validate settings
    if (!settings.githubToken) {
      throw new Error('GitHub token not configured');
    }

    if (!settings.githubOwner || !settings.githubRepo) {
      throw new Error('GitHub owner and repository must be configured');
    }

    // Test API connection by getting repository info
    const endpoint = `/repos/${settings.githubOwner}/${settings.githubRepo}`;
    const repoData = await githubAPIRequest(endpoint);

    return {
      message: 'Successfully connected to GitHub',
      repository: repoData.full_name,
      private: repoData.private
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
