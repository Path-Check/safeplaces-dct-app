import PushNotification from 'react-native-push-notification';
import RNFetchBlob from 'rn-fetch-blob';

import { AUTHORITIES_LIST_URL } from '../constants/authorities';
import { MEPYD_C5I_SERVICE } from '../constants/DR/baseUrls';
import {
  AUTHORITY_SOURCE_SETTINGS,
  ENABLE_HCA_AUTO_SUBSCRIPTION,
} from '../constants/storage';
import { GetStoreData, SetStoreData } from '../helpers/General';
import languages from '../locales/languages';
import { LocationData } from './LocationService';

/**
 * Singleton class to interact with health care authority data
 */
class HCAService {
  /**
   * Fetches the raw YAML file containing a list of all
   * of the registered Health Care Authorities.
   * Saves the response as a cached file for performance.
   * @returns {void}
   */
  async fetchAuthoritiesYaml() {
    //THis is to get the file from remote server but we curently got it local with yamlContent
    return await RNFetchBlob.config({
      fileCache: true,
    }).wrap('GET', AUTHORITIES_LIST_URL);
  }

  offsetLocation(location, offset) {
    if (!location) return location;
    //Position, decimal degrees
    const lat = location.latitude;
    const lon = location.longitude;

    //Earth’s radius, sphere
    const R = 6378137;

    //offsets in meters
    const dn = offset;
    const de = offset;

    //Coordinate offsets in radians
    const dLat = dn / R;
    const dLon = de / (R * Math.cos((Math.PI * lat) / 180));

    //OffsetPosition, decimal degrees
    const latO = lat + (dLat * 180) / Math.PI;
    const lonO = lon + (dLon * 180) / Math.PI;

    location.latitude = latO;
    location.longitude = lonO;
    return location;
  }

  /**
   * Fetches the list of all registed Health Care Authorities
   * @returns {Array} List of health care authorities from the global registry
   */
  async getAuthoritiesList() {
    let authorities = [];
    let mostNorthEastPoint = null;
    let mostSouthWestPoint = null;

    try {
      const locations = await new LocationData().getLocationData();

      if (Array.isArray(locations) && locations.length > 0) {
        for (let index = locations.length - 1; index > 0; index--) {
          let dateOffset = 24 * 60 * 60 * 1000; //1 day
          let yesterdayEnd = new Date();
          yesterdayEnd.setTime(yesterdayEnd.getTime() - dateOffset);

          const location = locations[index];
          if (location.time - yesterdayEnd.getTime() > 0) {
            //is on todays date
            if (mostNorthEastPoint === null && mostSouthWestPoint === null) {
              mostNorthEastPoint = location;
              mostSouthWestPoint = location;
            }
            if (
              mostNorthEastPoint.latitude < location.latitude ||
              mostNorthEastPoint.longitude < location.longitude
            ) {
              mostNorthEastPoint = location;
            }
            if (
              mostSouthWestPoint.latitude > location.latitude ||
              mostSouthWestPoint.longitude > location.longitude
            ) {
              mostSouthWestPoint = location;
            }
          } else {
            break;
          }
        }
      }
    } catch (error) {
      console.log('[Error] ' + error);
    }

    this.offsetLocation(mostNorthEastPoint, 100); //Add +100m to area covered by user
    this.offsetLocation(mostSouthWestPoint, 100);

    const baseUrl = `${MEPYD_C5I_SERVICE}/contact_tracing/api/Contact`;
    const url =
      mostNorthEastPoint && mostSouthWestPoint
        ? `${baseUrl}?NE=${mostNorthEastPoint.latitude},${mostNorthEastPoint.longitude}&SW=${mostSouthWestPoint.latitude},${mostSouthWestPoint.longitude}`
        : baseUrl;

    const authoritiesJson = {
      Authorities: [
        {
          'Ministerio de Salud Publica': [
            {
              url: url,
            },
            {
              bounds: {
                ne: {
                  latitude: 20.365051,
                  longitude: -67.795684,
                },
                sw: {
                  latitude: 16.99877,
                  longitude: -72.17912,
                },
              },
            },
          ],
        },
      ],
    };

    authorities = authoritiesJson.Authorities;
    return authorities;
  }

  /**
   * Get the list of Health Care Authorities that a user has saved
   * @returns {Array} List of health care authorities from storage
   */
  async getUserAuthorityList() {
    return await GetStoreData(AUTHORITY_SOURCE_SETTINGS, false);
  }

  /**
   * Takes an array of one or more authorities and adds it to the list
   * in storage that the user is subscribed to.
   * @param {newAuthorities} Array healthcare authoritiy objects
   * @returns void
   */
  async appendToAuthorityList(newAuthorities) {
    const authorities = (await this.getUserAuthorityList()) || [];
    await SetStoreData(AUTHORITY_SOURCE_SETTINGS, [
      ...authorities,
      ...newAuthorities,
    ]);
  }

  /**
   * Checks if a user has saved any Health Care Authorities
   *
   * @returns {boolean}
   */
  async hasSavedAuthorities() {
    const authorities = await this.getUserAuthorityList();
    return authorities && authorities.length > 0;
  }

  /**
   * Alerts a user that there are new Healthcare Authorities in their region.
   * Includes information on the number of Authorities in their current location.
   *
   * @param {count} number new authorities
   * @returns {void}
   */
  async pushAlertNewAuthoritesFromLoc(count) {
    await PushNotification.localNotification({
      title: languages.t('label.authorities_new_in_area_title', { count }),
      message: languages.t('label.authorities_new_in_area_msg', { count }),
    });
  }

  /**
   * Alerts a user that they have been subscribed to new Healthcare Authorities
   * in their region. Includes information on the number of Authorities in
   * their current location.
   *
   * @param {count} number new authorities
   * @returns {void}
   */
  async pushAlertNewSubscribedAuthorities(count) {
    await PushNotification.localNotification({
      title: languages.t('label.authorities_new_subscription_title', { count }),
      message: languages.t('label.authorities_new_subscription_msg', { count }),
    });
  }

  /**
   * Returns the `url` value for an authority
   * @param Authority Healthcare Authority object
   * @returns {string}
   */
  getAuthorityUrl(authority) {
    const authorityName = Object.keys(authority)[0];
    const urlKey = authority[authorityName][0];
    return urlKey && urlKey['url'];
  }

  /**
   * Returns the `bounds` value for an authority
   * @param {authority} Authority Healthcare Authority object
   * @returns {{bounds: {ne: {latitude: number, longitude: number}}, {sw: {latitude: number, longitude: number}}}}
   */
  getAuthorityBounds(authority) {
    const authorityName = Object.keys(authority)[0];
    const boundsKey = authority[authorityName][1];
    return boundsKey && boundsKey['bounds'];
  }

  /**
   * Checks if a given point is inside the bounds of the given authority
   * @param {point} Object contains a `latitude` and `longitude` field
   * @param {authority} Authority Healthcare Authority object
   * @returns {boolean}
   */
  isPointInAuthorityBounds(point, authority) {
    const locHelper = new LocationData();
    const bounds = this.getAuthorityBounds(authority);
    let result = bounds && locHelper.isPointInBoundingBox(point, bounds); //This passes is true on my phone not on simulator makes sense because of the location
    return result;
  }

  /**
   * Iterates over the full list of authorities and checks
   * if there is any GPS point in the user's full 28-day location history
   * that is within the bounds of the authority.
   *
   * @returns {[{authority_name: [{url: string}, {bounds: Object}]}]} List of health care authorities
   */
  async getAuthoritiesFromUserLocHistory() {
    const locData = await new LocationData().getLocationData();
    const authorities = await this.getAuthoritiesList();

    return authorities.filter(authority =>
      locData.some(point => this.isPointInAuthorityBounds(point, authority)),
    );
  }

  /**
   * Gets the most recent location of the user and returns a list of
   * all Healthcare Authorities whose bounds contain the user's current location,
   * filtering out any Authorities the user has already subscribed to.
   *
   * @returns {[{authority_name: [{url: string}, {bounds: Object}]}]} list of Healthcare Authorities
   */
  async getNewAuthoritiesInUserLoc() {
    const mostRecentUserLoc = await new LocationData().getMostRecentUserLoc(); //Nice I needed this nice nice
    const authoritiesList = await this.getAuthoritiesList(); //This is were we are not getting any new authorities Why does the button doesnt work :( )
    const userAuthorities = await this.getUserAuthorityList();

    return authoritiesList.filter(
      authority =>
        this.isPointInAuthorityBounds(mostRecentUserLoc, authority) &&
        (!Array.isArray(userAuthorities) ||
          !userAuthorities.length ||
          !userAuthorities.some(
            elem => JSON.stringify(authority) === JSON.stringify(elem),
          )),
    );
  }

  /**
   * Subscribes a user to the provided list of authorities
   * @param {newAuthorities} Array array of healthcare authorities
   * @returns {void}
   */
  async pushAlertNewSubscriptions(newAuthorities) {
    await this.appendToAuthorityList(newAuthorities);
    await this.pushAlertNewSubscribedAuthorities(newAuthorities.length);
  }

  /**
   * Prompt a user to add a Health Authority if they are in the bounds
   * of a healthcare authority that they have not yet subscribed to.
   *
   * This will trigger a push notification.
   *
   * @returns {void}
   */
  async findNewAuthorities() {
    const newAuthorities = await this.getNewAuthoritiesInUserLoc();
    if (newAuthorities.length > 0) {
      if (this.isAutosubscriptionEnabled()) {
        await this.pushAlertNewSubscriptions(newAuthorities);
      } else {
        await this.pushAlertNewAuthoritesFromLoc(newAuthorities.length);
      }
    }
  }

  /**
   * Checks if the user has explicitly approved or denied the auto subscribe
   * feature. When pulling from async storage, if the key has not yet been set,
   * the value will be null.
   *
   * @returns {boolean}
   */
  async hasUserSetSubscription() {
    const permission = await GetStoreData(ENABLE_HCA_AUTO_SUBSCRIPTION, true);

    if (permission === null) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Check if the user has opted in to auto subscribe to new Healthcare
   * Authorities in their area.
   *
   * @returns {boolean}
   */
  async isAutosubscriptionEnabled() {
    return (await GetStoreData(ENABLE_HCA_AUTO_SUBSCRIPTION, true)) === 'true';
  }

  /**
   * Enable auto subscription to new Healthcare Authorities in the user's area.
   * @returns {void}
   */
  async enableAutoSubscription() {
    await SetStoreData(ENABLE_HCA_AUTO_SUBSCRIPTION, true);
  }

  /**
   * Disable auto subscription to new Healthcare Authorities in the user's area.
   * @returns {void}
   */
  async disableAutoSubscription() {
    await SetStoreData(ENABLE_HCA_AUTO_SUBSCRIPTION, false);
  }
}

const singleton = new HCAService();

export { singleton as HCAService };
