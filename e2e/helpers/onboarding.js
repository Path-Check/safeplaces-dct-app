import Onboarding1 from '../pages/Onboarding1.po.js';
import Onboarding2 from '../pages/Onboarding2.po.js';
import Onboarding3 from '../pages/Onboarding3.po.js';
import Onboarding4 from '../pages/Onboarding4.po.js';
import Onboarding5 from '../pages/Onboarding5.po.js';
import Onboarding6 from '../pages/Onboarding6.po.js';

export const navigateThroughOnboarding = async () => {
  await Onboarding1.isOnScreen();
  await Onboarding1.tapButton();

  await Onboarding2.isOnScreen();
  await Onboarding2.tapButton();

  await Onboarding3.isOnScreen();
  await Onboarding3.tapButton();

  await Onboarding4.isOnScreen();
  await Onboarding4.tapButton();

  await Onboarding5.isOnScreen();
  await Onboarding5.tapButton();

  await Onboarding6.isOnScreen();
  await Onboarding6.tapButton();
};
