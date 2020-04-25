/* eslint-disable jest/expect-expect */
import { navigateThroughOnboarding } from './helpers/onboarding';

describe('Onboarding visual appearance', () => {
  it('Navigates through the onboarding without visual regression', async () => {
    const permissions = { location: 'always', notifications: 'YES' };
    await navigateThroughOnboarding(permissions);
    await device.takeScreenshot('Onboarding complete');
  });
});
