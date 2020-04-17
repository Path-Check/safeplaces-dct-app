import React, { Component } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import checkmarkIcon from './../assets/svgs/checkmarkIcon';
import googleMapsIcon from './../assets/svgs/google-maps-logo';
import languagesIcon from './../assets/svgs/languagesIcon';
import xmarkIcon from './../assets/svgs/xmarkIcon';
import fontFamily from './../constants/fonts';
import languages, { findUserLang } from './../locales/languages';
import ButtonWrapper from '../components/ButtonWrapper';
import NativePicker from '../components/NativePicker';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import Colors from '../constants/colors';
import { PARTICIPATE } from '../constants/storage';
import { LANG_OVERRIDE } from '../constants/storage';
import { GetStoreData, SetStoreData } from '../helpers/General';
import LocationServices from '../services/LocationService';

// This is the definitive listing of registered Healthcare Authorities.  To
// register, just submit a PR against that list on Github.  Users are also
// free to type in a non-official authority.
//

class SettingsScreen extends Component {
  constructor(props) {
    super(props);

    // Get locales list from i18next for locales menu
    let localesList = [];
    for (let key in languages.options.resources) {
      localesList = localesList.concat({
        value: key,
        label: languages.options.resources[key].label,
      });
    }

    this.state = {
      isLogging: '',
      language: findUserLang(res => {
        this.setState({ language: res });
      }),
      localesList: localesList,
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.backToMain();
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    GetStoreData(PARTICIPATE)
      .then(isParticipating => {
        if (isParticipating === 'true') {
          this.setState({
            isLogging: true,
          });
          this.willParticipate();
        } else {
          this.setState({
            isLogging: false,
          });
        }
      })
      .catch(error => console.log(error));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  locationToggleButtonPressed() {
    this.state.isLogging ? LocationServices.stop() : LocationServices.start();
    this.setState({
      isLogging: !this.state.isLogging,
    });
    SetStoreData(PARTICIPATE, !this.state.isLogging).catch(error =>
      console.log(error),
    );
  }

  importButtonPressed() {
    if (__DEV__) {
      this.props.navigation.navigate('ImportScreen');
    }
  }

  aboutButtonPressed() {
    this.props.navigation.navigate('AboutScreen');
  }

  chooseProviderScreenButtonPressed() {
    this.props.navigation.navigate('ChooseProviderScreen');
  }

  newsButtonPressed() {
    this.props.navigation.navigate('NewsScreen');
  }

  eventHistoryButtonPressed() {
    this.props.navigation.navigate('ExposureHistoryScreen');
  }

  licensesButtonPressed() {
    this.props.navigation.navigate('LicensesScreen');
  }

  testedPositiveButtonPressed() {
    this.props.navigation.navigate('ExportScreen');
  }

  getMapsImport() {
    return (
      <>
        <View style={styles.section}>
          <View style={styles.iconRowContainer}>
            <SvgXml xml={googleMapsIcon} style={{ alignSelf: 'center' }} />
            <Text style={styles.iconRowText}>
              {languages.t('label.maps_import_title')}
            </Text>
          </View>
          <View style={styles.sectionRowContainer}>
            <Text style={styles.settingRowText}>
              {languages.t('label.maps_import_text')}
            </Text>
          </View>
          <ButtonWrapper
            title={
              __DEV__
                ? languages.t('label.maps_import_button_text')
                : 'Coming soon'
            }
            onPress={this.importButtonPressed.bind(this)}
            buttonColor={Colors.VIOLET}
            bgColor={Colors.WHITE}
            borderColor={Colors.VIOLET}
            buttonWidth={'100%'}
          />
          <View style={styles.sectionRowContainer}>
            <Text style={styles.settingRowNoteText}>
              {languages.t('label.maps_import_disclaimer')}
            </Text>
          </View>
        </View>
      </>
    );
  }

  getSettingRow(text, actionListener, icon, color, subtitle) {
    const renderIcon = styles => {
      return icon ? <SvgXml xml={icon} style={styles} /> : null;
    };
    return (
      <>
        <TouchableOpacity
          onPress={actionListener.bind(this)}
          style={styles.sectionRowContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {renderIcon({
              maxWidth: 24,
              maxHeight: 24,
              marginRight: 12,
              marginTop: 2.5,
            })}
            {subtitle ? (
              <Text
                style={[
                  styles.settingRowText,
                  {
                    color: color || Colors.VIOLET_TEXT,
                    fontFamily: fontFamily.primaryBold,
                  },
                ]}>
                {text}
              </Text>
            ) : (
              <Text
                style={[
                  styles.settingRowText,
                  { color: color || Colors.VIOLET_TEXT },
                ]}>
                {text}
              </Text>
            )}
          </View>
          {subtitle ? (
            <Text style={styles.settingsRowSubtitleText}>{subtitle}</Text>
          ) : null}
        </TouchableOpacity>
      </>
    );
  }

  render() {
    // Get the prettified label for the selected language
    const selectedItem = this.state.localesList.find(
      i => i.value === this.state.language,
    );
    const selectedLabel = selectedItem ? selectedItem.label : '';

    return (
      <NavigationBarWrapper
        title={languages.t('label.settings_title')}
        onBackPress={this.backToMain.bind(this)}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* TODO FIX THIS - don't remove */}
          {/* <View style={styles.spacer} /> */}

          <View style={styles.fullDivider} />
          <View style={styles.mainContainer}>
            <View style={styles.section}>
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
            </View>
          </View>
          <View style={styles.fullDivider} />

          <View style={styles.spacer} />

          <View style={styles.fullDivider} />
          <View style={styles.mainContainer}>{this.getMapsImport()}</View>
          <View style={styles.fullDivider} />

          <View style={styles.spacer} />
          <View style={styles.fullDivider} />

          <View style={styles.mainContainer}>
            <View style={styles.section}>
              {this.getSettingRow(
                languages.t('label.choose_provider_title'),
                this.chooseProviderScreenButtonPressed,
                null,
                null,
                languages.t('label.choose_provider_subtitle'),
              )}
              <View style={styles.divider} />
              {this.getSettingRow(
                languages.t('label.news_title'),
                this.newsButtonPressed,
                null,
                null,
                languages.t('label.news_subtitle'),
              )}
              <View style={styles.divider} />
              {this.getSettingRow(
                languages.t('label.event_history_title'),
                this.eventHistoryButtonPressed,
                null,
                null,
                languages.t('label.event_history_subtitle'),
              )}
              <View style={styles.divider} />

              {this.getSettingRow(
                languages.t('label.tested_positive_title'),
                this.testedPositiveButtonPressed,
                null,
                null,
                languages.t('label.tested_positive_subtitle'),
              )}
            </View>
          </View>

          <View style={styles.fullDivider} />
          <View style={styles.spacer} />
          <View style={styles.fullDivider} />

          <View style={styles.mainContainer}>{this.getMapsImport()}</View>

          <View style={styles.fullDivider} />
          <View style={styles.spacer} />
          <View style={styles.fullDivider} />

          <View style={styles.mainContainer}>
            <View style={styles.section}>
              {this.getSettingRow(
                languages.t('label.about_title'),
                this.aboutButtonPressed,
              )}
              <View style={styles.divider} />
              {this.getSettingRow(
                languages.t('label.legal_page_title'),
                this.licensesButtonPressed,
              )}
            </View>
          </View>
          <View style={styles.fullDivider} />
        </ScrollView>
      </NavigationBarWrapper>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: Colors.WHITE,
  },
  section: {
    flexDirection: 'column',
    width: '87.5%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
  },
  settingsRowSubtitleText: {
    width: '87.5%',
    fontSize: 16,
    color: Colors.VIOLET_TEXT,
    backgroundColor: Colors.WHITE,
    fontFamily: fontFamily.primary,
  },
  sectionRowContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: '5%',
    backgroundColor: Colors.WHITE,
  },
  iconRowContainer: {
    flexDirection: 'row',
    paddingTop: '4%',
  },
  settingRowText: {
    color: Colors.VIOLET_TEXT,
    fontSize: 18,
    fontFamily: fontFamily.primaryRegular,
  },
  settingRowNoteText: {
    color: Colors.VIOLET_TEXT,
    fontSize: 14,
    opacity: 0.6,
    fontFamily: fontFamily.primaryItalic,
  },
  iconRowText: {
    color: Colors.VIOLET_TEXT,
    fontSize: 21,
    paddingLeft: 10,
    alignSelf: 'center',
    fontFamily: fontFamily.primaryRegular,
  },
  divider: {
    backgroundColor: Colors.DIVIDER,
    height: 1.5,
  },
  fullDivider: {
    backgroundColor: Colors.DIVIDER,
    height: 1,
    width: '100%',
  },
  spacer: {
    marginVertical: '2%',
  },
});

export default SettingsScreen;
