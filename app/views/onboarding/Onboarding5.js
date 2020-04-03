import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';
const width = Dimensions.get('window').width;
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import BackgroundImage from './../../assets/images/launchScreenBackground.png';
import languages from '../../locales/languages';
import ButtonWrapper from '../../components/ButtonWrapper';
import Colors from '../../constants/colors';
import FontWeights from '../../constants/fontWeights';
import IconDenied from '../../assets/svgs/permissionDenied';
import IconGranted from '../../assets/svgs/permissionGranted';
import IconUnknown from '../../assets/svgs/permissionUnknown';

import LocationServices from '../../services/LocationService';
import BroadcastingServices from '../../services/BroadcastingService';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

import { SvgXml } from 'react-native-svg';

const PermissionStatusEnum = {
  UNKNOWN: 0,
  GRANTED: 1,
  DENIED: 2,
};

const PermissionDescription = ({ title, status, ...props }) => {
  let icon;
  switch (status) {
    case PermissionStatusEnum.UNKNOWN:
      icon = IconUnknown;
      break;
    case PermissionStatusEnum.GRANTED:
      icon = IconGranted;
      break;
    case PermissionStatusEnum.DENIED:
      icon = IconDenied;
      break;
  }
  return (
    <View style={styles.permissionContainer}>
      <Text style={styles.permissionTitle}>{title}</Text>
      <SvgXml style={styles.permissionIcon} xml={icon} width={30} height={30} />
    </View>
  );
};

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationPermission: PermissionStatusEnum.UNKNOWN,
      locationPermission: PermissionStatusEnum.UNKNOWN,
    };
    this.checkLocationStatus();
    this.checkNotificationStatus();
  }

  isLocationChecked() {
    return this.state.locationPermission !== PermissionStatusEnum.UNKNOWN;
  }

  isNotificationChecked() {
    return this.state.notificationPermission !== PermissionStatusEnum.UNKNOWN;
  }

  checkLocationStatus() {
    // NEED TO TEST ON ANNDROID
    let locationPermission;
    if (Platform.OS === 'ios') {
      locationPermission = PERMISSIONS.IOS.LOCATION_ALWAYS;
    } else {
      locationPermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    }
    check(locationPermission)
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            this.setState({
              locationPermission: PermissionStatusEnum.GRANTED,
            });
            break;
          case RESULTS.UNAVAILABLE:
          case RESULTS.BLOCKED:
            this.setState({
              locationPermission: PermissionStatusEnum.DENIED,
            });
            break;
        }
      })
      .catch(error => {
        console.log('error checking location: ' + error);
      });
  }

  checkNotificationStatus() {
    checkNotifications().then(({ status }) => {
      switch (status) {
        case RESULTS.GRANTED:
          this.setState({
            notificationPermission: PermissionStatusEnum.GRANTED,
          });
          break;
        case RESULTS.UNAVAILABLE:
        case RESULTS.BLOCKED:
          this.setState({
            notificationPermission: PermissionStatusEnum.DENIED,
          });
          break;
      }
    });
  }

  requestLocation() {
    // NEED TO TEST ON ANNDROID
    let locationPermission;
    if (Platform.OS === 'ios') {
      locationPermission = PERMISSIONS.IOS.LOCATION_ALWAYS;
    } else {
      locationPermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    }
    request(locationPermission).then(result => {
      switch (result) {
        case RESULTS.GRANTED:
          this.setState({
            locationPermission: PermissionStatusEnum.GRANTED,
          });
          break;
        case RESULTS.UNAVAILABLE:
        case RESULTS.BLOCKED:
          this.setState({
            locationPermission: PermissionStatusEnum.DENIED,
          });
          break;
      }
    });
  }

  requestNotification() {
    requestNotifications(['alert', 'badge', 'sound']).then(({ status }) => {
      switch (status) {
        case RESULTS.GRANTED:
          this.setState({
            notificationPermission: PermissionStatusEnum.GRANTED,
          });
          break;
        case RESULTS.UNAVAILABLE:
        case RESULTS.BLOCKED:
          this.setState({
            notificationPermission: PermissionStatusEnum.DENIED,
          });
          break;
      }
    });
  }

  buttonPressed() {
    if (!this.isLocationChecked()) {
      this.requestLocation();
    } else if (!this.isNotificationChecked()) {
      this.requestNotification();
    } else {
      this.props.navigation.replace('LocationTrackingScreen');
      this.props.navigation.navigate('LocationTrackingScreen');
    }
  }

  getTitleText() {
    if (!this.isLocationChecked()) {
      return languages.t('label.launch_location_header');
    } else if (!this.isNotificationChecked()) {
      return languages.t('label.launch_notif_header');
    } else {
      return languages.t('label.launch_done_header');
    }
  }

  getSubtitleText() {
    if (!this.isLocationChecked()) {
      return languages.t('label.launch_location_subheader');
    } else if (!this.isNotificationChecked()) {
      return languages.t('label.launch_notif_subheader');
    } else {
      return languages.t('label.launch_done_subheader');
    }
  }

  getButtonText() {
    if (!this.isLocationChecked()) {
      return languages.t('label.launch_enable_location');
    } else if (!this.isNotificationChecked()) {
      return languages.t('label.launch_enable_notif');
    } else {
      return languages.t('label.launch_finish_set_up');
    }
  }

  render() {
    return (
      <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent={true}
        />

        <View style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.headerText}>{this.getTitleText()}</Text>
            <Text style={styles.subheaderText}>{this.getSubtitleText()}</Text>

            <View style={styles.statusContainer}>
              <View style={styles.divider}></View>
              <PermissionDescription
                title={languages.t('label.launch_location_access')}
                status={this.state.locationPermission}
              />
              <View style={styles.divider}></View>
              <PermissionDescription
                title={languages.t('label.launch_notification_access')}
                status={this.state.notificationPermission}
              />
              <View style={styles.divider}></View>
              <View style={styles.spacer}></View>
            </View>
          </View>
          <View style={styles.footerContainer}>
            <ButtonWrapper
              title={this.getButtonText()}
              onPress={this.buttonPressed.bind(this)}
              buttonColor={Colors.VIOLET}
              bgColor={Colors.WHITE}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    width: width * 0.9,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerText: {
    color: Colors.WHITE,
    fontWeight: FontWeights.MEDIUM,
    fontSize: 26,
    width: width * 0.8,
    fontFamily: 'IBM Plex Sans',
  },
  subheaderText: {
    marginTop: '6%',
    color: Colors.WHITE,
    fontWeight: FontWeights.REGULAR,
    fontSize: 15,
    width: width * 0.6,
    fontFamily: 'IBM Plex Sans',
  },
  statusContainer: {
    marginTop: '5%',
  },
  divider: {
    backgroundColor: Colors.DIVIDER,
    height: 1,
    marginVertical: '3%',
  },
  spacer: {
    marginVertical: '5%',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: '10%',
    alignSelf: 'center',
  },
  permissionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  permissionTitle: {
    color: Colors.WHITE,
    fontWeight: FontWeights.REGULAR,
    fontSize: 16,
    alignSelf: 'center',
    fontFamily: 'IBM Plex Sans',
  },
  permissionIcon: {
    alignSelf: 'center',
  },
});

export default Onboarding;
