import { TracingStrategy } from '../tracingStrategy';
import * as BTNativeModule from './nativeModule';
import { PermissionsProvider } from './PermissionsContext';
import Home from './Home';

const btStrategy: TracingStrategy = {
  name: 'bt',
  exposureInfoSubscription: BTNativeModule.subscribeToExposureEvents,
  permissionsProvider: PermissionsProvider,
  homeScreenComponent: Home,
};

export { BTNativeModule };
export default btStrategy;
