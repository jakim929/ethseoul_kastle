import React from 'react';
import Button from '/components/Button';
import TransactionActionApproval from './TransactionActionApproval';
import {
  useFirstAction,
  addAction,
  Action,
  SendTransactionAction,
  PersonalSignAction,
} from '/lib/ActionQueueStore';
import SignatureActionApproval from './SignatureActionApproval';
import {
  RpcMethods,
  Transaction,
  transactionsStorageKey,
} from '../lib/types/transactions';
import {
  updateTransactions,
} from '/lib/transactions';
import { useLocalStorageValue } from '@react-hookz/web';
import {getSingleUSDCTransferUnsignedTxn_TEST} from '/lib/mocks';

const AddSingleUSDCTransferActionButton_GOERLI = () => {
  const [transactions, setTransactions] = useLocalStorageValue<Transaction[]>(
    transactionsStorageKey,
    [],
    { initializeWithStorageValue: false }
  );
  return (
    <Button
      onClick={() => {
        const txn = getSingleUSDCTransferUnsignedTxn_TEST(
          '0x9F80dd20E8a00dC68d15d7b1ca28a62275D07322'
        );
        addAction<SendTransactionAction>({
          type: RpcMethods.EthSendTransaction,
          dappMetadata: {
            name: 'USDC Transfer',
            url: 'circle.com',
          },
          data: txn,
          onApprove: (contractTransaction) => {
            updateTransactions(
              setTransactions,
              contractTransaction,
              transactions
            );
            console.log('Action Item confirm approve!');
          },
          onReject: () => {
            console.log('Action Item confirm reject!');
          },
        });
      }}
    >
      Initiate USDC Transasction
    </Button>
  );
};

const AddSingleSignatureActionButton = () => {
  return (
    <Button
      onClick={() => {
        addAction<PersonalSignAction>({
          type: RpcMethods.PersonalSign,
          dappMetadata: {
            name: 'Fake signing app',
            url: 'fakedappforsigning.com',
          },
          data: 'Please sign this message! From James',
          onApprove: (sig: string) => {
            console.log('Action Item confirm approve! signature created:', sig);
          },
          onReject: () => {
            console.log('Action Item confirm reject!');
          },
        });
      }}
    >
      Initiate Signature Request
    </Button>
  );
};

const TestAddActionOptions = () => {
  return (
    <div>
      <AddSingleUSDCTransferActionButton_GOERLI />
      <AddSingleSignatureActionButton />
    </div>
  );
};

const ActionHandlerPanel = ({ action }: { action: Action }) => {
  if (action.type === RpcMethods.EthSendTransaction) {
    return (
      <TransactionActionApproval action={action as SendTransactionAction} />
    );
  } else if (action.type === RpcMethods.PersonalSign) {
    return <SignatureActionApproval action={action as PersonalSignAction} />;
  }
  return <div> Unsupported Action </div>;
};

const SendTransactionPanel = () => {
  const { actionCount, action } = useFirstAction();
  if (!action) {
    return <TestAddActionOptions />;
  }
  return (
    <div>
      actionCount: {actionCount}
      <TestAddActionOptions />
      <ActionHandlerPanel action={action} />
    </div>
  );
};

export default SendTransactionPanel;
