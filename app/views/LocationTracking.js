import React, {
    Component
} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Linking,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView
} from 'react-native';

import colors from "../constants/colors";
import Button from "../components/Button";
import LocationServices from '../services/LocationService';
import exportImage from './../assets/images/export.png';
import news from './../assets/images/newspaper.png';
import web from './../assets/images/www.png';

const width = Dimensions.get('window').width;

class LocationTracking extends Component {
    constructor(props) {
        super(props);
        LocationServices.start();
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

    render() {
        return (
            <SafeAreaView style={styles.container} >

                <ScrollView contentContainerStyle={styles.main}>
                    <View style={styles.topView}>
                        <View style={styles.intro} >

                            <Text style={styles.headerTitle}>Private Kit</Text>

                            <TouchableOpacity style={styles.startLoggingButtonTouchable} >
                                <Text style={styles.startLoggingButtonText}>START LOGGING</Text>
                            </TouchableOpacity>

                            {/* <Text style={styles.sectionDescription}>Private Kit is your personal vault that nobody else can access.</Text> */}
                            {/* <Text style={styles.sectionDescription}>It is currently logging your location privately every five minutes. Your location information will NOT leave your phone.</Text> */}

                        </View>
                    </View>

                    <View style={styles.actionButtonsView}>
                        <TouchableOpacity onPress={() => this.import()}  style={styles.actionButtonsTouchable}>
                            <Image style={styles.actionButtonImage} source={exportImage} resizeMode={'contain'}></Image>
                            <Text style={styles.actionButtonText}>Import</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.export()} style={styles.actionButtonsTouchable}>
                            <Image style={[styles.actionButtonImage,{transform:[{rotate:'180deg'}]}]} source={exportImage} resizeMode={'contain'}></Image>
                            <Text style={styles.actionButtonText}>Export</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.news()} style={styles.actionButtonsTouchable}>
                            <Image style={styles.actionButtonImage} source={news} resizeMode={'contain'}></Image>
                            <Text style={styles.actionButtonText}>News</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.block}>
                        <Button title={"Stop Recording Location"} bgColor={colors.NEG_BUTTON} onPress={() => LocationServices.optOut(this.props.navigation)} />
                    </View>
                    
                </ScrollView>

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
        backgroundColor: colors.WHITE,
    },
    headerTitle: {
        textAlign: 'center',
        fontSize: 38,
        padding: 0,
        fontFamily:'OpenSans-Bold'
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
    },
    startLoggingButtonTouchable:{
        borderRadius: 12,
        backgroundColor: "#665eff",
        height:52,
        alignSelf:'center',
        width:width*.7866,
        marginTop:30,
        justifyContent:'center'
    },
    startLoggingButtonText:{
        fontFamily: "OpenSans-Bold",
        fontSize: 14,
        lineHeight: 19,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff"
    },
    actionButtonsView:{
        width:width*.7866,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    actionButtonsTouchable:{
        height: 76,
        borderRadius: 8,
        backgroundColor: "#454f63",
        width:width*.23,
        justifyContent:'center',
        alignItems:'center'
    },
    actionButtonImage:{
        height:21.6,
        width:32.2
    },
    actionButtonText:{
        opacity: 0.56,
        fontFamily: "OpenSans-Bold",
        fontSize: 12,
        lineHeight: 17,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff",
        marginTop:6
    }
});

export default LocationTracking;