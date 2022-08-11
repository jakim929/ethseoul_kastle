import { Transaction, transactionsStorageKey } from '/lib/types/transactions';

import { chainIdToChain } from '@shared/types/chain';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useLocalStorageValue } from '@react-hookz/web';
import { useTransactionStateTracker } from '/lib/useTransactionStateTracker';

const colorMapping = (status: string): string => {
  switch (status) {
    case 'PENDING_CONFIRMATION':
      return 'text-nectarine';
    case 'CONFIRMED':
      return 'text-meadows';
    default:
      return 'text-nectarine';
  }
}

const HistoryRow = ({ transaction, index }: { transaction: Transaction, index: number }) => {
  const { status } = useTransactionStateTracker(
    transaction.contractTransaction.hash,
    2,
    chainIdToChain(5)
  );
  dayjs.extend(relativeTime);
  // console.log(transaction.contractTransaction);
  // console.log(dayjs(transaction.contractTransaction.timestamp).format());
  return (
    <div className="flex px-5 py-2 text-xs items-center">
      <div className="flex-1 flex flex-col text-white">
        <div>{transaction.contractTransaction.hash.substring(0, 10)}...</div>
        <div className="text-2xs text-neutral-400">
          {index === 0 ?  'A moment ago' : (index * 10).toString() + ' minutes ago'}
          {/* {dayjs(transaction.contractTransaction.timestamp).fromNow()} */}
        </div>
      </div>
      <div className={colorMapping(status)}>{status}</div>
    </div>
  );
};

const History = () => {
  const [transactions = [], setTransactions] = useLocalStorageValue<
    Array<Transaction>
  >(transactionsStorageKey, [], { initializeWithStorageValue: false });
  // console.log(transactions)
  // const sliced : Transaction[] = transactions ? [transactions[0]].filter(x => !!x) : [];
  // take last 5 transactions in transactinos array.
  const transactionsToUse = transactions.slice(-5).reverse();
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
      {transactionsToUse.map((txn, i) => {
        // The above is a hackfor hackathon. TODO: don't slice that shit.
        return (
          <HistoryRow index={i} key={txn.contractTransaction.hash} transaction={txn} />
        );
      })}
    </div>
  );
};

export default History;
