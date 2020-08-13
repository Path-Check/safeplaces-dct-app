import { isAppRunning } from '../helpers/applicationState';
import LaunchScreenPo from '../screens/LaunchScreen.po';

describe('App installation', () => {
  it('Installs and runs successfully', async () => {
    const wasLaunchSuccessful = await isAppRunning();
    await expect(wasLaunchSuccessful).toBeTruthy();
    await expect(LaunchScreenPo.isOnScreen()).toBeTruthy();
  });
});
