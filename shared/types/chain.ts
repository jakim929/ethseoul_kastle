import { Network } from 'alchemy-sdk';
import { ethers } from 'ethers';

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

export enum ChainEnum {
  Ethereum,
  Goerli,
  Polygon,
}

type chainMetadata = {
  // This would be optional if we go non-EVM
  id: number;
  nativeTicker: string;
  shortName: string;
  alchemySubdomain: Network;
  provider: ethers.providers.Provider;
  // Note that this makes the strong assumption that there is one wallet per user per chain.
  smartContractWalletAddress: string;
};

export class Chain {
  id: number;
  nativeTicker: string;
  shortName: string;
  alchemySubdomain: Network;
  provider: ethers.providers.Provider;
  smartContractWalletAddress: string;
  constructor({
    id,
    nativeTicker,
    shortName,
    alchemySubdomain,
    provider,
    smartContractWalletAddress,
  }: chainMetadata) {
    this.id = id;
    this.nativeTicker = nativeTicker;
    this.shortName = shortName;
    this.alchemySubdomain = alchemySubdomain;
    this.provider = provider;
    this.smartContractWalletAddress = smartContractWalletAddress;
  }
}

export const goerliChain = new Chain({
  id: 5,
  nativeTicker: 'GoerliETH',
  shortName: 'Goerli',
  alchemySubdomain: Network.ETH_GOERLI,
  provider: new ethers.providers.AlchemyProvider('goerli', ALCHEMY_KEY),
  smartContractWalletAddress: process.env.NEXT_PUBLIC_SCW_ADDRESS!,
});

const ethereumChain = new Chain({
  id: 1,
  nativeTicker: 'ETH',
  shortName: 'ETH',
  alchemySubdomain: Network.ETH_MAINNET,
  provider: new ethers.providers.AlchemyProvider('homestead', ALCHEMY_KEY),
  smartContractWalletAddress: process.env.NEXT_PUBLIC_SCW_ADDRESS!,
});

const polygonChain = new Chain({
  id: 137,
  nativeTicker: 'MATIC',
  shortName: 'MATIC',
  alchemySubdomain: Network.MATIC_MAINNET,
  provider: new ethers.providers.AlchemyProvider('matic', ALCHEMY_KEY),
  smartContractWalletAddress: process.env.NEXT_PUBLIC_SCW_ADDRESS!,
});;

export const chainEnumToChain: Record<ChainEnum, Chain> = {
  [ChainEnum.Ethereum]: ethereumChain,
  [ChainEnum.Goerli]: goerliChain,
  [ChainEnum.Polygon]: polygonChain,
}

// TODO: do fancy reverse mapping
export const chainIdToChain = (chainId: number): Chain => {
  switch (chainId) {
    case 1:
      return ethereumChain;
    case 5:
      return goerliChain;
    case 137:
      return polygonChain;
    default:
      throw new Error(`Unknown chain id: ${chainId}`);
  }
};
