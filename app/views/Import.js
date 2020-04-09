import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';

import colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import {
  ImportTakeoutData,
  NoRecentLocationsError,
} from '../helpers/GoogleTakeOutAutoImport';
import languages from './../locales/languages';
import { PickFile } from '../helpers/General';

const width = Dimensions.get('window').width;

import NavigationBarWrapper from '../components/NavigationBarWrapper';

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

      const filePath = await PickFile();
      if (filePath) {
        const newLocations = await ImportTakeoutData(filePath);
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
          <Text style={styles.sectionDescription}>
            {languages.t('label.import_step_1')}
          </Text>
          <Text style={styles.sectionDescription}>
            {languages.t('label.import_step_2')}
          </Text>
          <Text style={styles.sectionDescription}>
            {languages.t('label.import_step_3')}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://takeout.google.com/settings/takeout/custom/location_history',
              )
            }
            style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>
              {languages.t('label.import_takeout').toUpperCase()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={importPickFile}
            style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>
              {languages.t('label.import_title').toUpperCase()}
            </Text>
          </TouchableOpacity>

          {importResults.label ? (
            <Text
              style={{
                ...styles.importResults,
                ...(importResults?.error ? styles.importResultsError : {}),
              }}>
              {languages.t(importResults.label)}
            </Text>
          ) : null}
        </View>
      </View>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  // Container covers the entire screen
  container: {
    flex: 1,
    flexDirection: 'column',
    color: colors.PRIMARY_TEXT,
    backgroundColor: colors.WHITE,
  },
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
  headerContainer: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(189, 195, 199,0.6)',
    alignItems: 'center',
  },
  backArrowTouchable: {
    width: 60,
    height: 60,
    paddingTop: 21,
    paddingLeft: 20,
  },
  backArrow: {
    height: 18,
    width: 18.48,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fontFamily.primaryRegular,
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
