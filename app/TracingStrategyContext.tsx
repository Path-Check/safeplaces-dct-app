import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  TracingStrategy,
  StrategyCopyContent,
  StrategyCopyContentHook,
  StrategyAssets,
} from './tracingStrategy';

import { ExposureHistoryProvider } from './ExposureHistoryContext';

interface TracingStrategyContextState {
  name: string;
  homeScreenComponent: ({ testID }: { testID: string }) => JSX.Element;
  affectedUserFlow: () => JSX.Element;
  assets: StrategyAssets;
  useCopy: StrategyCopyContentHook;
}

const TracingStrategyContext = createContext<
  TracingStrategyContextState | undefined
>(undefined);

interface TracingStrategyProps {
  children: JSX.Element;
  strategy: TracingStrategy;
}

export const TracingStrategyProvider = ({
  children,
  strategy,
}: TracingStrategyProps): JSX.Element => {
  const StrategyPermissionsProvider = strategy.permissionsProvider;

  return (
    <TracingStrategyContext.Provider
      value={{
        name: strategy.name,
        homeScreenComponent: strategy.homeScreenComponent,
        affectedUserFlow: strategy.affectedUserFlow,
        assets: strategy.assets,
        useCopy: strategy.useCopy,
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
  StrategyCopy: StrategyCopyContent;
  StrategyAssets: StrategyAssets;
} => {
  const { t } = useTranslation();
  const { useCopy, assets } = useTracingStrategyContext();
  const StrategyCopy = useCopy(t);
  const StrategyAssets = assets;
  return { StrategyCopy, StrategyAssets };
};
