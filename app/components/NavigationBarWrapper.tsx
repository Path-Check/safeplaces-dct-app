import styled from '@emotion/native';
import { useTheme } from 'emotion-theming';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Dimensions, StatusBar, Platform } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Icons } from '../assets';
import { Colors } from '../styles';

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
  children: React.ReactNode;
  title: string;
  onBackPress: () => void;
  includeBottomNav?: boolean;
  includeBackButton?: boolean;
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
}: NavigationBarWrapperProps): JSX.Element => {
  const theme = useTheme<{ navBar: string }>();
  
  const { t } = useTranslation();
  const barColor = (theme && theme.navBar) || Colors.primaryViolet;

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
              <BackArrowSvg accessibilityLabel={t('label.go_back')} xml={Icons.BackArrow} />
            </BackArrowIcon>
          ) : null}
          <Title>{title}</Title>
        </Header>
        {children}
      </BottomContainer>
    </>
  );
};

const themeNavBar = ({ theme }: Theme) => theme.navBar || Colors.primaryViolet;

const TopContainer = styled.SafeAreaView`
  flex: 0;
  background-color: ${themeNavBar};
`;

const themeBackground = ({ theme }: Theme) =>
  theme.background || Colors.primaryBackgroundFaintShade;

const BottomContainer = styled.View`
  flex: 1;
  background-color: ${themeBackground};
`;

const themeNavBarBorder = ({ theme }: Theme) =>
  theme.navBarBorder || Colors.primaryViolet;

const Header = styled.View`
  align-items: center;
  background-color: ${themeNavBar};
  border-bottom-color: ${themeNavBarBorder};
  border-bottom-width: 1px;
  flex-direction: row;
  height: 55px;
`;

const themeOnNavBar = ({ theme }: Theme) => theme.onNavBar || Colors.white;

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

const BackArrowIcon = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 60px;
  z-index: 1;
`;

const BackArrowSvg = styled(SvgXml)`
  height: 18px;
  width: 18px;
  color: ${Colors.white};
`;

NavigationBarWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  onBackPress: PropTypes.func.isRequired,
};
