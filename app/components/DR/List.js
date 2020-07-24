import * as React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';

import fontFamily from '../../constants/fonts';

export default function DataList({
  data = [],
  styleTitle = {},
  styleDescription = {},
  styleDate = {},
  titleLinesNum = 1,
  navigation: { navigate },
  switchScreenTo,
}) {
  if (data.length === 0) return <ActivityIndicator size='large' />;

  return (
    <>
      {data.map(
        (
          {
            url = '#',
            icon: { iconName, color },
            title = '',
            dateLabel = '',
            content = '',
          },
          index,
        ) => (
          <TouchableOpacity
            onPress={() =>
              navigate('Details', {
                switchScreenTo,
                source: { uri: url },
              })
            }
            key={String(index)}
            style={styles.itemContainer}>
            <Icon
              name={iconName}
              size={30}
              color={color}
              style={{ marginLeft: 10 }}
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
    width: wp('70%'),
    paddingHorizontal: 10,
  },
});
