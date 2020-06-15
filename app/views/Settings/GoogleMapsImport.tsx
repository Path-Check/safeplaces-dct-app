import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
    navigation.navigate(Screens.Import);
  };

  return (
    <>
      <View style={styles.title}>
        <SvgXml xml={Icons.GoogleMapsLogo} />
        <Typography use='body1' style={styles.titleText}>
          {t('import.google.title')}
        </Typography>
      </View>

      <View style={styles.description}>
        <Typography use='body2'>{t('import.subtitle')}</Typography>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleImportPressed}>
        <Typography style={styles.buttonText}>
          {t('import.button_text')}
        </Typography>
      </TouchableOpacity>

      <View style={styles.description}>
        <Typography style={styles.disclaimerText}>
          {t('import.google.disclaimer')}
        </Typography>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.small,
  },
  titleText: {
    marginLeft: Spacing.small,
  },
  description: {
    paddingVertical: Spacing.medium,
  },
  button: {
    ...Buttons.largeBlueOutline,
  },
  buttonText: {
    ...TypographyStyles.ctaButtonOutlined,
  },
  disclaimerText: {
    ...TypographyStyles.disclaimer,
  },
});

export default GoogleMapsImport;
