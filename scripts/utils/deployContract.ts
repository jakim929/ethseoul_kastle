import { Contract } from "ethers";
import { ethers, deploymentCache } from "hardhat";

const deployContract = async (
  contractName: string,
  contractDeploymentName: string,
  args?: any
): Promise<Contract> => {
  const ContractFactory = await ethers.getContractFactory(contractName);
  const contract = args
    ? await ContractFactory.deploy(args)
    : await ContractFactory.deploy();
  await contract.deployed();

  console.log(`${contractName} deployed to:`, contract.address);

  await deploymentCache.saveDeployment(
    contractDeploymentName,
    contract.address
  );

  return contract;
};

export default deployContract;
