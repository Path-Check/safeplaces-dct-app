import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  NativeModules,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

import { Button, Typography } from '../../components';
import fontFamily from '../../constants/fonts';
import { Theme } from '../../constants/themes';
import { isPlatformiOS } from '../../Util';

import { Icons } from '../../assets';
import { Colors } from '../../styles';

const base64 = RNFetchBlob.base64;

// NOTE:
// This is the old way we export. This is still the default, but will
// become flipped behind the feature flag once we have staging for uploading.
const ExportLocally = () => {
  const { t } = useTranslation();

  async function onShare() {
    try {
      let locationData = await NativeModules.SecureStorageManager.getLocations();
      let nowUTC = new Date().toISOString();
      let unixtimeUTC = Date.parse(nowUTC);

      let options = {};
      let jsonData = JSON.stringify(
        locationData.map(({ latitude, longitude, time }) => ({
          latitude,
          longitude,
          time,
        })),
      );
      const title = 'COVIDSafePaths.json';
      const filename = unixtimeUTC + '.json';
      const message = 'Here is my location log from PathCheck.';
      if (isPlatformiOS()) {
        const url = RNFS.DocumentDirectoryPath + '/' + filename;
        await RNFS.writeFile(url, jsonData, 'utf8')
          .then(() => {
            options = {
              activityItemSources: [
                {
                  placeholderItem: { type: 'url', content: url },
                  item: {
                    default: { type: 'url', content: url },
                  },
                  subject: {
                    default: title,
                  },
                  linkMetadata: { originalUrl: url, url, title },
                },
              ],
            };
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else {
        jsonData = 'data:application/json;base64,' + base64.encode(jsonData);
        options = {
          title,
          subject: title,
          url: jsonData,
          message: message,
          filename: filename,
        };
      }
      await Share.open(options)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          console.log(err.message, err.code);
        });
      if (isPlatformiOS()) {
        // eslint-disable-next-line no-undef
        await RNFS.unlink(url);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <Theme use='violet'>
      <StatusBar
        barStyle='light-content'
        backgroundColor={Colors.secondaryBlue}
        translucent={false}
      />
      <SafeAreaView style={styles.topSafeAreaContainer} />
      <SafeAreaView style={styles.bottomSafeAreaContainer}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[Colors.secondaryBlue, Colors.primaryBlue]}
          style={{ flex: 1, height: '100%' }}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.main}>
              <Typography use='headline2' style={styles.exportSectionTitles}>
                {t('share.title')}
              </Typography>
              <Typography use='body1' style={styles.exportSectionPara}>
                {t('share.paragraph_first')}
              </Typography>
              <Typography use='body1' style={styles.exportSectionPara}>
                {t('share.paragraph_second')}
              </Typography>

              <Button
                style={styles.exportButton}
                label={t('share.button_text')}
                icon={Icons.Export}
                onPress={onShare}
              />
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Theme>
  );
};

const styles = StyleSheet.create({
  // Container covers the entire screen
  topSafeAreaContainer: {
    flex: 0,
    backgroundColor: Colors.secondaryBlue,
  },
  bottomSafeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBlue,
  },
  contentContainer: {
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    paddingHorizontal: 26,
  },
  exportSectionTitles: {
    marginTop: 9,
    fontWeight: 'normal',
    fontFamily: fontFamily.primaryMedium,
  },
  exportSectionPara: {
    marginTop: 22,
  },
  exportButton: {
    marginTop: 48,
  },
  main: {
    flex: 1,
    paddingTop: 48,
  },
});

ExportLocally.propTypes = {
  shareButtonDisabled: PropTypes.bool,
};

ExportLocally.defaultProps = {
  shareButtonDisabled: true,
};

export default ExportLocally;
