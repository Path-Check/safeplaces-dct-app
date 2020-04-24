/* eslint-disable jest/expect-expect */
/* eslint-disable jest/expect-expect */
import { navigateThroughOnboarding } from './helpers/onboarding';
import FinishSetup from './pages/FinishSetup.po.js';

describe('Auto subscription disabled', () => {
  beforeAll(async () => {
    const permissions = { location: 'always', notifications: 'YES' };
    const autoSubscribe = false;
    await navigateThroughOnboarding(permissions, autoSubscribe);
  });

  it('Displays an error page about missing location permissions', async () => {
    await FinishSetup.isOnScreen();
    await FinishSetup.takeScreenshot();
    await FinishSetup.tapButton();
    await device.takeScreenshot('No Location Permissions');
  });
});
