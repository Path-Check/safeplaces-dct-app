import React, { Component } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import WebView from 'react-native-webview';

import languages from './../locales/languages';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import { SearchAndImport } from '../helpers/GoogleTakeOutAutoImport';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class ImportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: true };
    // Autoimports if user has downloaded
    SearchAndImport();
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  hideSpinner() {
    this.setState({ visible: false });
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    let counter = 0;
    return (
      <NavigationBarWrapper
        title={languages.t('label.import_title')}
        onBackPress={this.backToMain.bind(this)}>
        <View style={styles.main}>
          <View style={styles.subHeaderTitle}>
            <Text style={styles.sectionDescription}>
              {languages.t('label.import_step_1')}
            </Text>
            <Text style={styles.sectionDescription}>
              {languages.t('label.import_step_2')}
            </Text>
          </View>
          <View style={styles.web}>
            <WebView
              source={{
                uri:
                  'https://takeout.google.com/settings/takeout/custom/location_history',
              }}
              onLoad={() => this.hideSpinner()}
              // Reload once on error to workaround chromium regression for Android
              // Chromiumn Bug :: https://bugs.chromium.org/p/chromium/issues/detail?id=1023678
              ref={ref => {
                this.webView = ref;
              }}
              onError={() => {
                console.log(counter);
                if (counter === 0) {
                  this.webView.reload();
                }
                counter++;
              }}
              renderError={errorName => {
                if (counter >= 1) {
                  <View style={styles.sectionDescription}>
                    <Text>Error Occurred while importing file {errorName}</Text>
                  </View>;
                }
              }}
              style={{ marginTop: 15 }}
            />
            {this.state.visible && (
              <ActivityIndicator
                style={{
                  position: 'absolute',
                  top: height / 2,
                  left: width / 2,
                }}
                size='large'
              />
            )}
          </View>
        </View>
      </NavigationBarWrapper>
    );
  }
}

const styles = StyleSheet.create({
  // Container covers the entire screen
  container: {
    flex: 1,
    flexDirection: 'column',
    color: colors.PRIMARY_TEXT,
    backgroundColor: colors.WHITE,
  },
  subHeaderTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    padding: 5,
  },
  web: {
    flex: 1,
    width: '100%',
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'center',
    marginTop: 12,
    fontFamily: fontFamily.primaryRegular,
  },
});
export default ImportScreen;
