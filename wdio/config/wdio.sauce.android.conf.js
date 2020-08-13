process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const _ = require('lodash');
const defaults = require('./wdio.sauce.base.conf');

const defaultAndroidCapabilities = {
  platformName: 'Android',
  automationName: 'uiautomator2',
  app: `storage:${process.env.ARTIFACT_ID}`,
  appWaitPackage: 'org.pathcheck.covidsafepaths',
  appWaitActivity: '*.MainActivity',
  nativeWebScreenshot: true,
};
const overrides = {
  capabilities: [
    {
      ...defaultAndroidCapabilities,
      appiumVersion: '1.17.1',
      platformVersion: '9.0',
      deviceName: 'Samsung Galaxy S9 HD GoogleAPI Emulator',
    },
    {
      ...defaultAndroidCapabilities,
      appiumVersion: '1.17.1',
      platformVersion: '10.0',
      deviceName: 'Google Pixel 3 GoogleAPI Emulator',
    },
  ],
};
// Send the merged config to wdio
exports.config = _.defaultsDeep(overrides, defaults);
