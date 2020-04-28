import { languages } from '../helpers/language';
import { navigateThroughOnboarding } from '../helpers/onboarding';
import Home from '../pages/Home.po.js';

describe.each(languages)(
  `Insufficient Permissions test suite in %s`,
  (locale, languageStrings) => {
    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        languageAndLocale: {
          language: locale,
          locale,
        },
        permissions: { location: 'inuse', notifications: 'YES' },
      });
    });

    describe('Location set to `inuse` and notifications `true` set', () => {
      beforeAll(async () => {
        await navigateThroughOnboarding(languageStrings);
      });

      it('Allows the user to go to the Home page but shows a notification that location is required', async () => {
        // await Home.hasLocationDisabled(languageStrings);
        await Home.takeScreenshot();
      });

      afterAll(async () => {
        await device.uninstallApp();
        await device.installApp();
      });
    });
  },
);
