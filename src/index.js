import {
  el,
  trace,
  compose
} from './utils'
import {
  fetchDog,
  prependDog,
  appendDog,
  spinDog
} from './fetch_dog'

import {
  AutoFetch,
  Dogs
} from './helpers'

import {
  state,
  makeStateBroadcaster
} from './state'

// Elements
let breedInput,
    dogButton,
    dogButton2,
    autoFetchButton,
    autoFetchTools,
    autoFetchText,
    autoFetchIntervalInput,
    clearButton,
    dogsDiv
    = null

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


// Run app
function run() {
  const body = `
  <div>
    <div class="buttons">
      <a href="https://dog.ceo/dog-api/#breeds-list">(breed list)</a>
      <input id="input-breed" type="text" placeholder="Enter breed here" value="random" />
      <button id="button-new-dog">Get new dog</button>
      <button id="button-new-dog-2">Spin new dog</button>
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
  breedInput = el('input-breed')
  dogButton = el('button-new-dog')
  dogButton2 = el('button-new-dog-2')
  autoFetchButton = el('button-auto-fetch')
  autoFetchTools= el('auto-fetch-tools')
  autoFetchText = el('text-auto-fetch')
  autoFetchIntervalInput = el('range-auto-fetch-interval')
  clearButton = el('button-clear')
  dogsDiv = el('dogs')

  // event listeners
  const prependHandler = fetchDog(prependDog)
  const spinHandler = fetchDog(spinDog)
  const toggleHandler = fetchDog(prependDog)
  const clearHandler = Dogs.clear.bind(null, dogsDiv)

  dogButton.onclick = () => prependHandler(breedInput.value)
  dogButton2.onclick = () => spinHandler(breedInput.value)
  autoFetchButton.onclick = () => AutoFetch.toggle(() => toggleHandler(breedInput.value))
  autoFetchIntervalInput.onchange = stateChanged
  clearButton.onclick = clearHandler

  // default call
  fetchDog(prependDog)(breedInput.value)
}

window.onload = run
