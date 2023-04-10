require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
        details: { yul: false },
      },
    },
  },
  defaultNetwork: "Hyperspace",
  networks: {
    Hyperspace: {
      chainId: 3141,
      url: "https://rpc.ankr.com/filecoin_testnet",
      accounts: [PRIVATE_KEY],
    },
    FilecoinMainnet: {
      chainId: 314,
      url: "https://rpc.ankr.com/filecoin",
      accounts: [PRIVATE_KEY],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}
