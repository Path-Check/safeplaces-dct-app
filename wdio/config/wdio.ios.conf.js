process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const _ = require('lodash');
const defaults = require('./wdio.base.conf').config;

const defaultIOSCapabilities = {
  platformName: 'iOS',
  automationName: 'XCUITest',
  app: 'sauce-storage:pathcheck-ios.app.zip',
  waitForQuiescence: false,
  useNewWDA: true,
};
const overrides = {
  capabilities: [
    {
      ...defaultIOSCapabilities,
      platformVersion: '13.2',
      deviceName: 'iPhone XR Simulator',
    },
  ],
};
// Send the merged config to wdio
exports.config = _.defaultsDeep(overrides, defaults);
