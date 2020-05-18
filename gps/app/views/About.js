import React, { useEffect } from 'react';
import {
  BackHandler,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import packageJson from '../../package.json';
import fontFamily from './../constants/fonts';
import languages from './../locales/languages';
import lock from '../../../shared/assets/svgs/lock';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';
import Colors from '../constants/colors';

export const AboutScreen = ({ navigation }) => {
  const backToMain = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, [navigation]);

  return (
    <NavigationBarWrapper
      title={languages.t('label.about_title')}
      onBackPress={backToMain}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.spacer} />
        <View style={styles.spacer} />

        <View style={styles.aboutLabelContainer}>
          <SvgXml style={styles.aboutSectionIconLock} xml={lock} />
          <Typography style={styles.aboutSectionTitles}>
            {languages.t('label.commitment')}
          </Typography>
        </View>
        <Typography style={styles.aboutSectionPara}>
          {languages.t('label.commitment_para')}
          <Typography
            style={styles.hyperlink}
            onPress={() => {
              Linking.openURL('https://covidsafepaths.org/');
            }}>
            {/* eslint-disable-next-line react-native/no-raw-text */}
            {'covidsafepaths.org'}
          </Typography>
        </Typography>

        <View style={styles.spacer} />
        <View style={styles.spacer} />

        <View style={styles.main}>
          <View style={styles.row}>
            <Typography style={styles.aboutSectionParaBold}>
              {languages.t('about.version')}
            </Typography>
            <Typography style={styles.aboutSectionPara}>
              {packageJson.version}
            </Typography>
          </View>

          <View style={styles.row}>
            <Typography style={styles.aboutSectionParaBold}>
              {languages.t('about.operating_system_abbr')}
            </Typography>
            <Typography style={styles.aboutSectionPara}>
              {Platform.OS + ' v' + Platform.Version}
            </Typography>
          </View>

          <View style={styles.row}>
            <Typography style={styles.aboutSectionParaBold}>
              {languages.t('about.dimensions')}
            </Typography>
            <Typography style={styles.aboutSectionPara}>
              {Math.trunc(Dimensions.get('screen').width) +
                ' x ' +
                Math.trunc(Dimensions.get('screen').height)}
            </Typography>
          </View>
        </View>

        <View style={styles.spacer} />
        <View style={styles.spacer} />
      </ScrollView>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: Colors.INTRO_WHITE_BG,
    paddingHorizontal: 26,
    paddingBottom: 42,
  },
  aboutLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  aboutSectionIconLock: {
    width: 20,
    height: 26.67,
    marginTop: 36,
  },
  aboutSectionTitles: {
    color: Colors.BLACK,
    fontSize: 26,
    fontFamily: fontFamily.primaryMedium,
    marginTop: 36,
    marginLeft: 10,
    lineHeight: 32,
  },
  aboutSectionPara: {
    color: Colors.VIOLET_TEXT,
    fontSize: 16,
    lineHeight: 22.5,
    marginTop: 12,
    alignSelf: 'center',
    fontFamily: fontFamily.primaryRegular,
  },
  hyperlink: {
    color: Colors.VIOLET_TEXT,
    fontSize: 16,
    lineHeight: 22.5,
    marginTop: 12,
    alignSelf: 'center',
    fontFamily: fontFamily.primaryRegular,
    textDecorationLine: 'underline',
  },
  aboutSectionParaBold: {
    color: Colors.VIOLET_TEXT,
    fontSize: 16,
    lineHeight: 22.5,
    marginTop: 12,
    alignSelf: 'center',
    fontFamily: fontFamily.primaryBold,
  },
  spacer: {
    marginVertical: '2%',
  },
  row: {
    flexDirection: 'row',
    color: Colors.PRIMARY_TEXT,
    alignItems: 'flex-start',
  },
});

export default AboutScreen;
