(function() {
  'use strict';

  var TOKEN = 'YOUR_TOKEN';

  var BASE_URL = 'https://review-api.udacity.com/api/v1/me/';

  var LANGUAGES = ['pt-br', 'en-us']; // 'zh-cn'

  var xhr = function() {
    var xhr = new XMLHttpRequest();

    return function(method, url, callback) {
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          callback(xhr.responseText);
        }
      };
      xhr.open(method, url);
      xhr.setRequestHeader('authorization', TOKEN);
      xhr.send();
    };
  }();

  window.udacityNotifyReviewer = function(callback) {
    xhr('GET', BASE_URL + 'certifications.json', function(data) {
      var certifications = JSON.parse(data);
      var reviewAwaiting = 0;

      certifications.map(function(certification) {
        // Check if is certified (required to review projects)
        if (certification.certified_at) {
          var languageReviewsCount = certification.project.awaiting_review_count_by_language;

          if (languageReviewsCount) {
            LANGUAGES.map(function(language) {
              if (language in languageReviewsCount) {
                reviewAwaiting += languageReviewsCount[language];
              }
            });
          }
        }
      });

      if (reviewAwaiting) {
        callback(reviewAwaiting);
      }
      else {
        callback(false);
      }
    });
  };
})();
