import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import { GetStoreData } from '../helpers/General';
import colors from '../constants/colors';
import { WebView } from 'react-native-webview';
import backArrow from './../assets/images/backArrow.png';
import languages from './../locales/languages';
import Swiper from 'react-native-web-swiper';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class NewsScreen extends Component {
  constructor(props) {
    super(props);
    let default_news = {
      name: 'Safe Paths', // TODO: translate
      url: 'https://privatekit.mit.edu/views', // TODO: New
    };
    this.state = {
      visible: true,
      default_news: default_news,
      newsUrls: [default_news],
      current_page: 0,
    };
  }

  backToMain() {
    this.props.navigation.navigate('LocationTrackingScreen', {});
  }

  handleBackPress = () => {
    this.props.navigation.navigate('LocationTrackingScreen', {});
    return true;
  };

  hideSpinner() {
    this.setState({
      visible: false,
    });
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    GetStoreData('AUTHORITY_NEWS')
      .then(name_news => {
        console.log('name_news:', name_news);

        // Bring in news from the various authorities.  This is
        // pulled down from the web when you subscribe to an Authority
        // on the Settings page.
        let arr = [];

        // TODO: using this as test data for now without assigning
        arr.push({ name: 'Test', url: 'https://gpll.org' });
        arr.push(this.state.default_news);

        console.log('name_news:', arr);
        this.setState({
          newsUrls: arr,
        });
      })
      .catch(error => console.log(error));
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

        <Swiper
          onIndexChanged={index => this.setState({ current_page: index })}>
          {this.state.newsUrls.map(data => (
            <View style={[styles.slideContainer, styles.slide]}>
              <Text>{data.name}</Text>
            </View>
          ))}
        </Swiper>

        <WebView
          source={{
            uri: this.state.newsUrls[this.state.current_page].url,
          }}
          style={{
            marginTop: 15,
          }}
          onLoad={() => this.hideSpinner()}
        />
        {this.state.visible && (
          <ActivityIndicator
            style={{
              position: 'absolute',
              top: height / 2,
              left: width / 2,
            }}
            size='large'
          />
        )}
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
  web: {
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
  slideContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    height: 100,
    backgroundColor: 'rgba(20,20,200,0.3)',
  },
});

export default NewsScreen;
