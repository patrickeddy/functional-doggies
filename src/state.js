// State
const _state = {
    autoFetch: {
      on: false,
      freq: 1000
    },
    dogs: {
      oldSize: 0,
      size: 0,
      all: []
    },
    stateChanged () {}
}
const stateValidator = {
  set: function (obj, prop, value) {
    obj[prop] = value
    state.stateChanged()
    return true
  }
}
const state = _state
// - every subkey (i.e. 'autoFetch') has primitive values
// - each subkey turns into a Proxy that intercepts changes and updates the state
Object.keys(_state).map(key => state[key] = new Proxy(_state[key], stateValidator)) // proxize subkeys

const makeStateBroadcaster = (...fns) => {
  state.stateChanged = () => fns.map(fn => fn()) // set the callback to be all of the functions given
}

// Exports
export { state, makeStateBroadcaster }
