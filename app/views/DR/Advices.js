import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';

// import iconAdvertisement from '../../assets/images/idea.jpg';
import imgAdvertisement from '../../assets/images/recommendations.jpg';
import HeaderImage from '../../components/HeaderImage';
import List from '../../components/List';
import NavigationBarWrapper from '../../components/NavigationBarWrapper';
import fetch from '../../helpers/Fetch';
import languages from '../../locales/languages';

const BULLETINS_URL = 'https://covid-dr.appspot.com/bulletins';

export default function Advices({ navigation }) {
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
        <HeaderImage
          imgUrl={imgAdvertisement}
          title={languages.t('label.advice_title')}
        />
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
});
