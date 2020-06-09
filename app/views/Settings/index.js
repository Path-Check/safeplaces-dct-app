import styled, { css } from '@emotion/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, ScrollView, View } from 'react-native';

import { Icons } from '../../assets';
import {
  Divider,
  FeatureFlag,
  NativePicker,
  NavigationBarWrapper,
} from '../../components';
import Colors from '../../constants/colors';
import { isGPS } from '../../COVIDSafePathsConfig';
import {
  LOCALE_LIST,
  getUserLocaleOverride,
  setUserLocaleOverride,
  supportedDeviceLanguageOrEnglish,
} from '../../locales/languages';
import { FEATURE_FLAG_SCREEN_NAME } from '../../views/FeatureFlagToggles';
import { GoogleMapsImport } from './GoogleMapsImport';
import { Item } from './Item';

export const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [userLocale, setUserLocale] = useState(
    supportedDeviceLanguageOrEnglish(),
  );

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
    getUserLocaleOverride().then((locale) => locale && setUserLocale(locale));

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const localeChanged = async (locale) => {
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
              <FeatureFlag
                name='export_e2e'
                fallback={
                  <Item
                    label={t('share.title')}
                    description={t('share.subtitle')}
                    onPress={() => navigation.navigate('ExportLocally')}
                    last
                  />
                }>
                <Item
                  label={t('share.title')}
                  description={t('share.subtitle')}
                  onPress={() => navigation.navigate('ExportScreen')}
                  last
                />
              </FeatureFlag>
            </>
          ) : null}
        </Section>

        {isGPS && (
          <FeatureFlag name='google_import'>
            <Section>
              <GoogleMapsImport navigation={navigation} />
            </Section>
          </FeatureFlag>
        )}

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
