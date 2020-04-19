import { navigateThroughOnboarding } from './helpers/onboarding';
import FinishSetup from './pages/FinishSetup.po.js';

describe('Permissions: Location `always` and notifications `true` are chosen', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: { location: 'always', notifications: 'YES' },
      newInstance: true,
    });
    await navigateThroughOnboarding();
  });

  it('Successfully completes device setup', async () => {
    await FinishSetup.isOnScreen();
    await FinishSetup.takeScreenshot();
    await FinishSetup.tapButton();
    await device.takeScreenshot('Post Setup');
  });
});
