import styled from '@emotion/native';
import React from 'react';

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

  return 'transparent';
};

/** Get border color from theme and risk level */
const getBorderColor = ({ riskLevel, theme }) => {
  let color = 'transparent';

  if (riskLevel === Risk.Unknown) {
    color = theme.disabled;
  }

  if (riskLevel === Risk.Today) {
    color = theme.textPrimaryOnBackground;
  }

  return color;
};

const getSize = ({ size }) => `${size}px`;
const getBorderRadius = ({ size }) => `${size / 2}px`;

const Circle = styled.View`
  background-color: ${getBgColor};
  border: 1px solid ${getBorderColor};
  width: ${getSize};
  height: ${getSize};
  border-radius: ${getBorderRadius};
  align-items: center;
  align-content: center;
  flex-direction: row;
`;

/** Get border color from theme and risk level */
const getTextColor = ({ riskLevel, theme }) => {
  if (riskLevel === Risk.Unknown) {
    return theme.disabled;
  }

  if (riskLevel === Risk.None || riskLevel === Risk.Possible) {
    return theme.onPrimary;
  }

  return theme.textPrimaryOnBackground;
};

const CircleInnerText = styled.Text`
  color: ${getTextColor};
  text-align: center;
  flex: 1;
  font-size: 12px;
  font-weight: bold;
`;
