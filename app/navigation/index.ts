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
  | 'MoreInfo'
  | 'Settings'
  | 'About'
  | 'Licenses'
  | 'FeatureFlags'
  | 'ImportFromGoogle'
  | 'ImportFromUrl'
  | 'Welcome'
  | 'PersonalPrivacy'
  | 'NotificationDetails'
  | 'ShareDiagnosis'
  | 'OnboardingLocationPermissions'
  | 'OnboardingNotificationPermissions'
  | 'EnableExposureNotifications'
  | 'ExportFlow'
  | 'SelfAssessment'
  | 'PartnersOverview'
  | 'PartnersEdit'
  | 'PartnersCustomUrl'
  | 'LanguageSelection'
  | 'AffectedUserStart'
  | 'AffectedUserCodeInput'
  | 'AffectedUserPublishConsent'
  | 'AffectedUserConfirmUpload'
  | 'AffectedUserExportDone'
  | 'AffectedUserComplete'
  | 'ReportIssue';

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
  MoreInfo: 'MoreInfo',
  Settings: 'Settings',
  About: 'About',
  Licenses: 'Licenses',
  FeatureFlags: 'FeatureFlags',
  ImportFromGoogle: 'ImportFromGoogle',
  ImportFromUrl: 'ImportFromUrl',
  Welcome: 'Welcome',
  PersonalPrivacy: 'PersonalPrivacy',
  NotificationDetails: 'NotificationDetails',
  ShareDiagnosis: 'ShareDiagnosis',
  OnboardingLocationPermissions: 'OnboardingLocationPermissions',
  OnboardingNotificationPermissions: 'OnboardingNotificationPermissions',
  EnableExposureNotifications: 'EnableExposureNotifications',
  ExportFlow: 'ExportFlow',
  SelfAssessment: 'SelfAssessment',
  PartnersOverview: 'PartnersOverview',
  PartnersEdit: 'PartnersEdit',
  PartnersCustomUrl: 'PartnersCustomUrl',
  LanguageSelection: 'LanguageSelection',
  AffectedUserStart: 'AffectedUserStart',
  AffectedUserCodeInput: 'AffectedUserCodeInput',
  AffectedUserPublishConsent: 'AffectedUserPublishConsent',
  AffectedUserConfirmUpload: 'AffectedUserConfirmUpload',
  AffectedUserExportDone: 'AffectedUserExportDone',
  AffectedUserComplete: 'AffectedUserComplete',
  ReportIssue: 'ReportIssue',
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

export const useStatusBarEffect = (
  barStyle: BarStyle,
  backgroundColor?: string,
): void => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(barStyle);
      Platform.OS === 'android' &&
        StatusBar.setTranslucent(true) &&
        backgroundColor &&
        StatusBar.setBackgroundColor(backgroundColor);
    }, [barStyle, backgroundColor]),
  );
};
