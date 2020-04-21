import EnableLocation from './pages/EnableLocation.po.js';
import Onboarding1 from './pages/Onboarding1.po.js';
import Onboarding2 from './pages/Onboarding2.po.js';
import Onboarding3 from './pages/Onboarding3.po.js';
import Onboarding4 from './pages/Onboarding4.po.js';

describe('Onboarding visual appearance', () => {
  it('Navigates through the onboarding without visual regression', async () => {
    await device.launchApp({
      newInstance: true,
    });

    await Onboarding1.isOnScreen();
    await Onboarding1.takeScreenshot();
    await Onboarding1.tapButton();

    await Onboarding2.isOnScreen();
    await Onboarding2.takeScreenshot();
    await Onboarding2.tapButton();

    await Onboarding3.isOnScreen();
    await Onboarding3.takeScreenshot();
    await Onboarding3.tapButton();

    await Onboarding4.isOnScreen();
    await Onboarding4.takeScreenshot();
    await Onboarding4.tapButton();

    await EnableLocation.takeScreenshot();
    await EnableLocation.tapButton();
    await EnableLocation.takeMenuScreenshot();
  });
});
