import React from 'react';
import { View } from 'react-native';
import { Factory } from 'fishery';

import {
  TracingStrategy,
  StrategyCopyContent,
  StrategyAssets,
  StrategyInterpolatedCopyContent,
} from '../tracingStrategy';

import { Images } from '../../app/assets/images';

export default Factory.define<TracingStrategy>(() => ({
  name: 'test-tracing-strategy',
  exposureInfoSubscription: () => {
    return { remove: () => {} };
  },
  permissionsProvider: PermissionsProvider,
  homeScreenComponent: HomeScreen,
  assets: testStrategyAssets,
  useCopy: () => testStrategyCopy,
  useInterpolatedCopy: () => testInterpolatedStrategyCopy,
}));

const PermissionsProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  return <View testID={'permissions-provider'}>{children}</View>;
};

const HomeScreen = () => {
  return <View testID={'home-screen'} />;
};

export const testStrategyCopy: StrategyCopyContent = {
  aboutHeader: 'aboutHeader',
  detailedHistoryWhatThisMeansPara: 'detailedHistoryWhatThisMeansPara',
  exportCodeTitle: 'exportCodeTitle',
  exportCompleteBody: 'exportCompleteBody',
  exportPublishButtonSubtitle: 'exportPublishButtonSubtitle',
  exportPublishTitle: 'exportPublishTitle',
  exportStartBody: 'exportStartBody',
  exportStartTitle: 'exportStartTitle',
  exposureNotificationsNotAvailableHeader:
    'exposureNotificationsNotAvailableHeader',
  exposureNotificationsNotAvailableSubheader:
    'exposureNotificationsNotAvailableSubheader',
  legalHeader: 'legalHeader',
  moreInfoHowContent: 'moreInfoHowContent',
  moreInfoWhyContent: 'moreInfoWhyContent',
  personalPrivacyHeader: 'onboarding2Header',
  personalPrivacySubheader: 'onboarding2Subheader',
  notificationDetailsHeader: 'onboarding3Header',
  notificationDetailsSubheader: 'onboarding3Subheader',
  shareDiagnosisButton: 'onboarding4Button',
  shareDiagnosisHeader: 'onboarding4Header',
  shareDiagnosisSubheader: 'onboarding4Subheader',
  settingsLoggingActive: 'settingsLoggingActive)',
  settingsLoggingInactive: 'settingsLoggingInactive',
};

export const testStrategyAssets: StrategyAssets = {
  personalPrivacyBackground: Images.BlueGradientBackground,
  personalPrivacyIcon: '',
  notificationDetailsBackground: Images.BlueGradientBackground,
  notificationDetailsIcon: '',
  shareDiagnosisBackground: Images.BlueGradientBackground,
  shareDiagnosisIcon: '',
  exportPublishIcon: '',
};

export const testInterpolatedStrategyCopy: StrategyInterpolatedCopyContent = {
  exportCodeBody: (name: string) => `exportCodeBody ${name}`,
  exportPublishBody: (name: string) => `exportPublishBody ${name}`,
};
