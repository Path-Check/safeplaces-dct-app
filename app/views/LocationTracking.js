import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  Button
} from 'react-native';
import { WebView } from 'react-native-webview';

import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

import {GetStoreData, SetStoreData} from '../helpers/General';

class LocationTracking extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        BackgroundGeolocation.configure({
        desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        stationaryRadius: 50,
        distanceFilter: 50,
        notificationTitle: 'CrossPath Enabled',
        notificationText: 'SafePaths is recording path information on this device.',
        debug: false,
        startOnBoot: false,
        stopOnTerminate: true,
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        interval: 20000,
        fastestInterval: 60000,         // Time (in milliseconds) between location information polls.  E.g. 60000 = 1 minute
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

            GetStoreData('LOCATION_DATA')
            .then(locationArray => {
                var locationData;
                if (locationArray !== null) {
                  locationData = JSON.parse(locationArray);
                } else {
                  locationData = [];
                }

                locationData.push(location);
                SetStoreData('LOCATION_DATA', locationData);
            });

            // to perform long running operation on iOS
            // you need to create background task
            BackgroundGeolocation.startTask(taskKey => {
                // execute long running task
                // eg. ajax post location
                // IMPORTANT: task has to be ended by endTask
                BackgroundGeolocation.endTask(taskKey);
            });
        });

        BackgroundGeolocation.on('stationary', (stationaryLocation) => {
            // handle stationary locations here
            // Actions.sendLocation(stationaryLocation);
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
            Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
                { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
                { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
            ]), 1000);
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

        BackgroundGeolocation.checkStatus(status => {
        console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
        console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
        console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

        // you don't need to check status before start (this is just the example)
        if (!status.isRunning) {
            BackgroundGeolocation.start(); //triggers start on start event
        }
        });

        // you can also just start without checking for status
        // BackgroundGeolocation.start();
    }

    componentWillUnmount() {
        // unregister all event listeners
        BackgroundGeolocation.removeAllListeners();
    }

    optOut() {
      BackgroundGeolocation.removeAllListeners();
      SetStoreData('PARTICIPATE', 'false').then(() =>
        this.props.navigation.navigate('WelcomeScreen', {})
      )
    }

    render() {
        return (
            <>
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <View>
                      <Text style={{fontSize: 25, marginTop: 35, paddingLeft: 35, width: '70%', alignSelf: 'flex-start'}}>Your Exposure Risk:</Text>
                      <Text style={{width: 50, marginTop: -30, marginRight: 15, padding: 10,textAlign: 'center',alignSelf: 'flex-end', backgroundColor: 'green'}}>Low</Text>
                    </View>
                    <View>
                      <Text style={styles.sectionDescription, { textAlign: 'center', paddingTop: 10}}>This app is storing your location roughly every five minutes on your phone and no location data has been uploaded or shared with anyone.</Text>
                      <Text style={styles.sectionDescription, {fontSize: 18, marginLeft: 5, marginTop: 10}}>Latest News:</Text>
                    </View>
                    <WebView
                        source={{ uri: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public' }}
                        style={{ margin
                            : 10, height: 380 }}
                    />
                    <View style={{marginTop:25}}>
                      <Button title={"Opt Out"} onPress={() => this.optOut()} />
                    </View>
                    <Text style={styles.sectionDescription, { textAlign: 'center', paddingTop: 15 }}>Please follow the MIT page below for details</Text>
                    <Text style={styles.sectionDescription, { color: 'blue', textAlign: 'center', paddingTop: 5 }} onPress={() => Linking.openURL('safepaths.mit.edu')}>safepaths.mit.edu</Text>
                </ScrollView>
            </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
    },
    engine: {
      position: 'absolute',
      right: 0,
    },
    body: {
      backgroundColor: 'white',
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: 'black',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: 'black',
    },
    highlight: {
      fontWeight: '700',
    },
    footer: {
      color: 'black',
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
  });

export default LocationTracking;
