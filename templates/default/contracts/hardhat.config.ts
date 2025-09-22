import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@parity/hardhat-polkadot";

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  console.warn("⚠️  WARNING: PRIVATE_KEY environment variable not found. Please set it in your .env file for network deployments.");
}

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  //resolc: {
  //  compilerSource: "npm"
  //},
  networks: {
    hardhat: {
      // polkavm: true,
      // forking: {
      //   url: "https://testnet-passet-hub-eth-rpc.polkadot.io"
      // },
      // adapterConfig: {
      //   adapterBinaryPath: "./bin/eth-rpc",
      //   dev: true,
      // },
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    polkadotHubTestnet: {
      polkavm: true,
      url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
      accounts: privateKey ? [privateKey] : [],
    },
  },
};

export default config;
