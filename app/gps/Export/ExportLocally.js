import React from 'react';
import { NativeModules } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

import { NavigationBarWrapper } from '../../components';
import { isPlatformiOS } from '../../Util';
import ExportTemplate from './ExportTemplate';

const base64 = RNFetchBlob.base64;

// NOTE: for testing data only.
const ExportLocally = ({ navigation }) => {
  const onShare = async () => {
    try {
      let locationData = await NativeModules.SecureStorageManager.getLocations();
      let nowUTC = new Date().toISOString();
      let unixtimeUTC = Date.parse(nowUTC);

      let options = {};
      let jsonData = JSON.stringify(
        locationData.map(({ latitude, longitude, time, hashes }) => ({
          latitude,
          longitude,
          time,
          hashes,
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
  };

  return (
    <NavigationBarWrapper
      onBackPress={() => navigation.goBack()}
      title={'Download Locally (DEV)'}>
      <ExportTemplate
        headline={'Download Locally (DEV)'}
        body={
          'Download your data for testing purposes as a JSON file. Not for production environments.'
        }
        onNext={onShare}
        nextButtonLabel={'Download Locally'}
      />
    </NavigationBarWrapper>
  );
};

export default ExportLocally;
