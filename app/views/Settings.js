import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
<<<<<<< HEAD
=======
  Platform,
>>>>>>> Create Settings screen
  Image,
  Dimensions,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
<<<<<<< HEAD

import { GetStoreData, SetStoreData } from '../helpers/General';
import colors from '../constants/colors';
import backArrow from './../assets/images/backArrow.png';

const width = Dimensions.get('window').width;

class SettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
        authorities: []
    }
=======
import { WebView } from 'react-native-webview';
import packageJson from '../../package.json';
import colors from '../constants/colors';
import backArrow from './../assets/images/backArrow.png';
import languages from './../locales/languages';
import licenses from './../assets/LICENSE.json';

const width = Dimensions.get('window').width;

class LicensesScreen extends Component {
  constructor(props) {
    super(props);
>>>>>>> Create Settings screen
  }

  backToMain() {
    this.props.navigation.navigate('LocationTrackingScreen', {});
  }

  handleBackPress = () => {
    this.props.navigation.navigate('LocationTrackingScreen', {});
    return true;
  };

  componentDidMount() {
<<<<<<< HEAD
    var self = this;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    GetStoreData('AUTHORITY_URLS').then(authorities => {
        if (authorities) {
            self.setState({authorities: authorities});
        }
    });
=======
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
>>>>>>> Create Settings screen
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

<<<<<<< HEAD
=======
  getLicenses() {
    let result = '<html>';
    result +=
      '<style>  html, body { font-size: 40px; margin: 0; padding: 0; } </style>';
    result += '<body>';

    for (let i = 0; i < licenses.licenses.length; i++) {
      let element = licenses.licenses[i];

      result += '<B>' + element.name + '</B><P>';
      result += element.text.replace(/\n/g, '<br/>');
      result += '<hr/>';
    }
    result += '</body></html>';

    return result;
  }

>>>>>>> Create Settings screen
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backArrowTouchable}
            onPress={() => this.backToMain()}>
            <Image style={styles.backArrow} source={backArrow} />
          </TouchableOpacity>
<<<<<<< HEAD
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        {/* The purpose of this section should populate a list of authorty URLS from the above didMount and should enable adding/deleting/editing of multiple or single web URLS. */}
        <View style={styles.main}>
          <Text style={styles.sectionDescription}>
              Setup Authorities
          </Text>
          <Text style={styles.sectionDescription, {color:'gray', fontSize:12}}>
              Coming Soon
            {/* Authorties section to add the URLs and Show current stored Authority URLS */}
          </Text>
=======
          <Text style={styles.headerTitle}>Licenses</Text>
        </View>

        <View style={styles.main}>
          <Text style={styles.headerTitle}>
            {languages.t('label.authorities_title')}
          </Text>

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

        <View style={{ flex: 4, paddingLeft: 20, paddingRight: 15 }}>
          <WebView
            originWhitelist={['*']}
            source={{
              html: this.getLicenses(),
            }}
            style={{ marginTop: 15 }}
          />
>>>>>>> Create Settings screen
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
<<<<<<< HEAD
  subHeaderTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    padding: 5,
  },
=======
>>>>>>> Create Settings screen
  main: {
    flex: 1,
    flexDirection: 'column',
    textAlignVertical: 'top',
    // alignItems: 'center',
    padding: 20,
    width: '96%',
    alignSelf: 'center',
  },
<<<<<<< HEAD
=======
  row: {
    flex: 1,
    flexDirection: 'row',
    color: colors.PRIMARY_TEXT,
    backgroundColor: colors.WHITE,
  },
  valueName: {
    fontSize: 20,
    fontWeight: '800',
  },
  value: {
    fontSize: 20,
    fontWeight: '200',
  },

>>>>>>> Create Settings screen
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
  headerTitle: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
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
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
<<<<<<< HEAD
=======
    overflow: 'scroll',
>>>>>>> Create Settings screen
    fontFamily: 'OpenSans-Regular',
  },
});

<<<<<<< HEAD
export default SettingsScreen;
=======
export default LicensesScreen;
>>>>>>> Create Settings screen
