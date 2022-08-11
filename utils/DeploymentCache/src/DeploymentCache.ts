import { promises as fs } from "fs";

class DeploymentCache {
  fileName: string = "contractAddresses.json";
  loadingPromise: Promise<any> | null = null;
  addressByName: { [name: string]: string } = {};

  constructor() {
    this.addressByName = {};
    this._initialize();
  }

  async _initialize() {
    this.loadingPromise = this._loadDeploymentFromFile();
    await this.loadingPromise;
    this.loadingPromise = null;
  }

  async _waitForInitialization() {
    if (this.loadingPromise) {
      await this.loadingPromise;
    }
    return;
  }

  async _readFile() {
    try {
      const contractAddressesBlob = await fs.readFile(this.fileName, "utf8");
      return contractAddressesBlob;
    } catch (err) {
      // @ts-ignore
      if (err.code === "ENOENT") {
        return "";
      } else {
        throw err;
      }
    }
  }

  async _loadDeploymentFromFile() {
    const contractAddressesBlob = await this._readFile();
    if (contractAddressesBlob && contractAddressesBlob.trim() !== "") {
      this.addressByName = JSON.parse(contractAddressesBlob);
    } else {
      this.addressByName = {};
    }
  }

  async _saveCurrentState() {
    await fs.writeFile(
      this.fileName,
      JSON.stringify(this.addressByName, null, 2),
      { flag: "w" }
    );
  }

  async getDeploymentAddresses() {
    await this._waitForInitialization();
    return this.addressByName;
  }

  async saveDeployment(name: string, address: string) {
    await this._waitForInitialization();
    this.addressByName[name] = address;
    await this._saveCurrentState();
  }
}

export default DeploymentCache;
