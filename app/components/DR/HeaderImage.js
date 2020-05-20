import React from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import placeholder from '../../assets/images/placeholder.png';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';

export default function HeaderImage({ imgUrl, title }) {
  return (
    <ImageBackground
      loadingIndicatorSource={placeholder}
      resizeMode='cover'
      resizeMethod='scale'
      style={styles.container}
      source={imgUrl}>
      <LinearGradient
        style={styles.gradient}
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}>
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  title: {
    fontFamily: fontFamily.primaryBold,
    color: Colors.WHITE,
    fontSize: 17,
    padding: 20,
  },
  gradient: {
    justifyContent: 'flex-end',
    flex: 1,
    resizeMode: 'cover',
  },
});
