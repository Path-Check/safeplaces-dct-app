/* eslint-disable */
const screenshotText = 'Onboarding - Page 2';

class Onboarding2 {
  async tapButton(languageStrings) {
    await element(by.label(languageStrings.label.launch_next)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen(languageStrings) {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.label(languageStrings.label.launch_screen2_header_location)),
    ).toBeVisible();
  }
}

export default new Onboarding2();
