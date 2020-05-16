import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';

import imgBulletins from '../../assets/images/bulletins.jpg';
import HeaderImage from '../../components/HeaderImage';
import List from '../../components/List';
import NavigationBarWrapper from '../../components/NavigationBarWrapper';
import fetch from '../../helpers/Fetch';
import languages from '../../locales/languages';

const BULLETINS_URL = 'https://covid-dr.appspot.com/bulletins';

export default function BulletinsScreen({ navigation }) {
  const [bulletins, setBulletins] = useState([]);

  const backToMain = () => {
    navigation.goBack();
  };

  const handleBackPress = () => {
    backToMain();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    fetch(BULLETINS_URL)
      .then(({ data }) => {
        setBulletins(data.bulletins);
      })
      .catch(() => {
        setBulletins([]);
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
        <HeaderImage imgUrl={imgBulletins} title='Bulletins' />
        <ScrollView>
          <List
            data={bulletins}
            navigation={navigation}
            switchScreenTo='PDFView'
          />
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
