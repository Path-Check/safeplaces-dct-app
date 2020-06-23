/* eslint-disable */
const screenshotText = 'Finish Setup Page';

class FinishSetup {
  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }
  async isOnScreenLocation(languageStrings) {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.label(languageStrings.label.launch_allow_location)),
    ).toBeVisible();
  }

  async isOnScreenNotifications(languageStrings) {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.label(languageStrings.label.launch_enable_notif)),
    ).toBeVisible();
  }
}

export default new FinishSetup();
