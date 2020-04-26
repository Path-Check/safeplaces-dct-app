import Onboarding1 from '../pages/Onboarding1.po.js';
import Onboarding2 from '../pages/Onboarding2.po.js';
import Onboarding3 from '../pages/Onboarding3.po.js';
import Onboarding4 from '../pages/Onboarding4.po.js';
import Onboarding5 from '../pages/Onboarding5.po.js';
import SignEula from '../pages/SignEula.po.js';

export const navigateThroughOnboarding = async languageStrings => {
  await Onboarding1.isOnScreen(languageStrings);
  await Onboarding1.tapButton(languageStrings);

  await SignEula.sign(languageStrings);
  await SignEula.tapButton(languageStrings);

  await Onboarding2.isOnScreen(languageStrings);
  await Onboarding2.tapButton(languageStrings);

  await Onboarding3.isOnScreen(languageStrings);
  await Onboarding3.tapButton(languageStrings);

  await Onboarding4.isOnScreen(languageStrings);
  await Onboarding4.tapButton(languageStrings);

  await Onboarding5.isOnScreen(languageStrings);
  await Onboarding5.finishSetup(languageStrings);
};
