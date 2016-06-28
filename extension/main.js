/* globals chrome:true, udacityNotifyReviewer:true */

(function() {
  'use strict';

  var COLORS = {
    success: [65, 131, 196, 255],
    danger: [166, 41, 41, 255]
  };

  function render(text, color, title) {
    chrome.browserAction.setBadgeText({ text });
    chrome.browserAction.setBadgeBackgroundColor({ color });
    chrome.browserAction.setTitle({ title });
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
    udacityNotifyReviewer(function(data) {
      if (typeof data === 'number') {
        render(handleCount(data), COLORS.success, 'Project(s) available for review');
      }
      else {
        render(':(', COLORS.danger, data);
      }
    });
  }

  chrome.alarms.create({ periodInMinutes: 1 });
  chrome.alarms.onAlarm.addListener(update);

  chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({
      url: 'https://review.udacity.com/#!/submissions/dashboard'
    });
  });
})();
