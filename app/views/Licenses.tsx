import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { NavigationBarWrapper } from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';

import { Images } from '../assets';
import { Colors, Spacing } from '../styles';

const PRIVACY_POLICY_URL = 'https://pathcheck.org/privacy-policy/';

export const LicensesScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const backToMain = () => {
    navigation.goBack();
  };

  const infoAddress = 'info@pathcheck.org';
  const pathCheckAddress = 'pathcheck.org';

  const handleOnPressOpenUrl = (url: string) => {
    return () => Linking.openURL(url);
  };

  return (
    <NavigationBarWrapper
      title={t('screen_titles.legal')}
      onBackPress={backToMain}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        alwaysBounceVertical={false}>
        <View>
          <Typography use='headline2' testID={'licenses-legal-header'}>
            {t('label.legal_page_header_location')}
          </Typography>
          <View
            style={{ paddingTop: Spacing.xSmall, paddingLeft: Spacing.medium }}>
            <Typography use='body2'>{t('label.legal_page_address')}</Typography>
            <View style={{ height: 20 }} />
            <Typography
              use='body2'
              onPress={handleOnPressOpenUrl('mailto:info@pathcheck.org')}
              style={styles.hyperlink}>
              {infoAddress}
            </Typography>
            <Typography
              use='body2'
              onPress={handleOnPressOpenUrl('https://pathcheck.org/')}
              style={styles.hyperlink}>
              {pathCheckAddress}
            </Typography>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.termsInfoRow}
        onPress={handleOnPressOpenUrl(PRIVACY_POLICY_URL)}>
        <Typography style={{ color: Colors.white }} use='body1'>
          {t('label.privacy_policy')}
        </Typography>
        <View style={styles.arrowContainer}>
          <Image source={Images.ForeArrow} />
        </View>
      </TouchableOpacity>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.primaryBackgroundFaintShade,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  hyperlink: {
    color: Colors.linkText,
    textDecorationLine: 'underline',
  },
  termsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  arrowContainer: {
    alignSelf: 'center',
    paddingRight: 20,
    paddingLeft: 20,
  },
});
