import { Images } from './assets';
import { config } from './COVIDSafePathsConfig';
import languages from './locales/languages';

export const isGPS = config.tracingStrategy === 'gps';

// Onboarding2
export const onboarding2BackgroundImage = isGPS
  ? Images.LaunchScreen2
  : Images.LaunchScreen2BT; 
export const onboarding2HeaderText = isGPS
  ? languages.t('label.launch_screen2_header_location')
  : languages.t('label.launch_screen2_header_bluetooth');
export const onboarding2SubheaderText = isGPS
  ? languages.t('label.launch_screen2_subheader_location')
  : languages.t('label.launch_screen2_subheader_bluetooth');

// Onboarding3
export const onboarding3BackgroundImage = isGPS
  ? Images.LaunchScreen3
  : Images.LaunchScreen3BT;
export const onboarding3HeaderText = isGPS
  ? languages.t('label.launch_screen3_header_location')
  : languages.t('label.launch_screen3_header_bluetooth');
export const onboarding3SubheaderText = isGPS
  ? languages.t('label.launch_screen3_subheader_location')
  : languages.t('label.launch_screen3_subheader_bluetooth');

// Onboarding4
export const onboarding4BackgroundImage = isGPS
  ? Images.LaunchScreen1
  : Images.LaunchScreen1BT;
export const onboarding4HeaderText = isGPS
  ? languages.t('label.launch_screen4_header_location')
  : languages.t('label.launch_screen4_header_bluetooth');
export const onboarding4SubheaderText = isGPS
  ? languages.t('label.launch_screen4_subheader_location')
  : languages.t('label.launch_screen4_subheader_bluetooth');
export const onboarding4ButtonText = isGPS
  ? languages.t('label.launch_set_up_phone_location')
  : languages.t('label.launch_set_up_phone_bluetooth');
export const onboarding4NavDestination = isGPS ? 'Onboarding5' : 'Main';

// Settings Page
export const settingsLoggingActiveText = isGPS
  ? languages.t('label.logging_active_location')
  : languages.t('label.logging_active_bluetooth');
export const settingsLoggingInactiveText = isGPS
  ? languages.t('label.logging_inactive_location')
  : languages.t('label.logging_inactive_bluetooth');

// About Page
export const aboutHeaderText = isGPS
  ? languages.t('label.about_header_location')
  : languages.t('label.about_header_bluetooth');

// Legal/Licences Page
export const legalPageHeaderText = isGPS
  ? languages.t('label.legal_page_header_location')
  : languages.t('label.legal_page_header_bluetooth');

// Detailed History Page
export const detailedHistoryPageWhatThisMeansParaText = isGPS
    ? languages.t('history.what_does_this_mean_para_location')
    : languages.t('history.what_does_this_mean_para_bluetooth');

// Dashboard Pages   

// Exposure Page
export const exposurePageSubheaderText = isGPS
  ? languages.t(`label.home_at_risk_subtext_location`)
  : languages.t(`label.home_at_risk_subtext_bluetooth`);

// Off Page
export const offPageCtaText = isGPS
    ? languages.t(`label.home_setting_off_subtext_location`)
    : languages.t(`label.home_setting_off_subtext_bluetooth`);
export const offPageButtonLabel = isGPS
    ? languages.t(`label.home_enable_location`)
    : languages.t(`label.home_enable_bluetooth`);
