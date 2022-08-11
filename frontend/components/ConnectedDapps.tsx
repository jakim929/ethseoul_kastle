import { useEffect, useState } from 'react';
import { ConnectorsStore } from '/lib/GlobalStore';
import { Connectors } from '/lib/connectors/util';
import WalletConnect from '@walletconnect/client';
import ActionButton from './RequestPane/ActionButton';

const DappRow = ({ connector }: { connector: WalletConnect }) => {
  const displayUrl = connector.peerMeta?.url.replace(
    /^(https?:\/\/)?(www\.)?/,
    ''
  );
  return (
    <div className="flex px-5 py-2 text-xs">
      <div className="flex-1 flex flex-col text-white">
        <div>{connector.peerMeta?.name ?? 'Unknown'}</div>
        <div className="text-2xs text-neutral-400 font-mono">
          {displayUrl ?? 'Unknown'}
        </div>
      </div>
      <button
        className="hover:opacity-80 text-white bg-lipstick rounded-md p-1"
        onClick={(_) => connector.killSession()}
      >
        DISCONNECT
      </button>
    </div>
  );
};

const ConnectedDapps = () => {
  const [connectors, setConnectors] = useState<Connectors>({});
  useEffect(() => {
    setConnectors(ConnectorsStore.getState());
    return ConnectorsStore.subscribe((newState: Connectors) => {
      setConnectors(newState);
    });
  }, []);
  return (
    <div
      className="
      shadow-black
      shadow
      bg-neutral-800
      mx-8
      flex
      flex-col
      rounded-md
      divide-y
      divide-neutral-600"
    >
      {Object.entries(connectors).map(([handshakeTopic, connector]) => (
        <DappRow key={handshakeTopic} connector={connector} />
      ))}
    </div>
  );
};

export default ConnectedDapps;
