import { useEffect, useState } from 'react';
import { ConnectorsStore } from '/lib/GlobalStore';
import { Connectors } from '/lib/connectors/util';

const ConnectorsPanel = () => {
  const [connectors, setConnectors] = useState<Connectors>({});
  useEffect(() => {
    setConnectors(ConnectorsStore.getState());
    return ConnectorsStore.subscribe((newState: Connectors) => {
      setConnectors(newState);
    });
  }, []);
  return (
    <div className="flex border-t border-b border-black py-4 flex-col">
      Dapps Connected
      {Object.entries(connectors).map(([handshakeTopic, connector]) => (
        <div className="flex" key={handshakeTopic}>
          {connector.peerMeta?.name ?? 'Loading'}
          <button onClick={() => connector.killSession()}>
            Disconnect dapp
          </button>
        </div>
      ))}
      <div className="flex">
        {Object.entries(connectors).length == 0 ? 'No dapps connected' : ''}
      </div>
    </div>
  );
};

export default ConnectorsPanel;
