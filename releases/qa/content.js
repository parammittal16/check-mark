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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ({

/***/ 15:
/***/ (function(module, exports) {

chrome.runtime.onMessage.addListener(function(msg, sender) {
  var data = JSON.parse(msg);
  if (data.message === 'toggle') {
    toggle(data.url, data.text);
  }
});

var paddingRight = 0;
var body = null;
var checkMarkSidebarActive = false;
var checkMarkSidebarTask = null;
var checkMarkSidebarIframe = null;

function toggle(url, text) {
  checkMarkSidebarActive = !checkMarkSidebarActive;
  if (checkMarkSidebarActive) {
    window.addEventListener('message', receiveMessage, false);
    window.addEventListener('mouseup', textSelectedWithMouse, false);
    window.addEventListener('keyup', textSelectedWithKeyboard, false);
  }
  else {
    window.removeEventListener('message', receiveMessage, false);
    window.removeEventListener('mouseup', textSelectedWithMouse, false);
    window.removeEventListener('keyup', textSelectedWithKeyboard, false);
  }
  
  var id = 'check-mark-sidebar-978976543245342';
  var iframe = document.getElementById(id);
  var width = 500;

  if (!body) {
    body = document.getElementsByTagName('BODY')[0];
    paddingRight = parseInt(window.getComputedStyle(body, null).getPropertyValue('padding-right').replace('px', ''), 10);
  }

  if (iframe) {
    iframe.parentNode.removeChild(iframe);
    body.style.paddingRight = paddingRight + 'px';
    checkMarkSidebarIframe = null;
  }

  else {
    var params = '';
    if (text) {
      params = '?text=' + text;
    }
    else if (url) {
      params = '?url=' + url;
    }
    iframe = document.createElement('iframe'); 
    iframe.style.borderLeft = '1px solid #cbcbcb';
    iframe.style.background = '#fff';
    iframe.style.height = '100%';
    iframe.style.width = width + 'px';
    iframe.style.position = 'fixed';
    iframe.style.top = '0px';
    iframe.style.bottom = '0px';
    iframe.style.right = '0px';
    iframe.style.overflowY = 'auto';
    iframe.style.overflowX = 'none';
    iframe.style.zIndex = '9000000000000000000';
    iframe.style.boxShadow = '0 15px 15px #333';
    iframe.style.display = 'block';
    iframe.frameBorder = 'none';
    iframe.id = id;
    iframe.src = chrome.extension.getURL('popup.html') + params;
    document.body.appendChild(iframe);
    body.style.paddingRight = paddingRight + width + 'px';
    checkMarkSidebarIframe = iframe;
  }
}
   
function receiveMessage(event) {
  var task = null;
  try {
    task = JSON.parse(event.data).task;
  } catch (e) {
    // Ignore
  }
  if (task !== null) {
    checkMarkSidebarTask = task;
    var selectedText = window.getSelection().toString();
    if (selectedText !== '' && task) {
      var response = JSON.stringify({ selectedText, task });
      event.source.postMessage(response, event.origin);
    }
  }
}

function textSelected(event) {
  var selectedText = window.getSelection().toString();
  if (selectedText !== '' && checkMarkSidebarTask && checkMarkSidebarIframe) {
    var response = JSON.stringify({ selectedText, task: checkMarkSidebarTask });
    checkMarkSidebarIframe.contentWindow.postMessage(response, '*');
  }
}

function textSelectedWithMouse(event) {
  textSelected(event);
}

function textSelectedWithKeyboard(event) {
  var key = event.keyCode || event.which;
  if (key === 16) { // "shift" key
    textSelected(event);
  }
}


/***/ })

/******/ });