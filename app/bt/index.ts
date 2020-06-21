import { TracingStrategy } from '../tracingStrategy';
import * as BTNativeModule from './nativeModule';
import { ExposureNotificationsProvider } from './ExposureNotificationContext';

const btStrategy: TracingStrategy = {
  name: 'bt',
  exposureInfoSubscription: BTNativeModule.subscribeToExposureEvents,
  permissionsProvider: ExposureNotificationsProvider,
};

export { BTNativeModule };
export default btStrategy;
