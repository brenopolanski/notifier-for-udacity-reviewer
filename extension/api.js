(function() {
  'use strict';

  var TOKEN = 'YOUR_TOKEN';

  var BASE_URL = 'https://review-api.udacity.com/api/v1/me/';

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
      // console.log(data);

      callback(true);
    });
  };
})();
