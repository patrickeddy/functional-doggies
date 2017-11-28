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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utils = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"utils\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _fetch_dog = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fetch_dog\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

// Elements
var breedInput = void 0,
    dogButton = void 0,
    dogButton2 = void 0,
    autoFetchButton = void 0,
    autoFetchTools = void 0,
    autoFetchText = void 0,
    autoFetchIntervalInput = void 0,
    divDogs = null;

// Run app
function run() {
  var body = '\n  <div>\n    <div class="buttons">\n      <a href="https://dog.ceo/dog-api/#breeds-list">(breed list)</a>\n      <input id="input-breed" type="text" placeholder="Enter breed here" value="random" />\n      <button id="button-new-dog">Get new dog</button>\n      <button id="button-new-dog-2">Append new dog</button>\n      <button id="button-auto-fetch"></button>\n      <button id="button-clear">Clear</button>\n      <div id="auto-fetch-tools">\n        <p id="text-auto-fetch"></p>\n        <p><input id="range-auto-fetch-interval" type="range" min="500" max="3000" /></p>\n      </div>\n    </div>\n    <div id="dogs" style="text-align:center"></div>\n  </div>\n  ';
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
  var prependHandler = composeFetch(_fetch_dog.prependDog, breedInput.value);
  var appendHandler = composeFetch(_fetch_dog.appendDog, breedInput.value);
  var toggleHandler = composeFetch(_fetch_dog.prependDog, breedInput.value);
  var clearHandler = Dogs.clear;

  dogButton.onclick = prependHandler;
  dogButton2.onclick = appendHandler;
  autoFetchButton.onclick = function () {
    return AutoFetch.toggle(toggleHandler);
  };
  autoFetchIntervalInput.onchange = stateChanged;
  clearButton.onclick = clearHandler;

  // default call
  fetchDogUrl(_fetch_dog.prependDog, 'random');
}

window.onload = run;

/***/ })
/******/ ]);