import React, { useState } from 'react';
import {
  TouchableOpacity,
  Linking,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { NavigationBarWrapper, Typography } from '../components';
import { pickFile } from '../helpers/General';
import {
  EmptyFilePathError,
  InvalidFileExtensionError,
  NoRecentLocationsError,
  importTakeoutData,
} from '../helpers/GoogleTakeOutAutoImport';

import {
  Typography as TypographyStyles,
  Colors,
  Spacing,
  Buttons,
} from '../styles';

const makeImportResults = (label = '', error = false) => ({
  error,
  label,
});

const ImportScreen = (props) => {
  const { t } = useTranslation();
  const {
    navigation: { goBack },
  } = props;
  const [importResults, _setImportResults] = useState(makeImportResults());
  const setImportResults = (...args) =>
    _setImportResults(makeImportResults(...args));
  async function importPickFile() {
    try {
      // reset info message
      setImportResults();

      const filePath = await pickFile();
      if (filePath) {
        await importTakeoutData(filePath);
        setImportResults(t('label.import_success'));
      }
    } catch (err) {
      if (err instanceof NoRecentLocationsError) {
        setImportResults(t('import.google.no_recent_locations'), true);
      } else if (err instanceof InvalidFileExtensionError) {
        setImportResults(t('import.google.invalid_file_format'), true);
      } else if (err instanceof EmptyFilePathError) {
        /**
         * If the imported file is opened from other than Google Drive folder,
         * filepath is returned as null. Leaving a message to ensure import file
         * is located on Google Drive.
         */
        setImportResults(t('import.google.file_open_error'), true);
      } else {
        console.log('[ERROR] Failed to import locations', err);
        setImportResults(t('import.error'), true);
      }
    }
  }

  return (
    <NavigationBarWrapper title={t('import.title')} onBackPress={goBack}>
      <ScrollView style={styles.container}>
        <Typography style={styles.sectionDescription}>
          {t('import.google.instructions_first')}
        </Typography>
        {/* eslint-disable react/no-unescaped-entities */}
        <Typography style={styles.sectionDescription}>
          {t('import.google.instructions_second')}
        </Typography>
        <Typography style={styles.sectionDescription}>
          {t('import.google.instructions_detailed')}
        </Typography>
        <TouchableOpacity
          testID='google-takeout-link'
          onPress={() =>
            Linking.openURL(
              'https://takeout.google.com/settings/takeout/custom/location_history',
            )
          }
          style={styles.button}>
          <Typography style={styles.buttonText}>
            {t('import.google.visit_button_text')}
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          testID='google-takeout-import-btn'
          onPress={importPickFile}
          style={styles.button}>
          <Typography style={styles.buttonText}>{t('import.title')}</Typography>
        </TouchableOpacity>
        {importResults.label ? (
          <Typography
            style={{
              ...styles.importResults,
              ...(importResults?.error ? styles.importResultsError : {}),
            }}>
            {importResults.label}
          </Typography>
        ) : null}
      </ScrollView>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.medium,
  },
  sectionDescription: {
    ...Typography.sectionDescription,
    marginBottom: Spacing.small,
  },
  button: {
    ...Buttons.mediumBlue,
    marginBottom: Spacing.medium,
  },
  buttonText: {
    ...TypographyStyles.buttonTextLight,
  },
  importResults: {
    flex: 1,
  },
  importResultsError: {
    color: Colors.errorText,
  },
});

export default ImportScreen;
