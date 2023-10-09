'use client';

import { useEffect, useState } from 'react'
import {
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS
} from '@web3auth/base'
import { Web3AuthModalPack, Web3AuthConfig, Web3AuthEventListener } from '@safe-global/auth-kit'
import { Web3AuthOptions } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { ethers } from 'ethers'

const {
  Contract,
} = require('ethers')

function Home() {
  const [getWeb3AuthModalPack, setWeb3AuthModalPack] = useState<Web3AuthModalPack>()
  const [getContract, setContract] = useState<typeof Contract>()
  const [account, setAccount] = useState("loading");
  const [counter, setCounter] = useState("loading");
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const WEB3AUTH_CLIENT_ID = 'BP8Z3802JH0wJQhKBRF1kEbeELMrM0h-Ac4xZpvXzezfIEKxvsDJJkBGzaVsbMSqIVLrUOeikazIpEGfn2tFLJw' // https://dashboard.web3auth.io/
  const RPC_URL = 'https://sepolia-rpc.scroll.io/' // https://chainlist.org/
  const CHAIN_ID = '0x8274F' //534351

  useEffect(() => {
    handleInit()
  }, []);

  const handleInit = async () => {
    console.log("initializing web3Auth")
    // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
    const options: Web3AuthOptions = {
      clientId: WEB3AUTH_CLIENT_ID,
      web3AuthNetwork: 'testnet',
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: CHAIN_ID,
        rpcTarget: RPC_URL
      },
      uiConfig: {
        theme: {
          primary: "dark"
        },
        loginMethodsOrder: ['google', 'facebook']
      }
    }

    // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
    const modalConfig = {
      [WALLET_ADAPTERS.TORUS_EVM]: {
        label: 'torus',
        showOnModal: false
      },
      [WALLET_ADAPTERS.METAMASK]: {
        label: 'metamask',
        showOnDesktop: true,
        showOnMobile: false
      }
    }

    // https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
    const openloginAdapter = new OpenloginAdapter({
      loginSettings: {
        mfaLevel: 'mandatory'
      },
      adapterSettings: {
        uxMode: 'popup',
        whiteLabel: {
          //name: 'Safe'
        }
      }
    })

    const web3AuthConfig: Web3AuthConfig = {
      txServiceUrl: 'https://safe-transaction-goerli.safe.global'
    }

    // Instantiate and initialize the pack
    const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig)
    await web3AuthModalPack.init({ options, adapters: [openloginAdapter], modalConfig })
    
    setWeb3AuthModalPack(web3AuthModalPack)

    console.log("web3Auth initialized")

    setIsLoading(false)
    setAccount("Please connect")

    try {
      ethers.provider = new ethers.providers.Web3Provider(web3AuthModalPack.getProvider())

      console.log("ethers initialized")

      const abi = [
        "function increment() public",
        "function getCounter() public view returns(uint)"
      ]
    
      const contractAddress = "0x7767280E46d5f183861c39aC8B5885FC2Ef55CDA"
      const contract = new Contract(contractAddress, abi, ethers.provider.getSigner())

      console.log("contract initialized")

      setContract(contract)
      setCounter((await contract.getCounter()).toString())
    } catch(_e)
    {
      console.log("could not connect. wrong network?")
    }
  };

  const handleSignIn = async () => {
    const authKitSignData = await getWeb3AuthModalPack.signIn()
    console.log(authKitSignData.eoa)
    if(authKitSignData.eoa)
    {
      setAccount(authKitSignData.eoa)
      setIsSignedIn(true)
      handleInit()
    }
  };

  const handleSignOut = async () => {
    await getWeb3AuthModalPack.signOut()
    setIsSignedIn(false)
  };

  const handleIncrement = async () => {
    let tx = await getContract.increment()
  }

  return (
    <div>
      {!isSignedIn && !isLoading &&
        <button onClick={handleSignIn}>Connect</button>
      }
      {isSignedIn &&
        <button onClick={handleSignOut}>Sign out</button>
      }
      <p>Account: {account}</p>
      <p>Counter: {counter}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  )
}

export default Home