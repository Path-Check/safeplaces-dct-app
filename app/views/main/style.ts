import { StyleSheet, Dimensions } from 'react-native';

import { Colors, Spacing } from '../../styles';

const PULSE_GAP = 80;

const { height } = Dimensions.get('window');
const IS_SMALL = height < 700;

export const styles = StyleSheet.create({
  backgroundImage: {
    top: IS_SMALL ? '-10%' : 0,
    width: '100%',
    height: '110%',
    resizeMode: 'cover',
    flex: 1,
    justifyContent: 'flex-end',
  },
  mainContainer: {
    position: 'absolute',
    // resizeMode: 'contain',
    // aligns the center of the main container with center of pulse
    // so that two `flex: 1` views will be have a reasonable chance at natural
    // flex flow for above and below the pulse.
    top: IS_SMALL ? '-20%' : '-10%',
    left: 0,
    right: 0,
    height: '100%',
    paddingHorizontal: Spacing.large,
    paddingBottom: 12,
  },
  contentAbovePulse: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: PULSE_GAP / 2,
  },
  contentBelowPulse: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: PULSE_GAP,
  },
  pulseContainer: {
    position: 'absolute',
    resizeMode: 'contain',
    top: '-17%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mainTextAbove: {
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 24,
    color: Colors.white,
    fontSize: 28,
  },
  mainTextBelow: {
    textAlign: 'center',
    lineHeight: 34,
    color: Colors.white,
    fontSize: 26,
    marginBottom: 24,
  },
  subheaderText: {
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24.5,
    color: Colors.white,
    fontSize: 18,
  },
  arrowContainer: {
    alignSelf: 'center',
    paddingRight: 20,
    paddingLeft: 20,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.bottomSheetBackground,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.formInputBorder,
  },
  hyperlink: {
    color: Colors.linkText,
    textDecorationLine: 'underline',
    position: 'relative',
  },
});
