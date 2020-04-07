import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import colors from '../constants/colors';
import { WebView } from 'react-native-webview';
import Button from '../components/Button';
import backArrow from './../assets/images/backArrow.png';
import languages from './../locales/languages';
import NetInfo from '@react-native-community/netinfo';

class NewsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { iscached: true};
  }

  backToMain() {
    this.props.navigation.navigate('LocationTrackingScreen', {});
  }

  handleBackPress = () => {
    this.props.navigation.navigate('LocationTrackingScreen', {});
    return true;
  };
  handleConnectionInfoChange  = ()=>
  {
    NetInfo.fetch().then(state => {
      if(!state.isConnected)
        this.setState({iscached:true})
    });

  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.handleConnectionInfoChange()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backArrowTouchable}
            onPress={() => this.backToMain()}>
            <Image style={styles.backArrow} source={backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {languages.t('label.latest_news')}
          </Text>
        </View>

        <WebView
            cacheEnabled={this.state.iscached}
          source={{ uri: 'https://privatekit.mit.edu/views' }}
          style={{ marginTop: 15 }}
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
    backgroundColor: colors.WHITE,
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
  headerContainer: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(189, 195, 199,0.6)',
    alignItems: 'center',
  },
  backArrowTouchable: {
    width: 60,
    height: 60,
    paddingTop: 21,
    paddingLeft: 20,
  },
  backArrow: {
    height: 18,
    width: 18.48,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'center',
    marginTop: 12,
    fontFamily: 'OpenSans-Regular',
  },
});

export default NewsScreen;
