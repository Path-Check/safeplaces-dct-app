import React, { createContext, useState, useContext } from 'react';

interface AffectedUserContextState {
  code: string;
  setCode: (code: string) => void;
}

const AffectedUserContext = createContext<AffectedUserContextState | undefined>(
  undefined,
);

export const AffectedUserProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [code, setCode] = useState('');

  return (
    <AffectedUserContext.Provider value={{ code, setCode }}>
      {children}
    </AffectedUserContext.Provider>
  );
};

export const useAffectedUserContext = (): AffectedUserContextState => {
  const context = useContext(AffectedUserContext);
  if (context === undefined) {
    throw new Error('TracingStrategyContext must be used with a provider');
  }
  return context;
};
