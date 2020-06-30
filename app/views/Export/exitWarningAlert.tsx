import i18next from 'i18next';
import { Alert } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';

/**
 * Triggers an alert before returning to the settings screen.
 * Use this on screens after the upload code.
 */
const exitWarningAlert = (
  navigation: NavigationScreenProp<NavigationState, NavigationParams>,
  route = 'ExportStart',
): void => {
  return Alert.alert(
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
        onPress: () => navigation.navigate(route),
        style: 'destructive',
      },
    ],
    // Manually create cancel button
    { cancelable: false },
  );
};

export default exitWarningAlert;
