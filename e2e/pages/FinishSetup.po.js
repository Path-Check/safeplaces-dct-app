const buttonlabel = 'Finish Setup';
const screenText = 'All finished';
const screenshotText = 'Finish Setup Page';

class EnableLocation {
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

export default new EnableLocation();
