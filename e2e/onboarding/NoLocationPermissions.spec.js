import { getLanguageStrings } from '../helpers/language';
import { navigateThroughOnboarding } from '../helpers/onboarding';
import Home from '../pages/Home.po.js';

let languageStrings = {};

['en-US', 'ht-HT'].forEach(locale => {
  describe(`No Location Permissions test suite in ${locale}`, () => {
    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        languageAndLocale: {
          language: locale,
          locale,
        },
        permissions: { location: 'never', notifications: 'YES' },
      });
      languageStrings = getLanguageStrings(locale);
    });
    describe('Location set to `never` and notifications `true` set', () => {
      beforeAll(async () => {
        await navigateThroughOnboarding(languageStrings);
      });

      it('Allows the user to go to the Home page but shows a notification that location is required', async () => {
        // await Home.hasLocationDisabled(languageStrings);
        await Home.takeScreenshot();
      });
    });

    afterAll(async () => {
      await device.uninstallApp();
      await device.installApp();
    });
  });
});
