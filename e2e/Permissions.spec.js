/* eslint-disable jest/expect-expect */
import { navigateThroughPermissions } from './helpers/onboarding';
import EnableAuthoritySubscription from './pages/EnableAuthoritySubscription.po.js';

describe('Permissions: Location `always` and notifications `true` are chosen', () => {
  it('Successfully goes through all device permisison steps', async () => {
    const permissions = { location: 'always', notifications: 'YES' };
    await navigateThroughPermissions(permissions);

    await EnableAuthoritySubscription.isOnScreen();
    await EnableAuthoritySubscription.takeScreenshot();

    await device.takeScreenshot('Device Permissions Set');
  });
});
