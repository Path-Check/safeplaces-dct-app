/* eslint-disable */
const buttonLabel = 'Next';
const screenTitle = 'Header';
const screenSubtitle = 'Subheader';
const screenshotText = 'Onboarding - Page 6';

class Onboarding6 {
  async tapButton() {
    await element(by.label(buttonLabel)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen() {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(element(by.id(screenTitle))).toBeVisible();
    await expect(element(by.id(screenSubtitle))).toBeVisible();
  }
}

export default new Onboarding6();
