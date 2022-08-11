import dotenvSafe from 'dotenv-safe';

dotenvSafe.config();

type envConfig = {
  environment: string;
  alchemyAPIKey: string;
  relayerAddress: string;
  relayerPrivateKey: string;
};

// We can ! everything here being dotenv-safe package guarantees the type safety.
// This may not be safe after all, but we can deal with that later
const config: envConfig = {
  environment: process.env.ENVIRONMENT!,
  alchemyAPIKey: process.env.ALCHEMY_API_KEY!,
  relayerAddress: process.env.RELAYER_ADDRESS!,
  relayerPrivateKey: process.env.RELAYER_PRIVATE_KEY!,
};

export default config;
