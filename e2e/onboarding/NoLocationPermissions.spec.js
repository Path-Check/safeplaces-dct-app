import { getLanguageStrings } from '../helpers/language';
import { navigateThroughOnboarding } from '../helpers/onboarding';
import FinishSetup from '../pages/FinishSetup.po.js';

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

      it('Displays an error page about missing location permissions', async () => {
        await FinishSetup.isOnScreen(languageStrings);
        await FinishSetup.takeScreenshot();
        await FinishSetup.tapButton(languageStrings);
        await device.takeScreenshot('No Location Permissions');
      });
    });
    afterAll(async () => {
      await device.uninstallApp();
      await device.installApp();
    });
  });
});
