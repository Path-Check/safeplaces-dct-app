import React from 'react';

import styled, { css } from '@emotion/native';
import Colors from '../../constants/colors';
import { Divider } from '../../components';
import { View } from 'react-native';
/**
 * Render a white section with blue spacer at the bottom (unless `last == true`)
 *
 * @param {{last?: boolean}} param0
 */
export const Section = ({ last, children }) => (
  <>
    <SectionWrapper>{children}</SectionWrapper>

    <Divider />

    {!last && (
      <>
        <View
          style={css`
            margin: 2% 0;
          `}
        />
        <Divider />
      </>
    )}
  </>
);

const SectionWrapper = styled.View`
  background-color: ${Colors.WHITE};
  padding: 0px 6.25%;
`;
