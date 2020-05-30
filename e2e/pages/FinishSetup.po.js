/* eslint-disable */
const screenshotText = 'Finish Setup Page';

class FinishSetup {
  async tapButton() {
    await element(by.id('onboarding-permissions-button')).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen() {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(element(by.id('onboarding-permissions-screen'))).toBeVisible();
  }
}

export default new FinishSetup();
