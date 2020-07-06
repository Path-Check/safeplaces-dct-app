declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';

  const content: React.StatelessComponent<SvgProps>;
  export default content;
}

declare module '*.png' {}

declare module '@emotion/native' {
  /* eslint-disable @typescript-eslint/no-explicit-any*/
  const styled: any;
  export const css: any;
  export default styled;
}

declare module 'react-native-pulse' {
  const Pulse: any;
  export default Pulse;
}

declare module 'react-native-push-notification';
