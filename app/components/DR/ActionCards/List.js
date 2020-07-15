import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import fontFamily from '../../../constants/fonts';

export default function DataList({
  data = [],
  styleTitle = {},
  styleDescription = {},
  styleDate = {},
  titleLinesNum = 1,
  descriptionLinesNum = 3,
  navigation: { navigate },
  switchScreenTo,
  isSponsorsScreen,
}) {
  const cropsName = [
    '120x67',
    '120x80',
    '120x86',
    '250x141',
    '250x167',
    '250x179',
  ];
  const getImageCrop = (img, crops) => {
    if (img.source) return img.source;

    const firstCropFound = crops.find(cropName => img[cropName]);
    return firstCropFound ? { uri: img[firstCropFound] } : { uri: img.master };
  };

  if (data.length === 0) return <ActivityIndicator size='large' />;

  return (
    <>
      {data.map(
        (
          { url = '#', img, title = '', dateLabel = '', content = '' },
          index,
        ) => (
          <TouchableOpacity
            onPress={() =>
              navigate('Details', {
                switchScreenTo,
                source: { uri: url },
                isSponsorsScreen,
              })
            }
            key={String(index)}
            style={styles.itemContainer}>
            <Image style={styles.image} source={getImageCrop(img, cropsName)} />
            <View style={styles.right}>
              <Text
                numberOfLines={titleLinesNum}
                style={[styles.title, styleTitle]}>
                {title}
              </Text>
              {content ? (
                <Text
                  style={[styles.description, styleDescription]}
                  numberOfLines={descriptionLinesNum}>
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
  );
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
    fontSize: 12,
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
    width: wp('70%'),
    paddingHorizontal: 10,
  },
});
