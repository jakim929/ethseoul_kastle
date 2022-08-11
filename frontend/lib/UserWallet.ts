import { ethers } from "ethers";

const UserWallet = new ethers.Wallet(
  process.env.NEXT_PUBLIC_SCW_OWNER_PRIVATE_KEY!
);

export { UserWallet };
