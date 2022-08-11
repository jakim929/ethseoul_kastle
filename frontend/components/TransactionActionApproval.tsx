import Button from '/components/Button';
import { SendTransactionAction } from '/lib/ActionQueueStore';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import React, { useState } from 'react';
import {
  RelayableExecution,
  TransactionBase,
} from '@shared/types/RelayableExecution';
import { Identity__factory } from '@wallet/typechain/index';
import { ethers } from 'ethers';
import {
  API_executeRequest,
  API_executeResponse,
} from '@shared/types/API_execute';
import { useTransactionStateTracker } from '/lib/useTransactionStateTracker';
import { UserWallet } from '/lib/UserWallet';
import { GasEstimation } from '/components/GasEstimation';
import { Chain, chainIdToChain } from '@shared/types/chain';

const getTxnTuple = (txn: TransactionBase): [string, string, string] => {
  console.log(txn);
  return [txn.to, txn.value.toString(), txn.data.toString()];
};

// Returns transaction hash
const executeSendTransactions = async (txns: TransactionBase[]) => {
  const chainId = txns[0].chainId;
  const identityContract = Identity__factory.connect(
    process.env.NEXT_PUBLIC_SCW_ADDRESS!,
    chainIdToChain(chainId).provider
  );

  const executionObject = ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint', 'uint', 'tuple(address, uint, bytes)[]'],
    [
      process.env.NEXT_PUBLIC_SCW_ADDRESS!,
      chainId,
      await identityContract.nonce(),
      txns.map(getTxnTuple),
    ]
  );

  console.log(executionObject);

  const baseSignature = await UserWallet.signMessage(
    ethers.utils.arrayify(ethers.utils.keccak256(executionObject))
  );
  const signature = baseSignature + '01';

  console.log(signature);
  const relayableExecution: RelayableExecution = {
    txns,
    signature,
  };

  const request: API_executeRequest = {
    relayableExecution,
    walletAddress: process.env.NEXT_PUBLIC_SCW_ADDRESS!,
  };

  const result = await axios.post<API_executeResponse>(
    `http://localhost:3001/execute`,
    request
  );

  console.log(result);
  const { data } = result;
  return data.contractTransaction;
};

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
    onComplete,
  );
  return (
    <div>
      <div>Loading...</div>
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

  // Right now just rendering the first txn
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { onApprove, onReject, onComplete, data: transactionBase } = action;

  const { to, value, data } = transactionBase;
  if (transactionHash) {
    return (
      <TransactionActionLoadingState
        transactionHash={transactionHash}
        onComplete={onComplete}
        chain={chainIdToChain(transactionBase.chainId)}
      />
    );
  }
  return (
    <div className="flex flex-col">
      <div>Transaction</div>
      <div>to: {to}</div>
      <div>value: {value.toString()}</div>
      <div>data: {data.toString()}</div>
      <div className="flex">
        <Button
          onClick={async () => {
            onReject();
            onComplete();
          }}
        >
          Reject
        </Button>
        <Button
          extraClass="ml-2 bg-gray-200"
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
          }}
        >
          Confirm
        </Button>
      </div>
      <GasEstimation txns={[transactionBase]} />
    </div>
  );
};

export default TransactionActionApproval;
