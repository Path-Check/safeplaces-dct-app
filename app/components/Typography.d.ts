import { Type as type, Typography as typography } from './Typography';

interface Type {
  Headline1: string;
  Headline2: string;
  Headline3: string;
  Body1: string;
  Body2: string;
  Body3: string;
}

export const Type: Type = type;

export const Typography: (
  props: Record<string, unkonwn>,
) => JSX.Element = typography;
