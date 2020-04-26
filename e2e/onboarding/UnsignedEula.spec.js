import { getLanguageStrings } from '../helpers/language';
import Onboarding1 from '../pages/Onboarding1.po.js';
import SignEula from '../pages/SignEula.po.js';

let languageStrings = {};

['en-US', 'ht-HT'].forEach(locale => {
  describe(`No Notifications test suite in ${locale}`, () => {
    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        languageAndLocale: {
          language: locale,
          locale,
        },
        permissions: { location: 'always', notifications: 'YES' },
      });
      languageStrings = getLanguageStrings(locale);
    });

    describe('Cannot continue without signing the EULA', () => {
      it('Does not allow the user to proceed', async () => {
        await Onboarding1.isOnScreen(languageStrings);
        await Onboarding1.tapButton(languageStrings);

        await SignEula.tapButton(languageStrings);
        await device.takeScreenshot('Unsigned Eula Continue Attempt');
      });

      afterAll(async () => {
        await device.uninstallApp();
        await device.installApp();
      });
    });
  });
});
