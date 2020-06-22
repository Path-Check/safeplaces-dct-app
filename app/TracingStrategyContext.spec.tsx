import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { render, cleanup } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

import TracingStrategyContext, {
  TracingStrategyProvider,
} from './TracingStrategyContext';
import { TracingStrategy } from './tracingStrategy';

afterEach(cleanup);

const renderTracingStrategyProvider = (strategy: TracingStrategy) => {
  const TestTracingStrategyConsumer = () => {
    const { name } = useContext(TracingStrategyContext);
    return (
      <View>
        <Text testID={'tracing-strategy-name'}>{name}</Text>
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
  describe('when given a tracing strategy with a permissions provider, expsoureInfo subscription, and a name', () => {
    it('renders with the correct name, mounts the permssions provider, and subscribes to the exspousre info events', async () => {
      const removeSubscriptionMock = jest.fn();
      const FakePermissionsProvider = ({
        children,
      }: {
        children: JSX.Element;
      }): JSX.Element => {
        return <View testID={'fake-permissions-provider'}>{children}</View>;
      };

      const strategy: TracingStrategy = {
        name: 'test-strategy',
        exposureInfoSubscription: () => {
          return { remove: removeSubscriptionMock };
        },
        permissionsProvider: FakePermissionsProvider,
      };

      const { getByTestId, unmount } = renderTracingStrategyProvider(strategy);

      const name = getByTestId('tracing-strategy-name');
      const permissionsProvider = getByTestId('fake-permissions-provider');

      expect(name).toHaveTextContent('test-strategy');
      expect(permissionsProvider).toBeTruthy();
      unmount();
      expect(removeSubscriptionMock).toHaveBeenCalled();
    });
  });
});
