import config from './config';
import Koa, { Context, Request } from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Router from '@koa/router';
import { BytesLike, ethers, Transaction } from 'ethers';
import { Identity__factory } from '../../typechain';
import {
  API_executeRequest,
  API_executeResponse,
} from '@shared/types/API_execute';
import {
  API_getGasTankBalanceRequest,
  API_getGasTankBalanceResponse,
} from '@shared/types/API_getGasTankBalance';
import { GasTank } from './GasTank/GasTank';
import { chainIdToChain } from '../../shared/types/chain';

interface KoaRequest<RequestBody = any> extends Request {
  body?: RequestBody;
}

export interface KoaContext<RequestBody = any, ResponseBody = any>
  extends Context {
  request: KoaRequest<RequestBody>;
  body: ResponseBody;
}

export interface KoaResponseContext<ResponseBody>
  extends KoaContext<any, ResponseBody> {}

const app = new Koa();
const router = new Router();

app.use(cors({ maxAge: 86400 }));
app.use(bodyParser({ formLimit: '1mb', jsonLimit: '1mb', textLimit: '1mb' }));

export const createTransactionsArr = (txns: Transaction[]): BytesLike => {
  return txns.length.toString();
};

router.post(
  '/execute',
  async (ctx: KoaContext<API_executeRequest, API_executeResponse>) => {
    const { relayableExecution, walletAddress } = ctx.request.body!;

    const { txns, signature } = relayableExecution;

    if (!signature) {
      ctx.status = 400;
      ctx.body = { message: 'No signature found', contractTransaction: null, success: false };
      return;
    }

    if (!txns || txns.length == 0) {
      ctx.status = 400;
      ctx.body = { message: 'No transactions found', contractTransaction: null, success: false };
      return;
    }

    // check to make sure that all fields 'key1' in txns array are the same value.
    const chainId = txns[0].chainId;
    if (!txns.every((txn) => txn.chainId === chainId)) {
      ctx.status = 400;
      ctx.body = { message: 'Chain IDs not matching', contractTransaction: null, success: false };
      return;
    }

    const provider = chainIdToChain(chainId).provider;
    const relayerWallet = new ethers.Wallet(config.relayerPrivateKey).connect(
      provider,
    );
    const identityContract = Identity__factory.connect(
      walletAddress,
      relayerWallet,
    );

    console.log(txns);
    console.log(signature);
    // const contractTransaction = await identityContract.execute(txns, signature, { gasLimit: ethers.BigNumber.from(180000) });
    const contractTransaction = await identityContract.execute(txns, signature, { maxPriorityFeePerGas: ethers.BigNumber.from(30000000000), maxFeePerGas: ethers.BigNumber.from(30000000000) });
    console.log('contract Transaction', contractTransaction);
    // const transactionReceipt = await transactionResponse.wait(2);
    // console.log('transaction receipt', transactionReceipt);

    // @TODO James : We need WAY BETTER charging + handling here
    await GasTank.subtractBalanceForUser(walletAddress, contractTransaction);

    ctx.status = 200;
    ctx.body = { contractTransaction, success: true };
  },
);

router.post(
  '/getGasTankBalance',
  async (ctx: KoaContext<API_getGasTankBalanceRequest, API_getGasTankBalanceResponse>) => {
    const { walletAddress } = ctx.request.body!;

    ctx.status = 200;
    ctx.body = { gasTankBalance: GasTank.getBalanceForUser(walletAddress) };
  }
)

app.use(router.routes());

app.listen(3001);
