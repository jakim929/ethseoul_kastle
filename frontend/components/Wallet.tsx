import SendTransaction from '/components/SendTransactionPanel';
import ConnectorsPanel from '/components/ConnectorsPanel';
import WalletConnectInput from './WalletConnectInput';
import TransactionHistory from './TransactionHistory';
import GasTank from '/components/GasTank';
import Assets from './Assets';

const Wallet = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex">
        <SendTransaction />
      </div>
      <ConnectorsPanel />
      <div className="flex">
        <div className="flex flex-col flex-1">
          <div className="flex">My Apps</div>
          <div className="flex"><GasTank /></div>
          <Assets />
        </div>
        <div className="flex flex-1">
          <div className="flex flex-col">
            <div className="flex">My Actions</div>
            <div className="flex">Activities I follow</div>
            <div className="flex">
              <WalletConnectInput/>
            </div>
          </div>
        </div>
      </div>
      <TransactionHistory />
    </div>
  );
};

export default Wallet;
