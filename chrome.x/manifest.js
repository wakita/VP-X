var manifest = {
  name: 'VP/X extention',
  version: '1.0',
  description: 'An extention for VP/X project',
  // default_locale: 'en',
  content_scripts: [
    {
      matches: [ 'http://localhost/~wakita/projects/vpx/*' ],
      js: [ 'vpx.js' ]
    }
  ]
};

print(JSON.stringify(manifest, null, 2));
