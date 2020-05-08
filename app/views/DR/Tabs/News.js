import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';

import DataList from '../../../components/List';
import NavigationBarWrapper from '../../../components/NavigationBarWrapper';
import fetch from '../../../helpers/Fetch';
import languages from '../../../locales/languages';

export default function NewsScreen({ navigation }) {
  const [news, setNews] = useState([]);

  const backToMain = () => {
    navigation.goBack();
  };

  const handleBackPress = () => {
    backToMain();
    return true;
  };

  useEffect(async () => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    const data = await fetch(
      'https://covid-dr.appspot.com/news',
    ).then(response => response.json());
    setNews(data.news);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  return (
    <NavigationBarWrapper
      title={languages.t('label.latest_news')}
      onBackPress={backToMain.bind(this)}>
      <View style={styles.constainer}>
        <ScrollView>
          <DataList data={news} />
        </ScrollView>
      </View>
    </NavigationBarWrapper>
  );
}

const styles = StyleSheet.create({
  constainer: {
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
