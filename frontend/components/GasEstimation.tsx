import axios, { AxiosResponse } from 'axios';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useFeeData } from 'wagmi';
import { TransactionBase } from '@shared/types/RelayableExecution';
import { Identity__factory } from '@wallet/typechain';
import { UserWallet } from '/lib/UserWallet';
import { formatCents } from '/lib/formatCents';
import {chainIdToChain} from '@shared/types/chain';

const getTxnTuple = (txn: TransactionBase): [string, string, string] => {
  console.log(txn);
  return [txn.to, txn.value.toString(), txn.data.toString()];
};

const estimateGas = async (txns: TransactionBase[]) => {
  // TODO: we need to select the correct identity factory per chain and then
  // the right provider
  const chainId = txns[0].chainId;
  const identityContract = Identity__factory.connect(
    process.env.NEXT_PUBLIC_SCW_ADDRESS!,
    chainIdToChain(chainId).provider,
  );

  const executionObject = ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint', 'uint', 'tuple(address, uint, bytes)[]'],
    [
      process.env.NEXT_PUBLIC_SCW_ADDRESS!,
      // TODO: make this happne on right chain
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

  const estimationResult = await identityContract.estimateGas.execute(
    txns,
    signature
  );
  return estimationResult;
};

const useGasEstimate = (txns: TransactionBase[]) => {
  const [estimate, setEstimate] = useState<ethers.BigNumber | null>(null);
  useEffect(() => {
    estimateGas(txns).then((estimate) => setEstimate(estimate));
  }, []);
  return estimate;
};

type CoinGeckoResponse = Record<string, { usd: number }>;

const chainIdToCoinGeckoName: Record<number, string> = {
  1: 'ethereum',
  // For Goerli, use Ethereum price for now
  5: 'ethereum',
  137: 'matic-network',
};

const fetchPriceFromCoinGecko = async (chainId: number) => {
  const { data }: AxiosResponse<CoinGeckoResponse> = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network&vs_currencies=usd'
  );
  const coinGeckoName = chainIdToCoinGeckoName[chainId];
  return data[coinGeckoName].usd;
};

const usePrice = (chainId: number) => {
  const [price, setPrice] = useState<number | null>(null);
  useEffect(() => {
    fetchPriceFromCoinGecko(chainId).then(setPrice);
  }, []);
  return price;
};

const useTransactionFeeInUSD = (txns: TransactionBase[]) => {
  // @TODO: James - better error management
  const chainId = txns[0].chainId;
  const { isLoading, data } = useFeeData({
    chainId,
    watch: true,
  });
  const estimate = useGasEstimate(txns);
  const price = usePrice(chainId);
  if (isLoading || !data || !estimate || !price) {
    return null;
  }

  // I'm estimating in mainnet gas prices since those fluctuate more
  console.log('gasPrice', ethers.utils.formatUnits(data.gasPrice!, 'gwei'));
  console.log('estimate', ethers.utils.formatUnits(estimate, 'wei'));
  const priceInCents = Math.trunc(price * 100);

  // This drops the decimal point for cent. Likely u wanna round up
  const feeInCents = data
    .gasPrice!.mul(estimate)
    .mul(priceInCents)
    .div(ethers.constants.WeiPerEther);
  return formatCents(feeInCents);
};

const GasEstimation = ({ txns }: { txns: TransactionBase[] }) => {
  const transactionFee = useTransactionFeeInUSD(txns);
  const isFree = txns[0].dappMetadata?.name === 'Uniswap Interface';
  return (
    <div>
    <div className="font-bold text-base">
      Estimated Gas
    </div>
    <div className="font-mono text-sm">
      {isFree ? 'FREE - paid for by Uniswap' : transactionFee ?? 'Loading...'}
    </div>
    </div>
  );
};

export { GasEstimation };
