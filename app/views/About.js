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
              {languages.t('label.about_title')}
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.spacer} />

            <View style={styles.spacer} />

            <Text style={styles.aboutSectionTitles}>
              {languages.t('label.commitment')}
            </Text>
            <Text style={styles.aboutSectionPara}>
              {languages.t('label.commitment_para')}
            </Text>
            <Text style={styles.aboutSectionTitles}>
              {languages.t('label.team')}
            </Text>
            <Text style={styles.aboutSectionPara}>
              {languages.t('label.team_para')}
            </Text>
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
  contentContainer: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 26,
  },
  section: {
    flexDirection: 'column',
    width: '87.5%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
  },
  aboutSectionTitles: {
    color: Colors.VIOLET_TEXT,
    fontSize: 26,
    fontFamily: fontFamily.primaryMedium,
    marginTop: 52,
  },
  aboutSectionPara: {
    color: Colors.VIOLET_TEXT,
    fontSize: 16,
    lineHeight: 22.5,
    marginTop: 12,
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
