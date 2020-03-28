import React, { Component } from 'react';
import {
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
import WebView from 'react-native-webview';
import backArrow from './../assets/images/backArrow.png';
import { SearchAndImport } from '../helpers/GoogleTakeOutAutoImport';
import languages from './../locales/languages';
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
    this.props.navigation.navigate('LocationTrackingScreen', {});
  }

  handleBackPress = () => {
    this.props.navigation.navigate('LocationTrackingScreen', {});
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
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backArrowTouchable}
            onPress={() => this.backToMain()}>
            <Image style={styles.backArrow} source={backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {languages.t('label.import_title')}
          </Text>
        </View>

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
      </SafeAreaView>
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
    fontFamily: 'OpenSans-Bold',
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'center',
    marginTop: 12,
    fontFamily: 'OpenSans-Regular',
  },
});
export default ImportScreen;
