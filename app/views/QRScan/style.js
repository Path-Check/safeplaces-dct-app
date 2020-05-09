import { StyleSheet } from 'react-native';

import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';

const ICON_GAP = 80;

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
    top: '-10%',
    left: 0,
    right: 0,
    height: '90%',
    paddingHorizontal: '12%',
    paddingBottom: 12,
  },
  qrScanContainer: {
    height: '100%',
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: ICON_GAP,
  },
  iconContainer: {
    position: 'absolute',
    resizeMode: 'contain',
    height: '100%',
    top: '-13%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buttonContainer: {
    top: 24,
  },
  mainTextBelow: {
    lineHeight: 34,
    fontSize: 26,
    marginBottom: 24,
  },
  subheaderText: {
    marginBottom: 24,
    textAlign: 'center',
  },
});
