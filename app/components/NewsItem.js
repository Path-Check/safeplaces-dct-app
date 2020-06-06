import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import fontFamily from '../constants/fonts';
import { Typography } from './Typography';

const height = Dimensions.get('window').height;

export const NewsItem = ({ item, index, hideSpinner }) => {
  return (
    <View key={index} style={styles.singleNews}>
      <View key={index} style={styles.singleNewsHead}>
        <Typography style={styles.singleNewsHeadText}>{item.name}</Typography>
      </View>
      <WebView
        source={{
          uri: item.news_url,
        }}
        nestedScrollEnabled
        containerStyle={styles.containerStyle}
        onLoad={hideSpinner}
        cacheEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  singleNews: {
    flexGrow: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    height: height * 0.8,
  },
  singleNewsHead: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    marginBottom: 0,
  },
  singleNewsHeadText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 5,
    fontFamily: fontFamily.primarySemiBold,
  },
  containerStyle: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});
