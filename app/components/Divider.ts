import styled from '@emotion/native';

interface Theme {
  border: string;
}

/** A theme-aware horizontal divider that uses `theme.border` color */
export const Divider = styled.View`
  background-color: ${(theme: Theme) => theme.border};
  height: 1px;
  width: 100%;
`;

/** A theme-aware vertical divider that uses `theme.border` color */
export const VerticalDivider = styled.View`
  background-color: ${(theme: Theme) => theme.border};
  height: 100%;
  width: 1px;
`;
