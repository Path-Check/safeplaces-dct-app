/* eslint-disable jest/expect-expect */
import { navigateThroughOnboarding } from './helpers/onboarding';
import FinishSetup from './pages/FinishSetup.po.js';

describe('Location set to `inuse` and notifications `true` set', () => {
  beforeAll(async () => {
    const permissions = { location: 'inuse', notifications: 'YES' };
    const autoSubscribe = true;
    await navigateThroughOnboarding(permissions, autoSubscribe);
  });

  it('Displays an error page about missing location permissions', async () => {
    await FinishSetup.isOnScreen();
    await FinishSetup.takeScreenshot();
    await FinishSetup.tapButton();
    await device.takeScreenshot('No Location Permissions');
  });
});
