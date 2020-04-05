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

  importButtonPressed() {}

  getMapsImport() {
    return (
      <>
        <Text style={styles.buttonText}>
          {languages.t('label.maps_import_title')}
        </Text>
        <Text style={styles.buttonText}>
          {languages.t('label.maps_import_text')}
        </Text>
        <View>
          <ButtonWrapper
            title={languages.t('label.maps_import_button_text')}
            onPress={this.importButtonPressed.bind(this)}
            buttonColor={Colors.VIOLET}
            bgColor={Colors.WHITE}
            borderColor={Colors.VIOLET}
          />
        </View>
        <Text style={styles.buttonText}>
          {languages.t('label.maps_import_disclaimer')}
        </Text>
      </>
    );
  }

  getSettingRow(text, icon, color) {
    const renderIcon = () => {
      return icon ? <SvgXml xml={icon} /> : null;
    };
    return (
      <>
        <View style={styles.sectionRowContainer}>
          <Text
            style={[
              styles.settingButtonText,
              { color: color || Colors.VIOLET_TEXT },
            ]}>
            {languages.t(text)}
          </Text>
          {renderIcon()}
        </View>
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

          {/* <View style={styles.locationContainer}>
            <View style={styles.section}>
              <View style={styles.contentContainer}>
                {this.getMapsImport()}
              </View>
            </View>
          </View> */}

          <View style={styles.spacer}></View>
          <View style={styles.fullDivider}></View>

          <View style={styles.mainContainer}>
            <View style={styles.section}>
              {this.getSettingRow('label.about_title')}
              <View style={styles.divider}></View>
              {this.getSettingRow('label.licenses_title')}
              <View style={styles.divider}></View>
              {this.getSettingRow(
                'label.tested_positive_title',
                warning,
                Colors.RED_TEXT,
              )}
              <View style={styles.bottomDivider}></View>
            </View>
          </View>
          <View style={styles.fullDivider}></View>
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
    // alignItems: 'center',
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
    height: 60,
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
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
  },
  sectionRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '5%',
    backgroundColor: Colors.WHITE,
  },
  settingButtonText: {
    color: Colors.VIOLET_TEXT,
    fontSize: 16,
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
    marginVertical: '5%',
  },
});

export default SettingsScreen;
