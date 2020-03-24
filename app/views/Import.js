import React, { Component } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import WebView from 'react-native-webview';
import backArrow from './../assets/images/backArrow.png';
import { ImportTakeoutData } from '../helpers/GoogleTakeOutAutoImport';
import languages from './../locales/languages';
<<<<<<< HEAD
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

import NavigationBarWrapper from '../components/NavigationBarWrapper';

class ImportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: true };
    // Autoimports if user has downloaded
    SearchAndImport();
=======
import { PickFile } from '../helpers/General';

const width = Dimensions.get('window').width;

class ImportScreen extends Component {
  constructor(props) {
    super(props);
>>>>>>> initial commit. working on android
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

  importPickFile() {
    PickFile().then(filePath =>
      ImportTakeoutData(filePath).catch(err => {
        console.log(err);
      }),
    );
  }

  render() {
    let counter = 0;
    return (
      <NavigationBarWrapper
        title={languages.t('label.import_title')}
        onBackPress={this.backToMain.bind(this)}>
        <View style={styles.main}>
          <Text style={styles.sectionDescription}>
            {languages.t('label.import_step_1')}
          </Text>
          <Text style={styles.sectionDescription}>
            {languages.t('label.import_step_2')}
          </Text>
          <Text style={styles.sectionDescription}>
            {languages.t('label.import_step_3')}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://takeout.google.com/settings/takeout/custom/location_history',
              )
            }
            style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>
              {languages.t('label.import_takeout').toUpperCase()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.importPickFile()}
            style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>
              {languages.t('label.import_title').toUpperCase()}
            </Text>
<<<<<<< HEAD
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
=======
          </TouchableOpacity>
>>>>>>> initial commit. working on android
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
  main: {
    flex: 1,
    flexDirection: 'column',
    textAlignVertical: 'top',
    // alignItems: 'center',
    padding: 20,
    width: '96%',
    alignSelf: 'center',
  },
  buttonTouchable: {
    borderRadius: 12,
    backgroundColor: '#665eff',
    height: 52,
    alignSelf: 'center',
    width: width * 0.7866,
    marginTop: 30,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  mainText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '400',
    textAlignVertical: 'center',
    padding: 20,
  },
  smallText: {
    fontSize: 10,
    lineHeight: 24,
    fontWeight: '400',
    textAlignVertical: 'center',
    padding: 20,
  },

  headerContainer: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(189, 195, 199,0.6)',
    alignItems: 'center',
  },
  backArrowTouchable: {
    width: 60,
    height: 60,
    paddingTop: 21,
    paddingLeft: 20,
  },
  backArrow: {
    height: 18,
    width: 18.48,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fontFamily.primaryRegular,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    fontFamily: fontFamily.primaryRegular,
  },
});
export default ImportScreen;
