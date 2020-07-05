import { TracingStrategy } from '../tracingStrategy';
import { PermissionsProvider } from './PermissionsContext';
import Home from './Home';
import ExportStack from './ExportStack';
import { subscribeToExposureEvents } from './exposureInfo';
import { useGPSCopyContent, gpsAssets } from './content';

const gpsStrategy: TracingStrategy = {
  name: 'bt',
  exposureInfoSubscription: subscribeToExposureEvents,
  permissionsProvider: PermissionsProvider,
  homeScreenComponent: Home,
  affectedUserFlow: ExportStack,
  assets: gpsAssets,
  useCopy: useGPSCopyContent,
};

export default gpsStrategy;
