import React from 'react';
import { View, Text } from 'react-native';
import { render, cleanup } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

import {
  useTracingStrategyContext,
  TracingStrategyProvider,
  useStrategyContent,
} from './TracingStrategyContext';
import {
  testStrategyAssets,
  testStrategyCopy,
  testInterpolatedStrategyCopy,
} from './factories/tracingStrategy';
import { factories } from './factories';
import { Images } from '../app/assets/images/';

import { TracingStrategy } from './tracingStrategy';

afterEach(cleanup);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const renderTracingStrategyProvider = (strategy: TracingStrategy) => {
  const TestTracingStrategyConsumer = () => {
    const { name, homeScreenComponent } = useTracingStrategyContext();
    const {
      StrategyAssets,
      StrategyCopy,
      InterpolatedStrategyCopy,
    } = useStrategyContent();

    const HomeScreen = homeScreenComponent;

    return (
      <View>
        <Text testID={'tracing-strategy-name'}>{name}</Text>
        <Text testID={'tracing-strategy-assets'}>
          {StrategyAssets.personalPrivacyBackground}
        </Text>
        <Text testID={'tracing-strategy-copy'}>{StrategyCopy.aboutHeader}</Text>
        <Text testID={'tracing-strategy-interpolated-copy'}>
          {InterpolatedStrategyCopy.exportCodeBody('code-body-name')}
        </Text>
        <HomeScreen testID={'home-screen'} />
      </View>
    );
  };

  return render(
    <TracingStrategyProvider strategy={strategy}>
      <TestTracingStrategyConsumer />
    </TracingStrategyProvider>,
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
        exposureInfoSubscription: () => {
          return { remove: removeSubscriptionMock };
        },
      });

      const { unmount } = renderTracingStrategyProvider(strategy);

      unmount();
      expect(removeSubscriptionMock).toHaveBeenCalled();
    });

    it('provides the correct strategy content', () => {
      const expectedAsset = Images.BlueGradientBackground;
      const expectedCopy = 'Test About Header';
      const expectedCodeBody = (name: string) => {
        return `expectedCodeBody ${name}`;
      };

      const strategy = factories.tracingStrategy.build({
        assets: {
          ...testStrategyAssets,
          personalPrivacyBackground: expectedAsset,
        },
        useCopy: () => {
          return {
            ...testStrategyCopy,
            aboutHeader: expectedCopy,
          };
        },
        useInterpolatedCopy: () => {
          return {
            ...testInterpolatedStrategyCopy,
            exportCodeBody: expectedCodeBody,
          };
        },
      });

      const { getByTestId } = renderTracingStrategyProvider(strategy);

      const assets = getByTestId('tracing-strategy-assets');
      const copy = getByTestId('tracing-strategy-copy');
      const interpolatedCopy = getByTestId(
        'tracing-strategy-interpolated-copy',
      );

      expect(assets).toHaveTextContent(expectedAsset);
      expect(copy).toHaveTextContent(expectedCopy);
      expect(interpolatedCopy).toHaveTextContent(
        expectedCodeBody('code-body-name'),
      );
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
