(function () {
    var X = chrome.extension;

    X.onRequest.addListener(function (req, sender, reply) {
        console.log(JSON.stringify(req));
        reply(req.greeting === 'Hello' ? { farewell: 'goodbye' } : {});
      });
  })();
