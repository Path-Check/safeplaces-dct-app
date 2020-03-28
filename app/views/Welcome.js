import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Linking, View, Text } from 'react-native';

import colors from '../constants/colors';
import Button from '../components/Button';

import { GetStoreData, SetStoreData } from '../helpers/General';

class Welcome extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    GetStoreData('PARTICIPATE')
      .then(isParticipating => {
        console.log(isParticipating);
        if (isParticipating == 'true') {
          this.props.navigation.navigate('LocationTrackingScreen', {});
        }
      })
      .catch(error => console.log(error));
  }

  componentWillUnmount() {}

  willParticipate() {
    SetStoreData('PARTICIPATE', 'true').then(() =>
      this.props.navigation.navigate('LocationTrackingScreen', {}),
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.main}>
          <View style={styles.topView}>
            <View style={styles.intro}>
              <Text style={styles.headerTitle}>Private Kit</Text>

              <Text style={styles.sectionDescription}>
                Private Kit is your personal vault that nobody else can access.
              </Text>
              <Text style={styles.sectionDescription}>
                It will allow you to log your location privately every five
                minutes. Your location information will NOT leave your phone.
              </Text>
            </View>
          </View>

          <View style={styles.block}>
            <Button
              title='Start Logging Location'
              onPress={() => this.willParticipate()}
            />
            <Text style={{ padding: 25, justifyContent: 'center' }}>
              NOTE: After clicking this button you may be prompted to grant
              Private Kit access to your location.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text
            style={
              (styles.sectionDescription,
              { textAlign: 'center', paddingTop: 15 })
            }>
            For more information visit the Private Kit hompage:
          </Text>
          <Text
            style={
              (styles.sectionDescription,
              { color: 'blue', textAlign: 'center' })
            }
            onPress={() => Linking.openURL('https://privatekit.mit.edu')}>
            privatekit.mit.edu
          </Text>
        </View>
      </SafeAreaView>
    );
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
    fontWeight: 'bold',
    fontSize: 38,
    padding: 15,
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  block: {
    margin: 20,
    width: '100%',
  },
  topView: {
    flex: 1,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingBottom: 10,
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
    marginRight: 10,
  },
});

export default Welcome;
