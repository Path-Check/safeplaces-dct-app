import React from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import {
  View, TouchableOpacity, Text, StyleSheet,
  Image, Linking, ActivityIndicator,
} from 'react-native';

export default function DataList({
  data, styleTitle = {}, styleDescription = {}, styleDate = {},
}) {
  const isData = (data.length > 0);

  return isData ? (
    <>
      {data.map(({
        url = '#', image: { source }, title = '', date = '', content = '',
      }, index) => (
          <TouchableOpacity
            onPress={() => Linking.openURL(url)}
            key={String(index)}
            style={styles.itemContainer}
          >
            <Image style={styles.image} source={source} />
            <View style={styles.right}>
              <Text numberOfLines={1} style={[styles.title, styleTitle]}>{title}</Text>
              {content ? (
                <Text style={[styles.description, styleDescription]} numberOfLines={3}>
                  {content}
                </Text>
              ) : null}
              {date ? (
                <Text style={[styles.date, styleDate]}>
                  {date.toUpperCase()}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ))}
    </>
  ) : (<ActivityIndicator size="large" />);
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: wp('20%'),
    borderRadius: 10,
    maxHeight: 90,
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 5,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    height: wp('15%'),
    width: wp('15%'),
    borderRadius: 8,
  },
  description: {
    fontSize: 11,
    fontFamily: 'OpenSans-Regular',
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
  },
  date: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 10,
    color: '#808080',
  },
  right: {
    width: wp('70%'),
    paddingHorizontal: 10,
  },
});
