import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';
import colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import { pickFile } from '../helpers/General';
import {
  EmptyFilePathError,
  InvalidFileExtensionError,
  NoRecentLocationsError,
  importTakeoutData,
} from '../helpers/GoogleTakeOutAutoImport';

const width = Dimensions.get('window').width;

const makeImportResults = (label = '', error = false) => ({
  error,
  label,
});

const ImportScreen = props => {
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

      const newLocations = await importTakeoutData(filePath);

      if (newLocations.length) {
        setImportResults(t('import.success'));
      } else {
        setImportResults(t('import.google.already_imported'));
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
      <ScrollView style={styles.main}>
        <View style={styles.subHeaderTitle}>
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
          {/* eslint-enable react/no-unescaped-entities */}
          <TouchableOpacity
            testID='google-takeout-link'
            onPress={() =>
              Linking.openURL(
                'https://takeout.google.com/settings/takeout/custom/location_history',
              )
            }
            style={styles.buttonTouchable}>
            <Typography style={styles.buttonText}>
              {t('import.google.visit_button_text')}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            testID='google-takeout-import-btn'
            onPress={importPickFile}
            style={styles.buttonTouchable}>
            <Typography style={styles.buttonText}>
              {t('import.title')}
            </Typography>
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
        </View>
      </ScrollView>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  subHeaderTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    padding: 5,
    paddingBottom: 20,
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    textAlignVertical: 'top',
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
    alignSelf: 'center',
  },
  buttonTouchable: {
    borderRadius: 12,
    backgroundColor: colors.VIOLET,
    height: 52,
    alignSelf: 'center',
    width: width * 0.7866,
    marginTop: 30,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: fontFamily.primarySemiBold,
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.WHITE,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    fontFamily: fontFamily.primaryRegular,
  },
  importResults: {
    fontSize: 12,
    lineHeight: 20,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: fontFamily.primaryRegular,
    color: colors.VIOLET_TEXT,
  },
  importResultsError: {
    color: colors.RED_TEXT,
  },
});
export default ImportScreen;
