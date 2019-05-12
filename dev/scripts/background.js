'use strict';

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
  // cover image based on the settings in the popup
  if (message.settings.coverIcon) {
    chrome.browserAction.setIcon({
      path: "images/empty.png"
    });
  } else {
    chrome.browserAction.setIcon({
      path: "images/fart_attack_icon-128.png"
    });
  }
}
//# sourceMappingURL=background.js.map
