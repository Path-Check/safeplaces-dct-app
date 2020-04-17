import styled, { css } from '@emotion/native';
import React, { useEffect } from 'react';
import { BackHandler, ScrollView, View } from 'react-native';

import languages from './../locales/languages';
import { Divider } from '../components/Divider';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import Colors from '../constants/colors';
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

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  return (
    <NavigationBarWrapper
      title={languages.t('label.settings_title')}
      onBackPress={backToMain}>
      <ScrollView>
        {/* DISABLED for Abhishek to wire up location disable/enable */}
        {/* <Section>
          <Item
            last
            label={languages.t('label.launch_location_access')}
            icon={IconGranted}
          />
        </Section> */}

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

    {!last && (
      <>
        <Divider />
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
