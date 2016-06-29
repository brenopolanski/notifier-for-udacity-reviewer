(function() {
  'use strict';

  var COLORS = {
    success: [65, 131, 196, 255],
    danger: [166, 41, 41, 255]
  };

  var RING = new Audio('sounds/ring.ogg');

  function loadRing() {
    // RING.onload = function() {};
    RING.load();
  }

  function render(text, color, title) {
    chrome.browserAction.setBadgeText({ text });
    chrome.browserAction.setBadgeBackgroundColor({ color });
    chrome.browserAction.setTitle({ title });
  }

  function notification(opt) {
    if (window.Udacity.settings.get('showDesktopNotif')) {
      chrome.notifications.create(opt);
    }
  }

  function handleCount(count) {
    if (count === 0) {
      return '';
    }
    else if (count > 9999) {
      return '∞';
    }

    return String(count);
  }

  function update() {
    window.udacityNotifyReviewer(function(data) {
      if (typeof data === 'number') {
        var opt = {
          type: 'basic',
          title: 'Udacity Project Reviewer',
          message: 'You Have ' + handleCount(data) + ' Projects available for review!',
          iconUrl: 'images/icon-128.png'
        };

        if (data && data !== 0) {
          notification(opt);

          if (window.Udacity.settings.get('showDesktopRing')) {
            RING.play();
          }
        }

        render(handleCount(data), COLORS.success, 'Projects available for review');
      }
      else {
        render(':(', COLORS.danger, data);
      }
    });
  }

  chrome.alarms.create({ periodInMinutes: parseInt(window.Udacity.settings.get('interval')) });
  chrome.alarms.onAlarm.addListener(update);
  chrome.runtime.onMessage.addListener(update);

  // Launch options page on first run
  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install') {
      chrome.runtime.openOptionsPage();
    }
  });

  chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({
      url: 'https://review.udacity.com/#!/submissions/dashboard'
    });
  });

  loadRing();

  update();
})();
