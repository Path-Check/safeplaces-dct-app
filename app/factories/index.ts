import { register } from 'fishery';
import tracingStrategy from './tracingStrategy';
import exposureDatum from './exposureDatum';

export const factories = register({
  tracingStrategy,
  exposureDatum,
});
