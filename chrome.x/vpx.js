// Manifest definition

(function (args) {
    var manifest = {
      name: 'VP/X',
      version: '1.0',
      description: 'An extention for VP/X project',
      // default_locale: 'en',

      permissions: [ 'contextMenus', 'experimental', 'tabs' ],

      background_page: 'vpx.html',

      content_scripts: [
      {
        matches: [ 'http://localhost/~wakita/projects/vpx/' + '*' ],
        js: [ 'common.js', 'inject.js' ]
      } ],
    };

    if (typeof(alert) === 'undefined') {
      for (i in args) {
        switch (args[i]) {
        case '--manifest':
          print(JSON.stringify(manifest, null, 2));
          break;
        }
      }
    }
  })(typeof(arguments) !== 'undefined' ? arguments : []);

// Global script

(function () {
    if (typeof(window) === 'undefined') return;
    console.log('VP/X launched');

    var X = chrome.extention;

    chrome.contextMenus.create({
        title: 'Hello to injected code.',
        onclick: function (info, tab) {
          console.log('Sending hello to the tab.');
          chrome.tabs.sendRequest(tab.id, { greeting: 'Hello' },
            function (v) { console.log(JSON.stringify(v)); });
        }
      });

  })();
