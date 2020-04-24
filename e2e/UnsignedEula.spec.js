import Onboarding1 from './pages/Onboarding1.po.js';
import SignEula from './pages/SignEula.po.js';

describe('Cannot continue without signing the EULA', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
  });

  it('Does not allow the user to proceed', async () => {
    await Onboarding1.isOnScreen();
    await Onboarding1.tapButton();

    await SignEula.tapButton();
    await SignEula.takeScreenshot();
    await device.takeScreenshot('Unsigned Eula Continue Attempt');
  });
});
