const buttonlabel = 'Get Started';
const screenText = 'The way back to normal starts here.';
const screenshotText = 'First Onboarding Page';

class Onboarding1 {
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

export default new Onboarding1();
