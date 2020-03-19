import {
    GetStoreData,
    SetStoreData
} from '../helpers/General';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { Alert } from 'react-native';

var instanceCount = 0;
var lastPointCount = 0;


function saveLocation(location) {
    // Persist this location data in our local storage of time/lat/lon values

    GetStoreData('LOCATION_DATA')
        .then(locationArrayString => {

            var locationArray;
            if (locationArrayString !== null) {
                locationArray = JSON.parse(locationArrayString);
            } else {
                locationArray = [];
            }

            // Always work in UTC, not the local time in the locationData
            var nowUTC = new Date().toISOString();
            var unixtimeUTC = Date.parse(nowUTC);
            var unixtimeUTC_28daysAgo = unixtimeUTC - (60 * 60 * 24 * 1000 * 28);

            // Curate the list of points, only keep the last 28 days
            var curated = [];
            for (var i = 0; i < locationArray.length; i++) {
                if (locationArray[i]["time"] > unixtimeUTC_28daysAgo) {
                    curated.push(locationArray[i]);
                }
            }

            // Save the location using the current lat-lon and the
            // calculated UTC time (maybe a few milliseconds off from
            // when the GPS data was collected, but that's unimportant
            // for what we are doing.)
            lastPointCount = locationArray.length;
            console.log('[GPS] Saving point:', lastPointCount)
            var lat_lon_time = {
                "latitude": location["latitude"],
                "longitude": location["longitude"],
                "time": unixtimeUTC
            };
            curated.push(lat_lon_time);

            SetStoreData('LOCATION_DATA', curated);
        });
}


export default class LocationServices {
    static start() {
        instanceCount += 1
        if (instanceCount > 1) {
            BackgroundGeolocation.start();
            return;
        }

        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 50,
            distanceFilter: 50,
            notificationTitle: 'Private Kit Enabled',
            notificationText: 'Private Kit is securely storing your GPS coordinates once every five minutes on this device.',
            debug: false,    // when true, it beeps every time a loc is read
            startOnBoot: false,
            stopOnTerminate: false,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,

            // DEBUG: Use these to get a faster output
                /*interval: 2000,
                fastestInterval: 2000, // Time (in milliseconds) between location information polls.  E.g. 60000*5 = 5 minutes
                activitiesInterval: 2000,*/

            interval: 20000,
            fastestInterval: 60000 * 5, // Time (in milliseconds) between location information polls.  E.g. 60000*5 = 5 minutes
            activitiesInterval: 20000,

            stopOnStillActivity: false,
            postTemplate: {
                lat: '@latitude',
                lon: '@longitude',
                foo: 'bar' // you can also add your own properties
            }
        });

        BackgroundGeolocation.on('location', (location) => {
            // handle your locations here
            /* SAMPLE OF LOCATION DATA OBJECT
                {
                  "accuracy": 20, "altitude": 5, "id": 114, "isFromMockProvider": false,
                  "latitude": 37.4219983, "locationProvider": 1, "longitude": -122.084,
                  "mockLocationsEnabled": false, "provider": "fused", "speed": 0,
                  "time": 1583696413000
                }
            */
            // to perform long running operation on iOS
            // you need to create background task
            BackgroundGeolocation.startTask(taskKey => {
                // execute long running task
                // eg. ajax post location
                // IMPORTANT: task has to be ended by endTask
                saveLocation(location);
                BackgroundGeolocation.endTask(taskKey);
            });
        });

        if (Platform.OS === 'android') {
            // This feature only is present on Android.
            BackgroundGeolocation.headlessTask(async (event) => {
                // Application was shutdown, but the headless mechanism allows us
                // to capture events in the background.  (On Android, at least)
                if (event.name === 'location' || event.name === 'stationary') {
                    saveLocation(event.params);
                }
            });
        }

        BackgroundGeolocation.on('stationary', (stationaryLocation) => {
            // handle stationary locations here
            // Actions.sendLocation(stationaryLocation);
            BackgroundGeolocation.startTask(taskKey => {
                // execute long running task
                // eg. ajax post location
                // IMPORTANT: task has to be ended by endTask

                // For capturing stationaryLocation. Note that it hasn't been
                // tested as I couldn't produce stationaryLocation callback in emulator
                // but since the plugin documentation mentions it, no reason to keep
                // it empty I believe.
                saveLocation(stationaryLocation);
                BackgroundGeolocation.endTask(taskKey);
            });
            console.log('[INFO] stationaryLocation:', stationaryLocation);
        });

        BackgroundGeolocation.on('error', (error) => {
            console.log('[ERROR] BackgroundGeolocation error:', error);
        });

        BackgroundGeolocation.on('start', () => {
            console.log('[INFO] BackgroundGeolocation service has been started');
        });

        BackgroundGeolocation.on('stop', () => {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
        });

        BackgroundGeolocation.on('authorization', (status) => {
            console.log('[INFO] BackgroundGeolocation authorization status: ' + status);

            if (status !== BackgroundGeolocation.AUTHORIZED) {
                // we need to set delay or otherwise alert may not be shown
                setTimeout(() =>
                    Alert.alert('Private Kit requires access to location information', 'Would you like to open app settings?', [{
                        text: 'Yes',
                        onPress: () => BackgroundGeolocation.showAppSettings()
                    },
                    {
                        text: 'No',
                        onPress: () => console.log('No Pressed'),
                        style: 'cancel'
                    }
                    ]), 1000);
            }
            else {
                BackgroundGeolocation.start(); //triggers start on start event

                // TODO: We reach this point on Android when location services are toggled off/on.
                //       When this fires, check if they are off and show a Notification in the tray
            }
        });

        BackgroundGeolocation.on('background', () => {
            console.log('[INFO] App is in background');
        });

        BackgroundGeolocation.on('foreground', () => {
            console.log('[INFO] App is in foreground');
        });

        BackgroundGeolocation.on('abort_requested', () => {
            console.log('[INFO] Server responded with 285 Updates Not Required');
            // Here we can decide whether we want stop the updates or not.
            // If you've configured the server to return 285, then it means the server does not require further update.
            // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
            // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
        });

        BackgroundGeolocation.on('http_authorization', () => {
            console.log('[INFO] App needs to authorize the http requests');
        });

        BackgroundGeolocation.on('stop', () => {
            // PUSH LOCAL NOTIFICATION HERE WARNING LOCATION HAS BEEN TERMINATED
            console.log('[INFO] stop');
        });

        BackgroundGeolocation.on('stationary', () => {
            // PUSH LOCAL NOTIFICATION HERE WARNING LOCATION HAS BEEN TERMINATED
            console.log('[INFO] stationary');
        });

        BackgroundGeolocation.checkStatus(status => {
            console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
            console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
            console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

            BackgroundGeolocation.start(); //triggers start on start event

            if (!status.locationServicesEnabled) {
                // we need to set delay or otherwise alert may not be shown
                setTimeout(() =>
                    Alert.alert('Private Kit requires location services to be enabled', 'Would you like to open location settings?', [{
                        text: 'Yes',
                        onPress: () => BackgroundGeolocation.showLocationSettings()
                    },
                    {
                        text: 'No',
                        onPress: () => console.log('No Pressed'),
                        style: 'cancel'
                    }
                    ]), 1000);
            }
            else if (!status.authorization) {
                // we need to set delay or otherwise alert may not be shown
                setTimeout(() =>
                    Alert.alert('Private Kit requires access to location information', 'Would you like to open app settings?', [{
                        text: 'Yes',
                        onPress: () => BackgroundGeolocation.showAppSettings()
                    },
                    {
                        text: 'No',
                        onPress: () => console.log('No Pressed'),
                        style: 'cancel'
                    }
                    ]), 1000);
            }
            else if (!status.isRunning) {
            }

        });

        // you can also just start without checking for status
        // BackgroundGeolocation.start();
    }

    static getPointCount() {
        return lastPointCount;
    }

    static stop() {
        // unregister all event listeners
        BackgroundGeolocation.removeAllListeners();
        BackgroundGeolocation.stop();
        instanceCount -= 1;
    }

    static optOut(nav) {
        BackgroundGeolocation.removeAllListeners();
        BackgroundGeolocation.stop();
        SetStoreData('PARTICIPATE', 'false').then(() =>
            nav.navigate('LocationTrackingScreen', {})
        )
    }
}
