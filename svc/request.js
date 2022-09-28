import fetch from 'node-fetch'
import Arweave from 'arweave'

const arweave = Arweave.init({
  host: 'localhost',
  port: '1984',
  protocol: 'http'
})

// Vouch Request
async function main() {
  const res = await fetch('http://localhost:3000/vouch',
    {
      method: "POST", headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addr: 'kY9RAgTJEImkBpiKgVeXrsGV02T-D4dI3ZvSpnn7HSk' })
    })
    .then(res => res.json())
    .then(async obj => {
      const id = obj.id
      const result = await arweave.api.get('tx/' + id)

      console.log("RESULT: ", result.data)
    })
}

main();