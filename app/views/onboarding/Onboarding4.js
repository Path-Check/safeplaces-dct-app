import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { Button } from '../../components/Button';
import { Type, Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import { ONBOARDING_DONE } from '../../constants/storage';
import { SetStoreData } from '../../helpers/General';
import { sharedStyles } from './styles';
import { AppSpecificAssets } from '../../TracingStrategyAssets';

const width = Dimensions.get('window').width;

const Onboarding = props => {
  const {
    onboarding4Background,
    onboarding4Button,
    onboarding4Header,
    onboarding4NavDestination,
    onboarding4Subheader,
  } = AppSpecificAssets();

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
        <Typography style={styles.subheaderText}>{onboarding4Subheader}</Typography>
      </View>
      <View style={styles.verticalSpacer} />
      <View style={sharedStyles.footerContainer}>
        <Button
          label={onboarding4Button}
          onPress={() => {
            SetStoreData(ONBOARDING_DONE, true);
            props.navigation.replace(onboarding4NavDestination);
          }}
        />
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
