/* eslint-disable */
const screenshotText = 'Onboarding - Page 1';

class Onboarding1 {
  async tapButton(languageStrings) {
    await element(by.label(languageStrings.label.launch_get_started)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen(languageStrings) {
    await expect(
      element(by.label(languageStrings.label.launch_screen1_header)),
    ).toBeVisible();
  }
}

export default new Onboarding1();
