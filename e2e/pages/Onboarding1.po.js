const buttonlabel = 'Get Started';
const screenText = 'The way back to normal starts here.';
const screenshotText = 'First Onboarding Page';

class Onboarding1 {
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

export default new Onboarding1();
