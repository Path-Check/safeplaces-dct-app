import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  BackHandler,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import packageJson from '../../package.json';

import Colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import languages from './../locales/languages';
import licenses from './../assets/LICENSE.json';
import NavigationBarWrapper from '../components/NavigationBarWrapper';

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

    for (var i = 0; i < licenses.terms_and_licenses.length; i++) {
      var element = licenses.terms_and_licenses[i];

      result += '<B>' + element.name + '</B><P>';
      result += element.text.replace(/\n/g, '<br/>');
      result += '<hr/>';
    }
    result += '</body></html>';

    return result;
  }

  render() {
    return (
      <NavigationBarWrapper
        title={languages.t('label.legal_page_title')}
        onBackPress={this.backToMain.bind(this)}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.main}>
            <View style={styles.row}>
              <Text style={styles.valueName}>Version: </Text>
              <Text style={styles.value}>{packageJson.version}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.valueSmall}>
                OS:
                {Platform.OS + ' v' + Platform.Version};
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
      </NavigationBarWrapper>
    );
  }
}

const styles = StyleSheet.create({
  // Container covers the entire screen
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
  valueSmall: {
    color: Colors.VIOLET_TEXT,
    fontSize: 16,
    fontFamily: fontFamily.primaryMedium,
    marginTop: 9,
  },
});

export default LicensesScreen;
