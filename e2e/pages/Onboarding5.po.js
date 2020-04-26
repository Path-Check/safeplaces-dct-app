/* eslint-disable */
const screenshotText = 'Onboarding - Page 5';

class Onboarding5 {
  async tapButton(languageStrings) {
    await element(by.label(languageStrings.label.launch_finish_set_up)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen(languageStrings) {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.label(languageStrings.label.launch_location_access)),
    ).toBeVisible();
  }
}

export default new Onboarding5();
