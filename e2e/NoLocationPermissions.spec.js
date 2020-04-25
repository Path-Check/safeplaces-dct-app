/* eslint-disable jest/expect-expect */
import { navigateThroughOnboarding } from './helpers/onboarding';

describe('Location set to `never` and notifications `true` set', () => {
  it('Displays an error page about missing location permissions', async () => {
    const permissions = { location: 'never', notifications: 'YES' };
    await navigateThroughOnboarding(permissions);
    await device.takeScreenshot('No Location Permissions');
  });
});
