import Arweave from 'arweave'
import { WarpFactory } from 'warp-contracts/mjs'
import fs from 'fs'

const DAO = 'ErPdk0l4_PTy5dxNjJacGQJEIDOOl2P-f0AbpbeoSGs'

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
})

const warp = WarpFactory.forLocal()

const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))
const jwk = await arweave.wallets.generate()
fs.writeFileSync('./svc/internal.json', JSON.stringify(jwk))

const res = await warp.contract(DAO).connect(wallet).writeInteraction({
  function: 'setPublicKey',
  publicKey: jwk.n
})
console.log(res)
await warp.testing.mineBlock()

const result = await warp.contract(DAO).readState()
console.log(result)