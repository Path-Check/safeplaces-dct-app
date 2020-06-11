import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { Icons } from '../../assets';
import {
  FeatureFlag,
  NativePicker,
  NavigationBarWrapper,
} from '../../components';
import { isGPS } from '../../COVIDSafePathsConfig';
import {
  LOCALE_LIST,
  setUserLocaleOverride,
  supportedDeviceLanguageOrEnglish,
} from '../../locales/languages';
import { FEATURE_FLAG_SCREEN_NAME } from '../../views/FeatureFlagToggles';
import { EN_DEBUG_MENU_SCREEN_NAME } from './ENDebugMenu';
import { GoogleMapsImport } from './GoogleMapsImport';
import { Item } from './Item';
import { Section } from './Section';

export const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [userLocale, setUserLocale] = useState(
    supportedDeviceLanguageOrEnglish(),
  );

  const backToMain = () => {
    navigation.goBack();
  };

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
      includeBackButton={false}
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
          <Item
            label={t('label.choose_provider_title')}
            description={t('label.choose_provider_subtitle')}
            onPress={() => navigation.navigate('ChooseProviderScreen')}
          />
          <Item
            label={t('label.news_title')}
            description={t('label.news_subtitle')}
            onPress={() => navigation.navigate('NewsScreen')}
          />
          <Item
            label={t('assessment.settings_title')}
            description={t('assessment.settings_subtitle')}
            onPress={() => navigation.navigate('AssessmentScreen')}
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
                />
                <Item label={t('screen_titles.faq')} />
                <Item label={t('screen_titles.report_issue')} last />
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
          <Item
            label='Feature Flags (Dev mode only)'
            onPress={() => navigation.navigate(FEATURE_FLAG_SCREEN_NAME)}
            last={isGPS}
          />
          {!isGPS ? (
            <Item
              label='EN Debug Menu'
              onPress={() => navigation.navigate(EN_DEBUG_MENU_SCREEN_NAME)}
              last
            />
          ) : null}
        </Section>
      </ScrollView>
    </NavigationBarWrapper>
  );
};
