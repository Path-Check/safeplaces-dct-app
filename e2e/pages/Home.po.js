/* eslint-disable */
const screenshotText = 'Home';

class Home {
  async takeScreenshot() {
    await device.takeScreenshot(screenshotText);
  }

  async hasNoKnownContact(languageStrings) {
    await expect(
      element(by.label(languageStrings.label.home_no_contact_header)),
    ).toBeVisible();
  }

  async hasLocationDisabled(languageStrings) {
    await expect(
      element(by.label(languageStrings.label.home_unknown_header)),
    ).toBeVisible();
    await expect(
      element(by.label(languageStrings.label.home_unknown_subtext)),
    ).toBeVisible();
  }

  async hasLocationHistoryDisabled(languageStrings) {
    await expect(
      element(by.label(languageStrings.label.home_setting_off_header)),
    ).toBeVisible();
    await expect(
      element(by.label(languageStrings.label.home_setting_off_subtext)),
    ).toBeVisible();
  }
}

export default new Home();
