/* eslint-disable */
const buttonLabel = 'Skip';
const screenTitle = 'Google Maps';
const screenSubtitle =
  'To see if you encountered someone with COVID-19 prior to downloading this app, you can import your personal location history.';
const screenshotText = 'Onboarding - Page 5';

class Onboarding5 {
  async tapButton() {
    await element(by.label(buttonLabel)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen() {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(element(by.text(screenTitle))).toBeVisible();
    await expect(element(by.text(screenSubtitle))).toBeVisible();
  }
}

export default new Onboarding5();
