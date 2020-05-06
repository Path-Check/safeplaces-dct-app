/* eslint-disable */
const screenshotText = 'Onboarding - Page 4';

class Onboarding4 {
  async tapButton(languageStrings) {
    await element(by.label(languageStrings.label.launch_set_up_phone)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen(languageStrings) {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.text(languageStrings.label.launch_screen4_header)),
    ).toBeVisible();
  }
}

export default new Onboarding4();
