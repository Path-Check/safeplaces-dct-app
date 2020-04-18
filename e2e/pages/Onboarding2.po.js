const buttonlabel = 'Next';
const screenText =
  'Get notified if you cross paths with someone later diagnosed for COVID-19.';
const screenshotText = 'Second Onboarding Page';

class Onboarding2 {
  tapButton = async () => {
    await element(by.label(buttonlabel)).tap();
  };

  isOnScreen = async () => {
    await expect(element(by.text(screenText))).toBeVisible();
  };

  takeScreenshot = async () => {
    await device.takeScreenshot(screenshotText);
  };
}

export default new Onboarding2();
