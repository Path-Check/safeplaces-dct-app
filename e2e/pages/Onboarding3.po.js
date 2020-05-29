/* eslint-disable */
const screenshotText = 'Onboarding - Page 3';

class Onboarding3 {
  async tapButton(languageStrings) {
    await element(by.label(languageStrings.label.launch_next)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen(languageStrings) {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.label(languageStrings.label.launch_screen3_header_location)),
    ).toBeVisible();
  }
}

export default new Onboarding3();
