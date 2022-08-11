import { useLocalStorageValue } from '@react-hookz/web';
import { useEffect, useState } from 'react';
import { Chain } from '@shared/types/chain';
import { TransactionStateTrackerStore } from '/lib/GlobalStore';
import {
  Transaction,
  transactionsStorageKey,
  TransactionState,
  TransactionStatusEnum,
} from '/lib/types/transactions';

const useTransactionStateTracker = (
  hash: string,
  requiredConfirmationCount: number = 2,
  chain: Chain,
  onComplete?: () => void,
) => {
  const [transactionState, setTransactionState] = useState<TransactionState>({
    status: TransactionStatusEnum.PendingMine,
    confirmationCount: null,
  });

  useEffect(() => {
    // The useEffect hook is called twice, but that's because of strict mode (next.config.js has reactStrictMode: true)
    // https://stackoverflow.com/questions/53183362/what-is-strictmode-in-react

    const tracker = TransactionStateTrackerStore.addTracker(
      hash,
      requiredConfirmationCount,
      chain
    );
    setTransactionState(tracker.getState());
    const unsubscribeFn = tracker.subscribe(
      (newTransactionState: TransactionState) => {
        setTransactionState(newTransactionState)
        if (newTransactionState.status === TransactionStatusEnum.Confirmed) {
          if (onComplete) {
            onComplete();
          }
        }
      }
    );
    return () => {
      unsubscribeFn();
      TransactionStateTrackerStore.removeTracker(hash);
    };
  }, []);
  return transactionState;
};

export { useTransactionStateTracker };
