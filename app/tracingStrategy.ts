import { ImageSourcePropType } from 'react-native';

import { ExposureEventsStrategy } from './ExposureHistoryContext';

export interface TracingStrategy {
  name: string;
  exposureEventsStrategy: ExposureEventsStrategy;
  permissionsProvider: ({ children }: { children: JSX.Element }) => JSX.Element;
  homeScreenComponent: ({ testID }: { testID: string }) => JSX.Element;
  affectedUserFlow: () => JSX.Element;
  assets: StrategyAssets;
}

export interface StrategyAssets {
  personalPrivacyBackground: ImageSourcePropType;
  notificationDetailsBackground: ImageSourcePropType;
  shareDiagnosisBackground: ImageSourcePropType;
  personalPrivacyIcon: string;
  notificationDetailsIcon: string;
  shareDiagnosisIcon: string;
}
