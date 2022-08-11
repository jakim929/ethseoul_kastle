import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ERC20TokenList, ERC20TokenById } from '/lib/entities/ERC20TokenList';
import {
  Chain,
  ChainEnum,
  chainEnumToChain,
} from '@shared/types/chain';
import { Alchemy } from 'alchemy-sdk';

const activeChains = [ChainEnum.Goerli, ChainEnum.Polygon];

type AssetBalanceDisplayType = {
  name: string;
  chain: Chain;
  balance: string;
  decimals: number;
};

const fetchAssets = async (callback: Function) => {
  console.log('calling fetch assets');
  const assetBalancesDisplays: AssetBalanceDisplayType[] = [];

  // loop through activeChains
  const address = process.env.NEXT_PUBLIC_SCW_ADDRESS!;
  for (const chainEnum of activeChains) {
    const chain = chainEnumToChain[chainEnum];
    const alchemy = new Alchemy({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
      network: chainEnumToChain[chainEnum].alchemySubdomain,
    });
    const balance = await alchemy.core.getBalance(
      process.env.NEXT_PUBLIC_SCW_ADDRESS!
    );
    const tokenBalancesResponse = await alchemy.core.getTokenBalances(
      address,
      ERC20TokenList.map(({ address }) => address)
    );
    // Populate the asset balance disiplay.
    assetBalancesDisplays.push({
      name: chain.nativeTicker,
      balance: balance.toString(),
      decimals: 18,
      chain,
    });
    tokenBalancesResponse.tokenBalances.forEach((tokenBalanceObj) => {
      const { tokenBalance, contractAddress } = tokenBalanceObj;
      const tokenMetadata =
        ERC20TokenById[
          `${chain.id}-${contractAddress}`
        ];
      if (!(tokenBalance == null || tokenBalance === '' || tokenBalance === '0' || tokenBalance === '0x')) {
        assetBalancesDisplays.push({
          name: `${tokenMetadata.name} (${chain.shortName})`,
          balance: tokenBalance,
          decimals: tokenMetadata.decimals,
          chain,
        });
      }
    });
    callback(assetBalancesDisplays);
  }
};

const useAssets = () => {
  console.log('use assets asdf');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assetBalances, setAssetBalances] = useState<AssetBalanceDisplayType[]>(
    []
  );
  useEffect(() => {
    setIsLoading(true);
    console.log('use effect asdf');
    fetchAssets((result: AssetBalanceDisplayType[]) => {
      setAssetBalances(result);
      setIsLoading(false);
    });
  }, []);
  console.log(assetBalances);
  return {
    isLoading,
    assetBalances,
  };
};

const Assets = () => {
  console.log('loading assets');
  const { isLoading, assetBalances } = useAssets();
  return (
    <div className="flex-1 flex flex-col">
      <div>Assets</div>
      {assetBalances.map(({ name, balance, decimals }) => {
        console.log('balance', balance);
        return (
          <div key={name}>
            {name}: {ethers.utils.formatUnits(balance, decimals)}
          </div>
        );
      })}
    </div>
  );
};

export default Assets;
