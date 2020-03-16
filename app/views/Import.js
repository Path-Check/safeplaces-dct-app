import React, {
    Component
} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Linking,
    View,
    Text
} from 'react-native';

import colors from "../constants/colors";
import WebView from 'react-native-webview';
import Button from "../components/Button";

import {
    SearchAndImport
} from '../helpers/GoogleTakeOutAutoImport';

class ImportScreen extends Component {
    constructor(props) {
        super(props);

        // Autoimports if user has downloaded
        SearchAndImport();
    }

    componentDidMount() {

    }

    componentWillUnmount() { }

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
                        <Text style={styles.sectionDescription, { fontSize: 18, marginTop: 8 }}>1. Login to your Google Account and Download your Location History</Text>
                        <Text style={styles.sectionDescription, { fontSize: 18, marginTop: 8 }}>2. After downloaded, open this screen again. The data will import automatically.</Text>
                    </View>
                    <View style={styles.web}>
                        <WebView
                            source={{ uri: 'https://takeout.google.com/settings/takeout/custom/location_history' }}
                            style={{ marginTop: 15 }}
                        />
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
    web: {
        flex: 1,
        width: "100%"
    },
    main: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        width: "100%"
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