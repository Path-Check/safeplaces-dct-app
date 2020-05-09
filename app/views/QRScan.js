import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  Dimensions,
  ImageBackground,
  StatusBar,
  View,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { SvgXml } from 'react-native-svg';

import BackgroundImage from './../assets/images/launchScreenBackground.png';
import StateAtRisk from './../assets/svgs/stateAtRisk';
import StateNoContact from './../assets/svgs/stateNoContact';
import { Button } from '../components/Button';
import { Typography } from '../components/Typography';
import { Theme } from '../constants/themes';
import { isValidCoordinates } from '../helpers/Location';
import LocationServices from '../services/LocationService';
import { styles } from './QRScan/style';

const StateEnum = {
  DEFAULT: 0,
  SCAN_SUCCESS: 1,
  SCAN_FAIL: 2,
  SCAN_IN_PROGRESS: 3,
};

const StateIcon = ({ status, size }) => {
  let icon;
  switch (status) {
    case StateEnum.DEFAULT:
      icon = null;
      break;
    case StateEnum.SCAN_SUCCESS:
      icon = StateNoContact;
      break;
    case StateEnum.SCAN_FAIL:
      icon = StateAtRisk;
      break;
    case StateEnum.SCAN_IN_PROGRESS:
      icon = StateNoContact;
      break;
  }
  return (
    <SvgXml xml={icon} width={size ? size : 80} height={size ? size : 80} />
  );
};

const height = Dimensions.get('window').height;

export const QRScanScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
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

  const getMainText = () => {
    switch (currentState) {
      case StateEnum.SCAN_SUCCESS:
        return (
          <Typography style={styles.mainTextBelow}>
            {t('qr.successful_title')}
          </Typography>
        );
      case StateEnum.SCAN_FAIL:
        return (
          <Typography style={styles.mainTextBelow}>
            {t('qr.fail_title')}
          </Typography>
        );
    }
  };

  const getSubText = () => {
    switch (currentState) {
      case StateEnum.SCAN_SUCCESS:
        return t('qr.successful_subtitle');
      case StateEnum.SCAN_FAIL:
        return t('qr.fail_subtitle');
    }
  };

  return (
    <Theme use='violet'>
      <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />
        {(currentState === StateEnum.SCAN_SUCCESS ||
          currentState === StateEnum.SCAN_FAIL) && (
          <View style={styles.iconContainer}>
            <StateIcon size={height} status={currentState} />
          </View>
        )}
        {(currentState === StateEnum.SCAN_SUCCESS ||
          currentState === StateEnum.SCAN_FAIL) && (
          <View style={styles.mainContainer}>
            <View style={styles.content}>
              {getMainText()}
              <Typography style={styles.subheaderText}>
                {getSubText()}
              </Typography>
              <View style={styles.buttonContainer}>
                <Button
                  label={t('qr.exit')}
                  onPress={() => {
                    navigation.navigate('Main', {});
                  }}
                />
              </View>
            </View>
          </View>
        )}
        {currentState === StateEnum.SCAN_IN_PROGRESS && (
          <View style={styles.qrScanContainer}>
            <QRCodeScanner
              onRead={onScanSuccess}
              flashMode={RNCamera.Constants.FlashMode.off}
            />
            <Button
              label={t('qr.scan_cancel')}
              style={styles.qrCancelButton}
              onPress={() => {
                navigation.navigate('Main', {});
              }}
            />
          </View>
        )}
      </ImageBackground>
    </Theme>
  );
};
