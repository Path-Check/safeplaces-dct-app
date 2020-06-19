import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Typography } from '../../components/Typography';
import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import { Screens, useStatusBarEffect } from '../../navigation';

import { Buttons, Spacing, Typography as TypographyStyles } from '../../styles';

const NextSteps = (): JSX.Element => {
  const navigation = useNavigation();
  useStatusBarEffect('light-content');

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const healthAuthority = 'The PathCheck Health Department';

  const headerText = `${healthAuthority} recommends you take a self-assessment`;

  const contentTextOne =
    'It is possible that you may have crossed paths with somebody who has been diagnosed with COVID-19.';

  const contentTextTwo =
    "This does not mean that you are infected, but you should take precautions anyway. People who don't exhibit symptoms can sometimes still be contagious.";

  const buttonText = 'Take Self Assessment';

  const handleOnPressTakeAssessment = () => {
    navigation.navigate(Screens.SelfAssessment);
  };

  return (
    <NavigationBarWrapper title={'Next Steps'} onBackPress={handleOnBackPress}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Typography style={styles.headerText}>{headerText}</Typography>
        </View>
        <View style={styles.contentContainer}>
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
    justifyContent: 'space-between',
    padding: Spacing.medium,
  },
  headerContainer: {
    flex: 1,
  },
  headerText: {
    ...TypographyStyles.header1,
  },
  contentContainer: {
    flex: 2,
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
