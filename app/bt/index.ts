import { TracingStrategy } from '../tracingStrategy';
import * as BTNativeModule from './nativeModule';
import { PermissionsProvider } from './PermissionsContext';
import Home from './Home';
import {
  useBTCopyContent,
  useBTInterpolatedCopyContent,
  btAssets,
} from './content';

const btStrategy: TracingStrategy = {
  name: 'bt',
  exposureInfoSubscription: BTNativeModule.subscribeToExposureEvents,
  permissionsProvider: PermissionsProvider,
  homeScreenComponent: Home,
  assets: btAssets,
  useCopy: useBTCopyContent,
  useInterpolatedCopy: useBTInterpolatedCopyContent,
};

export { BTNativeModule };
export default btStrategy;
