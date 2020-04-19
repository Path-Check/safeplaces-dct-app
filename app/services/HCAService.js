import Yaml from 'js-yaml';
import { Alert } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import { AUTHORITIES_LIST_URL } from '../constants/authorities';
import { AUTHORITY_SOURCE_SETTINGS } from '../constants/storage';
import { GetStoreData } from '../helpers/General';
import languages from '../locales/languages';
import { LocationData } from './LocationService';

class HCAService {
  /**
   * Fetches the raw YAML file containing a list of all
   * of the registered Health Care Authorities.
   * Saves the response as a cached file for performance.
   * @returns {void}
   */
  async fetchAuthoritiesYaml() {
    return await RNFetchBlob.config({
      // store response data as a file for performance increase
      fileCache: true,
    }).fetch('GET', AUTHORITIES_LIST_URL, {
      //some headers ..
    });
  }

  /**
   * Fetches the list of all registed Health Care Authorities
   * @returns {Array} List of health care authorities from the global registry
   */
  async getAuthoritiesList() {
    let authorities = [];

    try {
      const result = await this.fetchAuthoritiesYaml();
      const list = await RNFetchBlob.fs.readFile(result.path(), 'utf8');
      authorities = Yaml.safeLoad(list).Authorities;
    } catch (err) {
      console.log(err);
    }

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
   * Checks if a user has saved any Health Care Authorities
   *
   * @returns {boolean}
   */
  async hasSavedAuthorities() {
    const authorities = await this.getUserAuthorityList();
    return authorities && authorities.length > 0;
  }

  /**
   * Prompt a user to add a new Health Care Authority. Includes information
   * on the number of Authorities in their current location.
   *
   * Redirects to the 'ChooseProviderScreen' is a user presses 'Yes'.
   *
   * @param {*} navigate - react-navigation function to change the current stack screen
   * @returns {void}
   */
  async alertAddNewAuthorityFromLoc() {
    const authorities = await this.getAuthoritiesInCurrentLoc();
    const numAuthories = authorities.length;

    const title = languages.t('label.authorities_none_saved');
    const msg = languages.t('label.authorities_num_in_area', { numAuthories });

    const noBtn = { text: 'No', style: 'cancel' };
    const yesBtn = {
      text: 'Yes',
      onPress: () => navigate('ChooseProviderScreen', {}), // TODO: Pull in a navigate function
    };

    const btns = [noBtn, yesBtn];

    Alert.alert(title, msg, btns);
  }

  /**
   * Returns the `url` value for an authority
   * @param {*} authority
   * @returns {string}
   */
  getAuthorityUrl(authority) {
    const authorityName = Object.keys(authority)[0];
    const urlKey = authority[authorityName][0];
    return urlKey && urlKey['url'];
  }

  /**
   * Returns the `bounds` value for an authority
   * @param {*} authority
   * @returns {*} Object containing a `bounds` key.
   * A `bounds` contains a `ne` and `sw` object that each
   * have a valid GPS point containing `longitude` and `latitude` keys.
   */
  getAuthorityBoundingBox(authority) {
    const authorityName = Object.keys(authority)[0];
    const boundsKey = authority[authorityName][1];
    return boundsKey && boundsKey['bounds'];
  }

  /**
   * Checks if a given point is inside the bounds of the given authority
   * @param {*} point Object containing a `latitude` and `longitude` field
   * @param {*} authority
   * @returns boolean
   */
  isPointInAuthorityBounds(point, authority) {
    const locHelper = new LocationData();
    const bounds = this.getAuthorityBoundingBox(authority);

    if (bounds) {
      return locHelper.isPointInBoundingBox(point, bounds);
    } else {
      return false;
    }
  }

  /**
   * Iterates over the GPS regions for all Health Care Authorities
   * and returns a list of the authorities whose regions include
   * the current GPS location of the user.
   *
   * @returns {Array} List of health care authorities
   */
  async getAuthoritiesInCurrentLoc() {
    const locHelper = new LocationData();
    const mostRecentUserLoc = await locHelper.getMostRecentUserLoc();
    const authorities = await this.getAuthoritiesList();

    return authorities.filter(authority =>
      this.isPointInAuthorityBounds(mostRecentUserLoc, authority),
    );
  }

  /**
   * Check if the current GPS location for a user is within the
   * GPS bounding box of any Health Care Authorities
   *
   * @returns {boolean}
   */
  async isUserGPSInAuthorityBounds() {
    const locHelper = new LocationData();
    const mostRecentUserLoc = await locHelper.getMostRecentUserLoc();
    const authorities = await this.getAuthoritiesList();

    return authorities.some(authority =>
      this.isPointInAuthorityBounds(mostRecentUserLoc, authority),
    );
  }

  /**
   * Iterates over the full list of authorities and checks
   * if there is any GPS point in the user's full 28-day location history
   * that is within the bounds of the authority.
   *
   * @returns {Array} List of health care authorities
   */
  async getAuthoritiesFromUserLocHistory() {
    const locHelper = new LocationData();
    const locData = await locHelper.getLocationData();
    const authorities = await this.getAuthoritiesList();

    return authorities.filter(authority =>
      locData.some(point => this.isPointInAuthorityBounds(point, authority)),
    );
  }

  /**
   * Prompt a user to add a Health Authority if they
   * 1. Have not saved a single health authority yet
   * 2. Are currently in the GPS bounds of one or more health authorities
   *
   * This alert will redirect a user to the `ChooseProvider` screen.
   */
  async findNewAuthorities() {
    const hasAuthorities = await this.hasSavedAuthorities();
    const isInAuthorityBounds = await this.isUserGPSInAuthorityBounds();

    if (!hasAuthorities && isInAuthorityBounds) {
      this.alertAddNewAuthorityFromLoc();
    }
  }
}

export default new HCAService();
