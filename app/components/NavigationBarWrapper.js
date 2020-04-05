import * as React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import backArrow from './../assets/svgs/backArrow';
import fontFamily from '../constants/fonts';
import Colors from '../constants/colors';
import { isPlatformiOS } from './../Util';
import { SvgXml } from 'react-native-svg';

class NavigationBarWrapper extends React.Component {
  render() {
    return (
      <>
        <StatusBar
          barStyle='light-content'
          backgroundColor={Colors.VIOLET}
          translucent={isPlatformiOS()}
        />
        <SafeAreaView style={styles.topSafeAreaContainer} />
        <SafeAreaView style={styles.bottomSafeAreaContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backArrowTouchable}
              onPress={() => this.props.onBackPress()}>
              <SvgXml style={styles.backArrow} xml={backArrow} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{this.props.title}</Text>
          </View>
          {this.props.children}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  topSafeAreaContainer: {
    flex: 0,
    backgroundColor: Colors.VIOLET,
  },
  bottomSafeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.INTRO_WHITE_BG,
  },
  headerContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.NAV_BAR_VIOLET,
    backgroundColor: Colors.VIOLET,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: fontFamily.primaryMedium,
    color: Colors.WHITE,
    position: 'absolute',
    alignSelf: 'center',
    textAlign: 'center',
    width: '100%',
  },
  backArrowTouchable: {
    width: 60,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backArrow: {
    height: 18,
    width: 18,
  },
});

NavigationBarWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  onBackPress: PropTypes.func.isRequired,
};

export default NavigationBarWrapper;
