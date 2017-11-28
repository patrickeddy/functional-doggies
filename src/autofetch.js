import {
  state
} from './state'

//////////////////////////////////////////////
// AutoFetch
// - Handles autofetching toggling, looping function calls,
//   and other autofetch related shenanigans.
//////////////////////////////////////////////

const AutoFetch = Object.freeze({
  start (/* fetch function */f) {
    state.autoFetch.on = true
    this._loop(f)
  },
  stop () {
    state.autoFetch.on = false
  },
  toggle (f) {
    state.autoFetch.on ?
      AutoFetch.stop() : AutoFetch.start(f)
  },
  _loop (f) {
    f()
    if (state.autoFetch.on) {
      setTimeout(this._loop.bind(this, f), state.autoFetch.freq)
    }
  }
})

export { AutoFetch }
