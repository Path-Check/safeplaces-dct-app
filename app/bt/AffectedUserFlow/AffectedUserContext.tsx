import React, { createContext, useState, useContext } from 'react';

type Token = string;
type Key = string;

interface AffectedUserContextState {
  code: string;
  setCode: (code: string) => void;
  certificate: Token | null;
  hmacKey: Key | null;
  setExposureSubmissionCredentials: (certificate: Token, hmacKey: Key) => void;
}

export const AffectedUserContext = createContext<
  AffectedUserContextState | undefined
>(undefined);

export const AffectedUserProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [code, setCode] = useState('');
  const [hmacKey, setHmacKey] = useState<Key | null>(null);
  const [certificate, setCertificate] = useState<Token | null>(null);

  const setExposureSubmissionCredentials = (
    certificate: Token,
    hmacKey: Key,
  ) => {
    setCertificate(certificate);
    setHmacKey(hmacKey);
  };

  return (
    <AffectedUserContext.Provider
      value={{
        code,
        setCode,
        hmacKey,
        certificate,
        setExposureSubmissionCredentials,
      }}>
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
