import Head from 'next/head';
import { WagmiConfig, createClient, configureChains, chain } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import ChainTabs from '/components/ChainTabs';
import NavTabs from '/components/NavTabs';

const { provider, webSocketProvider } = configureChains(
  // @TODO: I only added mainnet here so that getGasPrice works with mainnet prices
  [chain.goerli, chain.mainnet],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY })],
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});


const Layout = ({ children }: {
  children: React.ReactNode;
}) => {
  const address = process.env.NEXT_PUBLIC_SCW_ADDRESS!;
  return (
    <WagmiConfig client={client}>
      <Head>
          <title>Kastle</title>
          <meta name="description" content="Smart contract wallet" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-full flex flex-col bg-gradient-to-b from-forest to-anchor">
        
        <div className="h-24 bg-slate flex-col bg-tablet">
          <div className="flex-1">
            <ChainTabs />
          </div>
          <div className="flex justify-center items-center py-3">
            <div className="text-white text-base tracking-widest font-semibold px-3">
              TOKENBOI.ETH
            </div>
            <div className="text-cement text-sm px-3 text-white font-semibold">{address.slice(0,6)}......{address.slice(35, 40)}</div>
          </div>
        </div>
        <div className="flex-1 flex-col">
          {children}
        </div>
        <NavTabs />
      </div>
    </WagmiConfig>
  );
};

export default Layout;
