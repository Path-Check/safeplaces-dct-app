import EnableAuthoritySubscription from '../pages/EnableAuthoritySubscription.po.js';
import FinishSetup from '../pages/FinishSetup.po.js';
import Onboarding1Screen from '../pages/Onboarding1Screen.po.js';
import Onboarding2Screen from '../pages/Onboarding2Screen.po.js';
import Onboarding3Screen from '../pages/Onboarding3Screen.po.js';
import Onboarding4Screen from '../pages/Onboarding4Screen.po.js';
import SignEula from '../pages/SignEula.po.js';

export const navigateThroughPermissions = async languageStrings => {
  await Onboarding1Screen.isOnScreen(languageStrings);
  await Onboarding1Screen.tapButton(languageStrings);

  await SignEula.sign(languageStrings);
  await SignEula.tapButton(languageStrings);

  await Onboarding2Screen.isOnScreen(languageStrings);
  await Onboarding2Screen.tapButton(languageStrings);

  await Onboarding3Screen.isOnScreen(languageStrings);
  await Onboarding3Screen.tapButton(languageStrings);

  await Onboarding4Screen.isOnScreen(languageStrings);
  await Onboarding4Screen.tapButton(languageStrings);
};

export const navigateThroughOnboarding = async languageStrings => {
  await navigateThroughPermissions(languageStrings);
  await FinishSetup.isOnScreen(languageStrings);
  await FinishSetup.takeScreenshot(languageStrings);
  await FinishSetup.tapButton(languageStrings);
};
