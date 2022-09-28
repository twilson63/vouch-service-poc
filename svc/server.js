import express from 'express'
import fs from 'fs'
import Arweave from 'arweave'
import { sign } from 'crypto'

const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))

const arweave = Arweave.init({
  host: 'localhost',
  port: '1984',
  protocol: 'http'
})

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/vouch', express.json(), async (req, res) => {
  const vouchServiceAddress = await arweave.wallets.jwkToAddress(wallet)
  await arweave.api.get(`mint/${vouchServiceAddress}/${arweave.ar.arToWinston('1000')}`)

  console.log(vouchServiceAddress)
  // this takes a wallet address
  const addr = req.body.addr
  const result = await arweave.crypto.sign(wallet, addr)

  // signature = crypto.sign(address, privateKey)
  const signature = result.toString('base64')

  // create a transaction using ANS-109
  const txn = await arweave.createTransaction({
    data: addr
  })

  // write a Vouch-For transaction
  txn.addTag('App-Name', 'Vouch')
  txn.addTag('Vouch-For', addr)
  txn.addTag('App-Version', '0.1')
  // tag Verified-Signature
  txn.addTag('Verification-Signature', signature)

  await arweave.transactions.sign(txn, wallet)
  const txnRes = await arweave.transactions.post(txn)
  // submit ok.

  res.send({ id: txn.id })
})

app.listen(3000)