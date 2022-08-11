type ERC20Token = {
  id: string; // `${chainId}-${address}`
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
};

export type { ERC20Token };
