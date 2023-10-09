Safe recently launched an Account Abtraction authtentication kit that allows signing to dApps using socials such as Google, Facebook, Github, etc... This repo is a demo for integrating the Safe Auth Kit modal using Web3Auth under the hood on the Scroll Sepolia testnet network.

## Try the demo

Demo available at [tiny-jalebi-ba9af0.netlify.app/](https://tiny-jalebi-ba9af0.netlify.app/)

## Running

1. Create a [Web3Auth account](https://dashboard.web3auth.io/), and put your client key in the [WEB3AUTH_CLIENT_ID](https://github.com/Turupawn/ScrollSafeAADemo/blob/main/src/app/page.tsx#L25) variable
2. Run `npm install` to install dependencies
3. Run `npm run dev` to run your dApp at `localhost:3000` on your browser

## Official docs

* [Scroll docuemntation](https://docs.scroll.io/en/developers/)
* [Safe documentation](https://docs.safe.global/safe-core-aa-sdk/auth-kit)