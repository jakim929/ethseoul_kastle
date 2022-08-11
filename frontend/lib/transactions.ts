import {Transaction, transactionsStorageKey, TransactionStatusEnum } from "/lib/types/transactions"
import {ContractTransaction} from "ethers";

export const addToTransactionHistory = (newTransaction: Transaction) => {
  const currentStateStr = window.localStorage.getItem(transactionsStorageKey);
  const currentState = currentStateStr ? JSON.parse(currentStateStr) : [];

  const newState = [...currentState, newTransaction];
  window.localStorage.setItem(transactionsStorageKey, JSON.stringify(newState));
}

export const updateTransactions = (setTransactions: (newValue: Transaction[]) => void, contractTransaction: ContractTransaction, oldTransactions: Transaction[]): void => {
  const newTransaction = contractTransactionToTransaction(contractTransaction);
  const newTransactions = [...oldTransactions, newTransaction];
  setTransactions(newTransactions);
}

// TODO: need better naming for Transaction here...coming out now
export const contractTransactionToTransaction = (contractTransaction: ContractTransaction): Transaction => {
  return {
    contractTransaction: contractTransaction,
    status: TransactionStatusEnum.PendingMine,
  };
}
