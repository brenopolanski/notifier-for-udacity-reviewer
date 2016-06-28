/* globals chrome:true, udacityNotifyReviewer:true */

(function() {
  'use strict';

  function render(badge, color, title) {
    chrome.browserAction.setBadgeText({
      text: badge
    });

    chrome.browserAction.setBadgeBackgroundColor({
      color: color
    });

    chrome.browserAction.setTitle({
      title: title
    });
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

  function update(argument) {
    udacityNotifyReviewer(function(count) {
      if (count !== false) {
        render(handleCount(count), [65, 131, 196, 255], 'Project(s) available for review');
      }
      else {
        render(':(', [166, 41, 41, 255], 'You have to be connected to the internet and logged into Udacity');
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
