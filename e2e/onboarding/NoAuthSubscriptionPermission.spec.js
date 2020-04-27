/* eslint-disable jest/expect-expect */
import { languages } from '../helpers/language';
import { navigateThroughOnboarding } from '../helpers/onboarding';

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

    it('Shows auto subscription as unset', async () => {
      await navigateThroughOnboarding(languageStrings);
      await device.takeScreenshot('No Auto Subscription');
    });
  },
);
