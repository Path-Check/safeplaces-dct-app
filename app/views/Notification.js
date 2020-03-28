import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Platform,
  Image,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import packageJson from '../../package.json';

import colors from '../constants/colors';
import backArrow from './../assets/images/backArrow.png';
import languages from './../locales/languages';
import AsyncStorage from '@react-native-community/async-storage';
import { GetStoreData, SetStoreData } from '../helpers/General';
import {
  VictoryBar,
  VictoryAxis,
  VictoryChart,
  VictoryTooltip,
} from 'victory-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
var using_random_intersections = false;

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.getInitialState();
  }

  backToMain() {
    this.resetState();
    this.props.navigation.navigate('LocationTrackingScreen', {});
  }

  handleBackPress = () => {
    this.resetState();
    this.props.navigation.navigate('LocationTrackingScreen', {});
    return true;
  };

  componentDidMount() {
    this.refreshState();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  refreshState() {
    this.getInitialState();
  }

  resetState() {
    if (using_random_intersections === true) {
      using_random_intersections = false;
      AsyncStorage.removeItem('CROSSED_PATHS');
      console.log('deleting random intersection data');
      this.setState({ dataAvailable: false });
    }
  }

  generate_random_intersections(length = 28) {
    using_random_intersections = true;
    var dayBin = [];
    for (var i = 0; i < length; i++) {
      // Random Integer between 0-99
      const intersections = Math.floor(Math.random() * 100);
      dayBin.push(intersections);
    }
    SetStoreData('CROSSED_PATHS', dayBin);
    this.refreshState();
  }

  getInitialState = async () => {
    GetStoreData('CROSSED_PATHS').then(dayBin => {
      console.log(dayBin);
      if (dayBin === null) {
        this.setState({ dataAvailable: false });
        console.log("Can't found Crossed Paths");
      } else {
        var crossed_path_data = [];
        console.log('Found Crossed Paths');
        this.setState({ dataAvailable: true });
        dayBinParsed = JSON.parse(dayBin);
        for (var i = 0; i < dayBinParsed.length; i++) {
          const val = dayBinParsed[i];
          data = { x: i, y: val, fill: this.colorfill(val) };
          crossed_path_data.push(data);
        }
        this.setState({ data: crossed_path_data });
      }
    });
  };

  colorfill(data) {
    var color = 'green';
    if (data > 20) {
      color = 'yellow';
    }
    if (data > 50) {
      color = 'orange';
    }
    if (data > 80) {
      color = 'red';
    }
    return color;
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
            {languages.t('label.notifications')}
          </Text>
        </View>

        <View style={styles.main}>
          <Text style={styles.pageTitle}>
            {languages.t('label.notification_title')}
          </Text>
          {this.state.dataAvailable ? (
            <>
              <VictoryChart height={0.35 * height} dependentAxis={true}>
                <VictoryAxis dependentAxis={true} />

                <VictoryBar
                  alignment='start'
                  style={{
                    data: {
                      fill: ({ datum }) => datum.fill,
                    },
                  }}
                  data={this.state.data}
                />
              </VictoryChart>
              <View style={styles.notificationsHeader}>
                <Text style={styles.notificationsHeaderText}>
                  {languages.t('label.notification_main_text')}
                </Text>
              </View>

              <ScrollView contentContainerStyle={styles.contentContainer}>
                {this.state.data.map(data => (
                  <View key={data.x} style={styles.notificationView}>
                    <Text
                      style={[
                        styles.notificationsText,
                        data.y > 80
                          ? styles.notificationsTextRed
                          : data.y > 50
                          ? styles.notificationsTextOrange
                          : null,
                      ]}>
                      {'Day ' + data.x + ': ' + data.y + ' intersections'}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              <Text style={styles.mainText}>
                {languages.t('label.notification_data_not_available')}
              </Text>
              <Text style={styles.mainText}>
                {languages.t('label.notification_warning_text')}
              </Text>
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => this.generate_random_intersections()}>
                <Text style={styles.buttonText}>
                  {languages.t('label.notification_random_data_button')}
                </Text>
              </TouchableOpacity>
            </>
          )}
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
  main: {
    flex: 1,
    paddingVertical: 20,
    width: '100%',
  },
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
  buttonTouchable: {
    borderRadius: 12,
    backgroundColor: '#665eff',
    alignSelf: 'center',
    width: width * 0.7866,
    marginTop: 30,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 36,
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
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'OpenSans-Regular',
    marginLeft: 20,
    marginRight: 20,
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
  pageTitle: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    marginLeft: 20,
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
    overflow: 'scroll',
    fontFamily: 'OpenSans-Regular',
  },
  notificationsHeader: {
    backgroundColor: '#665eff',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  notificationsHeaderText: {
    color: colors.WHITE,
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
  },
  notificationView: {
    width: '100%',
    borderBottomColor: '#bdc3c7',
    borderBottomWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  notificationsText: {
    color: colors.BLACK,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  notificationsTextRed: {
    color: colors.RED,
    fontFamily: 'OpenSans-Bold',
  },
  notificationsTextOrange: {
    color: colors.ORANGE,
    fontFamily: 'OpenSans-SemiBold',
  },
});

export default NotificationScreen;
