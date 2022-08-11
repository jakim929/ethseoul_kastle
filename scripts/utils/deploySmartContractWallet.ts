// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { deploymentCache, ethers } from "hardhat";
import { getProxyDeployBytecode } from "/scripts/utils/identityProxyDeploy";
import deployContract from "/scripts/utils/deployContract";
import { Identity } from "/typechain";
import { assert } from "console";

type ExpectedPrivilege = {
  address: string;
  val: boolean;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const confirmCorrectPrivileges = async (
  identity: Identity,
  expectedPrivileges: Array<ExpectedPrivilege>
): Promise<boolean> => {
  const comparisonResults = await Promise.all(
    expectedPrivileges.map(async ({ address, val }) => {
      const privLevel = await identity.privileges(address);
      return ethers.BigNumber.from(privLevel).eq(val === true ? 1 : 0);
    })
  );
  return comparisonResults.every((result) => result === true);
};

const deploySmartContractWallet = async () => {
  const [zero_hardhat, one_hardhat] = await ethers.getSigners();

  const identityFactory = await deployContract(
    "IdentityFactory",
    "IdentityFactory",
    zero_hardhat.address
  );
  const identityFactoryWithSigner = identityFactory.connect(zero_hardhat);
  const identity = await deployContract("Identity", "Identity", [
    zero_hardhat.address,
  ]);

  const proxyDeployBytecode = getProxyDeployBytecode(identity.address, [
    [one_hardhat.address, true],
  ]);

  const salt =
    "0x0000000000000000000000000000000000000000000000000000000000000001";
  await identityFactoryWithSigner.deploy(proxyDeployBytecode, salt);

  const newlyDeployedWalletProxy = ethers.utils.getCreate2Address(
    identityFactory.address,
    salt,
    ethers.utils.keccak256(proxyDeployBytecode)
  );

  console.log(
    "New Identity proxy for one_hardhat should be create2 deployed to ",
    newlyDeployedWalletProxy
  );

  const newWallet = identity.attach(newlyDeployedWalletProxy) as Identity;
  // const newWalletWithSigner = newWallet.connect(one_hardhat);

  const arePrivilegesCorrect = await confirmCorrectPrivileges(newWallet, [
    { address: one_hardhat.address, val: true },
    { address: zero_hardhat.address, val: false },
  ]);
  assert(arePrivilegesCorrect);

  await deploymentCache.saveDeployment(
    "SmartContractWallet",
    newWallet.address
  );
};

export default deploySmartContractWallet;
