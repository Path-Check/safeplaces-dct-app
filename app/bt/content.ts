import {
  StrategyCopyContentHook,
  StrategyAssets,
  StrategyInterpolatedCopyContentHook,
} from '../tracingStrategy';

import { Icons, Images } from '../assets';

export const btAssets: StrategyAssets = {
  onboarding2Background: Images.LaunchScreen2BT,
  onboarding2Icon: Icons.RadioWave,
  onboarding3Background: Images.OnboardingBackground3,
  onboarding3Icon: Icons.BellYellow,
  onboarding4Background: Images.OnboardingBackground2,
  onboarding4Icon: Icons.Heart,
  exportPublishIcon: Icons.Bell,
};

export const useBTInterpolatedCopyContent: StrategyInterpolatedCopyContentHook = (
  t,
) => {
  return {
    exportCodeBody: (name: string) =>
      t('export.code_input_body_bluetooth', { name }),
    exportPublishBody: (name: string) =>
      t('export.publish_consent_body_bluetooth', { name }),
  };
};

export const useBTCopyContent: StrategyCopyContentHook = (t) => {
  return {
    aboutHeader: t('label.about_header_bluetooth'),
    detailedHistoryWhatThisMeansPara: t(
      'history.what_does_this_mean_para_bluetooth',
    ),
    exportButtonSubtitle: '',
    exportCodeTitle: t('export.code_input_title_bluetooth'),
    exportCompleteBody: t('export.complete_body_bluetooth'),
    exportPublishButtonSubtitle: '',
    exportPublishTitle: t('export.publish_consent_title_bluetooth'),
    exportStartBody: t('export.start_body_bluetooth'),
    exportStartTitle: t('export.start_title_bluetooth'),
    exposureNotificationsNotAvailableHeader: t(
      'home.bluetooth.unavailable_header',
    ),
    exposureNotificationsNotAvailableSubheader: t(
      'home.bluetooth.unavailable_subheader',
    ),
    legalHeader: t('label.legal_page_header_bluetooth'),
    moreInfoHowContent: t('exposure_history.bt.how_does_this_work_para'),
    moreInfoWhyContent: t('exposure_history.bt.why_did_i_get_an_en_para'),
    onboarding2Header: t('label.launch_screen2_header_bluetooth'),
    onboarding2Subheader: t('label.launch_screen2_subheader_bluetooth'),
    onboarding3Header: t('label.launch_screen3_header_bluetooth'),
    onboarding3Subheader: t('label.launch_screen3_subheader_bluetooth'),
    onboarding4Button: t('label.launch_set_up_phone_bluetooth'),
    onboarding4Header: t('label.launch_screen4_header_bluetooth'),
    onboarding4Subheader: t('label.launch_screen4_subheader_bluetooth'),
    settingsLoggingActive: t('label.logging_active_bluetooth'),
    settingsLoggingInactive: t('label.logging_inactive_bluetooth'),
  };
};
