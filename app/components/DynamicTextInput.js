// Custome Text handling RTL and LTR text direction
import styled from '@emotion/native';

import languages from '../locales/languages';

// Themes to be added

const getCurrentDirection = () => languages.dir();

export const DynamicTextInput = styled.TextInput`
  writing-direction: ${getCurrentDirection};
`;
