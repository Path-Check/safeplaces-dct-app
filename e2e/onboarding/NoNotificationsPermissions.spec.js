import { languages } from '../helpers/language';
import { navigateThroughOnboarding } from '../helpers/onboarding';
import Home from '../pages/Home.po.js';

describe.each(languages)(
  `No Notifications test suite in %s`,
  (locale, languageStrings) => {
    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        languageAndLocale: {
          language: locale,
          locale,
        },
        permissions: { location: 'always', notifications: 'NO' },
      });
    });

    describe('Location set to `always` and notifications `false` set', () => {
      beforeAll(async () => {
        await navigateThroughOnboarding(languageStrings);
      });

      it('Allows the user to go to the Home page and does not display a notification', async () => {
        await Home.hasNoKnownContact(languageStrings);
        await Home.takeScreenshot();
      });
    });

    afterAll(async () => {
      await device.uninstallApp();
      await device.installApp();
    });
  },
);
