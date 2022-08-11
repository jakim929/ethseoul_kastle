// eventually, we will want to use https://docs.alchemy.com/reference/alchemy-getassettransfers
// for now, let's just take the transactions from the action queue

import { useLocalStorageValue } from '@react-hookz/web';
import {chainIdToChain} from '@shared/types/chain';
import { Transaction, transactionsStorageKey } from '/lib/types/transactions';
import {useTransactionStateTracker} from '/lib/useTransactionStateTracker';

// To go from contract address to function, get the ABI for the contract
// from etherscan and then use a decoder.

// For abi decoding, https://github.com/ConsenSys/abi-decoder
//
// turn unix timestamp into date string of form "YYYY-MM-DD HH:MM"
const timestampToDateString = (timestamp?: number): string => {
  if (timestamp == null) {
    return 'Still pending';
  }
  const date = new Date(timestamp * 1000);
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
};

const TransactionRow = ({ txn }: { txn: Transaction }) => {
  const { status } = useTransactionStateTracker(txn.contractTransaction.hash, 2, chainIdToChain(txn.contractTransaction.chainId));

  return (
    <div className="flex flex-col">
      <div>Transaction Hash: {txn.contractTransaction?.hash}</div>
      <div>
        Status: {status}
      </div>
      {/* <div> */}
      {/*   Time: {timestampToDateString(txn.contractTransaction.timestamp)} */}
      {/* </div> */}
      <div>To: {txn.contractTransaction?.to}</div>
      <hr className="dashed" />
    </div>
  );
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useLocalStorageValue<
    Array<Transaction>
  >(transactionsStorageKey, [], { initializeWithStorageValue: false });
  return (
    <div className="flex flex-col">
      <u>Transaction History</u>
      {transactions?.reverse().map((txn, i) => (
        <TransactionRow key={i} txn={txn} />
      ))}
    </div>
  );
};

export default TransactionHistory;
