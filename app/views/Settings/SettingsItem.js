import styled from '@emotion/native';
import React from 'react';
import { SvgXml } from 'react-native-svg';

import { Divider } from '../../components/Divider';
import { Typography } from '../../components/Typography';

/**
 * Render a single tappable settings item with optional description and icon.
 *
 * @param {{
 *   label: string,
 *   description?: string,
 *   onPress: (event: import('react-native').GestureResponderEvent) => void,
 *   last?: boolean,
 * }} param0
 */
export const SettingsItem = ({ label, onPress, description, icon, last }) => {
  return (
    <>
      <Container onPress={onPress}>
        <Label>
          <Typography bold={description} use='body1'>
            {label}
          </Typography>
          {description && (
            <Typography use='body2' secondary>
              {description}
            </Typography>
          )}
        </Label>
        {icon && <SvgXml xml={icon} height={32} />}
      </Container>
      {!last && <Divider />}
    </>
  );
};

const Container = styled.TouchableOpacity`
  flex-direction: row;
  padding: 18px 0;
  align-items: center;
`;

const Label = styled.View`
  flex: 1;
  justify-content: center;
`;
