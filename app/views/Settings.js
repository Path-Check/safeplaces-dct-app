import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Linking,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  BackHandler,
  ImageBackground,
  StatusBar,
} from 'react-native';

import languages from './../locales/languages';
import ButtonWrapper from '../components/ButtonWrapper';
import Colors from '../constants/colors';
import fontFamily from './../constants/fonts';
import backArrow from './../assets/svgs/backArrow';
import warning from './../assets/svgs/warning';
import googleMapsIcon from './../assets/svgs/google-maps-logo';
import { SvgXml } from 'react-native-svg';

const width = Dimensions.get('window').width;

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

  importButtonPressed() {
    console.log('importButton');
  }

  aboutButtonPressed() {
    console.log('about');
  }

  eventHistoryButtonPressed() {
    console.log('eventHistory');
  }

  licensesButtonPressed() {
    console.log('licenses');
  }

  testedPositiveButtonPressed() {
    console.log('testedPositive');
  }

  getHeader() {
    return (
      <>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backArrowTouchable}
            onPress={() => this.backToMain()}>
            <SvgXml style={styles.backArrow} xml={backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {languages.t('label.settings_title')}
          </Text>
        </View>
      </>
    );
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

  getSettingRow(text, icon, color) {
    const renderIcon = () => {
      return icon ? <SvgXml xml={icon} /> : null;
    };
    return (
      <>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('About')}
          style={styles.sectionRowContainer}>
          <Text
            style={[
              styles.settingRowText,
              { color: color || Colors.VIOLET_TEXT },
            ]}>
            {languages.t(text)}
          </Text>
          {renderIcon()}
        </TouchableOpacity>
      </>
    );
  }

  render() {
    return (
      <>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent={true}
        />
        <SafeAreaView style={styles.topSafeAreaContainer} />
        <SafeAreaView style={styles.bottomSafeAreaContainer}>
          {this.getHeader()}

          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.spacer} />

            <View style={styles.fullDivider} />
            <View style={styles.mainContainer}>{this.getMapsImport()}</View>
            <View style={styles.fullDivider} />

            <View style={styles.spacer} />
            <View style={styles.fullDivider} />

            <View style={styles.mainContainer}>
              <View style={styles.section}>
                <TouchableOpacity onPress={() => this.aboutButtonPressed()}>
                  {this.getSettingRow('label.about_title')}
                </TouchableOpacity>
                <View style={styles.divider}></View>
                <TouchableOpacity
                  onPress={() => this.eventHistoryButtonPressed()}>
                  {this.getSettingRow('label.event_history_title')}
                </TouchableOpacity>
                <View style={styles.divider}></View>
                <TouchableOpacity onPress={() => this.licensesButtonPressed()}>
                  {this.getSettingRow('label.licenses_title')}
                </TouchableOpacity>
                <View style={styles.divider}></View>
                <TouchableOpacity
                  onPress={() => this.testedPositiveButtonPressed()}>
                  {this.getSettingRow(
                    'label.tested_positive_title',
                    warning,
                    Colors.RED_TEXT,
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.fullDivider} />
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  topSafeAreaContainer: {
    flex: 0,
    backgroundColor: Colors.VIOLET,
  },
  bottomSafeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.INTRO_WHITE_BG,
  },
  headerContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.NAV_BAR_VIOLET,
    backgroundColor: Colors.VIOLET,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: fontFamily.primaryMedium,
    color: Colors.WHITE,
    position: 'absolute',
    alignSelf: 'center',
    textAlign: 'center',
    width: '100%',
  },
  backArrowTouchable: {
    width: 60,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backArrow: {
    height: 18,
    width: 18,
  },
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
  sectionRowContainer: {
    flexDirection: 'row',
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
