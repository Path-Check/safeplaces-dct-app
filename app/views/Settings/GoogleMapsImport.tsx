import React from 'react';
import { View, StyleSheet } from 'react-native';
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
import { Spacing, Typography as TypographyStyles } from '../../styles';
import { Button } from '../../components/Button';

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

      <Typography use='body2'>{t('import.subtitle')}</Typography>

      <View style={styles.buttonWrapper}>
        <Button onPress={handleImportPressed} label={t('import.button_text')} />
      </View>

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
  buttonWrapper: {
    marginVertical: Spacing.medium,
  },
  buttonText: {
    ...TypographyStyles.buttonTextDark,
  },
  disclaimerText: {
    ...TypographyStyles.disclaimer,
  },
});

export default GoogleMapsImport;
