/* eslint-disable */
const screenshotText = 'Finish Setup Page';

class FinishSetup {
  async tapButton(languageStrings) {
    await element(by.label(languageStrings.label.launch_finish_set_up)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen(languageStrings) {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.label(languageStrings.label.launch_done_header)),
    ).toBeVisible();
  }
}

export default new FinishSetup();
