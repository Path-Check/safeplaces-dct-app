import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import packageJson from '../../package.json';
import fontFamily from './../constants/fonts';
import { Icons } from '../assets';
import { NavigationBarWrapper, Typography } from '../components';
import { useAssets } from '../TracingStrategyAssets';

import { Colors } from '../styles';

export const AboutScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { aboutHeader } = useAssets();

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
      title={t('screen_titles.about')}
      onBackPress={backToMain}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.spacer} />
        <View style={styles.spacer} />

        <View style={styles.aboutLabelContainer}>
          <SvgXml style={styles.aboutSectionIconLock} xml={Icons.Lock} />
          <Typography style={styles.aboutSectionTitles} use='headline2'>
            {aboutHeader}
          </Typography>
        </View>
        <Typography style={styles.aboutSectionPara}>
          {t('label.about_para')}
          {/* Space between the copy & link*/}
          <Text> </Text>
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
          <View>
            <View style={styles.row}>
              <Typography style={styles.aboutSectionParaBold}>
                {t('about.version')}
              </Typography>
            </View>

            <View style={styles.row}>
              <Typography style={styles.aboutSectionParaBold}>
                {t('about.operating_system_abbr')}
              </Typography>
            </View>

            <View style={styles.row}>
              <Typography style={styles.aboutSectionParaBold}>
                {t('about.dimensions')}
              </Typography>
            </View>
          </View>

          <View>
            <View style={styles.row}>
              <Typography style={styles.aboutSectionParaBold}>
                {packageJson.version}
              </Typography>
            </View>

            <View style={styles.row}>
              <Typography style={styles.aboutSectionParaBold}>
                {Platform.OS + ' v' + Platform.Version}
              </Typography>
            </View>

            <View style={styles.row}>
              <Typography style={styles.aboutSectionParaBold}>
                {Math.trunc(Dimensions.get('screen').width) +
                  ' x ' +
                  Math.trunc(Dimensions.get('screen').height)}
              </Typography>
            </View>
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
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: 40,
    paddingBottom: 42,
  },
  aboutLabelContainer: {
    flexDirection: 'column',
  },
  aboutSectionIconLock: {
    width: 20,
    height: 26.67,
    marginTop: 36,
  },
  aboutSectionTitles: {
    color: Colors.primaryText,
    marginTop: 14,
    lineHeight: 32,
  },
  aboutSectionPara: {
    color: Colors.primaryText,
    fontSize: 16,
    lineHeight: 22.5,
    marginTop: 12,
    fontFamily: fontFamily.primaryRegular,
  },
  hyperlink: {
    color: Colors.linkText,
    fontSize: 16,
    lineHeight: 22.5,
    marginTop: 12,
    alignSelf: 'center',
    fontFamily: fontFamily.primaryRegular,
    textDecorationLine: 'underline',
  },
  aboutSectionParaBold: {
    color: Colors.primaryViolet,
    fontSize: 16,
    lineHeight: 22.5,
    marginTop: 20,
    alignSelf: 'center',
    fontFamily: fontFamily.primaryBold,
  },
  spacer: {
    marginVertical: '2%',
  },
  main: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    color: Colors.primaryText,
    alignItems: 'flex-start',
    marginRight: 20,
  },
});

export default AboutScreen;
