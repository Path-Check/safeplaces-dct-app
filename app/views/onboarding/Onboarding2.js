import React from 'react';
import {
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Typography } from '../../components';
import languages from '../../locales/languages';
import { useAssets } from '../../TracingStrategyAssets';
import { sharedStyles } from './styles';

import { Buttons, Colors, Typography as TypographyStyles } from '../../styles';

const width = Dimensions.get('window').width;

const Onboarding = (props) => {
  const {
    onboarding2Background,
    onboarding2Header,
    onboarding2Subheader,
    onboarding2Icon,
  } = useAssets();

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='transparent'
        translucent
      />
      <ImageBackground
        source={onboarding2Background}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <View style={sharedStyles.iconCircle}>
          <SvgXml xml={onboarding2Icon} width={30} height={30} />
        </View>
        <Typography style={sharedStyles.headerText}>
          {onboarding2Header}
        </Typography>
        <Typography style={sharedStyles.subheaderText}>
          {onboarding2Subheader}
        </Typography>
      </View>
      <View style={styles.verticalSpacer} />
      <View style={sharedStyles.footerContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.replace('Onboarding3');
          }}>
          <Typography style={styles.buttonText}>
            {languages.t('label.launch_next')}
          </Typography>
        </TouchableOpacity>
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
  button: {
    ...Buttons.largeBlue,
  },
  buttonText: {
    ...TypographyStyles.buttonTextLight,
  },
});

export default Onboarding;
