import {
  state
} from './state'

// Helpers
const Dogs = {
  clear (div) {
    div.innerHTML = ""
    state.dogs.all.length = 0
    state.dogs.size = 0
    state.dogs.oldSize = 0
  }
}

const AutoFetch = {
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
}

export { Dogs, AutoFetch }
