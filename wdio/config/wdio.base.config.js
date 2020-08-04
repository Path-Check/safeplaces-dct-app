const path = require('path');
// Module for interacting with the Sauce Labs API
// const sauceLabsMethods = require('../common/sauceLabsService');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Method to get the current running spec file
function getRunningSpecName(specs) {
  // Get the running spec. Splits the filepath and returns the spec filename
  const splitFileName = specs[0].split('/').pop();
  return {
    runningFileName: splitFileName,
  };
}
// // Method to get the test result status
// function getTestResultStatusPassOrFail(result) {
//   return result === 0;
// }
exports.config = {
  //
  // ============
  // Debug config
  // ============
  // Change this option to true if you want to run tests in debug mode either using IntelliJ breakpoints
  // or WebdriverIO's browser.debug() command within your spec files
  // See http://webdriver.io/guide/testrunner/debugging.html for more info.
  //
  debug: false,
  //
  // ==================
  // Specify Test Files
  // ==================
  //
  // specs: [
  //   './wdio/authentication.spec.js'
  // ],
  specs: [
    path.join(
      process.cwd(),
      './wdio/tests/*/.wdio.functional.js',
    ),
  ],
  // define specific suites
  suites: {
    authentication: ['./wdio/tests/**/*.wdio.functional.js'],
  },
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  // The property basically handles how many capabilities from the same test should run tests.
  //
  maxInstances: 10,
  // The number of times to retry the entire specfile when it fails as a whole
  specFileRetries: 0,
  //
  // Or set a limit to run tests with a specific capability.
  maxInstancesPerCapability: 1,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  // user: process.env.SAUCE_USERNAME,
  // key: process.env.SAUCE_ACCESS_KEY,
  user: lfalkner,
  key: "66407d3c-34d2-48f5-bbce-44497ee81856",
  region: "us",
  port: 443,
  sauceConnect: false,
  capabilities: [
    {
      autoLaunch: true,
      deviceOrientation: 'portrait',
      browserName: '',
      build: "local",
      version: "local",
    //   build: process.env.BRANCH_NAME,
    //   version: process.env.MAJOR_VERSION_STRING + '.' + process.env.PATCH_VERSION,
    },
  ],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // By default WebdriverIO commands are executed in a synchronous way using
  // the wdio-sync package. If you still want to run your tests in an async way
  // e.g. using promises you can set the sync option to false.
  sync: true,
  //
  // Level of logging verbosity: silent | trace | command | data | result | error
  logLevel: 'trace',
  //
  // Enables colors for log output.
  coloredLogs: true,
  // port
  port: 4723,
  // server
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: './wdio/screenshots/failures',
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 40000,
  // Default request retries count
  connectionRetryCount: 1,
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: [
    ['appium'],
    ['sauce', {
        region: 'us',
        sauceConnect: false,
        tunnelIdentifier: 'local_run',
        sauceConnectOpts: {
            noRemoveCollidingTunnels: true,
        },
    }]
  ],
  appium: { command: 'appium' },
  //
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: http://webdriver.io/guide/testrunner/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'jasmine',
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: http://webdriver.io/guide/testrunner/reporters.html
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  reporters: [
    'spec',
  ],
  //
  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    // Updated the timeout to 30 seconds due to possible longer appium calls
    // When using XPATH
    defaultTimeoutInterval: 90000,
    includeStackTrace: true,
    helpers: [require.resolve('@babel/register')],
    //
    // The Jasmine framework allows interception of each assertion in order to log the state of the application
    // or website depending on the result. For example, it is pretty handy to take a screenshot every time
    // an assertion fails.
    expectationResultHandler() {
      // do something
    },
  },
  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  // onPrepare: function (config, capabilities) {
  // },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  beforeSession(config, capabilities, specs) {
    // Added the below to make reporting between Sauce Labs and Jenkins easier.
    // get platform version and device name
    const deviceSetup = capabilities.deviceName + ' : ' + capabilities.platformVersion;
    // get running spec file name
    const specFileName = getRunningSpecName(specs).runningFileName;
    // Set the name in the capability. This will be used in Sauce Labs to identify jobs with jobName equals testFileName
    if (capabilities['sauce:options']) {
      capabilities[
        'sauce:options'
      ].name = ${deviceSetup} -> ${specFileName};
    } else {
      capabilities.name = ${deviceSetup} -> ${specFileName};
    }
  },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like browser. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  async before() {
    require('@babel/register');
    improveStackTrace();
  },
  /**
   * Hook that gets executed before the suite starts
   * @param {Object} suite suite details
   */
  // beforeSuite: function (suite) {
  // },
  /**
   * Hook that gets executed before a hook within the suite starts (e.g. runs before calling
   * beforeEach in Mocha)
   */
  // beforeHook: function () {
  // },
  /**
   * Hook that gets executed after a hook within the suite starts (e.g. runs after calling
   * afterEach in Mocha)
   */
  // afterHook: function () {
  // },
  /**
   * Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
   * @param {Object} test test details
   */
  // beforeTest() {
  // },
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  // beforeCommand: function (commandName, args) {
  // },
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {Number} result 0 - command success, 1 - command error
   * @param {Object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
   * @param {Object} test test details
   */
  // afterTest: function (test) {
  // },
  /**
   * Hook that gets executed after the suite has ended
   * @param {Object} suite suite details
   */
  // afterSuite: function (suite) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   */
  after(result) {
    // Setting Up Reporting in saucelabs
    // a. Setting Build Capability in capabilities section.
    // b. Marking Tests as pass/fail.
    // Marking Tests as pass/fail. If result is 'true' then go and update the sauceJob to passed
    // Add tags info to the job.
    // For best practices tag the jobs to identify your tests. Please see this for more info https://wiki.saucelabs.com/display/DOCS/Best+Practice%3A+Use+Build+IDs%2C+Tags%2C+and+Names+to+Identify+Your+Tests
    // sauceLabsMethods.updateJobStatus({
    //   sauceUserName: process.env.SAUCE_USERNAME,
    //   sauceKey: process.env.SAUCE_KEY,
    //   sessionId: driver.sessionId,
    //   booleanPassed: getTestResultStatusPassOrFail(result),
    // });
    console.log('here is the test result', result);
    driver.deleteSession();
  },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. It is not
   * possible to defer the end of the process using a promise.
   * @param {Object} exitCode 0 - success, 1 - fail
   */
  // onComplete: function(exitCode) {
  // }
};