import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Button, Typography } from '../../components';
import { isGPS } from '../../COVIDSafePathsConfig';
import { useAssets } from '../../TracingStrategyAssets';
import { sharedStyles } from './styles';

import { Colors } from '../../styles';

const width = Dimensions.get('window').width;

const Onboarding = (props) => {
  const {
    onboarding4Background,
    onboarding4Button,
    onboarding4Header,
    onboarding4Subheader,
    onboarding4Icon,
  } = useAssets();

  const onNext = () =>
    props.navigation.replace(
      isGPS ? 'OnboardingPermissions' : 'EnableExposureNotifications',
    );

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
        <View style={[sharedStyles.iconCircle, styles.iconCircle]}>
          <SvgXml xml={onboarding4Icon} width={30} height={30} />
        </View>
        <Typography style={sharedStyles.headerText}>
          {onboarding4Header}
        </Typography>
        <Typography style={sharedStyles.subheaderText}>
          {onboarding4Subheader}
        </Typography>
      </View>
      <View style={styles.verticalSpacer} />
      <View style={sharedStyles.footerContainer}>
        <Button label={onboarding4Button} onPress={onNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundFaintShade,
  },
  contentContainer: {
    width: width * 0.9,
    flex: 2,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  verticalSpacer: {
    flex: 1,
  },
  iconCircle: {
    backgroundColor: Colors.onboardingIconYellow,
  },
});

export default Onboarding;
