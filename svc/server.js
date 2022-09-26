import express from 'express'
import fs from 'fs'

const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/vouch', express.json(), (req, res) => {
  // this takes a wallet address
  // signature = crypto.sign(address, privateKey)
  // create a transaction using ANS-109
  // write a Vouch-For transaction
  // tag Verified-Signature
  // submit ok.

  res.send(res.body)
})