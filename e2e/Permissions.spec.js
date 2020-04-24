/* eslint-disable jest/expect-expect */
import { navigateThroughOnboarding } from './helpers/onboarding';
import EnableAuthoritySubscription from './pages/EnableAuthoritySubscription.po.js';

describe('Permissions: Location `always` and notifications `true` are chosen', () => {
  beforeAll(async () => {
    const permissions = { location: 'always', notifications: 'YES' };
    await navigateThroughOnboarding(permissions);
  });

  it('Successfully goes through all device permisison steps', async () => {
    await EnableAuthoritySubscription.isOnScreen();
    await EnableAuthoritySubscription.takeScreenshot();
    await device.takeScreenshot('Device Permissions Setup');
  });
});
