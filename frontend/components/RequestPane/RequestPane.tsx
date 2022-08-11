import React, { useState } from 'react';
import {
  Action,
  SendTransactionAction,
  PersonalSignAction,
  SignTypedDataAction,
} from '/lib/ActionQueueStore';
import SignatureActionApproval from '/components/RequestPane/SignatureActionApproval';
import { DappMetadata, RpcMethods } from '/lib/types/transactions';
import { useSWRConfig } from 'swr';
import { useTransactionStateTracker } from '/lib/useTransactionStateTracker';
import { GasEstimation } from '/components/GasEstimation';
import { Chain, chainIdToChain } from '@shared/types/chain';
import ActionButton from './ActionButton';
import { executeSendTransactions } from '/lib/executeSendTransactions';
import { useGasTankBalance } from '/lib/useGasTankBalance';
import { formatCents } from '/lib/formatCents';
import Router from 'next/router';
import Activity from '/pages/activity';
import SignTypedDataActionApproval from '/components/RequestPane/SignTypedDataActionApproval';

const TransactionActionLoadingState = ({
  transactionHash,
  onComplete,
  chain,
}: {
  transactionHash: string;
  onComplete: () => void;
  chain: Chain;
}) => {
  const { status, confirmationCount } = useTransactionStateTracker(
    transactionHash,
    2,
    chain,
    onComplete
  );
  return (
    <div>
      <div>status: {status}</div>
      <div>
        confirmationCount:{' '}
        {confirmationCount === null ? '...' : confirmationCount}
      </div>
    </div>
  );
};

const TransactionActionApproval = ({
  action,
}: {
  action: SendTransactionAction;
}) => {
  const { mutate } = useSWRConfig();
  const {data: balance} = useGasTankBalance();

  // Right now just rendering the first txn
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { onApprove, onReject, onComplete, data: transactionBase } = action;

  const { to, value, data } = transactionBase;
  // if (transactionHash) {
  //   // return <Activity />;
  //   return (
  //     <TransactionActionLoadingState
  //       transactionHash={transactionHash}
  //       onComplete={onComplete}
  //       chain={chainIdToChain(transactionBase.chainId)}
  //     />
  //   );
  // }
  return (
    <div className="flex flex-col text-white">
      <div className="font-bold text-base">
        To
      </div>
      <div className="font-mono text-sm">
        {to.slice(0,8)}...{to.slice(37,42)}
      </div>
      {/* <div className="font-bold text-base"> */}
      {/*   Data */}
      {/* </div> */}
      {/* <div className="font-mono text-sm"> */}
      {/*   {data.toString().slice(0, 20)}... */}
      {/* </div> */}
      <div className="font-bold text-base">
        Amount to send
      </div>
      <div className="font-mono text-sm">
        10 USDC
        {/* {`${value.toString()} ${chainIdToChain(action.data.chainId).nativeTicker}`} */}
      </div>
      {/* <div className="break-words max-w-md">Data: {data.toString()}</div> */}
      <GasEstimation txns={[transactionBase]} />
      <ActionButton
        primaryText={'CONFIRM'}
        secondaryText={`Gas tank balance: ${balance ? formatCents(balance) : '...'}`}
        extraClass={"bg-meadows"}
        onClick={async () => {
          const contractTransaction = await executeSendTransactions([
            transactionBase,
          ]);
          if (contractTransaction == null) {
            console.log('error occurred');
            return;
          }
          mutate('http://localhost:3001/getGasTankBalance');
          console.log('hmmm', contractTransaction);
          setTransactionHash(contractTransaction.hash);
          onApprove(contractTransaction);
          onComplete();
        }}
      />
      {/* TODO: think more about best way to have 2 confirm buttons*/}
      <ActionButton
        extraClass={"bg-lipstick"}
        primaryText={'REJECT'}
        onClick={async () => {
          onReject();
          onComplete();
        }}
      />
    </div>
  );
};

const ActionPanel = ({ action }: { action: Action }) => {
  if (action.type === RpcMethods.EthSendTransaction) {
    return (
      <TransactionActionApproval action={action as SendTransactionAction} />
    );
  } else if (action.type === RpcMethods.PersonalSign) {
    return <SignatureActionApproval action={action as PersonalSignAction} />;
  } else if (action.type === RpcMethods.SignTypedData) {
    return <SignTypedDataActionApproval action={action as SignTypedDataAction} />;
  }
  return <div> Unsupported Action </div>;
};

const DappDescriptionSection = ({ dappMetadata } : {
  dappMetadata?: DappMetadata;
}) => {
  if (!dappMetadata) {
    return null;
  }
  return (
    <div className="flex flex-col">
      <div className="flex w-75 h-79 rounded-lg">
        <div className="mt-4 text-center font-normal font-mono text-sm">{dappMetadata.name ?? 'Unknown app'}</div>
      </div>
      {dappMetadata.url && (
        <div className="flex font-mono">{dappMetadata.url}</div>
      )}
    </div>

  );
}

// TODO: add log of chain ID and also style.
// TODO: indicator for how many actions there are remaining that is styled.
const RequestPane = ({ action }: { action: Action }) => {
  const actionCount = 2;

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
      <DappDescriptionSection dappMetadata={action.dappMetadata} />
      <ActionPanel action={action} />
    </div>
  );
};

export default RequestPane;
