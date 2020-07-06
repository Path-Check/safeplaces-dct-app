import { ImageSourcePropType } from 'react-native';

import { TFunction } from 'i18next';

import { ExposureInfoSubscription } from './ExposureHistoryContext';

export interface TracingStrategy {
  name: string;
  exposureInfoSubscription: ExposureInfoSubscription;
  permissionsProvider: ({ children }: { children: JSX.Element }) => JSX.Element;
  homeScreenComponent: ({ testID }: { testID: string }) => JSX.Element;
  affectedUserFlow: () => JSX.Element;
  assets: StrategyAssets;
  useCopy: StrategyCopyContentHook;
}

export interface StrategyAssets {
  personalPrivacyBackground: ImageSourcePropType;
  notificationDetailsBackground: ImageSourcePropType;
  shareDiagnosisBackground: ImageSourcePropType;
  personalPrivacyIcon: string;
  notificationDetailsIcon: string;
  shareDiagnosisIcon: string;
  exportPublishIcon: string;
}

export type StrategyCopyContentHook = (t: TFunction) => StrategyCopyContent;

export interface StrategyCopyContent {
  aboutHeader: string;
  detailedHistoryWhatThisMeansPara: string;
  exportCompleteBody: string;
  exportPublishButtonSubtitle: string;
  exportPublishTitle: string;
  exportStartBody: string;
  exportStartTitle: string;
  exposureNotificationsNotAvailableHeader: string;
  exposureNotificationsNotAvailableSubheader: string;
  legalHeader: string;
  moreInfoHowContent: string;
  moreInfoWhyContent: string;
  personalPrivacyHeader: string;
  personalPrivacySubheader: string;
  notificationDetailsHeader: string;
  notificationDetailsSubheader: string;
  shareDiagnosisButton: string;
  shareDiagnosisHeader: string;
  shareDiagnosisSubheader: string;
  settingsLoggingActive: string;
  settingsLoggingInactive: string;
}
