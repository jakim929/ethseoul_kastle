import { TransactionBase } from '@shared/types/RelayableExecution';
import { FiatTokenV21__factory } from '@wallet/typechain/index';
import { ethers } from 'ethers';
import { goerliChain } from '@shared/types/chain';
import React from 'react';
import Button from '/components/Button';
import {
  useFirstAction,
  addAction,
  Action,
  SendTransactionAction,
  PersonalSignAction,
} from '/lib/ActionQueueStore';
import {
  RpcMethods,
  Transaction,
  transactionsStorageKey,
} from '../lib/types/transactions';
import {
  addToTransactionHistory,
  contractTransactionToTransaction,
  updateTransactions,
} from '/lib/transactions';
import { useLocalStorageValue } from '@react-hookz/web';


// @TODO:JAMES The frontend may or may not have its own provider, but assuming it does for now.
export const getSingleUSDCTransferUnsignedTxn_TEST = (
  toAddress: string
): TransactionBase => {
  const usdcContract = FiatTokenV21__factory.connect(
    '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
    goerliChain.provider,
  );
  const data = usdcContract.interface.encodeFunctionData('transfer', [
    toAddress,
    ethers.utils.parseUnits('1', 6),
  ]);
  const unsignedTxn: TransactionBase = {
    to: usdcContract.address,
    value: 0,
    data: data,
    chainId: goerliChain.id,
    dappMetadata: {
      name: 'USDC Transfer (internal impl)',
      url: 'internaldapp.com',
    },
  };

  return unsignedTxn;
};


export const addSingleUSDCTransferActionGoerli = () => {
  console.log("addSingleUSDCTransferActionGoerli");

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
        addToTransactionHistory(contractTransactionToTransaction(contractTransaction));
        console.log('Action Item confirm approve!');
      },
      onReject: () => {
        console.log('Action Item confirm reject!');
      },
    });
};
