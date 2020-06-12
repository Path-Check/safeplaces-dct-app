import { useTranslation } from 'react-i18next';

import { Images } from './assets';
import { isGPS } from './COVIDSafePathsConfig';

export function useAssets(): Record<string, string> {
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

  /**
   * Dashboard Pages
   */

  // Exposure Notification Not Available Screen
  const exposureNotificationsNotAvailableHeader = t(
    'home.bluetooth.unavailable_header',
  );
  const exposureNotificationsNotAvailableSubheader = t(
    'home.bluetooth.unavailable_subheader',
  );

  // Tracing Off Screen
  const tracingOffScreenHeader = isGPS
    ? t('home.gps.tracing_off_header')
    : t('home.bluetooth.tracing_off_header');
  const tracingOffScreenSubheader = isGPS
    ? t('home.gps.tracing_off_subheader')
    : t('home.bluetooth.tracing_off_subheader');
  const tracingOffScreenButton = isGPS
    ? t('home.gps.tracing_off_button')
    : t('home.bluetooth.tracing_off_button');

  // Notifications Off Screen
  const notificationsOffScreenHeader = t(
    'home.shared.notifications_off_header',
  );
  const notificationsOffScreenSubheader = t(
    'home.shared.notifications_off_subheader',
  );
  const notificationsOffScreenButton = t(
    'home.shared.notifications_off_button',
  );

  // Select Authority Screen
  const selectAuthorityScreenHeader = t('home.shared.select_authority_header');
  const selectAuthorityScreenSubheader = t(
    'home.shared.select_authority_subheader',
  );
  const selectAuthorityScreenButton = t('home.shared.select_authority_button');

  // No Authorities Screen
  const noAuthoritiesScreenHeader = t('home.shared.no_authorities_header');
  const noAuthoritiesScreenSubheader = t(
    'home.shared.no_authorities_subheader',
  );

  // Tracing On Screen
  const allServicesOnScreenHeader = isGPS
    ? t('home.gps.all_services_on_header')
    : t('home.bluetooth.all_services_on_header');
  const allServicesOnScreenSubheader = isGPS
    ? t('home.gps.all_services_on_subheader')
    : t('home.bluetooth.all_services_on_subheader');

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
    tracingOffScreenHeader,
    tracingOffScreenSubheader,
    tracingOffScreenButton,
    allServicesOnScreenHeader,
    allServicesOnScreenSubheader,
    exposureNotificationsNotAvailableHeader,
    exposureNotificationsNotAvailableSubheader,
    notificationsOffScreenHeader,
    notificationsOffScreenSubheader,
    notificationsOffScreenButton,
    selectAuthorityScreenHeader,
    selectAuthorityScreenSubheader,
    selectAuthorityScreenButton,
    noAuthoritiesScreenHeader,
    noAuthoritiesScreenSubheader,
  };
}
