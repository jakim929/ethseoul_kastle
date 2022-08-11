export type API_getGasTankBalanceRequest = {
  walletAddress: string;
  //@TODO: James - Right now we don't have proper authentication on the backend
};

export type API_getGasTankBalanceResponse = {
  gasTankBalance: number;
};
