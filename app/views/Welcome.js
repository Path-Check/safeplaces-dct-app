import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Linking,
  View,
  Text,
} from 'react-native';

import colors from '../constants/colors';
import Button from '../components/Button';
import languages from '../locales/languages';

import { GetStoreData, SetStoreData } from '../helpers/General';

class Welcome extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    GetStoreData('PARTICIPATE')
      .then((isParticipating) => {
        console.log(isParticipating);
        if (isParticipating == 'true') {
          this.props.navigation.navigate('LocationTrackingScreen', {});
        }
      })
      .catch((error) => console.log(error));
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
            <View
              style={(styles.intro, { textAlign: 'center', paddingTop: 25 })}>
              <Text style={styles.headerTitle}>
                {languages.t('label.private_kit')}
              </Text>
              <Text style={styles.sectionDescription}>
                {languages.t('label.logging_message')}
              </Text>
            </View>
          </View>

          <View style={styles.block}>
            <Button
              title={languages.t('label.start_logging')}
              onPress={() => this.willParticipate()}
            />
            <Text style={{ padding: 5, justifyContent: 'center' }}>
              {languages.t('label.not_logging_message')}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text
            style={
              (styles.sectionDescription,
              { textAlign: 'center', paddingTop: 5 })
            }>
            {languages.t('label.url_info')}{' '}
          </Text>
          <Text
            style={
              (styles.sectionDescription,
              { color: 'blue', textAlign: 'center' })
            }
            onPress={() =>
              Linking.openURL('http://superworld.rise.org.cy/COVID19/')
            }>
            {languages.t('label.private_kit_url')}
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
    margin: 3,
    width: '80%',
  },
  topView: {
    flex: 1,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingBottom: 5,
  },
  intro: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  sectionDescription: {
    fontSize: 18,
    lineHeight: 14,
    fontWeight: '400',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
  },
});

export default Welcome;
