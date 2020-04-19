const buttonlabel = 'Next';
const screenText =
  'Get notified if you cross paths with someone later diagnosed for COVID-19.';
const screenshotText = 'Onboarding - Page 2';

class Onboarding2 {
  async tapButton() {
    await element(by.label(buttonlabel)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen() {
    await expect(element(by.text(screenText))).toBeVisible();
  }
}

export default new Onboarding2();
