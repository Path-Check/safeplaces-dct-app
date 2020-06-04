import { useTranslation } from 'react-i18next';

import { Images } from './assets';
import { isGPS } from './COVIDSafePathsConfig';

export function useAssets() {
  const { t } = useTranslation();

  // Onboarding2
  const onboarding2Background = isGPS
    ? Images.LaunchScreen2
    : Images.LaunchScreen2BT;
  const onboarding2Header = isGPS
    ? t('label.launch_screen2_header_location')
    : t('label.launch_screen2_header_bluetooth');
  const onboarding2Subheader = isGPS
    ? t('label.launch_screen2_subheader_location')
    : t('label.launch_screen2_subheader_bluetooth');

  // Onboarding3
  const onboarding3Background = isGPS
    ? Images.LaunchScreen3
    : Images.LaunchScreen3BT;
  const onboarding3Header = isGPS
    ? t('label.launch_screen3_header_location')
    : t('label.launch_screen3_header_bluetooth');
  const onboarding3Subheader = isGPS
    ? t('label.launch_screen3_subheader_location')
    : t('label.launch_screen3_subheader_bluetooth');

  // Onboarding4
  const onboarding4Background = isGPS
    ? Images.LaunchScreen1
    : Images.LaunchScreen1BT;
  const onboarding4Header = isGPS
    ? t('label.launch_screen4_header_location')
    : t('label.launch_screen4_header_bluetooth');
  const onboarding4Subheader = isGPS
    ? t('label.launch_screen4_subheader_location')
    : t('label.launch_screen4_subheader_bluetooth');
  const onboarding4Button = isGPS
    ? t('label.launch_set_up_phone_location')
    : t('label.launch_set_up_phone_bluetooth');

  // Settings Page
  const settingsLoggingActive = isGPS
    ? t('label.logging_active_location')
    : t('label.logging_active_bluetooth');
  const settingsLoggingInactive = isGPS
    ? t('label.logging_inactive_location')
    : t('label.logging_inactive_bluetooth');

  // About Page
  const aboutHeader = isGPS
    ? t('label.about_header_location')
    : t('label.about_header_bluetooth');

  // Legal/Licences Page
  const legalHeader = isGPS
    ? t('label.legal_page_header_location')
    : t('label.legal_page_header_bluetooth');

  // Detailed History Page
  const detailedHistoryWhatThisMeansPara = isGPS
    ? t('history.what_does_this_mean_para_location')
    : t('history.what_does_this_mean_para_bluetooth');

  // Dashboard Pages

  // Exposure Page
  const exposurePageSubheader = isGPS
    ? t(`label.home_at_risk_subtext_location`)
    : t(`label.home_at_risk_subtext_bluetooth`);

  // Off Page
  const offPageCta = isGPS
    ? t(`label.home_setting_off_subtext_location`)
    : t(`label.home_setting_off_subtext_bluetooth`);
  const offPageButton = isGPS
    ? t(`label.home_enable_location`)
    : t(`label.home_enable_bluetooth`);

  return {
    onboarding2Background,
    onboarding2Header,
    onboarding2Subheader,
    onboarding3Background,
    onboarding3Header,
    onboarding3Subheader,
    onboarding4Background,
    onboarding4Header,
    onboarding4Subheader,
    onboarding4Button,
    settingsLoggingActive,
    settingsLoggingInactive,
    aboutHeader,
    legalHeader,
    detailedHistoryWhatThisMeansPara,
    exposurePageSubheader,
    offPageCta,
    offPageButton,
  };
}
