(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const formRootUrl = document.getElementById('root-url');
    const formOauthToken = document.getElementById('oauth-token');
    const formCheckIntervals = document.getElementById('check-intervals');
    const formLanguages = document.getElementById('languages');
    const formCheckProject = document.getElementById('check-project');
    const formShowDesktopNotif = document.getElementById('show-desktop-notif');
    const formShowDesktopRing = document.getElementById('show-desktop-ring');

    function getSelectValues(select) {
      const options = select && select.options;
      const len = options.length;
      const result = [];
      let opt;

      for (let i = 0; i < len; i++) {
        opt = options[i];

        if (opt.selected) {
          result.push(opt.value);
        }
      }

      return result;
    }

    function setSelectValues(data) {
      if (typeof data === 'string') {
        data = data.split(',');
      }

      for (let i = 0, iLen = data.length; i < iLen; i++ ) {
        for (let j = 0, jLen = formLanguages.options.length; j < jLen; j++) {
          if (formLanguages.options[j].value === data[i]) {
            formLanguages.options[j].selected = true;
          }
        }
      }
    }

    function loadSettings() {
      formRootUrl.value = window.Udacity.settings.get('rootUrl');
      formOauthToken.value = window.Udacity.settings.get('oauthToken');
      formCheckIntervals.value = window.Udacity.settings.get('interval');
      formCheckProject.checked = window.Udacity.settings.get('checkProject');
      formShowDesktopNotif.checked = window.Udacity.settings.get('showDesktopNotif');
      formShowDesktopRing.checked = window.Udacity.settings.get('showDesktopRing');

      setSelectValues(window.Udacity.settings.get('languages'));

      // console.log(formRootUrl.value);
      // console.log(formOauthToken.value);
      // console.log(formCheckIntervals.value);
      // console.log(formShowDesktopNotif.checked);
      // console.log(formShowDesktopRing.checked);
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

    formRootUrl.addEventListener('change', () => {
      let url = normalizeRoot(formRootUrl.value);

      // Case of url is empty: set to default
      if (url === normalizeRoot('')) {
        window.Udacity.settings.remove('rootUrl');
        url = window.Udacity.settings.get('rootUrl');
      }

      window.Udacity.settings.set('rootUrl', url);
      updateBadge();
      loadSettings();
    });

    formOauthToken.addEventListener('change', () => {
      window.Udacity.settings.set('oauthToken', formOauthToken.value);
      updateBadge();
    });

    formCheckIntervals.addEventListener('change', () => {
      window.Udacity.settings.set('interval', formCheckIntervals.value);
      updateBadge();
    });

    formLanguages.addEventListener('change', () => {
      const languages = getSelectValues(formLanguages);

      window.Udacity.settings.set('languages', languages);
      updateBadge();
      setSelectValues(languages);
    });

    formCheckProject.addEventListener('change', () => {
      window.Udacity.settings.set('checkProject', formCheckProject.checked);
      updateBadge();
    });

    formShowDesktopNotif.addEventListener('change', () => {
      window.Udacity.settings.set('showDesktopNotif', formShowDesktopNotif.checked);
      updateBadge();
    });

    formShowDesktopRing.addEventListener('change', () => {
      window.Udacity.settings.set('showDesktopRing', formShowDesktopRing.checked);
      updateBadge();
    });
  });
})();
