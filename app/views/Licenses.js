import React, { Component } from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import foreArrow from './../assets/images/foreArrow.png';
import licenses from './../assets/LICENSE.json';
import languages from './../locales/languages';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import Colors from '../constants/colors';
import fontFamily from '../constants/fonts';

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

  handleTermsOfUsePressed() {
    Linking.openURL(languages.t('label.terms_of_use_url'));
  }

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

      result += '<H2>' + element.name + '</H2><P>';
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
        <TouchableOpacity
          onPress={this.handleTermsOfUsePressed.bind(this)}
          style={styles.termsInfoRow}>
          <View style={styles.termsInfoContainer}>
            <Text
              style={styles.mainTermsHeader}
              onPress={() =>
                Linking.openURL(languages.t('label.terms_of_use_url'))
              }>
              {languages.t('label.terms_of_use')}
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <Image source={foreArrow} style={this.arrow} />
          </View>
        </TouchableOpacity>
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
  termsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.SILVER,
  },
  termsInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'flex-end',
    padding: 15,
  },
  mainTermsHeader: {
    textAlign: 'left',
    color: Colors.MISCHKA,
    fontSize: 20,
    fontFamily: fontFamily.primaryBold,
  },
  arrowContainer: {
    alignSelf: 'center',
    paddingRight: 20,
  },
});

export default LicensesScreen;
