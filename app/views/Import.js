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
import NegButton from "../components/NegButton";
import LocationServices from '../services/LocationService';

class ImportScreen extends Component {
    constructor(props) {
        super(props);
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
