import { Button, Text } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';
import colors from '../constants/colors';
import buttonStyle from '../constants/DR/buttonStyles';
import fontFamily from '../constants/fonts';
import { pickFile } from '../helpers/General';
import {
  EmptyFilePathError,
  InvalidFileExtensionError,
  NoRecentLocationsError,
  importTakeoutData,
} from '../helpers/GoogleTakeOutAutoImport';

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
      <ScrollView style={styles.main}>
        <View style={styles.subHeaderTitle}>
          <Typography
            bold
            style={[
              { fontFamily: fontFamily.primarySemiBold },
              styles.sectionDescription,
            ]}>
            {t('import.google.instructions_first')}
          </Typography>
          {/* eslint-disable react/no-unescaped-entities */}
          <Typography style={styles.sectionDescription}>
            {t('import.google.instructions_second')}
          </Typography>
          <Typography style={styles.sectionDescription}>
            {t('import.google.instructions_detailed_title')}
          </Typography>
          <View style={styles.bottomLine} />

          <Typography
            style={[styles.sectionDescription, { marginLeft: wp('4.5%') }]}>
            {t('import.google.instructions_detailed')}
          </Typography>

          <Button
            small
            testID='google-takeout-link'
            onPress={() =>
              Linking.openURL(
                'https://takeout.google.com/settings/takeout/custom/location_history',
              )
            }
            style={{
              ...buttonStyle.buttonStyle,
              marginTop: 40,
              marginBottom: 20,
              height: wp('11%'),
            }}>
            <Text style={{ ...buttonStyle.buttonText, fontSize: wp('4%') }}>
              {t('import.google.visit_button_text')}
            </Text>
          </Button>

          <Button
            small
            testID='google-takeout-import-btn'
            onPress={importPickFile}
            style={{
              ...buttonStyle.buttonStyle,
              height: wp('11%'),
            }}>
            <Text style={{ ...buttonStyle.buttonText, fontSize: wp('4%') }}>
              {t('import.title')}
            </Text>
          </Button>

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
  bottomLine: {
    width: 30,
    borderBottomColor: colors.PINK,
    borderBottomWidth: 2,
    marginTop: 15,
  },
  subHeaderTitle: {
    textAlign: 'center',
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
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    fontFamily: fontFamily.primaryRegular,
    color: colors.BLACK,
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
    color: colors.VIOLET_TEXT,
  },
});
export default ImportScreen;
