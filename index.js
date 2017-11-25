// Elements
let dogButton,
    dogButton2,
    autoFetchButton,
    autoFetchTools,
    autoFetchText,
    autoFetchIntervalInput,
    divDogs
    = null

// Utils
const el = (id) => window.document.getElementById(id)
const API_URL = 'https://dog.ceo/api/breeds/image/'
// Generic compose function (Who needs lodash, am I right?)
const compose = (...fns) => fns.reduceRight((g, f) => (...args) => f(g(...args)))
const trace = (message) => f => {
  console.log(message,f)
  return f
}
// Fetch the dog data
const fetchDogImage = (breed = 'random') => fetch(API_URL + breed)

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
    }
}
const stateValidator = {
  set: function (obj, prop, value) {
    obj[prop] = value
    stateChanged()
    return true
  }
}
const state = _state
// - every subkey (i.e. 'autoFetch') has primitive values
// - each subkey turns into a Proxy that intercepts changes and updates the state
Object.keys(_state).map(key => state[key] = new Proxy(_state[key], stateValidator)) // proxize subkeys


const makeStateBroadcaster = (...fns) => () => fns.map(fn => fn())
// stateChanged is a onchange broadcaster to State Change Handlers (SCH)
const stateChanged = makeStateBroadcaster(
  SCHDogs,
  SCHAutoFetch,
  trace('~~ App State Changed ~~')
)

// StateChangeHandler - Dogs
function SCHDogs() {
  if (state.dogs.oldSize < state.dogs.size){
    // Add the missing dogs to the document
    const dogDif = state.dogs.all.slice(state.dogs.oldSize)
    dogDif.map(d => d.xf(dogsDiv))
    state.dogs.oldSize = state.dogs.size
  }
}

// StateChangeHandler - AutoFetch
function SCHAutoFetch() {
  if (state.autoFetch.on){
    autoFetchTools.classList.add("on")
    autoFetchButton.innerHTML = 'Auto fetch = on'
  } else {
    autoFetchTools.classList.remove("on")
    autoFetchButton.innerHTML = 'Auto fetch = off'
  }
  const newFreq = parseInt(autoFetchIntervalInput.value)
  if (state.autoFetch.freq !== newFreq){
    state.autoFetch.freq = newFreq
  }
  autoFetchText.innerHTML = `<h2>Every ${ Math.floor(((newFreq/1000) * 100))/100 } seconds!</h2>`
}

// Helpers
const Dogs = {
  clear () {
    dogsDiv.innerHTML = ""
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

// dog html xfs
const d = dog => `
    <div class="dog">
        <h1>Doggie #${ dog.id }</h1>
        <img src="${ dog.url }" title="${ dog.id }" />
    </div>
`
const prependDogHtmlXf = id => el => el.innerHTML = `${ d(state.dogs.all[id]) + el.innerHTML }`
const appendDogHtmlXf = id => el => el.innerHTML = `${ el.innerHTML + d(state.dogs.all[id]) }`

// add the dog to state
const makeAddDog = addXf => dogUrl => {
  const newId = state.dogs.all.length
  const newDog = { id: newId, url: dogUrl, xf: addXf(newId) }
  state.dogs.all.push( newDog )
  state.dogs.size += 1
}

// ready-for-use partials
const prependDog = makeAddDog(prependDogHtmlXf)
const appendDog = makeAddDog(appendDogHtmlXf)

// fetch dog
const fetchDogUrl = (xfCallback) => {
  fetchDogImage()
    .then(response => response.json())
    .then(dog => dog.message)
    .then(xfCallback)
}
const composeFetch = (xfPartial) => fetchDogUrl.bind(null, xfPartial)

// Run app
function run() {
  const body = `
  <div>
    <div class="buttons">
      <button id="button-new-dog">Get new dog</button>
      <button id="button-new-dog-2">Append new dog</button>
      <button id="button-auto-fetch"></button>
      <button id="button-clear">Clear</button>
      <div id="auto-fetch-tools">
        <p id="text-auto-fetch"></p>
        <p><input id="range-auto-fetch-interval" type="range" min="500" max="3000" /></p>
      </div>
    </div>
    <div id="dogs" style="text-align:center"></div>
  </div>
  `
  // Append the body to the actual body
  document.body.innerHTML = body

  // Elements from body
  dogButton = el('button-new-dog')
  dogButton2 = el('button-new-dog-2')
  autoFetchButton = el('button-auto-fetch')
  autoFetchTools= el('auto-fetch-tools')
  autoFetchText = el('text-auto-fetch')
  autoFetchIntervalInput = el('range-auto-fetch-interval')
  clearButton = el('button-clear')
  dogsDiv = el('dogs')

  // event listeners
  const prependHandler = composeFetch(prependDog)
  const appendHandler = composeFetch(appendDog)
  const toggleHandler = composeFetch(prependDog)
  const clearHandler = Dogs.clear

  dogButton.onclick = prependHandler
  dogButton2.onclick = appendHandler
  autoFetchButton.onclick = () => AutoFetch.toggle(toggleHandler)
  autoFetchIntervalInput.onchange = stateChanged
  clearButton.onclick = clearHandler

  // default call
  fetchDogUrl(prependDog)
}

window.onload = run
