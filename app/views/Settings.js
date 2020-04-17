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

  // // Get locales list from i18next for locales menu
  //   let localesList = [];
  //   for (let key in languages.options.resources) {
  //     localesList = localesList.concat({
  //       value: key,
  //       label: languages.options.resources[key].label,
  //     });
  //   }

  //   this.state = {
  //     isLogging: '',
  //     language: findUserLang(res => {
  //       this.setState({ language: res });
  //     }),
  //     localesList: localesList,
  //   };

  // GetStoreData(PARTICIPATE)
  //     .then(isParticipating => {
  //       if (isParticipating === 'true') {
  //         this.setState({
  //           isLogging: true,
  //         });
  //         this.willParticipate();
  //       } else {
  //         this.setState({
  //           isLogging: false,
  //         });
  //       }
  //     })
  //     .catch(error => console.log(error));

  // locationToggleButtonPressed() {
  //   this.state.isLogging ? LocationServices.stop() : LocationServices.start();
  //   this.setState({
  //     isLogging: !this.state.isLogging,
  //   });
  //   SetStoreData(PARTICIPATE, !this.state.isLogging).catch(error =>
  //     console.log(error),
  //   );
  // }

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
        </Section>

        {this.getSettingRow(
                this.state.isLogging
                  ? languages.t('label.logging_active')
                  : languages.t('label.logging_inactive'),
                this.locationToggleButtonPressed,
                this.state.isLogging ? checkmarkIcon : xmarkIcon,
                null,
                null,
              )}
              <View style={styles.divider} />
              {this.getSettingRow(
                selectedLabel,
                this.aboutButtonPressed,
                languagesIcon,
                null,
                null,
              )}
              <View
                style={{
                  marginTop: -65,
                  position: 'relative',
                  alignSelf: 'center',
                  width: '100%',
                  zIndex: 10,
                  backgroundColor: 'none',
                  paddingVertical: '5%',
                  paddingBottom: '2%',
                }}>
                <NativePicker
                  items={this.state.localesList}
                  value={this.state.language}
                  hidden
                  onValueChange={itemValue => {
                    this.setState({ language: itemValue });

                    // If user picks manual lang, update and store setting
                    languages.changeLanguage(itemValue, err => {
                      if (err)
                        return console.log(
                          'something went wrong in lang change',
                          err,
                        );
                    });

                    SetStoreData(LANG_OVERRIDE, itemValue);
                  }}
                />
              </View>

        */}

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
