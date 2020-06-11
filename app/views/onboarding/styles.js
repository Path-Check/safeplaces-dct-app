import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';

export const sharedStyles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    padding: 24,
    width: '100%',
  },
  headerText: {
    color: Colors.VIOLET_TEXT_DARK,
    fontSize: 26,
    fontFamily: fontFamily.primaryRegular,
    fontWeight: "500",
    lineHeight: 32,
  },
  subheaderText: {
    marginTop: '6%',
    color: Colors.VIOLET_TEXT_LIGHT,
    fontSize: 16,
    fontFamily: fontFamily.primaryRegular,
    lineHeight: 24,
  },
  iconCircle: {
    height: 70,
    width: 70,
    backgroundColor: Colors.ONBOARDING_ICON_LIGHT_BLUE,
    // backgroundColor: 'red',
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
});
