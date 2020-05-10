import React, { useEffect, useState } from 'react';
import { BackHandler, ImageBackground, StatusBar } from 'react-native';

import BackgroundImage from './../assets/images/launchScreenBackground.png';
import { Theme } from '../constants/themes';
import { isValidCoordinates, parseQRCodeUrl } from '../helpers/Location';
import LocationServices from '../services/LocationService';
import { ScanComplete } from './QRScan/ScanComplete';
import { ScanInProgress } from './QRScan/ScanInProgress';
import { StateEnum } from './QRScan/StateEnum';
import { styles } from './QRScan/style';

export const QRScanScreen = ({ navigation, route }) => {
  const [currentState, setcurrentState] = useState(StateEnum.DEFAULT);

  const getLatLonFromRouteParams = () => {
    const params = route && route.params;
    const latitude = (params && params.latitude) || undefined;
    const longitude = (params && params.longitude) || undefined;
    return { latitude, longitude };
  };

  const onFocus = () => {
    const { latitude, longitude } = getLatLonFromRouteParams();
    const isDeepLink =
      typeof latitude !== 'undefined' && typeof longitude !== 'undefined';
    if (isDeepLink) {
      const savedSuccessfully = saveCoordinates(latitude, longitude);
      if (savedSuccessfully) {
        setcurrentState(StateEnum.SCAN_SUCCESS);
      } else {
        setcurrentState(StateEnum.SCAN_FAIL);
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
        onFocus();
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
  }, [navigation, route]);

  const saveCoordinates = (latitude, longitude) => {
    const isValid = isValidCoordinates(latitude, longitude);
    if (isValid) {
      LocationServices.saveLocation({
        latitude: Number(latitude),
        longitude: Number(longitude),
        time: Date.now(),
      });
    }
    return isValid;
  };

  const onScanSuccess = e => {
    const url = e && e.data;
    const { latitude, longitude } = parseQRCodeUrl(url);
    if (typeof latitude !== 'undefined' && typeof longitude !== 'undefined') {
      const savedSuccessfully = saveCoordinates(latitude, longitude);
      if (savedSuccessfully) {
        setcurrentState(StateEnum.SCAN_SUCCESS);
      } else {
        setcurrentState(StateEnum.SCAN_FAIL);
      }
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
