const buttonlabel = 'Enable Location';
const screenshotText = 'Enable Location Page';
const screenShotWithMenuText = 'Location Permissions Dialog';

class EnableLocation {
  tapButton = async () => {
    await element(by.label(buttonlabel)).tap();
  };

  takeScreenshot = async () => {
    await device.takeScreenshot(screenshotText);
  };

  takeMenuScreenshot = async () => {
    await device.takeScreenshot(screenShotWithMenuText);
  };
}

export default new EnableLocation();
