import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../../../constants/colors';

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
  bigCards: {
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: wp('1.5%'),
    padding: wp('5%'),
    width: wp('91%'),
  },
  textHeader: {
    fontSize: textFontSize + 2,
    fontFamily: 'IBMPlexSans-Bold',
  },
  text: {
    color: '#000',
    fontSize: textFontSize - 2,
    fontFamily: 'IBMPlexSans',
  },
  buttons: {
    alignSelf: 'center',
    borderRadius: 25,
    justifyContent: 'center',
    height: 38,
    marginLeft: 6,
    minWidth: wp('27%'),
    backgroundColor: Colors.BLUE_RIBBON,
  },
  radioButtonLayout: {
    display: 'flex',
    flexDirection: 'row',
    width: wp('100%'),
    justifyContent: 'flex-start',
    paddingTop: 10,
    marginLeft: -5,
  },
  buttonText: {
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'IBMPlexSans-SemiBold',
    fontSize: wp('3.5%'),
    textTransform: 'capitalize',
  },
  tester: {
    flexDirection: 'row',
  },
});

export default styles;
