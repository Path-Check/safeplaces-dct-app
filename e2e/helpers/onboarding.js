// import EnableAuthoritySubscription from '../pages/EnableAuthoritySubscription.po.js';
// import Onboarding1 from '../pages/Onboarding1.po.js';
// import Onboarding2 from '../pages/Onboarding2.po.js';
// import Onboarding3 from '../pages/Onboarding3.po.js';
// import Onboarding4 from '../pages/Onboarding4.po.js';
// import SignEula from '../pages/SignEula.po.js';

// export const navigateThroughOnboarding = async permissions => {
//   await device.launchApp({
//     permissions,
//     newInstance: true,
//   });

//   await Onboarding1.isOnScreen();
//   await Onboarding1.tapButton();

//   await SignEula.sign();
//   await SignEula.tapButton();

//   await Onboarding2.isOnScreen();
//   await Onboarding2.tapButton();

//   await Onboarding3.isOnScreen();
//   await Onboarding3.tapButton();

//   await Onboarding4.isOnScreen();
//   await Onboarding4.tapButton();
// };

import Onboarding1 from '../pages/Onboarding1.po.js';
import Onboarding2 from '../pages/Onboarding2.po.js';
import Onboarding3 from '../pages/Onboarding3.po.js';
import Onboarding4 from '../pages/Onboarding4.po.js';
import Onboarding5 from '../pages/Onboarding5.po.js';
import SignEula from '../pages/SignEula.po.js';

export const navigateThroughOnboarding = async () => {
  await Onboarding1.isOnScreen();
  await Onboarding1.tapButton();

  await SignEula.sign();
  await SignEula.tapButton();

  await Onboarding2.isOnScreen();
  await Onboarding2.tapButton();

  await Onboarding3.isOnScreen();
  await Onboarding3.tapButton();

  await Onboarding4.isOnScreen();
  await Onboarding4.tapButton();

  await Onboarding5.isOnScreen();
  await Onboarding5.tapButton();
};
