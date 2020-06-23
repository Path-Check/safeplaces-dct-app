import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import fontFamily from './../constants/fonts';
import { NavigationBarWrapper, Typography } from '../components';
import { useAssets } from '../TracingStrategyAssets';

import { Colors, Spacing } from '../styles';

export const AboutScreen = ({ navigation }) => {
  const version = '1.1.0 (4)';
  const { t } = useTranslation();
  const { aboutHeader } = useAssets();

  const backToMain = () => {
    navigation.goBack();
  };

  return (
    <NavigationBarWrapper
      title={t('screen_titles.about')}
      onBackPress={backToMain}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        alwaysBounceVertical={false}>
        <View style={styles.spacer} />
        <View style={styles.spacer} />

        <Typography use='headline2'>{aboutHeader}</Typography>
        <View style={{ height: 10 }} />
        <Typography use='body2'>
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
                {version}
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
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: Spacing.medium,
  },
  hyperlink: {
    color: Colors.linkText,
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
