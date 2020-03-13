import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Linking,
  View,
  Text,
  Alert,
  Image,
  Share
} from 'react-native';

import colors from "../constants/colors";
import { WebView } from 'react-native-webview';
import Button from "../components/Button";
import NegButton from "../components/NegButton";
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import {GetStoreData} from '../helpers/General';

class ExportScreen extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }

    onShare = async () => {
        try {
            const locationArray = await GetStoreData('LOCATION_DATA');
            var locationData;

            if (locationArray !== null) {
                locationData = JSON.parse(locationArray);
            } else {
                locationData = [];
            }

            const result = await Share.share({
                message: JSON.stringify(locationData)
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                // shared with activity type of result.activityType
                } else {
                // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    componentWillUnmount() {
        // unregister all event listeners
        BackgroundGeolocation.removeAllListeners();
    }

    render() {
        return (
            <>
                <View style={styles.main}>
                    <View style={styles.headerTitle}>
                      <Text style={styles.sectionDescription, {fontSize: 22, marginTop: 10}}>Export Data</Text>
                    </View>
                    <View style={styles.block}>
                        <Button onPress={this.onShare} title="Share" />
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
    main: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: "95%"
    },
    block: {
      margin: 20,
      width: "75%",
      alignItems: 'center',
      justifyContent: 'center'
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

export default ExportScreen;
