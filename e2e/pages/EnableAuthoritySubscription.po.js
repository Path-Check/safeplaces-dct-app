const buttonlabel = 'Enable auto subscription';
const screenshotText = 'Authority Subscription Page';
const screenText =
  'Automatically subscribe to receive the latest updates from Healthcare Authorities in your area.';
const skipStep = 'Skip this step';

class EnableAuthoritySubscription {
  async enable() {
    await element(by.label(buttonlabel)).tap();
  }

  async skipStep() {
    await element(by.text(skipStep).tap());
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen() {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(element(by.text(screenText))).toBeVisible();
  }
}

export default new EnableAuthoritySubscription();
