(function() {
  'use strict';

  window.Udacity = function() {
    var defaults = {
      rootUrl: 'https://review-api.udacity.com/api/v1/me/',
      oauthToken: '',
      languages: ['pt-br', 'en-us'], // zh-cn
      interval: 1, // Minute,
      showDesktopNotif: false,
      showDesktopRing: false
    };

    var api = {
      settings: {
        get: function(name) {
          var item = localStorage.getItem(name);

          if (item === null) {
            return {}.hasOwnProperty.call(defaults, name) ? defaults[name] : undefined;
          }

          if (item === 'true' || item === 'false') {
            return item === 'true';
          }

          return item;
        },
        set: localStorage.setItem.bind(localStorage),
        remove: localStorage.removeItem.bind(localStorage),
        reset: localStorage.clear.bind(localStorage)
      }
    };

    api.defaults = defaults;

    return api;
  }();

  var xhr = function() {
    var xhr = new XMLHttpRequest();
    var token = window.Udacity.settings.get('oauthToken');

    return function(method, url, doneCallback, incompleteCallback) {
      token = window.Udacity.settings.get('oauthToken');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          doneCallback(xhr.responseText);
        }
        else {
          if (typeof incompleteCallback === 'function') {
            incompleteCallback(xhr.responseText);
          }
        }
      };
      xhr.open(method, url);
      xhr.setRequestHeader('Authorization', token);
      xhr.send();
    };
  }();

  window.udacityNotifyReviewer = function(callback) {
    var rootUrl = window.Udacity.settings.get('rootUrl');
    var languages = window.Udacity.settings.get('languages');

    if (typeof languages === "string") {
      languages = languages.split(',');
    }

    xhr('GET', rootUrl + 'certifications.json', function(data) {
      var certifications = JSON.parse(data);
      var reviewAwaiting = 0;

      if (!certifications.hasOwnProperty('error')) {
        certifications.map(function(certification) {
          // Check if is certified (required to review projects)
          if (certification.certified_at) {
            var languageReviewsCount = certification.project.awaiting_review_count_by_language;

            if (languageReviewsCount) {
              languages.map(function(language) {
                if (language in languageReviewsCount) {
                  reviewAwaiting += languageReviewsCount[language];
                }
              });
            }
          }
        });

        callback(reviewAwaiting);
      }
      else {
        callback(certifications.error);
      }
    });
  };
})();
