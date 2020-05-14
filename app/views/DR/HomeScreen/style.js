import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../../../constants/DR/colors';

const { background, pink, mainBlue } = Colors;
const textFontSize = wp('4%');

const styles = StyleSheet.create({
  actualSituationContainer: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginVertical: hp('2%'),
  },
  radioButtonLayout: {
    display: 'flex',
    flexDirection: 'row',
    width: wp('100%'),
    justifyContent: 'flex-start',
    paddingTop: 10,
    marginLeft: -5,
  },
  dataText: {
    color: pink,
    fontSize: wp('8%'),
  },
  HeaderView: {
    height: hp('12%'),
    justifyContent: 'flex-end',
    marginLeft: wp('2%'),
  },
  headerText: {
    fontSize: textFontSize + 10,
    color: '#fff',
    marginBottom: hp('1.5%'),
  },
  infoCards: {
    alignItems: 'center',
    borderRadius: 6,
    height: wp('35%'),
    justifyContent: 'center',
    width: wp('44%'),
  },
  marginAndAlign: { alignItems: 'center', marginHorizontal: wp('2%') },
  mainHeader: {
    backgroundColor: mainBlue,
    borderBottomEndRadius: 13,
    borderBottomStartRadius: 13,
    height: hp('16%'),
    position: 'absolute',
    width: wp('100%'),
  },
  rowAndCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContainer: {
    backgroundColor: background,
  },
  subtitles: {
    alignSelf: 'flex-start',
  },
  text: {
    color: '#000',
    fontSize: textFontSize - 2,
  },
  textHeader: {
    fontSize: textFontSize + 2,
  },
  settingsContainer: {
    position: 'absolute',
    top: 0,
    marginTop: '14%',
    marginRight: '7%',
    alignSelf: 'flex-end',
  },
});

export default styles;
