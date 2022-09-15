import { WarpFactory } from 'warp-contracts/mjs'

const DAO = 'ErPdk0l4_PTy5dxNjJacGQJEIDOOl2P-f0AbpbeoSGs'

const warp = WarpFactory.forLocal()

const result = await warp.contract(DAO).readState()

console.log(JSON.stringify(result.cachedValue.state, null, 2))