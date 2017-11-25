// Elements
let dogButton,
    dogButton2,
    autoFetchButton,
    autoFetchingText,
    autoFetchIntervalInput,
    divDogs
    = null

// Utils
const API_URL = 'https://dog.ceo/api/breeds/image/'
// Generic compose function (Who needs lodash, am I right?)
const compose = (...fns) => (...args) => fns.reduceRight((acc, fn) => fn(acc))
// Fetch the dog data
const fetchDogImage = (breed = 'random') => fetch(API_URL + breed)

// State
const _state = {
    autoFetch: {
      on: false,
      freq: 1000
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
// stateChanged is a onchange broadcaster to State Change Handlers (SH)
const stateChanged = makeStateBroadcaster(
  SCHAutoFetch
)

// StateChangeHandler - AutoFetch
function SCHAutoFetch(){
  if (state.autoFetch.on){
    autoFetchingText.style.cssText = 'display: inline-block;'
    autoFetchIntervalInput.style.cssText = 'display: inline-block;'
  } else {
    autoFetchingText.style.cssText = 'display: none;'
    autoFetchIntervalInput.style.cssText = 'display: none;'
  }
  const newFreq = parseInt(autoFetchIntervalInput.value)
  if (state.autoFetch.freq !== newFreq){
    state.autoFetch.freq = newFreq
  }
  autoFetchingText.innerHTML = `Auto fetching (${newFreq/1000}s)`
}

// Helpers
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
      setTimeout(() => this._loop(f), state.autoFetch.freq)
    }
  }
}

// xfs
const imgHtml = url => "<img width='350' src='" + url + "' />"
const prependDog = (el, url) => el.innerHTML = `<div>${imgHtml(url) + el.innerHTML}</div>`
const appendDog = (el, url) => el.innerHTML = `<div>${el.innerHTML + imgHtml(url)}</div>`

// partial functions
const makeAddDogImg = addXf => el => url => addXf(el, url)
const prependAddDog = makeAddDogImg(prependDog)
const appendAddDog = makeAddDogImg(appendDog)
const fetchAndSetDog = (addXf) => () => {
  fetchDogImage()
    .then(response => response.json())
    .then(dog => dog.message)
    .then(addXf)
}

// Run app
function run() {
  const body = `
  <div>
    <div>
      <button id="button-new-dog" style="font-size: 16px;">Get new dog</button>
      <button id="button-new-dog-2" style="font-size: 16px;">Append new dog</button>
      <button id="button-auto-fetch" style="font-size: 16px;">Toggle auto fetch</button>
      <span id="text-auto-fetching" style="display:none;"></span>
      <input id="range-auto-fetch-interval" style="display:none;" type="range" min="500" max="3000" />
    </div>
    <div id="dogs" style="text-align:center"></div>
  </div>
  `
  // Append the body to the actual body
  document.body.innerHTML = body

  // Elements from body
  dogButton = window.document.getElementById('button-new-dog')
  dogButton2 = window.document.getElementById('button-new-dog-2')
  autoFetchButton = window.document.getElementById('button-auto-fetch')
  autoFetchIntervalInput = window.document.getElementById('range-auto-fetch-interval')
  autoFetchingText = window.document.getElementById('text-auto-fetching')
  divDogs = window.document.getElementById('dogs')

  // event listeners
  dogButton.onclick = compose(fetchAndSetDog, prependAddDog, divDogs)
  dogButton2.onclick = compose(fetchAndSetDog, appendAddDog, divDogs)
  autoFetchButton.onclick = compose(AutoFetch.toggle, fetchAndSetDog, prependAddDog, divDogs)
  autoFetchIntervalInput.onchange = stateChanged


  // default call
  fetchAndSetDog(prependAddDog(divDogs))()
}

window.onload = run
