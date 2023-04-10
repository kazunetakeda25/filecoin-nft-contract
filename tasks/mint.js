task("mint", "Mint Starboard NFT")
    .addParam("contract", "The deployed contract address")
    .addParam("dealid", "The id of the deal")
    .setAction(async (taskArgs) => {
        const contractAddr = taskArgs.contract
        const dealId = taskArgs.dealid

        const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)
        const FilecoinDealCertificate = await ethers.getContractFactory("StarboardNFT", wallet)
        const filecoinDealCertificate = await FilecoinDealCertificate.attach(contractAddr)

        console.log("Minting NFT...")
        const tx = await filecoinDealCertificate.mint(dealId)
        const txReceipt = await tx.wait()
        console.log("Complete!", txReceipt)
    })
