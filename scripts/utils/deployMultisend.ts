// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hardhat, { ethers } from "hardhat";
// Deploys the USDC contract and then
// 1. initializes it, with zero_hardhat as the owner
// 2. mints initial set of tokens

const deployMultisend = async () => {
  // Corresponds to the contract solidity file (the .sol file)
  const contractName = "Multisend";

  // Unique identifier for the specific deployment of the above contract
  // Sice same contract can be deployed multiple times with different names
  const contractDeploymentName = "Multisend";

  // We get the contract to deploy
  const multisendContract = await ethers.getContractFactory(contractName);
  const multisend = await multisendContract.deploy();
  await multisend.deployed();

  console.log("Multisend deployed to:", multisend.address);

  await hardhat.deploymentCache.saveDeployment(
    contractDeploymentName,
    multisend.address
  );
};

export default deployMultisend;
