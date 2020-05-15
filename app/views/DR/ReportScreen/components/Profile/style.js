import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { maxWith, minWith, responsive } from '../screen';

const card = {
  container: {
    alignItems: 'center',
  },

  subsontainer: {
    borderColor: '#E2E5EA',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    width: wp('93%'),
  },

  title: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: (responsive + 2),
    padding: 10,
  },

  text: {
    color: '#4A4A4A',
    lineHeight: minWith(768) ? 40 : 20,
  },

  button: {
    alignSelf: 'center',
    backgroundColor: '#0161f2',
    borderRadius: 25,
    justifyContent: 'center',
    height: hp('6%'),
    width: wp('27%') + 50,
  },

  buttonValue: {
    color: 'white',
    fontSize: hp('2.1%'),
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.9,
  },
};

export const createAccount = StyleSheet.create({
  ...card,

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    height: maxWith(480) ? hp('15%') : hp('19%'),
    width: wp('30%'),
  },

  title: {
    ...card.title,
    fontWeight: '500',
    textAlign: 'center',
  },

  text: {
    ...card.text,
    textAlign: 'center',
    fontSize: (responsive - 1),
  },

  buttonContainer: {
    ...card.buttonContainer,
    alignItems: 'center',
    paddingBottom: 0,
  },
});

export const tester = StyleSheet.create({
  ...card,

  subsontainer: {
    ...card.subsontainer,
    backgroundColor: 'white',
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    paddingBottom: 10,
  },

  text: {
    ...card.text,
    fontSize: maxWith(320) ? (responsive - 2) : (responsive - 3),
  },

  titleContainer: {
    flexDirection: 'row',
  },

  title: {
    ...card.title,
    position: 'relative',
    left: -1,
  },

  imageContainer: {
    flexDirection: 'row',
  },

  image: {
    marginLeft: -5,
    height: maxWith(480) ? hp('6%') : hp('8%'),
    width: wp('12%'),
  },

  buttonContainer: {
    ...card.buttonContainer,
    flexDirection: 'row',
    width: '100%',
  },

  textContainer: {
    width: wp('55%'),
  },

  button: {
    ...card.button,
    backgroundColor: '#6fc712',
    position: 'relative',
    top: -10,
    left: minWith(768) ? 25 : null,
    textAlign: 'right',
    width: wp('27%'),
  },
});
