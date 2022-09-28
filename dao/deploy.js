import { LoggerFactory, WarpFactory } from 'warp-contracts/mjs'
import fs from 'fs'

const warp = WarpFactory.forLocal()

const wallet = await warp.testing.generateWallet()

fs.writeFileSync('wallet.json', JSON.stringify(wallet.jwk))

const src = fs.readFileSync('./dao/contract.js', 'utf-8')

const res = await warp.createContract.deploy({
  src,
  wallet: wallet.jwk,
  initState: JSON.stringify({
    votes: [{
      key: 'Voucher',
      status: 'passed',
      value: wallet.address
    }],
    keys: {}
  })
})

console.log(res)



