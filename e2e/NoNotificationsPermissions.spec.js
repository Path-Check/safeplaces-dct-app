/* eslint-disable jest/expect-expect */
import { navigateThroughOnboarding } from './helpers/onboarding';
import FinishSetup from './pages/FinishSetup.po.js';

describe('Location set to `always` and notifications `false` set', () => {
  beforeAll(async () => {
    const permissions = { location: 'always', notifications: 'NO' };
    const autoSubscribe = true;
    await navigateThroughOnboarding(permissions, autoSubscribe);
  });

  it('Allows the user to proceed', async () => {
    await FinishSetup.isOnScreen();
    await FinishSetup.takeScreenshot();
    await FinishSetup.tapButton();
    await device.takeScreenshot('No Notification Permissions');
  });
});
