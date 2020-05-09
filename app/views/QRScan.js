import React, { useEffect, useState } from 'react';
import { BackHandler, ImageBackground, StatusBar } from 'react-native';

import BackgroundImage from './../assets/images/launchScreenBackground.png';
import { Theme } from '../constants/themes';
import { isValidCoordinates } from '../helpers/Location';
import LocationServices from '../services/LocationService';
import { ScanComplete } from './QRScan/ScanComplete';
import { ScanInProgress } from './QRScan/ScanInProgress';
import { StateEnum } from './QRScan/StateEnum';
import { styles } from './QRScan/style';

export const QRScanScreen = ({ navigation, route }) => {
  const [currentState, setcurrentState] = useState(StateEnum.DEFAULT);

  const onNavigate = () => {
    if (route && route.params) {
      const { latitude, longitude } = route.params;
      if (typeof latitude !== 'undefined' && typeof longitude !== 'undefined') {
        saveCoordinates(latitude, longitude);
      } else {
        setcurrentState(StateEnum.SCAN_IN_PROGRESS);
      }
    } else {
      setcurrentState(StateEnum.SCAN_IN_PROGRESS);
    }
  };

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };
    const handleStateChange = () => {
      if (navigation.isFocused()) {
        onNavigate();
      } else {
        setcurrentState(StateEnum.DEFAULT);
      }
    };
    const unsubscribeFocus = navigation.addListener('focus', handleStateChange);
    const unsubscribeState = navigation.addListener('state', handleStateChange);
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      unsubscribeFocus();
      unsubscribeState();
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const saveCoordinates = (latitude, longitude) => {
    if (isValidCoordinates(latitude, longitude)) {
      LocationServices.saveLocation({
        latitude: Number(latitude),
        longitude: Number(longitude),
        time: Date.now(),
      });
      setcurrentState(StateEnum.SCAN_SUCCESS);
    } else {
      setcurrentState(StateEnum.SCAN_FAIL);
    }
  };

  const onScanSuccess = e => {
    const url = e && e.data;
    const split_1 = url && url.split('/qr/');
    const split_2 = split_1 && split_1.length === 2 && split_1[1].split('/');
    const latitude = split_2 && split_2.length === 2 && split_2[0];
    const longitude = split_2 && split_2.length === 2 && split_2[1];
    if (typeof latitude !== 'undefined' && typeof longitude !== 'undefined') {
      saveCoordinates(latitude, longitude);
    } else {
      setcurrentState(StateEnum.SCAN_FAIL);
    }
  };

  const isScanComplete =
    currentState === StateEnum.SCAN_SUCCESS ||
    currentState === StateEnum.SCAN_FAIL;

  const exitQRScan = () => {
    navigation.navigate('Main', {});
  };

  return (
    <Theme use='violet'>
      <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />
        {isScanComplete && (
          <ScanComplete currentState={currentState} onExit={exitQRScan} />
        )}
        {currentState === StateEnum.SCAN_IN_PROGRESS && (
          <ScanInProgress
            onScanSuccess={onScanSuccess}
            onScanCancel={exitQRScan}
          />
        )}
      </ImageBackground>
    </Theme>
  );
};
