import React from 'react';
import { View } from 'react-native';
import { Factory } from 'fishery';

import {
  TracingStrategy,
  StrategyCopyContent,
  StrategyAssets,
  StrategyInterpolatedCopyContent,
} from '../tracingStrategy';

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
  onboarding2Header: 'onboarding2Header',
  onboarding2Subheader: 'onboarding2Subheader',
  onboarding3Header: 'onboarding3Header',
  onboarding3Subheader: 'onboarding3Subheader',
  onboarding4Button: 'onboarding4Button',
  onboarding4Header: 'onboarding4Header',
  onboarding4Subheader: 'onboarding4Subheader',
  settingsLoggingActive: 'settingsLoggingActive)',
  settingsLoggingInactive: 'settingsLoggingInactive',
};

export const testStrategyAssets: StrategyAssets = {
  onboarding2Background: '',
  onboarding2Icon: '',
  onboarding3Background: '',
  onboarding3Icon: '',
  onboarding4Background: '',
  onboarding4Icon: '',
  exportPublishIcon: '',
};

export const testInterpolatedStrategyCopy: StrategyInterpolatedCopyContent = {
  exportCodeBody: (name: string) => `exportCodeBody ${name}`,
  exportPublishBody: (name: string) => `exportPublishBody ${name}`,
};
