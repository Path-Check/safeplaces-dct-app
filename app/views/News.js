import React, { Component } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  ScrollView,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import languages from './../locales/languages';
import { NavigationBarWrapper, NewsItem } from '../components';
import Colors from '../constants/colors';
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
      isVisible: true,
      default_news: default_news,
      newsUrls: [],
      current_page: 0,
      enabled: true,
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };
  hideSpinner = () => {
    this.setState({
      isVisible: false,
    });
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    GetStoreData(AUTHORITY_NEWS)
      .then((nameNewsString) => {
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
      .catch((error) => console.log(error));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    // console.log(this.state.enabled);
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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ScrollView scrollEnabled={this.state.enabled}>
                {this.state.newsUrls.map((item, index) => (
                  <ScrollView
                    key={index}
                    onTouchStart={() => {
                      this.setState({ enabled: false });
                    }}
                    onTouchEnd={() => {
                      this.setState({ enabled: true });
                    }}
                    style={{ margin: 36 }}>
                    <NewsItem
                      key={index}
                      hideSpinner={this.hideSpinner}
                      item={item}
                      index={index}
                    />
                  </ScrollView>
                ))}
              </ScrollView>

              {this.state.isVisible && (
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

export default NewsScreen;
