import { getLanguageStrings } from '../helpers/language';
import { navigateThroughOnboarding } from '../helpers/onboarding';
import FinishSetup from '../pages/FinishSetup.po.js';

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
        permissions: { location: 'always', notifications: 'NO' },
      });
      languageStrings = getLanguageStrings(locale);
    });

    describe('Location set to `always` and notifications `false` set', () => {
      beforeAll(async () => {
        await navigateThroughOnboarding(languageStrings);
      });

      it('Allows the user to proceed', async () => {
        await FinishSetup.isOnScreen(languageStrings);
        await FinishSetup.takeScreenshot();
        await FinishSetup.tapButton(languageStrings);
        await device.takeScreenshot('No Notification Permissions');
      });
    });

    afterAll(async () => {
      await device.uninstallApp();
      await device.installApp();
    });
  });
});
