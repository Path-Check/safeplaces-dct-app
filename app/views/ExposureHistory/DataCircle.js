import styled from '@emotion/native';
import React from 'react';

import Color from '../../constants/colors';

export const Risk = {
  Unknown: 'unknown',
  None: 'none',
  Possible: 'possible',
  Today: 'today',
};

/**
 *
 * @param {{
 *   riskLevel: string,
 *   size: number
 * }} param0
 */
export const DataCircle = ({ riskLevel, children, size = 36 }) => {
  return (
    <Circle riskLevel={riskLevel} size={size}>
      <CircleInnerText riskLevel={riskLevel}>{children}</CircleInnerText>
    </Circle>
  );
};

/** Get bg color from risk level and theme warning/success */
export const getBgColor = ({ riskLevel, theme }) => {
  if (riskLevel === Risk.Possible) {
    return theme.warning;
  }

  if (riskLevel === Risk.None) {
    return theme.success;
  }

  return Color.WHITE;
};

/** Get border color from theme and risk level */
const getBorder = ({ riskLevel, theme }) => {
  let color = 'transparent';
  if (riskLevel === Risk.Unknown) {
    color = theme.border;
  }
  if (riskLevel === Risk.Today) {
    color = theme.textPrimaryOnBackground;
  }
  return `1px solid ${color}`;
};

const getSize = ({ size }) => `${size}px`;
const getBorderRadius = ({ size }) => `${size / 2}px`;

const Circle = styled.View`
  background-color: ${getBgColor};
  border: ${getBorder};
  width: ${getSize};
  height: ${getSize};
  border-radius: ${getBorderRadius};
  align-items: center;
  align-content: center;
  flex-direction: row;
`;

const TEXT_COLOR_MAP = {
  [Risk.None]: '#fff',
  [Risk.Possible]: '#fff',
  [Risk.Unknown]: '#dadada',
};

const CircleInnerText = styled.Text`
  color: ${({ riskLevel }) => TEXT_COLOR_MAP[riskLevel]};
  text-align: center;
  flex: 1;
  font-size: 12px;
  font-weight: bold;
`;
