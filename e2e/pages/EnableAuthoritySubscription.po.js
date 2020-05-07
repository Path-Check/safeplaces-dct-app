class EnableAuthoritySubscription {
  async enable(languageStrings) {
    await element(
      by.label(languageStrings.label.launch_enable_auto_subscription),
    ).tap();
  }

  async skipStep(languageStrings) {
    await element(by.text(languageStrings.label.skip_this_step)).tap();
  }

  async takeScreenshot() {
    await device.takeScreenshot('Authority Subscription Page');
  }

  async isOnScreen(languageStrings) {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.text(languageStrings.label.launch_authority_header)),
    ).toBeVisible();
  }
}

export default new EnableAuthoritySubscription();
