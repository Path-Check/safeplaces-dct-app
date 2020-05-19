import React, { useContext } from 'react';
import {
  Image, View, StyleSheet, TouchableOpacity, Linking,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'native-base';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import context from './reduces/context';
import { formatDate } from '../utils/requestManage';

export default function News() {
  const [globaState] = useContext(context);
  const { bulletins } = globaState;
  const isBulletin = (bulletins.length > 0);
  const lastBulletin = bulletins[0] || {};
  const {
    redirection = '',
    right: { title = '', date = '' } = {},
  } = lastBulletin;

  return (
    <>
      {isBulletin ? (
        <View style={{ width: wp('90%'), marginTop: hp('3%') }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }} />
          <TouchableOpacity onPress={() => Linking.openURL(redirection)}>
            <View>
              <Image
                style={styles.image}
                source={require('../assets/images/bulletins.jpg')}
              />
              <View
                style={[
                  styles.image,
                  {
                    backgroundColor: 'rgba(54, 54, 54, 0.1)',
                    justifyContent: 'flex-end',
                    position: 'absolute',
                  },
                ]}
              >
                <Text style={styles.date}>
                  {title}
                  {'\n'}
                  {formatDate(date)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ) : (<ActivityIndicator size="large" />)}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: wp('90%'),
  },

  subtitles: {
    alignSelf: 'flex-start',
    fontFamily: 'OpenSans-SemiBold',
  },

  date: {
    paddingLeft: 10,
    fontFamily: 'OpenSans-Regular',
    color: '#000',
    backgroundColor: '#ffffff5e',
  },
});
