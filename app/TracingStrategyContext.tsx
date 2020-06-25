import React, { createContext } from 'react';
import { TracingStrategy } from './tracingStrategy';
import { ExposureHistoryProvider } from './ExposureHistoryContext';

interface TracingStrategyContextState {
  name: string;
  homeScreenComponent: () => JSX.Element;
}

const DefaultHomeScreenComponent = () => {
  return <></>;
};

const defaultState = {
  name: 'initializingTracingStrategy',
  homeScreenComponent: DefaultHomeScreenComponent,
};

const TracingStrategyContext = createContext<TracingStrategyContextState>(
  defaultState,
);

interface TracingStrategyProps {
  children: JSX.Element;
  strategy: TracingStrategy;
}

const TracingStrategyProvider = ({
  children,
  strategy,
}: TracingStrategyProps): JSX.Element => {
  const StrategyPermissionsProvider = strategy.permissionsProvider;

  return (
    <TracingStrategyContext.Provider
      value={{
        name: strategy.name,
        homeScreenComponent: strategy.homeScreenComponent,
      }}>
      <StrategyPermissionsProvider>
        <ExposureHistoryProvider
          exposureInfoSubscription={strategy.exposureInfoSubscription}>
          {children}
        </ExposureHistoryProvider>
      </StrategyPermissionsProvider>
    </TracingStrategyContext.Provider>
  );
};

export { TracingStrategyProvider };
export default TracingStrategyContext;
