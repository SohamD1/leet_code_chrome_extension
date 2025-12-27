/**
 * Options/Settings script for LeetCode to GitHub Sync Extension
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupEventListeners();
});

/**
 * Load saved settings from storage
 */
async function loadSettings() {
  try {
    const settings = await chrome.storage.sync.get([
      'githubToken',
      'githubOwner',
      'githubRepo',
      'githubBranch',
      'autoSync',
      'fileStructure',
      'fileNaming'
    ]);

    // Populate form fields with saved values
    document.getElementById('github-token').value = settings.githubToken || '';
    document.getElementById('github-owner').value = settings.githubOwner || '';
    document.getElementById('github-repo').value = settings.githubRepo || '';
    document.getElementById('github-branch').value = settings.githubBranch || 'main';
    document.getElementById('auto-sync').checked = settings.autoSync || false;
    document.getElementById('file-structure').value = settings.fileStructure || 'by-difficulty';
    document.getElementById('file-naming').value = settings.fileNaming || 'problem-name';

    console.log('Settings loaded successfully');
  } catch (error) {
    console.error('Error loading settings:', error);
    showMessage('Error loading settings: ' + error.message, 'error');
  }
}

/**
 * Setup event listeners for form
 */
function setupEventListeners() {
  // Form submission
  document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSettings();
  });

  // Test connection button
  document.getElementById('test-btn').addEventListener('click', async () => {
    await handleTestConnection();
  });

  // Reset button
  document.getElementById('reset-btn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      await handleResetSettings();
    }
  });
}

/**
 * Save settings to storage
 */
async function saveSettings() {
  try {
    const settings = {
      githubToken: document.getElementById('github-token').value.trim(),
      githubOwner: document.getElementById('github-owner').value.trim(),
      githubRepo: document.getElementById('github-repo').value.trim(),
      githubBranch: document.getElementById('github-branch').value.trim() || 'main',
      autoSync: document.getElementById('auto-sync').checked,
      fileStructure: document.getElementById('file-structure').value,
      fileNaming: document.getElementById('file-naming').value
    };

    // Basic validation
    if (!settings.githubToken || !settings.githubOwner || !settings.githubRepo) {
      showMessage('Please fill in all required fields (marked with *)', 'error');
      return;
    }

    // Save to chrome.storage.sync
    await chrome.storage.sync.set(settings);

    console.log('Settings saved successfully:', settings);
    showMessage('Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showMessage('Error saving settings: ' + error.message, 'error');
  }
}

/**
 * Test GitHub connection
 */
async function handleTestConnection() {
  const testBtn = document.getElementById('test-btn');
  testBtn.disabled = true;
  testBtn.textContent = 'Testing...';

  try {
    // First save current settings
    await saveSettings();

    // Send message to background script to test connection
    const response = await chrome.runtime.sendMessage({
      type: 'TEST_GITHUB_CONNECTION'
    });

    if (response && response.success) {
      showMessage('GitHub connection test successful!', 'success');
    } else {
      showMessage('Connection test failed: ' + (response?.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Error testing connection:', error);
    showMessage('Error: ' + error.message, 'error');
  } finally {
    testBtn.disabled = false;
    testBtn.textContent = 'Test Connection';
  }
}

/**
 * Reset settings to defaults
 */
async function handleResetSettings() {
  try {
    // Clear all settings
    await chrome.storage.sync.clear();

    // Set default values
    await chrome.storage.sync.set({
      githubBranch: 'main',
      autoSync: false,
      fileStructure: 'by-difficulty',
      fileNaming: 'problem-name'
    });

    // Reload form with defaults
    await loadSettings();

    showMessage('Settings reset to defaults', 'success');
  } catch (error) {
    console.error('Error resetting settings:', error);
    showMessage('Error resetting settings: ' + error.message, 'error');
  }
}

/**
 * Show message to user
 */
function showMessage(message, type = 'info') {
  const messageArea = document.getElementById('message-area');
  const messageText = document.getElementById('message-text');

  messageText.textContent = message;
  messageArea.className = `message-area message-${type}`;
  messageArea.classList.remove('hidden');

  // Hide after 5 seconds
  setTimeout(() => {
    messageArea.classList.add('hidden');
  }, 5000);
}
