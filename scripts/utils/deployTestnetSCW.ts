import { deploymentCache, ethers } from "hardhat";
import { getProxyDeployBytecode } from "/scripts/utils/identityProxyDeploy";
import { IdentityFactory__factory } from "/typechain";
import config from "/utils/config";

const deployTestnetSCW = async () => {
  const addressByName = await deploymentCache.getDeploymentAddresses();
  const goerliIdentityAddress = addressByName["Identity"]!;
  const goerliIdentityFactoryAddress = addressByName["IdentityFactory"]!;

  const { elkDeployerPrivateKey, alchemyAPIKey } = config;

  const ownerToDeployFor = '0x74D8a2472067e506453f0e3395A59BBA7d865f2D';

  const alchemyGoerliProvider = new ethers.providers.AlchemyProvider(
    "goerli",
    alchemyAPIKey
  );
  const deployerSigner = new ethers.Wallet(
    elkDeployerPrivateKey,
    alchemyGoerliProvider
  );

  const proxyDeployBytecode = getProxyDeployBytecode(goerliIdentityAddress, [
    [ownerToDeployFor, true],
  ]);

  const identityFactory = IdentityFactory__factory.connect(
    goerliIdentityFactoryAddress,
    deployerSigner
  );

  const salt =
    "0x0000000000000000000000000000000000000000000000000000000000000F19";
  const tx = await identityFactory.deploy(proxyDeployBytecode, salt);

  console.log(tx);
  const newlyDeployedWalletProxy = ethers.utils.getCreate2Address(
    identityFactory.address,
    salt,
    ethers.utils.keccak256(proxyDeployBytecode)
  );

  console.log(`Newly deployed wallet proxy: ${newlyDeployedWalletProxy}`);

  await deploymentCache.saveDeployment(
    "Goerli_SCW",
    newlyDeployedWalletProxy
  );
};

export default deployTestnetSCW;
