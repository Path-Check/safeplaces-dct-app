import { Button, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import imgBulletins from '../../../assets/images/bulletins.jpg';
import HeaderImage from '../../../components/DR/ActionCards/HeaderImage';
import List from '../../../components/DR/List';
import Colors from '../../../constants/colors-dr';
import { FIREBASE_SERVICE } from '../../../constants/DR/baseUrls';
import buttonStyle from '../../../constants/DR/buttonStyles';
import fetch from '../../../helpers/Fetch';

const BULLETINS_URL = `${FIREBASE_SERVICE}/bulletins`;
export default function BulletinsScreen({ navigation }) {
  const [bulletins, setBulletins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [isNotLastPage, setIsNotLastPage] = useState(true);
  const { t } = useTranslation();

  const handleBackPress = () => {
    navigation.goBack();
    return true;
  };

  const addImgToBulletin = bulletinList => {
    return bulletinList.map(item => ({
      ...item,
      icon: { iconName: 'copy', color: Colors.BLUE_RIBBON },
    }));
  };

  const onPress = () => {
    const { order } = bulletins[bulletins.length - 1] || {};
    if (!order || order <= 10) {
      setIsNotLastPage(false);
      setIsDisable(true);
    }
    setIsLoading(true);
    fetch(`${BULLETINS_URL}?endAt=${order - 1}`)
      .then(({ data }) => {
        const bulletinsData = addImgToBulletin(data.bulletins);
        setBulletins(bulletins.concat(bulletinsData));
        setIsLoading(false);
      })
      .catch(() => {
        setBulletins([]);
      });
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    fetch(BULLETINS_URL)
      .then(({ data }) => {
        const bulletinsData = addImgToBulletin(data.bulletins);
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
        <View style={styles.containerPagination}>
          {isNotLastPage && isLoading ? (
            <ActivityIndicator size='large' />
          ) : (
            <Button
              disabled={isDisable}
              style={
                isDisable
                  ? { display: 'none' }
                  : { ...buttonStyle.buttonStyle, marginLeft: 0 }
              }
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
