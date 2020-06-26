import React, { useContext } from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import ExposureNotificationsContext from '../ExposureNotificationContext';
import { useStatusBarEffect } from '../../navigation';
import Home from './Home';

import { Icons, Images } from '../../assets';
import { Spacing, Layout } from '../../styles';

const HomeScreen = (): JSX.Element => {
  useStatusBarEffect('light-content');
  const { deviceStatus, requestENAuthorization } = useContext(
    ExposureNotificationsContext,
  );

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={Images.LaunchScreenBackground}>
      <View style={styles.iconContainer}>
        <SvgXml
          xml={Icons.StateNoContact}
          width={2 * Layout.screenWidth}
          height={2 * Layout.screenHeight}
        />
      </View>
      <View style={styles.homeContainer}>
        <Home
          deviceStatus={deviceStatus}
          requestPermission={requestENAuthorization}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  iconContainer: {
    position: 'absolute',
    left: -(Layout.screenWidth / 2),
    bottom: -(Layout.screenHeight / 3),
  },
  homeContainer: {
    flex: 1,
    padding: Spacing.medium,
  },
});

export default HomeScreen;
