// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hardhat, { ethers } from "hardhat";
// Deploys the USDC contract and then
// 1. initializes it, with zero_hardhat as the owner
// 2. mints initial set of tokens

const deployUSDC = async () => {
  // Corresponds to the contract solidity file (the .sol file)
  const contractName = "FiatTokenV2_1";

  // Unique identifier for the specific deployment of the above contract
  // Sice same contract can be deployed multiple times with different names
  const contractDeploymentName = "USDC";

  // We get the contract to deploy
  const FiatTokenV2_1 = await ethers.getContractFactory(contractName);
  const usdc = await FiatTokenV2_1.deploy();
  await usdc.deployed();

  console.log("USDC deployed to:", usdc.address);

  const [zero_hardhat] = await ethers.getSigners();

  const usdcWithSigner = usdc.connect(zero_hardhat);

  await usdcWithSigner.initialize(
    "USDC",
    "USDC",
    "USD",
    6,
    zero_hardhat.address,
    zero_hardhat.address,
    zero_hardhat.address,
    zero_hardhat.address
  );

  console.log("Initialized USDC Base Contract...");

  await usdcWithSigner.initializeV2("USDC");

  console.log("Initialized USDC V2...");

  await usdcWithSigner.initializeV2_1(usdcWithSigner.address);

  console.log("Initialized USDC V2_1...");

  await usdcWithSigner.configureMinter(
    zero_hardhat.address,
    ethers.utils.parseUnits("1000000.0", 6)
  );

  console.log("Configured zero_hardhat as minter with 1 mil USDC allowance...");

  await usdcWithSigner.mint(
    zero_hardhat.address,
    ethers.utils.parseUnits("1000000.0", 6)
  );

  console.log("Minted 1 mil USDC to zero_hardhat...");

  await hardhat.deploymentCache.saveDeployment(
    contractDeploymentName,
    usdc.address
  );
};

export default deployUSDC;
