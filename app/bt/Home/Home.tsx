import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { ENPermissionStatus } from '../PermissionsContext';
import { Typography } from '../../components/Typography';
import { isPlatformiOS } from '../../Util';

import {
  Layout,
  Spacing,
  Colors,
  Typography as TypographyStyles,
  Buttons,
} from '../../styles';

interface HomeProps {
  enPermissionStatus: ENPermissionStatus;
  requestPermission: () => void;
}

const Home = ({
  enPermissionStatus,
  requestPermission,
}: HomeProps): JSX.Element => {
  const { t } = useTranslation();
  const [authorization, enablement] = enPermissionStatus;
  const isEnabled = enablement === 'ENABLED';
  const isAuthorized = authorization === 'AUTHORIZED';

  const isEnabledAndAuthorized = isEnabled && isAuthorized;

  const headerText = isEnabledAndAuthorized
    ? t('home.bluetooth.all_services_on_header')
    : t('home.bluetooth.tracing_off_header');
  const subheaderText = isEnabledAndAuthorized
    ? t('home.bluetooth.all_services_on_subheader')
    : t('home.bluetooth.tracing_off_subheader');
  const buttonText = t('home.bluetooth.tracing_off_button');

  const showUnAuthorizedAlert = () => {
    Alert.alert(
      t('home.bluetooth.unauthorized_error_title'),
      t('home.bluetooth.unauthorized_error_message'),
      [
        {
          text: t('common.settings'),
          onPress: () => Linking.openSettings(),
        },
      ],
    );
  };

  const handleRequestPermission = () => {
    if (isAuthorized) {
      requestPermission();
    } else if (isPlatformiOS()) {
      showUnAuthorizedAlert();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Typography style={styles.headerText} testID={'home-header'}>
          {headerText}
        </Typography>
        <Typography style={styles.subheaderText} testID={'home-subheader'}>
          {subheaderText}
        </Typography>
      </View>
      {!isEnabledAndAuthorized ? (
        <TouchableOpacity
          testID={'home-request-permissions-button'}
          onPress={handleRequestPermission}
          style={styles.button}>
          <Typography style={styles.buttonText}>{buttonText}</Typography>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    position: 'absolute',
    top: Layout.screenHeight / 3,
    width: '100%',
  },
  headerText: {
    ...TypographyStyles.largerFont,
    ...TypographyStyles.bold,
    lineHeight: TypographyStyles.mediumLineHeight,
    color: Colors.white,
    textAlign: 'center',
  },
  subheaderText: {
    ...TypographyStyles.header4,
    textAlign: 'center',
    color: Colors.white,
    marginTop: Spacing.medium,
  },
  button: {
    ...Buttons.largeWhite,
    width: '100%',
  },
  buttonText: {
    ...TypographyStyles.buttonTextDark,
  },
});

export default Home;
