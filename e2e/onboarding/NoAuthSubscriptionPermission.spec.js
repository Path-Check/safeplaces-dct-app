/* eslint-disable jest/expect-expect */
import { languages } from '../helpers/language';
import { navigateThroughOnboarding } from '../helpers/onboarding';
import Home from '../pages/Home.po.js';

describe.each(languages)(
  `Healthcare Authority auto subscription in %s`,
  (locale, languageStrings) => {
    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        languageAndLocale: {
          language: locale,
          locale,
        },
        permissions: { location: 'always', notifications: 'YES' },
      });
    });

    describe('When skipping the auto subscribe step', () => {
      beforeAll(async () => {
        await navigateThroughOnboarding(languageStrings);
      });

      it('Shows auto subscribe as unset', async () => {
        await Home.takeScreenshot();
      });
    });

    afterAll(async () => {
      await device.uninstallApp();
      await device.installApp();
    });
  },
);
