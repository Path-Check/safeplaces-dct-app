process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const _ = require('lodash');
const defaults = require('./wdio.base.conf').config;


const defaultAndroidCapabilities = {
  platformName: 'Android',
  automationName: 'uiautomator2',
  // app: "storage:468f6cb9-cc19-4e29-bf0c-ed5264f0c4c6",
  app: "bs://10786640fe6fd38d17ed3f78b6bfbe5334ad7943",
  appWaitPackage: 'org.pathcheck.covidsafepaths',
  appWaitActivity: '*.MainActivity',
  nativeWebScreenshot: true,
};
const overrides = {
  capabilities: [
    // {
    //   ...defaultAndroidCapabilities,
    //   appiumVersion: '1.17.1',
    //   platformVersion: '9.0',
    //   deviceName: 'Samsung Galaxy S9 HD GoogleAPI Emulator',
    // },
    // {
    //   ...defaultAndroidCapabilities,
    //   appiumVersion: '1.17.1',
    //   platformVersion: '10.0',
    //   deviceName: 'Google Pixel 3 GoogleAPI Emulator',
    // },
    {
      ...defaultAndroidCapabilities,
      device: 'Google Pixel 3',
      os_version: '9.0',
    },
  ],
};
// Send the merged config to wdio
exports.config = _.defaultsDeep(overrides, defaults);
