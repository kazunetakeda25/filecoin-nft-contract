import { ethers } from 'ethers'
import Head from 'next/head'
import { useState } from 'react'
import {
  Button,
  Input,
  Box,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'

const filecoinRpcUrl = 'https://rpc.ankr.com/filecoin_testnet'
const contractAddress = '0x27FA18c5F62F934795200db4CE4a93E1A03828A1'
const contractAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'dataToTokenIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'metadata',
    outputs: [
      {
        internalType: 'uint64',
        name: 'dealId',
        type: 'uint64',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
      {
        internalType: 'uint64',
        name: 'size',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'clientActorId',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'providerActorId',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'dealId',
        type: 'uint64',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const Home = (): JSX.Element => {
  const [dealId, setDealId] = useState('')
  const [viewTokenId, setViewTokenId] = useState('')
  const [nft, setNft] = useState(null)

  const isMetaMaskConnected = () => {
    if (!isMetaMaskInstalled()) {
      alert('Please install MetaMask')
      return false
    }
    return true
  }

  const isMetaMaskInstalled = () => {
    if (window['ethereum']) {
      return window['ethereum'].isMetaMask
    }
    return false
  }

  const mint = async () => {
    try {
      const accounts = await window['ethereum'].request({
        method: 'eth_requestAccounts',
      })
      console.log(accounts) // eslint-disable-line no-console
      if (isMetaMaskConnected()) {
        const provider = new ethers.providers.Web3Provider(window['ethereum'])
        const signer = provider.getSigner(0)
        const nftContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        )
        const tx = await nftContract.mint(dealId)
        console.log(tx) // eslint-disable-line no-console
        alert('Tx sent: ' + tx.hash)
        const txReceipt = await tx.wait()
        console.log(txReceipt) // eslint-disable-line no-console
      }
    } catch (error) {
      console.error(error)
    }
  }

  const view = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(filecoinRpcUrl)
      const nftContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      )
      const tokenURI = await nftContract.tokenURI(viewTokenId)
      console.log(tokenURI) // eslint-disable-line no-console
      const metadata = await nftContract.metadata(viewTokenId)
      console.log(metadata) // eslint-disable-line no-console
      setNft({
        tokenId: viewTokenId,
        dealId: metadata.dealId.toNumber(),
        data: metadata.data,
        size: metadata.size.toNumber(),
        clientActorId: metadata.clientActorId.toNumber(),
        providerActorId: metadata.providerActorId.toNumber(),
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="container bg-gray-100 font-body">
        <Head>
          <title>Starboard NFT</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="section">
          <img
            src="/logo.jpg"
            alt=""
            width="500"
            height="500"
            style={{ display: 'block', margin: 'auto' }}
          ></img>

          <Input
            placeholder="Deal ID"
            width="400"
            variant="flushed"
            borderColor="yellow.500"
            focusBorderColor="yellow.400"
            className="mb-4"
            onChange={(e) => setDealId(e.target.value)}
          />

          <div className={'m-2'}></div>

          <Button
            colorScheme="yellow"
            textColor={'white'}
            variant="solid"
            onClick={mint}
            size="lg"
          >
            Mint NFT
          </Button>

          <div className="mt-8 mb-4" />

          <Input
            placeholder="Token ID"
            width="400"
            variant="flushed"
            focusBorderColor="yellow.400"
            className="mb-4"
            onChange={(e) => setViewTokenId(e.target.value)}
          />

          <div className={'m-2'}></div>

          <Button
            colorScheme="yellow"
            textColor={'white'}
            variant="solid"
            onClick={view}
            size="lg"
          >
            View NFT
          </Button>

          {nft && (
            <>
              <Center>
                <Box w="500">
                  <div className="mb-12"></div>
                  <img
                    src="https://picsum.photos/800\"
                    alt=""
                    width="300"
                    height="300"
                    style={{ display: 'block', margin: 'auto' }}
                  ></img>
                  <TableContainer>
                    <Table variant="simple" size={'lg'}>
                      <Thead>
                        <Tr>
                          <Th borderColor={'gray'}>Key</Th>
                          <Th borderColor={'gray'}>Value</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>Token ID</Td>
                          <Td>{nft.tokenId}</Td>
                        </Tr>
                        <Tr>
                          <Td>Deal ID</Td>
                          <Td>{nft.dealId}</Td>
                        </Tr>
                        {/* <Tr>
                      <Td>Data</Td>
                      <Td>{nft.data}</Td>
                    </Tr> */}
                        <Tr>
                          <Td>Size</Td>
                          <Td>{nft.size}</Td>
                        </Tr>
                        <Tr>
                          <Td>Client Actor Id</Td>
                          <Td>{nft.clientActorId}</Td>
                        </Tr>
                        <Tr>
                          <Td borderColor={'gray'}>Provider Actor Id</Td>
                          <Td borderColor={'gray'}>{nft.providerActorId}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <div style={{ display: 'flex' }}></div>
                  <div className="mb-16"> </div>
                </Box>
              </Center>
            </>
          )}
        </main>

        <style jsx>{`
          main {
            text-align: center;
          }

          p {
            margin-top: 0;
          }

          .container {
            padding: 2rem;
            margin: 0 auto;
          }

          .grid {
            display: grid;
            grid-template-columns: auto auto;
            justify-content: space-between;
          }

          .mb-0 {
            margin-bottom: 0;
          }
          .mb-1 {
            margin-bottom: 0.25rem;
          }
        `}</style>
      </div>
      <footer></footer>
    </>
  )
}

export default Home
