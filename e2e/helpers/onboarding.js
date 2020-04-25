import EnableAuthoritySubscription from '../pages/EnableAuthoritySubscription.po.js';
import FinishSetup from '../pages/FinishSetup.po.js';
import Onboarding1 from '../pages/Onboarding1.po.js';
import Onboarding2 from '../pages/Onboarding2.po.js';
import Onboarding3 from '../pages/Onboarding3.po.js';
import Onboarding4 from '../pages/Onboarding4.po.js';
import SignEula from '../pages/SignEula.po.js';

export const navigateThroughPermissions = async permissions => {
  await device.launchApp({
    permissions,
    newInstance: true,
  });

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
};

export const navigateThroughOnboarding = async (
  permissions,
  isAutoSubcribe = true,
) => {
  await navigateThroughPermissions(permissions);

  await EnableAuthoritySubscription.isOnScreen();

  if (isAutoSubcribe) {
    await EnableAuthoritySubscription.enable();
  } else {
    await EnableAuthoritySubscription.skipStep();
  }

  await FinishSetup.isOnScreen();
  await FinishSetup.takeScreenshot();
  await FinishSetup.tapButton();
};
