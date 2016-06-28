(function() {
  'use strict';

  window.Udacity = function() {
    var defaults = {
      rootUrl: 'https://review-api.udacity.com/api/v1/me/',
      oauthToken: '',
      languages: ['pt-br', 'en-us'],
      interval: 1 // minute
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
    var token = window.Udacity.settings.get('oauthToken');
    var xhr = new XMLHttpRequest();

    return function(method, url, callback) {
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          callback(xhr.responseText);
        }
        else {
          callback(xhr.responseText);
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
