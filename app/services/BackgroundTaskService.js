import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';
import { IntersectSet } from '../helpers/Intersect';
import { GetStoreData, SetStoreData } from '../helpers/General';
import { isPlatformiOS } from './../Util';

const INTERSECT_INTERVAL = 30 / 60; // In Minutes

function executeTask() {
  check_intersect = () => {
    // This function is called once every 12 hours.  It should do several things:

    console.log(
      'Intersect tick entering on ',
      isPlatformiOS() ? 'iOS' : 'Android',
    );
    // this.findNewAuthorities(); NOT IMPLEMENTED YET

    // Get the user's health authorities
    GetStoreData('HEALTH_AUTHORITIES')
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
          return;
        }

        let name_news = [];

        if (authority_list) {
          // Pull down data from all the registered health authorities
          for (let authority of authority_list) {
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
                  if (dayBin !== null) {
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
                console.log('Failed to save authority/news URL list'),
              );
          }
        } else {
          console.log('No authority list');
          return;
        }
      })
      .catch(error => console.log('Failed to load authority list', error));
  };
  check_intersect();
}

export default class BackgroundTaskServices {
  static start() {
    // Configure it.
    console.log('creating background task object');
    executeTask();
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
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
        console.log('[js] RNBackgroundFetch failed to start');
      },
    );
  }

  static stop() {
    BackgroundFetch.stop();
  }
}
