import { TracingStrategy } from '../tracingStrategy';
import * as BTNativeModule from './nativeModule';
import { ExposureNotificationsProvider } from './ExposureNotificationContext';
import Home from './Home';
import {
  useBTCopyContent,
  useBTInterpolatedCopyContent,
  btAssets,
} from './content';

const btStrategy: TracingStrategy = {
  name: 'bt',
  exposureInfoSubscription: BTNativeModule.subscribeToExposureEvents,
  permissionsProvider: ExposureNotificationsProvider,
  homeScreenComponent: Home,
  assets: btAssets,
  useCopy: useBTCopyContent,
  useInterpolatedCopy: useBTInterpolatedCopyContent,
};

export { BTNativeModule };
export default btStrategy;
