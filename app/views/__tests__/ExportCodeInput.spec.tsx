import React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { fireEvent } from '@testing-library/react-native';

import { TracingStrategy } from '../../tracingStrategy';
import { factories } from '../../factories';
import { TracingStrategyProvider } from '../../TracingStrategyContext';
import ExportCodeInput from '../Export/ExportCodeInput';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
  NavigationRoute,
} from 'react-navigation';

const createTestProps = (): unknown => ({
  navigation: jest.fn(),
  route: {
    params: {
      selectedAuthority: 'pc',
    },
  },
});

interface NavProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: NavigationRoute;
}

afterEach(cleanup);

describe('<ExportCodeInput />', () => {
  it('when there is no text input', () => {
    const strategy = factories.tracingStrategy.build({
      name: 'test-strategy',
    });
    const { getByTestId } = renderTracingStrategyProvider(strategy);
    const button = getByTestId('next-button');
    expect(button).toBeDisabled();
  });

  it('when there is text input but the input code is < 6 characters', () => {
    const strategy = factories.tracingStrategy.build({
      name: 'test-strategy',
    });
    const { getByTestId } = renderTracingStrategyProvider(strategy);
    for (let i = 0; i < 5; i++) {
      const input = getByTestId(`input${i}`);
      fireEvent.changeText(input, '1');
    }
    const button = getByTestId('next-button');
    expect(button).toBeDisabled();
  });

  it('when the input code is 6 characters in length', () => {
    const strategy = factories.tracingStrategy.build({
      name: 'test-strategy',
    });
    const { getByTestId } = renderTracingStrategyProvider(strategy);
    for (let i = 0; i <= 5; i++) {
      const input = getByTestId(`input${i}`);
      fireEvent.changeText(input, '1');
    }
    const button = getByTestId('next-button');
    expect(button).not.toBeDisabled();
  });
});

const renderTracingStrategyProvider = (strategy: TracingStrategy) => {
  const TestTracingStrategyConsumer = () => {
    const props = createTestProps() as NavProps;
    return <ExportCodeInput {...props} />;
  };

  return render(
    <TracingStrategyProvider strategy={strategy}>
      <TestTracingStrategyConsumer />
    </TracingStrategyProvider>,
  );
};
