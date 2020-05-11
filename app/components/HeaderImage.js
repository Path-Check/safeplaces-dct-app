import React from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import placeholder from '../assets/images/placeholder.png';
import Colors from '../constants/colors';
import fontFamily from '../constants/fonts';

export default function HeaderImage({ imgUrl, title }) {
  return (
    <ImageBackground
      loadingIndicatorSource={placeholder}
      style={styles.container}
      source={imgUrl}>
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}>
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    height: 'auto',
  },
  description: {
    fontSize: 11,
    color: Colors.WHITE,
    fontFamily: fontFamily.primaryRegular,
  },
  title: {
    fontFamily: fontFamily.primaryBold,
    color: Colors.WHITE,
    fontSize: 17,
  },
  gradient: {
    justifyContent: 'flex-end',
    padding: 20,
    flex: 1,
    resizeMode: 'cover',
  },
});
