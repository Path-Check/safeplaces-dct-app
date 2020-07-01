import React, { useContext } from 'react';
import {
  ImageBackground,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';

import PermissionsContext from '../../gps/PermissionsContext';
import { PermissionStatus } from '../../permissionStatus';
import onboardingCompleteAction from '../../store/actions/onboardingCompleteAction';
import { SetStoreData } from '../../helpers/General';
import { PARTICIPATE } from '../../constants/storage';
import { Typography } from '../../components/Typography';
import { useStatusBarEffect } from '../../navigation';

import { Icons, Images } from '../../assets';
import {
  Buttons,
  Spacing,
  Colors,
  Iconography,
  Typography as TypographyStyles,
} from '../../styles';

const LocationsPermissions = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { authSubscription, location } = useContext(PermissionsContext);

  useStatusBarEffect('dark-content');

  const requestLocationAccess = async () => {
    await location.request();
    authSubscription.request();
    completeOnboarding();
  };

  const completeOnboarding = () => {
    const storeData = location.status === PermissionStatus.GRANTED;
    SetStoreData(PARTICIPATE, JSON.stringify(storeData));
    dispatch(onboardingCompleteAction());
  };

  const handleOnPressEnable = () => {
    requestLocationAccess();
    completeOnboarding();
  };

  const handleOnPressMaybeLater = () => {
    completeOnboarding();
  };

  return (
    <ImageBackground
      source={Images.BlueGradientBackground}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={{ paddingBottom: Spacing.large }}>
          <View style={styles.iconCircle}>
            <SvgXml xml={Icons.LocationPin} width={30} height={30} />
          </View>
          <Typography style={styles.headerText}>
            {t('onboarding.maybe_later')}
          </Typography>
          <View style={{ height: Spacing.medium }} />
          <Typography style={styles.contentText}>
            {t('onboarding.notification_subheader')}
          </Typography>
        </ScrollView>

        <TouchableOpacity
          onPress={handleOnPressEnable}
          style={styles.enableButton}>
          <Typography style={styles.enableButtonText}>
            {t('label.launch_allow_location')}
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOnPressMaybeLater}
          style={styles.maybeLaterButton}>
          <Typography style={styles.maybeLaterButtonText}>
            {t('onboarding.maybe_later')}
          </Typography>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.large,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  iconCircle: {
    ...Iconography.largeBlueIcon,
  },
  headerText: {
    ...TypographyStyles.header2,
    color: Colors.white,
  },
  contentText: {
    ...TypographyStyles.mainContent,
    color: Colors.white,
  },
  enableButton: {
    ...Buttons.largeWhite,
  },
  enableButtonText: {
    ...TypographyStyles.buttonTextDark,
  },
  maybeLaterButton: {
    ...Buttons.largeTransparent,
  },
  maybeLaterButtonText: {
    ...TypographyStyles.buttonTextLight,
  },
});

export default LocationsPermissions;
