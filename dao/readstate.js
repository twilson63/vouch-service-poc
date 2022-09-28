import { WarpFactory } from 'warp-contracts/mjs'

const DAO = 'hAs-nu__dLM7aWLQRzG0wkouCA0qVw4KAL7Q3DtPUTY'

const warp = WarpFactory.forLocal()

const result = await warp.contract(DAO).readState()

console.log(JSON.stringify(result.cachedValue.state, null, 2))