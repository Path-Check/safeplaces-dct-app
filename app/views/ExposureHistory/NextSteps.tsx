import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Typography } from '../../components/Typography';
import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import { Screens, useStatusBarEffect } from '../../navigation';

import { Buttons, Spacing, Typography as TypographyStyles } from '../../styles';

import { AUTHORITY_NAME as healthAuthority } from '../../constants/authorities';

const NextSteps = (): JSX.Element => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  useStatusBarEffect('light-content');

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const headerText = t('exposure_history.next_steps.ha_self_assessment', {
    healthAuthority,
  });
  const contentTextOne = t(
    'exposure_history.next_steps.possible_crossed_paths',
  );
  const contentTextTwo = t(
    'exposure_history.next_steps.possible_infection_precaution',
  );
  const buttonText = t('exposure_history.next_steps.button_text');

  const handleOnPressTakeAssessment = () => {
    navigation.navigate(Screens.SelfAssessment);
  };

  return (
    <NavigationBarWrapper title={'Next Steps'} onBackPress={handleOnBackPress}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Typography style={styles.headerText}>{headerText}</Typography>
          <Typography style={styles.contentText}>{contentTextOne}</Typography>
          <Typography style={styles.contentText}>{contentTextTwo}</Typography>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleOnPressTakeAssessment}>
            <Typography style={styles.buttonText}>{buttonText}</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.medium,
  },
  headerContainer: {
    flex: 1,
  },
  headerText: {
    ...TypographyStyles.header3,
  },
  contentText: {
    ...TypographyStyles.mainContent,
    paddingTop: Spacing.small,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    ...Buttons.largeBlue,
  },
  buttonText: {
    ...TypographyStyles.buttonTextLight,
  },
});

export default NextSteps;
