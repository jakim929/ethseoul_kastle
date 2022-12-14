import { extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import "./type-extensions";
import DeploymentCache from "./DeploymentCache";

extendEnvironment((hre) => {
  // We add a field to the Hardhat Runtime Environment here.
  // We use lazyObject to avoid initializing things until they are actually
  // needed.
  hre.deploymentCache = lazyObject(() => new DeploymentCache());
});
