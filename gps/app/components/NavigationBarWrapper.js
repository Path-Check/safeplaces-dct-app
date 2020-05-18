import styled from '@emotion/native';
import { useTheme } from 'emotion-theming';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Dimensions, StatusBar } from 'react-native';
import { SvgXml } from 'react-native-svg';

import backArrow from '../../../shared/assets/svgs/backArrow';
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
          <BackArrowIcon onPress={() => onBackPress()}>
            <BackArrowSvg xml={backArrow} />
          </BackArrowIcon>
          <Title>{title}</Title>
        </Header>
        {children}
      </BottomContainer>
    </>
  );
};

const themeNavBar = ({ theme }) => theme.navBar || Colors.VIOLET;

const TopContainer = styled.SafeAreaView`
  flex: 0;
  background-color: ${themeNavBar};
`;

const themeBackground = ({ theme }) =>
  theme.background || Colors.INTRO_WHITE_BG;

const BottomContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${themeBackground};
`;

const themeNavBarBorder = ({ theme }) =>
  theme.navBarBorder || Colors.NAV_BAR_VIOLET;

const Header = styled.View`
  align-items: center;
  background-color: ${themeNavBar};
  border-bottom-color: ${themeNavBarBorder};
  border-bottom-width: 1px;
  flex-direction: row;
`;

const themeOnNavBar = ({ theme }) => theme.onNavBar || Colors.WHITE;

const Title = styled.Text`
  align-self: center;
  color: ${themeOnNavBar};
  font-family: IBMPlexSans-Medium;
  font-size: ${26 * widthScale + 'px'};
  line-height: 34px;
  position: absolute;
  padding-horizontal: 20px;
  text-align: center;
  width: 100%;
  letter-spacing: -0.3px;
`;

const BackArrowIcon = styled.TouchableOpacity`
  align-items: center;
  height: 55px;
  justify-content: center;
  width: 60px;
  z-index: 1;
`;

const BackArrowSvg = styled(SvgXml)`
  height: 18px;
  width: 18px;
  color: ${Colors.WHITE};
`;

NavigationBarWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  onBackPress: PropTypes.func.isRequired,
};

export default NavigationBarWrapper;
