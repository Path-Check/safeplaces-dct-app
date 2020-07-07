import { TracingStrategy } from '../tracingStrategy';
import * as BTNativeModule from './nativeModule';
import { PermissionsProvider } from './PermissionsContext';
import Home from './Home';
import AffectedUserFlow from './AffectedUserFlow';
import { useBTCopyContent, btAssets } from './content';

const btStrategy: TracingStrategy = {
  name: 'bt',
  exposureInfoSubscription: BTNativeModule.subscribeToExposureEvents,
  permissionsProvider: PermissionsProvider,
  homeScreenComponent: Home,
  affectedUserFlow: AffectedUserFlow,
  assets: btAssets,
  useCopy: useBTCopyContent,
};

export { BTNativeModule };
export default btStrategy;
