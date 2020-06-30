import styled, { css } from '@emotion/native';
import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, ScrollView, View } from 'react-native';

import checkmarkIcon from '../assets/svgs/checkmarkIcon';
import languagesIcon from '../assets/svgs/languagesIcon';
import xmarkIcon from '../assets/svgs/xmarkIcon';
import { Divider } from '../components/Divider';
import { FeatureFlag } from '../components/FeatureFlag';
import NativePicker from '../components/NativePicker';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import Colors from '../constants/colors';
import { PARTICIPATE } from '../constants/storage';
import { GetStoreData, SetStoreData, getMyself } from '../helpers/General';
import {
  LOCALE_LIST,
  getUserLocaleOverride,
  setUserLocaleOverride,
  supportedDeviceLanguageOrEnglish,
} from '../locales/languages';
import LocationServices from '../services/LocationService';
import { GoogleMapsImport } from './Settings/GoogleMapsImport';
import { SettingsItem as Item } from './Settings/SettingsItem';

export const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [isLogging, setIsLogging] = useState(undefined);
  const [isSharing, setIsSharing] = useState(false);
  const [isCovidPositive, setIsCovpositive] = useState([]);
  const [userLocale, setUserLocale] = useState(
    supportedDeviceLanguageOrEnglish(),
  );

  const backToMain = () => {
    navigation.goBack();
  };

  const getCovidpositive = () => {
    GetStoreData('shareLocation').then(sharing =>
      setIsSharing(sharing !== null ? true : false),
    );
    GetStoreData('users').then(users =>
      setIsCovpositive(users !== null ? JSON.parse(users) : []),
    );
  };

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    getCovidpositive();
    // TODO: this should be a service or hook
    GetStoreData(PARTICIPATE)
      .then(isParticipating => setIsLogging(isParticipating === 'true'))
      .catch(error => console.log(error));

    // TODO: extract into service or hook
    getUserLocaleOverride().then(locale => locale && setUserLocale(locale));

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const locationToggleButtonPressed = async () => {
    try {
      isLogging ? LocationServices.stop() : LocationServices.start();
      await SetStoreData(PARTICIPATE, !isLogging);
      setIsLogging(!isLogging);
    } catch (e) {
      console.log(e);
    }
  };

  const subcribeLocationToggleButtonPressed = async () => {
    try {
      isSharing
        ? await AsyncStorage.removeItem('shareLocation')
        : await SetStoreData('shareLocation', true);
      setIsSharing(!isSharing);
    } catch (e) {
      console.log(e);
    }
  };

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
          <Item
            label={
              isLogging
                ? t('label.logging_active')
                : t('label.logging_inactive')
            }
            icon={isLogging ? checkmarkIcon : xmarkIcon}
            onPress={locationToggleButtonPressed}
          />
          {isCovidPositive.length > 0 && getMyself(isCovidPositive) && (
            <Item
              label={
                isSharing
                  ? t('label.share_loc_active')
                  : t('label.share_loc_inactive')
              }
              icon={isSharing ? checkmarkIcon : xmarkIcon}
              onPress={subcribeLocationToggleButtonPressed}
            />
          )}
          <NativePicker
            items={LOCALE_LIST}
            value={userLocale}
            onValueChange={picker => localeChanged(picker)}>
            {({ label, openPicker }) => (
              <Item
                last
                label={label || t('label.home_unknown_header')}
                icon={languagesIcon}
                onPress={openPicker}
              />
            )}
          </NativePicker>
        </Section>
        <Section>
          {/* <Item
            label={t('label.choose_provider_title')}
            description={t('label.choose_provider_subtitle')}
            onPress={() => navigation.navigate('ChooseProviderScreen')}
          /> */}
          <Item
            label={t('label.event_history_title')}
            description={t('label.event_history_subtitle')}
            onPress={() => navigation.navigate('ExposureHistoryScreen')}
          />
          <Item
            label={
              isCovidPositive.length > 0
                ? t('label.epidemiologic_report_title')
                : t('label.epidemiologic_report_title_new')
            }
            description={t('label.epidemiologic_report_subtitle')}
            onPress={() => {
              if (isCovidPositive.length > 0) {
                navigation.navigate('UseFor');
              } else {
                navigation.navigate('ReportScreen', { back: true });
              }
            }}
            last
          />
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
            label={t('label.sponsor_title')}
            onPress={() => navigation.navigate('Sponsors')}
          />
          <Item
            label={t('label.legal_page_title')}
            onPress={() => navigation.navigate('LicensesScreen')}
          />
          <Item
            label={t('label.terms_and_conditions')}
            onPress={() => navigation.navigate('TermsCondition')}
          />
          <Item
            label={t('label.label_faqs')}
            onPress={() => navigation.navigate('FAQ')}
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
