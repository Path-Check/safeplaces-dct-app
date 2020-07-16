import { StrategyCopyContentHook, StrategyAssets } from '../tracingStrategy';

import { Icons, Images } from '../assets';

export const btAssets: StrategyAssets = {
  personalPrivacyBackground: Images.SingleCrossPathBackground,
  personalPrivacyIcon: Icons.RadioWave,
  notificationDetailsBackground: Images.MultipleCrossPathBackground,
  notificationDetailsIcon: Icons.BellYellow,
  shareDiagnosisBackground: Images.EmptyPathBackground,
  shareDiagnosisIcon: Icons.Heart,
};

export const useBTCopyContent: StrategyCopyContentHook = (t) => {
  return {
    aboutHeader: t('label.about_header_bluetooth'),
    detailedHistoryWhatThisMeansPara: t(
      'history.what_does_this_mean_para_bluetooth',
    ),
    exportButtonSubtitle: '',
    exportCompleteBody: t('export.complete_body_bluetooth'),
    exportPublishButtonSubtitle: '',
    exposureNotificationsNotAvailableHeader: t(
      'home.bluetooth.unavailable_header',
    ),
    exposureNotificationsNotAvailableSubheader: t(
      'home.bluetooth.unavailable_subheader',
    ),
    legalHeader: t('label.legal_page_header_bluetooth'),
    moreInfoHowContent: t('exposure_history.bt.how_does_this_work_para'),
    moreInfoWhyContent: t('exposure_history.bt.why_did_i_get_an_en_para'),
    personalPrivacyHeader: t('label.launch_screen2_header_bluetooth'),
    personalPrivacySubheader: t('label.launch_screen2_subheader_bluetooth'),
    notificationDetailsHeader: t('label.launch_screen3_header_bluetooth'),
    notificationDetailsSubheader: t('label.launch_screen3_subheader_bluetooth'),
    shareDiagnosisButton: t('label.launch_set_up_phone_bluetooth'),
    shareDiagnosisHeader: t('label.launch_screen4_header_bluetooth'),
    shareDiagnosisSubheader: t('label.launch_screen4_subheader_bluetooth'),
    settingsLoggingActive: t('label.logging_active_bluetooth'),
    settingsLoggingInactive: t('label.logging_inactive_bluetooth'),
  };
};
