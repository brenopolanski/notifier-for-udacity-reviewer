(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var formRootUrl = document.getElementById('root-url');
    var formOauthToken = document.getElementById('oauth-token');
    var formCheckIntervals = document.getElementById('check-intervals');
    var formLanguages = document.getElementById('languages');
    var formShowDesktopNotif = document.getElementById('show-desktop-notif');

    function getSelectValues(select) {
      var options = select && select.options;
      var len = options.length;
      var result = [];
      var opt;

      for (var i = 0; i < len; i++) {
        opt = options[i];

        if (opt.selected) {
          result.push(opt.value);
        }
      }

      return result;
    }

    function loadSettings() {
      formRootUrl.value = window.Udacity.settings.get('rootUrl');
      formOauthToken.value = window.Udacity.settings.get('oauthToken');
      formCheckIntervals.value = window.Udacity.settings.get('interval');
      formShowDesktopNotif.checked = window.Udacity.settings.get('showDesktopNotif');

      console.log(formRootUrl.value);
      console.log(formOauthToken.value);
      console.log(formCheckIntervals.value);
      console.log(formShowDesktopNotif.checked);
    }

    loadSettings();

    function updateBadge() {
      chrome.runtime.sendMessage('update');
    }

    function normalizeRoot(url) {
      if (!/^https?:\/\//.test(url)) {
        // Assume it is https
        url = `https://${url}`;
      }

      if (!/\/$/.test(url)) {
        url += '/';
      }

      return url;
    }

    formRootUrl.addEventListener('change', function() {
      var url = normalizeRoot(formRootUrl.value);

      // Case of url is empty: set to default
      if (url === normalizeRoot('')) {
        window.Udacity.settings.remove('rootUrl');
        url = window.Udacity.settings.get('rootUrl');
      }

      window.Udacity.settings.set('rootUrl', url);
      updateBadge();
      loadSettings();
    });

    formOauthToken.addEventListener('change', function() {
      window.Udacity.settings.set('oauthToken', formOauthToken.value);
      updateBadge();
    });

    formCheckIntervals.addEventListener('change', function() {
      window.Udacity.settings.set('interval', formCheckIntervals.value);
      updateBadge();
    });

    formShowDesktopNotif.addEventListener('change', function() {
      window.Udacity.settings.set('showDesktopNotif', formShowDesktopNotif.checked);
      updateBadge();
    });
  });
})();
