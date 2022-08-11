import { Chain, ChainEnum, chainEnumToChain } from '@shared/types/chain';
import { ERC20TokenById, ERC20TokenList } from '/lib/entities/ERC20TokenList';
import React, { useEffect, useState } from 'react';

import { Alchemy } from 'alchemy-sdk';
import Image from 'next/image';
import ethereumLogo from '/public/chain_logos/ethereum.png';
import { ethers } from 'ethers';
import polygonLogo from '/public/chain_logos/polygon.png';
import usdcLogo from '/public/chain_logos/usdc.png';

const activeChains = [ChainEnum.Goerli, ChainEnum.Polygon];

type AssetBalanceDisplayType = {
  name: string;
  symbol: string;
  chain: Chain;
  balance: string;
  decimals: number;
};

const fetchAssets = async (callback: Function) => {
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
      symbol: chain.nativeTicker,
      balance: balance.toString(),
      decimals: 18,
      chain,
    });
    tokenBalancesResponse.tokenBalances.forEach((tokenBalanceObj) => {
      const { tokenBalance, contractAddress } = tokenBalanceObj;
      const tokenMetadata = ERC20TokenById[`${chain.id}-${contractAddress}`];
      if (
        !(
          tokenBalance == null ||
          tokenBalance === '' ||
          tokenBalance === '0' ||
          tokenBalance === '0x'
        )
      ) {
        assetBalancesDisplays.push({
          // TODO: use small icon instead of specifying chain in text.
          name: `${tokenMetadata.name} (${chain.shortName})`,
          symbol: tokenMetadata.symbol,
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assetBalances, setAssetBalances] = useState<AssetBalanceDisplayType[]>(
    []
  );
  useEffect(() => {
    setIsLoading(true);
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

const nameToLogo = (name: string) => {
  switch (name) {
    case 'Ethereum':
      return ethereumLogo;
    case 'GoerliETH':
      return ethereumLogo;
    case 'USD Coin (Goerli)':
      return usdcLogo;
    case 'MATIC':
      return polygonLogo;
    default:
      return null;
  }
};

const CircledLogo = ({ name }: { name: string }) => {
  // return circle made using CSS with border 1px and width 34px and height 34px.
  const logo = nameToLogo(name);
  return (
    <div className="border-2 rounded-full flex bg-white p-2 mx-2">
      <Image
        src={logo ?? ethereumLogo}
        width={21}
        height={21}
        alt={name}
        loading="lazy"
      />
    </div>
  );
};

const pricesMap: Record<string, number> = {
  'USD Coin (Goerli)': 1,
  GoerliETH: 1700,
  MATIC: 0.88,
};

const assetToValue = (
  value: string,
  name: string,
  decimals: number
): string => {
  // Treat wei values separately from everything else.
  // convert value to number
  console.log('value', value);
  const valueNum = Number(ethers.utils.formatUnits(value, decimals));
  const price = pricesMap[name];
  return (valueNum * price).toString();
};

const AssetRow = ({
  balanceDisplay,
  isLoading,
}: {
  balanceDisplay: AssetBalanceDisplayType;
  isLoading: boolean;
}) => {
  const { name, balance, decimals, symbol } = balanceDisplay;
  if (isLoading) {
    return <div key={name} className="flex text-sm items-center mb-2">Loading...</div>;
  }
  return (
    <div key={name} className="flex text-sm items-center mb-2">
      <CircledLogo name={name} />
      <div className="flex flex-col flex-1">
        <div>{name}</div>
        <div className="font-mono">
          {ethers.utils.formatUnits(balance, decimals)} {symbol}
        </div>
      </div>
      <div className="self-start mr-8">
        ${assetToValue(balance, name, decimals)}
      </div>
    </div>
  );
};

const Assets = () => {
  console.log('loading asset  s');
  const { isLoading, assetBalances } = useAssets();
  return (
    <div className="flex-1 flex flex-col">
      {assetBalances.map((balanceDisplay) => {
        return (
          <AssetRow balanceDisplay={balanceDisplay} isLoading={isLoading} />
        );
      })}
    </div>
  );
};

const AssetsPane = () => {
  return (
    <div className="flex flex-col">
      <div className="flex tracking-widest font-bold mt-4 justify-center">
        TOKENS
      </div>
      <div className="flex rounded-lg shadow-sm shadow-black">
        <Assets />
      </div>
    </div>
  );
};

export default AssetsPane;
