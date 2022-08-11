import { Subscribable } from '/lib/Subscribable';
import { sleep } from '/lib/sleep';
import {
  TransactionState,
  TransactionStatus,
  TransactionStatusEnum,
} from '/lib/types/transactions';
import { ethers } from 'ethers';
import { Chain } from './chain';

const assert = (val: boolean, message?: string) => {
  if (!val) {
    throw new Error(message || 'Assertion failed');
  }
};

// https://ethereum.org/en/developers/docs/transactions/#transaction-lifecycle
// @TODO: JAMES - We can add more intermediate states and stuff here

const possibleTransitions: Record<TransactionStatus, TransactionStatusEnum[]> =
  {
    PENDING_MINE: [
      TransactionStatusEnum.PendingConfirmations,
      TransactionStatusEnum.TransactionExcluded,
    ],
    PENDING_CONFIRMATIONS: [TransactionStatusEnum.Confirmed],
    CONFIRMED: [],
    TRANSACTION_EXCLUDED: [],
  };

class TransactionStateTracker extends Subscribable<TransactionState> {
  currentState: TransactionStatus = TransactionStatusEnum.PendingMine;
  transactionHash: string;
  requiredConfirmationCount: number;
  confirmationCount: number | null;
  minedBlockNumber: number | null;
  provider: ethers.providers.Provider;

  constructor(
    transactionHash: string,
    requiredNumConfirmations: number,
    chain: Chain,
  ) {
    super();
    this.transactionHash = transactionHash;
    this.requiredConfirmationCount = requiredNumConfirmations;
    this.confirmationCount = null;
    this.minedBlockNumber = null;
    this.provider = chain.provider;
    this.__trackTransaction();
  }

  // TODO: James - Need to check for re-orgs as well
  __trackTransaction = async () => {
    console.log('starting track!');
    while (this.currentState !== TransactionStatusEnum.Confirmed) {
      if (this.currentState === TransactionStatusEnum.PendingMine) {
        const response = await this.provider.getTransaction(
          this.transactionHash
        );
        if (response === null) {
          await sleep(5000);
        } else {
          const { blockNumber } = response;
          if (!!blockNumber) {
            this.minedBlockNumber = blockNumber;
            this.onMineSuccess();
          } else {
            console.log('starting sleep1');
            await sleep(5000);
            console.log('ending sleep1');
          }
        }
      } else if (
        this.currentState === TransactionStatusEnum.PendingConfirmations
      ) {
        assert(this.minedBlockNumber !== null, 'minedBlockNumber is null');
        const currentBlockNumber = await this.provider.getBlockNumber();
        const minedBlockNumber = this.minedBlockNumber!;
        this.updateConfirmationCount(currentBlockNumber - minedBlockNumber);
        assert(
          currentBlockNumber >= minedBlockNumber,
          'currentBlockNumber is less than minedBlockNumber. Maybe reorg?'
        );
        if (this.confirmationCount! >= this.requiredConfirmationCount) {
          this.onConfirmationSuccess();
        } else {
          console.log('starting sleep2');

          await sleep(10000);
          console.log('ending sleep2');
        }
      } else {
        assert(false, 'Impossible!');
      }
    }
  };

  updateConfirmationCount = (confirmationCount: number) => {
    if (this.confirmationCount === confirmationCount) {
      return;
    }
    this.confirmationCount = confirmationCount;
    this.notify();
  };

  moveToState = (newState: TransactionStatus) => {
    if (!possibleTransitions[this.currentState].includes(newState)) {
      throw new Error(
        `Invalid state transition from ${this.currentState} to ${newState}`
      );
    }
    this.currentState = newState;
    console.log(`Hash ${this.transactionHash} new state: ${this.currentState}`);
    this.notify();
  };
  onMineSuccess = () => {
    this.moveToState(TransactionStatusEnum.PendingConfirmations);
  };
  onTransactionExcluded = () => {
    this.moveToState(TransactionStatusEnum.TransactionExcluded);
  };
  onConfirmationSuccess = () => {
    this.moveToState(TransactionStatusEnum.Confirmed);
  };

  getState = () => {
    return {
      status: this.currentState,
      confirmationCount: this.confirmationCount,
    };
  };
}

class TransactionStateTrackerStoreClass {
  trackerByHash: Record<string, TransactionStateTracker> = {};
  addTracker = (
    hash: string,
    requiredConfirmationCount: number,
    chain: Chain,
  ) => {
    if (this.trackerByHash[hash]) {
      return this.trackerByHash[hash];
    }
    const newTracker = new TransactionStateTracker(
      hash,
      requiredConfirmationCount,
      chain,
    );
    this.trackerByHash = {
      ...this.trackerByHash,
      [hash]: newTracker,
    };
    return newTracker;
  };
  removeTracker = (hash: string) => {
    this.trackerByHash = { ...this.trackerByHash };
    delete this.trackerByHash[hash];
  };
}

export { TransactionStateTrackerStoreClass };
