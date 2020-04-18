const buttonlabel = 'Next';
const screenText =
  'If you test positive, you can choose to donate your data anonymously';
const screenshotText = 'Third Onboarding Page';

class Onboarding3 {
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

export default new Onboarding3();
