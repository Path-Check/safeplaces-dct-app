import styled from '@emotion/native';
import { useTheme } from 'emotion-theming';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Dimensions, StatusBar, Platform } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Icons } from '../assets';
import Colors from '../constants/colors';

/**
 * Navigation bar and status bar. Optionally include bottom nav
 *
 * @param {{
 *   title: string,
 *   onBackPress: () => void,
 *   includeBottomNav: boolean
 * }} param0
 */
const widthScale = Math.min(Dimensions.get('window').width / 400, 1.0);

interface NavigationBarWrapperProps {
  children: JSX.Element;
  title: string;
  onBackPress: () => void;
  includeBottomNav: boolean;
  includeBackButton?: boolean;
  rightTitle?: string;
  onRightPress?: () => void;
}
export interface ThemeProps {
  navBar: string;
  background: string;
  navBarBorder: string;
  onNavBar: string;
}

export interface Theme {
  theme: ThemeProps;
}

export const NavigationBarWrapper = ({
  children,
  title,
  onBackPress,
  includeBackButton = true,
  rightTitle,
  onRightPress,
}: NavigationBarWrapperProps): JSX.Element => {
  const theme = useTheme<{ navBar: string }>();

  const barColor = (theme && theme.navBar) || Colors.VIOLET;

  return (
    <>
      <StatusBar
        barStyle='light-content'
        backgroundColor={barColor}
        translucent={Platform.OS === 'ios'}
      />
      <TopContainer />
      <BottomContainer>
        <Header>
          {includeBackButton ? (
            <BackArrowIcon onPress={() => onBackPress()}>
              <BackArrowSvg xml={Icons.BackArrow} />
            </BackArrowIcon>
          ) : null}
          <Title>{title}</Title>
          {onRightPress && (
            <RightArrowIcon onPress={() => onRightPress()}>
              <RightTitle>{rightTitle}</RightTitle>
            </RightArrowIcon>
          )}
        </Header>
        {children}
      </BottomContainer>
    </>
  );
};

const themeNavBar = ({ theme }: Theme) => theme.navBar || Colors.VIOLET;

const TopContainer = styled.SafeAreaView`
  flex: 0;
  background-color: ${themeNavBar};
`;

const themeBackground = ({ theme }: Theme) =>
  theme.background || Colors.INTRO_WHITE_BG;

const BottomContainer = styled.View`
  flex: 1;
  background-color: ${themeBackground};
`;

const themeNavBarBorder = ({ theme }: Theme) =>
  theme.navBarBorder || Colors.NAV_BAR_VIOLET;

const Header = styled.View`
  align-items: center;
  background-color: ${themeNavBar};
  border-bottom-color: ${themeNavBarBorder};
  border-bottom-width: 1px;
  flex-direction: row;
  height: 55px;
`;

const themeOnNavBar = ({ theme }: Theme) => theme.onNavBar || Colors.WHITE;

const Title = styled.Text`
  align-self: center;
  color: ${themeOnNavBar};
  font-family: IBMPlexSans-Bold;
  font-size: ${16 * widthScale + 'px'};
  line-height: 34px;
  position: absolute;
  padding-horizontal: 20px;
  text-align: center;
  text-transform: uppercase;
  width: 100%;
  letter-spacing: 1px;
`;

const RightTitle = styled.Text`
  align-self: center;
  color: ${Colors.RIGHT_TITLE};
  font-family: IBMPlexSans;
  font-size: ${16 * widthScale + 'px'};
  position: absolute;
  padding-horizontal: 5px;
  text-align: center;
  letter-spacing: 1px;
`;

const BackArrowIcon = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 60px;
  z-index: 1;
`;

const RightArrowIcon = styled.TouchableOpacity`
  align-items: center;
  height: 55px;
  justify-content: center;
  width: 60px;
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
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
