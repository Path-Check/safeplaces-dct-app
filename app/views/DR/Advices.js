import React, { useEffect } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';

import iconAdvertisement from '../../assets/images/idea.jpg';
import imgAdvertisement from '../../assets/images/recommendations.jpg';
import HeaderImage from '../../components/DR/HeaderImage';
import List from '../../components/DR/List';
import NavigationBarWrapper from '../../components/NavigationBarWrapper';
import data from '../../constants/DR/RecommendationData';
import languages from '../../locales/languages';

export default function Advices({ navigation }) {
  const recommendationData = data.map(item => ({
    ...item,
    img: { source: iconAdvertisement },
  }));
  const backToMain = () => {
    navigation.goBack();
  };

  const handleBackPress = () => {
    backToMain();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

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
            data={recommendationData}
            titleLinesNum={2}
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
