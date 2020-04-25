/* eslint-disable jest/expect-expect */
import { navigateThroughOnboarding } from './helpers/onboarding';

describe('Auto subscription disabled', () => {
  it('Shows auto subscription as unset', async () => {
    const permissions = { location: 'always', notifications: 'YES' };
    await navigateThroughOnboarding(permissions);
    await device.takeScreenshot('No Auto Subscription');
  });
});
