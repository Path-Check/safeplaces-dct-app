import styled, { css } from '@emotion/native';
import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView, View } from 'react-native';

import checkmarkIcon from '../assets/svgs/checkmarkIcon';
import languagesIcon from '../assets/svgs/languagesIcon';
import xmarkIcon from '../assets/svgs/xmarkIcon';
import { Divider } from '../components/Divider';
import NativePicker from '../components/NativePicker';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import Colors from '../constants/colors';
import { PARTICIPATE } from '../constants/storage';
import { GetStoreData, SetStoreData } from '../helpers/General';
import languages, {
  LOCALE_LIST,
  LOCALE_NAME,
  getUserLocaleOverride,
  setUserLocaleOverride,
} from '../locales/languages';
import LocationServices from '../services/LocationService';
import { GoogleMapsImport } from './Settings/GoogleMapsImport';
import { SettingsItem as Item } from './Settings/SettingsItem';

export const SettingsScreen = ({ navigation }) => {
  const backToMain = () => {
    navigation.goBack();
  };

  const handleBackPress = () => {
    backToMain();
    return true;
  };

  const [isLogging, setIsLogging] = useState(undefined);

  const [userLocale, setUserLocale] = useState(undefined);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // TODO: this should be a service or hook
    GetStoreData(PARTICIPATE)
      .then(isParticipating => setIsLogging(isParticipating === 'true'))
      .catch(error => console.log(error));

    // TODO: extract into service or hook
    getUserLocaleOverride().then(locale => setUserLocale(locale));

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  const locationToggleButtonPressed = async () => {
    try {
      isLogging ? LocationServices.stop() : LocationServices.start();
      await SetStoreData(PARTICIPATE, !isLogging);
      setIsLogging(!isLogging);
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
      title={languages.t('label.settings_title')}
      onBackPress={backToMain}>
      <ScrollView>
        <Section>
          <Item
            label={
              isLogging
                ? languages.t('label.logging_active')
                : languages.t('label.logging_inactive')
            }
            icon={isLogging ? checkmarkIcon : xmarkIcon}
            onPress={locationToggleButtonPressed}
          />
          <Item
            last
            label={LOCALE_NAME[userLocale] || 'Unknown'}
            icon={languagesIcon}
          />
          {/* TODO: allow picker to render custom UI, remove need for negative
              margins */}
          <View
            style={css`
              margin-top: -40px;
              height: 40px;
            `}>
            <NativePicker
              items={LOCALE_LIST}
              value={userLocale}
              hidden
              onValueChange={localeChanged}
            />
          </View>
        </Section>

        <Section>
          <Item
            label={languages.t('label.choose_provider_title')}
            description={languages.t('label.choose_provider_subtitle')}
            onPress={() => navigation.navigate('ChooseProviderScreen')}
          />
          <Item
            label={languages.t('label.news_title')}
            description={languages.t('label.news_subtitle')}
            onPress={() => navigation.navigate('NewsScreen')}
          />
          <Item
            label={languages.t('label.event_history_title')}
            description={languages.t('label.event_history_subtitle')}
            onPress={() => navigation.navigate('ExposureHistoryScreen')}
          />
          <Item
            label={languages.t('label.tested_positive_title')}
            description={languages.t('label.tested_positive_subtitle')}
            onPress={() => navigation.navigate('ExportScreen')}
            last
          />
        </Section>

        <Section>
          <GoogleMapsImport navigation={navigation} />
        </Section>

        <Section last>
          <Item
            label={languages.t('label.about_title')}
            onPress={() => navigation.navigate('AboutScreen')}
          />
          <Item
            label={languages.t('label.legal_page_title')}
            onPress={() => navigation.navigate('LicensesScreen')}
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
