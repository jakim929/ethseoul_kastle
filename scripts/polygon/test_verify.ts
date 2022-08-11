// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { deploymentCache, ethers } from "hardhat";
import { getProxyDeployBytecode } from "/scripts/utils/identityProxyDeploy";
import deployContract from "/scripts/utils/deployContract";
import { Identity, IdentityFactory__factory, Identity__factory } from "/typechain";
import { assert } from "console";
import config from '/utils/config';
import { BigNumber } from "ethers";

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
  // const addressByName = await deploymentCache.getDeploymentAddresses();
  // const polygonIdentityAddress = addressByName["Polygon_Identity"]!;
  // const polygonIdentityFactoryAddress = addressByName["Polygon_IdentityFactory"]!;

  const { elkDeployerPrivateKey, alchemyAPIKey } = config;

  const scwAddress = '0x416f5B6fb2636Cc9f9C8d421c981449ef5a86049';

  const scw = Identity__factory.connect(
    scwAddress,
    ethers.provider
  );

  const toSign = '0x3b112e55cfc7a20bcc7d0799839cb58d1e3cdd4def1dbc44339c545426f68910'
  const resultingSignature = '0x9af50bd83c04e8fc7cac8032aa8be14c0e096bf2cf0c54850e26ca83312e3bdb2d2abc24d58480030628ce7100449398c4e2d7c6dfa1a8a16c844f8b099048731b00';

  // const result2 = await scw.privileges(ownerToDeployFor);
  // console.log(result2);

  // const dataResult = scw.interface.encodeFunctionData('isValidSignature', [toSign, resultingSignature]);
  // console.log(dataResult)
  const result = await scw.isValidSignature(toSign, resultingSignature);
  console.log(result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
