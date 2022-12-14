# Vouch Service Proof of Concept

This POC is to showcase the concept of registering and rotating public keys from a vouch service to be stored on the community DAO contract. Then create an API endpoint on the vouch service to `/sign` a wallet address using an internal `private key` for the vouch service. This internal key is a contained in a JWK file. Finally the client contract takes the signature as input and uses the DAO contract to get the public key and then verify the caller address, public key and signature to make sure that the caller is vouched by the vouched service. 

The purpose of this flow is to enable contracts to only execute functionality if the caller requesting the execution of the functionality is vouched by a service that is approved by the DAO contract.

## Project Structure

* dao - contains the contract, state and deploy script of the DAO contract
* svc - contains the REST server for the vouch service
* client - contains the client contract that needs to only allow vouched callers of a function.

## Steps to Test

> Start arlocal `npx arlocal`

To test this workflow:

1. Deploy DAO contract - `node dao/deploy.js`
1. Set Public Key - `node dao/set-public-key.js`

> This step will also set an internal JWK in the `svc` directory to be used to create a signature

1. Create Vouch Record for address - `node src/create-vouch.js`
1. Start vouch service server - `node svc/server.js`
1. Request a signature for a wallet
1. 