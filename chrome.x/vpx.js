(function (args) {
    var manifest = {
      name: 'VP/X extention',
      version: '1.0',
      description: 'An extention for VP/X project',
      // default_locale: 'en',

      permissions: [ 'experimental', 'tabs' ],

      content_scripts: [
      {
        matches: [ 'http://localhost/~wakita/projects/vpx/' + '*' ],
        js: [ 'vpx.js' ]
      } ],
    };

    if (typeof(alert) !== 'undefined')
      alert('VP/X activated!');
    else {
      for (i in args) {
        switch (args[i]) {
        case '--manifest':
          print(JSON.stringify(manifest, null, 2));
          break;
        }
      }
    }
  })(typeof(arguments) !== 'undefined' ? arguments : []);
