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
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Colors from '../constants/colors';
import LocationServices from '../services/LocationService';
import BroadcastingServices from '../services/BroadcastingService';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import exportImage from './../assets/images/export.png';
import news from './../assets/images/newspaper.png';
import kebabIcon from './../assets/images/kebabIcon.png';
import pkLogo from './../assets/images/PKLogo.png';
import FontWeights from '../constants/fontWeights';
import ButtonWrapper from '../components/ButtonWrapper';
import IconLocked from '../assets/svgs/intro-locked';
import { SvgXml } from 'react-native-svg';

import { IntersectSet } from '../helpers/Intersect';
import { GetStoreData, SetStoreData } from '../helpers/General';
import languages from '../locales/languages';

const width = Dimensions.get('window').width;

class LocationTracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer_intersect: null,
      isLogging: '',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    GetStoreData('PARTICIPATE')
      .then(isParticipating => {
        if (isParticipating === 'true') {
          this.setState({
            isLogging: true,
          });
          this.willParticipate();
        } else {
          this.setState({
            isLogging: false,
          });
        }
      })
      .catch(error => console.log(error));

    let timer_intersect = setInterval(this.intersect_tick, 1000 * 60 * 60 * 12); // once every 12 hours
    // DEBUG:  1000 * 10); // once every 10 seconds

    this.setState({
      timer_intersect,
    });
  }

  intersect_tick = () => {
    // This function is called once every 12 hours.  It should do several things:

    // Get the user's health authorities
    GetStoreData('HEALTH_AUTHORITIES')
      .then(authority_list => {
        if (!authority_list) {
          // DEBUG: Force a test list
          // authority_list = [
          //  {
          //    name: 'Platte County Health',
          //    url:
          //      'https://raw.githack.com/tripleblindmarket/safe-places/develop/examples/safe-paths.json',
          //  },
          //];
          return;
        }

        if (authority_list) {
          // Pull down data from all the registered health authorities
          for (let authority of authority_list) {
            fetch(authority.url)
              .then(response => response.json())
              .then(responseJson => {
                // Example response =
                // { "authority_name":  "Steve's Fake Testing Organization",
                //   "publish_date_utc": "1584924583",
                //   "info_website": "https://www.who.int/emergencies/diseases/novel-coronavirus-2019",
                //   "concern_points":
                //    [
                //      { "time": 123, "latitude": 12.34, "longitude": 12.34},
                //      { "time": 456, "latitude": 12.34, "longitude": 12.34}
                //    ]
                // }

                // Update cache of info about the authority
                // (info_url might have changed, etc.)

                // TODO: authority_list, match by authority_list.url, then re-save "authority_name", "info_website" and
                // "publish_date_utc" (we should notify users if their authority is no longer functioning.)
                // console.log('Received data from authority.url=', authority.url);

                IntersectSet(responseJson.concern_points);
              });
          }
        } else {
          console.log('No authority list');
          return;
        }
      })
      .catch(error => console.log('Failed to load authority list', error));
  };

  componentWillUnmount() {
    clearInterval(this.state.timer_intersect);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    BackHandler.exitApp(); // works best when the goBack is async
    return true;
  };
  export() {
    this.props.navigation.navigate('ExportScreen', {});
  }

  import() {
    this.props.navigation.navigate('ImportScreen', {});
  }

  overlap() {
    this.props.navigation.navigate('OverlapScreen', {});
  }

  willParticipate = () => {
    SetStoreData('PARTICIPATE', 'true').then(() => {
      LocationServices.start();
      BroadcastingServices.start();
    });

    // Check and see if they actually authorized in the system dialog.
    // If not, stop services and set the state to !isLogging
    // Fixes tripleblindmarket/private-kit#129
    BackgroundGeolocation.checkStatus(({ authorization }) => {
      if (authorization === BackgroundGeolocation.AUTHORIZED) {
        this.setState({
          isLogging: true,
        });
      } else if (authorization === BackgroundGeolocation.NOT_AUTHORIZED) {
        LocationServices.stop(this.props.navigation);
        BroadcastingServices.stop(this.props.navigation);
        this.setState({
          isLogging: false,
        });
      }
    });
  };

  news() {
    this.props.navigation.navigate('NewsScreen', {});
  }

  licenses() {
    this.props.navigation.navigate('LicensesScreen', {});
  }

  settings() {
    this.props.navigation.navigate('SettingsScreen', {});
  }

  willParticipate = () => {
    SetStoreData('PARTICIPATE', 'true').then(() => LocationServices.start());
    this.setState({
      isLogging: true,
    });
  };

  notifications() {
    this.props.navigation.navigate('NotificationScreen', {});
  }

  willParticipate = () => {
    SetStoreData('PARTICIPATE', 'true').then(() => {
      LocationServices.start();
      BroadcastingServices.start();
    });
    this.setState({
      isLogging: true,
    });
  };

  setOptOut = () => {
    LocationServices.stop(this.props.navigation);
    BroadcastingServices.stop(this.props.navigation);
    this.setState({
      isLogging: false,
    });
  };

  // create component

  getMenuItem = () => {
    return (
      <Menu
        style={{
          position: 'absolute',
          alignSelf: 'flex-end',
          zIndex: 10,
          marginTop: '5.5%',
        }}>
        <MenuTrigger style={{ marginTop: 14 }}>
          <Image
            source={kebabIcon}
            style={{
              width: 15,
              height: 28,
              padding: 14,
            }}
          />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption
            onSelect={() => {
              this.notifications();
            }}>
            <Text style={styles.menuOptionText}>{languages.t('label.notifications')}</Text>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              this.settings();
            }}>
            <Text style={styles.menuOptionText}>{languages.t('label.settings')}</Text>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              this.licenses();
            }}>
            <Text style={styles.menuOptionText}>{languages.t('label.licenses')}</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  };

  getTrackingComponent = () => {
    return (
      <>
        <Image
          source={pkLogo}
          style={{
            width: 132,
            height: 164.4,
            alignSelf: 'center',
            marginTop: 15,
            marginBottom: 25,
          }}
        />
        <ButtonWrapper
          title={languages.t('label.home_stop_tracking')}
          onPress={() => this.setOptOut()}
          bgColor={Colors.RED_BUTTON}
          toBgColor={Colors.RED_TO_BUTTON}
        />
        <Text style={styles.sectionDescription}>
          {languages.t('label.home_stop_tracking_description')}
        </Text>

        {/* 
        <ButtonWrapper
          title={languages.t('label.home_check_risk')}
          onPress={() => this.overlap()}
          bgColor={Colors.GRAY_BUTTON}
          toBgColor={Colors.Gray_TO_BUTTON}
        />
        <Text style={styles.sectionDescription}>
          {languages.t('label.home_check_risk_description')}
        </Text>
        */}
      </>
    );
  };

  getNotTrackingComponent = () => {
    return (
      <>
        <Image
          source={pkLogo}
          style={{
            width: 132,
            height: 164.4,
            alignSelf: 'center',
            marginTop: 15,
            marginBottom: 30,
            opacity: 0.3,
          }}
        />
        <ButtonWrapper
          title={languages.t('label.home_start_tracking')}
          onPress={() => this.willParticipate()}
          bgColor={Colors.BLUE_BUTTON}
          toBgColor={Colors.BLUE_TO_BUTTON}
        />
        <Text style={styles.sectionDescription}>
          {languages.t('label.home_start_tracking_description')}
        </Text>
      </>
    );
  };

  getActionButtons = () => {
    if (!this.state.isLogging) {
      return;
    }
    return (
      <View style={styles.actionButtonsView}>
        <TouchableOpacity
          onPress={() => this.import()}
          style={styles.actionButtonsTouchable}>
          <Image
            style={styles.actionButtonImage}
            source={exportImage}
            resizeMode={'contain'}
          />
          <Text style={styles.actionButtonText}>
            {languages.t('label.import')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.export()}
          style={styles.actionButtonsTouchable}>
          <Image
            style={[
              styles.actionButtonImage,
              { transform: [{ rotate: '180deg' }] },
            ]}
            source={exportImage}
            resizeMode={'contain'}
          />
          <Text style={styles.actionButtonText}>
            {languages.t('label.export')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.news()}
          style={styles.actionButtonsTouchable}>
          <Image
            style={styles.actionButtonImage}
            source={news}
            resizeMode={'contain'}
          />
          <Text style={styles.actionButtonText}>
            {languages.t('label.news')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  getPrivacyNote = () => {
    if (this.state.isLogging) {
      return;
    }
    return (
      <View style={styles.privacyNoteContainer}>
        <View style={styles.privacyHeaderContainer}>
          <SvgXml xml={IconLocked} width={15} height={15} />
          <Text style={styles.privacyHeader}>
            {languages.t('label.home_privacy_header')}
          </Text>
        </View>
        <Text style={styles.privacySubheader}>
          {languages.t('label.home_privacy_subheader')}
        </Text>
      </View>
    );
  };

  getFooter = () => {
    return (
      <View style={styles.footer}>
        <Text>
          <Text
            style={[
              styles.footerDescription,
              { marginLeft: 0, marginRight: 0 },
            ]}>
            {languages.t('label.url_info')}{' '}
          </Text>
          <Text
            style={[
              styles.footerDescription,
              { color: Colors.BLUE_LINK, marginLeft: 0, marginRight: 0 },
            ]}
            onPress={() => Linking.openURL('https://privatekit.mit.edu')}>
            {languages.t('label.home_footer')}
          </Text>
        </Text>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.main}>
          {this.getMenuItem()}

          <Text style={styles.headerTitle}>
            {languages.t('label.private_kit')}
          </Text>

          <View style={styles.buttonsAndLogoView}>
            {this.state.isLogging
              ? this.getTrackingComponent()
              : this.getNotTrackingComponent()}
          </View>

          {this.getActionButtons()}

          {this.getPrivacyNote()}

          {this.getFooter()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  // Container covers the entire screen
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.PRIMARY_TEXT,
    backgroundColor: Colors.WHITE,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 38,
    padding: 0,
    fontWeight: FontWeights.BOLD,
    marginTop: '7%',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  buttonsAndLogoView: {
    flex: 6,
    justifyContent: 'flex-start',
  },
  actionButtonsView: {
    width: width * 0.7866,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 2,
    alignItems: 'center',
    marginBottom: -10,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  sectionDescription: {
    fontSize: 13,
    fontWeight: FontWeights.MEDIUM,
    marginLeft: '12%',
    marginRight: '12%',
    marginTop: '2%',
    marginBottom: '2%',
    textAlign: 'center',
    color: '#6A6A6A',
  },
  footerDescription: {
    fontSize: 12,
    fontWeight: FontWeights.REGULAR,
    marginLeft: '12%',
    marginRight: '12%',
    marginTop: '2%',
    marginBottom: '2%',
    textAlign: 'center',
    color: '#6A6A6A',
  },
  startLoggingButtonTouchable: {
    borderRadius: 12,
    backgroundColor: '#665eff',
    height: 52,
    alignSelf: 'center',
    width: width * 0.7866,
    justifyContent: 'center',
  },
  startLoggingButtonText: {
    fontWeight: FontWeights.BOLD,
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  stopLoggingButtonTouchable: {
    borderRadius: 12,
    backgroundColor: '#fd4a4a',
    height: 52,
    alignSelf: 'center',
    width: width * 0.7866,
    justifyContent: 'center',
  },
  stopLoggingButtonText: {
    fontWeight: FontWeights.BOLD,
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  actionButtonsTouchable: {
    height: 76,
    borderRadius: 8,
    backgroundColor: '#454f63',
    width: width * 0.23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonImage: {
    height: 21.6,
    width: 32.2,
  },
  actionButtonText: {
    opacity: 0.56,
    fontWeight: FontWeights.BOLD,
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 6,
  },
  menuOptionText: {
    fontWeight: FontWeights.REGULAR,
    fontSize: 14,
    padding: 10,
  },
  privacyNoteContainer: {
    backgroundColor: '#15D09B',
    width: width * 0.7,
    borderRadius: 12,
    paddingVertical: 8,
  },
  privacyHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '2%',
  },
  privacyHeader: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: 16,
    marginLeft: 5,
    textAlign: 'center',
    color: 'white',
  },
  privacySubheader: {
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
    margin: '2%',
    marginLeft: '5%',
    marginRight: '5%',
  },
});

export default LocationTracking;
