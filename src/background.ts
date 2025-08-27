// This script configures the side panel to open when the extension's
// action icon is clicked. This is a more modern and efficient approach
// than using an `onClicked` listener.

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
