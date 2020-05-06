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

  async isOnScreen(languageStrings) {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.text(languageStrings.label.launch_location_header)),
    ).toBeVisible();
  }
}

export default new EnableLocation();
