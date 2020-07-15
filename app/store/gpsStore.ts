import { createImmutableStateInvariantMiddleware } from '@reduxjs/toolkit';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from './reducer';
import onChangedSelectedHealthAuthorities from './middleware/onChangedSelectedHealthAuthorities';

const enhancers = composeWithDevTools(
  applyMiddleware(
    thunk,
    createImmutableStateInvariantMiddleware(),
    onChangedSelectedHealthAuthorities,
  ),
);

const store = createStore(reducer, {}, enhancers);

export default store;
