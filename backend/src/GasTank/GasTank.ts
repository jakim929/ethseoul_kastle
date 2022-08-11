import { ContractTransaction, ethers } from 'ethers';
import axios, { AxiosResponse } from 'axios';
import { chainIdToChain } from '../../../shared/types/chain';

type CoinGeckoResponse = {
  ethereum: {
    usd: number;
  };
};

const fetchEthereumPriceFromCoinGecko = async () => {
  const { data }: AxiosResponse<CoinGeckoResponse> = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
  );
  return data.ethereum.usd;
};

class GasTankCls {
  remainingBalanceByUser: Record<string, number> = {};
  getBalanceForUser(userAddress: string): number {
    if (this.remainingBalanceByUser[userAddress] === undefined) {
      this.remainingBalanceByUser[userAddress] = 1000;
    }
    return this.remainingBalanceByUser[userAddress];
  }
  async subtractBalanceForUser(
    userAddress: string,
    contractTransaction: ContractTransaction,
  ): Promise<void> {
    const gasCost = contractTransaction.gasLimit;
    const ethereumPrice = await fetchEthereumPriceFromCoinGecko();

    const provider = chainIdToChain(contractTransaction.chainId).provider;

    const gasPrice = await provider.getGasPrice();

    const feeInCents = gasPrice
      .mul(gasCost)
      .mul(ethereumPrice * 100)
      .div(ethers.constants.WeiPerEther);

    this.remainingBalanceByUser[userAddress] -= feeInCents.toNumber();
  }
}

const GasTank = new GasTankCls();

export { GasTank };
