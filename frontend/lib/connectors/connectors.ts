import WalletConnect from '@walletconnect/client';
import WalletConnectCore from '@walletconnect/core';
import { IWalletConnectSession, IConnectorOpts } from '@walletconnect/types';
import { parseWalletConnectUri } from '@walletconnect/utils';
import { Subscribable } from '../Subscribable';
import * as cryptoLib from '@walletconnect/iso-crypto';
import {
  setSession,
  generateGetSession,
  generateRemoveSession,
  STORAGE_KEY,
  Connectors,
  createTransactionFromPayload,
} from './util';
import {
  addAction,
  PersonalSignAction,
  SendTransactionAction,
  SignTypedDataAction,
} from '/lib/ActionQueueStore';
import { RpcMethods, supportedMethodsList } from '../types/transactions';
import { TypedData } from '/lib/types/eip712';
import { TypedDataUtils } from "eth-sig-util";

export class ConnectorsStoreClass extends Subscribable<Connectors> {
  connectors: Connectors = {};
  constructor() {
    super();
    this._getCachedConnectors();
  }

  addConnectorListeners(connector: WalletConnectCore, handshakeTopic: string) {
    connector.on('session_request', async (error, payload) => {
      console.log('session_request payload', payload);
      if (error) {
        console.log('error in session_request', error);
        throw error;
      }
      this.connectors = { ...this.connectors };
      this.notify();
      console.log('connectors chainid', connector.chainId);
      connector.approveSession({
        accounts: [process.env.NEXT_PUBLIC_SCW_ADDRESS!],
        // accounts: [process.env.NEXT_PUBLIC_SCW_OWNER_ADDRESS!],

        // TODO: this is hacky. fix it
        // chainId: 5,
        chainId: Number(window.localStorage.getItem('selected_chain_id')),
      });
    });
    connector.on('call_request', async (error, payload) => {
      console.log('hello')
      console.log('call_request payload', payload);
      if (error) {
        console.log('error in call_request', error);
        throw error;
      }
      if (!supportedMethodsList.includes(payload.method)) {
        console.log('unsupported method', payload.method);
        connector.rejectRequest({
          id: payload.id,
          error: { message: 'Method not supported: ' + payload.method },
        });
        return;
      }
      // TODO: Actually call transaction from here.
      const dappMetadata = {
        name: connector.peerMeta?.name,
        url: connector.peerMeta?.url,
        description: connector.peerMeta?.description,
        icon:
          connector.peerMeta?.icons != null &&
          connector.peerMeta?.icons.length > 0
            ? connector.peerMeta?.icons[0]
            : undefined,
      };

      if (payload.method === RpcMethods.EthSendTransaction) {
        addAction<SendTransactionAction>({
          type: RpcMethods.EthSendTransaction,
          data: createTransactionFromPayload(payload),
          dappMetadata,
          onApprove: (hash) => {
            connector.approveRequest({ id: payload.id, result: hash });
          },
          onReject: () => {
            connector.rejectRequest({
              id: payload.id,
              error: { message: 'Request rejected' },
            });
          },
        });
      } else if (payload.method === RpcMethods.PersonalSign) {
        console.log('personal sign called');
        addAction<PersonalSignAction>({
          type: RpcMethods.PersonalSign,
          data: payload.params[0],
          dappMetadata,
          onApprove: (signature: string) => {
            console.log(
              'Action Item confirm approve! signature created:',
              signature
            );
            connector.approveRequest({ id: payload.id, result: signature });
          },
          onReject: () => {
            console.log('Action Item confirm reject!');
            connector.rejectRequest({
              id: payload.id,
              error: { message: 'Request rejected' },
            });
          },
        });
      } else if (payload.method === RpcMethods.SignTypedData) {
        console.log('sign typed data called');

        const signableDataBlob = payload.params[1];
        // @TODO: Security-wise, this is awful. Check for safe parsing
        const signableData : TypedData = (JSON.parse(signableDataBlob));
        console.log(signableData)
        addAction<SignTypedDataAction>({
          type: RpcMethods.SignTypedData,
          data: signableData,
          dappMetadata,
          onApprove: (signature: string) => {
            console.log(
              'Action Item confirm approve! signature created:',
              signature
            );
            connector.approveRequest({ id: payload.id, result: signature });
          },
          onReject: () => {
            console.log('Action Item confirm reject!');
            connector.rejectRequest({
              id: payload.id,
              error: { message: 'Request rejected' },
            });
          },
        });
      }
    });
    connector.on('disconnect', async (error, _) => {
      if (error) {
        console.log('error in disconnect', error);
        throw error;
      }
      delete this.connectors[handshakeTopic];
      this.connectors = { ...this.connectors };
      this.notify();
    });
  }

  async addConnectorByUri(uri: string) {
    const { handshakeTopic, key } = parseWalletConnectUri(uri);
    // TODO: This is hacky check. Make this more robust
    if (key == null || key === '') {
      return null;
    }
    const connectorOpts: IConnectorOpts = {
      cryptoLib,
      sessionStorage: {
        setSession,
        getSession: generateGetSession(handshakeTopic),
        removeSession: generateRemoveSession(handshakeTopic),
      },
      connectorOpts: {
        uri,
        storageId: STORAGE_KEY,
      },
    };
    const connector = new WalletConnectCore(connectorOpts);
    this.connectors = { ...this.connectors, [handshakeTopic]: connector };
    this.addConnectorListeners(connector, handshakeTopic);
    if (!connector.connected) {
      await connector.createSession();
    }
    this.connectors = { ...this.connectors, [handshakeTopic]: connector };
    this.notify();
    return connector;
  }

  async _addConnectorBySession(session: IWalletConnectSession) {
    const handshakeTopic = session.handshakeTopic;
    const connectorOpts: IConnectorOpts = {
      cryptoLib,
      sessionStorage: {
        setSession,
        getSession: generateGetSession(session.handshakeTopic),
        removeSession: generateRemoveSession(session.handshakeTopic),
      },
      connectorOpts: {
        storageId: STORAGE_KEY,
        session,
      },
    };
    const connector = new WalletConnectCore(connectorOpts);
    this.connectors = { ...this.connectors, [handshakeTopic]: connector };
    this.addConnectorListeners(connector, handshakeTopic);
    if (!connector.connected) {
      await connector.createSession();
    }
    this.notify();
    return connector;
  }

  async _getCachedConnectors(): Promise<Record<string, WalletConnect>> {
    // Wait for window to load.
    const localStorageVal = window.localStorage.getItem(STORAGE_KEY);
    if (localStorageVal == null) {
      return this.connectors;
    }
    const connectorsMap: Connectors = JSON.parse(localStorageVal);
    const handshakeTopicList = Object.keys(connectorsMap);
    await Promise.all(
      handshakeTopicList.map(async (t) => {
        this.connectors[t] = await this._addConnectorBySession(
          connectorsMap[t]
        );
      })
    );
    this.notify();
    return this.connectors;
  }

  getState(): Connectors {
    return this.connectors;
  }
}
