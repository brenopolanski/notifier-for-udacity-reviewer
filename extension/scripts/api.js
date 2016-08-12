(() => {
  window.Udacity = (() => {
    const defaults = {
      rootUrl: 'https://review-api.udacity.com/api/v1/',
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

  window.udacityNotifyReviewer = callback => {
    const rootUrl = window.Udacity.settings.get('rootUrl');
    const token = window.Udacity.settings.get('oauthToken');
    const checkProject = window.Udacity.settings.get('checkProject');
    const headers = new Headers({
      'Authorization': token,
      'Content-Length': '0'
    });
    let languages = window.Udacity.settings.get('languages');

    if (typeof languages === 'string') {
      languages = languages.split(',');
    }

    fetch(`${rootUrl}me/certifications.json`, {
      method: 'GET',
      headers: headers
    })
    .then(response => {
      const status = response.status;
      const linkHeader = response.headers.get('Link');

      if (linkHeader === null) {
        return response.json().then(data => {
          const certifications = data;
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
                        fetch(`${rootUrl}projects/${projectId}/submissions/assign.json`, {
                          method: 'POST',
                          headers: headers
                        });
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
      }

      if (status >= 400) {
        return response.json().then(res => {
          callback(res.error);
        });
      }

      if (status >= 500) {
        return response.json().then(res => {
          callback(res.error);
        });
      }
    })
    .catch(err => {
      console.error('Failed retrieving information', err);
    });
  };
})();
