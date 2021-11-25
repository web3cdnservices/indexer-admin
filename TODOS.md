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
- [ ] Send Tx modal component
account

## Projects Management

- [x] UI Implementation for project list page
- [ ] dd project workflow
- [ ] Display Project list with data from coordinator service
- [ ] Project detail page
  - [ ] Start indexing project flow
  - [ ] Update project to ready flow
  - [ ] UI components for project detail page

## Header and Footer

- [x] Header includes icon, tabbars and account profile
- [x] Footer includes media links

## Optimisation

- [ ] Display `empty` or `error` modal when switch to unsupport network and account
- [ ] Show a tutorial tip let indexer go to project page to add project after config controller
- [ ] Replace `hashIcon` with other library to generte hash icon
- [ ] Support font family in the design
- [ ] Move `colors` to a constant file, support theme in the future
- [ ] The account info in the header bar, show address excpt in the account page.

## Test Values

- Controller Account:
  - `0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0`
  - `0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc`
  