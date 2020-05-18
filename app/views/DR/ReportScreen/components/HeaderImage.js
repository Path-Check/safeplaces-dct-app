import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import placeholder from '../assets/images/placeholder.png';

export default function HeaderImage({ imgUrl, title }) {
  return (
    <ImageBackground
      loadingIndicatorSource={placeholder}
      resizeMode='cover'
      resizeMethod='scale'
      style={styles.container}
      source={imgUrl}>
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
        style={[
          styles.container,
          styles.gradient,
          {
            flex: 1,
          },
        ]}>
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { width: wp('100%'), height: wp('50%') },
  description: {
    fontSize: 11,
    color: '#fff',
    fontFamily: 'OpenSans-Regular',
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    color: '#fff',
    fontSize: 17,
  },
  gradient: {
    justifyContent: 'flex-end',
    padding: 20,
  },
});
