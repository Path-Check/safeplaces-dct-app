import { navigateThroughOnboarding } from './helpers/onboarding';
import FinishSetup from './pages/FinishSetup.po.js';

describe('Location set to `never` and notifications `true` set', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: { location: 'never', notifications: 'YES' },
      newInstance: true,
    });
    await navigateThroughOnboarding();
  });

  it('Displays an error page about missing location permissions', async () => {
    await FinishSetup.isOnScreen();
    await FinishSetup.takeScreenshot();
    await FinishSetup.tapButton();
    await device.takeScreenshot('No Location Permissions');
  });
});
