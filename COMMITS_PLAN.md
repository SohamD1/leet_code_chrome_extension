# LeetCode to GitHub Sync - 20 Commit Plan

## Commit 1: Initialize project with basic manifest
**Message**: `feat: add basic manifest.json for Chrome extension`
**Changes**:
- Create manifest.json with basic metadata
- Set up Manifest V3 structure
- Add minimal permissions (storage only)
- No action, no background worker, no content scripts yet

---

## Commit 2: Add project documentation and gitignore
**Message**: `docs: add README and .gitignore`
**Changes**:
- Create README.md with project overview
- Add .gitignore for common files
- Create icons/ directory placeholder

---

## Commit 3: Create popup HTML structure
**Message**: `feat: add popup HTML structure`
**Changes**:
- Create popup.html with basic structure
- Add status section placeholder
- Add sync button placeholder
- Add settings link
- Update manifest to include popup action

---

## Commit 4: Add basic CSS styling
**Message**: `style: add CSS for popup and base styles`
**Changes**:
- Create styles.css
- Add variables for colors
- Style popup layout
- Add button styles
- Link CSS to popup.html

---

## Commit 5: Create options page HTML
**Message**: `feat: add options/settings page HTML`
**Changes**:
- Create options.html
- Add form fields for GitHub config (token, owner, repo, branch)
- Add sync options section
- Update manifest to include options_page

---

## Commit 6: Style options page
**Message**: `style: add styling for options page`
**Changes**:
- Add options page specific styles to styles.css
- Style form inputs
- Add form validation styles
- Style buttons and sections

---

## Commit 7: Create background service worker skeleton
**Message**: `feat: add background service worker skeleton`
**Changes**:
- Create background.js
- Add basic message listener structure
- Add onInstalled listener
- Update manifest to include background service worker
- Add console.log for debugging

---

## Commit 8: Add content script skeleton
**Message**: `feat: add content script for LeetCode pages`
**Changes**:
- Create content.js
- Add page detection functions (isSubmissionPage, isProblemPage)
- Add console.log for debugging
- Update manifest to inject content script on LeetCode pages
- Add host_permissions for leetcode.com

---

## Commit 9: Implement options page JavaScript - save settings
**Message**: `feat: implement settings save and load functionality`
**Changes**:
- Create options.js
- Add loadSettings() function
- Add saveSettings() function using chrome.storage.sync
- Add form submission handler
- Add basic validation
- Link script to options.html

---

## Commit 10: Add settings reset and test connection UI
**Message**: `feat: add reset settings and test connection buttons`
**Changes**:
- Add reset button handler in options.js
- Add test connection button handler (placeholder)
- Add showMessage() helper function for user feedback
- Add message area styling

---

## Commit 11: Create popup JavaScript - display status
**Message**: `feat: implement popup status display`
**Changes**:
- Create popup.js
- Add loadStatus() to read settings from storage
- Display connection status (configured/not configured)
- Display auto-sync status
- Add event listeners for buttons
- Link script to popup.html

---

## Commit 12: Implement message passing infrastructure
**Message**: `feat: add message passing between components`
**Changes**:
- Add message types enum/constants
- Implement message handler in background.js for SYNC_SUBMISSION
- Implement message handler for TEST_GITHUB_CONNECTION
- Add sendResponse patterns
- Add error handling for messages

---

## Commit 13: Add LeetCode page detection and monitoring
**Message**: `feat: detect LeetCode pages and monitor navigation`
**Changes**:
- Implement MutationObserver in content.js for SPA navigation
- Add URL change detection
- Add page-specific initialization
- Add message listener in content script

---

## Commit 14: Extract submission data from LeetCode DOM
**Message**: `feat: extract submission data from LeetCode pages`
**Changes**:
- Implement extractSubmissionData() function
- Query DOM for problem title, ID, difficulty
- Extract code from code editor
- Extract language, status, runtime, memory
- Add error handling for missing elements

---

## Commit 15: Implement GitHub API helper functions
**Message**: `feat: add GitHub API integration functions`
**Changes**:
- Implement githubAPIRequest() helper in background.js
- Add getFileContent() function (check if file exists)
- Add createOrUpdateFile() function
- Add proper error handling
- Add authorization headers
- Update host_permissions for api.github.com

---

## Commit 16: Implement file path generation logic
**Message**: `feat: add file organization and naming logic`
**Changes**:
- Add generateFilePath() function in background.js
- Implement by-difficulty organization
- Implement by-topic organization
- Implement by-id organization
- Implement different naming conventions
- Add file extension mapping for languages

---

## Commit 17: Implement commit message templating
**Message**: `feat: add commit message template system`
**Changes**:
- Add generateCommitMessage() function
- Support template variables: {problem}, {difficulty}, {id}, {language}, {status}
- Add default templates
- Add timestamp to commit messages

---

## Commit 18: Complete sync submission to GitHub flow
**Message**: `feat: implement full sync submission workflow`
**Changes**:
- Complete handleSyncSubmission() in background.js
- Check if file exists (avoid duplicates or update)
- Create/update file on GitHub
- Add code comments with problem details if enabled
- Add success/error responses
- Update popup.js to handle sync button clicks properly

---

## Commit 19: Add auto-sync functionality
**Message**: `feat: implement automatic sync on submission`
**Changes**:
- Add submission detection in content.js
- Watch for "Success" status on submission page
- Automatically trigger sync when autoSync is enabled
- Add notification/toast in LeetCode UI
- Add debouncing to avoid duplicate syncs

---

## Commit 20: Add statistics tracking and UI polish
**Message**: `feat: add sync statistics and final polish`
**Changes**:
- Track syncedToday and syncedTotal in storage
- Display stats in popup
- Reset daily stats at midnight
- Add lastSyncDate tracking
- Add README generation option
- Test GitHub connection implementation
- Add loading states to buttons
- Final UI polish and error messages

---

## Summary

**Commits 1-6**: Project setup and UI structure (HTML/CSS)
**Commits 7-8**: Extension infrastructure (background/content scripts)
**Commits 9-12**: Settings and communication infrastructure
**Commits 13-14**: LeetCode integration and data extraction
**Commits 15-18**: GitHub integration and sync logic
**Commits 19-20**: Auto-sync and polish

---

## Notes

- Each commit should be functional and not break the extension
- Test after each commit by loading unpacked extension
- Commits build on each other sequentially
- Can be adjusted based on your needs
