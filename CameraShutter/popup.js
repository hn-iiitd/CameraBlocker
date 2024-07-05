// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('camera-toggle');
    const statusText = document.getElementById('camera-status');
  
    // Check the initial state and update the UI accordingly
    chrome.storage.sync.get('isCameraBlocked', data => {
      const isBlocked = data.isCameraBlocked !== undefined ? data.isCameraBlocked : false;
      toggle.checked = !isBlocked;
      statusText.textContent = isBlocked ? 'blocked' : 'allowed';
    });
  
    // Add event listener to the toggle button
    toggle.addEventListener('change', () => {
      const isBlocked = !toggle.checked;
      statusText.textContent = isBlocked ? 'blocked' : 'allowed';
  
      // Send message to background script to update camera access
      chrome.runtime.sendMessage({ toggleCamera: isBlocked }, response => {
        if (response && response.status === 'success') {
          // Update storage with the new state
          chrome.storage.sync.set({ isCameraBlocked: isBlocked });
        }
      });
    });
  });
  