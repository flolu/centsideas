const protractorUtils = require('@bazel/protractor/protractor-utils');
const protractor = require('protractor');

module.exports = function (config) {
  return protractorUtils.runServer(config.workspace, config.server, '-p', []).then(serverSpec => {
    const serverUrl = `http://localhost:${serverSpec.port}`;
    protractor.browser.baseUrl = serverUrl;
    protractor.browser.ignoreSynchronization = true;
  });
};
