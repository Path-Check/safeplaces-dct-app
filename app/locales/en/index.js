import intro from './intro.json';
import locationTracking from './locationTracking.json';
import importFile from './import.json';
import exportFile from './exportscreen.json';
import licensesFile from './licensesscreen.json';
import overlapFile from './overlap.json';
import notificationFile from './notification.json';
import launchScreenFile from './launchScreen.json';

export default {
  ...intro,
  ...locationTracking,
  ...importFile,
  ...exportFile,
  ...overlapFile,
  ...licensesFile,
  ...notificationFile,
  ...launchScreenFile,
};
