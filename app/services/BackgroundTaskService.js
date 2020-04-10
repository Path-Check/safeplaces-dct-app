import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';
import { IntersectSet } from '../helpers/Intersect';
import { GetStoreData, SetStoreData } from '../helpers/General';
import { isPlatformiOS } from './../Util';
import languages from '../locales/languages';

const INTERSECT_INTERVAL = 60 * 12; // 12 Hours, the value is received in minutes

function check_intersect() {
  // This function is called once every 12 hours.  It should do several things:

  console.log(
    'Intersect tick entering on',
    isPlatformiOS() ? 'iOS' : 'Android',
  );
  // this.findNewAuthorities(); NOT IMPLEMENTED YET

  // Get the user's health authorities
  GetStoreData('AUTHORITY_SOURCE_SETTINGS')
    .then(authority_list => {
      if (!authority_list) {
        // DEBUG: Force a test list
        // authority_list = [
        //  {
        //    name: 'Platte County Health',
        //    url:
        //      'https://raw.githack.com/tripleblindmarket/safe-places/develop/examples/safe-paths.json',
        //  },
        //];
        console.log('No authorities', authority_list);
        return;
      }

      let name_news = [];
      if (authority_list) {
        // Pull down data from all the registered health authorities
        authority_list = JSON.parse(authority_list);
        for (const authority of authority_list) {
          console.log('[auth]', authority);
          fetch(authority.url)
            .then(response => response.json())
            .then(responseJson => {
              // Example response =
              // { "authority_name":  "Steve's Fake Testing Organization",
              //   "publish_date_utc": "1584924583",
              //   "info_website": "https://www.who.int/emergencies/diseases/novel-coronavirus-2019",
              //   "concern_points":
              //    [
              //      { "time": 123, "latitude": 12.34, "longitude": 12.34},
              //      { "time": 456, "latitude": 12.34, "longitude": 12.34}
              //    ]
              // }

              // Update cache of info about the authority
              // TODO: Add an "info_newsflash" UTC timestamp and popup a
              //       notification if that changes, i.e. if there is a newsflash?
              name_news.push({
                name: responseJson.authority_name,
                news_url: responseJson.info_website,
              });

              // TODO: Look at "publish_date_utc".  We should notify users if
              //       their authority is no longer functioning.)

              IntersectSet(responseJson.concern_points, dayBin => {
                if (dayBin !== null && dayBin.reduce((a, b) => a + b, 0) > 0) {
                  PushNotification.localNotification({
                    title: languages.t('label.push_at_risk_title'),
                    message: languages.t('label.push_at_risk_message'),
                  });
                }
              });
            });

          SetStoreData('AUTHORITY_NEWS', name_news)
            .then(() => {
              // TODO: Anything after this saves?  Background caching of
              //       news to make it snappy?  Could be a problem in some
              //       locales with high data costs.
            })
            .catch(error =>
              console.log('Failed to save authority/news URL list', error),
            );
        }
        let nowUTC = new Date().toISOString();
        let unixtimeUTC = Date.parse(nowUTC);
        // Last checked key is not being used atm. TODO check this to update periodically instead of every foreground activity
        SetStoreData('LAST_CHECKED', unixtimeUTC);
      } else {
        console.log('No authority list');
        return;
      }
    })
    .catch(error => console.log('Failed to load authority list', error));
}

export function executeTask() {
  check_intersect();
}

export default class BackgroundTaskServices {
  static start() {
    // Configure it.
    console.log('creating background task object');
    BackgroundFetch.configure(
      {
        minimumFetchInterval: INTERSECT_INTERVAL,
        // Android options
        forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false, // Default
      },
      async taskId => {
        console.log('[js] Received background-fetch event: ', taskId);
        executeTask();
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.log('[js] RNBackgroundFetch failed to start', error);
      },
    );
  }

  static stop() {
    BackgroundFetch.stop();
  }
}
