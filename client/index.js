import Arweave from 'arweave'
import { path, map, prop, find } from 'ramda'

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
})

const result = [{
  verifed: true,
  service: 'AF0DQUKMNaA9BzTz_57RRCjihyzbU1OnNOkcq0pQNes', // owner.address
  signature: 'Verified-Signature', // tag
  height: 100000, // if the block height is < 1000000
}]

const STAMP_PROTOCOL = 'aSMILD7cEJr93i7TAVzzMjtci_sGkXcWnqpDkG6UGcA'

async function getVouchedTransactionsByAddress(addr) {
  return arweave.api.post('graphql', {
    query: `
query {
  transactions(first: 100, tags: { name: "Vouch-For", values: ["${addr}"]}) {
    edges {
      node {
        id
        owner {
          address
        }
        tags {
          name
          value
        }
        block {
          timestamp
        }
      }
    }
  }
}
  `})
    .then(path(['data', 'data', 'transactions', 'edges']))
    .then(map(n =>
    ({
      id: n.node.id,
      owner: n.node.owner.address,
      vouchFor: prop('value', find(propEq('name', 'Vouch-For'), n.node.tags)),
      signature: prop('value', find(propEq('name', 'Verification-Signature'), n.node.tags))
    })))
}


async function isVouched(addr) {
  // lookup all the Vouch-For transactions
  // determine if the address legacy or if signature isthere
  const vouchedObjects = await getVouchedTransactionsByAddress(addr)
  return map(o => ({
    verified: true,
    service: o.owner,
    signature: o.signature,
    ...o
  }), vouchedObjects)
}

// the client will need to know the service wallet address
async function isVouchedByService(addr, serviceId) {
  const vouchedObjects = await getVouchedTransactionsByAddress(addr)
  const match = find(propEq('owner', serviceId), vouchedObjects)
  if (match) {
    return ({
      verified: true,
      service: match.owner,
      signature: match.signature,
      ...match
    })
  }
}

const propEq = (k, v) => obj => obj[k] === v
// client img.arweave.dev
export async function stamp(addr, asset) {
  const vouchFor = (await isVouched(addr)).find(propEq('verified', true))

  if (vouchFor) {
    const contract = warp.contract(STAMP_PROTOCOL)
    const result = await contract.connect('use_wallet').setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true
    }).writeInteraction({
      function: 'stamp',
      transction: asset,
      timestamp: Date.now(),
      signature: vouchFor.signature,
      service: vouchFor.service
    }, { strict: true })
    console.log(result)
  }
}

const main = async () => {
  const addrToVouch = (await arweave.api.get('4aOGhchjvO5_XpN3QI-q1Rya6RQLxE_kNc2G0x5k-FE')).data
  const stamped = await stamp(addrToVouch, '1234')
  console.log(stamped)
}

main()
