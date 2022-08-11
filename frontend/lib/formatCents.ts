import { ethers } from "ethers";

function formatCents(cents: number | ethers.BigNumber) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format((typeof cents === 'number' ? cents : cents.toNumber()) / 100);
}

export { formatCents }

