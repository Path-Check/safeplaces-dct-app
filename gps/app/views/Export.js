import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  NativeModules,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import RNFS from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';
// import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

// import close from '../../../shared/assets/svgs/close';
import exportIcon from '../../../shared/assets/svgs/export';
import { isPlatformiOS } from './../Util';
import { Button } from '../components/Button';
// import { IconButton } from '../components/IconButton';
import { Typography } from '../components/Typography';
import Colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import { Theme } from '../constants/themes';

const base64 = RNFetchBlob.base64;

export const ExportScreen = ({ navigation }) => {
  const [showConfirmationAlert, setShowingConfirmationText] = useState(false);

  const { t } = useTranslation();
  function handleBackPress() {
    navigation.goBack();
    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return function cleanup() {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  });

  function showAlert() {
    setShowingConfirmationText(true);
  }

  function hideAlert() {
    setShowingConfirmationText(false);
  }

  // function backToMain() {
  //   navigation.goBack();
  // }

  async function onShare() {
    try {
      let locationData = await NativeModules.SecureStorageManager.getLocations();
      let nowUTC = new Date().toISOString();
      let unixtimeUTC = Date.parse(nowUTC);

      let options = {};
      let jsonData = JSON.stringify(locationData);
      const title = 'COVIDSafePaths.json';
      const filename = unixtimeUTC + '.json';
      const message = 'Here is my location log from COVID Safe Paths.';
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
          .catch(err => {
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
      showAlert();

      // - Esse trecho abaixo abria uma janela para compartilhar o json por wpp, email, etc...
      // await Share.open(options)
      //   .then(res => {
      //     console.log(res);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     console.log(err.message, err.code);
      //   });

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
        backgroundColor={Colors.VIOLET_BUTTON}
        translucent={false}
      />
      <SafeAreaView style={styles.topSafeAreaContainer} />
      <SafeAreaView style={styles.bottomSafeAreaContainer}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[Colors.VIOLET_BUTTON, Colors.VIOLET_BUTTON_DARK]}
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
                icon={exportIcon}
                onPress={onShare}
              />

              <AwesomeAlert
                show={showConfirmationAlert}
                showProgress={false}
                customView={AlertView()}
                confirmButtonColor='#DD6B55'
                onDismiss={hideAlert}
              />
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Theme>
  );
};
function AlertView() {
  const { t } = useTranslation();

  return (
    <View style={styles.alertBox}>
      <Text style={styles.alertTitle}>{t('share.alertTitle')}</Text>

      <Text style={styles.alertItems}>{t('share.alertFirstItem')}</Text>

      {/* <Button
        title="Enviar"
        color={Colors.VIOLET_BUTTON}
        style={styles.sendButton}
        // onPress={sendLocalizations}
      /> */}

      <TouchableHighlight
        style={styles.sendButton}
        // onPress={sendLocalizations}
        underlayColor='#fff'>
        <Text style={styles.sendButtonText}>Enviar</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container covers the entire screen
  alertBox: {
    // width: '100%'
  },

  alertTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'normal',
    fontFamily: fontFamily.primaryMedium,
    marginBottom: 15,
    color: Colors.MONO_DARK,
  },

  alertItems: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'normal',
    fontFamily: fontFamily.primaryMedium,
    marginBottom: 15,
    color: Colors.MONO_DARK,
  },

  sendButton: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.VIOLET_BUTTON,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
  sendButtonText: {
    color: Colors.WHITE,
    textAlign: 'center',
  },

  topSafeAreaContainer: {
    flex: 0,
    backgroundColor: Colors.VIOLET_BUTTON,
  },
  bottomSafeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.VIOLET_BUTTON_DARK,
  },
  // headerContainer: {
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   height: 55,
  //   justifyContent: 'flex-end',
  //   paddingHorizontal: 26,
  // },
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

ExportScreen.propTypes = {
  shareButtonDisabled: PropTypes.bool,
};

ExportScreen.defaultProps = {
  shareButtonDisabled: true,
};
