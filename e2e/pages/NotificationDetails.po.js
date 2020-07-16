/* eslint-disable */
const screenshotText = 'Onboarding - Page 3';

class NotificationDetails {
  async tapButton(languageStrings) {
    // replacing a replace for a navigate here leaves the previous view
    // compressed and the `Next` label shows up in the tree
    await element(by.label(languageStrings.label.launch_next)).atIndex(0).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async isOnScreen(languageStrings) {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.label(languageStrings.label.launch_screen3_header_location)),
    ).toBeVisible();
  }
}

export default new NotificationDetails();
