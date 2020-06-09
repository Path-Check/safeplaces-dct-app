import styled, { css } from '@emotion/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, ScrollView, View } from 'react-native';

import { Icons } from '../../assets';
import {
  Divider,
  NativePicker,
  NavigationBarWrapper,
  FeatureFlag,
} from '../../components';
import Colors from '../../constants/colors';
import {
  LOCALE_LIST,
  getUserLocaleOverride,
  setUserLocaleOverride,
  supportedDeviceLanguageOrEnglish,
} from '../../locales/languages';
import { FEATURE_FLAG_SCREEN_NAME } from '../../views/FeatureFlagToggles';
import { Item } from './Item';
import { isGPS } from '../../COVIDSafePathsConfig';
import { GoogleMapsImport } from './GoogleMapsImport';

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
      title={t('screen_titles.more')}
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
          <Item label={t('screen_titles.faq')} />
          <Item label={t('screen_titles.report_issue')} last />
        </Section>

        <Section>
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
            label={t('screen_titles.about')}
            onPress={() => navigation.navigate('AboutScreen')}
          />
          <Item
            label={t('screen_titles.legal')}
            onPress={() => navigation.navigate('LicensesScreen')}
            last={!__DEV__}
          />
          {__DEV__ && (
            <Item
              label='Feature Flags (Dev mode only)'
              onPress={() => navigation.navigate(FEATURE_FLAG_SCREEN_NAME)}
              last
            />
          )}
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
