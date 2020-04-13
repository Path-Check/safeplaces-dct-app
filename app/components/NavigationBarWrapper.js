import styled from '@emotion/native';
import { useTheme } from 'emotion-theming';
import PropTypes from 'prop-types';
import * as React from 'react';
import { StatusBar } from 'react-native';
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

const TopContainer = styled.SafeAreaView`
  flex: 0;
  background-color: ${themeNavBar};
`;

const BottomContainer = styled.SafeAreaView`
  flex: 1;
  background-color: white;
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
  color: white;
  font-family: 'Arial';
  font-size: 26px;
  position: absolute;
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
