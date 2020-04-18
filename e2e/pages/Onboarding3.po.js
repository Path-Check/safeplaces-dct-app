const buttonlabel = 'Next';
const screenText =
  'If you test positive, you can choose to donate your data anonymously';
const screenshotText = 'Third Onboarding Page';

class Onboarding3 {
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

export default new Onboarding3();
