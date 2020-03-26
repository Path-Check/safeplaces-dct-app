import { GetStoreData, SetStoreData } from '../helpers/General';

import BackgroundTimer from 'react-native-background-timer';
import UUIDGenerator from 'react-native-uuid-generator';
import Moment from 'moment';

import AndroidBLEAdvertiserModule from 'react-native-ble-advertiser';

var currentUUID = null;

function saveContact(contact) {
  // Persist this contact data in our local storage of time/lat/lon values

  GetStoreData('CONTACT_DATA').then(contactArrayString => {
    var contactArray;
    if (contactArrayString !== null) {
      contactArray = JSON.parse(contactArrayString);
    } else {
      contactArray = [];
    }

    // Always work in UTC, not the local time in the contactData
    var nowUTC = new Date().toISOString();
    var unixtimeUTC = Date.parse(nowUTC);
    var unixtimeUTC_28daysAgo = unixtimeUTC - 60 * 60 * 24 * 1000 * 28;

    // Save the contact using the current lat-lon and the
    // calculated UTC time (maybe a few milliseconds off from
    // when the GPS data was collected, but that's unimportant
    // for what we are doing.)
    console.log('[GPS] Saving point:', contactArray.length);
    var lat_lon_time = {
      uuid: contact['uuid'],
      time: unixtimeUTC,
    };
    contactArray.push(lat_lon_time);

    SetStoreData('CONTACT_DATA', contactArray);
  });
}

function saveMyUUID(me) {
  // Persist this contact data in our local storage of time/lat/lon values

  GetStoreData('MY_UUIDs').then(myUUIDArrayString => {
    var myUUIDArray;
    if (myUUIDArrayString !== null) {
      myUUIDArray = JSON.parse(myUUIDArrayString);
    } else {
      myUUIDArray = [];
    }

    // Always work in UTC, not the local time in the contactData
    var nowUTC = new Date().toISOString();
    var unixtimeUTC = Date.parse(nowUTC);
    var unixtimeUTC_28daysAgo = unixtimeUTC - 60 * 60 * 24 * 1000 * 28;

    var uuid_time = {
      uuid: me['uuid'],
      time: unixtimeUTC,
    };
    console.log(
      '[GPS] Saving myUUID:',
      Moment(unixtimeUTC).format('MMM Do, H:mma'),
      me['uuid'],
      myUUIDArray.length,
    );
    myUUIDArray.push(uuid_time);

    SetStoreData('MY_UUIDs', myUUIDArray);
  });
}

function loadLastUUIDAndBroadcast() {
  GetStoreData('MY_UUIDs').then(myUUIDArrayString => {
    var myUUIDArray;
    if (myUUIDArrayString !== null) {
      myUUIDArray = JSON.parse(myUUIDArrayString);
      console.log(
        'Loading last uuid ',
        myUUIDArray[myUUIDArray.length - 1].uuid,
      );
      currentUUID = myUUIDArray[myUUIDArray.length - 1].uuid;
      broadcast();
    } else {
      generateNewUUIDAndBroadcast();
    }
  });
}

function broadcast() {
  // Do not run on iOS for now.
  if (Platform.OS === 'android') {
    console.log('Broadcasting: ', currentUUID);
    AndroidBLEAdvertiserModule.setCompanyId(0xff);
    AndroidBLEAdvertiserModule.broadcast(currentUUID, [12, 23, 56])
      .then(sucess => {
        console.log('Broadcasting Sucessful', sucess);
      })
      .catch(error => console.log('Broadcasting Error', error));
  }
}

function generateNewUUIDAndBroadcast() {
  UUIDGenerator.getRandomUUID(uuid => {
    currentUUID = uuid;
    saveMyUUID({ uuid: uuid });
    broadcast();
  });
}

export default class BroadcastingServices {
  static start() {
    loadLastUUIDAndBroadcast();

    BackgroundTimer.runBackgroundTimer(() => {
      generateNewUUIDAndBroadcast();
    }, 1000 * 60 * 60); // Every hour, change UUID

    console.log('Starting Bluetooth');
  }

  static stop(nav) {
    console.log('Stopping Bluetooth');
    BackgroundTimer.stopBackgroundTimer();
  }
}
