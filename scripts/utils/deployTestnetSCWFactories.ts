// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { deploymentCache, ethers } from "hardhat";
import config from "/utils/config";
import { Signer, Contract } from "ethers";

const deployContractWithSigner = async (
  signer: Signer,
  contractName: string,
  contractDeploymentName: string,
  args?: any
): Promise<Contract> => {
  const ContractFactory = await ethers.getContractFactory(contractName, signer);
  const contract = args
    ? await ContractFactory.deploy(args)
    : await ContractFactory.deploy();
  await contract.deployed();

  console.log(`${contractDeploymentName} deployed to:`, contract.address);

  await deploymentCache.saveDeployment(
    contractDeploymentName,
    contract.address
  );

  return contract;
};

const deployTestnetSCWFactories = async () => {
  const { deployerAddress, deployerPrivateKey, alchemyAPIKey } = config;
  const alchemyGoerliProvider = new ethers.providers.AlchemyProvider(
    "goerli",
    alchemyAPIKey
  );
  const deployerSigner = new ethers.Wallet(
    deployerPrivateKey,
    alchemyGoerliProvider
  );
  const identityFactory = await deployContractWithSigner(
    deployerSigner,
    "IdentityFactory",
    "Goerli_IdentityFactory",
    deployerAddress
  );
  console.log("Finished deploying IdentityFactory", identityFactory.address);

  const identity = await deployContractWithSigner(
    deployerSigner,
    "Identity",
    "Goerli_Identity",
    [deployerAddress]
  );
  console.log("Finished deploying Identity", identity.address);
};

export default deployTestnetSCWFactories;
