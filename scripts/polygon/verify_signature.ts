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

  const ownerToDeployFor = '0x74D8a2472067e506453f0e3395A59BBA7d865f2D';
  const scwAddress = '0xdf3252b60c5339C1BE8d3E8F5e59a34aDDC2d4bF';

  const alchemyPolygonProvider = new ethers.providers.AlchemyProvider(
    "matic",
    alchemyAPIKey
  );

  const scw = Identity__factory.connect(
    scwAddress,
    alchemyPolygonProvider
  );

  const toSign = '0xb21808615920f4a43f5da837cdba41d2859694b4d197e6d33ab93e7eb1b9f10e'
  const resultingSignature = '0x8321df4206a867d92cd5de03e26d38a3cca42ca3a9f0297878b405db7ad83a7815ae7b4e3e21922e92eaeefaf511bb5c87e92cded2b01ccb856f792c239b598f1b00';

  // const result2 = await scw.privileges(ownerToDeployFor);
  // console.log(result2);

  const dataResult = scw.interface.encodeFunctionData('isValidSignature', [ethers.utils.arrayify(toSign), resultingSignature]);
  console.log(dataResult)
  const result = await scw.isValidSignature(toSign, resultingSignature);
  console.log(result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
