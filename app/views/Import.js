import React, {
    Component
} from 'react';
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
import WebView from 'react-native-webview';
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

    backToMain() {
        this.props.navigation.navigate('LocationTrackingScreen', {})
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text onPress={() => this.backToMain()} style={styles.backArrow}> &#8249; </Text>
                    <Text style={styles.sectionDescription}>Import Locations</Text>
                </View>

                <View style={styles.main}>
                    <View style={styles.subHeaderTitle}>
                        <Text style={styles.sectionDescription, { fontSize: 18, marginTop: 8 }}>Rolling out soon</Text>
                    </View>
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
        width: "95%"
    },

    headerContainer: {
        flexDirection: 'row',
    },
    backArrow: {
        fontSize: 60,
        lineHeight: 60,
        fontWeight: '400',
        marginRight: 5,
        textAlignVertical: 'center'
    },
    sectionDescription: {
        fontSize: 24,
        lineHeight: 24,
        fontWeight: '800',
        textAlignVertical: 'center'
    },

});
export default ImportScreen;