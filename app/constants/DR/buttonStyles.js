import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../colors';

export default {
  buttonText: {
    fontSize: wp('5%'),
    textTransform: 'capitalize',
    color: Colors.WHITE,
    paddingVertical: 4,
    paddingHorizontal: 11,
    textAlign: 'center',
    fontWeight: '900',
  },
  buttonStyle: {
    marginLeft: 23,
    borderRadius: 40,
    justifyContent: 'center',
    width: wp('75%'),
    height: hp('6.5%'),
    backgroundColor: Colors.BLUE_RIBBON,
  },
};
