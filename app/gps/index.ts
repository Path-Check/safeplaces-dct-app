import { TracingStrategy } from '../tracingStrategy';
import { PermissionsProvider } from './PermissionsContext';
import Home from './Home';
import { subscribeToExposureEvents } from './exposureInfo';

const gpsStrategy: TracingStrategy = {
  name: 'bt',
  exposureInfoSubscription: subscribeToExposureEvents,
  permissionsProvider: PermissionsProvider,
  homeScreenComponent: Home,
};

export default gpsStrategy;
