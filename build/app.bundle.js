/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(1);
	// game of life functions
	function generateSlots(rows, cols) {
	    var container = document.createElement('div');
	    container.classList.add('container');
	    var r;
	    var c;
	    var row;
	    var col;
	    var slotNumber = 0;
	    for (r = 0; r < rows; r++) {
	        row = document.createElement('div');
	        row.classList.add('row');
	        for (c = 0; c < cols; c++) {
	            col = document.createElement('span');
	            col.dataset.slotNumber = slotNumber;
	            col.classList.add('col');
	            row.appendChild(col);
	            slotNumber++;
	        }
	        container.appendChild(row);
	    }
	    return container;
	}
	function getNeighborPositions(slotNumber, rows, cols) {
	    var count = rows * cols;
	    return [
	        slotNumber - (cols + 1),
	        slotNumber - cols,
	        slotNumber - (cols - 1),
	        slotNumber - 1,
	        slotNumber + 1,
	        slotNumber + (cols - 1),
	        slotNumber + cols,
	        slotNumber + (cols + 1) // bottom right
	    ].filter(function (neighbor, index) {
	        // not positive if this logic is flawless, but it seems to work so far
	        if (neighbor > 0 && neighbor < count && !(([0, 3, 5].indexOf(index) >= 0 && (neighbor + 1) % cols === 0) || ([2, 4, 7].indexOf(index) >= 0 && neighbor % cols === 0))) {
	            return true;
	        }
	    });
	}
	function getNeighbors(slotNumber, populatedNeighbors, rows, cols, populated) {
	    if (populated === void 0) { populated = true; }
	    var neighbors = getNeighborPositions(slotNumber, rows, cols);
	    return neighbors.reduce(function (arr, neighbor) {
	        var index = populatedSlots.indexOf(neighbor);
	        if (populated && index >= 0 || !populated && index === -1) {
	            arr.push(neighbor);
	        }
	        return arr;
	    }, []);
	}
	function tick(populatedSlots, rows, cols) {
	    var checked = [];
	    var newSlots = populatedSlots.reduce(function (slots, slot, index, arr) {
	        var populatedNeighbors = getNeighbors(slot, populatedSlots, rows, cols);
	        var unpopulatedNeighbors = getNeighbors(slot, populatedSlots, rows, cols, false);
	        var neighborCount = populatedNeighbors.length;
	        // if this slot has 2-3 neighbors, it lives!
	        if (neighborCount === 2 || neighborCount === 3) {
	            slots.push(slot);
	        }
	        unpopulatedNeighbors.forEach(function (slot) {
	            // if we already checked this unpopulated slot, don't check again
	            if (checked.indexOf(slot) === -1) {
	                var populatedNeighbors_1 = getNeighbors(slot, populatedSlots, rows, cols, true);
	                var neighborCount_1 = populatedNeighbors_1.length;
	                if (neighborCount_1 === 3) {
	                    slots.push(slot);
	                }
	                checked.push(slot);
	            }
	        });
	        return slots;
	    }, []);
	    return newSlots;
	}
	function render(container, oldPopulatedSlots, populatedSlots, removeClasses, addClasses) {
	    if (removeClasses === void 0) { removeClasses = []; }
	    if (addClasses === void 0) { addClasses = []; }
	    var slots = container.getElementsByClassName('col');
	    // do a diff so we only update necessary nodes
	    // a cool side effect of this is if you change
	    // the color while it's running, only updated
	    // nodes will change color
	    oldPopulatedSlots.forEach(function (s) {
	        if (!(populatedSlots.indexOf(s) >= 0)) {
	            var slot = slots[s];
	            (_a = slot.classList).remove.apply(_a, removeClasses);
	        }
	        var _a;
	    });
	    populatedSlots.forEach(function (s) {
	        if (!(oldPopulatedSlots.indexOf(s) >= 0)) {
	            var slot = slots[s];
	            (_a = slot.classList).add.apply(_a, addClasses);
	        }
	        var _a;
	    });
	    return container;
	}
	// application code
	var rows = 21;
	var cols = 21;
	var container = generateSlots(rows, cols);
	var oldPopulatedSlots = [];
	var populatedSlots = [];
	function callTick() {
	    oldPopulatedSlots = populatedSlots.slice();
	    populatedSlots = tick(populatedSlots, rows, cols);
	    var selectedColor = colors[colorPicker.selectedIndex];
	    render(container, oldPopulatedSlots, populatedSlots, ['active'].concat(colors), ['active', selectedColor]);
	}
	var colors = ['red', 'blue', 'green', 'yellow', 'purple'];
	var colorPicker = document.createElement('select');
	colors.forEach(function (color) {
	    var option = document.createElement('option');
	    option.value = color;
	    option.text = color;
	    colorPicker.appendChild(option);
	});
	var tickButton = document.createElement('button');
	tickButton.innerText = 'Next';
	tickButton.addEventListener('click', callTick);
	var timer;
	var startButton = document.createElement('button');
	startButton.innerText = 'Start';
	startButton.addEventListener('click', function () {
	    if (timer) {
	        timer = clearInterval(timer);
	        startButton.innerText = 'Start';
	    }
	    else {
	        timer = setInterval(callTick, 1000);
	        startButton.innerText = 'Stop';
	    }
	});
	container.addEventListener('click', function (event) {
	    if (!event.target.classList.contains('col')) {
	        return false;
	    }
	    var slotNumber = event.target.dataset.slotNumber;
	    var index = populatedSlots.indexOf(parseInt(slotNumber));
	    oldPopulatedSlots = populatedSlots.slice();
	    if (index >= 0) {
	        populatedSlots.splice(index, 1);
	    }
	    else {
	        populatedSlots.push(parseInt(slotNumber));
	    }
	    var selectedColor = colors[colorPicker.selectedIndex];
	    render(container, oldPopulatedSlots, populatedSlots, ['active'].concat(colors), ['active', selectedColor]);
	});
	document.body.appendChild(container);
	document.body.appendChild(colorPicker);
	document.body.appendChild(tickButton);
	document.body.appendChild(startButton);
	// kick it off, boss!
	render(container, oldPopulatedSlots, populatedSlots, [], []);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./app.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./app.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, "body {\n  background-color: #222; }\n\n.container .row {\n  display: block;\n  height: 36px; }\n  .container .row .col {\n    display: table-cell;\n    background-color: #555;\n    border: 2px solid #333;\n    width: 32px;\n    height: 32px; }\n    .container .row .col.active.red {\n      background-color: #cc370e !important; }\n    .container .row .col.active.blue {\n      background-color: #5f9ea0 !important; }\n    .container .row .col.active.green {\n      background-color: #56c95c !important; }\n    .container .row .col.active.yellow {\n      background-color: #efef17 !important; }\n    .container .row .col.active.purple {\n      background-color: #841adb !important; }\n", ""]);
	
	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);
//# sourceMappingURL=app.bundle.js.map