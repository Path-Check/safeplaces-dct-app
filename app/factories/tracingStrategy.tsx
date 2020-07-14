import React from 'react';
import { View } from 'react-native';
import { Factory } from 'fishery';

import {
  TracingStrategy,
  StrategyCopyContent,
  StrategyAssets,
} from '../tracingStrategy';

import { Images } from '../../app/assets/images';

export default Factory.define<TracingStrategy>(() => ({
  name: 'test-tracing-strategy',
  exposureEventsStrategy: {
    exposureInfoSubscription: () => {
      return { remove: () => {} };
    },
    toExposureHistory: () => [],
    getExposureHistory: () => {},
  },
  permissionsProvider: PermissionsProvider,
  homeScreenComponent: HomeScreen,
  affectedUserFlow: AffectedUserFlow,
  assets: testStrategyAssets,
  useCopy: () => testStrategyCopy,
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

const AffectedUserFlow = () => {
  return <View testID={'affected-user-flow'} />;
};

export const testStrategyCopy: StrategyCopyContent = {
  aboutHeader: 'aboutHeader',
  detailedHistoryWhatThisMeansPara: 'detailedHistoryWhatThisMeansPara',
  exportCompleteBody: 'exportCompleteBody',
  exportPublishButtonSubtitle: 'exportPublishButtonSubtitle',
  exportPublishTitle: 'exportPublishTitle',
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
