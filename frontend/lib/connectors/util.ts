import { IWalletConnectSession, IConnectorOpts } from '@walletconnect/types';
import { TransactionBase } from '/../shared/types/RelayableExecution';
import WalletConnect from '@walletconnect/client';

export type Connectors = Record<string, WalletConnect>;

export const STORAGE_KEY = 'walletconnect_storage';

export const setSession = (session: IWalletConnectSession) => {
  const storageValue = window.localStorage.getItem(STORAGE_KEY);
  if (storageValue == null) {
    const mapToStore = {
      [session.handshakeTopic]: session,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mapToStore));
  } else {
    const connectorsMap = JSON.parse(storageValue);
    connectorsMap[session.handshakeTopic] = session;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(connectorsMap));
  }
  return session;
};

export const generateGetSession = (handshakeTopic: string) => {
  return () => {
    const storage = window.localStorage.getItem(STORAGE_KEY);
    if (storage == null) {
      return null;
    }
    const connectorsMap = JSON.parse(storage);
    const session = connectorsMap[handshakeTopic];
    return session;
  };
};

export const generateRemoveSession = (handshakeTopic: string) => {
  return () => {
    const storage = window.localStorage.getItem(STORAGE_KEY);
    if (storage == null) {
      return null;
    }
    const connectorsMap: Record<string, any> = JSON.parse(storage);
    delete connectorsMap[handshakeTopic];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(connectorsMap));
  };
};

export type WalletConnectPayload = {
  id: number;
  jsonrpc: string;
  method: string;
  params: Array<{
    data: string;
    from: string;
    gas: string;
    to: string;
    value: string;
  }>;
};

export const createTransactionFromPayload = (
  payload: WalletConnectPayload
): TransactionBase => {
  const { params } = payload;
  const { data, to, value } = params[0];
  return {
    data,
    to,
    value,
    chainId: 137,
  };
};
