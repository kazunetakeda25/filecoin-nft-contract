const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("StarboardNFT", function () {
    let starboardNFT
    let owner

    beforeEach(async function () {
        ;[owner, addr1] = await ethers.getSigners()

        const StarboardNFT = await ethers.getContractFactory("StarboardNFT")
        starboardNFT = await StarboardNFT.deploy("Starboard NFT", "SB")
        await starboardNFT.deployed()
    })

    it("should mint an NFT", async function () {
        const dealId = 123
        await starboardNFT.connect(owner).mint(dealId)

        const tokenId = await starboardNFT.tokenOfOwnerByIndex(owner.address, 0)
        expect(tokenId).to.equal(1)

        const metadata = await starboardNFT.getMetadata(tokenId)
        expect(metadata.dealId).to.equal(dealId)
    })

    it("should not mint an NFT with duplicate deal data", async function () {
        const dealId1 = 123
        const dealId2 = 456

        await starboardNFT.connect(owner).mint(dealId1)
        await expect(starboardNFT.connect(owner).mint(dealId1)).to.be.revertedWith(
            "TokenAlreadyMinted"
        )

        await starboardNFT.connect(owner).mint(dealId2)
        await expect(starboardNFT.connect(owner).mint(dealId1)).to.be.revertedWith(
            "TokenAlreadyMinted"
        )
    })

    it("should get the token URI", async function () {
        const dealId = 123
        await starboardNFT.connect(owner).mint(dealId)

        const tokenId = await starboardNFT.tokenOfOwnerByIndex(owner.address, 0)
        const tokenURI = await starboardNFT.tokenURI(tokenId)

        expect(tokenURI).to.equal(
            'data:application/json,{"name":"StarboardNFT #1","description":"This is an NFT that proves that a file coin storage deal has taken place.","image":"https://picsum.photos/800"}'
        )
    })

    it("should not get the token URI for non-existent token", async function () {
        const tokenId = 1
        await expect(starboardNFT.tokenURI(tokenId)).to.be.revertedWith("TokenNotExist")
    })
})
