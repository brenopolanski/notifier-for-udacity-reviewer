(() => {
  const tabUrl = 'https://review.udacity.com/#!/submissions/dashboard';
  const colors = {
    success: [65, 131, 196, 255],
    danger: [166, 41, 41, 255]
  };
  const ring = new Audio('sounds/ring.ogg');

  function loadRing() {
    ring.load();
  }

  function render(text, color, title) {
    chrome.browserAction.setBadgeText({ text });
    chrome.browserAction.setBadgeBackgroundColor({ color });
    chrome.browserAction.setTitle({ title });
  }

  function notification(opt) {
    if (window.Udacity.settings.get('showDesktopNotif')) {
      chrome.notifications.create(opt);
      chrome.notifications.onClicked.addListener(() => {
        chrome.tabs.create({
          url: tabUrl
        });
      });
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

  function parseStringToNumber(interval) {
    if (interval > 60) {
      interval = ((interval / 60) / 1000);
    }

    if (!isNaN(interval) && interval.toString().indexOf('.') !== -1) {
      // TODO: Alarm period is less than minimum of 1 minutes.
      // In released `.crx`, alarm "" will fire approximately every 1 minutes.
      return parseFloat(interval);
    }
    else {
      return parseInt(interval);
    }
  }

  function update() {
    const interval = window.Udacity.settings.get('interval');

    chrome.alarms.create({ periodInMinutes: parseStringToNumber(interval) });

    window.udacityNotifyReviewer(data => {
      if (typeof data === 'number') {
        const opt = {
          type: 'basic',
          title: 'Udacity Project Reviewer',
          message: `You have ${handleCount(data)} ${data === 1 ? 'project' : 'projects'} available for review!`,
          iconUrl: 'images/icon-128.png'
        };

        if (data && data !== 0) {
          notification(opt);

          if (window.Udacity.settings.get('showDesktopRing')) {
            ring.play();
          }
        }

        render(handleCount(data), colors.success, 'Projects available for review');
      }
      else {
        render(':(', colors.danger, data);
      }
    });
  }

  chrome.alarms.onAlarm.addListener(update);
  chrome.runtime.onMessage.addListener(update);

  // Launch options page on first run
  chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') {
      chrome.runtime.openOptionsPage();
    }
  });

  chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.create({
      url: tabUrl
    });
  });

  loadRing();
  update();
})();
