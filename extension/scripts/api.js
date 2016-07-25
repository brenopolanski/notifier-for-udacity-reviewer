(() => {
  window.Udacity = (() => {
    const defaults = {
      rootUrl: 'https://review-api.udacity.com/api/v1/me/',
      oauthToken: '',
      interval: 1, // Minute,
      languages: ['pt-br', 'en-us'], // zh-cn
      checkProject: false,
      showDesktopNotif: false,
      showDesktopRing: false
    };

    const api = {
      settings: {
        get(name) {
          const item = localStorage.getItem(name);

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
  })();

  const xhr = (() => {
    const xhr = new XMLHttpRequest();
    let token = window.Udacity.settings.get('oauthToken');

    return (method, url, doneCallback, incompleteCallback) => {
      token = window.Udacity.settings.get('oauthToken');

      xhr.onreadystatechange = () => {
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
  })();

  window.udacityNotifyReviewer = callback => {
    const rootUrl = window.Udacity.settings.get('rootUrl');
    const checkProject = window.Udacity.settings.get('checkProject');
    let languages = window.Udacity.settings.get('languages');

    if (typeof languages === 'string') {
      languages = languages.split(',');
    }

    xhr('GET', `${rootUrl}me/certifications.json`, data => {
      const certifications = JSON.parse(data);
      let reviewAwaiting = 0;

      if (!certifications.hasOwnProperty('error')) {
        certifications.map(certification => {
          // Check if is certified (required to review projects)
          if (certification.certified_at) {
            const languageReviewsCount = certification.project.awaiting_review_count_by_language;
            const projectId = certification.project.id;

            if (languageReviewsCount) {
              languages.map(language => {
                if (language in languageReviewsCount) {
                  if (checkProject) {
                    xhr('POST', `${rootUrl}projects/${projectId}/submissions/assign.json`);
                  }

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
