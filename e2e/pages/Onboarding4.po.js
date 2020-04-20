/* eslint-disable */
const buttonlabel = 'Set up my phone';
const screenText =
  "You're in complete control. Data is only saved on your phone.";
const screenshotText = 'Onboarding - Page 4';

class Onboarding4 {
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

export default new Onboarding4();
