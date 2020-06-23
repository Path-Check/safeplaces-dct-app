import { ExposureInfoSubscription } from './ExposureHistoryContext';

export interface TracingStrategy {
  name: string;
  exposureInfoSubscription: ExposureInfoSubscription;
  permissionsProvider: ({ children }: { children: JSX.Element }) => JSX.Element;
  homeScreenComponent: () => JSX.Element;
}
