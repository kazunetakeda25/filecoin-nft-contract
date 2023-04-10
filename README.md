# Blockchain Engineer Assignment
Filecoin Virtual Machine is now live on Filecoin mainnet. Blockchain developers can build EVM smart contracts either operating directly on their own like on any other EVM chains or interacting with Filecoin built-in actors through the Filecoin Solidity API (a Solidity library that
allows smart contracts to call methods on Filecoin native actors).

## Task
Propose a NFT application design, write a set of smart contracts (>1 contract) on FEVM that interacts with the Filecoin Solidity API, and deploy them to the Hyperspace testnet. 

Please provide test cases and documentation (including a brief explanation to the application design) as well.

### Resources:

● Background

&emsp;&emsp;○ Understanding Filecoin Economy

&emsp;&emsp;○ Filecoin Spec

&emsp;&emsp;○ Filecoin Built-in Actors

&emsp;&emsp;○ Solidity by Example

&emsp;&emsp;○ FEVM Background

&emsp;&emsp;○ FEVM Hackathon Projects

● Tutorials

&emsp;&emsp;○ FEVM Hardhat Kit

&emsp;&emsp;○ EVM Smart Contract as a Deal Client

&emsp;&emsp;○ Wallaby Configuration for MetaMask

&emsp;&emsp;○ Filecoin Solidity API Docs

## How to run
### Prepare env
1. Rename `.env.example` to `.env`
2. Put your private key of your wallet into `PRIVATE_KEY` in `.env` file
### Smart Contract
1. Install dependencies
```
yarn
```
2. Compile contract
```
yarn compile
```
3. Test the contracts
```
yarn test
```
4. Coverage the contract
```
yarn coverage
```
### Dapp
1. Go to app folder
```
cd app
```
2. Install dependencies
```
yarn
```
3. Test the dapp
```
yarn dev
```

## Contract architecture
### Metadata struct
On-chain metadata struct
```
struct Metadata {
  uint64 dealId; // Deal ID
  bytes data; // Data
  uint64 size; // Size of the metadata
  uint64 clientActorId; // Client actor ID
  uint64 providerActorId; // Provider actor ID
}
```
Only owner can mint NFTs, need to specify dealId in order to get deal data commitment.
When Deal data exists, this means the token is already minted.
From the deal ID, we can get client actor ID and provider actor ID.
We store metadata using those information.
Otherwise, it is same as normal ERC721 mint.
```
function mint(uint64 dealId_) external onlyOwner {
  uint256 tokenId = _tokenIdCounter.current();

  MarketTypes.GetDealDataCommitmentReturn memory dealCommitment = MarketAPI
    .getDealDataCommitment(dealId_);

  if (_dataToTokenIds[dealCommitment.data] != 0) {
    revert TokenAlreadyMinted();
  }

  _dataToTokenIds[dealCommitment.data] = tokenId;

  uint64 clientActorId = MarketAPI.getDealClient(dealId_);
  uint64 providerActorId = MarketAPI.getDealProvider(dealId_);

  _metadata[tokenId] = Metadata(
    dealId_,
    dealCommitment.data,
    dealCommitment.size,
    clientActorId,
    providerActorId
  );

  _tokenIdCounter.increment();

  _mint(msg.sender, tokenId);
}
```
