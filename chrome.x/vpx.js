// Manifest definition

(function (args) {
    var manifest = {
      name: 'VP/X extention',
      version: '1.0',
      description: 'An extention for VP/X project',
      // default_locale: 'en',

      permissions: [ 'contextMenus', 'experimental', 'tabs' ],

      background_page: 'vpx.html',

      content_scripts: [
      {
        matches: [ 'http://localhost/~wakita/projects/vpx/' + '*' ],
        js: [ 'inject.js' ]
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
  })();
