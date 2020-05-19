import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Layout from '../constants/Layout';

const { window: { width, height } } = Layout;

export const minWith = (screen) => screen <= width;
export const maxWith = (screen) => screen >= width;
export const minHeight = (screen) => screen <= height;
export const maxHeight = (screen) => screen <= height;
export const responsive = wp('100%') * 0.038;
