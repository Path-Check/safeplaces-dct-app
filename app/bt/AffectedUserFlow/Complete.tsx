import React, { FunctionComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useStatusBarEffect } from '../../navigation';
import { useStrategyContent } from '../../TracingStrategyContext';
import { Typography } from '../../components/Typography';

import { Screens } from '../../navigation';

import {
  Layout,
  Spacing,
  Colors,
  Buttons,
  Typography as TypographyStyles,
} from '../../styles';

export const ExportComplete: FunctionComponent = () => {
  useStatusBarEffect('dark-content');
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { StrategyCopy } = useStrategyContent();

  const handleOnPressDone = () => {
    navigation.navigate(Screens.More);
  };

  const title = t('export.complete_title');
  const body = StrategyCopy.exportCompleteBody;

  return (
    <View style={styles.backgroundImage}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View>
            <Typography style={styles.header}>{title}</Typography>
            <Typography style={styles.contentText}>{body}</Typography>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleOnPressDone}>
            <Typography style={styles.buttonText}>
              {t('common.done')}
            </Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Layout.oneTenthHeight,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.large,
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    width: '100%',
    height: '100%',
  },
  header: {
    ...TypographyStyles.header2,
    paddingBottom: Spacing.small,
  },
  contentText: {
    ...TypographyStyles.secondaryContent,
  },
  button: {
    ...Buttons.largeBlue,
  },
  buttonText: {
    ...TypographyStyles.buttonTextLight,
  },
});

export default ExportComplete;
