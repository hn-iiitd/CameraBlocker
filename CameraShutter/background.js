// background.js

// Initialize the camera state to allow by default
let isCameraBlocked = false;

// Function to set camera access
function setCameraAccess(block) {
  if (block) {
    // Block camera access
    chrome.contentSettings.camera.set({
      primaryPattern: "<all_urls>",
      setting: "block"
    }, () => {
      console.log('Camera access is blocked for all websites');
      isCameraBlocked = true;
    });
  } else {
    // Clear camera block setting (which allows the camera)
    chrome.contentSettings.camera.clear({
      scope: "regular"
    }, () => {
      console.log('Camera access is allowed for all websites');
      isCameraBlocked = false;
    });
  }
}

// Listen for messages from the popup to toggle camera access
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.toggleCamera !== undefined) {
    setCameraAccess(request.toggleCamera);
    sendResponse({ status: "success", cameraBlocked: request.toggleCamera });
  }
});

// Set the initial camera access when the extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
  console.log('Camera Blocker Extension Installed');
  chrome.storage.sync.get('isCameraBlocked', data => {
    setCameraAccess(data.isCameraBlocked ?? false);
  });
});

// Apply settings when the browser starts
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get('isCameraBlocked', data => {
    setCameraAccess(data.isCameraBlocked ?? false);
  });
});
