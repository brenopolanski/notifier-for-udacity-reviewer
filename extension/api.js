(function() {
  'use strict';

  var TOKEN = 'YOUR_TOKEN'; // localStorage.udacityReviewDevToken

  var BASE_URL = 'https://review-api.udacity.com/api/v1/me/';

  var LANGUAGES = ['pt-br', 'en-us']; // 'zh-cn'

  var xhr = function() {
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
      xhr.setRequestHeader('Authorization', TOKEN);
      xhr.send();
    };
  }();

  window.udacityNotifyReviewer = function(callback) {
    xhr('GET', BASE_URL + 'certifications.json', function(data) {
      var certifications = JSON.parse(data);
      var reviewAwaiting = 0;

      if (!certifications.hasOwnProperty('error')) {
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

        callback(reviewAwaiting);
      }
      else {
        callback(certifications.error);
      }
    });
  };
})();
