const buttonlabel = 'Enable Location';
const screenshotText = 'Enable Location Page';
const screenShotWithMenuText = 'Location Permissions Dialog';

class EnableLocation {
  async tapButton() {
    await element(by.label(buttonlabel)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async takeMenuScreenshot() {
    await device.takeScreenshot(screenShotWithMenuText);
  }
}

export default new EnableLocation();
