/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const API_URL = 'https://dog.ceo/api/breeds/image/'

const body = `<div>
                <div>
                  <button id="button-new-dog" style="font-size: 16px;">Get new dog</button>
                  <button id="button-new-dog-2" style="font-size: 16px;">Append new dog</button>
                  <button id="button-auto-fetch" style="font-size: 16px;">Toggle auto fetch</button>
                  <span id="text-auto-fetching" style="display:none;"></span>
                  <input id="range-auto-fetch-interval" style="display:none;" type="range" min="500" max="3000" />
                </div>
                <div id="dogs" style="text-align:center"></div>
              </div>`

// Elements
let dogButton,
    dogButton2,
    autoFetchButton,
    autoFetchingText,
    autoFetchIntervalInput,
    divDogs
    = null

const _state = {
  autoFetch: {
    on: false,
    freq: 1000,
    start (/* fetch function */f) {
      this.on = true
      this.loop(f)
    },
    loop (f) {
      f()
      if (this.on) {
        setTimeout(this.loop.bind(this, f), this.freq)
      }
    },
    stop () {
      this.on = false
    }
  },
}
// Should never manipulate state directly
// Call through this proxy
const state = new Proxy(state, () => {
  set: (obj, prop) => {
    stateChanged()
    return
  }
})

function stateChanged(){
  // Auto fetching
  stateChangedAutoFetch()

  //...
}

function stateChangedAutoFetch(){
  if (state.autoFetch.on){
    autoFetchingText.style.cssText = 'display: inline-block;'
    autoFetchIntervalInput.style.cssText = 'display: inline-block;'
  } else {
    autoFetchingText.style.cssText = 'display: none;'
    autoFetchIntervalInput.style.cssText = 'display: none;'
  }
  const newFreq = parseInt(autoFetchIntervalInput.value)
  state.autoFetch.freq = newFreq
  autoFetchingText.innerHTML = `Auto fetching (${newFreq/1000}s)`
}

function run() {
  // Append the body to the actual body
  document.body.innerHTML = body
  // Elements
  dogButton = window.document.getElementById('button-new-dog')
  dogButton2 = window.document.getElementById('button-new-dog-2')
  autoFetchButton = window.document.getElementById('button-auto-fetch')
  autoFetchIntervalInput = window.document.getElementById('range-auto-fetch-interval')
  autoFetchingText = window.document.getElementById('text-auto-fetching')
  divDogs = window.document.getElementById('dogs')
  // ----

  // Fetch the dog data
  const fetchDogImage = (breed = 'random') => fetch(API_URL + breed)

  // xfs
  const imgHtml = url => "<img width='350' src='" + url + "' />"
  const prependDog = (el, url) => el.innerHTML = `<div>${imgHtml(url) + el.innerHTML}</div>`
  const appendDog = (el, url) => el.innerHTML = `<div>${el.innerHTML + imgHtml(url)}</div>`

  // compose
  const addDogImg = (el, addXf) => url => addXf(el, url)

  // partial functions
  const prependAddDog = addDogImg(divDogs, prependDog)
  const appendAddDog = addDogImg(divDogs, appendDog)

  // do fetch
  const fetchAndSetDog = (/* default to prepend */addXf = prependDog) =>
    fetchDogImage()
      .then(response => response.json())
      .then(dog => dog.message)
      .then(addXf)

  // event listeners
  dogButton.onclick = fetchAndSetDog.bind(null, prependAddDog)
  dogButton2.onclick = fetchAndSetDog.bind(null, appendAddDog)
  autoFetchButton.onclick = () => {
    if (state.autoFetch.on) {
      state.autoFetch.stop()
    } else {
      state.autoFetch.start(fetchAndSetDog.bind(null, prependAddDog))
    }
  }
  autoFetchIntervalInput.onchange = stateChanged
  fetchAndSetDog(prependAddDog)
}

window.onload = run


/***/ })
/******/ ]);