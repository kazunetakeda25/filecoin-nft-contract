// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Openzeppelin
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// Zondax
import "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
                         
// Errors
error TokenAlreadyMinted();
error TokenNotExist();

/**
 * @title StarboardNFT
 * @dev Starboard NFT contract using Zondax Filecoin API
 * @author kazunetakeda25
 */
contract StarboardNFT is ERC721, Ownable2Step {
    using Counters for Counters.Counter;

    struct Metadata {
        uint64 dealId;
        bytes data;
        uint128 size;
        uint64 clientActorId;
        uint64 providerActorId;
    }

    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => Metadata) private _metadata;
    mapping(bytes => uint256) private _dataToTokenIds;

    /**
     * @dev Constructor
     * @param name_ (string memory) Collection name
     * @param symbol_ (string memory) Collection symbol
     */
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        _tokenIdCounter.increment(); // Token ID starts from 1
    }

    /**
     * @dev Mint an NFT (onlyOwner)
     * @param dealId_ (uint64) Deal ID
     */
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

    /**
     * @dev Returns the token URI of `tokenId_`
     * @param tokenId_ (uint256) Token ID
     * @return (string memory) Token URI
     */
    function tokenURI(uint256 tokenId_) public view override returns (string memory) {
        if (!_exists(tokenId_)) {
            revert TokenNotExist();
        }

        return string.concat(
            "data:application/json,",
            "{\"name\":\"StarboardNFT #\",",
            Strings.toString(tokenId_),
            "\"description\":\"This is a test Starboard collection NFT.\",",
            "\"image\":\"https://picsum.photos/800\"",
            "}"
        );
    }
}
