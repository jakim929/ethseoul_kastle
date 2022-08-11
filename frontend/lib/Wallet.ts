abstract class Wallet {
  abstract getPublicAddress(): string;
}

class EthereumSmartContractWallet extends Wallet {
  ownerPrivateKey: string;
  ownerPublicAddress: string;
  contractAddress: string;

  constructor(ownerPrivateKey: string, ownerPublicAddress: string, contractAddress: string) {
    super();
    this.ownerPrivateKey = ownerPrivateKey;
    this.ownerPublicAddress = ownerPublicAddress;
    this.contractAddress = contractAddress;
  }
  
  getPublicAddress() {
    return this.contractAddress;
  }
}

class EthereumEOAWallet extends Wallet  {
  privateKey: string;
  publicAddress: string;

  constructor(privateKey: string, publicAddress: string) {
    super();
    this.privateKey = privateKey;
    this.publicAddress = publicAddress;
  }

  getPublicAddress(): string {
    return this.publicAddress;
  }
}

export {
  EthereumSmartContractWallet,
}
