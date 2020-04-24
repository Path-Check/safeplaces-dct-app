const buttonlabel = 'Enable Notifications';
const screenshotText = 'Enable Notifications Page';
const screenShotWithMenuText = 'Notifications Permissions Dialog';

class EnableNotifications {
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

export default new EnableNotifications();
