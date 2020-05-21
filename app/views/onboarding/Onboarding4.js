import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { Images } from '../../assets';
import { Button } from '../../components/Button';
import { Type, Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import languages from '../../locales/languages';
import { sharedStyles } from './styles';

const width = Dimensions.get('window').width;

const Onboarding = props => {
  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='transparent'
        translucent
      />
      <ImageBackground
        source={Images.LaunchScreen1}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <Typography style={styles.headerText} use={Type.Headline2}>
          {languages.t('label.launch_screen4_header')}
        </Typography>
        <Typography style={styles.subheaderText}>
          {languages.t('label.launch_screen4_subheader')}
        </Typography>
      </View>
      <View style={sharedStyles.footerContainer}>
        <Button
          label={languages.t('label.launch_set_up_phone')}
          onPress={() => {
            props.navigation.replace('Onboarding5');
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
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerText: {
    color: Colors.VIOLET,
    width: width * 0.7,
  },
  subheaderText: {
    marginTop: '6%',
    color: Colors.VIOLET,
    fontSize: 15,
    width: width * 0.6,
    fontFamily: fontFamily.primaryRegular,
  },
});

export default Onboarding;
