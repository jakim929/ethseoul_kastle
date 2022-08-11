import { goerliChain } from '@shared/types/chain';
import { ERC20Token } from '/lib/entities/ERC20Token';

type ERC20Token_Incomplete = Partial<ERC20Token> &
  Pick<ERC20Token, 'chainId' | 'address' | 'name' | 'symbol' | 'decimals'>;

const SupportedERC20Tokens: Array<ERC20Token_Incomplete> = [
  {
    chainId: goerliChain.id,
    address: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
];

const ERC20TokenList: Array<ERC20Token> = SupportedERC20Tokens.map((val) => {
  return {
    id: `${val.chainId}-${val.address}`,
    ...val,
  };
});

const ERC20TokenById = ERC20TokenList.reduce<{ [id: string]: ERC20Token }>(
  (tokenById, token) => {
    return {
      ...tokenById,
      [token.id]: token,
    };
  },
  {}
);

export { ERC20TokenList, ERC20TokenById };
