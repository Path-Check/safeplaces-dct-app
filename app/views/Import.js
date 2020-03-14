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

class ImportScreen extends Component {
    constructor(props) {
        super(props);
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