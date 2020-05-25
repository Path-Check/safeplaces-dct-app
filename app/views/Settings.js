import styled, { css } from '@emotion/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Linking, ScrollView, View } from 'react-native';
import DeviceSettings from 'react-native-device-settings';
import { openSettings } from 'react-native-permissions';

import { Icons } from '../assets';
import { Divider } from '../components/Divider';
import { FeatureFlag } from '../components/FeatureFlag';
import NativePicker from '../components/NativePicker';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import Colors from '../constants/colors';
import { config } from '../COVIDSafePathsConfig';
import {
  LOCALE_LIST,
  getUserLocaleOverride,
  setUserLocaleOverride,
  supportedDeviceLanguageOrEnglish,
} from '../locales/languages';
import { useLocTrackingStatus } from '../services/hooks/useLocTrackingStatus';
import { Reason } from '../services/LocationService';
import { isPlatformiOS } from '../Util';
import { FEATURE_FLAG_SCREEN_NAME } from '../views/FeatureFlagToggles';
import { GoogleMapsImport } from './Settings/GoogleMapsImport';
import { SettingsItem as Item } from './Settings/SettingsItem';

export const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [userLocale, setUserLocale] = useState(
    supportedDeviceLanguageOrEnglish(),
  );
  const isGPS = config.tracingStrategy === 'gps';

  const backToMain = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // TODO: extract into service or hook
    getUserLocaleOverride().then(locale => locale && setUserLocale(locale));

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const localeChanged = async locale => {
    // If user picks manual lang, update and store setting
    try {
      await setUserLocaleOverride(locale);
      setUserLocale(locale);
    } catch (e) {
      console.log('something went wrong in lang change', e);
    }
  };

  return (
    <NavigationBarWrapper
      title={t('label.settings_title')}
      onBackPress={backToMain}>
      <ScrollView>
        <Section>
          <LocationTrackingPermissions isGPS={isGPS} />
          <NativePicker
            items={LOCALE_LIST}
            value={userLocale}
            onValueChange={localeChanged}>
            {({ label, openPicker }) => (
              <Item
                last
                label={label || t('label.home_unknown_header')}
                icon={Icons.LanguagesIcon}
                onPress={openPicker}
              />
            )}
          </NativePicker>
        </Section>
        <Section>
          <Item
            label={t('label.choose_provider_title')}
            description={t('label.choose_provider_subtitle')}
            onPress={() => navigation.navigate('ChooseProviderScreen')}
          />
          <Item
            label={t('label.news_title')}
            description={t('label.news_subtitle')}
            onPress={() => navigation.navigate('NewsScreen')}
            last={!isGPS}
          />
          {isGPS ? (
            <>
              <Item
                label={t('label.event_history_title')}
                description={t('label.event_history_subtitle')}
                onPress={() => navigation.navigate('ExposureHistoryScreen')}
              />
              <Item
                label={t('share.title')}
                description={t('share.subtitle')}
                onPress={() => navigation.navigate('ExportScreen')}
                last
              />
            </>
          ) : null}
        </Section>

        <FeatureFlag name='google_import'>
          <Section>
            <GoogleMapsImport navigation={navigation} />
          </Section>
        </FeatureFlag>

        <Section last>
          <Item
            label={t('label.about_title')}
            onPress={() => navigation.navigate('AboutScreen')}
          />
          <Item
            label={t('label.legal_page_title')}
            onPress={() => navigation.navigate('LicensesScreen')}
          />
          <Item
            label='Feature Flags (Dev mode only)'
            onPress={() => navigation.navigate(FEATURE_FLAG_SCREEN_NAME)}
            last
          />
        </Section>
      </ScrollView>
    </NavigationBarWrapper>
  );
};

export const LocationTrackingPermissions = ({ isGPS }) => {
  const { t } = useTranslation();
  const [locTrackingStatus, setLocTrackingStatus] = useLocTrackingStatus();

  const toggleAndroidLoc = async reason => {
    if (reason === Reason.NOT_AUTHORIZED || reason === Reason.USER_OFF) {
      // Note that Android allows us to toggle app location authorizaiton
      // without redirecting to settings like in iOS
      await setLocTrackingStatus(true);
    } else if (reason === Reason.LOCATION_OFF) {
      // Open device location settings
      DeviceSettings.location();
    } else {
      await setLocTrackingStatus(false);
    }
  };

  const toggleiOSLoc = async reason => {
    if (reason === Reason.USER_OFF) {
      await setLocTrackingStatus(true);
    } else if (reason === Reason.NOT_AUTHORIZED) {
      // Open location settings for the app
      openSettings();
    } else if (reason === Reason.LOCATION_OFF) {
      // Open device settings (iOS does not allow us to open device location settings)
      Linking.openURL('App-prefs:');
    } else {
      await setLocTrackingStatus(false);
    }
  };

  /**
   * Conditional toggling based on the location permission actions
   * that are enabled per platform.
   */
  const toggleLocTracking = async () => {
    const { reason } = locTrackingStatus;
    isPlatformiOS() ? toggleiOSLoc(reason) : toggleAndroidLoc(reason);
  };

  const getIcon = () => {
    const { canTrack } = locTrackingStatus;

    if (canTrack) {
      return Icons.Checkmark;
    } else if (canTrack === false) {
      return Icons.XmarkIcon;
    } else {
      return null;
    }
  };

  const label = locTrackingStatus.canTrack
    ? t('label.logging_active_location')
    : t('label.logging_inactive_location');

  if (isGPS) {
    return (
      <>
        <Item label={label} icon={getIcon()} onPress={toggleLocTracking} />
      </>
    );
  }
};

/**
 * Render a white section with blue spacer at the bottom (unless `last == true`)
 *
 * @param {{last?: boolean}} param0
 */
export const Section = ({ last, children }) => (
  <>
    <SectionWrapper>{children}</SectionWrapper>

    <Divider />

    {!last && (
      <>
        <View
          style={css`
            margin: 2% 0;
          `}
        />
        <Divider />
      </>
    )}
  </>
);

const SectionWrapper = styled.View`
  background-color: ${Colors.WHITE};
  padding: 0px 6.25%;
`;
