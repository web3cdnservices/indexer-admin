# TODOS

## Account Management

- [x] Login page, login with service endpoint
  - [x] Validate endpoint: request network
  - [x] Display network type
- [x] Connect MetaMask page. Install or connect with MetaMask
- [x] Get transaction result to update the UI status [loading | sucess]
- [x] Indexer Registry workflow
  - [x] Contract: request approve
  - [x] Contract: request indexer registration
  - [x] Sync indexer with coordinator
- [x] Account management page
  - [x] Account card component
  - [x] Config controller account
  - [x] unregister from network
- [x] Display `connect with metamask` view once the extension is locked
- [x] Send Tx modal component
account

## Projects Management

- [x] UI Implementation for project list page
- [x] Display Project list with data from coordinator service
- [x] Project detail page
- [x] UI components for project detail page

- [x] add project workflow
- [x] Start indexing project flow
- [x] Update project to ready flow

## Header and Footer

- [x] Header includes icon, tabbars and account profile
- [x] Footer includes media links

## Optimisation

- [ ] Display `empty` or `error` modal when switch to unsupport network and account
- [ ] Show a tutorial tip let indexer go to project page to add project after config controller
- [ ] Replace `hashIcon` with other library to generte hash icon
- [ ] Support font family in the design
- [ ] Move `colors` to a constant file, support theme in the future
- [x] The account info in the header bar, show address excpt in the account page.
- [ ] Add `copy` button for `deploymentID` `endpoints` `addresses`

## Improvements

- [ ] Indexer should can remove `Proejct` which is not started, should show `remove proejct` button in the details page

## Test Values
 
controller private key:

- `0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b`

- Controller Account:
  - `0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0`
  - `0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc`
  