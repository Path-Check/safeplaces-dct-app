import React, { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import languages from './../locales/languages';
import { Button } from '../components/Button';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';
import colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import { pickFile } from '../helpers/General';
import {
  InvalidFileExtensionError,
  NoRecentLocationsError,
  importTakeoutData,
} from '../helpers/GoogleTakeOutAutoImport';

const makeImportResults = (label = '', error = false) => ({
  error,
  label,
});

const ImportScreen = props => {
  const {
    navigation: { goBack },
  } = props;
  const [importResults, setImportResults] = useState(makeImportResults());

  async function importPickFile() {
    try {
      // reset info message
      setImportResults(makeImportResults());

      const filePath = await pickFile();
      if (filePath) {
        const newLocations = await importTakeoutData(filePath);
        if (newLocations.length) {
          setImportResults(makeImportResults('label.import_success'));
        } else {
          setImportResults(makeImportResults('label.import_already_imported'));
        }
      }
    } catch (err) {
      if (err instanceof NoRecentLocationsError) {
        setImportResults(
          makeImportResults('label.import_no_recent_locations', true),
        );
      } else if (err instanceof InvalidFileExtensionError) {
        setImportResults(
          makeImportResults('label.import_invalid_file_format', true),
        );
      } else {
        setImportResults(makeImportResults('label.import_error', true));
      }
    }
  }

  return (
    <NavigationBarWrapper
      title={languages.t('label.import_title')}
      onBackPress={goBack}>
      <View style={styles.main}>
        <View style={styles.subHeaderTitle}>
          <Typography style={styles.sectionDescription}>
            {languages.t('label.import_step_1')}
          </Typography>
          <Typography style={styles.sectionDescription}>
            {languages.t('label.import_step_2')}
          </Typography>
          <Typography style={styles.sectionDescription}>
            {languages.t('label.import_step_3')}
          </Typography>

          <Button
            label={languages.t('label.import_takeout')}
            testID='google-takeout-link'
            onPress={() =>
              Linking.openURL(
                'https://takeout.google.com/settings/takeout/custom/location_history',
              )
            }
          />

          <Button
            label={languages.t('label.import_title')}
            testID='google-takeout-import-btn'
            onPress={importPickFile}
          />

          {importResults.label ? (
            <Typography
              style={{
                ...styles.importResults,
                ...(importResults?.error ? styles.importResultsError : {}),
              }}>
              {languages.t(importResults.label)}
            </Typography>
          ) : null}
        </View>
      </View>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  subHeaderTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    padding: 5,
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
