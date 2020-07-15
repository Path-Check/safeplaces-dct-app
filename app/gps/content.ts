import { StrategyAssets, StrategyCopyContentHook } from '../tracingStrategy';

import { Icons, Images } from '../assets';

export const gpsAssets: StrategyAssets = {
  personalPrivacyBackground: Images.SingleCrossPathBackground,
  personalPrivacyIcon: Icons.LocationPin,
  notificationDetailsBackground: Images.EmptyPathBackground,
  notificationDetailsIcon: Icons.Heart,
  shareDiagnosisBackground: Images.MultipleCrossPathBackground,
  shareDiagnosisIcon: Icons.BellYellow,
};

export const useGPSCopyContent: StrategyCopyContentHook = (t) => {
  return {
    aboutHeader: t('label.about_header_location'),
    detailedHistoryWhatThisMeansPara: t(
      'history.what_does_this_mean_para_location',
    ),
    exportCompleteBody: t('export.complete_body'),
    exportPublishButtonSubtitle: t('export.consent_button_subtitle'),
    exportStartBody: t('export.start_body'),
    exportStartTitle: t('export.start_title'),
    exposureNotificationsNotAvailableHeader: t(
      'home.bluetooth.unavailable_header',
    ),
    exposureNotificationsNotAvailableSubheader: t(
      'home.bluetooth.unavailable_subheader',
    ),
    legalHeader: t('label.legal_page_header_location'),
    moreInfoHowContent: t('exposure_history.gps.how_does_this_work_para'),
    moreInfoWhyContent: t('exposure_history.gps.why_did_i_get_an_en_para'),
    personalPrivacyHeader: t('label.launch_screen2_header_location'),
    personalPrivacySubheader: t('label.launch_screen2_subheader_location'),
    notificationDetailsHeader: t('label.launch_screen3_header_location'),
    notificationDetailsSubheader: t('label.launch_screen3_subheader_location'),
    shareDiagnosisButton: t('label.launch_set_up_phone_location'),
    shareDiagnosisHeader: t('label.launch_screen4_header_location'),
    shareDiagnosisSubheader: t('label.launch_screen4_subheader_location'),
    settingsLoggingActive: t('label.logging_active_location'),
    settingsLoggingInactive: t('label.logging_inactive_location'),
  };
};
