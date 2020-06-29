import { TracingStrategy } from '../tracingStrategy';
import { PermissionsProvider } from './PermissionsContext';
import Home from './Home';
import { subscribeToExposureEvents } from './exposureInfo';
import {
  useGPSCopyContent,
  useGPSInterpolatedCopyContent,
  gpsAssets,
} from './content';

const gpsStrategy: TracingStrategy = {
  name: 'bt',
  exposureInfoSubscription: subscribeToExposureEvents,
  permissionsProvider: PermissionsProvider,
  homeScreenComponent: Home,
  assets: gpsAssets,
  useCopy: useGPSCopyContent,
  useInterpolatedCopy: useGPSInterpolatedCopyContent,
};

export default gpsStrategy;
