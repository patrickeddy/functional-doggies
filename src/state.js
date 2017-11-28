//////////////////////////////////////////////
// State
// - State object used for getting/setting state props
// - stateBroadcaster used for handling state changes
//////////////////////////////////////////////

const _state = {
  stateChanged () {}
}
const stateValidator = {
  set: function (obj, prop, value) {
    obj[prop] = value
    state.stateChanged(obj, prop, value)
    return true
  }
}
const proxize = stateObj => {
  const s = Object.assign({}, stateObj)
  Object.keys(s).map(key => s[key] = new Proxy(s[key], stateValidator))
  return s
}

///////////////////////
//     Exports
///////////////////////

// Main state object
// - every subkey (i.e. 'autoFetch') has primitive values
// - each subkey turns into a Proxy that intercepts changes and updates the state
let state = proxize(_state)
// Configure initial state
// - allows you to set initial props for the state
// `configureIntialState({
//      dogs: [],
//      dagPaws: 4,
//      nonDescriminatoryDawPaws: (dog) => dog.paws
//  })`
const configureInitialState = newState => state = Object.assign(state, proxize(newState))

// State broadcaster
// - calls every StateChangeHandler when state props are updated
// - compose: `makeStateBroadcaster(SCHOne, SCHTwo, SCHThree, ...)`
// - SCHs: `(obj, prop, value) => { ...do stuff on state changed... }`
const makeStateBroadcaster = (...fns) => {
  state.stateChanged = (...args) => fns.map(fn => fn(...args)) // set the callback to be all of the functions given
}

// Exports
export {
  configureInitialState,
  state,
  makeStateBroadcaster
}
