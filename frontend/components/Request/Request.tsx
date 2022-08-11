import React from 'react';
import TransactionActionApproval from './TransactionActionApproval';
import {
  Action,
  SendTransactionAction,
  PersonalSignAction,
} from '/lib/ActionQueueStore';
import SignatureActionApproval from '/components/Request/SignatureActionApproval';
import { RpcMethods } from '../../lib/types/transactions';

const ActionPanel = ({ action }: { action: Action }) => {
  if (action.type === RpcMethods.EthSendTransaction) {
    return (
      <TransactionActionApproval action={action as SendTransactionAction} />
    );
  } else if (action.type === RpcMethods.PersonalSign) {
    return <SignatureActionApproval action={action as PersonalSignAction} />;
  }
  return <div> Unsupported Action </div>;
};

// TODO: add log of chain ID and also style.
// TODO: indicator for how many actions there are remaining that is styled.
const RequestPane = ({ action }: { action: Action }) => {
  if (action == null) {
    return <div>Error: rendered request screen with no requests</div>;
  }
  return (
    <div className="flex flex-col items-center text-white">
      <div className="flex text-xl mt-7 font-bold tracking-widest">
        {action.type === RpcMethods.EthSendTransaction
          ? 'TRANSACTION'
          : 'SIGNATURE'}
      </div>
      {/* <div className="flex">{actionCount.toString()} actions left</div> */}
      <div className="flex w-75 h-79 rounded-lg">
        <div className="mt-4 text-center font-normal font-mono text-sm">{action.dappMetadata?.name ?? 'Unknown app'}</div>
      </div>
      {action.dappMetadata?.url && (
        <div className="flex">{action.dappMetadata?.url}</div>
      )}
      <ActionPanel action={action} />
    </div>
  );
};

export default RequestPane;
