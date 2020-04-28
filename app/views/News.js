import React, { Component } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import { WebView } from 'react-native-webview';

import languages from './../locales/languages';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';
import Colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import { AUTHORITY_NEWS } from '../constants/storage';
import { GetStoreData } from '../helpers/General';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const DEFAULT_NEWS_SITE_URL = 'https://covidsafepaths.org/in-app-news';

class NewsScreen extends Component {
  constructor(props) {
    super(props);
    let default_news = {
      name: languages.t('label.default_news_site_name'),
      news_url: DEFAULT_NEWS_SITE_URL,
    };
    this.state = {
      visible: true,
      default_news: default_news,
      newsUrls: [default_news, default_news],
      current_page: 0,
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  hideSpinner() {
    this.setState({
      visible: false,
    });
  }

  renderItem = item => {
    return (
      <View style={styles.singleNews}>
        <View style={styles.singleNewsHead}>
          <Typography style={styles.singleNewsHeadText}>
            {item.item.name}
          </Typography>
        </View>
        <WebView
          source={{
            uri: item.item.news_url,
          }}
          containerStyle={{
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
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

    GetStoreData(AUTHORITY_NEWS)
      .then(nameNewsString => {
        // Bring in news from the various authorities.  This is
        // pulled down from the web when you subscribe to an Authority
        // on the Settings page.
        let arr = [];

        // Populate with subscribed news sources, with default at the tail
        if (nameNewsString !== null) {
          arr = JSON.parse(nameNewsString);
        }
        arr.push(this.state.default_news);

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
    // console.log('News URL -', this.state.newsUrls);
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[Colors.VIOLET_BUTTON, Colors.VIOLET_BUTTON_DARK]}
        style={{ flex: 1, height: '100%' }}>
        <NavigationBarWrapper
          title={languages.t('label.latest_news')}
          onBackPress={this.backToMain.bind(this)}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={[Colors.VIOLET_BUTTON, Colors.VIOLET_BUTTON_DARK]}
            style={{ flex: 1, height: '100%' }}>
            <View
              style={{
                backgroundColor: Colors.VIOLET_BUTTON_DARK,
                flex: 1,
                paddingVertical: 16,
              }}>
              <Carousel
                data={this.state.newsUrls}
                renderItem={this.renderItem}
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
          </LinearGradient>
        </NavigationBarWrapper>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  singleNews: {
    flexGrow: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    alignSelf: 'center',
    width: '100%',
  },
  singleNewsHead: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    marginBottom: 0,
  },
  singleNewsHeadText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 5,
    fontFamily: fontFamily.primarySemiBold,
  },
});

export default NewsScreen;
