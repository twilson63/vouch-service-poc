export async function handle(state, action) {
  if (action.input.function === 'setPublicKey') {
    ContractAssert(action.input.publicKey, 'publicKey is required!')

    const service = state.votes.find(v => v.value === action.caller)
    if (service && service.status === 'passed') {
      state.keys[action.caller] = action.input.publicKey
    }

    return { state }
  }
  throw ContractError('function not found!')
}