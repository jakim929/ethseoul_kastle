import { useEffect, useState } from 'react';
import Router from 'next/router';
import { TransactionBase } from '@shared/types/RelayableExecution';
import { Subscribable } from '/lib/Subscribable';
import {DappMetadata, RpcMethods, SupportedRpcMethods} from './types/transactions';
import {ContractTransaction} from 'ethers';
import { TypedData } from '/lib/types/eip712';

export interface Action<
  T extends SupportedRpcMethods = SupportedRpcMethods,
  U = any
> {
  type: T;
  data: U;
  onComplete: () => void;
  dappMetadata?: DappMetadata;
}

export interface ApprovableAction<T extends SupportedRpcMethods, U>
  extends Action<T, U> {
  onApprove: Function;
  onReject: Function;
}

export interface SendTransactionAction
  extends ApprovableAction<RpcMethods.EthSendTransaction, TransactionBase> {
  onApprove: (contractTransaction: ContractTransaction) => void;
  onReject: () => void;
}

export interface PersonalSignAction
  extends ApprovableAction<RpcMethods.PersonalSign, string> {
  onApprove: (signature: string) => void;
  onReject: () => void;
}

export interface SignTypedDataAction
  extends ApprovableAction<RpcMethods.SignTypedData, TypedData> {
  onApprove: (signature: string) => void;
  onReject: () => void;
}

class ActionQueueClass extends Subscribable<Action[]> {
  queue: Action[] = [];
  constructor() {
    super();
  }

  getState() {
    return this.queue;
  }

  add(action: Omit<Action, 'onComplete'>) {
    const queueItem: Action = {
      ...action,
      onComplete: () => this.remove(queueItem),
    };
    this.queue = [...this.queue, queueItem];
    this.notify();
  }

  remove(action: Action) {
    this.queue = this.queue.filter((x) => x !== action);
    this.notify();
  }
}

const ActionQueueStore = new ActionQueueClass();

const useActionQueue = () => {
  const [actionQueue, setActionQueue] = useState<Action[]>(ActionQueueStore.getState());
  useEffect(() => {
    return ActionQueueStore.subscribe((newState: Action[]) =>
      setActionQueue(newState)
    );
  }, []);
  return actionQueue;
};

const useFirstAction = (): {
  action: Action | null;
  actionCount: number;
} => {
  const actionQueue = useActionQueue();
  const firstAction = actionQueue[0] || null;
  return {
    actionCount: actionQueue.length,
    action: firstAction || null,
  };
};

function addAction<T extends Action>(action: Omit<T, 'onComplete'>) {
  ActionQueueStore.add(action);
  Router.push('/activity');
}

export { ActionQueueStore, useActionQueue, useFirstAction, addAction };
