import intro from './intro.json';
import locationTracking from './locationTracking.json';
import importFile from './import.json';
import exportFile from './exportscreen.json';
import licensesFile from './licensesscreen.json';
import overlapFile from './overlap.json';
import notificationFile from './notification.json';
import launchScreenFile from './launchScreen.json';
import locationService from './locationService.json';
import settingsFile from './settingsScreen.json';
import pushFile from './push.json';
import aboutFile from './about.json';
import chooseProviderFile from './chooseProvider.json';

export default {
  ...intro,
  ...locationTracking,
  ...importFile,
  ...exportFile,
  ...overlapFile,
  ...licensesFile,
  ...notificationFile,
  ...launchScreenFile,
  ...locationService,
  ...settingsFile,
  ...pushFile,
  ...aboutFile,
  ...chooseProviderFile,
};
