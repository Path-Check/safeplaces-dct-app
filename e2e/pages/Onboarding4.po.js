const buttonlabel = 'Set up my phone';
const screenText =
  "You're in complete control. Data is only saved on your phone.";
const screenshotText = 'Fourth Onboarding Page';

class Onboarding4 {
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

export default new Onboarding4();
