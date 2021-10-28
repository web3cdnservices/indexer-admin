# Indexer Admin App

## Local Test

Make sure have `contracts` repo at the same folder level with this project. There has local dependencies with `contracts` project.

1. Run `yarn start:node` to start `moonbeam` local node.
2. Run `deploy:contract` to deploy the contract to local node, build the contract sdk and copy the deployment file to the projects. Make sure have config the correct `env` in `contracts` project, otherwise the contract deployment will be failed.
3. Install `MetaMask` extension on your browser. Import accounts with memonic words for moonbeam dev accounts and config a customiszed network for the local node.
4. Once switch to local node, and add the `SQT` token to the account, should see the correct balances.
5. After check the network and contract with MetaMask. Run `yarn start` to start the app locally. Press `Connect With MetaMask` to connect the accounts with the app.
