const protractorUtils = require('@bazel/protractor/protractor-utils');
const protractor = require('protractor');

module.exports = function (config) {
  return protractorUtils
    .runServer(config.workspace, config.server, '-port', [])
    .then(serverSpec => {
      protractor.browser.ignoreSynchronization = true;
      const serverUrl = `http://localhost:${serverSpec.port}`;
      protractor.browser.baseUrl = serverUrl;
    });
};
