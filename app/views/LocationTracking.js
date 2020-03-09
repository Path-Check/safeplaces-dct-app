import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Linking,
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
        notificationText: 'TripleBlind is checking your path with others.',
        debug: false,
        startOnBoot: false,
        stopOnTerminate: true,
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        interval: 20000,
        fastestInterval: 10000,
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
            id: 49
            mockLocationsEnabled: false
            altitude: 0
            longitude: -122.15541
            latitude: 37.415455
            time: 1583448706000
            provider: "fused"
            isFromMockProvider: false
            speed: 0
            accuracy: 20
            locationProvider: 1
            */
            console.log(location)
            GetStoreData('LOCATION_DATA')
            .then(locationArray => {
              // Adjust this to store an array of user locations information
              // SetStoreData('LOCATION_DATA', null);
                // if(locationArray != 'null') {
                //   var locationData = locationArray;
                //   locationData.push(location);
                // } else {
                //   var locationData = [];
                // }

                SetStoreData('LOCATION_DATA', location);
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
            Actions.sendLocation(stationaryLocation);
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
            <SafeAreaView style={styles.container} >
                    <View>
                      <Text style={styles.sectionDescription, {fontSize: 18, marginLeft: 5, marginTop: 10}}>Latest News:</Text>
                    </View>
                    <View style={styles.containerWebview } >
                        <WebView
                            source={{ uri: 'https://safepaths.mit.edu' }}
                            style={{ margin : 10 }}
                        />
                    </View>
                    <View style={{padding: 10}}>
                        <Text style={styles.sectionDescription, { textAlign: 'center', paddingBottom: 10}}>SafePaths is recording your location once a minute.</Text>
                        <View>
                          <Button title={"Stop Recording Location"} onPress={() => this.optOut()} />
                        </View>
                        <Text style={styles.sectionDescription, { textAlign: 'center', paddingTop: 15 }}>For more information visit the SafePaths hompage:</Text>
                        <Text style={styles.sectionDescription, { color: 'blue', textAlign: 'center', paddingTop: 5 }} onPress={() => Linking.openURL('https://safepaths.mit.edu')}>safepaths.mit.edu</Text>
                    </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#FFF8ED',
    },
    containerWebview: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#FFF8ED',
    },
    scrollView: {
        padding: 10,
        height: '100%',
        flex: 1,
    },
    engine: {
      position: 'absolute',
      right: 0,
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
