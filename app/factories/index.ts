import { register } from 'fishery';
import tracingStrategy from './tracingStrategy';

export const factories = register({
  tracingStrategy,
});
