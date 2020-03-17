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
    Image,
    TouchableOpacity
} from 'react-native';

import colors from "../constants/colors";
import WebView from 'react-native-webview';
import Button from "../components/Button";
import backArrow from './../assets/images/backArrow.png'
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
                    <TouchableOpacity style={styles.backArrowTouchable} onPress={() => this.backToMain()}>
                         <Image style={styles.backArrow} source={backArrow} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Import Locations</Text>
                </View>

                <View style={styles.main}>
                    <View style={styles.subHeaderTitle}>
                        <Text style={styles.sectionDescription}>1. Login to your Google Account and Download your Location History</Text>
                        <Text style={styles.sectionDescription}>2. After downloaded, open this screen again. The data will import automatically.</Text>
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
        backgroundColor: colors.WHITE,
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
        height:60,
        borderBottomWidth:1,
        borderBottomColor:'rgba(189, 195, 199,0.6)'
    },
    backArrowTouchable:{
        width:60,
        height:60,
        paddingTop:21,
        paddingLeft:20
    },
    backArrow: {
        height: 18, 
        width: 18.48
    },
    headerTitle:{
        fontSize: 24,
        lineHeight: 24,
        fontFamily:'OpenSans-Bold',
        top:21
    },
    sectionDescription: {
        fontSize: 16,
        lineHeight: 24,
        textAlignVertical: 'center',
        marginTop:12,
        fontFamily:'OpenSans-Regular'
    },

});
export default ImportScreen;