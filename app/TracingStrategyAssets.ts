import { useTranslation } from 'react-i18next';

import { Icons, Images } from './assets';
import { isGPS } from './COVIDSafePathsConfig';

type Asset = string | ((name: string) => string) | null;

export function useAssets(): Record<string, Asset> {
  const { t } = useTranslation();

  // Onboarding2
  const onboarding2Background = isGPS
    ? Images.OnboardingBackground1
    : Images.LaunchScreen2BT;
  const onboarding2Header = isGPS
    ? t('label.launch_screen2_header_location')
    : t('label.launch_screen2_header_bluetooth');
  const onboarding2Subheader = isGPS
    ? t('label.launch_screen2_subheader_location')
    : t('label.launch_screen2_subheader_bluetooth');
  const onboarding2Icon = Icons.LocationPin;

  // Onboarding3
  const onboarding3Background = isGPS
    ? Images.OnboardingBackground2
    : Images.LaunchScreen3BT;
  const onboarding3Header = isGPS
    ? t('label.launch_screen3_header_location')
    : t('label.launch_screen3_header_bluetooth');
  const onboarding3Subheader = isGPS
    ? t('label.launch_screen3_subheader_location')
    : t('label.launch_screen3_subheader_bluetooth');
  const onboarding3Icon = Icons.Heart;

  // Onboarding4
  const onboarding4Background = isGPS
    ? Images.OnboardingBackground3
    : Images.LaunchScreen1BT;
  const onboarding4Header = isGPS
    ? t('label.launch_screen4_header_location')
    : t('label.launch_screen4_header_bluetooth');
  const onboarding4Subheader = isGPS
    ? t('label.launch_screen4_subheader_location')
    : t('label.launch_screen4_subheader_bluetooth');
  const onboarding4Icon = Icons.BellYellow;
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
  const offPageHeader = isGPS
    ? t('label.home_setting_off_header_location')
    : t('label.home_setting_off_header_bluetooth');
  const offPageCta = isGPS
    ? t(`label.home_setting_off_subtext_location`)
    : t(`label.home_setting_off_subtext_bluetooth`);
  const offPageButton = isGPS
    ? t(`label.home_enable_location`)
    : t(`label.home_enable_bluetooth`);

  // No Known Exposure Page
  const noKnownExposurePageHeader = isGPS
    ? t('label.home_no_contact_header')
    : t('label.home_no_contact_header_bluetooth');
  const noKnownExposurePageSubheader = isGPS
    ? t('label.home_no_contact_subtext')
    : t('label.home_no_contact_subtext_bluetooth');

  // Export Pages

  const exportExitRoute = isGPS ? 'ExportStart' : 'SettingsScreen';

  // Export Intro/Start
  const exportStartTitle = isGPS
    ? t('export.start_title')
    : t('export.start_title_bluetooth');
  const exportStartBody = isGPS
    ? t('export.start_body')
    : t('export.start_body_bluetooth');

  // Export Code Input
  const exportCodeTitle = isGPS
    ? t('export.code_input_title')
    : t('export.code_input_title_bluetooth');
  const exportCodeBody = (name: string) => {
    return isGPS
      ? t('export.code_input_body', { name })
      : t('export.code_input_body_bluetooth', { name });
  };
  const exportCodeInputNextRoute = isGPS
    ? 'ExportLocationConsent'
    : 'ExportPublishConsent';

  // Export Publish
  const exportPublishBody = (name: string) => {
    return isGPS
      ? t('export.publish_consent_body', { name })
      : t('export.publish_consent_body_bluetooth', { name });
  };
  const exportPublishButtonSubtitle = isGPS
    ? t('export.consent_button_subtitle')
    : null;
  const exportPublishTitle = isGPS
    ? t('export.publish_consent_title')
    : t('export.publish_consent_title_bluetooth');
  const exportPublishIcon = isGPS ? Icons.Publish : Icons.Bell;
  const exportPublishNextRoute = isGPS
    ? 'ExportConfirmUpload'
    : 'ExportComplete';

  // Export Complete
  const exportCompleteBody = isGPS
    ? t('export.complete_body')
    : t('export.complete_body_bluetooth');

  return {
    onboarding2Background,
    onboarding2Header,
    onboarding2Subheader,
    onboarding2Icon,
    onboarding3Background,
    onboarding3Header,
    onboarding3Subheader,
    onboarding3Icon,
    onboarding4Background,
    onboarding4Header,
    onboarding4Subheader,
    onboarding4Icon,
    onboarding4Button,
    settingsLoggingActive,
    settingsLoggingInactive,
    aboutHeader,
    legalHeader,
    detailedHistoryWhatThisMeansPara,
    exposurePageSubheader,
    offPageHeader,
    offPageCta,
    offPageButton,
    noKnownExposurePageHeader,
    noKnownExposurePageSubheader,
    exportExitRoute,
    exportStartTitle,
    exportStartBody,
    exportCodeTitle,
    exportCodeBody,
    exportCodeInputNextRoute,
    exportPublishBody,
    exportPublishButtonSubtitle,
    exportPublishIcon,
    exportPublishTitle,
    exportPublishNextRoute,
    exportCompleteBody,
  };
}
