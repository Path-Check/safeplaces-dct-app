import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Linking,
  View,
  Text
} from 'react-native';

import colors from "../constants/colors";
import Button from "../components/Button";

import {GetStoreData, SetStoreData} from '../helpers/General';

class Welcome extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        GetStoreData('PARTICIPATE')
        .then(isParticipating => {
            console.log(isParticipating);
            if(isParticipating == 'true') {
                this.props.navigation.navigate('LocationTrackingScreen', {})
            }
        })
        .catch(error => console.log(error))
    }

    componentWillUnmount() {
    }

    willParticipate() {
        SetStoreData('PARTICIPATE', 'true').then(() =>
            this.props.navigation.navigate('LocationTrackingScreen', {})
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    
                </View>

                <View style={styles.main}>

                    <View style={styles.topView}>
                        <View style={styles.intro} >
                            
                            <Text style={styles.headerTitle}>Safe Paths</Text>

                            <Text style={styles.sectionDescription}> {'\u2022'} SafePaths records your location every 5 minutes.  </Text>
                            <Text style={styles.sectionDescription}> {'\u2022'} Location data is kept on your phone. </Text>
                            <Text style={styles.sectionDescription}> {'\u2022'} No location information is uploaded  or shared with anyone.  </Text>
                                        
                        </View>
                    </View>

                    <View style={styles.block}>
                        <Button title="Accept"
                                onPress={() => this.willParticipate()} />
                    </View>

                </View>

                <View style={styles.footer}>
                    <Text style={styles.sectionDescription, { textAlign: 'center', paddingTop: 15 }}>For more information visit the SafePaths homepage:</Text>
                    <Text style={styles.sectionDescription, { color: 'blue', textAlign: 'center' }} onPress={() => Linking.openURL('https://safepaths.mit.edu')}>safepaths.mit.edu</Text>
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
        padding: 15
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

export default Welcome;
