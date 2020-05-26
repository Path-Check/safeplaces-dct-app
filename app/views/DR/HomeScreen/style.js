import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../../../constants/colors';

const textFontSize = wp('4%');

const styles = StyleSheet.create({
  actualSituationContainer: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: Colors.PINK,
    fontSize: wp('8%'),
  },
  HeaderView: {
    height: hp('12%'),
    justifyContent: 'flex-end',
    paddingRight: wp('2%'),
    paddingLeft: wp('2%'),
    backgroundColor: Colors.BLUE_RIBBON,
  },
  headerText: {
    width: '100%',
    fontSize: textFontSize + 10,
    color: Colors.WHITE,
    marginBottom: hp('1.5%'),
    marginHorizontal: wp('5%'),
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
    backgroundColor: Colors.BLUE_RIBBON,
    borderBottomEndRadius: 13,
    borderBottomStartRadius: 13,
    paddingTop: 10,
    marginBottom: '-5%',
    height: hp('16%'),
    width: wp('100%'),
  },
  rowAndCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '2%',
    marginHorizontal: wp('5%'),
  },
  scrollContainer: {
    backgroundColor: Colors.LIGHT_GRAY,
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
    top: 25,
    marginTop: '5%',
    marginRight: '7%',
    alignSelf: 'flex-end',
  },
});

export default styles;
