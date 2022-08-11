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
  console.log('userwallet addr', await UserWallet.getAddress());

  const baseSignature = await UserWallet.signMessage(
    ethers.utils.arrayify(ethers.utils.keccak256(executionObject))
  );
  const signature = baseSignature + '01';

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
  const { data } = result;
  return data.contractTransaction;
};

export {
  executeSendTransactions
}
