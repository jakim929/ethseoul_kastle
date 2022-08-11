import { ethers, deploymentCache } from "hardhat";
import { FiatTokenV21__factory } from "/typechain";

const sendUSDCToSmartContractWallet = async () => {
  const [zero_hardhat] = await ethers.getSigners();
  const addressByName = await deploymentCache.getDeploymentAddresses();

  const usdc = FiatTokenV21__factory.connect(addressByName.USDC, zero_hardhat);
  await usdc.transfer(
    addressByName.SmartContractWallet,
    ethers.utils.parseUnits("10000.0", 6)
  );
  console.log(
    "10000 USDC transferred to SmartContractWallet at :",
    addressByName.SmartContractWallet
  );

  const scwBalance = await usdc.balanceOf(addressByName.SmartContractWallet);
  console.log(
    `SCW ${addressByName.SmartContractWallet} has ${ethers.utils.formatUnits(
      scwBalance,
      6
    )} USDC`
  );
};

export default sendUSDCToSmartContractWallet;
