import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import imgNews from '../../../assets/images/news.jpg';
import Button from '../../../components/Button';
import HeaderImage from '../../../components/HeaderImage';
import DataList from '../../../components/List';
import NavigationBarWrapper from '../../../components/NavigationBarWrapper';
import fetch from '../../../helpers/Fetch';
import languages from '../../../locales/languages';

const NEWS_URL = 'https://covid-dr.appspot.com/news';

export default function NewsScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotLastPage, setIsNotLastPage] = useState(true);

  const backToMain = () => {
    navigation.goBack();
  };

  const handleBackPress = () => {
    backToMain();
    return true;
  };

  const onPress = () => {
    const { order } = news[news.length - 1] || {};
    if (!order) {
      setIsNotLastPage(false);
      return;
    }
    setIsLoading(true);
    fetch(`${NEWS_URL}?endAt=${order - 10}`)
      .then(({ data }) => {
        console.log(data.news[0]);
        setNews(news.concat(data.news));
        setIsLoading(false);
      })
      .catch(() => {
        setNews([]);
      });
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    fetch(NEWS_URL)
      .then(({ data }) => {
        setNews(data.news);
      })
      .catch(() => {
        setNews([]);
      });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  return (
    <NavigationBarWrapper
      title={languages.t('label.latest_news')}
      onBackPress={backToMain.bind(this)}>
      <View style={styles.container}>
        <ScrollView>
          <HeaderImage imgUrl={imgNews} title='News' />
          <DataList
            data={news}
            navigation={navigation}
            switchScreenTo='WebView'
          />
          <View style={styles.containerPagination}>
            {isNotLastPage && isLoading ? (
              <ActivityIndicator size='large' />
            ) : (
              <Button
                onPress={onPress}
                title={languages.t('label.launch_next')}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </NavigationBarWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  containerPagination: {
    alignItems: 'center',
    padding: 20,
  },

  showMoreContainer: {
    backgroundColor: '#3f51b5a6',
    borderRadius: 5,
  },

  showMoreText: {
    color: 'white',
    fontSize: 12,
    padding: 35,
    paddingBottom: 12,
    paddingTop: 12,
    textTransform: 'uppercase',
  },
});
