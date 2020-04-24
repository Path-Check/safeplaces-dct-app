const buttonlabel = 'Enable Location';
const screenshotText = 'Enable Location Page';
const skipStep = 'Skip this step';

class EnableAuthoritySubscription {
  async tapButton() {
    await element(by.label(buttonlabel)).tap();
  }

  async skipStep() {
    await element(by.text(skipStep).tap());
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }
}

export default new EnableAuthoritySubscription();
