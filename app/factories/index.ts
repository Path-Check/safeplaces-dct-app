import { register } from 'fishery';
import tracingStrategy from './tracingStrategy';
import exposureDatum from './exposureDatum';
import rawExposure from './rawExposure';

export const factories = register({
  tracingStrategy,
  exposureDatum,
  rawExposure,
});
