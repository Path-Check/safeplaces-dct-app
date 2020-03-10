import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Linking,
  View,
  Text
} from 'react-native';

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
                    <Text style={styles.headerTitle}>Safe Paths</Text>
                </View>

                <View style={styles.topView}>
                    <View style={styles.intro} >
                        <View style={ {flex: 1}}>

                            <Text style={styles.sectionDescription, { textAlign: 'justify', paddingTop: 15 , fontSize: 16, paddingBottom: 15 }}>
                                    SafePaths can run in the background to record your location once a minute.  
                                    This location data kept on your phone, no location information is uploaded
                                    or shared with anyone.</Text>
                        </View>

                        <View style={styles.sectionContainer, {flex: 1, padding: 10, }}>
                            <Button
                                title="Start Recording Location"
                                onPress={() => this.willParticipate()} />
                            <Text style={styles.sectionNote, { textAlign: 'center', paddingTop: 15 , paddingBottom: 15 }}>
                                NOTE: After clicking this button you may also be prompted to grant this application access.</Text>

                        </View>
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
        alignItems: 'stretch',
        backgroundColor: '#FFF8ED',
    },
    headerTitle: {
        textAlign: 'center', 
        fontWeight: "bold", 
        fontSize: 24, 
        padding: 15
    },
    topView: {
        flex: 3,
        padding: 10,
    },
    footer: {
        textAlign: 'center',
        color: 'black',
        fontSize: 12,
        fontWeight: '600',
        padding: 4, 
        paddingBottom: 10
    },
    intro: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    sectionContainer: {
      margin: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: 'black',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: 'black',
    },
    sectionNote: {
      fontSize: 12,
    },
    highlight: {
      fontWeight: '700',
    },
  });

export default Welcome;
