import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Icons, Images } from '../../assets';
import { Button } from '../../components/Button';
import { Type, Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import { Theme } from '../../constants/themes';
import ExposureNotificationContext from '../../ExposureNotificationContext';

export const EnableExposureNotifications = ({ navigation }) => {
  const { requestExposureNotificationAuthorization } = useContext(
    ExposureNotificationContext,
  );
  const { t } = useTranslation();

  const buttonLabel = t('label.launch_enable_exposure_notif');
  const disableButtonLabel = t('label.launch_disable_exposure_notif');
  const subTitleText = t('label.launch_exposure_notif_subheader');
  const titleText = t('label.launch_exposure_notif_header');

  const handleOnPressEnable = () => {
    requestExposureNotificationAuthorization();
    navigation.navigate('Main');
  };

  const handleOnPressDisable = () => {
    navigation.navigate('Main');
  };

  return (
    <Theme use='violet'>
      <ImageBackground
        source={Images.LaunchScreenBackground}
        style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />

        <View
          testID={'onboarding-permissions-screen'}
          style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.iconContainer}>
              <SvgXml xml={Icons.ExposureIcon} />
            </View>
            <Typography
              style={styles.headerText}
              use={Type.Headline2}
              testID='Header'>
              {titleText}
            </Typography>
            <Typography style={styles.subheaderText} use={Type.Body2}>
              {subTitleText}
            </Typography>
          </View>

          <View style={styles.footerContainer}>
            <Button
              secondary
              label={disableButtonLabel}
              onPress={handleOnPressDisable}
              testID={'onboarding-permissions-disable-button'}
            />
            <Button
              label={buttonLabel}
              onPress={handleOnPressEnable}
              testID={'onboarding-permissions-button'}
            />
          </View>
        </View>
      </ImageBackground>
    </Theme>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  footerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
  },
  headerText: {
    color: Colors.WHITE,
  },
  iconContainer: {
    marginBottom: '10%',
  },
  subheaderText: {
    color: Colors.WHITE,
    marginTop: '3%',
  },
});
