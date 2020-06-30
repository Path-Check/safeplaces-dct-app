import FinishSetup from '../pages/FinishSetup.po.js';
import Onboarding1 from '../pages/Onboarding1.po.js';
import Onboarding2 from '../pages/Onboarding2.po.js';
import Onboarding3 from '../pages/Onboarding3.po.js';
import Onboarding4 from '../pages/Onboarding4.po.js';

export const navigateThroughPermissions = async (languageStrings) => {
  await Onboarding1.isOnScreen(languageStrings);
  await Onboarding1.tapCheckbox();
  await Onboarding1.tapGetStarted();

  await Onboarding2.isOnScreen(languageStrings);
  await Onboarding2.tapButton(languageStrings);

  await Onboarding3.isOnScreen(languageStrings);
  await Onboarding3.tapButton(languageStrings);

  await Onboarding4.isOnScreen(languageStrings);
  await Onboarding4.tapButton(languageStrings);
};

export const navigateThroughOnboarding = async (languageStrings) => {
  await navigateThroughPermissions(languageStrings);
  await FinishSetup.isOnScreenNotifications(languageStrings);
  await element(by.label(languageStrings.label.launch_enable_notif)).tap();
  await FinishSetup.takeScreenshot(languageStrings);
  await FinishSetup.isOnScreenLocation(languageStrings);
  await element(by.label(languageStrings.label.launch_allow_location)).tap();
};
