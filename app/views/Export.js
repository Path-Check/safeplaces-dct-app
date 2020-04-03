import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import PropTypes from 'prop-types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import colors from '../constants/colors';
import { GetStoreData } from '../helpers/General';
import { timeSincePoint } from '../helpers/convertPointsToString';
import LocationServices, { LocationData } from '../services/LocationService';
import backArrow from './../assets/images/backArrow.png';
import languages from './../locales/languages';

const width = Dimensions.get('window').width;
const base64 = RNFetchBlob.base64;

function ExportScreen({ shareButtonDisabled }) {
  const [pointStats, setPointStats] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(shareButtonDisabled);
  const { navigate } = useNavigation();

  function handleBackPress() {
    navigate('LocationTrackingScreen', {});
    return true;
  }

  useFocusEffect(
    React.useCallback(() => {
      const locationData = new LocationData();
      locationData.getPointStats().then(pointStats => {
        setPointStats(pointStats);
        setButtonDisabled(pointStats.pointCount === 0);
      });
      return () => {};
    }, []),
  );

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return function cleanup() {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  });

  function backToMain() {
    navigate('LocationTrackingScreen', {});
  }

  async function onShare() {
    try {
      let locationData = await new LocationData().getLocationData();
      let nowUTC = new Date().toISOString();
      let unixtimeUTC = Date.parse(nowUTC);

      var options = {};
      var jsonData = JSON.stringify(locationData);
      const title = 'PrivateKit.json';
      const filename = unixtimeUTC + '.json';
      const message = 'Here is my location log from Private Kit.';
      if (Platform.OS === 'ios') {
        var url = RNFS.Bundle + '/' + filename;
        await RNFS.writeFile(url, jsonData, 'utf8')
          .then(success => {
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
      await Share.open(options)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
          console.log(err.message, err.code);
        });
      if (Platform.OS === 'ios') {
        await RNFS.unlink(url);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backArrowTouchable}
          onPress={() => backToMain()}>
          <Image style={styles.backArrow} source={backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{languages.t('label.export')}</Text>
      </View>

      <View style={styles.main}>
        <Text style={styles.sectionDescription}>
          {languages.t('label.export_para_1')}
        </Text>
        <Text style={styles.sectionDescription}>
          {languages.t('label.export_para_2')}
        </Text>
        <TouchableOpacity
          disabled={buttonDisabled}
          onPress={onShare}
          style={[
            styles.buttonTouchable,
            buttonDisabled && styles.buttonDisabled,
          ]}>
          <Text
            style={[
              styles.buttonText,
              buttonDisabled && styles.buttonDisabled,
            ]}>
            {languages.t('label.share')}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.sectionDescription, { marginTop: 36 }]}>
          {languages.t('label.data_covers')}{' '}
          {pointStats ? timeSincePoint(pointStats.firstPoint) : '...'}
        </Text>

        <Text style={[styles.sectionDescription, { marginTop: 15 }]}>
          {languages.t('label.data_count')}{' '}
          {pointStats ? pointStats.pointCount : '...'}
        </Text>

        <Text style={[styles.sectionDescription, { marginTop: 15 }]}>
          {languages.t('label.data_last_updated')}{' '}
          {pointStats ? timeSincePoint(pointStats.lastPoint) : '...'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container covers the entire screen
  container: {
    flex: 1,
    flexDirection: 'column',
    color: colors.PRIMARY_TEXT,
    backgroundColor: colors.WHITE,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 24,
    padding: 0,
    fontFamily: 'OpenSans-Bold',
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
    // alignItems: 'center',
    padding: 20,
    width: '96%',
    alignSelf: 'center',
  },
  buttonTouchable: {
    borderRadius: 12,
    backgroundColor: '#665eff',
    height: 52,
    alignSelf: 'center',
    width: width * 0.7866,
    marginTop: 30,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  mainText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '400',
    textAlignVertical: 'center',
    padding: 20,
  },
  smallText: {
    fontSize: 10,
    lineHeight: 24,
    fontWeight: '400',
    textAlignVertical: 'center',
    padding: 20,
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
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    fontFamily: 'OpenSans-Regular',
  },
});

ExportScreen.propTypes = {
  shareButtonDisabled: PropTypes.bool,
};

ExportScreen.defaultProps = {
  shareButtonDisabled: true,
};

export default ExportScreen;
