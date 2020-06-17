import { StyleSheet } from 'react-native';
import fontFamily from '../../constants/fonts';

import { Colors } from '../../styles';

export const sharedStyles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    padding: 24,
    width: '100%',
  },
  headerText: {
    color: Colors.violetTextDark,
    fontSize: 26,
    fontFamily: fontFamily.primaryRegular,
    fontWeight: '500',
    lineHeight: 32,
  },
  subheaderText: {
    marginTop: '6%',
    color: Colors.violetTextDark,
    fontSize: 16,
    fontFamily: fontFamily.primaryRegular,
    lineHeight: 24,
  },
  iconCircle: {
    height: 70,
    width: 70,
    backgroundColor: Colors.onboardingIconBlue,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
});
