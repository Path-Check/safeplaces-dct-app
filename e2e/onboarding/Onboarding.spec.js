import { languages } from '../helpers/language';
import Welcome from '../pages/Welcome.po.js';
import PersonalPrivacy from '../pages/PersonalPrivacy.po.js';
import NotificationDetails from '../pages/NotificationDetails.po.js';
import ShareDiagnosis from '../pages/ShareDiagnosis.po.js';
import SignEula from '../pages/SignEula.po.js';

describe.each(languages)(
  `Onboarding test suite in %s`,
  (locale, languageStrings) => {
    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        languageAndLocale: {
          language: locale,
          locale,
        },
      });
    });

    describe('Onboarding visual appearance', () => {
      it('Navigates through the onboarding without visual regression', async () => {
        await Welcome.isOnScreen(languageStrings);
        await Welcome.takeScreenshot();
        await Welcome.tapButton(languageStrings);

        await SignEula.sign(languageStrings);
        await SignEula.takeScreenshot();
        await SignEula.tapButton(languageStrings);

        await PersonalPrivacy.isOnScreen(languageStrings);
        await PersonalPrivacy.takeScreenshot();
        await PersonalPrivacy.tapButton(languageStrings);

        await NotificationDetails.isOnScreen(languageStrings);
        await NotificationDetails.takeScreenshot();
        await NotificationDetails.tapButton(languageStrings);

        await ShareDiagnosis.isOnScreen(languageStrings);
        await ShareDiagnosis.takeScreenshot();
        await ShareDiagnosis.tapButton(languageStrings);
      });

      afterAll(async () => {
        await device.uninstallApp();
        await device.installApp();
      });
    });
  },
);
