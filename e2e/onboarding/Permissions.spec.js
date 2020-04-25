import { getLanguageStrings } from '../helpers/language';
import { navigateThroughOnboarding } from '../helpers/onboarding';
import FinishSetup from '../pages/FinishSetup.po.js';

let languageStrings = {};

['en-US', 'ht-HT'].forEach(locale => {
  describe(`Permissions test suite in ${locale}`, () => {
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
    describe('Permissions: Location `always` and notifications `true` are chosen', () => {
      beforeAll(async () => {
        await navigateThroughOnboarding(languageStrings);
      });

      it('Successfully completes device setup', async () => {
        await FinishSetup.isOnScreen(languageStrings);
        await FinishSetup.takeScreenshot();
        await FinishSetup.tapButton(languageStrings);
        await device.takeScreenshot('Post Setup');
      });

      afterAll(async () => {
        await device.uninstallApp();
        await device.installApp();
      });
    });
  });
});
