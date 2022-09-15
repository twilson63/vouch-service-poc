import express from 'express'
import fs from 'fs'

const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/sign', express.json(), (req, res) => {
  // need to get address and sign address with private key

  console.log(req.body)
  res.send(res.body)
})