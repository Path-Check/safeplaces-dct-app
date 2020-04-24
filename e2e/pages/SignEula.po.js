/* eslint-disable */
const buttonlabel = 'Continue';
const signCheckboxLabel = 'I accept the licensing agreement';
const screenshotText = 'EULA Accept Page';

class SignEula {
  async tapButton() {
    await element(by.label(buttonlabel)).tap();
  }

  async sign() {
    await element(by.text(signCheckboxLabel)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }
}

export default new SignEula();
