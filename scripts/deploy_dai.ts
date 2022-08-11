// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, deploymentCache } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // Corresponds to the contract solidity file (the .sol file)
  const contractName = "Dai";

  // Unique identifier for the specific deployment of the above contract
  // Sice same contract can be deployed multiple times with different names
  const contractDeploymentName = "DAI";

  const Dai = await ethers.getContractFactory(contractName);
  const dai = await Dai.deploy(1337);
  await dai.deployed();

  console.log("DAI deployed to:", dai.address);

  const [zero_hardhat, one_hardhat] = await ethers.getSigners();

  const daiWithSigner = dai.connect(zero_hardhat);

  await daiWithSigner.mint(
    zero_hardhat.address,
    ethers.utils.parseUnits("1000000.0", 18)
  );

  console.log("Minted 1 mil DAI to zero_hardhat...");

  await deploymentCache.saveDeployment(contractDeploymentName, dai.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
