import React from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from 'react-native';
const width = Dimensions.get('window').width;
import BackgroundImage from './../../assets/images/launchScreen2.png';
import languages from '../../locales/languages';
import ButtonWrapper from '../../components/ButtonWrapper';
import Colors from '../../constants/colors';
import FontWeights from '../../constants/fontWeights';

const Onboarding = props => {
  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>
            {languages.t('label.launch_screen2_header')}
          </Text>
          <Text style={styles.subheaderText}>
            {languages.t('label.launch_screen2_subheader')}
          </Text>
        </View>
        <View style={styles.footerContainer}>
          <ButtonWrapper
            title={languages.t('label.launch_next')}
            onPress={() => {
              props.navigation.replace('Onboarding3');
              props.navigation.navigate('Onboarding3');
            }}
            buttonColor={Colors.WHITE}
            bgColor={Colors.VIOLET_BUTTON}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
    flex: 1,
    backgroundColor: Colors.INTRO_WHITE_BG,
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
    color: Colors.VIOLET,
    fontWeight: FontWeights.MEDIUM,
    fontSize: 26,
    width: width * 0.8,
    fontFamily: 'IBM Plex Sans',
  },
  subheaderText: {
    marginTop: '6%',
    color: Colors.VIOLET,
    fontWeight: FontWeights.REGULAR,
    fontSize: 15,
    width: width * 0.8,
    fontFamily: 'IBM Plex Sans',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: '10%',
    alignSelf: 'center',
  },
});

export default Onboarding;
