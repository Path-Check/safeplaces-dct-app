import { useCallback } from 'react';
import { Platform, StatusBar } from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import { useFocusEffect } from '@react-navigation/native';

export type NavigationProp = NavigationScreenProp<
  NavigationState,
  NavigationParams
>;

export type Screen =
  | 'ExportStart'
  | 'ExportIntro'
  | 'ExportSelectHA'
  | 'ExportCodeInput'
  | 'ExportLocationConsent'
  | 'ExportPublishConsent'
  | 'PublishConsent'
  | 'ExportConfirmUpload'
  | 'ExportDone'
  | 'ExportComplete'
  | 'ExposureHistory'
  | 'ExportLocally'
  | 'NextSteps'
  | 'MoreInfo'
  | 'ENDebugMenu'
  | 'ENLocalDiagnosisKey'
  | 'Settings'
  | 'About'
  | 'Licenses'
  | 'FeatureFlags'
  | 'Import'
  | 'Welcome'
  | 'Onboarding2'
  | 'Onboarding3'
  | 'Onboarding4'
  | 'OnboardingLocationPermissions'
  | 'OnboardingNotificationPermissions'
  | 'EnableExposureNotifications'
  | 'ExportFlow'
  | 'SelfAssessment'
  | 'PartnersOverview'
  | 'PartnersEdit'
  | 'PartnersCustomUrl';

export const Screens: { [key in Screen]: Screen } = {
  ExportStart: 'ExportStart',
  ExportIntro: 'ExportIntro',
  ExportSelectHA: 'ExportSelectHA',
  ExportCodeInput: 'ExportCodeInput',
  ExportLocationConsent: 'ExportLocationConsent',
  ExportPublishConsent: 'ExportPublishConsent',
  PublishConsent: 'PublishConsent',
  ExportConfirmUpload: 'ExportConfirmUpload',
  ExportDone: 'ExportDone',
  ExportComplete: 'ExportComplete',
  ExposureHistory: 'ExposureHistory',
  ExportLocally: 'ExportLocally',
  NextSteps: 'NextSteps',
  MoreInfo: 'MoreInfo',
  ENDebugMenu: 'ENDebugMenu',
  ENLocalDiagnosisKey: 'ENLocalDiagnosisKey',
  Settings: 'Settings',
  About: 'About',
  Licenses: 'Licenses',
  FeatureFlags: 'FeatureFlags',
  Import: 'Import',
  Welcome: 'Welcome',
  Onboarding2: 'Onboarding2',
  Onboarding3: 'Onboarding3',
  Onboarding4: 'Onboarding4',
  OnboardingLocationPermissions: 'OnboardingLocationPermissions',
  OnboardingNotificationPermissions: 'OnboardingNotificationPermissions',
  EnableExposureNotifications: 'EnableExposureNotifications',
  ExportFlow: 'ExportFlow',
  SelfAssessment: 'SelfAssessment',
  PartnersOverview: 'PartnersOverview',
  PartnersEdit: 'PartnersEdit',
  PartnersCustomUrl: 'PartnersCustomUrl',
};

export type Stack =
  | 'Main'
  | 'Onboarding'
  | 'ExposureHistory'
  | 'SelfAssessment'
  | 'Export'
  | 'More'
  | 'Partners';

export const Stacks: { [key in Stack]: Stack } = {
  Main: 'Main',
  Onboarding: 'Onboarding',
  ExposureHistory: 'ExposureHistory',
  SelfAssessment: 'SelfAssessment',
  Export: 'Export',
  More: 'More',
  Partners: 'Partners',
};

type BarStyle = 'dark-content' | 'light-content';

export const useStatusBarEffect = (barStyle: BarStyle): void => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(barStyle);
      Platform.OS === 'android' && StatusBar.setTranslucent(true);
    }, [barStyle]),
  );
};
