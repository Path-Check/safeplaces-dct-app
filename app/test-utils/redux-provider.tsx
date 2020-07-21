// test-utils.js
import React, { ReactElement, ReactNode } from 'react';
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from '@testing-library/react-native';
import { Store, createStore } from 'redux';
import { Provider, DefaultRootState } from 'react-redux';
import rootReducer from '../store/reducers/rootReducer';

type ReduxRenderOptions = RenderOptions & {
  initialState: DefaultRootState;
  store?: Store;
};

type ReduxProviderProps = {
  children?: ReactNode;
};

function render(
  ui: ReactElement<unknown>,
  {
    initialState,
    store = createStore(rootReducer, initialState),
    ...rest
  }: ReduxRenderOptions,
): RenderResult {
  function ReduxProvider({ children }: ReduxProviderProps) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: ReduxProvider, ...rest });
}

// re-export everything
export * from '@testing-library/react-native';
// override render method
export { render };
