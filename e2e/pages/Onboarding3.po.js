/* eslint-disable */
const buttonlabel = 'Next';
const screenText =
  'If you test positive, you can choose to donate your data anonymously';
const screenshotText = 'Onboarding - Page 3';

class Onboarding3 {
  async tapButton() {
    await element(by.label(buttonlabel)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen() {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(element(by.text(screenText))).toBeVisible();
  }
}

export default new Onboarding3();
