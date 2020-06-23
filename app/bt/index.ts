import { TracingStrategy } from '../tracingStrategy';
import * as BTNativeModule from './nativeModule';
import { ExposureNotificationsProvider } from './ExposureNotificationContext';
import Home from './Home';

const btStrategy: TracingStrategy = {
  name: 'bt',
  exposureInfoSubscription: BTNativeModule.subscribeToExposureEvents,
  permissionsProvider: ExposureNotificationsProvider,
  homeScreenComponent: Home,
};

export { BTNativeModule };
export default btStrategy;
