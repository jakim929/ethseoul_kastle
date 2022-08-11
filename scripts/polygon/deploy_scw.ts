// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { deploymentCache, ethers } from "hardhat";
import { getProxyDeployBytecode } from "/scripts/utils/identityProxyDeploy";
import deployContract from "/scripts/utils/deployContract";
import { Identity, IdentityFactory__factory } from "/typechain";
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
  const addressByName = await deploymentCache.getDeploymentAddresses();
  const polygonIdentityAddress = addressByName["Polygon_Identity"]!;
  const polygonIdentityFactoryAddress = addressByName["Polygon_IdentityFactory"]!;

  const { elkDeployerPrivateKey, alchemyAPIKey } = config;

  const ownerToDeployFor = '0x74D8a2472067e506453f0e3395A59BBA7d865f2D';

  const alchemyPolygonProvider = new ethers.providers.AlchemyProvider(
    "matic",
    alchemyAPIKey
  );
  const deployerSigner = new ethers.Wallet(
    elkDeployerPrivateKey,
    alchemyPolygonProvider
  );

  const proxyDeployBytecode = getProxyDeployBytecode(polygonIdentityAddress, [
    [ownerToDeployFor, true],
  ]);

  const identityFactory = IdentityFactory__factory.connect(
    polygonIdentityFactoryAddress,
    deployerSigner
  );

  const salt =
    "0x0000000000000000000000000000000000000000000000000000000000000F19";
  const tx = await identityFactory.deploy(proxyDeployBytecode, salt, { maxPriorityFeePerGas: BigNumber.from(45000000000), maxFeePerGas: BigNumber.from(45000000000) });

  console.log(tx);
  const newlyDeployedWalletProxy = ethers.utils.getCreate2Address(
    identityFactory.address,
    salt,
    ethers.utils.keccak256(proxyDeployBytecode)
  );

  console.log(`Newly deployed wallet proxy: ${newlyDeployedWalletProxy}`);

  await deploymentCache.saveDeployment(
    "Polygon_TurtleSCW",
    newlyDeployedWalletProxy
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
