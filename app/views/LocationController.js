import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import React, { Component } from 'react';
import {
  AppState,
  BackHandler,
  Image,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import settingsIcon from './../assets/svgs/settingsIcon';
import { isPlatformAndroid } from './../Util';
import Colors from '../constants/colors';
import LocationServices from '../services/LocationService';
import DefaultPage from './tracking/DefaultPage';
import ExposurePage from './tracking/ExposurePage';
import OffPage from './tracking/OffPage';
import styles from './tracking/style';
import UnknownPage from './tracking/UnknownPage';

export default class LocationController extends Component {
  constructor(props) {
    super(props);

    if (isPlatformAndroid()) {
      StatusBar.setBackgroundColor(Colors.TRANSPARENT);
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(true);
    }

    this.state = {
      location: {
        canTrack: true,
        reason: '',
        hasPotentialExposure: false,
      },
    };
  }

  componentDidMount() {
    console.log('mounting component');
    this.updateStateInfo();
    // refresh state if user backgrounds app
    AppState.addEventListener('change', () => {
      this.updateStateInfo();
    });
    // refresh state if settings change
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.updateStateInfo();
    });
    // handle back press
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    console.log('unmounting component');
    AppState.removeEventListener('change', this.handleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.unsubscribe();
  }

  handleBackPress = () => {
    BackHandler.exitApp(); // works best when the goBack is async
    return true;
  };

  getSettings() {
    return (
      <TouchableOpacity
        style={styles.settingsContainer}
        onPress={() => {
          this.props.navigation.navigate('SettingsScreen');
        }}>
        {/* Is there is a reason there's this imageless image tag here? Can we delete it? */}
        <Image resizeMode={'contain'} />
        <SvgXml xml={settingsIcon} width={30} height={30} color='white' />
      </TouchableOpacity>
    );
  }

  async updateStateInfo() {
    const state = await LocationServices.checkStatus();
    this.setState({ location: state });
  }

  render() {
    const canTrack = this.state.location.canTrack;
    const reason = this.state.location.reason;
    const hasPotentialExposure = this.state.location.hasPotentialExposure;
    let page;

    if (canTrack) {
      if (hasPotentialExposure) {
        page = <ExposurePage />;
      } else {
        page = <DefaultPage />;
      }
    } else {
      if (reason === 'USER_OFF') {
        page = <OffPage />;
      } else {
        page = <UnknownPage />;
      }
    }

    return (
      <View style={styles.backgroundImage}>
        {page}
        {this.getSettings()}
      </View>
    );
  }
}
