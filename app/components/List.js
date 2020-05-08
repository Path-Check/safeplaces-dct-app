import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import fontFamily from '../constants/fonts';

export default function DataList({
  data = [],
  styleTitle = {},
  styleDescription = {},
  styleDate = {},
  titleLinesNum = 1,
}) {
  const isData = data.length > 0;

  return isData ? (
    <>
      {data.map(
        (
          { url = '#', img, title = '', dateLabel = '', content = '' },
          index,
        ) => (
          <TouchableOpacity
            onPress={() => Linking.openURL(url)}
            key={String(index)}
            style={styles.itemContainer}>
            <Image
              style={styles.image}
              source={{ uri: Object.values(img)[1] }}
            />
            <View style={styles.right}>
              <Text
                numberOfLines={titleLinesNum}
                style={[styles.title, styleTitle]}>
                {title}
              </Text>
              {content ? (
                <Text
                  style={[styles.description, styleDescription]}
                  numberOfLines={3}>
                  {content}
                </Text>
              ) : null}
              {dateLabel ? (
                <Text style={[styles.date, styleDate]}>
                  {dateLabel.toUpperCase()}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ),
      )}
    </>
  ) : (
    <ActivityIndicator size='large' />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: '20%',
    borderRadius: 10,
    maxHeight: 90,
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 5,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '30%',
    borderRadius: 8,
  },
  description: {
    fontSize: 11,
    fontFamily: fontFamily.primaryRegular,
  },
  title: {
    fontFamily: fontFamily.primaryBold,
    fontSize: 14,
  },
  date: {
    fontFamily: fontFamily.primaryRegular,
    fontSize: 10,
    color: '#808080',
  },
  right: {
    width: '70%',
    paddingHorizontal: 10,
  },
});
