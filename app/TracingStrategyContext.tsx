import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  TracingStrategy,
  StrategyCopyContent,
  StrategyCopyContentHook,
  StrategyInterpolatedCopyContent,
  StrategyInterpolatedCopyContentHook,
  StrategyAssets,
} from './tracingStrategy';

import { ExposureHistoryProvider } from './ExposureHistoryContext';

interface TracingStrategyContextState {
  name: string;
  homeScreenComponent: ({ testID }: { testID: string }) => JSX.Element;
  assets: StrategyAssets;
  useCopy: StrategyCopyContentHook;
  useInterpolatedCopy: StrategyInterpolatedCopyContentHook;
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
        assets: strategy.assets,
        useCopy: strategy.useCopy,
        useInterpolatedCopy: strategy.useInterpolatedCopy,
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

export const useTracingStrategyContext = (): TracingStrategyContextState => {
  const context = useContext(TracingStrategyContext);
  if (context === undefined) {
    throw new Error('TracingStrategyContext must be used with a provider');
  }
  return context;
};

export const useStrategyContent = (): {
  StrategyCopy: StrategyCopyContent;
  InterpolatedStrategyCopy: StrategyInterpolatedCopyContent;
  StrategyAssets: StrategyAssets;
} => {
  const { t } = useTranslation();
  const { useCopy, useInterpolatedCopy, assets } = useTracingStrategyContext();
  const StrategyCopy = useCopy(t);
  const InterpolatedStrategyCopy = useInterpolatedCopy(t);
  const StrategyAssets = assets;
  return { StrategyCopy, InterpolatedStrategyCopy, StrategyAssets };
};
