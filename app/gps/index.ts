import { TracingStrategy } from '../tracingStrategy';
import { PermissionsProvider } from './PermissionsContext';

const gpsStrategy: TracingStrategy = {
  name: 'bt',
  exposureInfoSubscription: () => {
    return {
      remove: () => {},
    };
  },
  permissionsProvider: PermissionsProvider,
};

export default gpsStrategy;
