import { RelayableExecution } from "./RelayableExecution";
import {ContractTransaction} from "ethers";

export type API_executeRequest = {
  relayableExecution: RelayableExecution;
  walletAddress: string;
};

export type API_executeResponse = {
  success: boolean;
  contractTransaction: ContractTransaction | null;
  message?: string;
};
