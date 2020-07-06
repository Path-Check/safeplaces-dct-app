import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Colors from '../colors';

export default {
  buttonText: {
    fontSize: wp('4.5%'),
    textTransform: 'uppercase',
    color: Colors.WHITE,
    paddingVertical: 4,
    paddingHorizontal: 11,
    textAlign: 'center',
    fontWeight: '900',
  },
  buttonStyle: {
    borderRadius: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    width: wp('75%'),
    height: wp('11%'),
    backgroundColor: Colors.BLUE_RIBBON,
  },
};
