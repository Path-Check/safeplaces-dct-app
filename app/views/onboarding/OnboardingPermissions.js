import React, { useContext, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Icons, Images } from '../../assets';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import { ONBOARDING_DONE, PARTICIPATE } from '../../constants/storage';
import { Theme } from '../../constants/themes';
import { isGPS } from '../../COVIDSafePathsConfig';
import { SetStoreData } from '../../helpers/General';
import languages from '../../locales/languages';
import PermissionsContext, { PermissionStatus } from '../../PermissionsContext';
import { sharedStyles } from './styles';
import fontFamily from '../../constants/fonts';

const width = Dimensions.get('window').width;

export const OnboardingPermissions = ({ navigation }) => {
  const { location, notification, authSubscription } = useContext(
    PermissionsContext,
  );
  // const isiOS = Platform.OS === 'ios';
  // const isDev = __DEV__;

  const moveToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const onSkipStep = () => {
    moveToNextStep();
  };

  const handleRequestLocation = async () => {
    await location.request();
    moveToNextStep();
  };

  const handleRequestNotifications = async () => {
    await notification.request();
    moveToNextStep();
  };

  const handleRequestAuthSubscription = async () => {
    await authSubscription.request();
    moveToNextStep();
  };

  const handleOnPressDone = () => {
    SetStoreData(PARTICIPATE, location.status === PermissionStatus.GRANTED);
    SetStoreData(ONBOARDING_DONE, true);
    navigation.replace('Main');
  };

  const handleButtonPress = () => {}

  return (
    <Theme use='violet'>
      <ImageBackground
        source={Images.LaunchScreenBackground}
        style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />

        <View
          testID={'onboarding-permissions-screen'}
          style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            {/* <SvgXml
              style={styles.icon}
              xml={Icons.LocationPin}
              width={80}
              height={80}
            /> */}
            <View style={styles.iconCircle}>
              <SvgXml
                xml={Icons.LocationPin}
                width={30}
                height={30}
              />
            </View>
            <Typography style={styles.headerText}>
              {'Would you like to recieve notifications when you may have crossed paths with the virus?'}
            </Typography>
            <Typography style={styles.subheaderText}>
              {'To recieve exposure notifications, you need to be in an area covered by a local Health Department partner.\n\nIf there are no local or regional partner Health Department in your area yet, get notified when new Health Departments are added near you.'}
            </Typography>
            <Typography style={styles.subheaderText}>
              {'To recieve exposure notifications, you need to be in an area covered by a local Health Department partner.\n\nIf there are no local or regional partner Health Department in your area yet, get notified when new Health Departments are added near you.'}
            </Typography>
          </View>
          {/* <View style={styles.contentContainer}>
            <Typography
              style={styles.headerText}
              use={headerThemeStyle}
              testID='Header'>
              {titleText}
            </Typography>
            <Typography style={subTitleStyle} use={'body3'}>
              {subTitleText}
            </Typography>
            {finishedAllSteps ? null : <SkipStepButton onPress={onSkipStep} />}

            <View style={styles.statusContainer}>
              {steps.map(({ testID, indicatorText, status }, idx) => (
                <PermissionIndicator
                  key={`indicator-${idx}`}
                  title={indicatorText}
                  status={status}
                  testID={testID}
                />
              ))}
              <View style={styles.spacer} />
            </View>
          </View> */}
        </View>
        <View style={sharedStyles.footerContainer}>
          <Button
            label={'Maybe Later'}
            secondary
            style={styles.marginBottom}
            onPress={handleButtonPress}
            testID={'onboarding-permissions-button'}
          />
          <Button
            label={'Enable Notifications'}
            onPress={handleButtonPress}
            testID={'onboarding-permissions-button'}
          />
        </View>
      </ImageBackground>
    </Theme>
  );
};

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
    // textAlign: 'center',
    // justifyContent: 'center',
    // alignSelf: 'center',
    lineHeight: 32,
    color: Colors.WHITE,
    fontSize: 26,
    fontFamily: fontFamily.primaryRegular,
  },
  subheaderText: {
    color: Colors.WHITE,
    marginTop: 24,
    // width: width * 0.55,
    lineHeight: 24,
    fontSize: 18,
    fontFamily: fontFamily.primaryRegular,
  },
  icon: {
    // alignSelf: 'center',
    color: Colors.WHITE,
    // fill: Colors.WHITE
  },
  marginBottom: {
    marginBottom: 21,
  },
  iconCircle: {
    height: 70,
    width: 70,
    backgroundColor: Colors.WHITE,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  }
});
