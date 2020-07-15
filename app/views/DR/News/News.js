import { Button, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import imgNews from '../../../assets/images/news.jpg';
import HeaderImage from '../../../components/DR/ActionCards/HeaderImage';
import DataList from '../../../components/DR/ActionCards/List';
import { FIREBASE_SERVICE } from '../../../constants/DR/baseUrls';
import buttonStyle from '../../../constants/DR/buttonStyles';
import fetch from '../../../helpers/Fetch';

const NEWS_URL = `${FIREBASE_SERVICE}/news`;

function NewsScreen({ navigation }) {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotLastPage, setIsNotLastPage] = useState(true);

  const onPress = () => {
    const { order } = news[news.length - 1] || {};
    if (!order) {
      setIsNotLastPage(false);
      return;
    }
    setIsLoading(true);
    fetch(`${NEWS_URL}?endAt=${order - 10}`)
      .then(({ data }) => {
        setNews(news.concat(data.news));
        setIsLoading(false);
      })
      .catch(() => {
        setNews([]);
      });
  };

  useEffect(() => {
    fetch(NEWS_URL)
      .then(({ data }) => {
        setNews(data.news);
      })
      .catch(() => {
        setNews([]);
      });
  }, []);

  return (
    <View style={styles.container}>
      <HeaderImage imgUrl={imgNews} title={t('label.news_title')} />
      <ScrollView>
        <DataList
          data={news}
          navigation={navigation}
          switchScreenTo='WebView'
          descriptionLinesNum={2}
          isSponsorsScreen
        />
        <View style={styles.containerPagination}>
          {isNotLastPage && isLoading ? (
            <ActivityIndicator size='large' />
          ) : (
            <Button
              style={{ ...buttonStyle.buttonStyle, marginLeft: 0 }}
              onPress={onPress}>
              <Text style={buttonStyle.buttonText}>
                {t('label.launch_next')}
              </Text>
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
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
});

export default NewsScreen;
