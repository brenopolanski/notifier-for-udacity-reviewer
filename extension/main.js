/* globals chrome:true, udacityNotifyReviewer:true */

(function() {
  'use strict';

  function update(argument) {
    udacityNotifyReviewer();
  }

  chrome.alarms.create({ periodInMinutes: 1 });
  chrome.alarms.onAlarm.addListener(update);

  chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({
      url: 'https://review.udacity.com/#!/submissions/dashboard'
    });
  });
})();
