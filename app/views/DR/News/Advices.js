import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import iconAdvertisement from '../../../assets/images/idea.jpg';
import imgAdvertisement from '../../../assets/images/recommendations.jpg';
import HeaderImage from '../../../components/DR/HeaderImage';
import List from '../../../components/DR/List';
import data from '../../../constants/DR/RecommendationData';
import languages from '../../../locales/languages';

export default function Advices({ navigation }) {
  const recommendationData = data.map(item => ({
    ...item,
    img: { source: iconAdvertisement },
  }));

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
