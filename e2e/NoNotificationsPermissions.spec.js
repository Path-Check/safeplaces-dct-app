/* eslint-disable jest/expect-expect */
import { navigateThroughPermissions } from './helpers/onboarding';

describe('Location set to `always` and notifications `false` set', () => {
  it('Shows location status as set and notifications as unset', async () => {
    const permissions = { location: 'always', notifications: 'NO' };
    await navigateThroughPermissions(permissions);
    await device.takeScreenshot('No Notification Permissions');
  });
});
