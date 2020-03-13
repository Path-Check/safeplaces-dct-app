import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Linking,
  View,
  Text,
  Alert
} from 'react-native';

import colors from "../constants/colors";
import { WebView } from 'react-native-webview';
import Button from "../components/Button";
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
        notificationTitle: 'PrivateKit Enabled',
        notificationText: 'PrivateKit is recording path information on this device.',
        debug: false,
        startOnBoot: false,
        stopOnTerminate: true,
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        interval: 20000,
        fastestInterval: 60000*5,         // Time (in milliseconds) between location information polls.  E.g. 60000*5 = 5 minutes
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

    export() {
        this.props.navigation.navigate('ExportScreen', {})
    }

    import() {
        this.props.navigation.navigate('ImportScreen', {})
    }

    news() {
        this.props.navigation.navigate('NewsScreen', {})
    }

    optOut() {
      BackgroundGeolocation.removeAllListeners();
      SetStoreData('PARTICIPATE', 'false').then(() =>
        this.props.navigation.navigate('WelcomeScreen', {})
      )
    }

/*
                        <View>
                      <Text style={styles.sectionDescription, {fontSize: 18, marginLeft: 5, marginTop: 10}}>Latest News:</Text>
                    </View>

                    <View style={styles.containerWebview } >
                        <WebView
                            source={{ uri: 'https://privatekit.mit.edu' }}
                            style={{  }}
                        />
                    </View>
*/

    render() {
        return (
            <SafeAreaView style={styles.container} >

                <View style={styles.main}>
                    <View style={styles.topView}>
                        <View style={styles.intro} >

                            <Text style={styles.headerTitle}>Private Kit</Text>
                            <Text style={styles.subHeaderTitle}>(Active)</Text>

                            <Text style={styles.sectionDescription}>Private Kit is your personal vault that nobody else can access.</Text>
                            <Text style={styles.sectionDescription}>It is currently logging your location privately every five minutes. Your location information will NOT leave your phone.</Text>

                        </View>
                    </View>

                    <View style={styles.block}>
                        <Button title={"Stop Recording Location"} bgColor={colors.NEG_BUTTON} onPress={() => this.optOut()} />
                    </View>

                    <View style={styles.block}>
                        <Button title={"News"} bgColor={colors.POS_BUTTON} onPress={() => this.news()} />
                    </View>

                    <View style={styles.block}>
                        <Button title={"Import"} bgColor={colors.SENS_BUTTON} onPress={() => this.import()} />
                    </View>

                    <View style={styles.block}>
                        <Button title={"Export"} bgColor={colors.SENS_BUTTON} onPress={() => this.export()} />
                    </View>

                </View>

                <View style={styles.footer}>
                    <Text style={styles.sectionDescription, { textAlign: 'center', paddingTop: 15 }}>For more information visit the Private Kit hompage:</Text>
                    <Text style={styles.sectionDescription, { color: 'blue', textAlign: 'center' }} onPress={() => Linking.openURL('https://privatekit.mit.edu')}>privatekit.mit.edu</Text>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    // Container covers the entire screen
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.PRIMARY_TEXT,
        backgroundColor: colors.APP_BACKGROUND,
    },
    headerTitle: {
        textAlign: 'center',
        fontWeight: "bold",
        fontSize: 38,
        padding: 0
    },
    subHeaderTitle: {
        textAlign: 'center',
        fontWeight: "bold",
        fontSize: 22,
        padding: 5
    },
    main: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: "80%"
    },
    block: {
      margin: 20,
      width: "100%"
    },
    topView: {
        flex: 1,
    },
    footer: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingBottom: 10
    },
    intro: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    sectionDescription: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '400',
      marginTop: 20,
      marginLeft: 10,
      marginRight: 10
    }
  });

export default LocationTracking;
