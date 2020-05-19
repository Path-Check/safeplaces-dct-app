import { Dimensions, StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../../../constants/DR/colors';

const screenH = Dimensions.get('screen').height;
const windowH = Dimensions.get('window').height;
const androidBottom = screenH - windowH;
const { background, pink, mainBlue } = Colors;
const textFontSize = wp('4%');

const styles = StyleSheet.create({
  bottomMargin: {
    marginBottom: screenH - windowH > 0 ? androidBottom - 20 : 0,
  },
  bottomLine: {
    width: 30,
    borderBottomColor: Colors.pink,
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
    color: '#fff',
    fontFamily: 'OpenSans-SemiBold',
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
    color: pink,
    fontSize: wp('8%'),
    fontFamily: 'OpenSans-Bold',
  },
  calendarButton: {
    width: wp('40%'),
    backgroundColor: '#EFF4F9',
  },
  formContainer: {
    marginHorizontal: wp('6%'),
    marginBottom: 40,
  },
  header: {
    backgroundColor: mainBlue,
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
    fontFamily: 'OpenSans-Bold',
    fontSize: textFontSize + 8,
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
    backgroundColor: mainBlue,
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
    color: '#fff',
    fontSize: textFontSize + 6,
    fontFamily: 'OpenSans-SemiBold',
  },
  instructionsText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: textFontSize + 1,
    fontFamily: 'OpenSans-Regular',
    margin: hp('2%'),
    width: wp('75%'),
  },
  inputs: {
    height: 38,
    borderBottomColor: mainBlue,
    borderBottomWidth: 0.3,
    margin: 4,
  },
  image: {
    backgroundColor: '#fff',
    borderRadius: 50,
    height: 50,
    width: 50,
  },
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
    fontFamily: 'OpenSans-SemiBold',
    marginTop: 15,
    marginBottom: 5,
  },
  hints: {
    fontFamily: 'OpenSans-Regular',
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
    color: '#000',
    fontSize: textFontSize - 2,
    fontFamily: 'OpenSans-Regular',
  },
  textSemiBold: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: textFontSize - 1,
  },
  textBold: {
    fontFamily: 'OpenSans-Bold',
    fontSize: textFontSize + 1,
    marginTop: 15,
    marginBottom: 5,
  },
  textHeader: {
    fontFamily: 'OpenSans-Bold',
    fontSize: textFontSize + 2,
  },
  toggle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('35%'),
    height: hp('5%'),
    backgroundColor: '#EFF4F9',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#EFF4F9',
    margin: wp('2%'),
  },
  toggleOn: {
    backgroundColor: '#D8EAFE',
    width: wp('30%'),
    borderColor: mainBlue,
    borderWidth: 2,
  },
  toggleOff: {
    backgroundColor: '#f0f0f0',
    width: wp('30%'),
  },
  userDataCard: {
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
