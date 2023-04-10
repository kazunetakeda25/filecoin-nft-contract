const hre = require("hardhat")

async function main() {
    // Deploy StarboardNFT
    const StarboardNFT = await hre.ethers.getContractFactory("StarboardNFT")
    console.log("Deploying StarboardNFT...")
    const starboardNFT = await StarboardNFT.deploy("Starboard NFT", "SB")
    await starboardNFT.deployed()
    console.log("StarboardNFT deployed to:", starboardNFT.address)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
