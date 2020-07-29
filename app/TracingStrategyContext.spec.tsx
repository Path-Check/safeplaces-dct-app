import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { render, cleanup } from './test-utils/redux-provider';
import '@testing-library/jest-native/extend-expect';

import {
  useTracingStrategyContext,
  TracingStrategyProvider,
  useStrategyContent,
} from './TracingStrategyContext';
import { testStrategyAssets } from './factories/tracingStrategy';
import { factories } from './factories';
import { Images } from '../app/assets/images/';

import { TracingStrategy } from './tracingStrategy';
import { FeatureFlagOption } from './store/types';

afterEach(cleanup);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const renderTracingStrategyProvider = (strategy: TracingStrategy) => {
  const TestTracingStrategyConsumer = () => {
    const { name, homeScreenComponent } = useTracingStrategyContext();
    const { StrategyAssets } = useStrategyContent();

    const HomeScreen = homeScreenComponent;

    return (
      <View>
        <Text testID={'tracing-strategy-name'}>{name}</Text>
        <ImageBackground
          source={StrategyAssets.personalPrivacyBackground}
          testID={'tracing-strategy-assets'}
          style={styles.background}
        />
        <HomeScreen testID={'home-screen'} />
      </View>
    );
  };

  return render(
    <TracingStrategyProvider strategy={strategy}>
      <TestTracingStrategyConsumer />
    </TracingStrategyProvider>,
    {
      initialState: {
        featureFlags: { flags: { [FeatureFlagOption.MOCK_EXPOSURE]: false } },
      },
    },
  );
};

describe('TracingStrategyProvider', () => {
  describe('when given a tracing strategy ', () => {
    it('mounts the permssions provider', () => {
      const PermissionsProvider = ({
        children,
      }: {
        children: JSX.Element;
      }): JSX.Element => {
        return <View testID={'permissions-provider'}>{children}</View>;
      };

      const strategy = factories.tracingStrategy.build({
        name: 'test-strategy',
        permissionsProvider: PermissionsProvider,
      });

      const { getByTestId } = renderTracingStrategyProvider(strategy);

      const name = getByTestId('tracing-strategy-name');
      const permissionsProvider = getByTestId('permissions-provider');

      expect(name).toHaveTextContent('test-strategy');
      expect(permissionsProvider).toBeTruthy();
    });

    it('subscribes to exposure info events', async () => {
      const removeSubscriptionMock = jest.fn();
      const strategy = factories.tracingStrategy.build({
        exposureEventsStrategy: {
          exposureInfoSubscription: () => {
            return { remove: removeSubscriptionMock };
          },
        },
      });

      const { unmount } = renderTracingStrategyProvider(strategy);

      unmount();
      expect(removeSubscriptionMock).toHaveBeenCalled();
    });

    it('provides the correct strategy content', () => {
      const expectedAsset = Images.BlueGradientBackground;

      const strategy = factories.tracingStrategy.build({
        assets: {
          ...testStrategyAssets,
          personalPrivacyBackground: expectedAsset,
        },
      });

      const { getByTestId } = renderTracingStrategyProvider(strategy);

      const assets = getByTestId('tracing-strategy-assets');

      expect(assets).toHaveProp('source', {
        testUri: '../../../app/assets/images/blueGradientBackground.png',
      });
    });

    describe('when the user is on the HomeScreen', () => {
      it('Shows the correct component', async () => {
        const HomeScreen = () => {
          return <View testID={'home-screen'} />;
        };

        const strategy = factories.tracingStrategy.build({
          homeScreenComponent: HomeScreen,
        });

        const { getByTestId } = renderTracingStrategyProvider(strategy);

        const homeScreen = getByTestId('home-screen');

        expect(homeScreen).toBeTruthy();
      });
    });
  });
});

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
});
