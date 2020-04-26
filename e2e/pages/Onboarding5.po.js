/* eslint-disable */
const screenshotText = 'Onboarding - Page 5';
const screenShotWithMenuText = 'Location Permissions Dialog';

class Onboarding5 {
  async finishSetup(languageStrings) {
    await element(by.label(languageStrings.label.launch_finish_set_up)).tap();
  }

  async enableLocation(languageStrings) {
    await element(by.label(languageStrings.label.launch_enable_location)).tap();
  }

  async enableNotification(languageStrings) {
    await element(by.label(languageStrings.label.launch_enable_notif)).tap();
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
      element(by.label(languageStrings.label.launch_location_access)),
    ).toBeVisible();
  }
}

export default new Onboarding5();
