import React, { createContext, useContext, FunctionComponent } from 'react';

import { TracingStrategy, StrategyAssets } from './tracingStrategy';

import { ExposureHistoryProvider } from './ExposureHistoryContext';

interface TracingStrategyContextState {
  name: string;
  homeScreenComponent: ({ testID }: { testID: string }) => JSX.Element;
  affectedUserFlow: () => JSX.Element;
  assets: StrategyAssets;
}

const TracingStrategyContext = createContext<
  TracingStrategyContextState | undefined
>(undefined);

interface TracingStrategyProps {
  strategy: TracingStrategy;
}

export const TracingStrategyProvider: FunctionComponent<TracingStrategyProps> = ({
  children,
  strategy,
}) => {
  const StrategyPermissionsProvider = strategy.permissionsProvider;

  return (
    <TracingStrategyContext.Provider
      value={{
        name: strategy.name,
        homeScreenComponent: strategy.homeScreenComponent,
        affectedUserFlow: strategy.affectedUserFlow,
        assets: strategy.assets,
      }}>
      <StrategyPermissionsProvider>
        <ExposureHistoryProvider
          exposureEventsStrategy={strategy.exposureEventsStrategy}>
          {children}
        </ExposureHistoryProvider>
      </StrategyPermissionsProvider>
    </TracingStrategyContext.Provider>
  );
};

export const useTracingStrategyContext = (): TracingStrategyContextState => {
  const context = useContext(TracingStrategyContext);
  if (context === undefined) {
    throw new Error('TracingStrategyContext must be used with a provider');
  }
  return context;
};

export const useStrategyContent = (): {
  StrategyAssets: StrategyAssets;
} => {
  const { assets } = useTracingStrategyContext();
  const StrategyAssets = assets;
  return { StrategyAssets };
};
