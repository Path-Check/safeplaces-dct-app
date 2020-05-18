import { StyleSheet } from 'react-native';

import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';

const PULSE_GAP = 80;

export const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
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
    top: '-10%',
    left: 0,
    right: 0,
    height: '100%',
    paddingHorizontal: '12%',
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
    alignItems: 'center',
    paddingTop: PULSE_GAP,
  },
  settingsContainer: {
    position: 'absolute',
    top: 0,
    marginTop: '14%',
    marginRight: '7%',
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    marginTop: 24,
    height: 54, // fixes overlaying buttons on really small screens
  },
  pulseContainer: {
    position: 'absolute',
    resizeMode: 'contain',
    height: '100%',
    top: '-13%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mainTextAbove: {
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 24,
    color: Colors.WHITE,
    fontSize: 28,
    fontFamily: fontFamily.primaryMedium,
  },
  mainTextBelow: {
    textAlign: 'center',
    lineHeight: 34,
    color: Colors.WHITE,
    fontSize: 26,
    fontFamily: fontFamily.primaryMedium,
    marginBottom: 24,
  },
  subheaderText: {
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24.5,
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: fontFamily.primaryRegular,
  },
  subsubheaderText: {
    textAlign: 'center',
    lineHeight: 24.5,
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: fontFamily.primaryLight,
    marginBottom: 24,
  },
  mayoInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mayoInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'flex-end',
    padding: 20,
  },
  mainMayoHeader: {
    textAlign: 'left',
    color: Colors.MISCHKA,
    fontSize: 18,
    fontFamily: fontFamily.primaryBold,
  },
  mainMayoSubtext: {
    textAlign: 'left',
    color: Colors.MISCHKA,
    fontSize: 18,
    fontFamily: fontFamily.primaryRegular,
  },
  arrowContainer: {
    alignSelf: 'center',
    paddingRight: 20,
    paddingLeft: 20,
  },
});
