import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Dimensions,
} from 'react-native';

// This is the definitive listing of registered Healthcare Authorities.  To
// register, just submit a PR against that list on Github.  Users are also
// free to type in a non-official authority.
//
const authoritiesListURL =
  'https://raw.githubusercontent.com/tripleblindmarket/safe-places/develop/healthcare-authorities.yaml';

const width = Dimensions.get('window').width;
import languages from './../locales/languages';
import ButtonWrapper from '../components/ButtonWrapper';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import Colors from '../constants/colors';
import fontFamily from './../constants/fonts';
import warning from './../assets/svgs/warning';
import googleMapsIcon from './../assets/svgs/google-maps-logo';
import { SvgXml } from 'react-native-svg';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //
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
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  importButtonPressed() {
    this.props.navigation.navigate('ImportScreen');
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
    this.props.navigation.navigate('NotificationScreen');
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
            title={languages.t('label.maps_import_button_text')}
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
    const renderIcon = () => {
      return icon ? <SvgXml xml={icon} /> : null;
    };
    return (
      <>
        <TouchableOpacity
          onPress={actionListener.bind(this)}
          style={styles.sectionRowContainer}>
          {subtitle ? (
            <Text
              style={[
                styles.settingRowText,
                {
                  color: color || Colors.VIOLET_TEXT,
                  fontFamily: fontFamily.primaryBold,
                },
              ]}>
              {languages.t(text)}
            </Text>
          ) : (
            <Text
              style={[
                styles.settingRowText,
                { color: color || Colors.VIOLET_TEXT },
              ]}>
              {languages.t(text)}
            </Text>
          )}
          {renderIcon()}
          {subtitle ? (
            <Text style={styles.settingsRowSubtitleText}>
              {languages.t(subtitle)}
            </Text>
          ) : null}
        </TouchableOpacity>
      </>
    );
  }

  render() {
    return (
      <NavigationBarWrapper
        title={languages.t('label.settings_title')}
        onBackPress={this.backToMain.bind(this)}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* TODO FIX THIS - don't remove */}
          {/* <View style={styles.spacer} /> */}

          <View style={styles.fullDivider} />
          <View style={styles.mainContainer}>{this.getMapsImport()}</View>
          <View style={styles.fullDivider} />

          <View style={styles.spacer} />
          <View style={styles.fullDivider} />

          <View style={styles.mainContainer}>
            <View style={styles.section}>
              {this.getSettingRow(
                'label.choose_provider_title',
                this.chooseProviderScreenButtonPressed,
                null,
                null,
                'label.choose_provider_subtitle',
              )}
              <View style={styles.divider}></View>
              {this.getSettingRow(
                'label.news_title',
                this.newsButtonPressed,
                null,
                null,
                'label.news_subtitle',
              )}
              <View style={styles.divider}></View>
              {this.getSettingRow(
                'label.event_history_title',
                this.eventHistoryButtonPressed,
                null,
                null,
                'label.event_history_subtitle',
              )}
              <View style={styles.divider}></View>
              {this.getSettingRow(
                'label.tested_positive_title',
                this.testedPositiveButtonPressed,
                null,
                null,
                'label.tested_positive_subtitle',
              )}
            </View>
          </View>
          <View style={styles.fullDivider} />

          <View style={styles.spacer} />

          <View style={styles.fullDivider} />
          <View style={styles.mainContainer}>
            <View style={styles.section}>
              {this.getSettingRow('label.about_title', this.aboutButtonPressed)}
              <View style={styles.divider}></View>
              {this.getSettingRow(
                'label.legal_page_title',
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
