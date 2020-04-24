/* eslint-disable jest/expect-expect */
import { navigateThroughOnboarding } from './helpers/onboarding';
import FinishSetup from './pages/FinishSetup.po.js';

describe('Permissions: Location `always` and notifications `true` are chosen', () => {
  beforeAll(async () => {
    const permissions = { location: 'always', notifications: 'YES' };
    const autoSubscribe = true;
    await navigateThroughOnboarding(permissions, autoSubscribe);
  });

  it('Successfully completes device setup', async () => {
    await FinishSetup.isOnScreen();
    await FinishSetup.takeScreenshot();
    await FinishSetup.tapButton();
    await device.takeScreenshot('Post Setup');
  });
});
