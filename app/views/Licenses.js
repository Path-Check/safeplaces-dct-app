import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import packageJson from '../../package.json';

import Colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import languages from './../locales/languages';
import licenses from './../assets/LICENSE.json';
import { SvgXml } from 'react-native-svg';
import backArrow from './../assets/svgs/backArrow';

class LicensesScreen extends Component {
  constructor(props) {
    super(props);
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

  getLicenses() {
    var result = '<html>';
    result +=
      '<style>  html, body { font-size: 40px; margin: 0; padding: 0; } </style>';
    result += '<body>';

    for (var i = 0; i < licenses.licenses.length; i++) {
      var element = licenses.licenses[i];

      result += '<B>' + element.name + '</B><P>';
      result += element.text.replace(/\n/g, '<br/>');
      result += '<hr/>';
    }
    result += '</body></html>';

    return result;
  }

  render() {
    return (
      <>
        <StatusBar
          barStyle='light-content'
          backgroundColor={
            Platform.OS === 'ios' ? 'transparent' : Colors.VIOLET
          }
          translucent={Platform.OS === 'ios' ? true : false}
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
              {languages.t('label.licenses_title')}
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.main}>
              <View style={styles.row}>
                <Text style={styles.valueName}>
                  {languages.t('label.private_kit')}{' '}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.valueName}>Version: </Text>
                <Text style={styles.value}>{packageJson.version}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.valueName}>OS: </Text>
                <Text style={styles.value}>
                  {Platform.OS + ' v' + Platform.Version}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.valueName}>Screen Resolution: </Text>
                <Text style={styles.value}>
                  {' '}
                  {Math.trunc(Dimensions.get('screen').width) +
                    ' x ' +
                    Math.trunc(Dimensions.get('screen').height)}
                </Text>
              </View>
            </View>
            <View style={styles.spacer} />

            <View style={styles.spacer} />

            <View style={{ flex: 4 }}>
              <WebView
                originWhitelist={['*']}
                source={{
                  html: this.getLicenses(),
                }}
                style={{
                  marginTop: 15,
                  backgroundColor: Colors.INTRO_WHITE_BG,
                }}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  // Container covers the entire screen
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
    backgroundColor: Colors.INTRO_WHITE_BG,
    paddingHorizontal: 26,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    color: Colors.PRIMARY_TEXT,
    alignItems: 'flex-start',
  },
  valueName: {
    color: Colors.VIOLET_TEXT,
    fontSize: 20,
    fontFamily: fontFamily.primaryMedium,
    marginTop: 9,
  },
  value: {
    color: Colors.VIOLET_TEXT,
    fontSize: 20,
    fontFamily: fontFamily.primaryMedium,
    marginTop: 9,
  },
});

export default LicensesScreen;
