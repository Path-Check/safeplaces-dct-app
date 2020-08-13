process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const _ = require('lodash');
const defaults = require('./wdio.browserstack.base.conf').config;

// The `app` capability is required for both wdio *and* browserstack; hence the repeated code.
// Example ARTIFACT_ID value: ad5f1dafe40cd35d890e2fe991a5f83698658e1e
const appId = `bs://${process.env.ARTIFACT_ID}`;

const defaultAndroidCapabilities = {
  platformName: 'Android',
  automationName: 'uiautomator2',
  browserName: 'android',
  app: appId,
  appWaitPackage: 'org.pathcheck.covidsafepaths',
  appWaitActivity: '*.MainActivity',
  nativeWebScreenshot: true,
};
const overrides = {
  capabilities: [
    {
      ...defaultAndroidCapabilities,
      device: 'Google Pixel 3',
      os_version: '9.0',
    },
  ],
  services: [
    ['browserstack', {
      browserstackLocal: true,
      debug: true,
      networkLogs: true,
      app: appId,
    }],
  ]
};
// Send the merged config to wdio
exports.config = _.defaultsDeep(overrides, defaults);
