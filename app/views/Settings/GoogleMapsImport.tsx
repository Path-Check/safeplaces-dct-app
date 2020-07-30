import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import { Typography } from '../../components/Typography';
import { Screens } from '../../navigation';

import { Icons } from '../../assets';
import { Buttons, Spacing, Typography as TypographyStyles } from '../../styles';

interface GoogleMapsImportProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

const GoogleMapsImport = ({
  navigation,
}: GoogleMapsImportProps): JSX.Element => {
  const { t } = useTranslation();

  const handleImportPressed = () => {
    navigation.navigate(Screens.ImportFromGoogle);
  };

  return (
    <>
      <View style={styles.title}>
        <SvgXml xml={Icons.GoogleMapsLogo} />
        <Typography use='body1' style={styles.titleText}>
          {t('import.google.title')}
        </Typography>
      </View>

      <Typography use='body2'>{t('import.subtitle')}</Typography>

      <TouchableOpacity onPress={handleImportPressed} style={styles.button}>
        <Typography style={styles.buttonText}>
          {t('import.button_text')}
        </Typography>
      </TouchableOpacity>

      <Typography style={styles.disclaimerText}>
        {t('import.google.disclaimer')}
      </Typography>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.xSmall,
  },
  titleText: {
    marginLeft: Spacing.xxSmall,
  },
  button: {
    ...Buttons.largeBlue,
    marginVertical: Spacing.medium,
  },
  buttonText: {
    ...TypographyStyles.buttonTextLight,
  },
  disclaimerText: {
    ...TypographyStyles.disclaimer,
  },
});

export default GoogleMapsImport;
