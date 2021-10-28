# Indexer Admin App

## Local Test

### Preparation

Make sure have `contracts` repo at the same folder level with this project. We don't have the contract sdk public on npm, so that there has local dependencies with [contracts](https://github.com/subquery/contracts) project.

1. Run `yarn start:node` to start `moonbeam` local node.

2. Run `yarn deploy:contract` to deploy the contract to local node, build the contract sdk and copy the deployment file to the project. Make sure have config the correct moonbeam [env](https://github.com/subquery/contracts/blob/main/.env_template) in `contracts` project, otherwise the contract deployment will be failed.

3. Install `MetaMask` extension on your browser. Import accounts with seed words for moonbeam dev accounts: `bottom drive obey lake curtain smoke basket hold race lonely fit walk`,  config a customiszed network for the local node.

4. Once switch to the local node, and add the `SQT` token to the account, should see the correct balances.

5. After check the network and contract with MetaMask. Run `yarn start` to start the app locally. Press `Connect With MetaMask` button to connect the accounts with the app.

6. A new account can `registry` as an indexe. Can config `controller account` and `unregistry` from the netwrok.
