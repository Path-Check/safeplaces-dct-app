import React from 'react';
import { View } from 'react-native';
import { Factory } from 'fishery';

import { TracingStrategy, StrategyAssets } from '../tracingStrategy';

import { Images } from '../../app/assets/images';

export default Factory.define<TracingStrategy>(() => ({
  name: 'test-tracing-strategy',
  exposureEventsStrategy: {
    exposureInfoSubscription: () => {
      return { remove: () => {} };
    },
    toExposureHistory: () => [],
    getCurrentExposures: () => {},
  },
  permissionsProvider: PermissionsProvider,
  homeScreenComponent: HomeScreen,
  affectedUserFlow: AffectedUserFlow,
  assets: testStrategyAssets,
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

export const testStrategyAssets: StrategyAssets = {
  personalPrivacyBackground: Images.BlueGradientBackground,
  personalPrivacyIcon: '',
  notificationDetailsBackground: Images.BlueGradientBackground,
  notificationDetailsIcon: '',
  shareDiagnosisBackground: Images.BlueGradientBackground,
  shareDiagnosisIcon: '',
};
