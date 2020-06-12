/* eslint-disable */
const screenshotText = 'Home';

class Home {
  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async noAuthorities(languageStrings) {
    await expect(
      element(by.label(languageStrings.home.shared.no_authorities_header)),
    ).toBeVisible();
  }

  async noNotifications(languageStrings) {
    await expect(
      element(by.label(languageStrings.home.shared.notifications_off_header)),
    ).toBeVisible();
  }
}

export default new Home();
