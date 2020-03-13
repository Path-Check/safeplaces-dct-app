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

class ImportScreen extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

        /*BackgroundGeolocation.on('location', (location) => {


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

        // you can also just start without checking for status
        // BackgroundGeolocation.start();*/
    }

    componentWillUnmount() {
        // unregister all event listeners
        BackgroundGeolocation.removeAllListeners();
    }

    render() {
        return (
            <>
            <View style={styles.main}>
                <View style={styles.headerTitle}>
                        <Text style={styles.sectionDescription, {fontSize: 22, marginTop: 8}}>Import Data:</Text>
                </View>
                <View style={styles.subHeaderTitle}>
                        <Text style={styles.sectionDescription, {fontSize: 18, marginTop: 8}}>Rolling out soon</Text>
                </View>
                <View style={styles.web}>
                    <WebView
                        source= {{ uri: 'http://privatekit.mit.edu' }}
                        style= {{ marginTop: 15, marginLeft: 15}}
                    />
                </View>
            </View>
            <View style={styles.footer}>
                <Text style={styles.sectionDescription, { textAlign: 'center', paddingTop: 15 }}>For more information visit the Private Kit hompage:</Text>
                <Text style={styles.sectionDescription, { color: 'blue', textAlign: 'center' }} onPress={() => Linking.openURL('https://privatekit.mit.edu')}>privatekit.mit.edu</Text>
            </View>
        </>
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
    web: {
        flex: 1,
        width: "95%"
    },
    main: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: "95%"
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
export default ImportScreen;
