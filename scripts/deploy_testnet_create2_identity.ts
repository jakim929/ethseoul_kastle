// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import deployTestnetSCW from "/scripts/utils/deployTestnetSCW";
import { ethers } from 'hardhat';
import config from '/utils/config';
import {
  deployContract,
  deployFactory,
  getCreate2Address,
  isDeployed
} from '/scripts/utils/DeployCreate2'

// Deploys the USDC contract and then
// 1. initializes it, with zero_hardhat as the owner
// 2. mints initial set of tokens

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const { elkDeployerAddress, elkDeployerPrivateKey, alchemyAPIKey } = config;
  const alchemyGoerliProvider = new ethers.providers.AlchemyProvider(
    "goerli",
    alchemyAPIKey
  );
  const deployerSigner = new ethers.Wallet(
    elkDeployerPrivateKey,
    alchemyGoerliProvider
  );

  const IdentityFactory = await ethers.getContractFactory("Identity");
  const salt = "0x0000000000000000000000000000000000000000000000000000000000000F19";
  const bytecode = IdentityFactory.bytecode;
  const constructorTypes = ['address[]'];
  const constructorArgs = [[elkDeployerAddress]];
  const computedAddress = getCreate2Address({
    salt,
    contractBytecode: bytecode,
    constructorTypes: constructorTypes,
    constructorArgs: constructorArgs
  });
  console.log("computedAddress", computedAddress);
  const { txHash, address, receipt } = await deployContract({
    salt: salt,
    contractBytecode: bytecode,
    constructorTypes: constructorTypes,
    constructorArgs: constructorArgs,
    signer: deployerSigner
  });

  console.log("txHash", txHash, address, receipt);

  // Query if contract deployed at address
  const success = await isDeployed(address, alchemyGoerliProvider);
  console.log("success", success);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
