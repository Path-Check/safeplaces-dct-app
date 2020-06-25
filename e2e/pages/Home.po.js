/* eslint-disable */
const screenshotText = 'Home';

class Home {
  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async noNotifications(languageStrings) {
    await expect(
      element(by.label(languageStrings.home.shared.notifications_off_header)),
    ).toBeVisible();
  }
}

export default new Home();
