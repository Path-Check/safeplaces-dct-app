import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import HeaderImage from '../../components/HeaderImage';
import DataList from '../../components/DataList';
import context from '../../components/reduces/context';
import image from '../../assets/images/news.jpg';
import { requestNews } from '../../utils/requestManage';
import { ADD_NEW } from '../../components/reduces/actionTypes';
import { isLoading } from 'expo-font';

export default function NewsScreen({ navigation }) {
  const [{ news }, setGlobaState] = useContext(context);
  const [pagination, setPagination] = useState(2);
  const [isloading, setIsLoading] = useState(false);
  const style = { position: 'relative', top: -5 };

  const onPress = () => {
    setPagination(pagination + 1);
    setIsLoading(true);

    requestNews(pagination, (value, pageFound) => {
      if (pageFound) {
        setGlobaState({ type: ADD_NEW, value });
        setIsLoading(false);
      } else {
        setPagination(pagination + 1 - 1);
        alert('No se ha encontrado mas noticias.');
      }
    });
  };

  return (
    <View style={styles.constainer}>
      <HeaderImage imgUrl={image} title="Noticias" />
      <ScrollView>
        <DataList
          data={news}
          styleTitle={{ ...style, top: 10, paddingBottom: 10 }}
          styleDate={{ ...style, paddingBottom: 3 }}
          styleDescription={style}
          navigation={navigation}
          switchScreenTo={'WebView'}
        />
        <View style={styles.containerPagination}>
          {isloading ? (
            <ActivityIndicator size="large" />
          ) : (
            <TouchableOpacity onPress={onPress}>
              <View style={styles.showMoreContainer}>
                <Text style={styles.showMoreText}>ver mas</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
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
