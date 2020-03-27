import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import Swiper from './ReactNativeSwiper';
import Intro1 from './Intro1';
import Intro2 from './Intro2';
import Intro3 from './Intro3';

const WelcomSlider = props => {
  const swiperRef = React.useRef('');

  const swipe = i => {
    if (swiperRef) swiperRef.current.scrollBy(i);
  };
  return (
    <View style={{ flex: 1 }}>
      <Swiper
        showsButtons={false}
        activeDotColor={'#665EFF'}
        showsPagination={false}
        ref={swiperRef}
        loop={false}>
        <View style={styles.container}>
          <Intro1 navigation={props.navigation} swipe={i => swipe(i)} />
        </View>
        <View style={styles.container}>
          <Intro2 navigation={props.navigation} swipe={i => swipe(i)} />
        </View>
        <View style={styles.container}>
          <Intro3 navigation={props.navigation} swipe={i => swipe(i)} />
        </View>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
export default WelcomSlider;
