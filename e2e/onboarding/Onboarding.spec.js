import { getLanguageStrings } from '../helpers/language';
import Onboarding1 from '../pages/Onboarding1.po.js';
import Onboarding2 from '../pages/Onboarding2.po.js';
import Onboarding3 from '../pages/Onboarding3.po.js';
import Onboarding4 from '../pages/Onboarding4.po.js';
import Onboarding5 from '../pages/Onboarding5.po.js';
import SignEula from '../pages/SignEula.po.js';

let languageStrings = {};

['en-US', 'ht-HT'].forEach(locale => {
  describe(`Onboarding test suite in ${locale}`, () => {
    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        languageAndLocale: {
          language: locale,
          locale,
        },
      });
      languageStrings = getLanguageStrings(locale);
    });

    describe('Onboarding visual appearance', () => {
      it('Navigates through the onboarding without visual regression', async () => {
        await Onboarding1.isOnScreen(languageStrings);
        await Onboarding1.takeScreenshot();
        await Onboarding1.tapButton(languageStrings);

        await SignEula.sign(languageStrings);
        await SignEula.takeScreenshot();
        await SignEula.tapButton(languageStrings);

        await Onboarding2.isOnScreen(languageStrings);
        await Onboarding2.takeScreenshot();
        await Onboarding2.tapButton(languageStrings);

        await Onboarding3.isOnScreen(languageStrings);
        await Onboarding3.takeScreenshot();
        await Onboarding3.tapButton(languageStrings);

        await Onboarding4.isOnScreen(languageStrings);
        await Onboarding4.takeScreenshot();
        await Onboarding4.tapButton(languageStrings);

        await Onboarding5.isOnScreen(languageStrings);
        await Onboarding5.takeScreenshot();

        await Onboarding5.enableLocation(languageStrings);
        await Onboarding5.takeMenuScreenshot();
      });

      afterAll(async () => {
        await device.uninstallApp();
        await device.installApp();
      });
    });
  });
});
