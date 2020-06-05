import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { Button, Type, Typography } from '../../components';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import { isGPS } from '../../COVIDSafePathsConfig';
import { useAssets } from '../../TracingStrategyAssets';
import { sharedStyles } from './styles';

const width = Dimensions.get('window').width;

const Onboarding = (props) => {
  const {
    onboarding4Background,
    onboarding4Button,
    onboarding4Header,
    onboarding4Subheader,
  } = useAssets();

  const handleOnPressNext = () => {
    const nextScreen = isGPS
      ? 'OnboardingPermissions'
      : 'EnableExposureNotifications';
    props.navigation.replace(nextScreen);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='transparent'
        translucent
      />
      <ImageBackground
        source={onboarding4Background}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <Typography style={styles.headerText} use={Type.Headline2}>
          {onboarding4Header}
        </Typography>
        <Typography style={styles.subheaderText}>
          {onboarding4Subheader}
        </Typography>
      </View>
      <View style={styles.verticalSpacer} />
      <View style={sharedStyles.footerContainer}>
        <Button label={onboarding4Button} onPress={handleOnPressNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    top: '-10%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.INTRO_WHITE_BG,
  },
  contentContainer: {
    width: width * 0.9,
    flex: 2,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: Colors.VIOLET,
  },
  subheaderText: {
    marginTop: '6%',
    color: Colors.VIOLET,
    fontSize: 16,
    fontFamily: fontFamily.primaryRegular,
  },
  verticalSpacer: {
    flex: 1,
  },
});

export default Onboarding;
