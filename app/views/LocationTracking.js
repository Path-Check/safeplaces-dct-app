import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Linking, View, Text} from 'react-native';

import colors from '../constants/colors';
import Button from '../components/Button';
import LocationServices from '../services/LocationService';

class LocationTracking extends Component {
  constructor(props) {
    super(props);
    LocationServices.start();
  }

  export() {
    this.props.navigation.navigate('ExportScreen', {});
  }

  import() {
    this.props.navigation.navigate('ImportScreen', {});
  }

  news() {
    this.props.navigation.navigate('NewsScreen', {});
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
                It is currently logging your location privately every five
                minutes. Your location information will NOT leave your phone.
              </Text>
            </View>
          </View>

          <View style={styles.block}>
            <Button
              title={'Stop Recording Location'}
              bgColor={colors.NEG_BUTTON}
              onPress={() => LocationServices.optOut(this.props.navigation)}
            />
          </View>

          <View style={styles.block}>
            <Button
              title={'News'}
              bgColor={colors.POS_BUTTON}
              onPress={() => this.news()}
            />
          </View>

          <View style={styles.block}>
            <Button
              title={'Import'}
              bgColor={colors.SENS_BUTTON}
              onPress={() => this.import()}
            />
          </View>

          <View style={styles.block}>
            <Button
              title={'Export'}
              bgColor={colors.SENS_BUTTON}
              onPress={() => this.export()}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text
            style={
              (styles.sectionDescription, {textAlign: 'center', paddingTop: 15})
            }>
            For more information visit the Private Kit hompage:
          </Text>
          <Text
            style={
              (styles.sectionDescription, {color: 'blue', textAlign: 'center'})
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
    padding: 0,
  },
  subHeaderTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    padding: 5,
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

export default LocationTracking;
