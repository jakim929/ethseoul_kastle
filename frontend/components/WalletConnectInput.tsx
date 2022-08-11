import { useState } from 'react';
import { ConnectorsStore } from '/lib/GlobalStore';

const onSubmit = async (uri: string) => {
  await ConnectorsStore.addConnectorByUri(uri);
};

const WalletConnectInput = () => {
  const [val, setVal] = useState<string>('');
  return (
    <div>
      <input
        placeholder="WalletConnect URI"
        value={val}
        onChange={(evt) => setVal(evt.target.value)}
      />
      <button
        onClick={async (_) => {
          await onSubmit(val);
          setVal('');
        }}
      >
        Connect WalletConnect
      </button>
    </div>
  );
};

export default WalletConnectInput;
