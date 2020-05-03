import { languages } from '../helpers/language';
import Onboarding1Screen from '../pages/Onboarding1Screen.po.js';
import Onboarding2Screen from '../pages/Onboarding2Screen.po.js';
import Onboarding3Screen from '../pages/Onboarding3Screen.po.js';
import Onboarding4Screen from '../pages/Onboarding4Screen.po.js';
import SignEula from '../pages/SignEula.po.js';

describe.each(languages)(
  `Onboarding test suite in %s`,
  (locale, languageStrings) => {
    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        languageAndLocale: {
          language: locale,
          locale,
        },
      });
    });

    describe('Onboarding visual appearance', () => {
      it('Navigates through the onboarding without visual regression', async () => {
        await Onboarding1Screen.isOnScreen(languageStrings);
        await Onboarding1Screen.takeScreenshot();
        await Onboarding1Screen.tapButton(languageStrings);

        await SignEula.sign(languageStrings);
        await SignEula.takeScreenshot();
        await SignEula.tapButton(languageStrings);

        await Onboarding2Screen.isOnScreen(languageStrings);
        await Onboarding2Screen.takeScreenshot();
        await Onboarding2Screen.tapButton(languageStrings);

        await Onboarding3Screen.isOnScreen(languageStrings);
        await Onboarding3Screen.takeScreenshot();
        await Onboarding3Screen.tapButton(languageStrings);

        await Onboarding4Screen.isOnScreen(languageStrings);
        await Onboarding4Screen.takeScreenshot();
        await Onboarding4Screen.tapButton(languageStrings);
      });

      afterAll(async () => {
        await device.uninstallApp();
        await device.installApp();
      });
    });
  },
);
