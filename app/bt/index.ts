import { TracingStrategy } from '../tracingStrategy';
import * as BTNativeModule from './nativeModule';
import { PermissionsProvider } from './PermissionsContext';
import Home from './Home';
import AffectedUserFlow from './AffectedUserFlow';
import { useBTCopyContent, btAssets } from './content';
import { toExposureHistory } from './exposureNotifications';
import { ExposureEventsStrategy } from '../ExposureHistoryContext';

const btExposureEventContext: ExposureEventsStrategy = {
  exposureInfoSubscription: BTNativeModule.subscribeToExposureEvents,
  toExposureHistory: toExposureHistory,
  getCurrentExposures: BTNativeModule.getCurrentExposures,
};

const btStrategy: TracingStrategy = {
  name: 'bt',
  exposureEventsStrategy: btExposureEventContext,
  permissionsProvider: PermissionsProvider,
  homeScreenComponent: Home,
  affectedUserFlow: AffectedUserFlow,
  assets: btAssets,
  useCopy: useBTCopyContent,
  extraMiddleware: [],
};

export { BTNativeModule };
export default btStrategy;
