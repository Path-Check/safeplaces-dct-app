import { isAppRunning } from '../../helpers/applicationState';

describe('App installation', () => {
  it('Installs and runs successfully', async () => {
    const wasLaunchSuccessful = await isAppRunning();
    await expect(wasLaunchSuccessful).toBeTruthy();
  });
});