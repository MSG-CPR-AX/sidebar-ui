// Background service worker for SideBeam Chrome extension
// Handles side panel management, extension lifecycle, and inter-script communication

// Extension installation and startup
chrome.runtime.onInstalled.addListener((details) => {
  console.log('SideBeam extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // First time installation
    console.log('First time installation - setting up defaults');
    
    // Set default preferences
    chrome.storage.local.set({
      'sidebeam-preferences': {
        theme: 'dark',
        defaultTab: 'bookmarks',
        apiBaseUrl: '',
        gitlabBaseUrl: '',
        autoRefresh: true,
        refreshInterval: 300000, // 5 minutes
      }
    }).catch(console.error);
    
    // Welcome notification
    chrome.notifications.create('sidebeam-welcome', {
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'SideBeam✨ Installed!',
      message: 'Click the extension icon to start managing your bookmarks.',
    }).catch(console.error);
    
  } else if (details.reason === 'update') {
    console.log('Extension updated from version:', details.previousVersion);
    // Handle version migrations if needed
  }
});

// Handle extension startup (browser restart)
chrome.runtime.onStartup.addListener(() => {
  console.log('SideBeam extension started');
});

// Action button click handler
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Extension action clicked for tab:', tab.id);
  
  try {
    // Open side panel for the current tab
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (error) {
    console.error('Failed to open side panel:', error);
    
    // Fallback: create a popup window if side panel fails
    try {
      await chrome.windows.create({
        url: chrome.runtime.getURL('index.html'),
        type: 'popup',
        width: 400,
        height: 600,
        focused: true
      });
    } catch (popupError) {
      console.error('Failed to create popup window:', popupError);
    }
  }
});

// Side panel behavior configuration
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);

// Message handling from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  switch (request.type) {
    case 'EXTENSION_READY':
      console.log('Extension UI is ready');
      sendResponse({ status: 'acknowledged' });
      return true;
      
    case 'GET_ACTIVE_TAB':
      chrome.tabs.query({ active: true, currentWindow: true })
        .then(tabs => {
          sendResponse({ tab: tabs[0] || null });
        })
        .catch(error => {
          console.error('Failed to get active tab:', error);
          sendResponse({ error: error.message });
        });
      return true; // Indicates async response
      
    case 'OPEN_BOOKMARK':
      if (request.url) {
        chrome.tabs.create({ 
          url: request.url,
          active: request.background !== true 
        })
        .then(tab => {
          sendResponse({ success: true, tabId: tab.id });
        })
        .catch(error => {
          console.error('Failed to open bookmark:', error);
          sendResponse({ success: false, error: error.message });
        });
      } else {
        sendResponse({ success: false, error: 'No URL provided' });
      }
      return true;
      
    case 'GET_PREFERENCES':
      chrome.storage.local.get(['sidebeam-preferences'])
        .then(result => {
          sendResponse({ preferences: result['sidebeam-preferences'] || {} });
        })
        .catch(error => {
          console.error('Failed to get preferences:', error);
          sendResponse({ error: error.message });
        });
      return true;
      
    case 'SET_PREFERENCES':
      if (request.preferences) {
        chrome.storage.local.set({ 'sidebeam-preferences': request.preferences })
          .then(() => {
            sendResponse({ success: true });
          })
          .catch(error => {
            console.error('Failed to set preferences:', error);
            sendResponse({ success: false, error: error.message });
          });
      } else {
        sendResponse({ success: false, error: 'No preferences provided' });
      }
      return true;
      
    case 'RELOAD_EXTENSION':
      console.log('Reloading extension...');
      chrome.runtime.reload();
      return true;
      
    default:
      console.warn('Unknown message type:', request.type);
      sendResponse({ error: 'Unknown message type' });
      return false;
  }
});

// Handle tab updates that might affect bookmark detection
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Notify side panel about tab changes
    chrome.runtime.sendMessage({
      type: 'TAB_UPDATED',
      tabId,
      url: tab.url,
      title: tab.title
    }).catch(() => {
      // Side panel might not be open, that's okay
    });
  }
});

// Alarm handling for periodic tasks
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm.name);
  
  switch (alarm.name) {
    case 'refresh-bookmarks':
      // Trigger bookmark refresh in active side panel
      chrome.runtime.sendMessage({
        type: 'REFRESH_BOOKMARKS'
      }).catch(() => {
        // Side panel might not be open, that's okay
      });
      break;
      
    default:
      console.warn('Unknown alarm:', alarm.name);
  }
});

// Set up periodic refresh alarm (if auto-refresh is enabled)
chrome.storage.local.get(['sidebeam-preferences']).then(result => {
  const preferences = result['sidebeam-preferences'] || {};
  
  if (preferences.autoRefresh && preferences.refreshInterval) {
    chrome.alarms.create('refresh-bookmarks', {
      delayInMinutes: preferences.refreshInterval / 60000,
      periodInMinutes: preferences.refreshInterval / 60000
    });
  }
}).catch(console.error);

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service worker unhandled rejection:', event.reason);
});

// Keep service worker alive (Chrome MV3 best practice)
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20000);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();

console.log('SideBeam background service worker initialized');