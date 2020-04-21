import styled from '@emotion/native';
import { useTheme } from 'emotion-theming';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Dimensions, StatusBar } from 'react-native';
import { SvgXml } from 'react-native-svg';

import backArrow from './../assets/svgs/backArrow';
import { isPlatformiOS } from './../Util';
import Colors from '../constants/colors';

/**
 * Navigation bar and status bar
 *
 * @param {{
 *   title: string,
 *   onBackPress: () => void,
 * }} param0
 */
const widthScale = Math.min(Dimensions.get('window').width / 400, 1.0);

const NavigationBarWrapper = ({ children, title, onBackPress }) => {
  const theme = useTheme();

  const barColor = (theme && theme.navBar) || Colors.VIOLET;

  return (
    <>
      <StatusBar
        barStyle='light-content'
        backgroundColor={barColor}
        translucent={isPlatformiOS()}
      />
      <TopContainer />
      <BottomContainer>
        <Header>
          <BackArrow onPress={() => onBackPress()}>
            <BackArrowIcon xml={backArrow} />
          </BackArrow>
          <Title>{title}</Title>
        </Header>
        {children}
      </BottomContainer>
    </>
  );
};

const themeNavBar = ({ theme }) => theme.navBar || Colors.VIOLET;

// TODO: this breaks transitions...
// const themeBackground = ({ theme }) =>
//   theme.background || Colors.INTRO_WHITE_BG;

const TopContainer = styled.SafeAreaView`
  flex: 0;
  background-color: ${themeNavBar};
`;

const BottomContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${Colors.INTRO_WHITE_BG};
`;

const themeNavBarBorder = ({ theme }) =>
  theme.navBarBorder || Colors.NAV_BAR_VIOLET;

const Header = styled.View`
  background-color: ${themeNavBar};
  border-bottom-color: ${themeNavBarBorder};
  border-bottom-width: 1px;
  flex-direction: row;
`;

const Title = styled.Text`
  align-self: center;
  color: ${Colors.WHITE};
  font-family: IBMPlexSans-Medium;
  font-size: ${26 * widthScale + 'px'};
  position: absolute;
  padding-horizontal: 20;
  text-align: center;
  width: 100%;
`;

const BackArrow = styled.TouchableOpacity`
  align-items: center;
  height: 55px;
  justify-content: center;
  width: 60px;
  z-index: 1;
`;

const BackArrowIcon = styled(SvgXml)`
  height: 18px;
  width: 18px;
`;

NavigationBarWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  onBackPress: PropTypes.func.isRequired,
};

export default NavigationBarWrapper;
