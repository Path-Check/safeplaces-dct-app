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
  ScrollView,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';

import { GetStoreData } from '../helpers/General';
import colors from '../constants/colors';
import { WebView } from 'react-native-webview';
import backArrow from './../assets/images/backArrow.png';
import languages from './../locales/languages';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class NewsScreen extends Component {
  constructor(props) {
    super(props);
    let default_news = {
      name: 'Safe Paths News', // TODO: translate
      url: 'https://privatekit.mit.edu/views', // TODO: New
    };
    this.state = {
      visible: true,
      default_news: default_news,
      newsUrls: [default_news, default_news],
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

  _renderItem = item => {
    console.log('Item', item);
    return (
      <View style={styles.singleNews}>
        <View style={styles.singleNewsHead}>
          <Text style={styles.singleNewsHeadText}>{item.item.name}</Text>
        </View>
        <WebView
          source={{
            uri: item.item.url,
          }}
          containerStyle={{
            borderRadius: 12,
          }}
          cacheEnabled
          onLoad={() =>
            this.setState({
              visible: false,
            })
          }
        />
      </View>
    );
  };
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
        arr.push({
          name: 'Haiti',
          url: 'https://wmcelroy.wixsite.com/covidhaiti/kat',
        });
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
    console.log('News URL -', this.state.newsUrls);
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

        <View
          style={{ backgroundColor: '#3A4CD7', flex: 1, paddingVertical: 24 }}>
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={this.state.newsUrls}
            renderItem={this._renderItem}
            sliderWidth={width}
            itemWidth={width * 0.85}
            layout={'default'}
            scrollEnabled
          />

          {this.state.visible && (
            <ActivityIndicator
              style={{
                position: 'absolute',
                top: height / 2,
                left: width / 2,
              }}
              size='large'
              color='black'
            />
          )}
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
  sourceTouchable: {
    marginRight: 20,
    alignItems: 'center',
    width: 180,
    borderRadius: 6,
    backgroundColor: '#3A4CD7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  sourceName: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
  },
  singleNews: {
    flexGrow: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    alignSelf: 'center',
    width: '100%',
  },
  singleNewsHead: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    marginBottom: 24,
  },
  singleNewsHeadText: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
  },
});

export default NewsScreen;
