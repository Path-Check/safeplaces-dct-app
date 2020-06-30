import FinishSetup from '../pages/FinishSetup.po.js';
import Onboarding1 from '../pages/Onboarding1.po.js';
import PersonalPrivacy from '../pages/PersonalPrivacy.po.js';
import NotificatioNDetails from '../pages/NotificationDetails.po.js';
import ShareDiagnosis from '../pages/ShareDiagnosis.po.js';
import SignEula from '../pages/SignEula.po.js';

export const navigateThroughPermissions = async (languageStrings) => {
  await Onboarding1.isOnScreen(languageStrings);
  await Onboarding1.tapButton(languageStrings);

  await SignEula.sign(languageStrings);
  await SignEula.tapButton(languageStrings);

  await PersonalPrivacy.isOnScreen(languageStrings);
  await PersonalPrivacy.tapButton(languageStrings);

  await NotificatioNDetails.isOnScreen(languageStrings);
  await NotificatioNDetails.tapButton(languageStrings);

  await ShareDiagnosis.isOnScreen(languageStrings);
  await ShareDiagnosis.tapButton(languageStrings);
};

export const navigateThroughOnboarding = async (languageStrings) => {
  await navigateThroughPermissions(languageStrings);
  await FinishSetup.isOnScreenNotifications(languageStrings);
  await element(by.label(languageStrings.label.launch_enable_notif)).tap();
  await FinishSetup.takeScreenshot(languageStrings);
  await FinishSetup.isOnScreenLocation(languageStrings);
  await element(by.label(languageStrings.label.launch_allow_location)).tap();
};
