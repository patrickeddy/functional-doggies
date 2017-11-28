//////////////////////////////////////////////
// State
// - State object used for getting/setting state props
// - stateBroadcaster used for handling state changes
//////////////////////////////////////////////

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
    state.stateChanged(obj, prop, value)
    return true
  }
}

///////////////////////
//     Exports
///////////////////////

// Main state object
// - every subkey (i.e. 'autoFetch') has primitive values
// - each subkey turns into a Proxy that intercepts changes and updates the state
const state = (init => {
    const s = Object.assign({}, init)
    Object.keys(s).map(key => s[key] = new Proxy(s[key], stateValidator)) // proxize subkeys
    return s
})(_state)

// State broadcaster
// - calls composed methods with updating state props
/* (obj, prop, value) => { ...do stuff... } */
const makeStateBroadcaster = (...fns) => {
  state.stateChanged = (...args) => fns.map(fn => fn(...args)) // set the callback to be all of the functions given
}

// Exports
export {
  state,
  makeStateBroadcaster
}
