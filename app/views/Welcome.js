import React, { Component } from 'react';
import {
  SafeAreaView,
  Button,
  StyleSheet,
  ScrollView,
  View,
  Text
} from 'react-native';

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
            <>
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                        <View>
                            <Text style={styles.sectionContainer, { textAlign: 'center', fontWeight: "bold", fontSize: 24, paddingTop: 15 }}>Safe Paths</Text>
                            <Text style={styles.sectionDescription, { textAlign: 'center', paddingTop: 15 , paddingBottom: 15 }}>This app will store your location roughly every five minutes on your phone and no location data is uploaded or shared with anyone.</Text>
                            <Button
                                title="Authorize Location Permission (Even while not using the app/all the time)"
                                onPress={() => this.willParticipate()} />
                            <Text style={styles.sectionDescription, { textAlign: 'center', paddingTop: 15 }}>Please follow the MIT page below for details</Text>
                            <Text style={styles.sectionDescription, { color: 'blue', textAlign: 'center', paddingTop: 15 }} onPress={() => Linking.openURL('safepaths.mit.edu')}>safepaths.mit.edu</Text>
                        </View>
                </ScrollView>
            </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
    },
    engine: {
      position: 'absolute',
      right: 0,
    },
    body: {
      backgroundColor: 'white',
    },
    sectionContainer: {
      marginTop: 32,
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
    highlight: {
      fontWeight: '700',
    },
    footer: {
      color: 'black',
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
  });

export default Welcome;
