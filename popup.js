/**
 * Popup script for LeetCode to GitHub Sync Extension
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadStatus();
  setupEventListeners();
});

/**
 * Load and display current status
 */
async function loadStatus() {
  try {
    // Get settings from storage
    const settings = await chrome.storage.sync.get([
      'githubToken',
      'githubRepo',
      'githubOwner',
      'autoSync'
    ]);

    // Update connection status
    const connectionStatus = document.getElementById('connection-status');
    if (settings.githubToken && settings.githubRepo && settings.githubOwner) {
      connectionStatus.textContent = 'Connected';
      connectionStatus.classList.remove('status-disconnected');
      connectionStatus.classList.add('status-connected');
    } else {
      connectionStatus.textContent = 'Not configured';
      connectionStatus.classList.remove('status-connected');
      connectionStatus.classList.add('status-disconnected');
    }

    // Update auto-sync status
    const autosyncStatus = document.getElementById('autosync-status');
    autosyncStatus.textContent = settings.autoSync ? 'Enabled' : 'Disabled';

    console.log('Status loaded successfully');
  } catch (error) {
    console.error('Error loading status:', error);
    showMessage('Error loading status: ' + error.message, 'error');
  }
}

/**
 * Setup event listeners for buttons
 */
function setupEventListeners() {
  // Sync current submission button
  document.getElementById('sync-current-btn').addEventListener('click', async () => {
    await handleSyncCurrent();
  });

  // Open options button
  document.getElementById('open-options-btn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

/**
 * Handle sync current submission
 */
async function handleSyncCurrent() {
  const btn = document.getElementById('sync-current-btn');
  btn.disabled = true;
  btn.textContent = 'Syncing...';

  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || !tab.url.includes('leetcode.com')) {
      showMessage('Please navigate to a LeetCode page', 'error');
      return;
    }

    // Send message to content script to trigger sync
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'TRIGGER_SYNC'
    });

    if (response && response.success) {
      showMessage('Sync initiated successfully!', 'success');
    } else {
      showMessage('Sync failed: ' + (response?.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Error during sync:', error);
    showMessage('Error: ' + error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sync Current Submission';
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
