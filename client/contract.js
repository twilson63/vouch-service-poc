
async function isAddressVouched(action) {
  const VOUCHDAO = 'XXXXXXX'
  // get state of VouchDAO
  const vouchDAOState = await SmartWeave.readContractState(VOUCHDAO)
  // make sure the service is valid
  const vote = vouchDAOState.votes.find(v => v.value === action.input.service)
  if (vote.status === 'passed') {
    // get public key of the service
    const key = vouchDAOState.keys[action.input.service]
    // verify the signature
    return crypto.verify('SHA256', action.caller, key, action.input.signature)
  } else {
    return false
  }
}

export async handle(state, action) {
  if (action.input.function === 'stamp') {
    if (isAddressVouched(action)) {
      // do stuff
    }
  }
}