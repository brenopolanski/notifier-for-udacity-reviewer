(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var formRootUrl = document.getElementById('root-url');



    function normalizeRoot(url) {
      if (!/^https?:\/\//.test(url)) {
        // assume it is https
        url = `https://${url}`;
      }

      if (!/\/$/.test(url)) {
        url += '/';
      }

      return url;
    }

    console.log(formRootUrl.value);
  });
})();
