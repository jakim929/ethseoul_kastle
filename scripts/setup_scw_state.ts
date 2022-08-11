import deploySmartContractWallet from "/scripts/utils/deploySmartContractWallet";
import deployUSDC from "/scripts/utils/deployUSDC";
import deployMultisend from "/scripts/utils/deployMultisend";
import sendUSDCToSmartContractWallet from "/scripts/utils/sendUSDCToSmartContractWallet";

async function main() {
  await deploySmartContractWallet();
  await deployUSDC();
  await deployMultisend();
  await sendUSDCToSmartContractWallet();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
