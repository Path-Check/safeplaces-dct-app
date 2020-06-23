import { TracingStrategy } from '../tracingStrategy';
import { PermissionsProvider } from './PermissionsContext';
import Home from './Home';

const gpsStrategy: TracingStrategy = {
  name: 'bt',
  exposureInfoSubscription: () => {
    return {
      remove: () => {},
    };
  },
  permissionsProvider: PermissionsProvider,
  homeScreenComponent: Home,
};

export default gpsStrategy;
