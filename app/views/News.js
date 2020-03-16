import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Linking,
  View,
  Text,
  Alert,
} from 'react-native';

import colors from '../constants/colors';
import {WebView} from 'react-native-webview';
import Button from '../components/Button';

class NewsScreen extends Component {
  constructor(props) {
    super(props);
  }

  backToMain() {
    this.props.navigation.navigate('LocationTrackingScreen', {});
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text onPress={() => this.backToMain()} style={styles.backArrow}>
            {' '}
            &#8249;{' '}
          </Text>
          <Text style={styles.sectionDescription}>Latest News</Text>
        </View>
        <WebView
          source={{uri: 'https://privatekit.mit.edu/views'}}
          style={{marginTop: 15}}
        />
      </SafeAreaView>
    );
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
  headerContainer: {
    flexDirection: 'row',
  },
  backArrow: {
    fontSize: 60,
    lineHeight: 60,
    fontWeight: '400',
    marginRight: 5,
    textAlignVertical: 'center',
  },
  sectionDescription: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '800',
    textAlignVertical: 'center',
  },
  web: {
    flex: 1,
    width: '100%',
    margin: 0,
    padding: 0,
  },
});

export default NewsScreen;
