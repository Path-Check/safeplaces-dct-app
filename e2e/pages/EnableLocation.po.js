const screenshotText = 'Enable Location Page';
const screenShotWithMenuText = 'Location Permissions Dialog';

class EnableLocation {
  async tapButton(languageStrings) {
    await element(by.label(languageStrings.label.launch_enable_location)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async takeMenuScreenshot() {
    await device.takeScreenshot(screenShotWithMenuText);
  }
}

export default new EnableLocation();
