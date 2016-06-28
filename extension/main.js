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

  function update(argument) {
    udacityNotifyReviewer(function(hasProjectReview) {
      if (hasProjectReview) {
        render('1', [65, 131, 196, 255], 'Project(s) available for review');
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
