import dotenvSafe from "dotenv-safe";

dotenvSafe.config();

type envConfig = {
  environment: string;

  deployerAddress: string;
  deployerPrivateKey: string;
  alchemyAPIKey: string;

  elkDeployerAddress: string;
  elkDeployerPrivateKey: string;
};

// We can ! everything here being dotenv-safe package guarantees the type safety.
// This may not be safe after all, but we can deal with that later
const config: envConfig = {
  environment: process.env.ENVIRONMENT!,
  deployerAddress: process.env.DEPLOYER_ADDRESS!,
  deployerPrivateKey: process.env.DEPLOYER_PRIVATE_KEY!,
  alchemyAPIKey: process.env.ALCHEMY_API_KEY!,
  elkDeployerAddress: process.env.ELK_DEPLOYER_ADDRESS!,
  elkDeployerPrivateKey: process.env.ELK_DEPLOYER_PRIVATE_KEY!,
};

export default config;
