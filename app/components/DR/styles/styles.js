import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Colors from '../../../constants/DR/colors';

const { background, orange, pink, mainBlue } = Colors;
const textFontSize = wp('4%');

const styles = StyleSheet.create({
  auroraImage: {
    width: wp('7%'),
    height: wp('7%'),
  },
  auroraContainer: {
    alignItems: 'center',
    height: wp('10%'),
    flexDirection: 'row',
  },
  actualSituationContent: {
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    width: wp('100%'),
    justifyContent: 'flex-start',
    paddingTop: 10,
    marginLeft: -5,
  },
  rectButtons: {
    alignSelf: 'center',
    borderRadius: 3,
    justifyContent: 'center',
    height: hp('5%'),
    marginLeft: 8,
    marginBottom: 8,
    width: wp('33%'),
  },
  buttonText: {
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'IBMPlexMono-SemiBold',
    fontSize: wp('3.5%'),
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
    fontFamily: 'IBMPlexMono-Bold',
  },
  footer: {
    marginBottom: -10,
    alignItems: 'flex-start',
    width: wp('100%'),
    height: wp('20%'),
    alignItems: 'center',
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
    fontFamily: 'IBMPlexMono-Bold',
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
    height: hp('50%'),
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
    fontFamily: 'IBMPlexMono-SemiBold',
  },
  instructionsText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: textFontSize + 1,
    fontFamily: 'IBMPlexMono-Regular',
    margin: hp('2%'),
    width: wp('75%'),
  },
  inputs: {
    height: hp('5%'),
    borderBottomColor: pink,
    borderBottomWidth: 0.3,
    margin: 4,
  },
  image: {
    backgroundColor: '#fff',
    borderRadius: 50,
    height: 50,
    width: 50,
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
    fontFamily: 'IBMPlexMono-SemiBold',
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
    fontFamily: 'IBMPlexMono-Regular',
  },
  textHeader: {
    fontFamily: 'IBMPlexMono-Bold',
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
  wizardActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
});

export default styles;
