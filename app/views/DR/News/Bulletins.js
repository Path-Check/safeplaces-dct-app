import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';

import iconImgBulletin from '../../../assets/images/bulletin.jpg';
import imgBulletins from '../../../assets/images/bulletins.jpg';
import HeaderImage from '../../../components/DR/ActionCards/HeaderImage';
import List from '../../../components/DR/ActionCards/List';
import fetch from '../../../helpers/Fetch';

const BULLETINS_URL = 'https://covid-dr.appspot.com/bulletins';

export default function BulletinsScreen({ navigation }) {
  const [bulletins, setBulletins] = useState([]);
  const { t } = useTranslation();

  const handleBackPress = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    fetch(BULLETINS_URL)
      .then(({ data }) => {
        const bulletinsData = data.bulletins.map(item => ({
          ...item,
          img: { source: iconImgBulletin },
        }));
        setBulletins(bulletinsData);
      })
      .catch(() => {
        setBulletins([]);
      });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  return (
    <View style={styles.container}>
      <HeaderImage imgUrl={imgBulletins} title={t('label.bulletin_title')} />
      <ScrollView>
        <List
          data={bulletins}
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
