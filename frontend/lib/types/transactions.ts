export type GasType = 'gasless' | 'fiat';
import { ethers } from 'ethers';
import {
  TransactionReceipt,
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider';

export const transactionsStorageKey = 'kastle_transactions';

// TODO: better name here
export enum TransactionStatusEnum {
  PendingMine = 'PENDING_MINE',
  PendingConfirmations = 'PENDING_CONFIRMATIONS',
  TransactionExcluded = 'TRANSACTION_EXCLUDED',
  Confirmed = 'CONFIRMED',
}
const transactionStatusList = [
  TransactionStatusEnum.PendingMine,
  TransactionStatusEnum.PendingConfirmations,
  TransactionStatusEnum.TransactionExcluded,
  TransactionStatusEnum.Confirmed,
];
export type TransactionStatus = typeof transactionStatusList[number];

export type TransactionAll = {
  request: TransactionRequest;
  response: TransactionResponse;
  receipt: TransactionReceipt;
};

export type Transaction = {
  // raw
  request?: TransactionRequest; // TODO: make request a required field once we have gas data
  contractTransaction: ethers.ContractTransaction;
  receipt?: TransactionReceipt;
  // our own fields
  gasType?: GasType; // TODO: add this
  status: TransactionStatus;
  // Data we might have - enhanced
  dappMetadata?: DappMetadata;
};

export type TransactionState = {
  status: TransactionStatus;
  confirmationCount: number | null;
};

// Using enums like this for purpose of not having to use 'typeof PERSONAL_SIGN' to create a type from string constants
export enum RpcMethods {
  PersonalSign = 'personal_sign',
  EthSendTransaction = 'eth_sendTransaction',
  SignTypedData = 'eth_signTypedData',
}

export const supportedMethodsList = [
  RpcMethods.PersonalSign,
  RpcMethods.EthSendTransaction,
  RpcMethods.SignTypedData,
];

export type SupportedRpcMethods = typeof supportedMethodsList[number];

export type DappMetadata = {
  name?: string;
  url?: string;
  description?: string;
  icon?: string;
}
