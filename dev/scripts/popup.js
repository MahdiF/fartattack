"use strict";

// Default Settings
var settings = {
  trackHover: false,
  trackClick: true,
  trackButtons: true,
  coverIcon: false,
  newTab: true
};
var trackHover = document.querySelector('#track_hover');
var trackClick = document.querySelector('#track_click');
var trackButtons = document.querySelector('#track_buttons');
var coverIcon = document.querySelector('#cover_icon');
var newTab = document.querySelector('#new_tab');
var settingsSaved = document.querySelector('.settings_saved'); // Load settings

function loadPopupSettings() {
  trackHover.checked = settings.trackHover;
  trackClick.checked = settings.trackClick;
  trackButtons.checked = settings.trackButtons;
  coverIcon.checked = settings.coverIcon;
  newTab.checked = settings.newTab;
} // Check if settings is available in Chrome Storage and put in settings


chrome.storage.sync.get(['fartAttackSettings'], function (result) {
  if (result.fartAttackSettings) {
    settings = result.fartAttackSettings;
  } // Load settings once the settings are loaded from storage


  loadPopupSettings();
}); // List button actions
// Track Hover

trackHover.addEventListener('input', function () {
  if (trackHover.checked) {
    settings.trackHover = trackHover.checked;
  } else {
    settings.trackHover = trackHover.checked;
  }

  updateSettings();
  sendSettings();
  showSettingsSaved();
}); // Track Click

trackClick.addEventListener('input', function () {
  if (trackClick.checked) {
    settings.trackClick = trackClick.checked;
  } else {
    settings.trackClick = trackClick.checked;
  }

  updateSettings();
  sendSettings();
  showSettingsSaved();
}); // Track Buttons

trackButtons.addEventListener('input', function () {
  if (trackButtons.checked) {
    settings.trackButtons = trackButtons.checked;
  } else {
    settings.trackButtons = trackButtons.checked;
  }

  updateSettings();
  sendSettings();
  showSettingsSaved();
}); // Hide Icon

coverIcon.addEventListener('input', function () {
  if (coverIcon.checked) {
    settings.coverIcon = coverIcon.checked;
  } else {
    settings.coverIcon = coverIcon.checked;
  }

  updateSettings();
  sendSettings();
}); // New Tab

newTab.addEventListener('input', function () {
  if (newTab.checked) {
    settings.newTab = newTab.checked;
  } else {
    settings.newTab = newTab.checked;
  }

  updateSettings();
  sendSettings();
  showSettingsSaved();
}); // Update settings and save it to Chrome Storage

function updateSettings() {
  settings.trackHover = trackHover.checked;
  settings.trackClick = trackClick.checked;
  settings.trackButtons = trackButtons.checked;
  settings.coverIcon = coverIcon.checked;
  settings.newTab = newTab.checked;
  chrome.storage.sync.set({
    fartAttackSettings: settings
  }, function () {
    console.log('🍑💨 Fart Attack settings saved in Chrome!');
    console.log(settings);
  });
} // Toggle Class


function toggleClass(element, className) {
  element.classList.toggle(className);
}

var timerSettingsSaved;

function showSettingsSaved() {
  settingsSaved.style.display = 'block';
  clearInterval(timerSettingsSaved);
  timerSettingsSaved = setTimeout(hideSettingsSaved, 1500);
}

function hideSettingsSaved() {
  settingsSaved.style.display = 'none';
  clearInterval(timerSettingsSaved);
}

settingsSaved.addEventListener('click', hideSettingsSaved);

function sendSettings() {
  // Get current tab
  var params = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(params, gotTab);

  function gotTab(tab) {
    chrome.tabs.sendMessage(tab[0].id, settings);
    chrome.runtime.sendMessage({
      settings: settings
    });
  }
}
//# sourceMappingURL=popup.js.map
