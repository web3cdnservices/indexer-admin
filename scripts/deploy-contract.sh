# deploy contract to loccal network
# make sure the `contracts` repo is at the same folder with this project\

# go to contracts folder
cd ../contracts

# build the sdk
yarn build:contract
yarn build:types
yarn build:ts

# deploy contract to local network
yarn deploy

# copy the deployment json file back to this project
cp -f ./publish/local.json ../indexer-admin/src/contract/localnet.json

# update sdk module
yarn upgrade @subql/contract-sdk