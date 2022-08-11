import { useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { ConnectorsStore } from '/lib/GlobalStore';
import walletConnectLogo from '/public/chain_logos/walletConnect.png';
import {Connectors} from '/lib/connectors/util';

const WalletConnectLinkPasteZone = () => {
  const [val, setVal] = useState<string>('');
  return (
    <div
      className="
        hover:opacity-80
        bg-zinc-800
        p-1
        flex
        items-center
        rounded-full
        shadow
        shadow-black"
    >
      <div
        className="
          mr-2
          ml-1
          flex
        "
      >
        <Image src={walletConnectLogo} height={24} width={24} />
      </div>
      <input
        onChange={async (e) => {
          const uri = e.target.value;
          setVal(uri);
          console.log(uri);
          const res = await ConnectorsStore.addConnectorByUri(uri);
          if (res == null) {
            alert('invalid WalletConnect URI');
          } else {
            // TODO: create some pleasant UI for showing connection was added.
          }
          setVal('');
        }}
        type="text"
        placeholder="Paste WalletConnect link here"
        value={val}
        className="
            w-64
            flex
            items-center
            bg-zinc-700
            rounded-full
            py-1
            px-2
            h-6
            text-xs
            placeholder:text-center
            text-neutral-300"
      />
    </div>
  );
};

const ConnectToDappSection = () => {
  const [connectors, setConnectors] = useState<Connectors>({});
  useEffect(() => {
    setConnectors(ConnectorsStore.getState());
    return ConnectorsStore.subscribe((newState: Connectors) => {
      setConnectors(newState);
    });
  }, []);
  const numConnections = Object.entries(connectors).length;
  return (
    <div className="flex flex-col items-center">
      <WalletConnectLinkPasteZone />
      <div className="mt-2 uppercase text-sm text-white font-semibold tracking-widest">
        {Object.entries(connectors).length == 0 ? 'No dapps connected' : `${numConnections} dapp${numConnections > 1 ? 's' : ''} connected`}
      </div>
    </div>
  );
};

export default ConnectToDappSection;
