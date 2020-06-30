/* eslint-disable */
const screenshotText = 'Onboarding - Page 1';

class Welcome {
  async tapButton(languageStrings) {
    await element(by.label(languageStrings.label.launch_get_started)).tap();
  }

  async tapGetStarted() {
    await element(by.id('welcome-button')).tap();
  }

  async tapCheckbox() {
    await element(by.id('welcome-eula-checkbox')).tap();
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

export default new Welcome();
