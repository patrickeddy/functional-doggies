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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//////////////////////////////////////////////
// State
// - State object used for getting/setting state props
// - stateBroadcaster used for handling state changes
//////////////////////////////////////////////

var _state = {
  stateChanged: function stateChanged() {}
};
var stateValidator = {
  set: function set(obj, prop, value) {
    obj[prop] = value;
    state.stateChanged(obj, prop, value);
    return true;
  }
};
var proxize = function proxize(stateObj) {
  var s = Object.assign({}, stateObj);
  Object.keys(s).map(function (key) {
    return s[key] = new Proxy(s[key], stateValidator);
  });
  return s;
};

///////////////////////
//     Exports
///////////////////////

// Main state object
// - every subkey (i.e. 'autoFetch') has primitive values
// - each subkey turns into a Proxy that intercepts changes and updates the state
var state = proxize(_state);
// Configure initial state
// - allows you to set initial props for the state
// `configureIntialState({
//      dogs: [],
//      dagPaws: 4,
//      nonDescriminatoryDawPaws: (dog) => dog.paws
//  })`
var configureInitialState = function configureInitialState(newState) {
  return exports.state = state = Object.assign(state, proxize(newState));
};

// State broadcaster
// - calls every StateChangeHandler when state props are updated
// - compose: `makeStateBroadcaster(SCHOne, SCHTwo, SCHThree, ...)`
// - SCHs: `(obj, prop, value) => { ...do stuff on state changed... }`
var makeStateBroadcaster = function makeStateBroadcaster() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  state.stateChanged = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return fns.map(function (fn) {
      return fn.apply(undefined, args);
    });
  }; // set the callback to be all of the functions given
};

// Exports
exports.configureInitialState = configureInitialState;
exports.state = state;
exports.makeStateBroadcaster = makeStateBroadcaster;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
////////////////
// Utils
////////////////
var el = function el(id) {
  return window.document.getElementById(id);
};

// Generic compose function (Who needs lodash, am I right?)
var compose = function compose() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return fns.reduceRight(function (g, f) {
    return function () {
      return f(g.apply(undefined, arguments));
    };
  });
};

var trace = function trace(message) {
  return function (f) {
    console.log(message, f);
    return f;
  };
};

exports.el = el;
exports.compose = compose;
exports.trace = trace;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utils = __webpack_require__(1);

var _dog = __webpack_require__(3);

var _autofetch = __webpack_require__(4);

var _state = __webpack_require__(0);

// Elements
var breedInput = void 0,
    dogButton = void 0,
    dogButton2 = void 0,
    autoFetchButton = void 0,
    autoFetchTools = void 0,
    autoFetchText = void 0,
    autoFetchIntervalInput = void 0,
    clearButton = void 0,
    dogsDiv = null;

// Setup the intial state
(0, _state.configureInitialState)({
  autoFetch: {
    on: false,
    freq: 1000
  },
  dogs: {
    oldSize: 0,
    size: 0,
    all: []
  }
});

// Configure a State Broadcaster that will execute State Change Handlers (SCH)
(0, _state.makeStateBroadcaster)((0, _utils.trace)('! State Changed'), SCHDogs, SCHAutoFetch);
// StateChangeHandler - Dogs
function SCHDogs(obj, props, value) {
  if (_state.state.dogs.oldSize < _state.state.dogs.size) {
    var dogDif = _state.state.dogs.all.slice(_state.state.dogs.oldSize); // get the missing dogs
    dogDif.map(function (d) {
      return d.render(dogsDiv);
    }); // render dogs into `dogsDiv`
    _state.state.dogs.oldSize = _state.state.dogs.size;
    // ^ necessary because only the keys for the state object are checked for updates
    //   (state.dogs.all is an array under the subobject `state.dogs`)
  }
}
// StateChangeHandler - AutoFetch
function SCHAutoFetch(obj, props, value) {
  if (_state.state.autoFetch.on) {
    autoFetchTools.classList.add("on");
    autoFetchButton.innerHTML = 'Auto fetch = on';
  } else {
    autoFetchTools.classList.remove("on");
    autoFetchButton.innerHTML = 'Auto fetch = off';
  }
  autoFetchText.innerHTML = '<h2>Every ' + Math.floor(_state.state.autoFetch.freq / 1000 * 100) / 100 + ' seconds!</h2>';
}

// Run app
function run() {
  var body = '\n  <div>\n    <div class="buttons">\n      <a href="https://dog.ceo/dog-api/#breeds-list">(breed list)</a>\n      <input id="input-breed" type="text" placeholder="Enter breed here" value="random" />\n      <button id="button-new-dog">Get new dog</button>\n      <button id="button-new-dog-2">Spin new dog</button>\n      <button id="button-auto-fetch"></button>\n      <button id="button-clear">Clear</button>\n      <div id="auto-fetch-tools">\n        <p id="text-auto-fetch"></p>\n        <p><input id="range-auto-fetch-interval" type="range" min="500" max="3000"/></p>\n      </div>\n    </div>\n    <div id="dogs" style="text-align:center"></div>\n  </div>\n  ';
  // Append the body to the actual body
  document.body.innerHTML = body;

  // Elements from body
  breedInput = (0, _utils.el)('input-breed');
  dogButton = (0, _utils.el)('button-new-dog');
  dogButton2 = (0, _utils.el)('button-new-dog-2');
  autoFetchButton = (0, _utils.el)('button-auto-fetch');
  autoFetchTools = (0, _utils.el)('auto-fetch-tools');
  autoFetchText = (0, _utils.el)('text-auto-fetch');
  autoFetchIntervalInput = (0, _utils.el)('range-auto-fetch-interval');
  clearButton = (0, _utils.el)('button-clear');
  dogsDiv = (0, _utils.el)('dogs');

  // event listeners
  var prependHandler = (0, _dog.fetchDog)(_dog.prependDog);
  var spinHandler = (0, _dog.fetchDog)(_dog.spinDog);
  var toggleHandler = (0, _dog.fetchDog)(_dog.prependDog);
  var clearHandler = _dog.clearDogs.bind(null, dogsDiv);
  var intervalHandler = function intervalHandler() {
    var newFreq = parseInt(autoFetchIntervalInput.value);
    if (_state.state.autoFetch.freq !== newFreq) {
      _state.state.autoFetch.freq = newFreq;
    }
  };
  breedInput.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) prependHandler(breedInput.value);
  });
  dogButton.onclick = function () {
    return prependHandler(breedInput.value);
  };
  dogButton2.onclick = function () {
    return spinHandler(breedInput.value);
  };
  autoFetchButton.onclick = function () {
    return _autofetch.AutoFetch.toggle(function () {
      return toggleHandler(breedInput.value);
    });
  };
  autoFetchIntervalInput.onchange = intervalHandler;
  clearButton.onclick = clearHandler;
  dogsDiv.onclick = _dog.dogClickHandler;

  // default call
  (0, _dog.fetchDog)(_dog.prependDog)(breedInput.value);
}

window.onload = run;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dogClickHandler = exports.clearDogs = exports.spinDog = exports.appendDog = exports.prependDog = exports.fetchDog = undefined;

var _utils = __webpack_require__(1);

var _state = __webpack_require__(0);

///////////////////////
// Dog management
// - Fetching dog image urls from API
// - Adding dog with given HTMLXf to state.dogs
// Use partial methods at the bottom of the file.
///////////////////////

// Dog layout
var d = function d(dog) {
  return '\n  <div class="dog" id="dog-' + dog.id + '">\n      <h1>Doggie #' + dog.id + '</h1>\n      <img src="' + dog.url + '" title="Doggie #' + dog.id + '. So cute." />\n  </div>\n';
};
// dog html xfs
var prependDogHtmlXf = function prependDogHtmlXf(id) {
  return function (el) {
    return el.innerHTML = '' + (d(_state.state.dogs.all[id]) + el.innerHTML);
  };
};
var appendDogHtmlXf = function appendDogHtmlXf(id) {
  return function (el) {
    return el.innerHTML = '' + (el.innerHTML + d(_state.state.dogs.all[id]));
  };
};
var spinDogHtmlXf = function spinDogHtmlXf(id) {
  return function (el) {
    var spinClass = '' + d(_state.state.dogs.all[id]).replace('<img', '<img class="spin"');
    return el.innerHTML = '' + (spinClass + el.innerHTML);
  };
};

// add the dog to state
var makeAddDog = function makeAddDog(addXf) {
  return function (dogUrl) {
    if (dogUrl !== 'Breed not found') {
      var newId = _state.state.dogs.all.length;
      var newDog = { id: newId, url: dogUrl, clickHandler: dogClickHandler, render: addXf(newId) };
      _state.state.dogs.all.push(newDog);
      _state.state.dogs.size += 1;
    }
  };
};

// Fetch dog
var fetchDogAPIUrl = function fetchDogAPIUrl(breed) {
  if (breed === null || breed === 'random') return fetch('https://dog.ceo/api/breeds/image/random');else {
    var formatted = breed.split(' ').reverse().join().replace(',', '/');
    return fetch('https://dog.ceo/api/breed/' + formatted + '/images/random');
  }
};
var fetchDogForUrl = function fetchDogForUrl(xfCallback, breed) {
  fetchDogAPIUrl(breed).then(function (response) {
    return response.json();
  }).then(function (dog) {
    return dog.message;
  }).then(xfCallback);
};

///////////////////////
//     Exports
///////////////////////

// fetchDog(p: addXfPartial)(breed: string)
var fetchDog = function fetchDog(addXfPartial) {
  return function (breed) {
    return fetchDogForUrl(addXfPartial, breed);
  };
};
// AddXfPartials
// - These functions are set to the `render` property on the dog object in state.dogs
// - Use `makeStateBroadcaster` to check for updates
//     and then render the dogs into an Element using their `render` property function:
//     => state.dogs.map( dog => dog.render(el: Element object) )
var prependDog = makeAddDog(prependDogHtmlXf); // Prepends the dog normally to the el
var appendDog = makeAddDog(appendDogHtmlXf); // Appends the dog normally to the el
var spinDog = makeAddDog(spinDogHtmlXf); // Prepends the dog spinning to the el


// clearDogs(el: Element object)
var clearDogs = function clearDogs(el) {
  el.innerHTML = "";
  _state.state.dogs.all.length = 0;
  _state.state.dogs.size = 0;
  _state.state.dogs.oldSize = 0;
};

// dogClickHandler(e: Event object)
var dogClickHandler = function dogClickHandler(e) {
  if (e.target.classList.contains('spin')) {
    e.target.classList.remove('spin'); // remove spin if clicked
  }
};

exports.fetchDog = fetchDog;
exports.prependDog = prependDog;
exports.appendDog = appendDog;
exports.spinDog = spinDog;
exports.clearDogs = clearDogs;
exports.dogClickHandler = dogClickHandler;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoFetch = undefined;

var _state = __webpack_require__(0);

//////////////////////////////////////////////
// AutoFetch
// - Handles autofetching toggling, looping function calls,
//   and other autofetch related shenanigans.
//////////////////////////////////////////////

var AutoFetch = Object.freeze({
  start: function start( /* fetch function */f) {
    _state.state.autoFetch.on = true;
    this._loop(f);
  },
  stop: function stop() {
    _state.state.autoFetch.on = false;
  },
  toggle: function toggle(f) {
    _state.state.autoFetch.on ? AutoFetch.stop() : AutoFetch.start(f);
  },
  _loop: function _loop(f) {
    f();
    if (_state.state.autoFetch.on) {
      setTimeout(this._loop.bind(this, f), _state.state.autoFetch.freq);
    }
  }
});

exports.AutoFetch = AutoFetch;

/***/ })
/******/ ]);