import { getLanguageStrings } from '../helpers/language';
import EnableLocation from '../pages/EnableLocation.po.js';
import Onboarding1 from '../pages/Onboarding1.po.js';
import Onboarding2 from '../pages/Onboarding2.po.js';
import Onboarding3 from '../pages/Onboarding3.po.js';
import Onboarding4 from '../pages/Onboarding4.po.js';

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

        await Onboarding2.isOnScreen(languageStrings);
        await Onboarding2.takeScreenshot();
        await Onboarding2.tapButton(languageStrings);

        await Onboarding3.isOnScreen(languageStrings);
        await Onboarding3.takeScreenshot();
        await Onboarding3.tapButton(languageStrings);

        await Onboarding4.isOnScreen(languageStrings);
        await Onboarding4.takeScreenshot();
        await Onboarding4.tapButton(languageStrings);

        await EnableLocation.takeScreenshot();
        await EnableLocation.tapButton(languageStrings);
        await EnableLocation.takeMenuScreenshot();
      });
    });
  });
});
