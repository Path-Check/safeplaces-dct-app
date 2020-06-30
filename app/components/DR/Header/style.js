import { Dimensions, StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../../../constants/colors';
import fontFamily from '../../../constants/fonts';

const screenH = Dimensions.get('screen').height;
const windowH = Dimensions.get('window').height;
const androidBottom = screenH - windowH;
const textFontSize = wp('4%');

const styles = StyleSheet.create({
  bottomMargin: {
    marginBottom: screenH - windowH > 0 ? androidBottom - 20 : 0,
  },
  bottomLine: {
    width: 30,
    borderBottomColor: Colors.PINK,
    borderBottomWidth: 2,
  },
  heartBeat: {
    flexDirection: 'row',
  },
  tester: {
    flexDirection: 'row',
  },
  actualSituationContainer: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginVertical: hp('2%'),
  },
  buttons: {
    alignSelf: 'center',
    borderRadius: 25,
    backgroundColor: Colors.BLUE_RIBBON,
    justifyContent: 'center',
    height: 38,
    marginLeft: 6,
    minWidth: wp('27%'),
  },
  radioButtonLayout: {
    display: 'flex',
    flexDirection: 'row',
    width: wp('88%'),
    justifyContent: 'flex-start',
    paddingTop: 10,
    marginLeft: -5,
  },
  rectButtons: {
    alignSelf: 'center',
    borderRadius: 3,
    justifyContent: 'center',
    minHeight: hp('5%'),
    marginLeft: 8,
    marginBottom: 8,
    minWidth: wp('33%'),
  },
  buttonText: {
    alignSelf: 'center',
    color: Colors.WHITE,
    fontSize: wp('3.8%'),
    textTransform: 'capitalize',
  },
  bigCards: {
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: hp('2%'),
    padding: wp('5%'),
    width: wp('91%'),
  },
  dataText: {
    color: Colors.PINK,
    fontSize: wp('8%'),
  },
  calendarButton: {
    width: wp('40%'),
    backgroundColor: Colors.LIGHT_BLUE,
  },
  formContainer: {
    marginHorizontal: wp('5%'),
    marginBottom: 40,
  },
  header: {
    backgroundColor: Colors.BLUE_RIBBON,
    height: hp('12%'),
    position: 'absolute',
    width: wp('100%'),
  },
  HeaderView: {
    height: hp('12%'),
    justifyContent: 'flex-end',
    marginLeft: wp('2%'),
  },
  headerText: {
    fontSize: textFontSize + 8,
    color: Colors.WHITE,
    marginBottom: hp('1.5%'),
  },
  infoCards: {
    alignItems: 'center',
    borderRadius: 6,
    height: wp('35%'),
    justifyContent: 'center',
    width: wp('44%'),
  },
  instructionsImage: {
    position: 'absolute',
    height: hp('65%'),
    width: wp('100%'),
  },
  instructionView: {
    display: 'flex',
    flex: 1,
    height: hp('100%'),
    flexDirection: 'column',
  },
  instructionsContainer: {
    display: 'flex',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    backgroundColor: Colors.BLUE_RIBBON,
    width: wp('100%'),
    height: hp('46.5%'),
    justifyContent: 'flex-start',
  },
  instructionsContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionsTitle: {
    margin: hp('1.5%'),
    color: Colors.WHITE,
    fontSize: textFontSize + 6,
  },
  instructionsText: {
    textAlign: 'center',
    color: Colors.WHITE,
    fontSize: textFontSize + 1,
    margin: hp('2%'),
    width: wp('75%'),
  },
  inputs: {
    height: 38,
    borderBottomColor: Colors.BLUE_RIBBON,
    borderBottomWidth: 0.3,
    margin: 4,
  },
  image: {
    backgroundColor: Colors.WHITE,
    borderRadius: 50,
    height: 50,
    width: 50,
  },
  mainHeader: {
    backgroundColor: Colors.BLUE_RIBBON,
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
    backgroundColor: Colors.BACKGROUND,
  },
  subtitles: {
    alignSelf: 'flex-start',
    marginTop: 15,
    marginBottom: 5,
    fontFamily: fontFamily.primarySemiBold,
  },
  hints: {
    fontSize: textFontSize - 6,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    marginTop: hp('2.5%'),
    marginBottom: hp('1.5%'),
    marginHorizontal: wp('8%'),
    justifyContent: 'flex-end',
  },
  stepIndicator: {
    width: 10,
    marginHorizontal: 6,
    height: 10,
    borderRadius: 5,
  },
  text: {
    color: Colors.BLACK,
    fontSize: textFontSize - 2,
  },
  textSemiBold: {
    fontSize: textFontSize - 1,
    fontFamily: fontFamily.primarySemiBold,
  },
  textBold: {
    fontSize: textFontSize + 1,
    marginTop: 15,
    marginBottom: 5,
    fontFamily: fontFamily.primaryBold,
  },
  textHeader: {
    fontSize: textFontSize + 2,
  },
  toggle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('35%'),
    height: hp('5%'),
    backgroundColor: Colors.LIGHT_BLUE,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.LIGHT_BLUE,
    margin: wp('2%'),
  },
  toggleOn: {
    backgroundColor: '#D8EAFE',
    width: wp('30%'),
    borderColor: Colors.BLUE_RIBBON,
    borderWidth: 2,
  },
  toggleOff: {
    backgroundColor: '#f0f0f0',
    width: wp('30%'),
  },
  userDataCard: {
    alignItems: 'center',
    marginBottom: 7,
    paddingHorizontal: 30,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
  },
  wizardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  wizardActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fcfcfc',
  },
  wizard: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginLeft: 22,
    marginRight: 22,
    flex: 1,
  },
});

export default styles;
