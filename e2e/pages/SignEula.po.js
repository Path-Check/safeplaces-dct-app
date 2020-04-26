/* eslint-disable */
const screenshotText = 'EULA Accept Page';

class SignEula {
  async tapButton(languageStrings) {
    await element(by.label(languageStrings.onboarding.eula_continue)).tap();
  }

  async sign(languageStrings) {
    await element(by.text(languageStrings.onboarding.eula_checkbox)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }
}

export default new SignEula();
