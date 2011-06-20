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

if (typeof(window) !== 'undefined') {
  (function () {
      console.log('VP/X launched');

      var X = chrome.extension;
      var CM = chrome.contextMenus;
      var D = chrome.experimental.debugger;

      var on_error = function (msg) {
        return function () {
          if (X.lastError)
            console.log(msg + '\nError: ', X.lastError.message);
        };
      };

      var check_error = function (err_msg) {
        if (X.lastError) {
          console.log(err_msg + '\nError = ', X.lastError);
          throw X.lastError;
        }
      }

      var inspected_tabs = [];

      var attach_debugger = function (id) {
        if (inspected_tabs.indexOf(id) === -1) {
          D.attach(id,
            function () {
              check_error('attach_debugger');
              inspected_tabs.push(id);
            });
        } else
          throw 'Another debugger is already attached to tab(' + id + ')';
      };

      var detach_debugger = function (id) {
        if (inspected_tabs.indexOf(id) >= 0) {
          D.detach(id,
            function () {
              check_error('detach_debugger');
              inspected_tabs[inspected_tabs.indexOf(id)] = -1;
            });
        } else throw 'A debugger is not attached';
      }

      D.onDetach.addListener(function (id) {
          inspected_tabs[inspected_tabs.indexOf(id)] = -1;
        });

      D.onEvent.addListener(function (id, method, params) {
          console.log('Event@Tab(' + id + ')\n', method, '\n', params);
        });

      CM.create({
          title: 'Attach debugger',
          onclick: function (info, tab) {
            try {
              attach_debugger(tab.id);
              console.log('Debugger attached');
            } catch (e) {
              console.log('Debugger attachment failed:\n', e);
            }
          }
        });

      CM.create({
          title: 'Detach debugger',
          onclick: function (info, tab) {
            try {
              detach_debugger(tab.id);
              console.log('Debugger detached');
            } catch (e) {
              console.log('Debugger detachment failed:\n', e);
            }
          }
        });

    })()
};
