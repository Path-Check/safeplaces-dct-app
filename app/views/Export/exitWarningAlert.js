import i18next from 'i18next';
import { Alert } from 'react-native';

/**
 * Triggers an alert before returning to the settings screen.
 * Use this on screens after the upload code.
 */
const exitWarningAlert = (navigation) => {
  Alert.alert(
    i18next.t('export.exit_warning_title'),
    i18next.t('export.exit_warning_body'),
    [
      {
        text: i18next.t('export.exit_warning_cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: i18next.t('export.exit_warning_confirm'),
        onPress: () => navigation.navigate('SettingsScreen'),
        style: 'destructive',
      },
    ],
    // Manually create cancel button
    { cancelable: false },
  );
};

export default exitWarningAlert;
