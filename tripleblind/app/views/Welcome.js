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
                            <Text style={styles.sectionContainer, { textAlign: 'center', paddingTop: 15 }}>Safe Passage</Text>
                            <Text style={styles.sectionDescription, { textAlign: 'center', paddingTop: 15 }}>This application will automatically remember your path.  Periodically it will encrpyt and upload your path information.  Then, compare it to the paths of known infections.  If your path crosses with anyone who reports sick, you will be promptly notified.</Text>
                            <Text style={styles.sectionDescription, { textAlign: 'center', paddingTop: 15 }}>Using it is easy, just click the "I Want to Participate" button below.  That's all you need to do, we do the hard work in the background.</Text>
                            <Text style={styles.sectionDescription, { textAlign: 'center', paddingTop: 15, paddingBottom: 15}}>Please, share this application with friends and family.  Working together we can keep everyone safe.</Text>
                            <Button
                                title="I Want to Participate!"
                                onPress={() => this.willParticipate()} />
                            <Text style={styles.sectionDescription, { textAlign: 'center', paddingTop: 15 }}>Brought to you by TripleBlind and the Massachusetts Institute of Technology - MIT</Text>
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