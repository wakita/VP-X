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

// Experimental debugger API
// http://code.google.com/chrome/extensions/experimental.debugger.html
//

// Global script

if (typeof(window !== 'undefined')) {
  console.log('VP/X launched');

  $(function () {
      var X = chrome.extension;
      var CM = chrome.contextMenus;
      var D = chrome.experimental.debugger;

      var on_error = function (msg) {
        return function () {
          if (X.lastError)
            console.log(msg + '\nError = ', X.lastError);
        };
      };

      var inspected_tabs = [];

      var attach_debugger = function (id) {
        if (inspected_tabs.indexOf(id) === -1) {
          console.log('Trying to attach debugger to tab(' + id + ')');
          D.attach(id,
            function () {
              if (X.lastError)
                console.log('attach_debugger\nError = ', X.lastError);
              else inspected_tabs.push(id);
              return !X.lastError;
            });
          return true;
        }
      };

      D.onDetach.addListener(function (id) {
          inspected_tabs[inspected_tabs.indexOf(id)] = -1;
        });

      D.onEvent.addListener(function (id, method, params) {
          console.log('Event@Tab(' + id + ') --- ' + method + '\n', params);
        });

      var ask_eval = function (id, e) {
        D.sendRequest(id, 'Runtime.evaluate', { expression: e },
          function (r) {
            if (r && r.result)
              console.log('' + e + ' => ', r.result.description);
            else if (!r) on_error('ask_eval: ')();
          });
      };

      CM.create({
          title: 'Evaluate fact(6)',
          onclick: function (info, tab) {
            var id = tab.id;
            if (attach_debugger(id)) {
              ask_eval(id, '1 + 1');
              ask_eval(id, [
                'var fact = function (n) {',
                '    if (n === 0) return 1;',
                '    else return n * fact(n - 1);',
                '  }'].join('\n'));
              ask_eval(id, [
                '(function () {',
                '    var r = fact(6);',
                '    console.log(r);',
                '    return r;',
                '  })();'].join('\n'));
            }
          }
        });

    });
}
