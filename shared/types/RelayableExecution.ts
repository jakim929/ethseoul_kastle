import { UnsignedTransaction } from "ethers";
import {DappMetadata} from "/lib/types/transactions";

// type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
type RequiredPick<T, K extends keyof T> = Required<Pick<T, K>>;

export type TransactionBase = RequiredPick<
  UnsignedTransaction,
  "to" | "value" | "data" | "chainId"
> & { dappMetadata?: DappMetadata };

export type RelayableExecution = {
  txns: Array<TransactionBase>;
  signature: string;
};
