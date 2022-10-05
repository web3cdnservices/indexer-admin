// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

const prompts = {
  startProject: {
    title: 'Indexing Project',
    desc: 'Start indexing project will start the subquery node service indexing the project and start a query service at the same time. It takes around 1 mins to start the services, you can see the progress and related information after everything is ready.',
  },
  stopProject: {
    title: 'Stop Indexing the Project',
    desc: 'Stop indexing the project will terminate the node and query services, once the services stopped, the service status will change to terminated. You can restart indexing the project at any time.',
  },
  restartProject: {
    title: 'Restart Project',
    desc: 'Restart indexing project will start the previous subquery node service to index the project, and start a query service at the same time. You can see the progress and related information after everything is ready.',
  },
  removeProject: {
    title: 'Are you sure to remove the project',
    desc: 'Remove project will remove the project and service containers from coordinator service and database, the indexing data will be removed at the same time. You can add the project back at any time, but need to indexing from the beginning.',
  },
  announceIndexing: {
    title: 'Update Status on Subquery Network',
    desc: 'Send transaction to start indexing the project on contract, the controller account on coordinator service will start to update the status of indexing service on the contract once the transaction completed. The transaction processing time may take around 10s, it depends on the network and gas fee. You will see the processing status on the top of the page once you confim the transaction on the MetaMask.',
  },
  announceReady: {
    title: 'Update Indexing To Ready',
    desc: 'Send transaction to change indexing status to ready on contract, the explorer will display you query endpoint once the transaction completed. The transaction processing time may take around 10s, it depends on the network and gas fee. You will see the processing status on the top of the page once you confim the transaction on the MetaMask.',
  },
  announceNotIndexing: {
    title: 'Announce Not Indexing the Project',
    desc: 'Send transaction to change indexing status to not indexing on contract, the project status will change to not indexing on the network. The transaction processing time may take around 10s, it depends on the network and gas fee. You will see the processing status on the top of the page once you confim the transaction on the MetaMask.',
  },
  paygOpen: {
    title: 'Open PAYG',
    desc: 'This will open the function of pay-as-you-go, which supports micro-payment and instant requests. The query service will based on HTTP and p2p network at the same time. If consumer establish the service, the service will be in the form of state channel. the price is the cost of per query',
  },
  paygChangePrice: {
    title: 'Change Price',
    desc: 'This will modify the cost of per query, the price of the established state channel will remain unchanged, and the new state channel will use the new price',
  },
  paygClose: {
    title: 'Close PAYG',
    desc: 'This will turn off the function of pay-as-you-go, the already established state channel will not be affected, and the new state channel will not be established.',
  },
};

export default prompts;
