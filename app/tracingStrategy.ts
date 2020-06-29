import { TFunction } from 'i18next';

import { ExposureInfoSubscription } from './ExposureHistoryContext';

export interface TracingStrategy {
  name: string;
  exposureInfoSubscription: ExposureInfoSubscription;
  permissionsProvider: ({ children }: { children: JSX.Element }) => JSX.Element;
  homeScreenComponent: ({ testID }: { testID: string }) => JSX.Element;
  assets: StrategyAssets;
  useCopy: StrategyCopyContentHook;
  useInterpolatedCopy: StrategyInterpolatedCopyContentHook;
}

export interface StrategyAssets {
  onboarding2Background: string;
  onboarding2Icon: string;
  onboarding3Background: string;
  onboarding3Icon: string;
  onboarding4Background: string;
  onboarding4Icon: string;
  exportPublishIcon: string;
}

export type StrategyCopyContentHook = (t: TFunction) => StrategyCopyContent;

export interface StrategyCopyContent {
  aboutHeader: string;
  detailedHistoryWhatThisMeansPara: string;
  exportCodeTitle: string;
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
  onboarding2Header: string;
  onboarding2Subheader: string;
  onboarding3Header: string;
  onboarding3Subheader: string;
  onboarding4Button: string;
  onboarding4Header: string;
  onboarding4Subheader: string;
  settingsLoggingActive: string;
  settingsLoggingInactive: string;
}

export type StrategyInterpolatedCopyContentHook = (
  t: TFunction,
) => StrategyInterpolatedCopyContent;

export interface StrategyInterpolatedCopyContent {
  exportCodeBody: (name: string) => string;
  exportPublishBody: (name: string) => string;
}
