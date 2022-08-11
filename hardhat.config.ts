import * as dotenv from "dotenv";

import "tsconfig-paths/register";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "/utils/DeploymentCache/src/index";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.5.12",
      },
      {
        version: "0.8.9",
      },
      {
        version: "0.8.7",
      },
      {
        version: "0.6.0",
      },
      {
        version: "0.8.4",
      },
      {
        version: "0.8.15",
      },
      {
        version: "0.6.12",
      },
    ],
  },
  networks: {
    hardhat: {
      // For metamask
      // https://hardhat.org/metamask-issue
      chainId: 1337,

      // Since we compile/deploy monolith contracts (instead of separately deployed)
      // Some contracts (USDC) hit contract size limit
      allowUnlimitedContractSize: true,
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
