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
/******/ 	return __webpack_require__(__webpack_require__.s = 100);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate, global) {;(function() {
"use strict"
function Vnode(tag, key, attrs0, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
	return node
}
Vnode.normalizeChildren = function normalizeChildren(children) {
	for (var i = 0; i < children.length; i++) {
		children[i] = Vnode.normalize(children[i])
	}
	return children
}
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty
function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}
function execSelector(state, attrs, children) {
	var hasAttrs = false, childList, text
	var className = attrs.className || attrs.class
	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key)) {
			attrs[key] = state.attrs[key]
		}
	}
	if (className !== undefined) {
		if (attrs.class !== undefined) {
			attrs.class = undefined
			attrs.className = className
		}
		if (state.attrs.className != null) {
			attrs.className = state.attrs.className + " " + className
		}
	}
	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			hasAttrs = true
			break
		}
	}
	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		text = children[0].children
	} else {
		childList = children
	}
	return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
}
function hyperscript(selector) {
	// Because sloppy mode sucks
	var attrs = arguments[1], start = 2, children
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}
	if (typeof selector === "string") {
		var cached = selectorCache[selector] || compileSelector(selector)
	}
	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = 1
	}
	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}
	var normalized = Vnode.normalizeChildren(children)
	if (typeof selector === "string") {
		return execSelector(cached, attrs, normalized)
	} else {
		return Vnode(selector, attrs.key, attrs, normalized)
	}
}
hyperscript.trust = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}
hyperscript.fragment = function(attrs1, children) {
	return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
}
var m = hyperscript
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")
	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}
	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}
if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill
	var PromisePolyfill = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill
	var PromisePolyfill = global.Promise
} else {
}
var buildQueryString = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""
	var args = []
	for (var key0 in object) {
		destructure(key0, object[key0])
	}
	return args.join("&")
	function destructure(key0, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}
var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i")
var _8 = function($window, Promise) {
	var callbackCount = 0
	var oncompletion
	function setCompletionCallback(callback) {oncompletion = callback}
	function finalizer() {
		var count = 0
		function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion()}
		return function finalize(promise0) {
			var then0 = promise0.then
			promise0.then = function() {
				count++
				var next = then0.apply(promise0, arguments)
				next.then(complete, function(e) {
					complete()
					if (count === 0) throw e
				})
				return finalize(next)
			}
			return promise0
		}
	}
	function normalize(args, extra) {
		if (typeof args === "string") {
			var url = args
			args = extra || {}
			if (args.url == null) args.url = url
		}
		return args
	}
	function request(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			if (args.method == null) args.method = "GET"
			args.method = args.method.toUpperCase()
			var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true)
			if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify
			if (typeof args.deserialize !== "function") args.deserialize = deserialize
			if (typeof args.extract !== "function") args.extract = extract
			args.url = interpolate(args.url, args.data)
			if (useBody) args.data = args.serialize(args.data)
			else args.url = assemble(args.url, args.data)
			var xhr = new $window.XMLHttpRequest(),
				aborted = false,
				_abort = xhr.abort
			xhr.abort = function abort() {
				aborted = true
				_abort.call(xhr)
			}
			xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
			if (args.serialize === JSON.stringify && useBody) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (args.deserialize === deserialize) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
				xhr.setRequestHeader(key, args.headers[key])
			}
			if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr
			xhr.onreadystatechange = function() {
				// Don't throw errors on xhr.abort().
				if(aborted) return
				if (xhr.readyState === 4) {
					try {
						var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args))
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
							resolve(cast(args.type, response))
						}
						else {
							var error = new Error(xhr.responseText)
							for (var key in response) error[key] = response[key]
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}
			if (useBody && (args.data != null)) xhr.send(args.data)
			else xhr.send()
		})
		return args.background === true ? promise0 : finalize(promise0)
	}
	function jsonp(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				script.parentNode.removeChild(script)
				resolve(cast(args.type, data))
				delete $window[callbackName]
			}
			script.onerror = function() {
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
				delete $window[callbackName]
			}
			if (args.data == null) args.data = {}
			args.url = interpolate(args.url, args.data)
			args.data[args.callbackKey || "callback"] = callbackName
			script.src = assemble(args.url, args.data)
			$window.document.documentElement.appendChild(script)
		})
		return args.background === true? promise0 : finalize(promise0)
	}
	function interpolate(url, data) {
		if (data == null) return url
		var tokens = url.match(/:[^\/]+/gi) || []
		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i].slice(1)
			if (data[key] != null) {
				url = url.replace(tokens[i], data[key])
			}
		}
		return url
	}
	function assemble(url, data) {
		var querystring = buildQueryString(data)
		if (querystring !== "") {
			var prefix = url.indexOf("?") < 0 ? "?" : "&"
			url += prefix + querystring
		}
		return url
	}
	function deserialize(data) {
		try {return data !== "" ? JSON.parse(data) : null}
		catch (e) {throw new Error(data)}
	}
	function extract(xhr) {return xhr.responseText}
	function cast(type0, data) {
		if (typeof type0 === "function") {
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					data[i] = new type0(data[i])
				}
			}
			else return new type0(data)
		}
		return data
	}
	return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
}
var requestService = _8(window, PromisePolyfill)
var coreRenderer = function($window) {
	var $doc = $window.document
	var $emptyFragment = $doc.createDocumentFragment()
	var onevent
	function setEventCallback(callback) {return onevent = callback}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": return createText(parent, vnode, nextSibling)
				case "<": return createHTML(parent, vnode, nextSibling)
				case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
				default: return createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else return createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
		return vnode.dom
	}
	function createHTML(parent, vnode, nextSibling) {
		var match1 = vnode.children.match(/^\s*?<(\w+)/im) || []
		var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div"
		var temp = $doc.createElement(parent1)
		temp.innerHTML = vnode.children
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		switch (vnode.tag) {
			case "svg": ns = "http://www.w3.org/2000/svg"; break
			case "math": ns = "http://www.w3.org/1998/Math/MathML"; break
		}
		var attrs2 = vnode.attrs
		var is = attrs2 && attrs2.is
		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element
		if (attrs2 != null) {
			setAttrs(vnode, attrs2, ns)
		}
		insertNode(parent, element, nextSibling)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				setLateAttrs(vnode)
			}
		}
		return element
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		vnode._state = vnode.state
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		initLifecycle(vnode._state, vnode, hooks)
		vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			var element = createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
			insertNode(parent, element, nextSibling)
			return element
		}
		else {
			vnode.domSize = 0
			return $emptyFragment
		}
	}
	//update
	function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, undefined)
		else if (vnodes == null) removeNodes(old, 0, old.length, vnodes)
		else {
			if (old.length === vnodes.length) {
				var isUnkeyed = false
				for (var i = 0; i < vnodes.length; i++) {
					if (vnodes[i] != null && old[i] != null) {
						isUnkeyed = vnodes[i].key == null && old[i].key == null
						break
					}
				}
				if (isUnkeyed) {
					for (var i = 0; i < old.length; i++) {
						if (old[i] === vnodes[i]) continue
						else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling))
						else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes)
						else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns)
					}
					return
				}
			}
			recycling = recycling || isRecyclable(old, vnodes)
			if (recycling) {
				var pool = old.pool
				old = old.concat(old.pool)
			}
			var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldStart], v = vnodes[start]
				if (o === v && !recycling) oldStart++, start++
				else if (o == null) oldStart++
				else if (v == null) start++
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling)
					oldStart++, start++
					updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
				}
				else {
					var o = old[oldEnd]
					if (o === v && !recycling) oldEnd--, start++
					else if (o == null) oldEnd--
					else if (v == null) start++
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
						if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling))
						oldEnd--, start++
					}
					else break
				}
			}
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldEnd], v = vnodes[end]
				if (o === v && !recycling) oldEnd--, end--
				else if (o == null) oldEnd--
				else if (v == null) end--
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
					updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
					if (o.dom != null) nextSibling = o.dom
					oldEnd--, end--
				}
				else {
					if (!map) map = getKeyMap(old, oldEnd)
					if (v != null) {
						var oldIndex = map[v.key]
						if (oldIndex != null) {
							var movable = old[oldIndex]
							var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling)
							updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns)
							insertNode(parent, toFragment(movable), nextSibling)
							old[oldIndex].skip = true
							if (movable.dom != null) nextSibling = movable.dom
						}
						else {
							var dom = createNode(parent, v, hooks, undefined, nextSibling)
							nextSibling = dom
						}
					}
					end--
				}
				if (end < start) break
			}
			createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
			removeNodes(old, oldStart, oldEnd + 1, vnodes)
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode._state = old._state
			vnode.events = old.events
			if (!recycling && shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					if (recycling) {
						vnode.state = {}
						initLifecycle(vnode.attrs, vnode, hooks)
					}
					else updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, nextSibling); break
					case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, recycling, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns)
		}
		else {
			removeNode(old, null)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, nextSibling) {
		if (old.children !== vnode.children) {
			toFragment(old)
			createHTML(parent, vnode, nextSibling)
		}
		else vnode.dom = old.dom, vnode.domSize = old.domSize
	}
	function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, recycling, hooks, ns) {
		var element = vnode.dom = old.dom
		switch (vnode.tag) {
			case "svg": ns = "http://www.w3.org/2000/svg"; break
			case "math": ns = "http://www.w3.org/1998/Math/MathML"; break
		}
		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle0 multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else if (old.text != null && vnode.text != null && vnode.text !== "") {
			if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
		}
		else {
			if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
			if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns)
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		if (recycling) {
			initComponent(vnode, hooks)
		} else {
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
			if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
			updateLifecycle(vnode._state, vnode, hooks)
		}
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(old.instance, null)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function isRecyclable(old, vnodes) {
		if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
			var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0
			var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0
			var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0
			if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
				return true
			}
		}
		return false
	}
	function getKeyMap(vnodes, end) {
		var map = {}, i = 0
		for (var i = 0; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				var key2 = vnode.key
				if (key2 != null) map[key2] = i
			}
		}
		return map
	}
	function toFragment(vnode) {
		var count0 = vnode.domSize
		if (count0 != null || vnode.dom == null) {
			var fragment = $doc.createDocumentFragment()
			if (count0 > 0) {
				var dom = vnode.dom
				while (--count0) fragment.appendChild(dom.nextSibling)
				fragment.insertBefore(dom, fragment.firstChild)
			}
			return fragment
		}
		else return vnode.dom
	}
	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}
	function insertNode(parent, dom, nextSibling) {
		if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}
	function setContentEditable(vnode) {
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
	}
	//remove
	function removeNodes(vnodes, start, end, context) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				if (vnode.skip) vnode.skip = false
				else removeNode(vnode, context)
			}
		}
	}
	function removeNode(vnode, context) {
		var expected = 1, called = 0
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
			var result = vnode._state.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		continuation()
		function continuation() {
			if (++called === expected) {
				onremove(vnode)
				if (vnode.dom) {
					var count0 = vnode.domSize || 1
					if (count0 > 1) {
						var dom = vnode.dom
						while (--count0) {
							removeNodeFromDOM(dom.nextSibling)
						}
					}
					removeNodeFromDOM(vnode.dom)
					if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
						if (!context.pool) context.pool = [vnode]
						else context.pool.push(vnode)
					}
				}
			}
		}
	}
	function removeNodeFromDOM(node) {
		var parent = node.parentNode
		if (parent != null) parent.removeChild(node)
	}
	function onremove(vnode) {
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode)
		if (vnode.instance != null) onremove(vnode.instance)
		else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}
	//attrs2
	function setAttrs(vnode, attrs2, ns) {
		for (var key2 in attrs2) {
			setAttr(vnode, key2, null, attrs2[key2], ns)
		}
	}
	function setAttr(vnode, key2, old, value, ns) {
		var element = vnode.dom
		if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
		var nsLastIndex = key2.indexOf(":")
		if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
			element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value)
		}
		else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value)
		else if (key2 === "style") updateStyle(element, old, value)
		else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
			//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
			if (vnode.tag === "input" && key2 === "value" && vnode.dom.value == value && vnode.dom === $doc.activeElement) return
			//setting select[value] to same value while having select open blinks select dropdown in Chrome
			if (vnode.tag === "select" && key2 === "value" && vnode.dom.value == value && vnode.dom === $doc.activeElement) return
			//setting option[value] to same value while having select open blinks select dropdown in Chrome
			if (vnode.tag === "option" && key2 === "value" && vnode.dom.value == value) return
			// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
			if (vnode.tag === "input" && key2 === "type") {
				element.setAttribute(key2, value)
				return
			}
			element[key2] = value
		}
		else {
			if (typeof value === "boolean") {
				if (value) element.setAttribute(key2, "")
				else element.removeAttribute(key2)
			}
			else element.setAttribute(key2 === "className" ? "class" : key2, value)
		}
	}
	function setLateAttrs(vnode) {
		var attrs2 = vnode.attrs
		if (vnode.tag === "select" && attrs2 != null) {
			if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined)
			if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined)
		}
	}
	function updateAttrs(vnode, old, attrs2, ns) {
		if (attrs2 != null) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, old && old[key2], attrs2[key2], ns)
			}
		}
		if (old != null) {
			for (var key2 in old) {
				if (attrs2 == null || !(key2 in attrs2)) {
					if (key2 === "className") key2 = "class"
					if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined)
					else if (key2 !== "key") vnode.dom.removeAttribute(key2)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function isAttribute(attr) {
		return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
	}
	function isCustomElement(vnode){
		return vnode.attrs.is || vnode.tag.indexOf("-") > -1
	}
	function hasIntegrationMethods(source) {
		return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
	}
	//style
	function updateStyle(element, old, style) {
		if (old === style) element.style.cssText = "", old = null
		if (style == null) element.style.cssText = ""
		else if (typeof style === "string") element.style.cssText = style
		else {
			if (typeof old === "string") element.style.cssText = ""
			for (var key2 in style) {
				element.style[key2] = style[key2]
			}
			if (old != null && typeof old !== "string") {
				for (var key2 in old) {
					if (!(key2 in style)) element.style[key2] = ""
				}
			}
		}
	}
	//event
	function updateEvent(vnode, key2, value) {
		var element = vnode.dom
		var callback = typeof onevent !== "function" ? value : function(e) {
			var result = value.call(element, e)
			onevent.call(element, e)
			return result
		}
		if (key2 in element) element[key2] = typeof value === "function" ? callback : null
		else {
			var eventName = key2.slice(2)
			if (vnode.events === undefined) vnode.events = {}
			if (vnode.events[key2] === callback) return
			if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false)
			if (typeof value === "function") {
				vnode.events[key2] = callback
				element.addEventListener(eventName, vnode.events[key2], false)
			}
		}
	}
	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode)
		if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		var forceVnodeUpdate, forceComponentUpdate
		if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old)
		if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
			return true
		}
		return false
	}
	function render(dom, vnodes) {
		if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = $doc.activeElement
		// First time0 rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""
		if (!Array.isArray(vnodes)) vnodes = [vnodes]
		updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, undefined)
		dom.vnodes = vnodes
		for (var i = 0; i < hooks.length; i++) hooks[i]()
		if ($doc.activeElement !== active) active.focus()
	}
	return {render: render, setEventCallback: setEventCallback}
}
function throttle(callback) {
	//60fps translates to 16.6ms, round it down since setTimeout requires int
	var time = 16
	var last = 0, pending = null
	var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout
	return function() {
		var now = Date.now()
		if (last === 0 || now - last >= time) {
			last = now
			callback()
		}
		else if (pending === null) {
			pending = timeout(function() {
				pending = null
				callback()
				last = Date.now()
			}, time - (now - last))
		}
	}
}
var _11 = function($window) {
	var renderService = coreRenderer($window)
	renderService.setEventCallback(function(e) {
		if (e.redraw !== false) redraw()
	})
	var callbacks = []
	function subscribe(key1, callback) {
		unsubscribe(key1)
		callbacks.push(key1, throttle(callback))
	}
	function unsubscribe(key1) {
		var index = callbacks.indexOf(key1)
		if (index > -1) callbacks.splice(index, 2)
	}
	function redraw() {
		for (var i = 1; i < callbacks.length; i += 2) {
			callbacks[i]()
		}
	}
	return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
}
var redrawService = _11(window)
requestService.setCompletionCallback(redrawService.redraw)
var _16 = function(redrawService0) {
	return function(root, component) {
		if (component === null) {
			redrawService0.render(root, [])
			redrawService0.unsubscribe(root)
			return
		}
		
		if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
		
		var run0 = function() {
			redrawService0.render(root, Vnode(component))
		}
		redrawService0.subscribe(root, run0)
		redrawService0.redraw()
	}
}
m.mount = _16(redrawService)
var Promise = PromisePolyfill
var parseQueryString = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)
	var entries = string.split("&"), data0 = {}, counters = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key5 = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
		if (value === "true") value = true
		else if (value === "false") value = false
		var levels = key5.split(/\]\[?|\[/)
		var cursor = data0
		if (key5.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			var isValue = j === levels.length - 1
			if (level === "") {
				var key5 = levels.slice(0, j).join()
				if (counters[key5] == null) counters[key5] = 0
				level = counters[key5]++
			}
			if (cursor[level] == null) {
				cursor[level] = isValue ? value : isNumber ? [] : {}
			}
			cursor = cursor[level]
		}
	}
	return data0
}
var coreRouter = function($window) {
	var supportsPushState = typeof $window.history.pushState === "function"
	var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
	function normalize1(fragment0) {
		var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
		if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data
		return data
	}
	var asyncId
	function debounceAsync(callback0) {
		return function() {
			if (asyncId != null) return
			asyncId = callAsync0(function() {
				asyncId = null
				callback0()
			})
		}
	}
	function parsePath(path, queryData, hashData) {
		var queryIndex = path.indexOf("?")
		var hashIndex = path.indexOf("#")
		var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length
		if (queryIndex > -1) {
			var queryEnd = hashIndex > -1 ? hashIndex : path.length
			var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd))
			for (var key4 in queryParams) queryData[key4] = queryParams[key4]
		}
		if (hashIndex > -1) {
			var hashParams = parseQueryString(path.slice(hashIndex + 1))
			for (var key4 in hashParams) hashData[key4] = hashParams[key4]
		}
		return path.slice(0, pathEnd)
	}
	var router = {prefix: "#!"}
	router.getPath = function() {
		var type2 = router.prefix.charAt(0)
		switch (type2) {
			case "#": return normalize1("hash").slice(router.prefix.length)
			case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
			default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
		}
	}
	router.setPath = function(path, data, options) {
		var queryData = {}, hashData = {}
		path = parsePath(path, queryData, hashData)
		if (data != null) {
			for (var key4 in data) queryData[key4] = data[key4]
			path = path.replace(/:([^\/]+)/g, function(match2, token) {
				delete queryData[token]
				return data[token]
			})
		}
		var query = buildQueryString(queryData)
		if (query) path += "?" + query
		var hash = buildQueryString(hashData)
		if (hash) path += "#" + hash
		if (supportsPushState) {
			var state = options ? options.state : null
			var title = options ? options.title : null
			$window.onpopstate()
			if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path)
			else $window.history.pushState(state, title, router.prefix + path)
		}
		else $window.location.href = router.prefix + path
	}
	router.defineRoutes = function(routes, resolve, reject) {
		function resolveRoute() {
			var path = router.getPath()
			var params = {}
			var pathname = parsePath(path, params, params)
			var state = $window.history.state
			if (state != null) {
				for (var k in state) params[k] = state[k]
			}
			for (var route0 in routes) {
				var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")
				if (matcher.test(pathname)) {
					pathname.replace(matcher, function() {
						var keys = route0.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						for (var i = 0; i < keys.length; i++) {
							params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
						}
						resolve(routes[route0], params, path, route0)
					})
					return
				}
			}
			reject(path, params)
		}
		if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute)
		else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute
		resolveRoute()
	}
	return router
}
var _20 = function($window, redrawService0) {
	var routeService = coreRouter($window)
	var identity = function(v) {return v}
	var render1, component, attrs3, currentPath, lastUpdate
	var route = function(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		var run1 = function() {
			if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)))
		}
		var bail = function(path) {
			if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true})
			else throw new Error("Could not resolve default route " + defaultRoute)
		}
		routeService.defineRoutes(routes, function(payload, params, path) {
			var update = lastUpdate = function(routeResolver, comp) {
				if (update !== lastUpdate) return
				component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
				attrs3 = params, currentPath = path, lastUpdate = null
				render1 = (routeResolver.render || identity).bind(routeResolver)
				run1()
			}
			if (payload.view || typeof payload === "function") update({}, payload)
			else {
				if (payload.onmatch) {
					Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
						update(payload, resolved)
					}, bail)
				}
				else update(payload, "div")
			}
		}, bail)
		redrawService0.subscribe(root, run1)
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) options = {replace: true}
		lastUpdate = null
		routeService.setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = function(prefix0) {routeService.prefix = prefix0}
	route.link = function(vnode1) {
		vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href)
		vnode1.dom.onclick = function(e) {
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
			e.preventDefault()
			e.redraw = false
			var href = this.getAttribute("href")
			if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length)
			route.set(href, undefined, undefined)
		}
	}
	route.param = function(key3) {
		if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
		return attrs3
	}
	return route
}
m.route = _20(window, redrawService)
m.withAttr = function(attrName, callback1, context) {
	return function(e) {
		callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
	}
}
var _28 = coreRenderer(window)
m.render = _28.render
m.redraw = redrawService.redraw
m.request = requestService.request
m.jsonp = requestService.jsonp
m.parseQueryString = parseQueryString
m.buildQueryString = buildQueryString
m.version = "1.1.1"
m.vnode = Vnode
if (true) module["exports"] = m
else window.m = m
}());
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(81).setImmediate, __webpack_require__(17)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/6/17.
 */
const feathers = __webpack_require__(55);
const rest = __webpack_require__(48);
const superagent = __webpack_require__(75);
const hooks = __webpack_require__(46);
const auth = __webpack_require__(40);

const feathersClient = feathers();

feathersClient.configure(hooks())
  .configure(rest('http://localhost:3030').superagent(superagent))
  .configure(auth({ storage: localStorage }));


// This will now connect to the http://my-feathers-server.com/messages API
module.exports = feathersClient;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _arguments = __webpack_require__(43);

var _arguments2 = _interopRequireDefault(_arguments);

var _utils = __webpack_require__(11);

var _hooks = __webpack_require__(44);

var _hooks2 = _interopRequireDefault(_hooks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  _: _utils._,
  getArguments: _arguments2.default,
  stripSlashes: _utils.stripSlashes,
  hooks: _hooks2.default,
  matcher: _utils.matcher,
  sorter: _utils.sorter,
  select: _utils.select,
  makeUrl: _utils.makeUrl,
  // lodash functions
  each: _utils.each,
  some: _utils.some,
  every: _utils.every,
  keys: _utils.keys,
  values: _utils.values,
  isMatch: _utils.isMatch,
  isEmpty: _utils.isEmpty,
  isObject: _utils.isObject,
  extend: _utils.extend,
  omit: _utils.omit,
  pick: _utils.pick,
  merge: _utils.merge
};
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qs = __webpack_require__(69);

var _qs2 = _interopRequireDefault(_qs);

var _feathersCommons = __webpack_require__(2);

var _feathersErrors = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function toError(error) {
  throw (0, _feathersErrors.convert)(error);
}

var Base = function () {
  function Base(settings) {
    _classCallCheck(this, Base);

    this.name = (0, _feathersCommons.stripSlashes)(settings.name);
    this.options = settings.options;
    this.connection = settings.connection;
    this.base = settings.base + '/' + this.name;
  }

  _createClass(Base, [{
    key: 'makeUrl',
    value: function makeUrl(params, id) {
      params = params || {};
      var url = this.base;

      if (typeof id !== 'undefined' && id !== null) {
        url += '/' + id;
      }

      if (Object.keys(params).length !== 0) {
        var queryString = _qs2.default.stringify(params);

        url += '?' + queryString;
      }

      return url;
    }
  }, {
    key: 'find',
    value: function find() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return this.request({
        url: this.makeUrl(params.query),
        method: 'GET',
        headers: _extends({}, params.headers)
      }).catch(toError);
    }
  }, {
    key: 'get',
    value: function get(id) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof id === 'undefined') {
        return Promise.reject(new Error('id for \'get\' can not be undefined'));
      }

      return this.request({
        url: this.makeUrl(params.query, id),
        method: 'GET',
        headers: _extends({}, params.headers)
      }).catch(toError);
    }
  }, {
    key: 'create',
    value: function create(body) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.request({
        url: this.makeUrl(params.query),
        body: body,
        method: 'POST',
        headers: _extends({ 'Content-Type': 'application/json' }, params.headers)
      }).catch(toError);
    }
  }, {
    key: 'update',
    value: function update(id, body) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (typeof id === 'undefined') {
        return Promise.reject(new Error('id for \'update\' can not be undefined, only \'null\' when updating multiple entries'));
      }

      return this.request({
        url: this.makeUrl(params.query, id),
        body: body,
        method: 'PUT',
        headers: _extends({ 'Content-Type': 'application/json' }, params.headers)
      }).catch(toError);
    }
  }, {
    key: 'patch',
    value: function patch(id, body) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (typeof id === 'undefined') {
        return Promise.reject(new Error('id for \'patch\' can not be undefined, only \'null\' when updating multiple entries'));
      }

      return this.request({
        url: this.makeUrl(params.query, id),
        body: body,
        method: 'PATCH',
        headers: _extends({ 'Content-Type': 'application/json' }, params.headers)
      }).catch(toError);
    }
  }, {
    key: 'remove',
    value: function remove(id) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof id === 'undefined') {
        return Promise.reject(new Error('id for \'remove\' can not be undefined, only \'null\' when removing multiple entries'));
      }

      return this.request({
        url: this.makeUrl(params.query, id),
        method: 'DELETE',
        headers: _extends({}, params.headers)
      }).catch(toError);
    }
  }]);

  return Base;
}();

exports.default = Base;
module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var debug = __webpack_require__(8)('feathers-errors');

// NOTE (EK): Babel doesn't properly support extending
// some classes in ES6. The Error class being one of them.
// Node v5.0+ does support this but until we want to drop support
// for older versions we need this hack.
// http://stackoverflow.com/questions/33870684/why-doesnt-instanceof-work-on-instances-of-error-subclasses-under-babel-node
// https://github.com/loganfsmyth/babel-plugin-transform-builtin-extend

var FeathersError = function (_extendableBuiltin2) {
  _inherits(FeathersError, _extendableBuiltin2);

  function FeathersError(msg, name, code, className, data) {
    _classCallCheck(this, FeathersError);

    msg = msg || 'Error';

    var errors = void 0;
    var message = void 0;
    var newData = void 0;

    if (msg instanceof Error) {
      message = msg.message || 'Error';

      // NOTE (EK): This is typically to handle validation errors
      if (msg.errors) {
        errors = msg.errors;
      }
    } else if ((typeof msg === 'undefined' ? 'undefined' : _typeof(msg)) === 'object') {
      // Support plain old objects
      message = msg.message || 'Error';
      data = msg;
    } else {
      // message is just a string
      message = msg;
    }

    if (data) {
      // NOTE(EK): To make sure that we are not messing
      // with immutable data, just make a copy.
      // https://github.com/feathersjs/feathers-errors/issues/19
      newData = _extends({}, data);

      if (newData.errors) {
        errors = newData.errors;
        delete newData.errors;
      }
    }

    // NOTE (EK): Babel doesn't support this so
    // we have to pass in the class name manually.
    // this.name = this.constructor.name;
    var _this = _possibleConstructorReturn(this, (FeathersError.__proto__ || Object.getPrototypeOf(FeathersError)).call(this, message));

    _this.type = 'FeathersError';
    _this.name = name;
    _this.message = message;
    _this.code = code;
    _this.className = className;
    _this.data = newData;
    _this.errors = errors || {};

    debug(_this.name + '(' + _this.code + '): ' + _this.message);
    return _this;
  }

  // NOTE (EK): A little hack to get around `message` not
  // being included in the default toJSON call.


  _createClass(FeathersError, [{
    key: 'toJSON',
    value: function toJSON() {
      return {
        name: this.name,
        message: this.message,
        code: this.code,
        className: this.className,
        data: this.data,
        errors: this.errors
      };
    }
  }]);

  return FeathersError;
}(_extendableBuiltin(Error));

var BadRequest = function (_FeathersError) {
  _inherits(BadRequest, _FeathersError);

  function BadRequest(message, data) {
    _classCallCheck(this, BadRequest);

    return _possibleConstructorReturn(this, (BadRequest.__proto__ || Object.getPrototypeOf(BadRequest)).call(this, message, 'BadRequest', 400, 'bad-request', data));
  }

  return BadRequest;
}(FeathersError);

var NotAuthenticated = function (_FeathersError2) {
  _inherits(NotAuthenticated, _FeathersError2);

  function NotAuthenticated(message, data) {
    _classCallCheck(this, NotAuthenticated);

    return _possibleConstructorReturn(this, (NotAuthenticated.__proto__ || Object.getPrototypeOf(NotAuthenticated)).call(this, message, 'NotAuthenticated', 401, 'not-authenticated', data));
  }

  return NotAuthenticated;
}(FeathersError);

var PaymentError = function (_FeathersError3) {
  _inherits(PaymentError, _FeathersError3);

  function PaymentError(message, data) {
    _classCallCheck(this, PaymentError);

    return _possibleConstructorReturn(this, (PaymentError.__proto__ || Object.getPrototypeOf(PaymentError)).call(this, message, 'PaymentError', 402, 'payment-error', data));
  }

  return PaymentError;
}(FeathersError);

var Forbidden = function (_FeathersError4) {
  _inherits(Forbidden, _FeathersError4);

  function Forbidden(message, data) {
    _classCallCheck(this, Forbidden);

    return _possibleConstructorReturn(this, (Forbidden.__proto__ || Object.getPrototypeOf(Forbidden)).call(this, message, 'Forbidden', 403, 'forbidden', data));
  }

  return Forbidden;
}(FeathersError);

var NotFound = function (_FeathersError5) {
  _inherits(NotFound, _FeathersError5);

  function NotFound(message, data) {
    _classCallCheck(this, NotFound);

    return _possibleConstructorReturn(this, (NotFound.__proto__ || Object.getPrototypeOf(NotFound)).call(this, message, 'NotFound', 404, 'not-found', data));
  }

  return NotFound;
}(FeathersError);

var MethodNotAllowed = function (_FeathersError6) {
  _inherits(MethodNotAllowed, _FeathersError6);

  function MethodNotAllowed(message, data) {
    _classCallCheck(this, MethodNotAllowed);

    return _possibleConstructorReturn(this, (MethodNotAllowed.__proto__ || Object.getPrototypeOf(MethodNotAllowed)).call(this, message, 'MethodNotAllowed', 405, 'method-not-allowed', data));
  }

  return MethodNotAllowed;
}(FeathersError);

var NotAcceptable = function (_FeathersError7) {
  _inherits(NotAcceptable, _FeathersError7);

  function NotAcceptable(message, data) {
    _classCallCheck(this, NotAcceptable);

    return _possibleConstructorReturn(this, (NotAcceptable.__proto__ || Object.getPrototypeOf(NotAcceptable)).call(this, message, 'NotAcceptable', 406, 'not-acceptable', data));
  }

  return NotAcceptable;
}(FeathersError);

var Timeout = function (_FeathersError8) {
  _inherits(Timeout, _FeathersError8);

  function Timeout(message, data) {
    _classCallCheck(this, Timeout);

    return _possibleConstructorReturn(this, (Timeout.__proto__ || Object.getPrototypeOf(Timeout)).call(this, message, 'Timeout', 408, 'timeout', data));
  }

  return Timeout;
}(FeathersError);

var Conflict = function (_FeathersError9) {
  _inherits(Conflict, _FeathersError9);

  function Conflict(message, data) {
    _classCallCheck(this, Conflict);

    return _possibleConstructorReturn(this, (Conflict.__proto__ || Object.getPrototypeOf(Conflict)).call(this, message, 'Conflict', 409, 'conflict', data));
  }

  return Conflict;
}(FeathersError);

var LengthRequired = function (_FeathersError10) {
  _inherits(LengthRequired, _FeathersError10);

  function LengthRequired(message, data) {
    _classCallCheck(this, LengthRequired);

    return _possibleConstructorReturn(this, (LengthRequired.__proto__ || Object.getPrototypeOf(LengthRequired)).call(this, message, 'LengthRequired', 411, 'length-required', data));
  }

  return LengthRequired;
}(FeathersError);

var Unprocessable = function (_FeathersError11) {
  _inherits(Unprocessable, _FeathersError11);

  function Unprocessable(message, data) {
    _classCallCheck(this, Unprocessable);

    return _possibleConstructorReturn(this, (Unprocessable.__proto__ || Object.getPrototypeOf(Unprocessable)).call(this, message, 'Unprocessable', 422, 'unprocessable', data));
  }

  return Unprocessable;
}(FeathersError);

var TooManyRequests = function (_FeathersError12) {
  _inherits(TooManyRequests, _FeathersError12);

  function TooManyRequests(message, data) {
    _classCallCheck(this, TooManyRequests);

    return _possibleConstructorReturn(this, (TooManyRequests.__proto__ || Object.getPrototypeOf(TooManyRequests)).call(this, message, 'TooManyRequests', 429, 'too-many-requests', data));
  }

  return TooManyRequests;
}(FeathersError);

var GeneralError = function (_FeathersError13) {
  _inherits(GeneralError, _FeathersError13);

  function GeneralError(message, data) {
    _classCallCheck(this, GeneralError);

    return _possibleConstructorReturn(this, (GeneralError.__proto__ || Object.getPrototypeOf(GeneralError)).call(this, message, 'GeneralError', 500, 'general-error', data));
  }

  return GeneralError;
}(FeathersError);

var NotImplemented = function (_FeathersError14) {
  _inherits(NotImplemented, _FeathersError14);

  function NotImplemented(message, data) {
    _classCallCheck(this, NotImplemented);

    return _possibleConstructorReturn(this, (NotImplemented.__proto__ || Object.getPrototypeOf(NotImplemented)).call(this, message, 'NotImplemented', 501, 'not-implemented', data));
  }

  return NotImplemented;
}(FeathersError);

var BadGateway = function (_FeathersError15) {
  _inherits(BadGateway, _FeathersError15);

  function BadGateway(message, data) {
    _classCallCheck(this, BadGateway);

    return _possibleConstructorReturn(this, (BadGateway.__proto__ || Object.getPrototypeOf(BadGateway)).call(this, message, 'BadGateway', 502, 'bad-gateway', data));
  }

  return BadGateway;
}(FeathersError);

var Unavailable = function (_FeathersError16) {
  _inherits(Unavailable, _FeathersError16);

  function Unavailable(message, data) {
    _classCallCheck(this, Unavailable);

    return _possibleConstructorReturn(this, (Unavailable.__proto__ || Object.getPrototypeOf(Unavailable)).call(this, message, 'Unavailable', 503, 'unavailable', data));
  }

  return Unavailable;
}(FeathersError);

var errors = {
  FeathersError: FeathersError,
  BadRequest: BadRequest,
  NotAuthenticated: NotAuthenticated,
  PaymentError: PaymentError,
  Forbidden: Forbidden,
  NotFound: NotFound,
  MethodNotAllowed: MethodNotAllowed,
  NotAcceptable: NotAcceptable,
  Timeout: Timeout,
  Conflict: Conflict,
  LengthRequired: LengthRequired,
  Unprocessable: Unprocessable,
  TooManyRequests: TooManyRequests,
  GeneralError: GeneralError,
  NotImplemented: NotImplemented,
  BadGateway: BadGateway,
  Unavailable: Unavailable,
  400: BadRequest,
  401: NotAuthenticated,
  402: PaymentError,
  403: Forbidden,
  404: NotFound,
  405: MethodNotAllowed,
  406: NotAcceptable,
  408: Timeout,
  409: Conflict,
  411: LengthRequired,
  422: Unprocessable,
  429: TooManyRequests,
  500: GeneralError,
  501: NotImplemented,
  502: BadGateway,
  503: Unavailable
};

function convert(error) {
  if (!error) {
    return error;
  }

  var FeathersError = errors[error.name];
  var result = FeathersError ? new FeathersError(error.message, error.data) : new Error(error.message || error);

  if ((typeof error === 'undefined' ? 'undefined' : _typeof(error)) === 'object') {
    _extends(result, error);
  }

  return result;
}

exports.default = _extends({
  convert: convert,
  types: errors,
  errors: errors
}, errors);
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* global define */
/**
 * A base object for ECMAScript 5 style prototypal inheritance.
 *
 * @see https://github.com/rauschma/proto-js/
 * @see http://ejohn.org/blog/simple-javascript-inheritance/
 * @see http://uxebu.com/blog/2011/02/23/object-based-inheritance-for-ecmascript-5/
 */
(function (root, factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.Proto = factory();
	}
}(this, function () {

	function makeSuper(_super, old, name, fn) {
		return function () {
			var tmp = this._super;

			// Add a new ._super() method that is the same method
			// but either pointing to the prototype method
			// or to the overwritten method
			this._super = (typeof old === 'function') ? old : _super[name];

			// The method only need to be bound temporarily, so we
			// remove it when we're done executing
			var ret = fn.apply(this, arguments);
			this._super = tmp;

			return ret;
		};
	}

	function legacyMixin(prop, obj) {
		var self = obj || this;
		var fnTest = /\b_super\b/;
		var _super = Object.getPrototypeOf(self) || self.prototype;
		var _old;

		// Copy the properties over
		for (var name in prop) {
			// store the old function which would be overwritten
			_old = self[name];

			// Check if we're overwriting an existing function
			if(
					((
						typeof prop[name] === 'function' &&
						typeof _super[name] === 'function'
					) || (
						typeof _old === 'function' &&
						typeof prop[name] === 'function'
					)) && fnTest.test(prop[name])
			) {
				self[name] = makeSuper(_super, _old, name, prop[name]);
			} else {
				self[name] = prop[name];
			}
		}

		return self;
	}

	function es5Mixin(prop, obj) {
		var self = obj || this;
		var fnTest = /\b_super\b/;
		var _super = Object.getPrototypeOf(self) || self.prototype;
		var descriptors = {};
		var proto = prop;
		var processProperty = function(name) {
			if(!descriptors[name]) {
				descriptors[name] = Object.getOwnPropertyDescriptor(proto, name);
			}
		};

		// Collect all property descriptors
		do {
			Object.getOwnPropertyNames(proto).forEach(processProperty);
    } while((proto = Object.getPrototypeOf(proto)) && Object.getPrototypeOf(proto));
		
		Object.keys(descriptors).forEach(function(name) {
			var descriptor = descriptors[name];

			if(typeof descriptor.value === 'function' && fnTest.test(descriptor.value)) {
				descriptor.value = makeSuper(_super, self[name], name, descriptor.value);
			}

			Object.defineProperty(self, name, descriptor);
		});

		return self;
	}

	return {
		/**
		 * Create a new object using Object.create. The arguments will be
		 * passed to the new instances init method or to a method name set in
		 * __init.
		 */
		create: function () {
			var instance = Object.create(this);
			var init = typeof instance.__init === 'string' ? instance.__init : 'init';

			if (typeof instance[init] === 'function') {
				instance[init].apply(instance, arguments);
			}
			return instance;
		},
		/**
		 * Mixin a given set of properties
		 * @param prop The properties to mix in
		 * @param obj [optional] The object to add the mixin
		 */
		mixin: typeof Object.defineProperty === 'function' ? es5Mixin : legacyMixin,
		/**
		 * Extend the current or a given object with the given property
		 * and return the extended object.
		 * @param prop The properties to extend with
		 * @param obj [optional] The object to extend from
		 * @returns The extended object
		 */
		extend: function (prop, obj) {
			return this.mixin(prop, Object.create(obj || this));
		},
		/**
		 * Return a callback function with this set to the current or a given context object.
		 * @param name Name of the method to proxy
		 * @param args... [optional] Arguments to use for partial application
		 */
		proxy: function (name) {
			var fn = this[name];
			var args = Array.prototype.slice.call(arguments, 1);

			args.unshift(this);
			return fn.bind.apply(fn, args);
		}
	};

}));


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = {
	"HANOI": {
		"name": "Hà Nội",
		"cities": {
			"QUANBADINH": "Quận Ba Đình",
			"QUANHOANKIEM": "Quận Hoàn Kiếm",
			"QUANHAIBATRUNG": "Quận Hai Bà Trưng",
			"QUANDONGDA": "Quận Đống Đa",
			"QUANTAYHO": "Quận Tây Hồ",
			"QUANCAUGIAY": "Quận Cầu Giấy",
			"QUANTHANHXUAN": "Quận Thanh Xuân",
			"QUANHOANGMAI": "Quận Hoàng Mai",
			"QUANLONGBIEN": "Quận Long Biên",
			"HUYENTULIEM": "Huyện Từ Liêm",
			"HUYENTHANHTRI": "Huyện Thanh Trì",
			"HUYENGIALAM": "Huyện Gia Lâm",
			"HUYENDONGANH": "Huyện Đông Anh",
			"HUYENSOCSON": "Huyện Sóc Sơn",
			"QUANHADONG": "Quận Hà Đông",
			"THIXASONTAY": "Thị xã Sơn Tây",
			"HUYENBAVI": "Huyện Ba Vì",
			"HUYENPHUCTHO": "Huyện Phúc Thọ",
			"HUYENTHACHTHAT": "Huyện Thạch Thất",
			"HUYENQUOCOAI": "Huyện Quốc Oai",
			"HUYENCHUONGMY": "Huyện Chương Mỹ",
			"HUYENDANPHUONG": "Huyện Đan Phượng",
			"HUYENHOAIDUC": "Huyện Hoài Đức",
			"HUYENTHANHOAI": "Huyện Thanh Oai",
			"HUYENMYDUC": "Huyện Mỹ Đức",
			"HUYENUNGHOA": "Huyện Ứng Hoà",
			"HUYENTHUONGTIN": "Huyện Thường Tín",
			"HUYENPHUXUYEN": "Huyện Phú Xuyên",
			"HUYENMELINH": "Huyện Mê Linh",
			"HANOIKHAC": "Quận/Huyện khác"
		}
	},
	"HOCHIMINH": {
		"name": "THÀNH PHỐ HỒ CHÍ MINH",
		"cities": {
			"QUAN1": "Quận 1",
			"QUAN2": "Quận 2",
			"QUAN3": "Quận 3",
			"QUAN4": "Quận 4",
			"QUAN5": "Quận 5",
			"QUAN6": "Quận 6",
			"QUAN7": "Quận 7",
			"QUAN8": "Quận 8",
			"QUAN9": "Quận 9",
			"QUAN10": "Quận 10",
			"QUAN11": "Quận 11",
			"QUAN12": "Quận 12",
			"QUANGOVAP": "Quận Gò Vấp",
			"QUANTANBINH": "Quận Tân Bình",
			"QUANTANPHU": "Quận Tân Phú",
			"QUANBINHTHANH": "Quận Bình Thạnh",
			"QUANPHUNHUAN": "Quận Phú Nhuận",
			"QUANTHUDUC": "Quận Thủ Đức",
			"QUANBINHTAN": "Quận Bình Tân",
			"HUYENBINHCHANH": "Huyện Bình Chánh",
			"HUYENCUCHI": "Huyện Củ Chi",
			"HUYENHOCMON": "Huyện Hóc Môn",
			"HUYENNHABE": "Huyện Nhà Bè",
			"HUYENCANGIO": "Huyện Cần Giờ",
			"HOCHIMINHKHAC": "Quận/Huyện khác"
		}
	},
	"HAIPHONG": {
		"name": "Thành phố Hải Phòng",
		"cities": {
			"QUANHONGBANG": "Quận Hồng Bàng",
			"QUANLECHAN": "Quận Lê Chân",
			"QUANNGOQUYEN": "Quận Ngô Quyền",
			"QUANKIENAN": "Quận Kiến An",
			"QUANHAIAN": "Quận Hải An",
			"QUANDOSON": "Quận Đồ Sơn",
			"HUYENANLAO": "Huyện An Lão",
			"HUYENKIENTHUY": "Huyện Kiến Thụy",
			"HUYENTHUYNGUYEN": "Huyện Thủy Nguyên",
			"HUYENANDUONG": "Huyện An Dương",
			"HUYENTIENLANG": "Huyện Tiên Lãng",
			"HUYENVINHBAO": "Huyện Vĩnh Bảo",
			"HUYENCATHAI": "Huyện Cát Hải",
			"HUYENBACHLONGVI": "Huyện Bạch Long Vĩ",
			"QUANDUONGKINH": "Quận Dương Kinh",
			"HAIPHONGKHAC": "Quận/Huyện khác"
		}
	},
	"DANANG": {
		"name": "Thành Phố Đà Nẵng",
		"cities": {
			"QUANHAICHAU": "Quận Hải Châu",
			"QUANTHANHKHE": "Quận Thanh Khê",
			"QUANSONTRA": "Quận Sơn Trà",
			"QUANNGUHANHSON": "Quận Ngũ Hành Sơn",
			"QUANLIENCHIEU": "Quận Liên Chiểu",
			"HUYENHOAVANG": "Huyện Hoà Vang",
			"QUANCAMLE": "Quận Cẩm Lệ",
			"DANANGKHAC": "Quận/Huyện khác"
		}
	},
	"HAGIANG": {
		"name": "Tỉnh Hà Giang",
		"cities": {
			"THANHPHOHAGIANG": "Thành phố Hà Giang",
			"HUYENDONGVAN": "Huyện Đồng Văn",
			"HUYENMEOVAC": "Huyện Mèo Vạc",
			"HUYENYENMINH": "Huyện Yên Minh",
			"HUYENQUANBA": "Huyện Quản Bạ",
			"HUYENVIXUYEN": "Huyện Vị Xuyên",
			"HUYENBACME": "Huyện Bắc Mê",
			"HUYENHOANGSUPHI": "Huyện Hoàng Su Phì",
			"HUYENXINMAN": "Huyện Xín Mần",
			"HUYENBACQUANG": "Huyện Bắc Quang",
			"HUYENQUANGBINH": "Huyện Quang Bình",
			"HAGIANGKHAC": "Quận/Huyện khác"
		}
	},
	"CAOBANG": {
		"name": "Tỉnh Cao Bằng",
		"cities": {
			"THANHPHOCAOBANG": "Thành phố Cao Bằng",
			"HUYENBAOLAC": "Huyện Bảo Lạc",
			"HUYENTHONGNONG": "Huyện Thông Nông",
			"HUYENHAQUANG": "Huyện Hà Quảng",
			"HUYENTRALINH": "Huyện Trà Lĩnh",
			"HUYENTRUNGKHANH": "Huyện Trùng Khánh",
			"HUYENNGUYENBINH": "Huyện Nguyên Bình",
			"HUYENHOAAN": "Huyện Hoà An",
			"HUYENQUANGUYEN": "Huyện Quảng Uyên",
			"HUYENTHACHAN": "Huyện Thạch An",
			"HUYENHALANG": "Huyện Hạ Lang",
			"HUYENBAOLAM": "Huyện Bảo Lâm",
			"HUYENPHUCHOA": "Huyện Phục Hoà",
			"CAOBANGKHAC": "Quận/Huyện khác"
		}
	},
	"LAICHAU": {
		"name": "Tỉnh Lai Châu",
		"cities": {
			"THANHPHOLAICHAU": "Thành Phố Lai Châu",
			"HUYENTAMDUONG": "Huyện Tam Đường",
			"HUYENPHONGTHO": "Huyện Phong Thổ",
			"HUYENSINHO": "Huyện Sìn Hồ",
			"HUYENMUONGTE": "Huyện Mường Tè",
			"HUYENTHANUYEN": "Huyện Than Uyên",
			"HUYENTANUYEN": "Huyện Tân Uyên",
			"HUYENNAMNHUM": "Huyện Nậm Nhùm",
			"LAICHAUKHAC": "Quận/Huyện khác"
		}
	},
	"LAOCAI": {
		"name": "Tỉnh Lào Cai",
		"cities": {
			"THANHPHOLAOCAI": "Thành phố Lào Cai",
			"HUYENXIMACAI": "Huyện Xi Ma Cai",
			"HUYENBATXAT": "Huyện Bát Xát",
			"HUYENBAOTHANG": "Huyện Bảo Thắng",
			"HUYENSAPA": "Huyện Sa Pa",
			"HUYENVANBAN": "Huyện Văn Bàn",
			"HUYENBAOYEN": "Huyện Bảo Yên",
			"HUYENBACHA": "Huyện Bắc Hà",
			"HUYENMUONGKHUONG": "Huyện Mường Khương",
			"LAOCAIKHAC": "Quận/Huyện khác"
		}
	},
	"TUYENQUANG": {
		"name": "Tỉnh Tuyên Quang",
		"cities": {
			"TH.PHOTUYENQUANG": "Th. phố Tuyên Quang",
			"HUYENLAMBINH": "Huyện Lâm Bình",
			"HUYENNAHANG": "Huyện Na Hang",
			"HUYENCHIEMHOA": "Huyện Chiêm Hoá",
			"HUYENHAMYEN": "Huyện Hàm Yên",
			"HUYENYENSON": "Huyện Yên Sơn",
			"HUYENSONDUONG": "Huyện Sơn Dương",
			"TUYENQUANGKHAC": "Quận/Huyện khác"
		}
	},
	"LANGSON": {
		"name": "Tỉnh Lạng Sơn",
		"cities": {
			"THANHPHOLANGSON": "Thành phố Lạng Sơn",
			"HUYENTRANGDINH": "Huyện Tràng Định",
			"HUYENBINHGIA": "Huyện Bình Gia",
			"HUYENVANLANG": "Huyện Văn Lãng",
			"HUYENBACSON": "Huyện Bắc Sơn",
			"HUYENVANQUAN": "Huyện Văn Quan",
			"HUYENCAOLOC": "Huyện Cao Lộc",
			"HUYENLOCBINH": "Huyện Lộc Bình",
			"HUYENCHILANG": "Huyện Chi Lăng",
			"HUYENDINHLAP": "Huyện Đình Lập",
			"HUYENHUULUNG": "Huyện Hữu Lũng",
			"LANGSONKHAC": "Quận/Huyện khác"
		}
	},
	"BACKAN": {
		"name": "Tỉnh Bắc Kạn",
		"cities": {
			"THIXABACKAN": "Thị xã Bắc Kạn",
			"HUYENCHODON": "Huyện Chợ Đồn",
			"HUYENBACHTHONG": "Huyện Bạch Thông",
			"HUYENNARI": "Huyện Na Rì",
			"HUYENNGANSON": "Huyện Ngân Sơn",
			"HUYENBABE": "Huyện Ba Bể",
			"HUYENCHOMOI": "Huyện Chợ Mới",
			"HUYENPACNAM": "Huyện Pác Nặm",
			"BACKANKHAC": "Quận/Huyện khác"
		}
	},
	"THAINGUYEN": {
		"name": "Tỉnh Thái Nguyên",
		"cities": {
			"THANHPHOTHAINGUYEN": "Thành phố Thái Nguyên",
			"THIXASONGCONG": "Thị xã Sông Công",
			"HUYENDINHHOA": "Huyện Định Hoá",
			"HUYENPHULUONG": "Huyện Phú Lương",
			"HUYENVONHAI": "Huyện Võ Nhai",
			"HUYENDAITU": "Huyện Đại Từ",
			"HUYENDONGHY": "Huyện Đồng Hỷ",
			"HUYENPHUBINH": "Huyện Phú Bình",
			"HUYENPHOYEN": "Huyện Phổ Yên",
			"THAINGUYENKHAC": "Quận/Huyện khác"
		}
	},
	"YENBAI": {
		"name": "Tỉnh Yên Bái",
		"cities": {
			"THANHPHOYENBAI": "Thành phố Yên Bái",
			"THIXANGHIALO": "Thị xã Nghĩa Lộ",
			"HUYENVANYEN": "Huyện Văn Yên",
			"HUYENYENBINH": "Huyện Yên Bình",
			"HUYENMUCANGCHAI": "Huyện Mù Cang Chải",
			"HUYENVANCHAN": "Huyện Văn Chấn",
			"HUYENTRANYEN": "Huyện Trấn Yên",
			"HUYENTRAMTAU": "Huyện Trạm Tấu",
			"HUYENLUCYEN": "Huyện Lục Yên",
			"YENBAIKHAC": "Quận/Huyện khác"
		}
	},
	"SONLA": {
		"name": "Tỉnh Sơn La",
		"cities": {
			"THANHPHOSONLA": "Thành phố Sơn La",
			"HUYENQUYNHNHAI": "Huyện Quỳnh Nhai",
			"HUYENMUONGLA": "Huyện Mường La",
			"HUYENTHUANCHAU": "Huyện Thuận Châu",
			"HUYENBACYEN": "Huyện Bắc Yên",
			"HUYENPHUYEN": "Huyện Phù Yên",
			"HUYENMAISON": "Huyện Mai Sơn",
			"HUYENYENCHAU": "Huyện Yên Châu",
			"HUYENSONGMA": "Huyện Sông Mã",
			"HUYENMOCCHAU": "Huyện Mộc Châu",
			"HUYENSOPCOP": "huyện Sốp Cộp",
			"HUYENVANHO": "Huyện Vân Hồ",
			"SONLAKHAC": "Quận/Huyện khác"
		}
	},
	"PHUTHO": {
		"name": "Tỉnh Phú Thọ",
		"cities": {
			"THANHPHOVIETTRI": "Thành phố Việt Trì",
			"THIXAPHUTHO": "Thị xã Phú Thọ",
			"HUYENDOANHUNG": "Huyện Đoan Hùng",
			"HUYENTHANHBA": "Huyện Thanh Ba",
			"HUYENHAHOA": "Huyện Hạ Hoà",
			"HUYENCAMKHE": "Huyện Cẩm Khê",
			"HUYENYENLAP": "Huyện Yên Lập",
			"HUYENTHANHSON": "Huyện Thanh Sơn",
			"HUYENPHUNINH": "Huyện Phù Ninh",
			"HUYENLAMTHAO": "Huyện Lâm Thao",
			"HUYENTAMNONG": "Huyện Tam Nông",
			"HUYENTHANHTHUY": "Huyện Thanh Thủy",
			"HUYENTANSON": "Huyện Tân Sơn",
			"PHUTHOKHAC": "Quận/Huyện khác"
		}
	},
	"VINHPHUC": {
		"name": "Tỉnh Vĩnh Phúc",
		"cities": {
			"THANHPHOVINHYEN": "Thành phố Vĩnh Yên",
			"HUYENTAMDUONG": "Huyện Tam Dương",
			"HUYENLAPTHACH": "Huyện Lập Thạch",
			"HUYENVINHTUONG": "Huyện Vĩnh Tường",
			"HUYENYENLAC": "Huyện Yên Lạc",
			"HUYENBINHXUYEN": "Huyện Bình Xuyên",
			"HUYENSONGLO": "Huyện Sông Lô",
			"THIXAPHUCYEN": "Thị xã Phúc Yên",
			"HUYENTAMDAO": "Huyện Tam Đảo",
			"VINHPHUCKHAC": "Quận/Huyện khác"
		}
	},
	"QUANGNINH": {
		"name": "Tỉnh Quảng Ninh",
		"cities": {
			"THANHPHOHALONG": "Thành phố Hạ Long",
			"THANHPHOCAMPHA": "Thành phố Cẩm Phả",
			"THANHPHOUONGBI": "Thành phố Uông Bí",
			"THANHPHOMONGCAI": "Thành phố Móng Cái",
			"HUYENBINHLIEU": "Huyện Bình Liêu",
			"HUYENDAMHA": "Huyện Đầm Hà",
			"HUYENHAIHA": "Huyện Hải Hà",
			"HUYENTIENYEN": "Huyện Tiên Yên",
			"HUYENBACHE": "Huyện Ba Chẽ",
			"HUYENDONGTRIEU": "Huyện Đông Triều",
			"THIXAQUANGYEN": "Thị xã Quảng Yên",
			"HUYENHOANHBO": "Huyện Hoành Bồ",
			"HUYENVANDON": "Huyện Vân Đồn",
			"HUYENCOTO": "Huyện Cô Tô",
			"QUANGNINHKHAC": "Quận/Huyện khác"
		}
	},
	"BACGIANG": {
		"name": "Tỉnh Bắc Giang",
		"cities": {
			"THANHPHOBACGIANG": "Thành phố Bắc Giang",
			"HUYENYENTHE": "Huyện Yên Thế",
			"HUYENLUCNGAN": "Huyện Lục Ngạn",
			"HUYENSONDONG": "Huyện Sơn Động",
			"HUYENLUCNAM": "Huyện Lục Nam",
			"HUYENTANYEN": "Huyện Tân Yên",
			"HUYENHIEPHOA": "Huyện Hiệp Hoà",
			"HUYENLANGGIANG": "Huyện Lạng Giang",
			"HUYENVIETYEN": "Huyện Việt Yên",
			"HUYENYENDUNG": "Huyện Yên Dũng",
			"BACGIANGKHAC": "Quận/Huyện khác"
		}
	},
	"BACNINH": {
		"name": "Tỉnh Bắc Ninh",
		"cities": {
			"THANHPHOBACNINH": "Thành phố Bắc Ninh",
			"HUYENYENPHONG": "Huyện Yên Phong",
			"HUYENQUEVO": "Huyện Quế Võ",
			"HUYENTIENDU": "Huyện Tiên Du",
			"THIXATUSON": "Thị xã Từ Sơn",
			"HUYENTHUANTHANH": "Huyện Thuận Thành",
			"HUYENGIABINH": "Huyện Gia Bình",
			"HUYENLUONGTAI": "Huyện Lương Tài",
			"BACNINHKHAC": "Quận/Huyện khác"
		}
	},
	"HAIDUONG": {
		"name": "Tỉnh Hải Dương",
		"cities": {
			"THANHPHOHAIDUONG": "Thành phố Hải Dương",
			"THIXACHILINH": "Thị xã Chí Linh",
			"HUYENNAMSACH": "Huyện Nam Sách",
			"HUYENKINHMON": "Huyện Kinh Môn",
			"HUYENGIALOC": "Huyện Gia Lộc",
			"HUYENTUKY": "Huyện Tứ Kỳ",
			"HUYENTHANHMIEN": "Huyện Thanh Miện",
			"HUYENNINHGIANG": "Huyện Ninh Giang",
			"HUYENCAMGIANG": "Huyện Cẩm Giàng",
			"HUYENTHANHHA": "Huyện Thanh Hà",
			"HUYENKIMTHANH": "Huyện Kim Thành",
			"HUYENBINHGIANG": "Huyện Bình Giang",
			"HAIDUONGKHAC": "Quận/Huyện khác"
		}
	},
	"HUNGYEN": {
		"name": "Tỉnh Hưng Yên",
		"cities": {
			"THANHPHOHUNGYEN": "Thành phố Hưng Yên",
			"HUYENKIMDONG": "Huyện Kim Động",
			"HUYENANTHI": "Huyện Ân Thi",
			"HUYENKHOAICHAU": "Huyện Khoái Châu",
			"HUYENYENMY": "Huyện Yên Mỹ",
			"HUYENTIENLU": "Huyện Tiên Lữ",
			"HUYENPHUCU": "Huyện Phù Cừ",
			"HUYENMYHAO": "Huyện Mỹ Hào",
			"HUYENVANLAM": "Huyện Văn Lâm",
			"HUYENVANGIANG": "Huyện Văn Giang",
			"HUNGYENKHAC": "Quận/Huyện khác"
		}
	},
	"HOABINH": {
		"name": "Tỉnh Hòa Bình",
		"cities": {
			"THANHPHOHOABINH": "Thành phố Hoà Bình",
			"HUYENDABAC": "Huyện Đà Bắc",
			"HUYENMAICHAU": "Huyện Mai Châu",
			"HUYENTANLAC": "Huyện Tân Lạc",
			"HUYENLACSON": "Huyện Lạc Sơn",
			"HUYENKYSON": "Huyện Kỳ Sơn",
			"HUYENLU­ONGSON": "Huyện Lư­ơng Sơn",
			"HUYENKIMBOI": "Huyện Kim Bôi",
			"HUYENLACTHUY": "Huyện Lạc Thuỷ",
			"HUYENYENTHUY": "Huyện Yên Thuỷ",
			"HUYENCAOPHONG": "Huyện Cao Phong",
			"HOABINHKHAC": "Quận/Huyện khác"
		}
	},
	"HANAM": {
		"name": "TỈNH HÀ NAM",
		"cities": {
			"THANHPHOPHULY": "Thành phố Phủ Lý",
			"HUYENDUYTIEN": "Huyện Duy Tiên",
			"HUYENKIMBANG": "Huyện Kim Bảng",
			"HUYENLYNHAN": "Huyện Lý Nhân",
			"HUYENTHANHLIEM": "Huyện Thanh Liêm",
			"HUYENBINHLUC": "Huyện Bình Lục",
			"HANAMKHAC": "Quận/Huyện khác"
		}
	},
	"NAMDINH": {
		"name": "Tỉnh Nam Định",
		"cities": {
			"THANHPHONAMDINH": "Thành phố Nam Định",
			"HUYENMYLOC": "Huyện Mỹ Lộc",
			"HUYENXUANTRUONG": "Huyện Xuân Trường",
			"HUYENGIAOTHUY": "Huyện Giao Thủy",
			"HUYENYYEN": "Huyện Ý Yên",
			"HUYENVUBAN": "Huyện Vụ Bản",
			"HUYENNAMTRUC": "Huyện Nam Trực",
			"HUYENTRUCNINH": "Huyện Trực Ninh",
			"HUYENNGHIAHUNG": "Huyện Nghĩa Hưng",
			"HUYENHAIHAU": "Huyện Hải Hậu",
			"NAMDINHKHAC": "Quận/Huyện khác"
		}
	},
	"THAIBINH": {
		"name": "Tỉnh Thái Bình",
		"cities": {
			"THANHPHOTHAIBINH": "Thành phố Thái Bình",
			"HUYENQUYNHPHU": "Huyện Quỳnh Phụ",
			"HUYENHUNGHA": "Huyện Hưng Hà",
			"HUYENDONGHUNG": "Huyện Đông Hưng",
			"HUYENVUTHU": "Huyện Vũ Thư",
			"HUYENKIENXUONG": "Huyện Kiến Xương",
			"HUYENTIENHAI": "Huyện Tiền Hải",
			"HUYENTHAITHUY": "Huyện Thái Thuỵ",
			"THAIBINHKHAC": "Quận/Huyện khác"
		}
	},
	"NINHBINH": {
		"name": "Tỉnh Ninh Bình",
		"cities": {
			"THANHPHONINHBINH": "Thành phố Ninh Bình",
			"THIXATAMDIEP": "Thị xã Tam Điệp",
			"HUYENNHOQUAN": "Huyện Nho Quan",
			"HUYENGIAVIEN": "Huyện Gia Viễn",
			"HUYENHOALU": "Huyện Hoa Lư",
			"HUYENYENMO": "Huyện Yên Mô",
			"HUYENKIMSON": "Huyện Kim Sơn",
			"HUYENYENKHANH": "Huyện Yên Khánh",
			"NINHBINHKHAC": "Quận/Huyện khác"
		}
	},
	"THANHHOA": {
		"name": "Tỉnh Thanh Hóa",
		"cities": {
			"THANHPHOTHANHHOA": "Thành phố Thanh Hoá",
			"THIXABIMSON": "Thị xã Bỉm Sơn",
			"THIXASAMSON": "Thị xã Sầm Sơn",
			"HUYENQUANHOA": "Huyện Quan Hoá",
			"HUYENQUANSON": "Huyện Quan Sơn",
			"HUYENMUONGLAT": "Huyện Mường Lát",
			"HUYENBATHUOC": "Huyện Bá Thước",
			"HUYENTHUONGXUAN": "Huyện Thường Xuân",
			"HUYENNHUXUAN": "Huyện Như Xuân",
			"HUYENNHUTHANH": "Huyện Như Thanh",
			"HUYENLANGCHANH": "Huyện Lang Chánh",
			"HUYENNGOCLAC": "Huyện Ngọc Lặc",
			"HUYENTHACHTHANH": "Huyện Thạch Thành",
			"HUYENCAMTHUY": "Huyện Cẩm Thủy",
			"HUYENTHOXUAN": "Huyện Thọ Xuân",
			"HUYENVINHLOC": "Huyện Vĩnh Lộc",
			"HUYENTHIEUHOA": "Huyện Thiệu Hoá",
			"HUYENTRIEUSON": "Huyện Triệu Sơn",
			"HUYENNONGCONG": "Huyện Nông Cống",
			"HUYENDONGSON": "Huyện Đông Sơn",
			"HUYENHATRUNG": "Huyện Hà Trung",
			"HUYENHOANGHOA": "Huyện Hoằng Hoá",
			"HUYENNGASON": "Huyện Nga Sơn",
			"HUYENHAULOC": "Huyện Hậu Lộc",
			"HUYENQUANGXUONG": "Huyện Quảng Xương",
			"HUYENTINHGIA": "Huyện Tĩnh Gia",
			"HUYENYENDINH": "Huyện Yên Định",
			"THANHHOAKHAC": "Quận/Huyện khác"
		}
	},
	"NGHEAN": {
		"name": "Tỉnh Nghệ An",
		"cities": {
			"THANHPHOVINH": "Thành phố Vinh",
			"THIXACUALO": "Thị xã Cửa Lò",
			"HUYENQUYCHAU": "Huyện Quỳ Châu",
			"HUYENQUYHOP": "Huyện Quỳ Hợp",
			"HUYENNGHIADAN": "Huyện Nghĩa Đàn",
			"HUYENQUYNHLUU": "Huyện Quỳnh Lưu",
			"HUYENKYSON": "Huyện Kỳ Sơn",
			"HUYENTUONGDUONG": "Huyện Tương Dương",
			"HUYENCONCUONG": "Huyện Con Cuông",
			"HUYENTANKY": "Huyện Tân Kỳ",
			"HUYENYENTHANH": "Huyện Yên Thành",
			"HUYENDIENCHAU": "Huyện Diễn Châu",
			"HUYENANHSON": "Huyện Anh Sơn",
			"HUYENDOLUONG": "Huyện Đô Lương",
			"HUYENTHANHCHUONG": "Huyện Thanh Chương",
			"HUYENNGHILOC": "Huyện Nghi Lộc",
			"HUYENNAMDAN": "Huyện Nam Đàn",
			"HUYENHUNGNGUYEN": "Huyện Hưng Nguyên",
			"HUYENQUEPHONG": "Huyện Quế Phong",
			"THIXATHAIHOA": "Thị Xã Thái Hòa",
			"THIXAHOANGMAI": "Thị Xã Hoàng Mai",
			"NGHEANKHAC": "Quận/Huyện khác"
		}
	},
	"HATINH": {
		"name": "Tỉnh Hà Tĩnh",
		"cities": {
			"THANHPHOHATINH": "Thành phố Hà Tĩnh",
			"THIXAHONGLINH": "Thị xã Hồng Lĩnh",
			"HUYENHUONGSON": "Huyện Hương Sơn",
			"HUYENDUCTHO": "Huyện Đức Thọ",
			"HUYENNGHIXUAN": "Huyện Nghi Xuân",
			"HUYENCANLOC": "Huyện Can Lộc",
			"HUYENHUONGKHE": "Huyện Hương Khê",
			"HUYENTHACHHA": "Huyện Thạch Hà",
			"HUYENCAMXUYEN": "Huyện Cẩm Xuyên",
			"HUYENKYANH": "Huyện Kỳ Anh",
			"HUYENVUQUANG": "Huyện Vũ Quang",
			"HUYENLOCHA": "Huyện Lộc Hà",
			"HATINHKHAC": "Quận/Huyện khác"
		}
	},
	"QUANGBINH": {
		"name": "Tỉnh Quảng Bình",
		"cities": {
			"THANHPHODONGHOI": "Thành phố Đồng Hới",
			"HUYENTUYENHOA": "Huyện Tuyên Hoá",
			"HUYENMINHHOA": "Huyện Minh Hoá",
			"HUYENQUANGTRACH": "Huyện Quảng Trạch",
			"HUYENBOTRACH": "Huyện Bố Trạch",
			"HUYENQUANGNINH": "Huyện Quảng Ninh",
			"HUYENLETHUY": "Huyện Lệ Thuỷ",
			"QUANGBINHKHAC": "Quận/Huyện khác"
		}
	},
	"QUANGTRI": {
		"name": "Tỉnh Quảng Trị",
		"cities": {
			"THANHPHODONGHA": "Thành phố Đông Hà",
			"THIXAQUANGTRI": "Thị xã Quảng Trị",
			"HUYENVINHLINH": "Huyện Vĩnh Linh",
			"HUYENGIOLINH": "Huyện Gio Linh",
			"HUYENCAMLO": "Huyện Cam Lộ",
			"HUYENTRIEUPHONG": "Huyện Triệu Phong",
			"HUYENHAILANG": "Huyện Hải Lăng",
			"HUYENHUONGHOA": "Huyện Hướng Hóa",
			"HUYENDAKRONG": "Huyện Đăk Rông",
			"HUYENDAOCONCO": "Huyện đảo Cồn Cỏ",
			"QUANGTRIKHAC": "Quận/Huyện khác"
		}
	},
	"THUATHIENHUE": {
		"name": "Tỉnh Thừa Thiên Huế",
		"cities": {
			"THANHPHOHUE": "Thành phố Huế",
			"HUYENPHONGDIEN": "Huyện Phong Điền",
			"HUYENQUANGDIEN": "Huyện Quảng Điền",
			"THIXAHUONGTRA": "Thị xã Hương Trà",
			"HUYENPHUVANG": "Huyện Phú Vang",
			"THIXAHUONGTHUY": "Thị xã Hương Thủy",
			"HUYENPHULOC": "Huyện Phú Lộc",
			"HUYENNAMDONG": "Huyện Nam Đông",
			"HUYENALUOI": "Huyện A Lưới",
			"THUATHIENHUEKHAC": "Quận/Huyện khác"
		}
	},
	"QUANGNAM": {
		"name": "Tỉnh Quảng Nam",
		"cities": {
			"THANHPHOTAMKY": "Thành phố Tam Kỳ",
			"THANHPHOHOIAN": "Thành phố Hội An",
			"HUYENDUYXUYEN": "Huyện Duy Xuyên",
			"HUYENDIENBAN": "Huyện Điện Bàn",
			"HUYENDAILOC": "Huyện Đại Lộc",
			"HUYENQUESON": "Huyện Quế Sơn",
			"HUYENHIEPDUC": "Huyện Hiệp Đức",
			"HUYENTHANGBINH": "Huyện Thăng Bình",
			"HUYENNUITHANH": "Huyện Núi Thành",
			"HUYENTIENPHUOC": "Huyện Tiên Phước",
			"HUYENBACTRAMY": "Huyện Bắc Trà My",
			"HUYENDONGGIANG": "Huyện Đông Giang",
			"HUYENNAMGIANG": "Huyện Nam Giang",
			"HUYENPHUOCSON": "Huyện Phước Sơn",
			"HUYENNAMTRAMY": "Huyện Nam Trà My",
			"HUYENTAYGIANG": "Huyện Tây Giang",
			"HUYENPHUNINH": "Huyện Phú Ninh",
			"HUYENNONGSON": "Huyện Nông Sơn",
			"QUANGNAMKHAC": "Quận/Huyện khác"
		}
	},
	"QUANGNGAI": {
		"name": "Tỉnh Quảng Ngãi",
		"cities": {
			"THANHPHOQUANGNGAI": "Thành phố Quảng Ngãi",
			"HUYENLYSON": "Huyện Lý Sơn",
			"HUYENBINHSON": "Huyện Bình Sơn",
			"HUYENTRABONG": "Huyện Trà Bồng",
			"HUYENSONTINH": "Huyện Sơn Tịnh",
			"HUYENSONHA": "Huyện Sơn Hà",
			"HUYENTUNGHIA": "Huyện Tư Nghĩa",
			"HUYENNGHIAHANH": "Huyện Nghĩa Hành",
			"HUYENMINHLONG": "Huyện Minh Long",
			"HUYENMODUC": "Huyện Mộ Đức",
			"HUYENDUCPHO": "Huyện Đức Phổ",
			"HUYENBATO": "Huyện Ba Tơ",
			"HUYENSONTAY": "Huyện Sơn Tây",
			"HUYENTAYTRA": "Huyện Tây Trà",
			"QUANGNGAIKHAC": "Quận/Huyện khác"
		}
	},
	"KONTUM": {
		"name": "Tỉnh Kon Tum",
		"cities": {
			"THANHPHOKONTUM": "Thành phố Kon Tum",
			"HUYENDAKGLEI": "Huyện Đăk Glei",
			"HUYENNGOCHOI": "Huyện Ngọc Hồi",
			"HUYENDAKTO": "Huyện Đăk Tô",
			"HUYENSATHAY": "Huyện Sa Thầy",
			"HUYENKONPLONG": "Huyện Kon Plông",
			"HUYENDAKHA": "Huyện Đăk Hà",
			"HUYENKONRAY": "Huyện Kon Rẫy",
			"HUYENTUMORONG": "Huyện Tu Mơ Rông",
			"KONTUMKHAC": "Quận/Huyện khác"
		}
	},
	"BINHDINH": {
		"name": "Tỉnh Bình Định",
		"cities": {
			"THANHPHOQUYNHON": "Thành phố Quy Nhơn",
			"HUYENANLAO": "Huyện An Lão",
			"HUYENHOAIAN": "Huyện Hoài Ân",
			"HUYENHOAINHON": "Huyện Hoài Nhơn",
			"HUYENPHUMY": "Huyện Phù Mỹ",
			"HUYENPHUCAT": "Huyện Phù Cát",
			"HUYENVINHTHANH": "Huyện Vĩnh Thạnh",
			"HUYENTAYSON": "Huyện Tây Sơn",
			"HUYENVANCANH": "Huyện Vân Canh",
			"THIXAANNHON": "Thị xã An Nhơn",
			"HUYENTUYPHUOC": "Huyện Tuy Phước",
			"BINHDINHKHAC": "Quận/Huyện khác"
		}
	},
	"GIALAI": {
		"name": "Tỉnh Gia Lai",
		"cities": {
			"THANHPHOPLEIKU": "Thành phố Pleiku",
			"HUYENCHUPAH": "Huyện Chư Păh",
			"HUYENMANGYANG": "Huyện Mang Yang",
			"HUYENKBANG": "Huyện Kbang",
			"THIXAANKHE": "Thị xã An Khê",
			"HUYENKONGCHRO": "Huyện Kông Chro",
			"HUYENDUCCO": "Huyện Đức Cơ",
			"HUYENCHUPRONG": "Huyện Chư Prông",
			"HUYENCHUSE": "Huyện Chư Sê",
			"THIXAAYUNPA": "Thị xã Ayun Pa",
			"HUYENKRONGPA": "Huyện Krông Pa",
			"HUYENIAGRAI": "Huyện Ia Grai",
			"HUYENDAKDOA": "Huyện Đak Đoa",
			"HUYENIAPA": "Huyện Ia Pa",
			"HUYENDAKPO": "Huyện Đak Pơ",
			"HUYENPHUTHIEN": "Huyện Phú Thiện",
			"HUYENCHUPUH": "Huyện Chư Pưh",
			"GIALAIKHAC": "Quận/Huyện khác"
		}
	},
	"PHUYEN": {
		"name": "Tỉnh Phú Yên",
		"cities": {
			"THANHPHOTUYHOA": "Thành phố Tuy Hòa",
			"HUYENDONGXUAN": "Huyện Đồng Xuân",
			"THIXASONGCAU": "Thị Xã Sông Cầu",
			"HUYENTUYAN": "Huyện Tuy An",
			"HUYENSONHOA": "Huyện Sơn Hòa",
			"HUYENSONGHINH": "Huyện Sông Hinh",
			"HUYENDONGHOA": "Huyện Đông Hòa",
			"HUYENPHUHOA": "Huyện Phú Hòa",
			"HUYENTAYHOA": "Huyện Tây Hòa",
			"PHUYENKHAC": "Quận/Huyện khác"
		}
	},
	"DAKLAK": {
		"name": "Tỉnh Đăk Lăk",
		"cities": {
			"THANHPHOBUONMATHUOT": "Thành phố Buôn Ma Thuột",
			"HUYENEAHLEO": "Huyện Ea H Leo",
			"HUYENKRONGBUK": "Huyện Krông Buk",
			"HUYENKRONGNANG": "Huyện Krông Năng",
			"HUYENEASUP": "Huyện Ea Súp",
			"HUYENCUMGAR": "Huyện Cư Mgar",
			"HUYENKRONGPAC": "Huyện Krông Pắc",
			"HUYENEAKAR": "Huyện Ea Kar",
			"HUYENMDRAK": "Huyện M Đrăk",
			"HUYENKRONGANA": "Huyện Krông Ana",
			"HUYENKRONGBONG": "Huyện Krông Bông",
			"HUYENLAK": "Huyện Lăk",
			"HUYENBUONDON": "Huyện Buôn Đôn",
			"HUYENCUKUIN": "Huyện Cư Kuin",
			"THIXABUONHO": "Thị Xã Buôn Hồ",
			"DAKLAKKHAC": "Quận/Huyện khác"
		}
	},
	"KHANHHOA": {
		"name": "Tỉnh Khánh Hòa",
		"cities": {
			"THANHPHONHATRANG": "Thành phố Nha Trang",
			"HUYENVANNINH": "Huyện Vạn Ninh",
			"HUYENNINHHOA": "Huyện Ninh Hoà",
			"HUYENDIENKHANH": "Huyện Diên Khánh",
			"HUYENKHANHVINH": "Huyện Khánh Vĩnh",
			"THIXACAMRANH": "Thị xã Cam Ranh",
			"HUYENKHANHSON": "Huyện Khánh Sơn",
			"HUYENDAOTRUONGSA": "Huyện đảo Trường Sa",
			"HUYENCAMLAM": "Huyện Cam Lâm",
			"KHANHHOAKHAC": "Quận/Huyện khác"
		}
	},
	"LAMDONG": {
		"name": "Tỉnh Lâm Đồng",
		"cities": {
			"THANHPHODALAT": "Thành phố Đà Lạt",
			"THANHPHOBAOLOC": "Thành phố Bảo Lộc",
			"HUYENDUCTRONG": "Huyện Đức Trọng",
			"HUYENDILINH": "Huyện Di Linh",
			"HUYENDONDUONG": "Huyện Đơn Dương",
			"HUYENLACDUONG": "Huyện Lạc Dương",
			"HUYENDAHUOAI": "Huyện Đạ Huoai",
			"HUYENDATEH": "Huyện Đạ Tẻh",
			"HUYENCATTIEN": "Huyện Cát Tiên",
			"HUYENLAMHA": "Huyện Lâm Hà",
			"HUYENBAOLAM": "Huyện Bảo Lâm",
			"HUYENDAMRONG": "Huyện Đam Rông",
			"LAMDONGKHAC": "Quận/Huyện khác"
		}
	},
	"BINHPHUOC": {
		"name": "Bình Phước",
		"cities": {
			"THIXADONGXOAI": "Thị xã Đồng Xoài",
			"HUYENDONGPHU": "Huyện Đồng Phú",
			"HUYENCHONTHANH": "Huyện Chơn Thành",
			"HUYENBINHLONG": "Huyện Bình Long",
			"HUYENLOCNINH": "Huyện Lộc Ninh",
			"HUYENBUDOP": "Huyện Bù Đốp",
			"HUYENPHUOCLONG": "Huyện Phước Long",
			"HUYENBUDANG": "Huyện Bù Đăng",
			"HUYENHONQUAN": "Huyện Hớn Quản",
			"HUYENBUGIAMAP": "Huyện Bù Gia Mập",
			"BINHPHUOCKHAC": "Quận/Huyện khác"
		}
	},
	"BINHDUONG": {
		"name": "Tỉnh Bình Dương",
		"cities": {
			"THPHOTHUDAUMOT": "Th. phố Thủ Dầu Một",
			"HUYENBENCAT": "Huyện Bến Cát",
			"HUYENTANUYEN": "Huyện Tân Uyên",
			"THIXATHUANAN": "Thị xã Thuận An",
			"THIXADIAN": "Thị xã Dĩ An",
			"HUYENPHUGIAO": "Huyện Phú Giáo",
			"HUYENDAUTIENG": "Huyện Dầu Tiếng",
			"BINHDUONGKHAC": "Quận/Huyện khác"
		}
	},
	"NINHTHUAN": {
		"name": "Tỉnh Ninh Thuận",
		"cities": {
			"THANHPHOPHANRANGTHAPCHAM": "Thành phố Phan Rang -Tháp Chàm",
			"HUYENNINHSON": "Huyện Ninh Sơn",
			"HUYENNINHHAI": "Huyện Ninh Hải",
			"HUYENNINHPHUOC": "Huyện Ninh Phước",
			"HUYENBACAI": "Huyện Bác Ái",
			"HUYENTHUANBAC": "Huyện Thuận Bắc",
			"HUYENTHUANNAM": "Huyện Thuận Nam",
			"NINHTHUANKHAC": "Quận/Huyện khác"
		}
	},
	"TAYNINH": {
		"name": "Tỉnh Tây Ninh",
		"cities": {
			"THIXATAYNINH": "Thị xã Tây Ninh",
			"HUYENTANBIEN": "Huyện Tân Biên",
			"HUYENTANCHAU": "Huyện Tân Châu",
			"HUYENDUONGMINHCHAU": "Huyện Dương Minh Châu",
			"HUYENCHAUTHANH": "Huyện Châu Thành",
			"HUYENHOATHANH": "Huyện Hòa Thành",
			"HUYENBENCAU": "Huyện Bến Cầu",
			"HUYENGODAU": "Huyện Gò Dầu",
			"HUYENTRANGBANG": "Huyện Trảng Bàng",
			"TAYNINHKHAC": "Quận/Huyện khác"
		}
	},
	"BINHTHUAN": {
		"name": "Tỉnh Bình Thuận",
		"cities": {
			"THANHPHOPHANTHIET": "Thành phố Phan Thiết",
			"HUYENTUYPHONG": "Huyện Tuy Phong",
			"HUYENBACBINH": "Huyện Bắc Bình",
			"HUYENHAMTHUANBAC": "Huyện Hàm Thuận Bắc",
			"HUYENHAMTHUANNAM": "Huyện Hàm Thuận Nam",
			"HUYENHAMTAN": "Huyện Hàm Tân",
			"HUYENDUCLINH": "Huyện Đức Linh",
			"HUYENTANHLINH": "Huyện Tánh Linh",
			"HUYENDAOPHUQUY": "Huyện đảo Phú Quý",
			"THIXALAGI": "Thị xã La Gi",
			"BINHTHUANKHAC": "Quận/Huyện khác"
		}
	},
	"DONGNAI": {
		"name": "Tỉnh Đồng Nai",
		"cities": {
			"THANHPHOBIENHOA": "Thành phố Biên Hoà",
			"HUYENVINHCUU": "Huyện Vĩnh Cửu",
			"HUYENTANPHU": "Huyện Tân Phú",
			"HUYENDINHQUAN": "Huyện Định Quán",
			"HUYENTHONGNHAT": "Huyện Thống Nhất",
			"THIXALONGKHANH": "Thị xã Long Khánh",
			"HUYENXUANLOC": "Huyện Xuân Lộc",
			"HUYENLONGTHANH": "Huyện Long Thành",
			"HUYENNHONTRACH": "Huyện Nhơn Trạch",
			"HUYENTRANGBOM": "Huyện Trảng Bom",
			"HUYENCAMMY": "Huyện Cẩm Mỹ",
			"DONGNAIKHAC": "Quận/Huyện khác"
		}
	},
	"LONGAN": {
		"name": "Tỉnh Long An",
		"cities": {
			"THANHPHOTANAN": "Thành phố Tân An",
			"HUYENVINHHUNG": "Huyện Vĩnh Hưng",
			"HUYENMOCHOA": "Huyện Mộc Hoá",
			"HUYENTANTHANH": "Huyện Tân Thạnh",
			"HUYENTHANHHOA": "Huyện Thạnh Hoá",
			"HUYENDUCHUE": "Huyện Đức Huệ",
			"HUYENDUCHOA": "Huyện Đức Hoà",
			"HUYENBENLUC": "Huyện Bến Lức",
			"HUYENTHUTHUA": "Huyện Thủ Thừa",
			"HUYENCHAUTHANH": "Huyện Châu Thành",
			"HUYENTANTRU": "Huyện Tân Trụ",
			"HUYENCANDUOC": "Huyện Cần Đước",
			"HUYENCANGIUOC": "Huyện Cần Giuộc",
			"HUYENTANHUNG": "Huyện Tân Hưng",
			"THIXAKIENTUONG": "Thị xã Kiến Tường",
			"LONGANKHAC": "Quận/Huyện khác"
		}
	},
	"DONGTHAP": {
		"name": "Tỉnh Đồng Tháp",
		"cities": {
			"THANHPHOCAOLANH": "Thành phố Cao Lãnh",
			"THANHPHOSADEC": "Thành phố Sa Đéc",
			"HUYENTANHONG": "Huyện Tân Hồng",
			"HUYENHONGNGU": "Huyện Hồng Ngự",
			"HUYENTAMNONG": "Huyện Tam Nông",
			"HUYENTHANHBINH": "Huyện Thanh Bình",
			"HUYENCAOLANH": "Huyện Cao Lãnh",
			"HUYENLAPVO": "Huyện Lấp Vò",
			"HUYENTHAPMUOI": "Huyện Tháp Mười",
			"HUYENLAIVUNG": "Huyện Lai Vung",
			"HUYENCHAUTHANH": "Huyện Châu Thành",
			"THIXAHONGNGU": "Thị Xã Hồng Ngự",
			"DONGTHAPKHAC": "Quận/Huyện khác"
		}
	},
	"ANGIANG": {
		"name": "Tỉnh An Giang",
		"cities": {
			"THANHPHOLONGXUYEN": "Thành phố Long Xuyên",
			"THIXACHAUDOC": "Thị xã Châu Đốc",
			"HUYENANPHU": "Huyện An Phú",
			"HUYENTANCHAU": "Huyện Tân Châu",
			"HUYENPHUTAN": "Huyện Phú Tân",
			"HUYENTINHBIEN": "Huyện Tịnh Biên",
			"HUYENTRITON": "Huyện Tri Tôn",
			"HUYENCHAUPHU": "Huyện Châu Phú",
			"HUYENCHOMOI": "Huyện Chợ Mới",
			"HUYENCHAUTHANH": "Huyện Châu Thành",
			"HUYENTHOAISON": "Huyện Thoại Sơn",
			"ANGIANGKHAC": "Quận/Huyện khác"
		}
	},
	"BARIAVUNGTAU": {
		"name": "Tỉnh Bà Rịa Vũng Tàu",
		"cities": {
			"THANHPHOVUNGTAU": "Thành phố Vũng Tàu",
			"THANHPHOBARIA": "Thành phố Bà Rịa",
			"HUYENXUYENMOC": "Huyện Xuyên Mộc",
			"HUYENLONGDIEN": "Huyện Long Điền",
			"HUYENCONDAO": "Huyện Côn Đảo",
			"HUYENTANTHANH": "Huyện Tân Thành",
			"HUYENCHAUDUC": "Huyện Châu Đức",
			"HUYENDATDO": "Huyện Đất Đỏ",
			"BARIAVUNGTAUKHAC": "Quận/Huyện khác"
		}
	},
	"TIENGIANG": {
		"name": "Tỉnh Tiền Giang",
		"cities": {
			"THANHPHOMYTHO": "Thành phố Mỹ Tho",
			"THIXAGOCONG": "Thị xã Gò Công",
			"HUYENCAIBE": "Huyện Cái bè",
			"HUYENCAILAY": "Huyện Cai lậy",
			"HUYENCHAUTHANH": "Huyện Châu thành",
			"HUYENCHOGAO": "Huyện Chợ Gạo",
			"HUYENGOCONGTAY": "Huyện Gò Công Tây",
			"HUYENGOCONGDONG": "Huyện Gò Công Đông",
			"HUYENTANPHUOC": "Huyện Tân Phước",
			"HUYENTANPHUDONG": "Huyện Tân Phú Đông",
			"TIENGIANGKHAC": "Quận/Huyện khác"
		}
	},
	"KIENGIANG": {
		"name": "Tỉnh Kiên Giang",
		"cities": {
			"THANHPHORACHGIA": "Thành phố Rạch Giá",
			"THIXAHATIEN": "Thị xã Hà Tiên",
			"HUYENKIENLUONG": "Huyện Kiên Lương",
			"HUYENHONDAT": "Huyện Hòn Đất",
			"HUYENTANHIEP": "Huyện Tân Hiệp",
			"HUYENCHAUTHANH": "Huyện Châu Thành",
			"HUYENGIONGRIENG": "Huyện Giồng Riềng",
			"HUYENGOQUAO": "Huyện Gò Quao",
			"HUYENANBIEN": "Huyện An Biên",
			"HUYENANMINH": "Huyện An Minh",
			"HUYENVINHTHUAN": "Huyện Vĩnh Thuận",
			"HUYENPHUQUOC": "Huyện Phú Quốc",
			"HUYENKIENHAI": "Huyện Kiên Hải",
			"HUYENUMINHTHUONG": "Huyện U Minh Thượng",
			"HUYENGIANGTHANH": "Huyện Giang Thành",
			"KIENGIANGKHAC": "Quận/Huyện khác"
		}
	},
	"TRAVINH": {
		"name": "Tỉnh Trà Vinh",
		"cities": {
			"THANHPHOTRAVINH": "Thành phố Trà Vinh",
			"HUYENCANGLONG": "Huyện Càng Long",
			"HUYENCAUKE": "Huyện Cầu Kè",
			"HUYENTIEUCAN": "Huyện Tiểu Cần",
			"HUYENCHAUTHANH": "Huyện Châu Thành",
			"HUYENTRACU": "Huyện Trà Cú",
			"HUYENCAUNGANG": "Huyện Cầu Ngang",
			"HUYENDUYENHAI": "Huyện Duyên Hải",
			"TRAVINHKHAC": "Quận/Huyện khác"
		}
	},
	"BENTRE": {
		"name": "Tỉnh Bến Tre",
		"cities": {
			"THANHPHOBENTRE": "Thành phố Bến Tre",
			"HUYENCHAUTHANH": "Huyện Châu Thành",
			"HUYENCHOLACH": "Huyện Chợ Lách",
			"HUYENMOCAYBAC": "Huyện Mỏ Cày Bắc",
			"HUYENGIONGTROM": "Huyện Giồng Trôm",
			"HUYENBINHDAI": "Huyện Bình Đại",
			"HUYENBATRI": "Huyện Ba Tri",
			"HUYENTHANHPHU": "Huyện Thạnh Phú",
			"HUYENMOCAYNAM": "Huyện Mỏ Cày Nam",
			"BENTREKHAC": "Quận/Huyện khác"
		}
	},
	"VINHLONG": {
		"name": "Tỉnh Vĩnh Long",
		"cities": {
			"THANHPHOVINHLONG": "Thành phố Vĩnh Long",
			"HUYENLONGHO": "Huyện Long Hồ",
			"HUYENMANGTHIT": "Huyện Mang Thít",
			"THIXABINHMINH": "Thị xã Bình Minh",
			"HUYENTAMBINH": "Huyện Tam Bình",
			"HUYENTRAON": "Huyện Trà Ôn",
			"HUYENVUNGLIEM": "Huyện Vũng Liêm",
			"HUYENBINHTAN": "Huyện Bình Tân",
			"VINHLONGKHAC": "Quận/Huyện khác"
		}
	},
	"SOCTRANG": {
		"name": "Tỉnh Sóc Trăng",
		"cities": {
			"THANHPHOSOCTRANG": "Thành phố Sóc Trăng",
			"HUYENKESACH": "Huyện Kế Sách",
			"HUYENMYTU": "Huyện Mỹ Tú",
			"HUYENMYXUYEN": "Huyện Mỹ Xuyên",
			"HUYENTHANHTRI": "Huyện Thạnh Trị",
			"HUYENLONGPHU": "Huyện Long Phú",
			"THIXAVINHCHAU": "Thị xã Vĩnh Châu",
			"HUYENCULAODUNG": "Huyện Cù Lao Dung",
			"HUYENNGANAM": "Huyện Ngã Năm",
			"HUYENCHAUTHANH": "Huyện Châu Thành",
			"HUYENTRANDE": "Huyện Trần Đề",
			"SOCTRANGKHAC": "Quận/Huyện khác"
		}
	},
	"BACLIEU": {
		"name": "Tỉnh Bạc Liêu",
		"cities": {
			"THANHPHOBACLIEU": "Thành phố Bạc Liêu",
			"HUYENVINHLOI": "Huyện Vĩnh Lợi",
			"HUYENHONGDAN": "Huyện Hồng Dân",
			"HUYENGIARAI": "Huyện Giá Rai",
			"HUYENPHUOCLONG": "Huyện Phước Long",
			"HUYENDONGHAI": "Huyện Đông Hải",
			"HUYENHOABINH": "Huyện Hoà Bình",
			"BACLIEUKHAC": "Quận/Huyện khác"
		}
	},
	"CAMAU": {
		"name": "Tỉnh Cà Mau",
		"cities": {
			"THANHPHOCAMAU": "Thành phố Cà Mau",
			"HUYENTHOIBINH": "Huyện Thới Bình",
			"HUYENUMINH": "Huyện U Minh",
			"HUYENTRANVANTHOI": "Huyện Trần Văn Thời",
			"HUYENCAINUOC": "Huyện Cái Nước",
			"HUYENDAMDOI": "Huyện Đầm Dơi",
			"HUYENNGOCHIEN": "Huyện Ngọc Hiển",
			"HUYENNAMCAN": "Huyện Năm Căn",
			"HUYENPHUTAN": "Huyện Phú Tân",
			"CAMAUKHAC": "Quận/Huyện khác"
		}
	},
	"DIENBIEN": {
		"name": "Tỉnh Điện Biên",
		"cities": {
			"TP.DIENBIENPHU": "TP. Điện Biên Phủ",
			"THIXAMUONGLAY": "Thị xã Mường Lay",
			"HUYENDIENBIEN": "Huyện Điện Biên",
			"HUYENTUANGIAO": "Huyện Tuần Giáo",
			"HUYENMUONGCHA": "Huyện Mường Chà",
			"HUYENTUACHUA": "Huyện Tủa Chùa",
			"HUYENDIENBIENDONG": "Huyện Điện Biên Đông",
			"HUYENMUONGNHE": "Huyện Mường Nhé",
			"HUYENMUONGANG": "Huyện Mường Ảng",
			"DIENBIENKHAC": "Quận/Huyện khác"
		}
	},
	"DAKNONG": {
		"name": "Tỉnh Đắk Nông",
		"cities": {
			"THIXAGIANGHIA": "Thị xã Gia Nghĩa",
			"HUYENDAKRLAP": "Huyện Đăk RLấp",
			"HUYENDAKMIL": "Huyện Đăk Mil",
			"HUYENCUJUT": "Huyện Cư Jút",
			"HUYENDAKSONG": "Huyện Đăk Song",
			"HUYENKRONGNO": "Huyện Krông Nô",
			"HUYENDAKGLONG": "Huyện Đăk GLong",
			"HUYENTUYDUC": "Huyện Tuy Đức",
			"DAKNONGKHAC": "Quận/Huyện khác"
		}
	},
	"HAUGIANG": {
		"name": "Tỉnh Hậu Giang",
		"cities": {
			"THANHPHOVITHANH": "Thành phố Vị Thanh",
			"HUYENVITHUY": "Huyện Vị Thuỷ",
			"HUYENLONGMY": "Huyện Long Mỹ",
			"HUYENPHUNGHIEP": "Huyện Phụng Hiệp",
			"HUYENCHAUTHANH": "Huyện Châu Thành",
			"HUYENCHAUTHANHA": "Huyện Châu Thành A",
			"THIXANGABAY": "Thị xã Ngã Bảy",
			"HAUGIANGKHAC": "Quận/Huyện khác"
		}
	}
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(35);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window && typeof window.process !== 'undefined' && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document && 'WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window && window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  try {
    return exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (typeof process !== 'undefined' && 'env' in process) {
    return process.env.DEBUG;
  }
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripSlashes = stripSlashes;
exports.each = each;
exports.some = some;
exports.every = every;
exports.keys = keys;
exports.values = values;
exports.isMatch = isMatch;
exports.isEmpty = isEmpty;
exports.isObject = isObject;
exports.extend = extend;
exports.omit = omit;
exports.pick = pick;
exports.merge = merge;
exports.select = select;
exports.matcher = matcher;
exports.sorter = sorter;
exports.makeUrl = makeUrl;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function stripSlashes(name) {
  return name.replace(/^(\/*)|(\/*)$/g, '');
}

function each(obj, callback) {
  if (obj && typeof obj.forEach === 'function') {
    obj.forEach(callback);
  } else if (isObject(obj)) {
    Object.keys(obj).forEach(function (key) {
      return callback(obj[key], key);
    });
  }
}

function some(value, callback) {
  return Object.keys(value).map(function (key) {
    return [value[key], key];
  }).some(function (current) {
    return callback.apply(undefined, _toConsumableArray(current));
  });
}

function every(value, callback) {
  return Object.keys(value).map(function (key) {
    return [value[key], key];
  }).every(function (current) {
    return callback.apply(undefined, _toConsumableArray(current));
  });
}

function keys(obj) {
  return Object.keys(obj);
}

function values(obj) {
  return _.keys(obj).map(function (key) {
    return obj[key];
  });
}

function isMatch(obj, item) {
  return _.keys(item).every(function (key) {
    return obj[key] === item[key];
  });
}

function isEmpty(obj) {
  return _.keys(obj).length === 0;
}

function isObject(item) {
  return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
}

function extend() {
  return _extends.apply(undefined, arguments);
}

function omit(obj) {
  var result = _.extend({}, obj);

  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  keys.forEach(function (key) {
    return delete result[key];
  });
  return result;
}

function pick(source) {
  var result = {};

  for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    keys[_key2 - 1] = arguments[_key2];
  }

  keys.forEach(function (key) {
    result[key] = source[key];
  });
  return result;
}

function merge(target, source) {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(function (key) {
      if (isObject(source[key])) {
        if (!target[key]) _extends(target, _defineProperty({}, key, {}));
        merge(target[key], source[key]);
      } else {
        _extends(target, _defineProperty({}, key, source[key]));
      }
    });
  }
  return target;
}

var _ = exports._ = {
  each: each,
  some: some,
  every: every,
  keys: keys,
  values: values,
  isMatch: isMatch,
  isEmpty: isEmpty,
  isObject: isObject,
  extend: extend,
  omit: omit,
  pick: pick,
  merge: merge
};

var specialFilters = exports.specialFilters = {
  $in: function $in(key, ins) {
    return function (current) {
      return ins.indexOf(current[key]) !== -1;
    };
  },
  $nin: function $nin(key, nins) {
    return function (current) {
      return nins.indexOf(current[key]) === -1;
    };
  },
  $lt: function $lt(key, value) {
    return function (current) {
      return current[key] < value;
    };
  },
  $lte: function $lte(key, value) {
    return function (current) {
      return current[key] <= value;
    };
  },
  $gt: function $gt(key, value) {
    return function (current) {
      return current[key] > value;
    };
  },
  $gte: function $gte(key, value) {
    return function (current) {
      return current[key] >= value;
    };
  },
  $ne: function $ne(key, value) {
    return function (current) {
      return current[key] !== value;
    };
  }
};

function select(params) {
  var fields = params && params.query && params.query.$select;

  for (var _len3 = arguments.length, otherFields = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    otherFields[_key3 - 1] = arguments[_key3];
  }

  if (Array.isArray(fields) && otherFields.length) {
    fields.push.apply(fields, otherFields);
  }

  var convert = function convert(result) {
    if (!Array.isArray(fields)) {
      return result;
    }

    return _.pick.apply(_, [result].concat(_toConsumableArray(fields)));
  };

  return function (result) {
    if (Array.isArray(result)) {
      return result.map(convert);
    }

    return convert(result);
  };
}

function matcher(originalQuery) {
  var query = _.omit(originalQuery, '$limit', '$skip', '$sort', '$select');

  return function (item) {
    if (query.$or && _.some(query.$or, function (or) {
      return matcher(or)(item);
    })) {
      return true;
    }

    return _.every(query, function (value, key) {
      if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        return _.every(value, function (target, filterType) {
          if (specialFilters[filterType]) {
            var filter = specialFilters[filterType](key, target);
            return filter(item);
          }

          return false;
        });
      } else if (typeof item[key] !== 'undefined') {
        return item[key] === query[key];
      }

      return false;
    });
  };
}

function sorter($sort) {
  return function (first, second) {
    var comparator = 0;
    each($sort, function (modifier, key) {
      modifier = parseInt(modifier, 10);

      if (first[key] < second[key]) {
        comparator -= 1 * modifier;
      }

      if (first[key] > second[key]) {
        comparator += 1 * modifier;
      }
    });
    return comparator;
  };
}

function makeUrl(path) {
  var app = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var get = typeof app.get === 'function' ? app.get.bind(app) : function () {};
  var env = get('env') || process.env.NODE_ENV;
  var host = get('host') || process.env.HOST_NAME || 'localhost';
  var protocol = env === 'development' || env === 'test' || env === undefined ? 'http' : 'https';
  var PORT = get('port') || process.env.PORT || 3030;
  var port = env === 'development' || env === 'test' || env === undefined ? ':' + PORT : '';

  path = path || '';

  return protocol + '://' + host + port + '/' + stripSlashes(path);
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lowerCase = lowerCase;
exports.removeQuery = removeQuery;
exports.pluckQuery = pluckQuery;
exports.remove = remove;
exports.pluck = pluck;
exports.disable = disable;
exports.legacyPopulate = legacyPopulate;

var _utils = __webpack_require__(13);

/* eslint-env es6, node */
/* eslint brace-style: 0, consistent-return: 0, no-console: 0, no-param-reassign: 0, no-var: 0 */

var errors = __webpack_require__(4).errors;


/**
 * Lowercase the given fields either in the data submitted (as a before hook for create,
 * update or patch) or in the result (as an after hook). If the data is an array or
 * a paginated find result the hook will lowercase the field for every item.
 *
 * @param {Array.<string|Function>} fields - Field names to lowercase. Dot notation is supported.
 * @returns {Function} hook function(hook).
 *
 * DEPRECATED: The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 */
function lowerCase() {
  for (var _len = arguments.length, fields = Array(_len), _key = 0; _key < _len; _key++) {
    fields[_key] = arguments[_key];
  }

  var lowerCaseFields = function lowerCaseFields(data) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var field = _step.value;

        var value = (0, _utils.getByDot)(data, field);

        if (value !== undefined) {
          if (typeof value !== 'string' && value !== null) {
            throw new errors.BadRequest('Expected string data. (lowercase ' + field + ')');
          }

          (0, _utils.setByDot)(data, field, value ? value.toLowerCase() : value);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  var callback = function callback() {
    return true;
  };
  if (typeof fields[fields.length - 1] === 'function') {
    callback = fields.pop();
    console.error('DEPRECATED Predicate func will be removed next version. (lowerCase)');
  }

  return function (hook) {
    var items = hook.type === 'before' ? hook.data : hook.result;

    var update = function update(condition) {
      if (items && condition) {
        if (hook.method === 'find' || Array.isArray(items)) {
          // data.data if the find method is paginated
          (items.data || items).forEach(lowerCaseFields);
        } else {
          lowerCaseFields(items);
        }
      }
      return hook;
    };

    var check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Remove the given fields from the query params.
 * Can be used as a before hook for any service method.
 *
 * @param {Array.<string|Function>} fields - Field names to remove. Dot notation is supported.
 * @returns {Function} hook function(hook)
 *
 * DEPRECATED: The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 */
function removeQuery() {
  for (var _len2 = arguments.length, fields = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fields[_key2] = arguments[_key2];
  }

  var removeQueries = function removeQueries(data) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = fields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var field = _step2.value;

        var value = (0, _utils.getByDot)(data, field); // prevent setByDot creating nested empty objects
        if (value !== undefined) {
          (0, _utils.setByDot)(data, field, undefined, true);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  };

  var callback = function callback() {
    return true;
  };
  if (typeof fields[fields.length - 1] === 'function') {
    callback = fields.pop();
    console.error('DEPRECATED Predicate func will be removed next version. (removeQuery)');
  }

  return function (hook) {
    if (hook.type === 'after') {
      var provider = hook.params.provider || 'server';
      throw new errors.GeneralError('Provider \'' + provider + '\' cannot remove query params on after hook. (removeQuery)');
    }
    var result = hook.params.query;
    var update = function update(condition) {
      if (result && condition) {
        removeQueries(result);
      }
      return hook;
    };

    var check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Discard all other fields except for the given fields from the query params.
 * Can be used as a before hook for any service method.
 *
 * @param {Array.<string|Function>} fields - Field names to retain. Dot notation is supported.
 * @returns {Function} hook function(hook)
 *
 * DEPRECATED: The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 */
function pluckQuery() {
  for (var _len3 = arguments.length, fields = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    fields[_key3] = arguments[_key3];
  }

  var pluckQueries = function pluckQueries(data) {
    var plucked = {};

    fields.forEach(function (field) {
      var value = (0, _utils.getByDot)(data, field); // prevent setByDot creating nested empty objects
      if (value !== undefined) {
        (0, _utils.setByDot)(plucked, field, value);
      }
    });

    return plucked;
  };

  var callback = function callback() {
    return true;
  };
  if (typeof fields[fields.length - 1] === 'function') {
    callback = fields.pop();
    console.error('DEPRECATED Predicate func will be removed next version. (pluckQuery)');
  }

  return function (hook) {
    if (hook.type === 'after') {
      throw new errors.GeneralError('Provider \'' + hook.params.provider + '\' can not pluck query params on after hook. (pluckQuery)');
    }
    var result = hook.params.query;
    var update = function update(condition) {
      if (result && condition) {
        hook.params.query = pluckQueries(result);
      }
      return hook;
    };

    var check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Remove the given fields either from the data submitted (as a before hook for create,
 * update or patch) or from the result (as an after hook). If the data is an array or
 * a paginated find result the hook will remove the field for every item.
 *
 * @param {Array.<string|Function>} fields - Field names to remove. Dot notation is supported.
 * @returns {Function} hook function(hook)
 *
 * The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 * The items are only updated for external requests, e.g. hook.params.provider is rest or socketio,
 * or if the decision function mentioned above returns true.
 */
function remove() {
  for (var _len4 = arguments.length, fields = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    fields[_key4] = arguments[_key4];
  }

  var removeFields = function removeFields(data) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = fields[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var field = _step3.value;

        var value = (0, _utils.getByDot)(data, field);
        if (value !== undefined) {
          // prevent setByDot creating nested empty objects
          (0, _utils.setByDot)(data, field, undefined, true);
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  };

  // when deprecating, remember hook should not run if called from server
  var callback = function callback(hook) {
    return !!hook.params.provider;
  }; // important condition
  if (typeof fields[fields.length - 1] === 'function') {
    callback = fields.pop();
  }

  return function (hook) {
    var result = hook.type === 'before' ? hook.data : hook.result;
    var update = function update(condition) {
      if (result && condition) {
        if (Array.isArray(result)) {
          result.forEach(removeFields);
        } else {
          removeFields(result);

          if (result.data) {
            if (Array.isArray(result.data)) {
              result.data.forEach(removeFields);
            } else {
              removeFields(result.data);
            }
          }
        }
      }
      return hook;
    };

    var check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Discard all other fields except for the provided fields either from the data submitted
 * (as a before hook for create, update or patch) or from the result (as an after hook).
 * If the data is an array or a paginated find result the hook will remove the field for every item.
 *
 * @param {Array.<string|Function>} fields - Field names to remove. Dot notation is supported.
 * @returns {Function} hook function(hook)
 *
 * DEPRECATED: The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 * The items are only updated for external requests, e.g. hook.params.provider is rest or socketio,
 * or if the decision function mentioned above returns true.
 */
function pluck() {
  for (var _len5 = arguments.length, fields = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    fields[_key5] = arguments[_key5];
  }

  var pluckFields = function pluckFields(data) {
    var plucked = {};

    fields.forEach(function (field) {
      var value = (0, _utils.getByDot)(data, field);
      if (value !== undefined) {
        // prevent setByDot creating nested empty objects
        (0, _utils.setByDot)(plucked, field, value);
      }
    });

    return plucked;
  };

  // when deprecating, remember hook should not run if called from server
  var callback = function callback(hook) {
    return !!hook.params.provider;
  };
  if (typeof fields[fields.length - 1] === 'function') {
    callback = fields.pop();
    console.error('DEPRECATED Predicate func will be removed next version. (pluck)');
  }

  return function (hook) {
    var update = function update(condition) {
      if (condition) {
        var items = (0, _utils.getItems)(hook);

        if (items) {
          if (Array.isArray(items)) {
            (0, _utils.replaceItems)(hook, items.map(pluckFields));
          } else {
            (0, _utils.replaceItems)(hook, pluckFields(items));
          }
        }
      }

      return hook;
    };

    var check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Disable access to a service method completely, for a specific provider,
 * or for a custom condition.
 *
 * @param {string|function} [realm] - Provider, or function(hook):boolean|Promise
 *    The first provider or the custom condition.
 *    null = disable completely,
 *    'external' = disable external access,
 *    string = disable that provider e.g. 'rest',
 *    func(hook) = returns boolean or promise resolving to a boolean. false = disable access.
 * @param {string|string[]} [args] - Additional provider names.
 * @returns {Function} hook function(hook)
 *
 * The function may be invoked with
 * - no param, or with undefined or null. All providers are disallowed, even the server.
 * - multiple params of provider names, e.g. rest, socketio. They are all disabled.
 * - 'external'. All client interfaces are disabled.
 * - a function whose signature is func(hook). It returns either a boolean or a promise which
 * resolves to a boolean. If false, the operation is disabled. This is the only way to disable
 * calls from the server.
 */
function disable(realm) {
  if (!realm) {
    return function (hook) {
      throw new errors.MethodNotAllowed('Calling \'' + hook.method + '\' not allowed. (disable)');
    };
  }

  if (typeof realm === 'function') {
    return function (hook) {
      var result = realm(hook);
      var update = function update(check) {
        if (!check) {
          throw new errors.MethodNotAllowed('Calling \'' + hook.method + '\' not allowed. (disable)');
        }
      };

      if (result && typeof result.then === 'function') {
        return result.then(update);
      }

      update(result);
    };
  }

  for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    args[_key6 - 1] = arguments[_key6];
  }

  var providers = [realm].concat(args);

  return function (hook) {
    var provider = hook.params.provider;

    if (realm === 'external' && provider || providers.indexOf(provider) !== -1) {
      throw new errors.MethodNotAllowed('Provider \'' + hook.params.provider + '\' can not call \'' + hook.method + '\'. (disable)\'');
    }
  };
}

/**
 * The populate hook uses a property from the result (or every item if it is a list)
 * to retrieve a single related object from a service and add it to the original object.
 * It is meant to be used as an after hook on any service method.
 *
 * @param {string} target - The prop name to contain the populated item or array of populated items.
 *    This is also the default for options.field if that is not specified.
 * @param {Object} options - options
 *    For a mongoose model, these are the options for item.toObject().
 *    For a Sequelize model, these are the options for item.toJSON().
 * @param {string} options.service - The service for the related object, e.g. '/messages'.
 * @param {string|Array.<string>} options.field - The field containing the key(s)
 *    for the item(s) in options.service.
 * @returns {Function} hook function(hook):Promise resolving to the hook.
 *
 * 'options.field' is the foreign key for one related item in options.service, i.e. item[options.field] === foreignItem[idField].
 * 'target' is set to this related item once it is read successfully.
 *
 * If 'options.field' is not present in the hook result item, the hook is ignored.
 *
 * So if the hook result has the message item
 *    { _id: '1...1', senderId: 'a...a', text: 'Jane, are you there?' }
 * and the /users service has the item
 *    { _id: 'a...a', name: 'John Doe'}
 * and then the hook is run
 *    hooks.populate('sender', { field: 'userId', service: '/users' })
 * the hook result will contain
 *    { _id: '1...1', senderId : 'a...a', text: 'Jane, are you there?',
 *      sender: { _id: 'a...a', name: 'John Doe'} }
 *
 * If 'senderId' is an array of keys, then 'sender' will be an array of populated items.
 */
function legacyPopulate(target, options) {
  options = Object.assign({}, options);

  console.error('Calling populate(target, options) is now DEPRECATED and will be removed in the future. ' + 'Refer to docs.feathersjs.com for more information. (legacyPopulate)');

  if (!options.service) {
    throw new Error('You need to provide a service. (populate)');
  }

  var field = options.field || target;

  return function (hook) {
    function populate1(item) {
      if (!item[field]) {
        return Promise.resolve(item);
      }

      // Find by the field value by default or a custom query
      var id = item[field];

      // If it's a mongoose model then
      if (typeof item.toObject === 'function') {
        item = item.toObject(options);
      }
      // If it's a Sequelize model
      else if (typeof item.toJSON === 'function') {
          item = item.toJSON(options);
        }
      // Remove any query from params as it's not related
      var params = Object.assign({}, hook.params, { query: undefined });
      // If the relationship is an array of ids, fetch and resolve an object for each,
      // otherwise just fetch the object.
      var promise = Array.isArray(id) ? Promise.all(id.map(function (objectID) {
        return hook.app.service(options.service).get(objectID, params);
      })) : hook.app.service(options.service).get(id, params);
      return promise.then(function (relatedItem) {
        if (relatedItem) {
          item[target] = relatedItem;
        }
        return item;
      });
    }

    if (hook.type !== 'after') {
      throw new errors.GeneralError('Can not populate on before hook. (populate)');
    }

    var isPaginated = hook.method === 'find' && hook.result.data;
    var data = isPaginated ? hook.result.data : hook.result;

    if (Array.isArray(data)) {
      return Promise.all(data.map(populate1)).then(function (results) {
        if (isPaginated) {
          hook.result.data = results;
        } else {
          hook.result = results;
        }

        return hook;
      });
    }

    // Handle single objects.
    return populate1(hook.result).then(function (item) {
      hook.result = item;
      return hook;
    });
  };
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint no-param-reassign: 0 */

/**
 * Get a value from an object using dot notation, e.g. employee.address.city
 *
 * @param {Object} obj - The object containing the value
 * @param {string} path - The path to the value, e.g. employee.address.city
 * @returns {*} The value, or undefined if the path does not exist
 *
 * There is no way to differentiate between non-existent paths and a value of undefined
 */
var getByDot = exports.getByDot = function getByDot(obj, path) {
  if (path.indexOf('.') === -1) {
    return obj[path];
  }

  return path.split('.').reduce(function (obj1, part) {
    return (typeof obj1 === 'undefined' ? 'undefined' : _typeof(obj1)) === 'object' ? obj1[part] : undefined;
  }, obj);
};

/**
 * Set a value in an object using dot notation, e.g. employee.address.city.
 *
 * @param {Object} obj - The object
 * @param {string} path - The path where to place the value, e.g. employee.address.city
 * @param {*} value - The value.
 * @param {boolean} ifDelete - Delete the prop at path if value is undefined.
 * @returns {Object} The modified object.
 *
 * To delete a prop, set value = undefined and ifDelete = true. Note that
 * new empty inner objects will still be created,
 * e.g. setByDot({}, 'a.b.c', undefined, true) will return {a: b: {} }
 */
var setByDot = exports.setByDot = function setByDot(obj, path, value, ifDelete) {
  if (path.indexOf('.') === -1) {
    obj[path] = value;

    if (value === undefined && ifDelete) {
      delete obj[path];
    }

    return;
  }

  var parts = path.split('.');
  var lastIndex = parts.length - 1;
  return parts.reduce(function (obj1, part, i) {
    if (i !== lastIndex) {
      if (!obj1.hasOwnProperty(part) || _typeof(obj1[part]) !== 'object') {
        obj1[part] = {};
      }
      return obj1[part];
    }

    obj1[part] = value;
    if (value === undefined && ifDelete) {
      delete obj1[part];
    }
    return obj1;
  }, obj);
};

/**
 * Restrict the calling hook to a hook type (before, after) and a set of
 * hook methods (find, get, create, update, patch, remove).
 *
 * @param {object} hook object
 * @param {string|null} type permitted. 'before', 'after' or null for either.
 * @param {array|string} methods permitted. find, get, create, update, patch, remove or null for any
 * @param {string} label identifying hook in error messages. optional.
 *
 * Example:
 * const checkContext = require('feathers-hooks-common/utils').checkContext;
 *
 * const includeCreatedAtHook = (options) => {
 *   const fieldName = (options && options.as) ? options.as : 'createdAt';
 *   return (hook) => {
 *     checkContext(hook, 'before', 'create', 'includeCreatedAtHook');
 *     hook.data[fieldName] = new Date());
 *   };
 * },
 *
 * Examples:
 * checkContext(hook, 'before', ['update', 'patch'], 'hookName');
 * checkContext(hook, null, ['update', 'patch']);
 * checkContext(hook, 'before', null, 'hookName');
 * checkContext(hook, 'before');
 */

var checkContext = exports.checkContext = function checkContext(hook) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var methods = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var label = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'anonymous';

  if (type && hook.type !== type) {
    throw new Error('The \'' + label + '\' hook can only be used as a \'' + type + '\' hook.');
  }

  if (!methods) {
    return;
  }

  var myMethods = Array.isArray(methods) ? methods : [methods]; // safe enough for allowed values

  if (myMethods.length > 0 && myMethods.indexOf(hook.method) === -1) {
    var msg = JSON.stringify(myMethods);
    throw new Error('The \'' + label + '\' hook can only be used on the \'' + msg + '\' service method(s).');
  }
};

/**
 * Return the data items in a hook.
 * hook.data if type=before.
 * hook.result.data if type=after, method=find with pagination.
 * hook.result otherwise if type=after.
 *
 * @param {Object} hook - The hook.
 * @returns {Object|Array.<Object>} The data item or array of data items
 */
var getItems = exports.getItems = function getItems(hook) {
  var items = hook.type === 'before' ? hook.data : hook.result;
  return items && hook.method === 'find' ? items.data || items : items;
};

/**
 * Replace the data items in a hook. Companion to getItems.
 *
 * @param {Object} hook - The hook.
 * @param {Object|Array.<Object>} items - The data item or array of data items
 *
 * If you update an after find paginated hook with an item rather than an array of items,
 * the hook will have an array consisting of that one item.
 */
var replaceItems = exports.replaceItems = function replaceItems(hook, items) {
  if (hook.type === 'before') {
    hook.data = items;
  } else if (hook.method === 'find' && hook.result && hook.result.data) {
    if (Array.isArray(items)) {
      hook.result.data = items;
      hook.result.total = items.length;
    } else {
      hook.result.data = [items];
      hook.result.total = 1;
    }
  } else {
    hook.result = items;
  }
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(67)


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

module.exports = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

exports.arrayToObject = function (source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

exports.merge = function (target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = exports.arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = exports.merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (Object.prototype.hasOwnProperty.call(acc, key)) {
            acc[key] = exports.merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

exports.decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

exports.encode = function (str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D || // -
            c === 0x2E || // .
            c === 0x5F || // _
            c === 0x7E || // ~
            (c >= 0x30 && c <= 0x39) || // 0-9
            (c >= 0x41 && c <= 0x5A) || // a-z
            (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)] + hexTable[0x80 | ((c >> 12) & 0x3F)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]; // eslint-disable-line max-len
    }

    return out;
};

exports.compact = function (obj, references) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    var refs = references || [];
    var lookup = refs.indexOf(obj);
    if (lookup !== -1) {
        return refs[lookup];
    }

    refs.push(obj);

    if (Array.isArray(obj)) {
        var compacted = [];

        for (var i = 0; i < obj.length; ++i) {
            if (obj[i] && typeof obj[i] === 'object') {
                compacted.push(exports.compact(obj[i], refs));
            } else if (typeof obj[i] !== 'undefined') {
                compacted.push(obj[i]);
            }
        }

        return compacted;
    }

    var keys = Object.keys(obj);
    keys.forEach(function (key) {
        obj[key] = exports.compact(obj[key], refs);
    });

    return obj;
};

exports.isRegExp = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

exports.isBuffer = function (obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/25/17.
 */
const m = __webpack_require__(0);

const orderCompactHeader = {
    oninit: vnode => {
        //something
    }
    ,
    view: vnode => m(
        'tr',
        m('td.w-10', 'Mã hóa đơn'),
        m('td.w-10', 'Tên khách hàng'),
        m('td.w-10', 'Số điện thoại'),
        m('td.w-10', 'Phương thức thanh toán'),
        m('td.w-10', 'Số lượng'),
        m('td.w-20', 'Địa chỉ'),
        m('td.w-10', 'kVND/NDT'),
        m('td.w-10', 'Status'),
        m('td.w-10', '')
    )
};

module.exports = orderCompactHeader;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

/**
 * Created by huy on 4/29/17.
 */
module.exports = [
    {description: "", text: "Chờ Tiếp nhận", editable: true},
    {description: "", text: "Đã xác nhận", editable: true},
    {description: "", text: "Chưa liên lạc được với shop", editable: true},
    {description: "", text: "Đang xử lý", editable: true},
    {description: "", text: "Chậm nhập kho Trung Quốc", editable: true},
    {description: "", text: "Đã về kho", editable: true},
    {description: "", text: "Đang ship cho khách ", editable: true},
    {description: "", text: "Đã hoàn thành", editable: false},
];

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/17/17.
 */
const m = __webpack_require__(0);
const EX_RATE = 3.1;

let cartSummary =
        {
            oninit: function (vnode) {

            },
            cal_totalPrice: function (prdList) {
                if (prdList) {
                    let totalPrice = 0;
                    let totalQuantity = 0;
                    prdList.forEach(function (t) {
                        totalQuantity = totalQuantity + Number(t.itemQty);
                        totalPrice = totalPrice + t.itemQty * t.itemPrc
                    });
                    return {totalPrice: totalPrice, totalQuantity: totalQuantity};
                }else{
                    return {totalPrice: 0, totalQuantity: 0};
                }
            },

            view: function (vnode) {
                return m('.db',
                    m('.db.f5.mt3.b ', "Thông tin đơn hàng"),
                    m('hr'),

                    m('.db', m('span', m('span', 'Mã đơn: '), m('b', vnode.attrs.orderCode))),
                    m('hr'),

                    m('.db', m('span', m('span', 'Thời gian: '), m('b', (new Date()).toLocaleString()))),
                    m('hr'),

                    m('.db', m('span', `Tổng sản phẩm : ${cartSummary.cal_totalPrice(vnode.attrs.products).totalQuantity}`)),
                    m('hr'),

                    m('.db', m('span', 'Thành tiền (NDT): '), m('b', cartSummary.cal_totalPrice(vnode.attrs.products).totalPrice)),
                    m('hr'),

                    m('.db', m('span', 'Thành tiền (VND): '), m('b', (cartSummary.cal_totalPrice(vnode.attrs.products).totalPrice * EX_RATE * 1000).toLocaleString())),
                    m('hr')
                )
            }
        }
    ;

module.exports = cartSummary;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/18/17.
 */
const m = __webpack_require__(0);
const productCompact = {
  oninit: function (vnode) {
    this.view = this.secondView
  },
  view: function (vnode) {

    return m('.db.w-50.pa2.fl',
      m('.db.w-20.w-20-l.w-20-m.fl', m('img', {src: vnode.attrs.itemImg})),
      m('.db.w-80.w-80-l.w-80-m.fl', m('.db',
        m('span.db', `Màu sắc - Size : ${vnode.attrs.itemDetail.color_size}`),
        m('span.db', `Số lượng : ${vnode.attrs.itemQty} || Giá  :NDT ${vnode.attrs.itemPrc}`),
        //luu i chi so ty gia sau nay
        m('span.db', `Thành tiền: NDT ${vnode.attrs.itemQty * vnode.attrs.itemPrc} --- VND ${vnode.attrs.itemQty * vnode.attrs.itemPrc * 3.1}`),
        m('span.db', m('a', {href: vnode.attrs.itemLink}))
        )
      )
    )
  },
  secondView: function (vnode) {
    return m('tr.f6',
      m('td.w-10', m('img', {src: vnode.attrs.itemImg})),
      m('td', `${vnode.attrs.itemDetail.color_size}`),
      m('td', `${vnode.attrs.itemQty} `),
      m('td', `NDT ${vnode.attrs.itemPrc}`),
      //luu i chi so ty gia sau nay
      m('td', `NDT ${vnode.attrs.itemQty * vnode.attrs.itemPrc} --- VND ${vnode.attrs.itemQty * vnode.attrs.itemPrc * 3.1}`),
      m('td', m('a', {href: vnode.attrs.itemLink}))
    )
  }
};
module.exports = productCompact;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/25/17.
 */
const m = __webpack_require__(0);
const orderTable = __webpack_require__(83)
const clientService = __webpack_require__(1)
const orderControl = __webpack_require__(85)
const adminPage = {
    oninit: function (vnode) {
        this.get_data()
    },
    data: {
        list: []
    },
    get_data: () => {
        clientService.service('order').find().then(result => {
            adminPage.data.list = result.data
            console.log(adminPage.data.list)
            m.redraw();
        }).catch(err => console.log(err))
    },
    view: vnode => m('.db.overflow-auto',
        m('.db.w-20.fl', m(orderControl, {data: adminPage.data})),
        m('.db.w-80.fl', m(orderTable, {data: adminPage.data}))
    )
};

module.exports = adminPage;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/5/17.
 */
const m = __webpack_require__(0);
const stream = __webpack_require__(14);
const appService = __webpack_require__(1);
const cartService = appService.service('/cartv-1');
const sampleRequest = __webpack_require__(97);

const step = __webpack_require__(95);
const cartSummary = __webpack_require__(20);

const product = __webpack_require__(96);
const productCompact = __webpack_require__(21);

const orderInfo = __webpack_require__(89);
const payment = __webpack_require__(94);


const EX_RATE = 3.1;
const cart = {
    oninit: function (vnode) {
        cart.view = cart.defaultView;
        cart.get_data();

    },

    switch_view: function () {
        if (cart.step == 0) {
            cart.view = cart.defaultView;
        }
        else if (cart.step == 1) {
            cart.view = cart.inputInfoView;

        } else if (cart.step == 2) {
            cart.view = cart.paymentView;

        }
    },

    data: {},
    step: stream(0),
    isWantedToBuy: false,

    cal_totalPrice: function (prdList) {
        if (prdList) {
            let totalPrice = 0;
            let totalQuantity = 0;
            prdList.forEach(function (t) {
                totalQuantity = totalQuantity + Number(t.itemQty);
                totalPrice = totalPrice + t.itemQty * t.itemPrc
            });
            return {totalPrice: totalPrice, totalQuantity: totalQuantity};
        } else {
            return {totalPrice: 0, totalQuantity: 0};
        }
    },

    get_data: function (vnode) {

        cartService.find().then(function (result) {
            cart.data = result;
            // console.log(result);
            // console.log(cart.data);
            m.redraw();
        }).catch(function (err) {
            console.log(err)
        })
    },
    update_data: function () {
        cartService.update(1, {cart: cart.data}).then(function (result) {
            // console.log(result)
        }).catch(function (err) {
            console.log(err)
        })
    },
    view: function () {
        return m('.db', 'In loading')
    },

    defaultView: function (vnode) {
        return m('.cart.f6', [

            m('.db.ma2',
                m(step, {step: cart.step})
            ),
            m('hr'),
            m('.prd-list.mt2.pa2.w-60-l.w-60-m.fl.w-100',
                cart.data.products ? cart.data.products.map(function (p) {
                    return m('.w-100.fl.relative', [
                        m(product, {product: p, update: cart.update_data}),
                        m('button.br-100.absolute',
                            {
                                onclick: function () {
                                    let removeIndex = cart.data.products.indexOf(p);
                                    cart.data.products.splice(removeIndex, 1);
                                    cart.update_data();
                                },
                                style: {right: '-5px', top: '-5px'}
                            },
                            'x')
                    ])
                }) : m('h2', 'Bạn chưa mua hàng')
            ),


            m('.total.db.fl.w-40-l.w-40-m.w-100.pa2',
                m(cartSummary, cart.data),
                m('.db.i', '*Bạn cần chọn hàng để nhập thông tin'),
                m('button[type=button].pa2.br3.w-100.bg-orange.white', {
                    disabled: (!cart.data.products) ? true : (cart.data.products.length == 0),

                    onclick: function (e) {
                        cart.isWantedToBuy = true;
                        cart.step(1);
                        cart.switch_view();

                    }
                }, 'Nhập thông tin')
            )
        ])
    },
    inputInfoView: function () {
        return m('.cart.f6', [

            m('.db.ma2',
                m(step, {step: cart.step})
            ),
            m('hr'),

            m('.total.db.fl.w-40-l.w-40-m.w-100.pa2',
                m(orderInfo, {
                    cart: cart.data,
                    step: cart.step,
                    switch_view: cart.switch_view,
                    update: cart.update_data
                }),
                m('a.db.tc', {
                    onclick: function () {
                        cart.step(0);
                        cart.switch_view();
                    }
                })
            ),

            m('table.prd-list.mt2.pa2.w-60-l.w-60-m.fl.w-100',
                m('tr',
                    m('th', "Ảnh "),
                    m('th', "Kích cỡ - Size"),
                    m('th', "Số lượng"),
                    m('th', "Giá"),
                    m('th', "Thành tiền")
                ),
                cart.data.products ? cart.data.products.map(function (p) {
                    return m(productCompact, p)
                }) : "",
                m('tr',
                    m('td', ""),
                    m('td', ""),
                    m('tđ', m('b', cart.cal_totalPrice(cart.data.products).totalQuantity)),
                    m('td', ""),
                    m('td', m('b',
                        ` NDT ${cart.cal_totalPrice(cart.data.products).totalPrice}--- 
                          VND ${(cart.cal_totalPrice(cart.data.products).totalPrice * EX_RATE).toLocaleString()}`
                    ))
                )
            )


        ])

    },
    paymentView: function () {
        return m('.db', [
            m('.db.ma2',
                m(step, {step: cart.step})
            ),
            m('.fl.w-50', m(payment, {cart: cart.data})),
            m('.fl.w-50', m(cartSummary, cart.data),
                m('button[type=button].pa2.br3.w-20.bg-orange.white.w-20', {
                    onclick: function (e) {
                        cart.isWantedToBuy = true;
                        cart.step(2);
                        cart.switch_view();

                        cartService.remove(1, {query: {orderCode: cart.data.orderCode}}).then(function (result) {
                            console.log(result)
                        }).catch(function (err) {
                            console.log(err)
                        });
                        appService.service('order').create(cart.data)

                        appService.service('history-log').create({
                            orderCode: cart.data.orderCode,
                            text: 'Hóa đơn được khởi tạo',
                            sender: 'Hệ thống'
                        })
                        appService.service('history-log').create({
                            orderCode: cart.data.orderCode,
                            text: cart.data.message,
                            sender: 'Khách hàng'
                        })
                        location.href = `/#!/order/&orderCode=${cart.data.orderCode}`
                    }
                }, 'Gửi đơn hàng')
            ),

        ])
    }
};

module.exports = cart;



/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/5/17.
 */
const m = __webpack_require__(0);
const appService = __webpack_require__(1);


let login = {
    oninit: function () {

    },
    lgData: {
        strategy: "local",
        email: "",
        password: ""
    },
    sentData: function () {
        appService.authenticate(login.lgData)
            .then(() => {
                location.href = '/'
            }).catch(function (error) {
            console.error('Error authenticating!', error);
        });

    },
    view: function () {
        return m('form.login', {
            onsubmit: function (e) {
                e.preventDefault();
                login.sentData();
            }
        }, [
            m('label',
                m('span', "Tài khoản: "),
                m('input', {
                    type: "text", required: true, oninput: function (e) {
                        login.lgData.email = e.target.value
                    }
                })
            ),
            m('label',
                m('span', "Mật khẩu"),
                m('input', {
                    type: "password", required: true, oninput: function (e) {
                        login.lgData.password = e.target.value
                    }
                })
            ),
            m('p',
                m('a', {href: '/register', oncreate: m.route.link}, "Tạo tài khoản mới?")
            ),
            m('input', {type: 'submit', value: "Đăng nhập"})
        ])
    }
};

module.exports = login;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/5/17.
 */
const m = __webpack_require__(0);
const appService = __webpack_require__(1);

const city = ["Hà Nội", "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái", "Phú Yên  Cần Thơ", "Đà Nẵng", "Hải Phòng", "TP HCM"];
let register = {

    oninit: function () {

    },
    regData: {
        email: "",
        password: "",
        userInfo: {
            userName: "",
            phone: "",
            address: {
                city: "",
                province: "",
                other: ""
            }
        }
    },
    checkData: function () {

    },
    sendData: function () {

    },
    view: function () {
        return m('.container',
            m('form.register', {
                    onsubmit: function (e) {
                        console.log(register.regData);
                        e.preventDefault();
                        appService.service('users').create(register.regData).then(function (result) {
                            console.log(result)
                        }).catch(function (err) {
                            console.log(err)
                        })
                    }
                },
                [
                    //Tên người dùng
                    m('label',
                        m('span', "Tên của bạn"),
                        m('input', {
                            name: "userName", type: 'text',
                            required: true,
                            oninput: function (e) {
                                register.regData.userInfo.userName = event.target.value;
                            }
                        })
                    ),

                    //Mật khẩu
                    m('label',
                        m('span', "Mật khẩu"),
                        m('input',
                            {
                                name: "password",
                                type: 'password',
                                required: true,
                                oninput: function (e) {
                                    register.regData.password = e.target.value;
                                }
                            })),

                    //Số điện thoại
                    m('label',
                        m('span', "Số điện thoại"),
                        m('input',
                            {
                                name: "phone",
                                type: 'tel',
                                required: true,
                                oninput: function (e) {
                                    register.regData.userInfo.phone = e.target.value;
                                }
                            })),

                    //email
                    m('label',
                        m('span', "Email"),
                        m('input', {
                            name: "email",
                            type: "email",
                            required: true,
                            oninput: function (e) {
                                register.regData.email = e.target.value;
                            }
                        })),

                    //Địa chỉ ,thành phố
                    m('label',
                        m('span', "Thành phố"),
                        m('select', {
                                name: "province", required: true,
                                onchange: function (e) {
                                    register.regData.userInfo.address.province = e.target.value
                                }
                            }, city.map((ct) => m('option', {value: ct}, ct))
                        )
                    ),

                    //Địa chỉ ( số nhà , phố)
                    m('label',
                        m('span', "Địa chỉ"),
                        m('input', {
                            name: "address", type: "text", oninput: function (e) {
                                register.regData.userInfo.address.other = e.target.value
                            }
                        })),

                    //submit
                    m('input', {type: 'submit', value: "Đăng ký"})
                ])
        )
    }
};

module.exports = register;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/13/17.
 */
const m = __webpack_require__(0);
const service = __webpack_require__(1)
const provinces = __webpack_require__(7);

let signUp = {
    oninit: function (vnode) {

        //sau nay dung cho tu dien thong tin
        //signUp.data = {}
    },

    data: {
        email: "",
        password: "",
        userInfo: {
            phone: '',
            userName: '',
            address: {
                province: "HANOI",
                city: "QUANBADINH",
                other: ""
            }
        }

    },


    formSeclectData: {
        get_provinceList: function () {
            let provinceList = [];
            for (key in provinces) {
                provinceList.push(key);
            }
            return provinceList
        },
        get_cityList: function (province) {
            let cityList = [];
            for (key in provinces[province].cities) {
                cityList.push(key);
            }
            return cityList
        }
    },
    view: function (vnode) {
        return m('.db',

            m('.f5.b.mt3', "Thông tin của bạn"),
            m('hr'),
            m('form', {
                    onsubmit: function (e) {
                        e.preventDefault();
                        service.service('users').create(signUp.data)
                            .then(() => {
                                location.href = '#!/signin'
                            })
                            .catch(console.log)
                    }
                },
                [
                    m('label.db.ma2',
                        m('.db', "Email"),
                        m('input.db.w-100', {
                            type: 'email',
                            required: true,
                            value: signUp.data.email,
                            oninput: function (e) {
                                signUp.data.email = e.target.value
                            }
                        })
                    ), m('label.db.ma2',
                    m('.db', "Password"),
                    m('input.db.w-100', {
                        type: 'password',
                        required: true,
                        value: signUp.data.password,
                        oninput: function (e) {
                            signUp.data.password = e.target.value
                        }
                    })
                ), m('label.db.ma2',
                    m('.db', "Nhập lại mật khẩu"),
                    m('input.db.w-100', {
                        type: 'password',
                        required: true,
                        oninput: function (e) {
                            if (e.target.value != signUp.data.password) {
                            } else {
                                e.target.style.backgroundColor = "lightgreen"
                            }
                        }
                    })
                ), m('label.db.ma2',
                    m('.db', "Tên của bạn"),
                    m('input.db.w-100', {
                        required: true,
                        value: signUp.data.userInfo.userName,
                        oninput: function (e) {
                            signUp.data.userInfo.userName = e.target.value
                        }
                    })
                ),

                    m('label.db.ma2',
                        m('.db', "Số điện thoại"),
                        m('input.db.w-100[type=tel]', {
                            required: true,
                            value: signUp.data.userInfo.phone,
                            oninput: function (e) {
                                signUp.data.userInfo.phone = e.target.value
                            },
                            onblur: function () {

                            }
                        })
                    ),

                    m('label.db.ma2',
                        m('.db', "Tinh"),
                        m('select.db.w-100', {
                                value: signUp.data.userInfo.address.province,
                                onchange: function (e) {

                                    signUp.data.userInfo.address.province = e.target.value;
                                    signUp.data.userInfo.address.city = signUp.formSeclectData.get_cityList(signUp.data.userInfo.address.province)[0];

                                },
                                onblur: function () {

                                }
                            },
                            signUp.formSeclectData.get_provinceList().map((c) => m('option', {
                                value: c
                            }, provinces[c].name))
                        )
                    ),

                    m('label.db.ma2',
                        m('.db', "Huyện"),
                        m('select.db.w-100', {
                                value: signUp.data.userInfo.address.city,
                                onchange: function (e) {
                                    signUp.data.userInfo.address.city = e.target.value;
                                    // console.log(signUp.data.address)
                                },
                                onblur: function () {

                                }
                            },
                            signUp.formSeclectData.get_cityList(signUp.data.userInfo.address.province).map((p) => m('option', {
                                value: p,

                            }, provinces[signUp.data.userInfo.address.province].cities[p]))
                        )
                    ),

                    m('label.db.ma2',
                        m('.db', "Địa chỉ"),
                        m('textarea.w-100', {
                            required: true,
                            oninput: function (e) {
                                signUp.data.userInfo.address.other = e.target.value
                            },
                            onblur: function () {

                            }
                        })
                    ),


                    m('input.db[type=submit].pa2.br3.w-100.bg-orange.white', {value: 'Đăng ký'})
                ])
        )

    }
};

module.exports = signUp;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/5/17.
 */
var m = __webpack_require__(0);

var menu = {
    oninit: function () {

    },
    view: function () {
        return m('nav.ma0.bg-black.fixed.h-30px.w-80-l.w-100.z-9999', {style: {top: 0}},
            [
                //{text: 'Home', href: '/'},
                {text: 'Giỏ hàng', href: '/cart'},
                {text: 'Cửa hàng', href: '/shop'},
                {text: 'Tra cứu đơn hàng', href: '/order'},
                {text: 'Đăng nhập', href: '/login'}


            ].map(
                l => m('span', m('a.dib.link.pa2.white.bg-animate', {
                        href: l.href, oncreate: m.route.link
                    }
                    , l.text))),
            m('span.fr', m('a.dib.link.pa2.white.bg-animate', 'Hotline: 0962710499'))
        )
    }
};

module.exports = menu;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/5/17.
 */
var m = __webpack_require__(0);
const client = __webpack_require__(1)
var menu = {
    oninit: function () {

    },
    view: function () {
        return m('nav.ma0.bg-black.fixed.h-30px.w-80-l.w-100.z-9999', {style: {top: 0}},
            [
                //{text: 'Home', href: '/'},
                {text: 'Giỏ hàng', href: '/cart'},
                {text: 'Cửa hàng', href: '/shop'},
                {text: 'Đơn hàng', href: '/order'},
                {text: 'Thông tin và tài chính', href: '/my-info'}

            ].map(
                l => m('span', m('a.dib.link.pa2.white.bg-animate', {
                        href: l.href, oncreate: m.route.link
                    }
                    , l.text))),
            m('span', m('a.dib.link.pa2.white.bg-animate', {
                    onclick: e=>client.logout().then(()=> {location.href= '/'})
                }
                , 'Đăng xuất')),
            m('span.fr', m('a.dib.link.pa2.white.bg-animate', 'Hotline: 0962710499'))
        )
    }
};

module.exports = menu;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/5/17.
 */
let m = __webpack_require__(0);
let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

let notify = {
  oninit: function () {

  },
  view: function () {
    return m('div.notify',
      [
        m('span.date-view', new Date().toLocaleString('vi-VI', options)),
        m('span.exchange-rate-view', m('b', "3.360Đ/NDT")),
        m('span.hot-line', m('a', m('b', 'Hot-line', m('a', {href: "tel:01889940451"}, " 01889940451")))),
        m('span.message-view', m('a', m('span',"Tin nhắn5*"), m('sup', '2!'))),
        m('span.cart-view', m('a', 'Giỏ hàng', m('sup', ' 3!'))),


      ]
    )
  }
};

module.exports = notify;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/11/17.
 */
const m = __webpack_require__(0);
const client = __webpack_require__(1);
const sampleProduct = __webpack_require__(99);

const shop = {
    oninit: function (vnode) {

    },

    view: function (vnode) {
        return [
            m('h1', 'Chào bạn đến với shop'),
            m('button', {
                onclick: function () {
                    client.service('cartv-1').create(sampleProduct).then(function (result) {
//                        console.log(result)
                    }).catch(function (err) {
//                      console.log(err)
                    })
                }
            }, 'Gửi hàng demo')
        ]
    }
};
module.exports = shop;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 5/3/17.
 */
const m = __webpack_require__(0);
const word = {}
const client = __webpack_require__(1)
const cityData = __webpack_require__(7)
const profile = {
    oninit: vnode => {
        //something
        profile.get_data(profile.data)
    },

    data: {
        email: "",
        password: "",
        userInfo: {
            phone: '',
            userName: '',
            address: {
                province: "HANOI",
                city: "QUANBADINH",
                other: ""
            }
        }
    },
    get_data: () =>
        client.authenticate()
            .then(() => client.service('users').find())
            .then(result => Object.assign(profile.data, result.data[0]))
            .then(console.log)
            .then(m.redraw)
            .catch(console.log)
    ,
    view: vnode => m(
        '.db.pa3',
        m('.db.f4.b' , 'Thông tin cá nhân'),
        m('label.mt3.db',
            m('span.b', 'Email:'),
            m('span', profile.data.email )
        ), m('label.mt3.db',
            m('span.b', 'Tên: '),
            m('span', profile.data.userInfo.userName)
        ), m('label.mt3.db',
            m('span.b', 'Số điện thoại: '),
            m('span', profile.data.userInfo.phone)
        ), m('label.mt3.db',
            m('.db.b', 'Địa chỉ: '),
            m('.db.ml2', `Tỉnh: ${cityData[profile.data.userInfo.address.province].name}`),
            m('.db.ml2', `Huyện: ${cityData[profile.data.userInfo.address.province].cities[profile.data.userInfo.address.city]}`),
            m('.db.ml2', `Địa chỉ: ${profile.data.userInfo.address.other}`)
        )
    )
};

module.exports = profile;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/14/17.
 */
var m = __webpack_require__(0);

var homePage = {
    oninit: function () {

    },
    view: function () {
        return m('.db',
            ''
        )
    }
};

module.exports = homePage;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/14/17.
 */
const EX_RATE = 3.1
var m = __webpack_require__(0);
const orderService = __webpack_require__(1).service('order');

const cartSummary = __webpack_require__(20);
const productCompact = __webpack_require__(21);
const orderHistory = __webpack_require__(98)

var order = {
    oninit: function (vnode) {
        let queryString = m.route.get();
        let queryresult = m.parseQueryString(queryString.split('/')[2]);
        order.data.orderCode = queryresult.orderCode;
        order.get_data()
    },
    data: {},
    get_data: () => {
        if (order.data.orderCode) {
            orderService.find({
                query: {
                    orderCode: order.data.orderCode
                }
            }).then(result => {
                if (result.data.length > 0) {
                    Object.assign(order.data, result.data[0])
                    console.log(result)
                    order.view = order.result_view
                    m.redraw()
                } else {
                    order.view = order.not_found_view
                    m.redraw()
                }
            }).catch(err => {
                console.log(err)
            })
        } else {

        }
    },

    cal_totalPrice: function (prdList) {
        if (prdList) {
            let totalPrice = 0;
            let totalQuantity = 0;
            prdList.forEach(function (t) {
                totalQuantity = totalQuantity + Number(t.itemQty);
                totalPrice = totalPrice + t.itemQty * t.itemPrc
            });
            return {totalPrice: totalPrice, totalQuantity: totalQuantity};
        } else {
            return {totalPrice: 0, totalQuantity: 0};
        }
    },

    view: vnode => m('.db',
        m('.db.f3.b.tc', 'Tra cứu đơn hàng'),
        m('.db',
            m('p', 'Tìm kiếm đơn hàng'),
            m('.db', m('input', {
                placeholder: "Số điện thoại/ mã đơn",
                oninput: e => {
                    order.data.orderCode = e.target.value
                },
            }), m('button', {
                onclick: () => {
                    order.get_data();
                }
            }, "Tìm"))
        )
    ),
    not_found_view: vnode => [
        m('.db.f3.b.tc', 'Tra cứu đơn hàng'),
        m('.db',
            m('p', 'Tìm kiếm đơn hàng'),
            m('form.db', {
                    onsubmit: e => {
                        e.preventDefault();
                        order.get_data()
                    }
                }, m('input[type=text][name=order]', {
                    placeholder: "Số điện thoại/ mã đơn",
                    oninput: e => {
                        order.data.orderCode = e.target.value
                    },
                }), m('input[type=submit][value=Tìm]')
            ),
            m('hr'),
            m('.db.pt3',
                m('.db.f4', m('span', 'Mã đơn '), m('b', order.data.orderCode || "__"))
            )
        ),
        m('.db', 'Không tìm thấy hóa đơn')
    ],
    result_view: (vnode) => [
        m('.db.f3.b.tc', 'Tra cứu đơn hàng'),
        m('.db',
            m('p', 'Tìm kiếm đơn hàng'),
            m('form.db', {
                    onsubmit: e => {
                        e.preventDefault();
                        order.get_data()
                    }
                }, m('input[type=text][name=order]', {
                    placeholder: "Số điện thoại/ mã đơn",
                    oninput: e => {
                        order.data.orderCode = e.target.value
                    },
                }), m('input[type=submit][value=Tìm]')
            ),
            m('hr'),
            m('.db.pt3',
                m('.db.f4', m('span', 'Mã đơn '), m('b', order.data.orderCode || "__"))
            )
        ),
        order.data.products ?
            m('.db.overflow-auto',

                m('.db.w-50-l.w-50-m.w-100.fl',
                    m('h4', `Trạng thái đơn hàng : ${order.data.status}`),
                    m('h4', 'Thông tin đơn hàng'),
                    m('.db', m(orderHistory, {orderCode: order.data.orderCode})
                    )
                ),
                m('.db.w-50-l.w-50-m.w-100.fl',
                    m('table.prd-list.mt2.pa2.w-100-l.w-100-m.fl.w-100',
                        m('tr',
                            m('th', "Ảnh "),
                            m('th', "Kích cỡ - Size"),
                            m('th', "Số lượng"),
                            m('th', "Giá"),
                            m('th', "Thành tiền")
                        ),
                        order.data.products ? order.data.products.map(function (p) {
                            return m(productCompact, p)
                        }) : "",
                        m('tr',
                            m('td', ""),
                            m('td', ""),
                            m('tđ', m('b',
                                order.cal_totalPrice(order.data.products).totalQuantity
                            )),
                            m('td', ""),
                            m('td', m('b',
                                ` NDT ${order.cal_totalPrice(order.data.products).totalPrice}---
                          VND ${(order.cal_totalPrice(order.data.products).totalPrice * EX_RATE).toLocaleString()}`
                            ))
                        )
                    )
                )
            ) :
            m('h3', 'Đơn hàng không tồn tại')

    ]
};

module.exports = order;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(68);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _populateHeader = __webpack_require__(39);

var _populateHeader2 = _interopRequireDefault(_populateHeader);

var _populateAccessToken = __webpack_require__(37);

var _populateAccessToken2 = _interopRequireDefault(_populateAccessToken);

var _populateEntity = __webpack_require__(38);

var _populateEntity2 = _interopRequireDefault(_populateEntity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hooks = {
  populateHeader: _populateHeader2.default,
  populateAccessToken: _populateAccessToken2.default,
  populateEntity: _populateEntity2.default
};

exports.default = hooks;
module.exports = exports['default'];

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = populateAccessToken;
/*
 * Exposes the access token to the client side hooks
 * under hook.params.accessToken.
 */

function populateAccessToken() {
  return function (hook) {
    var app = hook.app;

    if (hook.type !== 'before') {
      return Promise.reject(new Error('The \'populateAccessToken\' hook should only be used as a \'before\' hook.'));
    }

    Object.assign(hook.params, { accessToken: app.get('accessToken') });

    return Promise.resolve(hook);
  };
}
module.exports = exports['default'];

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = populateEntity;
/*
 * Fetch and populate an entity by id encoded in the
 * access token payload. Useful for easily getting the
 * current user after authentication, or any other entity.
 */

function populateEntity() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!options.service) {
    throw new Error('You need to pass \'options.service\' to the populateEntity() hook.');
  }

  if (!options.field) {
    throw new Error('You need to pass \'options.field\' to the populateEntity() hook.');
  }

  if (!options.entity) {
    throw new Error('You need to pass \'options.entity\' to the populateEntity() hook.');
  }

  return function (hook) {
    var app = hook.app;

    if (hook.type !== 'after') {
      return Promise.reject(new Error('The \'populateEntity\' hook should only be used as an \'after\' hook.'));
    }

    return app.passport.verifyJWT(hook.result.accessToken).then(function (payload) {
      var id = payload[options.field];

      if (!id) {
        return Promise.reject(new Error('Access token payload is missing the \'' + options.field + '\' field.'));
      }

      return app.service(options.service).get(id);
    }).then(function (entity) {
      hook.result[options.entity] = entity;
      app.set(options.entity, entity);

      return Promise.resolve(hook);
    });
  };
}
module.exports = exports['default'];

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = populateHeader;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Sets the access token in the authorization header
 * under hook.params.header so that it can be picked
 * up by the client side REST libraries.
 */

function populateHeader() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!options.header) {
    throw new Error('You need to pass \'options.header\' to the populateHeader() hook.');
  }

  return function (hook) {
    if (hook.type !== 'before') {
      return Promise.reject(new Error('The \'populateHeader\' hook should only be used as a \'before\' hook.'));
    }

    if (hook.params.accessToken) {
      hook.params.headers = Object.assign({}, _defineProperty({}, options.header, options.prefix ? options.prefix + ' ' + hook.params.accessToken : hook.params.accessToken), hook.params.headers);
    }

    return Promise.resolve(hook);
  };
}
module.exports = exports['default'];

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _index = __webpack_require__(36);

var _index2 = _interopRequireDefault(_index);

var _passport = __webpack_require__(41);

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
  header: 'Authorization',
  cookie: 'feathers-jwt',
  storageKey: 'feathers-jwt',
  jwtStrategy: 'jwt',
  path: '/authentication',
  entity: 'user',
  service: 'users',
  timeout: 5000
};

function init() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var options = Object.assign({}, defaults, config);

  return function () {
    var app = this;

    app.passport = new _passport2.default(app, options);
    app.authenticate = app.passport.authenticate.bind(app.passport);
    app.logout = app.passport.logout.bind(app.passport);

    // Set up hook that adds token and user to params so that
    // it they can be accessed by client side hooks and services
    app.mixins.push(function (service) {
      // if (typeof service.hooks !== 'function') {
      if (typeof service.before !== 'function' || typeof service.after !== 'function') {
        throw new Error('It looks like feathers-hooks isn\'t configured. It is required before running feathers-authentication.');
      }

      service.before(_index2.default.populateAccessToken(options));
    });

    // Set up hook that adds authorization header for REST provider
    if (app.rest) {
      app.mixins.push(function (service) {
        service.before(_index2.default.populateHeader(options));
      });
    }
  };
}

init.defaults = defaults;
module.exports = exports['default'];

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _feathersErrors = __webpack_require__(4);

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _jwtDecode = __webpack_require__(66);

var _jwtDecode2 = _interopRequireDefault(_jwtDecode);

var _debug = __webpack_require__(8);

var _debug2 = _interopRequireDefault(_debug);

var _utils = __webpack_require__(42);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('feathers-authentication-client');

var Passport = function () {
  function Passport(app, options) {
    _classCallCheck(this, Passport);

    if (app.passport) {
      throw new Error('You have already registered authentication on this client app instance. You only need to do it once.');
    }

    Object.assign(this, {
      options: options,
      app: app,
      payloadIsValid: _utils.payloadIsValid,
      getCookie: _utils.getCookie,
      clearCookie: _utils.clearCookie,
      storage: app.get('storage') || this.getStorage(options.storage)
    });

    this.setJWT = this.setJWT.bind(this);

    app.set('storage', this.storage);
    this.getJWT().then(this.setJWT);

    this.setupSocketListeners();
  }

  _createClass(Passport, [{
    key: 'setupSocketListeners',
    value: function setupSocketListeners() {
      var _this = this;

      var app = this.app;
      var socket = app.io || app.primus;
      var emit = app.io ? 'emit' : 'send';
      var reconnected = app.io ? 'reconnect' : 'reconnected';

      if (!socket) {
        return;
      }

      socket.on(reconnected, function () {
        debug('Socket reconnected');

        // If socket was already authenticated then re-authenticate
        // it with the server automatically.
        if (socket.authenticated) {
          var data = {
            strategy: _this.options.jwtStrategy,
            accessToken: app.get('accessToken')
          };
          _this.authenticateSocket(data, socket, emit).then(_this.setJWT).catch(function (error) {
            debug('Error re-authenticating after socket reconnect', error);
            socket.authenticated = false;
            app.emit('reauthentication-error', error);
          });
        }
      });

      var socketUpgradeHandler = function socketUpgradeHandler() {
        socket.io.engine.on('upgrade', function () {
          debug('Socket upgrading');

          // If socket was already authenticated then re-authenticate
          // it with the server automatically.
          if (socket.authenticated) {
            var data = {
              strategy: _this.options.jwtStrategy,
              accessToken: app.get('accessToken')
            };

            _this.authenticateSocket(data, socket, emit).then(_this.setJWT).catch(function (error) {
              debug('Error re-authenticating after socket upgrade', error);
              socket.authenticated = false;
              app.emit('reauthentication-error', error);
            });
          }
        });
      };

      if (socket.io && socket.io.engine) {
        socketUpgradeHandler();
      } else {
        socket.on('connect', socketUpgradeHandler);
      }
    }
  }, {
    key: 'connected',
    value: function connected() {
      var _this2 = this;

      var app = this.app;

      if (app.rest) {
        return Promise.resolve();
      }

      var socket = app.io || app.primus;

      if (!socket) {
        return Promise.reject(new Error('It looks like your client connection has not been configured.'));
      }

      if (app.io && socket.connected || app.primus && socket.readyState === 3) {
        debug('Socket already connected');
        return Promise.resolve(socket);
      }

      return new Promise(function (resolve, reject) {
        var connected = app.primus ? 'open' : 'connect';
        var disconnect = app.io ? 'disconnect' : 'end';
        var timeout = setTimeout(function () {
          debug('Socket connection timed out');
          reject(new Error('Socket connection timed out'));
        }, _this2.options.timeout);

        debug('Waiting for socket connection');

        var handleDisconnect = function handleDisconnect() {
          debug('Socket disconnected before it could connect');
          socket.authenticated = false;
        };

        // If disconnect happens before `connect` the promise will be rejected.
        socket.once(disconnect, handleDisconnect);
        socket.once(connected, function () {
          debug('Socket connected');
          debug('Removing ' + disconnect + ' listener');
          socket.removeListener(disconnect, handleDisconnect);
          clearTimeout(timeout);
          resolve(socket);
        });
      });
    }
  }, {
    key: 'authenticate',
    value: function authenticate() {
      var _this3 = this;

      var credentials = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var app = this.app;
      var getCredentials = Promise.resolve(credentials);

      // If no strategy was given let's try to authenticate with a stored JWT
      if (!credentials.strategy) {
        if (credentials.accessToken) {
          credentials.strategy = this.options.jwtStrategy;
        } else {
          getCredentials = this.getJWT().then(function (accessToken) {
            if (!accessToken) {
              return Promise.reject(new _feathersErrors2.default.NotAuthenticated('Could not find stored JWT and no authentication strategy was given'));
            }
            return { strategy: _this3.options.jwtStrategy, accessToken: accessToken };
          });
        }
      }

      return getCredentials.then(function (credentials) {
        return _this3.connected(app).then(function (socket) {
          if (app.rest) {
            return app.service(_this3.options.path).create(credentials).then(_this3.setJWT);
          }

          var emit = app.io ? 'emit' : 'send';
          return _this3.authenticateSocket(credentials, socket, emit).then(_this3.setJWT);
        });
      }).then(function (payload) {
        app.emit('authenticated', payload);
        return payload;
      });
    }

    // Returns a promise that authenticates a socket

  }, {
    key: 'authenticateSocket',
    value: function authenticateSocket(credentials, socket, emit) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var timeout = setTimeout(function () {
          debug('authenticateSocket timed out');
          reject(new Error('Authentication timed out'));
        }, _this4.options.timeout);

        debug('Attempting to authenticate socket');
        socket[emit]('authenticate', credentials, function (error, data) {
          if (error) {
            return reject(error);
          }

          clearTimeout(timeout);
          socket.authenticated = true;
          debug('Socket authenticated!');

          resolve(data);
        });
      });
    }
  }, {
    key: 'logoutSocket',
    value: function logoutSocket(socket, emit) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        var timeout = setTimeout(function () {
          debug('logoutSocket timed out');
          reject(new Error('Logout timed out'));
        }, _this5.options.timeout);

        socket[emit]('logout', function (error) {
          clearTimeout(timeout);
          socket.authenticated = false;

          if (error) {
            return reject(error);
          }

          resolve();
        });
      });
    }
  }, {
    key: 'logout',
    value: function logout() {
      var _this6 = this;

      var app = this.app;

      app.set('accessToken', null);
      this.clearCookie(this.options.cookie);

      // remove the accessToken from localStorage
      return Promise.resolve(app.get('storage').removeItem(this.options.storageKey)).then(function () {
        // If using sockets de-authenticate the socket
        if (app.io || app.primus) {
          var method = app.io ? 'emit' : 'send';
          var socket = app.io ? app.io : app.primus;

          return _this6.logoutSocket(socket, method);
        }
      }).then(function (result) {
        app.emit('logout', result);

        return result;
      });
    }
  }, {
    key: 'setJWT',
    value: function setJWT(data) {
      var accessToken = data && data.accessToken ? data.accessToken : data;

      if (accessToken) {
        this.app.set('accessToken', accessToken);
        this.app.get('storage').setItem(this.options.storageKey, accessToken);
      }

      return Promise.resolve(data);
    }
  }, {
    key: 'getJWT',
    value: function getJWT() {
      var _this7 = this;

      var app = this.app;
      return new Promise(function (resolve) {
        var accessToken = app.get('accessToken');

        if (accessToken) {
          return resolve(accessToken);
        }

        return Promise.resolve(_this7.storage.getItem(_this7.options.storageKey)).then(function (jwt) {
          var token = jwt || _this7.getCookie(_this7.options.cookie);

          if (token && token !== 'null' && !_this7.payloadIsValid((0, _jwtDecode2.default)(token))) {
            token = undefined;
          }

          return resolve(token);
        });
      });
    }

    // Pass a jwt token, get back a payload if it's valid.

  }, {
    key: 'verifyJWT',
    value: function verifyJWT(token) {
      if (typeof token !== 'string') {
        return Promise.reject(new Error('Token provided to verifyJWT is missing or not a string'));
      }

      try {
        var payload = (0, _jwtDecode2.default)(token);

        if (this.payloadIsValid(payload)) {
          return Promise.resolve(payload);
        }

        return Promise.reject(new Error('Invalid token: expired'));
      } catch (error) {
        return Promise.reject(new Error('Cannot decode malformed token.'));
      }
    }

    // Returns a storage implementation

  }, {
    key: 'getStorage',
    value: function getStorage(storage) {
      if (storage) {
        return storage;
      }

      return new _utils.Storage();
    }
  }]);

  return Passport;
}();

exports.default = Passport;
module.exports = exports['default'];

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.payloadIsValid = payloadIsValid;
exports.getCookie = getCookie;
exports.clearCookie = clearCookie;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Storage = exports.Storage = function () {
  function Storage() {
    _classCallCheck(this, Storage);

    this.store = {};
  }

  _createClass(Storage, [{
    key: 'getItem',
    value: function getItem(key) {
      return this.store[key];
    }
  }, {
    key: 'setItem',
    value: function setItem(key, value) {
      return this.store[key] = value;
    }
  }, {
    key: 'removeItem',
    value: function removeItem(key) {
      delete this.store[key];
      return this;
    }
  }]);

  return Storage;
}();

// Pass a decoded payload and it will return a boolean based on if it hasn't expired.


function payloadIsValid(payload) {
  return payload && (!payload.exp || payload.exp * 1000 > new Date().getTime());
}

function getCookie(name) {
  if (typeof document !== 'undefined') {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');

    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
  }

  return null;
}

function clearCookie(name) {
  if (typeof document !== 'undefined') {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  return null;
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getArguments;

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var noop = exports.noop = function noop() {};
var getCallback = function getCallback(args) {
  var last = args[args.length - 1];
  return typeof last === 'function' ? last : noop;
};
var getParams = function getParams(args, position) {
  return _typeof(args[position]) === 'object' ? args[position] : {};
};

var updateOrPatch = function updateOrPatch(name) {
  return function (args) {
    var id = args[0];
    var data = args[1];
    var callback = getCallback(args);
    var params = getParams(args, 2);

    if (typeof id === 'function') {
      throw new Error('First parameter for \'' + name + '\' can not be a function');
    }

    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
      throw new Error('No data provided for \'' + name + '\'');
    }

    if (args.length > 4) {
      throw new Error('Too many arguments for \'' + name + '\' service method');
    }

    return [id, data, params, callback];
  };
};

var getOrRemove = function getOrRemove(name) {
  return function (args) {
    var id = args[0];
    var params = getParams(args, 1);
    var callback = getCallback(args);

    if (args.length > 3) {
      throw new Error('Too many arguments for \'' + name + '\' service method');
    }

    if (typeof id === 'function') {
      throw new Error('First parameter for \'' + name + '\' can not be a function');
    }

    return [id, params, callback];
  };
};

var converters = exports.converters = {
  find: function find(args) {
    var callback = getCallback(args);
    var params = getParams(args, 0);

    if (args.length > 2) {
      throw new Error('Too many arguments for \'find\' service method');
    }

    return [params, callback];
  },
  create: function create(args) {
    var data = args[0];
    var params = getParams(args, 1);
    var callback = getCallback(args);

    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
      throw new Error('First parameter for \'create\' must be an object');
    }

    if (args.length > 3) {
      throw new Error('Too many arguments for \'create\' service method');
    }

    return [data, params, callback];
  },

  update: updateOrPatch('update'),

  patch: updateOrPatch('patch'),

  get: getOrRemove('get'),

  remove: getOrRemove('remove')
};

function getArguments(method, args) {
  return converters[method](args);
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(11);

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function getOrRemove(args) {
  return {
    id: args[0],
    params: args[1],
    callback: args[2]
  };
}

function updateOrPatch(args) {
  return {
    id: args[0],
    data: args[1],
    params: args[2],
    callback: args[3]
  };
}

var converters = {
  find: function find(args) {
    return {
      params: args[0],
      callback: args[1]
    };
  },
  create: function create(args) {
    return {
      data: args[0],
      params: args[1],
      callback: args[2]
    };
  },
  get: getOrRemove,
  remove: getOrRemove,
  update: updateOrPatch,
  patch: updateOrPatch
};

function hookObject(method, type, args) {
  var app = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var hook = converters[method](args);

  hook.method = method;
  hook.type = type;

  if (typeof app === 'function') {
    hook.app = app;
  } else {
    _extends(hook, app);
  }

  return hook;
}

function defaultMakeArguments(hook) {
  var result = [];
  if (typeof hook.id !== 'undefined') {
    result.push(hook.id);
  }

  if (hook.data) {
    result.push(hook.data);
  }

  result.push(hook.params || {});
  result.push(hook.callback);

  return result;
}

function makeArguments(hook) {
  if (hook.method === 'find') {
    return [hook.params, hook.callback];
  }

  if (hook.method === 'get' || hook.method === 'remove') {
    return [hook.id, hook.params, hook.callback];
  }

  if (hook.method === 'update' || hook.method === 'patch') {
    return [hook.id, hook.data, hook.params, hook.callback];
  }

  if (hook.method === 'create') {
    return [hook.data, hook.params, hook.callback];
  }

  return defaultMakeArguments(hook);
}

function convertHookData(obj) {
  var hook = {};

  if (Array.isArray(obj)) {
    hook = { all: obj };
  } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
    hook = { all: [obj] };
  } else {
    (0, _utils.each)(obj, function (value, key) {
      hook[key] = !Array.isArray(value) ? [value] : value;
    });
  }

  return hook;
}

exports.default = {
  hookObject: hookObject,
  hook: hookObject,
  converters: converters,
  defaultMakeArguments: defaultMakeArguments,
  makeArguments: makeArguments,
  convertHookData: convertHookData
};
module.exports = exports['default'];

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isHookObject = isHookObject;
exports.processHooks = processHooks;
exports.addHookTypes = addHookTypes;
exports.getHooks = getHooks;
exports.baseMixin = baseMixin;

var _feathersCommons = __webpack_require__(2);

function isHookObject(hookObject) {
  return (typeof hookObject === 'undefined' ? 'undefined' : _typeof(hookObject)) === 'object' && typeof hookObject.method === 'string' && typeof hookObject.type === 'string';
}

function processHooks(hooks, initialHookObject) {
  var _this = this;

  var hookObject = initialHookObject;
  var updateCurrentHook = function updateCurrentHook(current) {
    if (current) {
      if (!isHookObject(current)) {
        throw new Error(hookObject.type + ' hook for \'' + hookObject.method + '\' method returned invalid hook object');
      }

      hookObject = current;
    }

    return hookObject;
  };
  var promise = Promise.resolve(hookObject);

  // Go through all hooks and chain them into our promise
  hooks.forEach(function (fn) {
    var hook = fn.bind(_this);

    if (hook.length === 2) {
      // function(hook, next)
      promise = promise.then(function (hookObject) {
        return new Promise(function (resolve, reject) {
          hook(hookObject, function (error, result) {
            return error ? reject(error) : resolve(result);
          });
        });
      });
    } else {
      // function(hook)
      promise = promise.then(hook);
    }

    // Use the returned hook object or the old one
    promise = promise.then(updateCurrentHook);
  });

  return promise.catch(function (error) {
    // Add the hook information to any errors
    error.hook = hookObject;
    throw error;
  });
}

function addHookTypes(target) {
  var types = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['before', 'after', 'error'];

  Object.defineProperty(target, '__hooks', {
    value: {}
  });

  types.forEach(function (type) {
    // Initialize properties where hook functions are stored
    target.__hooks[type] = {};
  });
}

function getHooks(app, service, type, method) {
  var appLast = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  var appHooks = app.__hooks[type][method] || [];
  var serviceHooks = service.__hooks[type][method] || [];

  if (appLast) {
    return serviceHooks.concat(appHooks);
  }

  return appHooks.concat(serviceHooks);
}

function baseMixin(methods) {
  var mixin = {
    hooks: function hooks(allHooks) {
      var _this2 = this;

      (0, _feathersCommons.each)(allHooks, function (obj, type) {
        if (!_this2.__hooks[type]) {
          throw new Error('\'' + type + '\' is not a valid hook type');
        }

        var hooks = _feathersCommons.hooks.convertHookData(obj);

        (0, _feathersCommons.each)(hooks, function (value, method) {
          if (method !== 'all' && methods.indexOf(method) === -1) {
            throw new Error('\'' + method + '\' is not a valid hook method');
          }
        });

        methods.forEach(function (method) {
          if (!(hooks[method] || hooks.all)) {
            return;
          }

          var myHooks = _this2.__hooks[type][method] || (_this2.__hooks[type][method] = []);

          if (hooks.all) {
            myHooks.push.apply(myHooks, hooks.all);
          }

          if (hooks[method]) {
            myHooks.push.apply(myHooks, hooks[method]);
          }
        });
      });

      return this;
    }
  };

  for (var _len = arguments.length, objs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    objs[_key - 1] = arguments[_key];
  }

  return Object.assign.apply(Object, [mixin].concat(objs));
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _uberproto = __webpack_require__(6);

var _uberproto2 = _interopRequireDefault(_uberproto);

var _feathersCommons = __webpack_require__(2);

var _populate = __webpack_require__(47);

var _bundled = __webpack_require__(12);

var _commons = __webpack_require__(45);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function isPromise(result) {
  return typeof result !== 'undefined' && typeof result.then === 'function';
}

function hookMixin(service) {
  var app = this;
  var methods = app.methods;
  var old = {
    before: service.before,
    after: service.after
  };
  var mixin = (0, _commons.baseMixin)(methods, {
    before: function before(_before) {
      return this.hooks({ before: _before });
    },
    after: function after(_after) {
      return this.hooks({ after: _after });
    }
  });

  (0, _commons.addHookTypes)(service);

  methods.forEach(function (method) {
    if (typeof service[method] !== 'function') {
      return;
    }

    mixin[method] = function () {
      var _this = this;

      var service = this;
      // A reference to the original method
      var _super = this._super.bind(this);
      // Additional data to add to the hook object
      var hookData = {
        app: app,
        service: service,
        get path() {
          return Object.keys(app.services).find(function (path) {
            return app.services[path] === service;
          });
        }
      };
      // Create the hook object that gets passed through
      var hookObject = _feathersCommons.hooks.hookObject(method, 'before', arguments, hookData);
      // Get all hooks
      var hooks = {
        // For before hooks the app hooks will run first
        before: (0, _commons.getHooks)(app, this, 'before', method),
        // For after and error hooks the app hooks will run last
        after: (0, _commons.getHooks)(app, this, 'after', method, true),
        error: (0, _commons.getHooks)(app, this, 'error', method, true)
      };

      // Process all before hooks
      return _commons.processHooks.call(this, hooks.before, hookObject)
      // Use the hook object to call the original method
      .then(function (hookObject) {
        if (typeof hookObject.result !== 'undefined') {
          return Promise.resolve(hookObject);
        }

        return new Promise(function (resolve, reject) {
          var args = _feathersCommons.hooks.makeArguments(hookObject);
          // The method may not be normalized yet so we have to handle both
          // ways, either by callback or by Promise
          var callback = function callback(error, result) {
            if (error) {
              reject(error);
            } else {
              hookObject.result = result;
              resolve(hookObject);
            }
          };

          // We replace the callback with resolving the promise
          args.splice(args.length - 1, 1, callback);

          var result = _super.apply(undefined, _toConsumableArray(args));

          if (isPromise(result)) {
            result.then(function (data) {
              return callback(null, data);
            }, callback);
          }
        });
      })
      // Make a copy of hookObject from `before` hooks and update type
      .then(function (hookObject) {
        return Object.assign({}, hookObject, { type: 'after' });
      })
      // Run through all `after` hooks
      .then(_commons.processHooks.bind(this, hooks.after))
      // Finally, return the result
      .then(function (hookObject) {
        return hookObject.result;
      })
      // Handle errors
      .catch(function (error) {
        var errorHook = Object.assign({}, error.hook || hookObject, {
          type: 'error',
          original: error.hook,
          error: error
        });

        return _commons.processHooks.call(_this, hooks.error, errorHook).then(function (hook) {
          return Promise.reject(hook.error);
        });
      });
    };
  });

  service.mixin(mixin);

  // Before hooks that were registered in the service
  if (old.before) {
    service.before(old.before);
  }

  // After hooks that were registered in the service
  if (old.after) {
    service.after(old.after);
  }
}

function configure() {
  return function () {
    var app = this;

    (0, _commons.addHookTypes)(app);

    _uberproto2.default.mixin((0, _commons.baseMixin)(app.methods), app);

    this.mixins.unshift(hookMixin);
  };
}

configure.removeQuery = _bundled.removeQuery;
configure.pluckQuery = _bundled.pluckQuery;
configure.lowerCase = _bundled.lowerCase;
configure.remove = _bundled.remove;
configure.pluck = _bundled.pluck;
configure.disable = _bundled.disable;
configure.populate = _populate.populate;
configure.removeField = _bundled.removeField;

exports.default = configure;
module.exports = exports['default'];

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.populate = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _feathersErrors = __webpack_require__(4);

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _utils = __webpack_require__(13);

var _bundled = __webpack_require__(12);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var populate = exports.populate = function populate(options) {
  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  if (typeof options === 'string') {
    return _bundled.legacyPopulate.apply(undefined, [options].concat(rest));
  }

  return function (hook) {
    var optionsDefault = {
      schema: {},
      checkPermissions: function checkPermissions() {
        return true;
      },
      profile: false
    };

    if (hook.params._populate === 'skip') {
      // this service call made from another populate
      return hook;
    }

    return Promise.resolve().then(function () {
      // 'options.schema' resolves to { permissions: '...', include: [ ... ] }

      var items = (0, _utils.getItems)(hook);
      var options1 = Object.assign({}, optionsDefault, options);
      var schema = options1.schema,
          checkPermissions = options1.checkPermissions;

      var schema1 = typeof schema === 'function' ? schema(hook, options1) : schema;
      var permissions = schema1.permissions || null;

      if (typeof checkPermissions !== 'function') {
        throw new _feathersErrors2.default.BadRequest('Permissions param is not a function. (populate)');
      }

      if (permissions && !checkPermissions(hook, hook.path, permissions, 0)) {
        throw new _feathersErrors2.default.BadRequest('Permissions do not allow this populate. (populate)');
      }

      if ((typeof schema1 === 'undefined' ? 'undefined' : _typeof(schema1)) !== 'object') {
        throw new _feathersErrors2.default.BadRequest('Schema does not resolve to an object. (populate)');
      }

      return !schema1.include || !Object.keys(schema1.include).length ? items : populateItemArray(options1, hook, items, schema1.include, 0);
    }).then(function (items) {
      (0, _utils.replaceItems)(hook, items);
      return hook;
    });
  };
};

function populateItemArray(options, hook, items, includeSchema, depth) {
  // 'items' is an item or an array of items
  // 'includeSchema' is like [ { nameAs: 'author', ... }, { nameAs: 'readers', ... } ]

  if (!Array.isArray(items)) {
    return populateItem(options, hook, items, includeSchema, depth + 1);
  }

  return Promise.all(items.map(function (item) {
    return populateItem(options, hook, item, includeSchema, depth + 1);
  }));
}

function populateItem(options, hook, item, includeSchema, depth) {
  // 'item' is one item
  // 'includeSchema' is like [ { nameAs: 'author', ... }, { nameAs: 'readers', ... } ]

  var elapsed = {};
  var startAtAllIncludes = process.hrtime();
  item._include = [];

  return Promise.all(includeSchema.map(function (childSchema) {
    var startAtThisInclude = process.hrtime();
    return populateAddChild(options, hook, item, childSchema, depth).then(function (result) {
      var nameAs = childSchema.nameAs || childSchema.service;
      elapsed[nameAs] = getElapsed(options, startAtThisInclude, depth);

      return result;
    });
  })).then(function (children) {
    // 'children' is like [{ authorInfo: {...}, readersInfo: [{...}, {...}] }]
    if (options.profile !== false) {
      elapsed.total = getElapsed(options, startAtAllIncludes, depth);
      item._elapsed = elapsed;
    }

    return Object.assign.apply(Object, [item].concat(_toConsumableArray(children)));
  });
}

function populateAddChild(options, hook, parentItem, childSchema, depth) {
  /*
  'parentItem' is the item we are adding children to
  'childSchema' is like
    { service: 'comments',
      permissions: '...',
      nameAs: 'comments',
      asArray: true,
      parentField: 'id',
      childField: 'postId',
      query: { $limit: 5, $select: ['title', 'content', 'postId'], $sort: { createdAt: -1 } },
      select: (hook, parent, depth) => ({ something: { $exists: false }}),
      include: [ ... ],
    }
  */

  // note: parentField & childField are req'd, plus parentItem[parentField} !== undefined .
  // childSchema.select may override their relationship but some relationship must be given.
  if (!childSchema.service || !childSchema.parentField || !childSchema.childField) {
    throw new _feathersErrors2.default.BadRequest('Child schema is missing a required property. (populate)');
  }

  if (childSchema.permissions && !options.checkPermissions(hook, childSchema.service, childSchema.permissions, depth)) {
    throw new _feathersErrors2.default.BadRequest('Permissions for ' + childSchema.service + ' do not allow include. (populate)');
  }

  var nameAs = childSchema.nameAs || childSchema.service;
  parentItem._include.push(nameAs);

  var promise = Promise.resolve().then(function () {
    return childSchema.select ? childSchema.select(hook, parentItem, depth) : {};
  }).then(function (selectQuery) {
    var parentVal = (0, _utils.getByDot)(parentItem, childSchema.parentField);

    if (parentVal === undefined) {
      throw new _feathersErrors2.default.BadRequest('ParentField ' + childSchema.parentField + ' for ' + nameAs + ' depth ' + depth + ' is undefined. (populate)');
    }

    var query = Object.assign({}, childSchema.query, _defineProperty({}, childSchema.childField, Array.isArray(parentVal) ? { $in: parentVal } : parentVal), selectQuery // dynamic options override static ones
    );

    var serviceHandle = hook.app.service(childSchema.service);

    if (!serviceHandle) {
      throw new _feathersErrors2.default.BadRequest('Service ' + childSchema.service + ' is not configured. (populate)');
    }

    return serviceHandle.find({ query: query, _populate: 'skip' });
  }).then(function (result) {
    result = result.data || result;

    if (result.length === 1 && !childSchema.asArray) {
      result = result[0];
    }

    return result;
  });

  if (childSchema.include) {
    promise = promise.then(function (items) {
      return populateItemArray(options, hook, items, childSchema.include, depth);
    });
  }

  return promise.then(function (items) {
    return _defineProperty({}, nameAs, items);
  });
}

// Helpers

function getElapsed(options, startHrtime, depth) {
  if (options.profile === true) {
    var elapsed = process.hrtime(startHrtime);
    return elapsed[0] * 1e9 + elapsed[1];
  } else if (options.profile !== false) {
    return depth; // for testing _elapsed
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(51);


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = __webpack_require__(3);

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Service = function (_Base) {
  _inherits(Service, _Base);

  function Service() {
    _classCallCheck(this, Service);

    return _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).apply(this, arguments));
  }

  _createClass(Service, [{
    key: 'request',
    value: function request(options) {
      var config = {
        url: options.url,
        method: options.method,
        data: options.body,
        headers: _extends({
          Accept: 'application/json'
        }, this.options.headers, options.headers)
      };

      return this.connection.request(config).then(function (res) {
        return res.data;
      }).catch(function (error) {
        var response = error.response || error;

        throw response instanceof Error ? response : response.data || response;
      });
    }
  }]);

  return Service;
}(_base2.default);

exports.default = Service;
module.exports = exports['default'];

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = __webpack_require__(3);

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Service = function (_Base) {
  _inherits(Service, _Base);

  function Service() {
    _classCallCheck(this, Service);

    return _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).apply(this, arguments));
  }

  _createClass(Service, [{
    key: 'request',
    value: function request(options) {
      var fetchOptions = _extends({}, options);

      fetchOptions.headers = _extends({
        Accept: 'application/json'
      }, this.options.headers, fetchOptions.headers);

      if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
      }

      var fetch = this.connection;

      return fetch(options.url, fetchOptions).then(this.checkStatus).then(function (response) {
        if (response.status === 204) {
          return null;
        }

        return response.json();
      });
    }
  }, {
    key: 'checkStatus',
    value: function checkStatus(response) {
      if (response.ok) {
        return response;
      }

      return response.json().then(function (error) {
        error.response = response;
        throw error;
      });
    }
  }]);

  return Service;
}(_base2.default);

exports.default = Service;
module.exports = exports['default'];

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var result = {};

  Object.keys(transports).forEach(function (key) {
    var Service = transports[key];

    result[key] = function (connection) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!connection) {
        throw new Error(key + ' has to be provided to feathers-rest');
      }

      var defaultService = function defaultService(name) {
        return new Service({ base: base, name: name, connection: connection, options: options });
      };

      var initialize = function initialize() {
        if (typeof this.defaultService === 'function') {
          throw new Error('Only one default client provider can be configured');
        }

        this.rest = connection;
        this.defaultService = defaultService;
      };

      initialize.Service = Service;
      initialize.service = defaultService;

      return initialize;
    };
  });

  return result;
};

var _jquery = __webpack_require__(52);

var _jquery2 = _interopRequireDefault(_jquery);

var _superagent = __webpack_require__(54);

var _superagent2 = _interopRequireDefault(_superagent);

var _request = __webpack_require__(53);

var _request2 = _interopRequireDefault(_request);

var _fetch = __webpack_require__(50);

var _fetch2 = _interopRequireDefault(_fetch);

var _axios = __webpack_require__(49);

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transports = {
  jquery: _jquery2.default,
  superagent: _superagent2.default,
  request: _request2.default,
  fetch: _fetch2.default,
  axios: _axios2.default
};

module.exports = exports['default'];

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = __webpack_require__(3);

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Service = function (_Base) {
  _inherits(Service, _Base);

  function Service() {
    _classCallCheck(this, Service);

    return _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).apply(this, arguments));
  }

  _createClass(Service, [{
    key: 'request',
    value: function request(options) {
      var _this2 = this;

      var opts = _extends({
        dataType: options.type || 'json'
      }, {
        headers: this.options.headers || {}
      }, options);

      if (options.body) {
        opts.data = JSON.stringify(options.body);
        opts.contentType = 'application/json';
      }

      delete opts.type;
      delete opts.body;

      return new Promise(function (resolve, reject) {
        _this2.connection.ajax(opts).then(resolve, function (xhr) {
          var error = xhr.responseText;

          try {
            error = JSON.parse(error);
          } catch (e) {
            error = new Error(xhr.responseText);
          }

          error.xhr = error.response = xhr;

          reject(error);
        });
      });
    }
  }]);

  return Service;
}(_base2.default);

exports.default = Service;
module.exports = exports['default'];

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = __webpack_require__(3);

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Service = function (_Base) {
  _inherits(Service, _Base);

  function Service() {
    _classCallCheck(this, Service);

    return _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).apply(this, arguments));
  }

  _createClass(Service, [{
    key: 'request',
    value: function request(options) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.connection(_extends({
          json: true
        }, options), function (error, res, data) {
          if (error) {
            return reject(error);
          }

          if (!error && res.statusCode >= 400) {
            if (typeof data === 'string') {
              return reject(new Error(data));
            }

            data.response = res;

            return reject(_extends(new Error(data.message), data));
          }

          resolve(data);
        });
      });
    }
  }]);

  return Service;
}(_base2.default);

exports.default = Service;
module.exports = exports['default'];

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = __webpack_require__(3);

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Service = function (_Base) {
  _inherits(Service, _Base);

  function Service() {
    _classCallCheck(this, Service);

    return _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).apply(this, arguments));
  }

  _createClass(Service, [{
    key: 'request',
    value: function request(options) {
      var superagent = this.connection(options.method, options.url).set(this.options.headers || {}).set('Accept', 'application/json').set(options.headers || {}).type(options.type || 'json');

      return new Promise(function (resolve, reject) {
        superagent.set(options.headers);

        if (options.body) {
          superagent.send(options.body);
        }

        superagent.end(function (error, res) {
          if (error) {
            try {
              var response = error.response;
              error = JSON.parse(error.response.text);
              error.response = response;
            } catch (e) {}

            return reject(error);
          }

          resolve(res && res.body);
        });
      });
    }
  }]);

  return Service;
}(_base2.default);

exports.default = Service;
module.exports = exports['default'];

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(58);


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = __webpack_require__(8);

var _debug2 = _interopRequireDefault(_debug);

var _feathersCommons = __webpack_require__(2);

var _uberproto = __webpack_require__(6);

var _uberproto2 = _interopRequireDefault(_uberproto);

var _index = __webpack_require__(61);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('feathers:application');
var methods = ['find', 'get', 'create', 'update', 'patch', 'remove'];
var Proto = _uberproto2.default.extend({
  create: null
});

exports.default = {
  init: function init() {
    Object.assign(this, {
      methods: methods,
      mixins: (0, _index2.default)(),
      services: {},
      providers: [],
      _setup: false
    });
  },
  service: function service(location, _service) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    location = (0, _feathersCommons.stripSlashes)(location);

    if (!_service) {
      var current = this.services[location];

      if (typeof current === 'undefined' && typeof this.defaultService === 'function') {
        return this.service(location, this.defaultService(location), options);
      }

      return current;
    }

    var protoService = Proto.extend(_service);

    debug('Registering new service at `' + location + '`');

    // Add all the mixins
    this.mixins.forEach(function (fn) {
      return fn.call(_this, protoService);
    });

    if (typeof protoService._setup === 'function') {
      protoService._setup(this, location);
    }

    // Run the provider functions to register the service
    this.providers.forEach(function (provider) {
      return provider.call(_this, location, protoService, options);
    });

    // If we ran setup already, set this service up explicitly
    if (this._isSetup && typeof protoService.setup === 'function') {
      debug('Setting up service for `' + location + '`');
      protoService.setup(this, location);
    }

    return this.services[location] = protoService;
  },
  use: function use(location) {
    var service = void 0;
    var middleware = Array.from(arguments).slice(1).reduce(function (middleware, arg) {
      if (typeof arg === 'function') {
        middleware[service ? 'after' : 'before'].push(arg);
      } else if (!service) {
        service = arg;
      } else {
        throw new Error('invalid arg passed to app.use');
      }
      return middleware;
    }, {
      before: [],
      after: []
    });

    var hasMethod = function hasMethod(methods) {
      return methods.some(function (name) {
        return service && typeof service[name] === 'function';
      });
    };

    // Check for service (any object with at least one service method)
    if (hasMethod(['handle', 'set']) || !hasMethod(this.methods.concat('setup'))) {
      return this._super.apply(this, arguments);
    }

    // Any arguments left over are other middleware that we want to pass to the providers
    this.service(location, service, { middleware: middleware });

    return this;
  },
  setup: function setup() {
    var _this2 = this;

    // Setup each service (pass the app so that they can look up other services etc.)
    Object.keys(this.services).forEach(function (path) {
      var service = _this2.services[path];

      debug('Setting up service for `' + path + '`');
      if (typeof service.setup === 'function') {
        service.setup(_this2, path);
      }
    });

    this._isSetup = true;

    return this;
  },


  // Express 3.x configure is gone in 4.x but we'll keep a more basic version
  // That just takes a function in order to keep Feathers plugin configuration easier.
  // Environment specific configurations should be done as suggested in the 4.x migration guide:
  // https://github.com/visionmedia/express/wiki/Migrating-from-3.x-to-4.x
  configure: function configure(fn) {
    fn.call(this);

    return this;
  },
  listen: function listen() {
    var server = this._super.apply(this, arguments);

    this.setup(server);
    debug('Feathers application listening');

    return server;
  }
};
module.exports = exports['default'];

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var app = {
    settings: {},

    get: function get(name) {
      return this.settings[name];
    },
    set: function set(name, value) {
      this.settings[name] = value;
      return this;
    },
    disable: function disable(name) {
      this.settings[name] = false;
      return this;
    },
    disabled: function disabled(name) {
      return !this.settings[name];
    },
    enable: function enable(name) {
      this.settings[name] = true;
      return this;
    },
    enabled: function enabled(name) {
      return !!this.settings[name];
    },
    use: function use() {
      throw new Error('Middleware functions can not be used in the Feathers client');
    },
    listen: function listen() {
      return {};
    }
  };

  _uberproto2.default.mixin(_events.EventEmitter.prototype, app);

  return app;
};

var _events = __webpack_require__(9);

var _uberproto = __webpack_require__(6);

var _uberproto2 = _interopRequireDefault(_uberproto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createApplication;

var _feathers = __webpack_require__(59);

var _feathers2 = _interopRequireDefault(_feathers);

var _express = __webpack_require__(57);

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createApplication() {
  return (0, _feathers2.default)(_express2.default.apply(undefined, arguments));
}

createApplication.version = '2.0.1';
module.exports = exports['default'];

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createApplication;

var _uberproto = __webpack_require__(6);

var _uberproto2 = _interopRequireDefault(_uberproto);

var _application = __webpack_require__(56);

var _application2 = _interopRequireDefault(_application);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a Feathers application that extends Express.
 *
 * @return {Function}
 * @api public
 */
function createApplication(app) {
  _uberproto2.default.mixin(_application2.default, app);
  app.init();
  return app;
}
module.exports = exports['default'];

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (service) {
  var app = this;
  var isEmitter = typeof service.on === 'function' && typeof service.emit === 'function';
  var emitter = service._rubberDuck = _rubberduck2.default.emitter(service);

  if (typeof service.mixin === 'function' && !isEmitter) {
    service.mixin(_events.EventEmitter.prototype);
  }

  service._serviceEvents = Array.isArray(service.events) ? service.events.slice() : [];

  // Pass the Rubberduck error event through
  // TODO deal with error events properly
  emitter.on('error', function (errors) {
    service.emit('serviceError', errors[0]);
  });

  Object.keys(eventMappings).forEach(function (method) {
    var event = eventMappings[method];
    var alreadyEmits = service._serviceEvents.indexOf(event) !== -1;

    if (typeof service[method] === 'function' && !alreadyEmits) {
      // The Rubberduck event name (e.g. afterCreate, afterUpdate or afterDestroy)
      var eventName = 'after' + upperCase(method);
      service._serviceEvents.push(event);
      // Punch the given method
      emitter.punch(method, -1);
      // Pass the event and error event through
      emitter.on(eventName, function (results, args) {
        if (!results[0]) {
          // callback without error
          var hook = hookObject(method, 'after', args);
          var data = Array.isArray(results[1]) ? results[1] : [results[1]];

          hook.app = app;
          data.forEach(function (current) {
            return service.emit(event, current, hook);
          });
        } else {
          service.emit('serviceError', results[0]);
        }
      });
    }
  });
};

var _rubberduck = __webpack_require__(72);

var _rubberduck2 = _interopRequireDefault(_rubberduck);

var _events = __webpack_require__(9);

var _feathersCommons = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hookObject = _feathersCommons.hooks.hookObject;
var eventMappings = {
  create: 'created',
  update: 'updated',
  remove: 'removed',
  patch: 'patched'
};

function upperCase(name) {
  return name.charAt(0).toUpperCase() + name.substring(1);
}

module.exports = exports['default'];

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var mixins = [__webpack_require__(63), __webpack_require__(60), __webpack_require__(62)];

  // Override push to make sure that normalize is always the last
  mixins.push = function () {
    var args = [this.length - 1, 0].concat(Array.from(arguments));
    this.splice.apply(this, args);
    return this.length;
  };

  return mixins;
};

module.exports = exports['default'];

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (service) {
  if (typeof service.mixin === 'function') {
    var mixin = {};

    this.methods.forEach(function (method) {
      if (typeof service[method] === 'function') {
        mixin[method] = function () {
          return this._super.apply(this, (0, _feathersCommons.getArguments)(method, arguments));
        };
      }
    });

    service.mixin(mixin);
  }
};

var _feathersCommons = __webpack_require__(2);

module.exports = exports['default'];

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (service) {
  if (typeof service.mixin === 'function') {
    var mixin = {};

    this.methods.forEach(function (method) {
      if (typeof service[method] === 'function') {
        mixin[method] = wrapper;
      }
    });

    service.mixin(mixin);
  }
};

function isPromise(result) {
  return typeof result !== 'undefined' && typeof result.then === 'function';
}

function wrapper() {
  var result = this._super.apply(this, arguments);
  var callback = arguments[arguments.length - 1];

  if (typeof callback === 'function' && isPromise(result)) {
    result.then(function (data) {
      return callback(null, data);
    }, function (error) {
      return callback(error);
    });
  }
  return result;
}

module.exports = exports['default'];

/***/ }),
/* 64 */
/***/ (function(module, exports) {

/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}


module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var atob = __webpack_require__(64);

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  }));
}

module.exports = function(str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  try{
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base64_url_decode = __webpack_require__(65);

function InvalidTokenError(message) {
  this.message = message;
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

module.exports = function (token,options) {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified');
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1;
  try {
    return JSON.parse(base64_url_decode(token.split('.')[pos]));
  } catch (e) {
    throw new InvalidTokenError('Invalid token specified: ' + e.message);
  }
};

module.exports.InvalidTokenError = InvalidTokenError;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
(function() {

var guid = 0, HALT = {}
function createStream() {
	function stream() {
		if (arguments.length > 0 && arguments[0] !== HALT) updateStream(stream, arguments[0])
		return stream._state.value
	}
	initStream(stream)

	if (arguments.length > 0 && arguments[0] !== HALT) updateStream(stream, arguments[0])

	return stream
}
function initStream(stream) {
	stream.constructor = createStream
	stream._state = {id: guid++, value: undefined, state: 0, derive: undefined, recover: undefined, deps: {}, parents: [], endStream: undefined, unregister: undefined}
	stream.map = stream["fantasy-land/map"] = map, stream["fantasy-land/ap"] = ap, stream["fantasy-land/of"] = createStream
	stream.valueOf = valueOf, stream.toJSON = toJSON, stream.toString = valueOf

	Object.defineProperties(stream, {
		end: {get: function() {
			if (!stream._state.endStream) {
				var endStream = createStream()
				endStream.map(function(value) {
					if (value === true) {
						unregisterStream(stream)
						endStream._state.unregister = function(){unregisterStream(endStream)}
					}
					return value
				})
				stream._state.endStream = endStream
			}
			return stream._state.endStream
		}}
	})
}
function updateStream(stream, value) {
	updateState(stream, value)
	for (var id in stream._state.deps) updateDependency(stream._state.deps[id], false)
	if (stream._state.unregister != null) stream._state.unregister()
	finalize(stream)
}
function updateState(stream, value) {
	stream._state.value = value
	stream._state.changed = true
	if (stream._state.state !== 2) stream._state.state = 1
}
function updateDependency(stream, mustSync) {
	var state = stream._state, parents = state.parents
	if (parents.length > 0 && parents.every(active) && (mustSync || parents.some(changed))) {
		var value = stream._state.derive()
		if (value === HALT) return false
		updateState(stream, value)
	}
}
function finalize(stream) {
	stream._state.changed = false
	for (var id in stream._state.deps) stream._state.deps[id]._state.changed = false
}

function combine(fn, streams) {
	if (!streams.every(valid)) throw new Error("Ensure that each item passed to stream.combine/stream.merge is a stream")
	return initDependency(createStream(), streams, function() {
		return fn.apply(this, streams.concat([streams.filter(changed)]))
	})
}

function initDependency(dep, streams, derive) {
	var state = dep._state
	state.derive = derive
	state.parents = streams.filter(notEnded)

	registerDependency(dep, state.parents)
	updateDependency(dep, true)

	return dep
}
function registerDependency(stream, parents) {
	for (var i = 0; i < parents.length; i++) {
		parents[i]._state.deps[stream._state.id] = stream
		registerDependency(stream, parents[i]._state.parents)
	}
}
function unregisterStream(stream) {
	for (var i = 0; i < stream._state.parents.length; i++) {
		var parent = stream._state.parents[i]
		delete parent._state.deps[stream._state.id]
	}
	for (var id in stream._state.deps) {
		var dependent = stream._state.deps[id]
		var index = dependent._state.parents.indexOf(stream)
		if (index > -1) dependent._state.parents.splice(index, 1)
	}
	stream._state.state = 2 //ended
	stream._state.deps = {}
}

function map(fn) {return combine(function(stream) {return fn(stream())}, [this])}
function ap(stream) {return combine(function(s1, s2) {return s1()(s2())}, [stream, this])}
function valueOf() {return this._state.value}
function toJSON() {return this._state.value != null && typeof this._state.value.toJSON === "function" ? this._state.value.toJSON() : this._state.value}

function valid(stream) {return stream._state }
function active(stream) {return stream._state.state === 1}
function changed(stream) {return stream._state.changed}
function notEnded(stream) {return stream._state.state !== 2}

function merge(streams) {
	return combine(function() {
		return streams.map(function(s) {return s()})
	}, streams)
}

function scan(reducer, seed, stream) {
	var newStream = combine(function (s) {
		return seed = reducer(seed, s._state.value)
	}, [stream])

	if (newStream._state.state === 0) newStream(seed)

	return newStream
}

function scanMerge(tuples, seed) {
	var streams = tuples.map(function(tuple) {
		var stream = tuple[0]
		if (stream._state.state === 0) stream(undefined)
		return stream
	})

	var newStream = combine(function() {
		var changed = arguments[arguments.length - 1]

		streams.forEach(function(stream, idx) {
			if (changed.indexOf(stream) > -1) {
				seed = tuples[idx][1](seed, stream._state.value)
			}
		})

		return seed
	}, streams)

	return newStream
}

createStream["fantasy-land/of"] = createStream
createStream.merge = merge
createStream.combine = combine
createStream.scan = scan
createStream.scanMerge = scanMerge
createStream.HALT = HALT

if (true) module["exports"] = createStream
else if (typeof window.m === "function" && !("stream" in window.m)) window.m.stream = createStream
else window.m = {stream : createStream}

}());


/***/ }),
/* 68 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000
var m = s * 60
var h = m * 60
var d = h * 24
var y = d * 365.25

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {}
  var type = typeof val
  if (type === 'string' && val.length > 0) {
    return parse(val)
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ?
			fmtLong(val) :
			fmtShort(val)
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
}

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str)
  if (str.length > 10000) {
    return
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
  if (!match) {
    return
  }
  var n = parseFloat(match[1])
  var type = (match[2] || 'ms').toLowerCase()
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y
    case 'days':
    case 'day':
    case 'd':
      return n * d
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n
    default:
      return undefined
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd'
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h'
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm'
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's'
  }
  return ms + 'ms'
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms'
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name
  }
  return Math.ceil(ms / n) + ' ' + name + 's'
}


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stringify = __webpack_require__(71);
var parse = __webpack_require__(70);
var formats = __webpack_require__(15);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);

var has = Object.prototype.hasOwnProperty;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    parameterLimit: 1000,
    plainObjects: false,
    strictNullHandling: false
};

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

    for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];
        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos));
            val = options.decoder(part.slice(pos + 1));
        }
        if (has.call(obj, key)) {
            obj[key] = [].concat(obj[key]).concat(val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function parseObjectRecursive(chain, val, options) {
    if (!chain.length) {
        return val;
    }

    var root = chain.shift();

    var obj;
    if (root === '[]') {
        obj = [];
        obj = obj.concat(parseObject(chain, val, options));
    } else {
        obj = options.plainObjects ? Object.create(null) : {};
        var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
        var index = parseInt(cleanRoot, 10);
        if (
            !isNaN(index) &&
            root !== cleanRoot &&
            String(index) === cleanRoot &&
            index >= 0 &&
            (options.parseArrays && index <= options.arrayLimit)
        ) {
            obj = [];
            obj[index] = parseObject(chain, val, options);
        } else {
            obj[cleanRoot] = parseObject(chain, val, options);
        }
    }

    return obj;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

module.exports = function (str, opts) {
    var options = opts || {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);
var formats = __webpack_require__(15);

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
        return prefix;
    }
};

var toISO = Date.prototype.toISOString;

var defaults = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix);
            return [formatter(keyValue) + '=' + formatter(encoder(obj))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            values = values.concat(stringify(
                obj[key],
                generateArrayPrefix(prefix, key),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        } else {
            values = values.concat(stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        }
    }

    return values;
};

module.exports = function (object, opts) {
    var obj = object;
    var options = opts || {};

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
    if (typeof options.format === 'undefined') {
        options.format = formats.default;
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        keys = keys.concat(stringify(
            obj[key],
            key,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encode ? encoder : null,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter,
            encodeValuesOnly
        ));
    }

    return keys.join(delimiter);
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var events = __webpack_require__(9);
var utils = __webpack_require__(73);
var wrap = exports.wrap = {
  /**
   * Wrap an anonymous or named function to notify an Emitter and
   * return the wrapper function.
   * @param {events.EventEmitter} emitter The emitter to notify
   * @param {Function} fn The function to wrap
   * @param {String} name The optional name
   */
  fn: function(emitter, fn, strict, name, scope) {
    var wrapped = function() {
      var result;
      utils.emitEvents(emitter, 'before', name, [arguments, this, name]);

      try {
        result = fn.apply(scope || this, arguments);
      } catch (e) {
        utils.emitEvents(emitter, 'error', name, [ e, arguments, this, name ]);
        throw e;
      }

      utils.emitEvents(emitter, 'after', name, [ result, arguments, this, name ]);
      return result;
    };

    if (strict) {
      eval('wrapped = ' + utils.addArgs(wrapped.toString(), fn.length));
    }

    return wrapped;
  },
  /**
   * Wrap an anonymous or named function that calls a callback asynchronously
   * to notify an Emitter and return the wrapper function.
   * @param {events.EventEmitter} emitter The emitter to notify
   * @param {Function} fn The function to wrap
   * @param {Integer} position The position of the callback in the arguments
   * array (defaults to 0). Set to -1 if the callback is the last argument.
   * @param {String} name The optional name
   */
  async: function(emitter, fn, position, strict, name, scope) {
    var wrapped = function() {
      var pos = position == -1 ? arguments.length - 1 : (position || 0);
      var callback = arguments[pos];
      var context = this;
      var methodArgs = arguments;
      var callbackWrapper = function() {
        try {
          callback.apply(context, arguments);
        } catch (e) {
          utils.emitEvents(emitter, 'error', name, [ e, methodArgs, context, name ]);
          throw e;
        }
        var eventType = arguments[0] instanceof Error ? 'error' : 'after';
        utils.emitEvents(emitter, eventType, name, [ arguments, methodArgs, context, name ]);
      };

      utils.emitEvents(emitter, 'before', name, [ methodArgs, this, name ]);
      methodArgs[pos] = callbackWrapper;

      try {
        return fn.apply(scope || this, methodArgs);
      } catch (e) {
        utils.emitEvents(emitter, 'error', name, [ e, methodArgs, context, name ]);
        throw e;
      }
    };

    if (strict) {
      eval('wrapped = ' + utils.addArgs(wrapped.toString(), fn.length));
    }

    return wrapped;
  }
};

var Emitter = exports.Emitter = function(obj) {
  this.obj = obj;
};

Emitter.prototype = Object.create(events.EventEmitter.prototype);

/**
 * Punch a method with the given name, with
 * @param {String | Array} method The name of the method or a list of
 * method names.
 * @param {Integer} position The optional position of the asynchronous callback
 * in the arguments list.
 */
Emitter.prototype.punch = function(method, position, strict) {
  if (Array.isArray(method)) {
    var self = this;
    method.forEach(function(method) {
      self.punch(method, position, strict);
    });
  } else {
    var old = this.obj[method];
    if (typeof old == 'function') {
      this.obj[method] = (!position && position !== 0) ?
        wrap.fn(this, old, strict, method) :
        wrap.async(this, old, position, strict, method);
    }
  }
  return this;
};

exports.emitter = function(obj) {
  return new Emitter(obj);
};


/***/ }),
/* 73 */
/***/ (function(module, exports) {

exports.toBase26 = function(num) {
  var outString = '';
  var letters = 'abcdefghijklmnopqrstuvwxyz';
  while (num > 25) {
    var remainder = num % 26;
    outString = letters.charAt(remainder) + outString;
    num = Math.floor(num / 26) - 1;
  }
  outString = letters.charAt(num) + outString;
  return outString;
};

exports.makeFakeArgs = function(len) {
  var argArr = [];
  for (var i = 0; i < len; i++) {
    argArr.push(exports.toBase26(i));
  }
  return argArr.join(",");
};

exports.addArgs = function(fnString, argLen) {
  return fnString.replace(/function\s*\(\)/, 'function(' + exports.makeFakeArgs(argLen) + ')');
};

exports.emitEvents = function(emitter, type, name, args) {
  var ucName = name ? name.replace(/^\w/, function(first) {
    return first.toUpperCase();
  }) : null;

  emitter.emit.apply(emitter, [type].concat(args));
  if (ucName) {
    emitter.emit.apply(emitter, [type + ucName].concat(args));
  }
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17), __webpack_require__(5)))

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = __webpack_require__(34);
var RequestBase = __webpack_require__(77);
var isObject = __webpack_require__(10);
var isFunction = __webpack_require__(76);
var ResponseBase = __webpack_require__(78);
var shouldRetry = __webpack_require__(79);

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function(method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only verison of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
      status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD'
      ? this._parseBody(this.text ? this.text : this.xhr.response)
      : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str){
  var parse = request.parse[this.type];
  if(this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
      }
    } catch(e) {
      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (typeof pass === 'object' && pass !== null) { // pass is optional and can substitute for options
    options = pass;
  }
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto',
    }
  }

  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;
      
    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
    break;  
  }
  return this;
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, options){
  if (file) {
    if (this._data) {
      throw Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  // console.log(this._retries, this._maxRetries)
  if (this._maxRetries && this._retries++ < this._maxRetries && shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function(){
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */

Request.prototype._appendQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if (isFunction(this._sort)) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
}

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._appendQueryString();

  return this._end();
};

Request.prototype._end = function() {
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function(){
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  }
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;

    if (this.header.hasOwnProperty(field))
      xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn){
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn){
  var req = request('DELETE', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Check if `fn` is a function.
 *
 * @param {Function} fn
 * @return {Boolean}
 * @api private
 */
var isObject = __webpack_require__(10);

function isFunction(fn) {
  var tag = isObject(fn) ? Object.prototype.toString.call(fn) : '';
  return tag === '[object Function]';
}

module.exports = isFunction;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = __webpack_require__(10);

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout(){
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, read, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options){
  if (!options || 'object' !== typeof options) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for(var option in options) {
    switch(option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;
      case 'response':
        this._responseTimeout = options.response;
        break;
      default:
        console.warn("Unknown timeout option", option);
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count){
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  return this;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function() {
  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
      self.end(function(err, res){
        if (err) innerReject(err); else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
}

RequestBase.prototype.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
}

RequestBase.prototype.ok = function(cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function(name, val) {

  // name should be either a string or an object.
  if (null === name ||  undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function(on){
  // This is browser-only functionality. Node side is no-op.
  if(on==undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function(){
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};


/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function(data){
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};


/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function(sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function(reason, timeout, errno){
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function() {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function(){
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
}


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var utils = __webpack_require__(80);

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function(field){
    return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function(header){
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    } catch (err) {
        // ignore
    }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function(status){
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

    // sugar
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
};


/***/ }),
/* 79 */
/***/ (function(module, exports) {

var ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'EADDRINFO',
  'ESOCKETTIMEDOUT'
];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
module.exports = function shouldRetry(err, res) {
  if (err && err.code && ~ERROR_CODES.indexOf(err.code)) return true;
  if (res && res.status && res.status >= 500) return true;
  // Superagent timeout
  if (err && 'timeout' in err && err.code == 'ECONNABORTED') return true;
  if (err && 'crossDomain' in err) return true;
  return false;
};


/***/ }),
/* 80 */
/***/ (function(module, exports) {


/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function(str){
  return str.split(/ *, */).reduce(function(obj, str){
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function(header, shouldStripCookie){
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  if (shouldStripCookie) {
    delete header['cookie'];
  }
  return header;
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(74);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/24/17.
 */
const m = __webpack_require__(0);
const appService = __webpack_require__(1)
const orderHistory = {
        oninit: function (vnode) {

            orderHistory.get_data(vnode)
        },
        data: {
            historyLog: [],
            orderCode: ""
        },
        get_data: (vnode) => {
            vnode.attrs.orderCode ?
                appService.service('history-log').find({
                    query: {
                        $limit: 1000,
                        orderCode: vnode.attrs.orderCode
                    }
                }).then(
                    result => {
                        vnode.attrs.historyLog = result.data;
                        m.redraw();
                    }
                ).catch(
                    err => console.log(err)
                ) : ""
        },
        view: vnode => m('.db.bg-black-10',
            m('.db.f5.underline', 'Lịch sử hóa đơn'),
            vnode.attrs.historyLog ?
                m('.db.pa2',
                    m('ul.db', {
                            style: {
                                'max-height': '150px',
                                'overflow-y': 'scroll'
                            }
                        },
                        vnode
                            .attrs.historyLog.map(
                            msg => m('li',
                                m('b', `${msg.sender}`),
                                m('span', `(${(new Date(msg.createdAt)).toLocaleString()}) : `),
                                m('span', `${msg.text}`)
                            )
                        )
                    ),
                    m('form', {
                            onsubmit: e => {
                                e.preventDefault()
                                appService.service('history-log').create({
                                    sender: 'Khách',
                                    orderCode: vnode.attrs.orderCode,
                                    text: e.target.message.value
                                }).then(result => {
                                    orderHistory.get_data(vnode)
                                }).catch(err => console.log(err))
                            }
                        },
                        m('input[type=text][name=message]', {
                            placeholder: "Tin nhắn của bạn"
                        }),
                        m('input[type=submit][value=Gửi]')
                    )
                ) :
                ""
        )
    }
    ;
//sender , orderCode , createdAt, text
module.exports = orderHistory;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/25/17.
 */
const m = __webpack_require__(0);
const header = __webpack_require__(18)
const body = __webpack_require__(84)
const orderCompact = {
    oninit: vnode => {
        //something
        console.log(vnode.attrs.list)
    },
    data: {},
    view: vnode => m('table.ba.w-100.db',
        m(header),
        vnode.attrs.data.list.map(c => m(body, {data:c}))
    )
};

module.exports = orderCompact;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/25/17.
 */
const m = __webpack_require__(0);
const EXRATE = 3.1
const statusList = __webpack_require__(19)
const orderDetail = __webpack_require__(86)
const addressData = __webpack_require__(7)

const orderCompact = {

    oninit: function (vnode) {
        vnode.attrs.viewDetail = false
    },
    data: {
        cart: {}
    },
    cal_totalPrice: function (prdList) {
        if (prdList) {
            let totalPrice = 0;
            let totalQuantity = 0;
            prdList.forEach(function (t) {
                totalQuantity = totalQuantity + Number(t.itemQty);
                totalPrice = totalPrice + t.itemQty * t.itemPrc
            });
            return {totalPrice: totalPrice, totalQuantity: totalQuantity};
        } else {
            return {totalPrice: 0, totalQuantity: 0};
        }
    },

    view: function (vnode) {
        return vnode.attrs ? [m('tr',
            m('td', vnode.attrs.data.orderCode),
            m('td', vnode.attrs.data.userName),
            m('td', vnode.attrs.data.phone),
            //m('td', vnode.attrs.data.address.toString()),
            m('td', vnode.attrs.data.payBy),
            m('td', orderCompact.cal_totalPrice(vnode.attrs.data.products).totalQuantity),
            m('td', `${addressData[vnode.attrs.data.address.province].name} ,${addressData[vnode.attrs.data.address.province].cities[vnode.attrs.data.address.city]}, ${vnode.attrs.data.address.other}`),
            m('td', (orderCompact.cal_totalPrice(vnode.attrs.data.products).totalPrice * EXRATE).toLocaleString() + '/' + orderCompact.cal_totalPrice(vnode.attrs.data.products).totalPrice.toLocaleString()),
            m('td', !vnode.attrs.data.viewDeatail ? `${vnode.attrs.data.status}` :
                m('select',
                    {
                        onchange: e => {
                            vnode.attrs.data.status = e.target.value

                        }
                    },
                    statusList.map(status => m('option', {
                        value: status.text,
                        selected: status.text == vnode.attrs.data.status,

                    }, status.text))
                )
            ),
            m('td', m('span.underline.pointer.hover-blue',
                {onclick: e => vnode.attrs.data.viewDeatail = !vnode.attrs.data.viewDeatail}, 'Chi tiết'))
        ),
            vnode.attrs.data.viewDeatail ? m('tr',
                m('td[colspan=9].pb3.bg-washed-yellow',
                    m(orderDetail, {data: vnode.attrs.data}))
            ) : ""
        ] : ""
    }
};

module.exports = orderCompact;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/25/17.
 */
const m = __webpack_require__(0);
const stream = __webpack_require__(14)
const client = __webpack_require__(1)
const statusList = __webpack_require__(19)
let query = {
    data: {
        status: {
            $in: []
        }
        ,
        createdAt: {
            $lte: '',
            $gte: ''
        }
    },
    run: () => client.service('order').find({
            query: query.data
        }
    )
}
let search_text = {
    query: {
        $or: [
            {orderCode: ''},
            {phone: ''}
        ]
    },
    run: () => client.service('order').find({
            query: search_text.query
        }
    )
}
function default_date_now(durationToPast) {
    let change = durationToPast || 0
    let d = new Date(new Date().getTime() - change)
    let day = d.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
    let month = (d.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
    let year = d.getFullYear()
    return `${year}-${month}-${day}`

}
const form = {
    status: {
        allchecked: false
    },
    createdAt: {
        min: default_date_now(60 * 24 * 60 * 60 * 1000),
        max: default_date_now()
    }
}
const orderControl = {
    oninit: function (vnode) {

    },
    view: vnode => m(
        '.db.w-100.pa2',
        m('.db.w-100.f5', {
            onsubmit: e => {
                e.preventDefault()
                search_text.query.$or[0].orderCode = e.target.searchString.value
                search_text.query.$or[1].phone = e.target.searchString.value
                //run query
                console.log(search_text.query)
                search_text.run()
                    .then(result => {
                        vnode.attrs.data.list = result.data
                        console.log(vnode.attrs.data)
                        m.redraw()
                    })
                    .catch(console.log)
            }

        }, m('form', m('input[type=search][placeholder=Tìm nhanh][name=searchString]'))),
        m('hr'),
        m('form#queryOrders',
            {
                onsubmit: e => {
                    e.preventDefault()
                    let status = []
                    e.target.status.forEach(child => {
                        child.checked ? status.push(child.value) : ""
                    })
                    //set query
                    query.data.status.$in = status.length == 0 ? ["NOTHING"] : status
                    query.data.createdAt.$gte = new Date(e.target.dateMin.value)
                    query.data.createdAt.$lte = new Date(e.target.dateMax.value)
                    //run query
                    console.log(query.data)
                    query.run()
                        .then(result => {
                            vnode.attrs.data.list = result.data
                            console.log(vnode.attrs.data)
                            m.redraw()
                        })
                        .catch(console.log)
                }
            }
            ,
            m('.db.w-100.f5.underline.b1', 'Trạng thái'),

            m('label.f5.db.mb1', m('input[type=checkbox][name=statusAll]', {
                checked: form.status.allchecked,

                onchange: e => {
                    form.status.allchecked = e.target.checked
                    document.getElementById('queryOrders').status.forEach(child => {
                        child.checked = form.status.allchecked
                    })
                }
            }), m('span.mt1', 'Tất cả')),
            statusList.map(status => m('label.f5.db.mb1', m('input[type=checkbox][name=status]', {
                value: status.text,
                checked: form.status.allchecked
            }), m('span.mt1', status.text))),

            // m('.db.w-100.f5.underline.mb1', 'Giá trị hóa đơn'),
            // m('label.f5.db.mb1', m('input[type=range]'), m('span.mt1', 'Tối đa')),
            // m('label.f5.db.mb1', m('input[type=range]'), m('span.mt1', 'Tối thiểu')),

            m('.db.w-100.f5.underline.,b1', 'Thời gian'),
            m('label.f5.db.mb1', m('span.mt1', 'Từ ngày'), m('input[type=date][name=dateMin]', {
                value: form.createdAt.min,
                onchange: e => {
                    form.createdAt.min = e.target.value
                }
            })),
            m('label.f5.db.mb1', m('span.mt1', 'Đến ngày'), m('input[type=date][name=dateMax]', {
                value: form.createdAt.max,
                onchange: e => {
                    form.createdAt.max = e.target.value
                }
            })),

            m('hr'),

            m('button', 'Lọc')
        )
    )

};

module.exports = orderControl;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/25/17.
 */
const m = __webpack_require__(0);
const clientService = __webpack_require__(1)
const orderCompactBody = __webpack_require__(18)
const product = __webpack_require__(88)
const orderHistory = __webpack_require__(82)
const orderNote = __webpack_require__(87)
const otherInfo = __webpack_require__(101)
const orderDetail = {
    oninit: function (vnode) {

    },
    data: {},
    get_data: () => {
    },
    view: function (vnode) {
        return [
            m('.db.fl.w-50', vnode.attrs.data.products.map(p => m(product, {product: p}))),
            m('.db.fl.w-50',
                m(otherInfo, {data:vnode.attrs.data}),
                m(orderNote, {data: vnode.attrs.data}),
                m(orderHistory, vnode.attrs.data),

                m('button', {
                    onclick: e => {
                        console.log(vnode.attrs.data)
                        let cf = confirm('Bạn có muốn cập nhập thay đổi')
                        let id = vnode.attrs.data._id
                        let data = vnode.attrs.data
                        cf ? clientService.service('order').update(id, data)
                            .then(clientService.service('history-log').create({
                                sender: 'Hệ Thống',
                                orderCode: vnode.attrs.data.orderCode,
                                text: `Cập nhập----${vnode.attrs.data.status}`
                            }))
                            .then(() => {
                                clientService.service('history-log').find({
                                    query: {
                                        $limit: 1000,
                                        orderCode: vnode.attrs.data.orderCode
                                    }
                                }).then(
                                    result => {
                                        vnode.attrs.data.historyLog = result.data;
                                        m.redraw();
                                    }
                                ).catch(
                                    err => console.log(err)
                                )
                            })
                            .catch(console.log)
                            : ""
                    }
                }, `Cập nhập`)
            )

        ]
    }
};

module.exports = orderDetail;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/30/17.
 */
const m = __webpack_require__(0);

const adminNote = {
    oninit: vnode => {
        //something
    }
    ,
    view: vnode => m(
        '.db.bg-black-10',
        m('.db.f5.underline', 'Ghi chú'),
        m('textarea.db.w-100', {
                placeholder: "Ghi chú riêng của đơn hàng",
                style: {
                    overflow: "hidden"
                },
                value : vnode.attrs.data.adminNote,
                oninput: e => {
                    vnode.attrs.data.adminNote = e.target.value
                    e.target.style.height = `1px`
                    e.target.style.height = (e.target.scrollHeight + 25) + 'px'
                }
            }
        )
    )
};

module.exports = adminNote;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/5/17.
 */
const m = __webpack_require__(0);
const service = __webpack_require__(1);


const product = {
    oninit: function (vnode) {
        if (vnode.attrs.product.itemLink != '') {
            product.view = product.defaultView;
        } else {
            product.view = product.emptyView;
        }
    },

    data: {},
    view: function (vnode) {
        return m('h2', 'is loading')
    },
    //
    defaultView: function (vnode) {
        return m('.fl.w-100.mb2.mt2',
            m('.fl.w-10-l.w-10-m.w-20.mb1',
                m('a.db.w-100.ba', {href: vnode.attrs.product.itemLink}, m('img.db.w-100', {src: vnode.attrs.product.itemImg}))
            ),
            m('.fl.w-90-l.w-90-m.w-80.pa2.f6',
                [
                    m('.fl.w-60-l.w-60-m.w-100.pa2',

                        m('.db', `Màu sắc - Size: ${vnode.attrs.product.itemDetail.color_size}`),

                        m('.db', `Thành tiền: NDT ${vnode.attrs.product.itemQty * vnode.attrs.product.itemPrc} --- VND ${vnode.attrs.product.itemQty * vnode.attrs.product.itemPrc * 3.1}`),
                        m('.db', m('a', {href: vnode.attrs.product.itemLink}, "Link sản phẩm")),
                        m('hr'),
                        m('.db', "Tin nhăn"),
                        m('.db.w-100', vnode.attrs.product.msg)
                    ),


                    m('.fl.w-20-l.w-20-m.w-50', m('.db', 'Đơn giá'), m('.db', vnode.attrs.product.itemPrc)),
                    m('.fl.w-20-l.w-20-m.w-50',
                        m('.db',
                            m('.db', 'Số lượng'),
                            m('.db', m('input[type=number].db.w-100', {
                                    value: vnode.attrs.product.itemQty,
                                    oninput: e => {
                                        vnode.attrs.product.itemQty = e.target.value
                                    }
                                })
                            )
                        )
                    )
                    //m('tr', m('td.tr', '='), m('td', vnode.attrs.product.itemQty * vnode.attrs.product.itemPrc)),
                ]
            )
        )
    },
    emptyView: function (vnode) {
        return m('h2', "Bạn không có sản phẩm nào")
    }

};


module.exports = product;

// let product = function (ordPrd) {
//   this.shop = ordPrd.shop;
//
//   this.itemId = ordPrd.itemId;
//   this.itemName = ordPrd.itemName;
//   this.itemLink = ordPrd.itemLink;
//   this.itemImg = ordPrd.itemImg;
//   this.itemPrc = ordPrd.itemPrc;
//   this.itemQty = ordPrd.itemQty;
//
//   this.msg = ordPrd.msg;
//
//   this.itemDetail = ordPrd.itemDetail;
//
// };


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/13/17.
 */
const m = __webpack_require__(0);
const client = __webpack_require__(1)
const provinces = __webpack_require__(7);
let orderInfo = {
    oninit: function (vnode) {
        client.authenticate().then(function () {
            orderInfo.isLogin = true;
            client.service('users')
                .find()
                .then(console.log)
                .catch(console.log)
        }).catch(function (err) {
            orderInfo.isLogin = false;
            console.log(err)
        });
        Object.assign(vnode.attrs.cart, orderInfo.data)
        client.service('users').find()
            .then(result => {
                orderInfo.data = result.data[0].userInfo
                vnode.attrs.cart.userId = result.data[0]._id
                Object.assign(vnode.attrs.cart, orderInfo.data)
                console.log(vnode.attrs.cart)
            }).then(m.redraw)
            .catch(console.log)
        //sau nay dung cho tu dien thong tin
        //orderInfo.data = {}

    },

    isLogin: false,
    buyAsGuest: true,
    data: {
        userName: "",
        phone: "",
        address: {
            province: "HANOI",
            city: "QUANBADINH",
            other: ""
        }
    },
    set_orderData: function (order) {
        order.userName = orderInfo.data.userName
        order.phone = orderInfo.data.phone
        order.address = {
            city: orderInfo.data.address.city,
            province: order.address.province
        }

    },
    formSeclectData: {
        get_provinceList: function () {
            let provinceList = [];
            for (key in provinces) {
                provinceList.push(key);
            }
            return provinceList
        },
        get_cityList: function (province) {
            console.log(province)
            let cityList = [];
            for (key in provinces[province].cities) {
                cityList.push(key);
            }
            return cityList
        }
    },
    view: function (vnode) {
        return m('.db',

            m('.f5.b.mt3', "Thông tin của bạn"),
            m('hr'),
            m('form', {
                    onsubmit: function (e) {
                        e.preventDefault();
                        vnode.attrs.step(2);
                        vnode.attrs.switch_view();
                    }
                },
                [
                    m('label.db.ma2',
                        m('.db', "Tên của bạn"),
                        m('input.db.w-100', {
                            required: true,
                            value: vnode.attrs.cart.userName,
                            oninput: function (e) {
                                vnode.attrs.cart.userName = e.target.value
                            }
                        })
                    ),

                    m('label.db.ma2',
                        m('.db', "Số điện thoại"),
                        m('input.db.w-100[type=tel]', {
                            required: true,
                            value: vnode.attrs.cart.phone,
                            oninput: function (e) {
                                vnode.attrs.cart.phone = e.target.value
                            },
                            onblur: function () {
                                vnode.attrs.update();
                            }
                        })
                    ),

                    m('label.db.ma2',
                        m('.db', "Tinh"),
                        m('select.db.w-100', {
                                value: vnode.attrs.cart.address.province,
                                onchange: function (e) {
                                    vnode.attrs.cart.address.province = e.target.value;
                                    vnode.attrs.cart.address.city = orderInfo.formSeclectData.get_cityList(vnode.attrs.cart.address.province)[0];

                                },
                                onblur: function () {
                                    vnode.attrs.update();
                                }
                            },
                            orderInfo.formSeclectData.get_provinceList().map((c) => m('option', {
                                value: c
                            }, provinces[c].name))
                        )
                    ),

                    m('label.db.ma2',
                        m('.db', "Huyện"),
                        m('select.db.w-100', {
                                value: vnode.attrs.cart.address.city,
                                onchange: function (e) {
                                    vnode.attrs.cart.address.city = e.target.value;
                                    // console.log(orderInfo.data.address)
                                },
                                onblur: function () {
                                    vnode.attrs.update();
                                }
                            },
                            orderInfo.formSeclectData.get_cityList(vnode.attrs.cart.address.province).map((p) => m('option', {
                                value: p,

                            }, provinces[vnode.attrs.cart.address.province].cities[p]))
                        )
                    ),

                    m('label.db.ma2',
                        m('.db', "Địa chỉ"),
                        m('textarea.w-100', {
                            required: true,
                            value: vnode.attrs.cart.address.other,
                            oninput: function (e) {
                                vnode.attrs.cart.address.other = e.target.value
                            },
                            onblur: function () {
                                vnode.attrs.update();
                            }
                        })
                    ),

                    m('label.db.ma2',
                        m('.db', "Tin nhắn"),
                        m('textarea.db.w-100', {
                            oninput: function (e) {
                                vnode.attrs.cart.message = e.target.value;
                            },
                            onblur: function (e) {
                                vnode.attrs.update();
                            }
                        })
                    ),
                    m('p.db.pa2.underline.pointer', {
                        onclick: function (e) {
                            vnode.attrs.step(0);
                            vnode.attrs.switch_view();
                        }
                    }, "Quay lại giỏ hàng"),
                    m('input.db[type=submit].pa2.br3.w-100.bg-orange.white', {value: 'Tiến hành thanh toán'})
                ])
        )

    }
};

module.exports = orderInfo;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/14/17.
 */
var m = __webpack_require__(0);

var byAccount = {
    oninit: function () {

    },
    view: function () {
        return [

          m('.db.pa3', "Bạn cần nạp tiền và đăng nhập vào tài khoản")

      ]
    }
};

module.exports = byAccount;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/14/17.
 */
var m = __webpack_require__(0);

var byBankDeposit = {
    oninit: function () {

    },
    bankData: [
        {
            bankName: "Techcombank",
            accountNumber: "0123456789",
            accountName: "Dinh Hoang Minh"
        }, {
            bankName: "BIDV",
            accountNumber: "0123456789",
            accountName: "Dinh Hoang Minh"
        }, {
            bankName: "Agribank",
            accountNumber: "0123456789",
            accountName: "Dinh Hoang Minh"
        }, {
            bankName: "Techcombank",
            accountNumber: "0123456789",
            accountName: "Dinh Hoang Minh"
        }
    ],
    currentBank: "Techcombank",
    content: function (bank) {
        return m('ul',
            m('li', `Ngân hàng : ${bank.bankName}`),
            m('li', `Số tài khoản : ${bank.accountNumber}`),
            m('li', `Chủ tài khoản : ${bank.accountName}`)
        )
    },
    view: function () {
        return [
            m('.db.pa3',
                m('p', 'Lựa chọn ngân hàng của bạn'),
                m('select', {
                    onchange: function (e) {
                        byBankDeposit.currentBank = e.target.value;
                        console.log(byBankDeposit.currentBank)
                    }
                }, byBankDeposit.bankData.map(b => m('option',{value: b.bankName}, b.bankName))),
                m('p', byBankDeposit.content(byBankDeposit.bankData.find(b => (b.bankName == byBankDeposit.currentBank))))
            )
        ]
    }
};

module.exports = byBankDeposit;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/14/17.
 */
var m = __webpack_require__(0);

var byInCenter = {
    oninit: function (vnode) {

    },
    view: function (vnode) {
        return [

            m('.db.pa3', m.trust(`
        <p>Bước 1: Quý khách hãy đến nạp tiền trực tiếp tại trụ sở của nhập hàng tiết kiệm</p> 
        <p>Địa chỉ: 
        <b>12 Ngã Tư Sở - Hà Nội</b> </p>
        <p>Bước 2: Sau đó cung cấp mã đơn hàng <b>${vnode.attrs.orderCode}</b> hoặc <b>số điện thoại</b> của quý khách cho nhân viên </p>
        <p>Bước 3: Nạp tiền và nhận hóa đơn</p>
        
      `))
        ]
    }

};

module.exports = byInCenter;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/14/17.
 */
var m = __webpack_require__(0);

var byMobileCard = {
    oninit: function () {

    },
    view: function () {
        return [
            m('.db.pa3',
                m('label.db.w-100', m('span', 'Mã thẻ cào'), m('input')),
                m('label.db.w-100', m('span', 'Số seri'), m('input'))
            )
        ]
    }
};

module.exports = byMobileCard;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/14/17.
 */
const m = __webpack_require__(0);
const payment = {
    byAccount: __webpack_require__(90),
    byBankDeposit: __webpack_require__(91),
    byInCenter: __webpack_require__(92),
    byMobileCard: __webpack_require__(93)
};


// let tabs = {
//   oninit: function () {
//
//   },
//   choosenMethod: 0,
//   view: function () {
//     return m('.db',
//       ["Chuyển khoản", "Thẻ cào", "Nạp tiền trực tiếp", "Tài khoản tiết kiệm"].map(
//         (tab) => m('button.pa2', tab)
//       ))
//   }
// };

let paymentMethod = {
    oninit: function (vnode) {

    vnode.attrs.cart.payBy = paymentMethod.method[1].text
    },
    choosenPayment: "default",
    method: [
        {
            payby: 'account',
            text: 'Thanh toán qua tài khoản nhập hàng tiết kiệm'
        }, {
            payby: 'center',
            text: 'Thanh toán tại cửa hàng'
        }, {
            payby: 'bank',
            text: 'Chuyển khoản ngân hàng'
        }, {
            payby: 'mobile',
            text: 'Thanh toán qua thẻ cào điện thoại *(Đang hoàn thiện)'
        }],
    paymentView: function () {
        if (paymentMethod.choosenPayment == "default") {
            return payment.byInCenter

        } else if (paymentMethod.choosenPayment == "account") {
            return payment.byAccount

        } else if (paymentMethod.choosenPayment == "center") {
            return payment.byInCenter

        } else if (paymentMethod.choosenPayment == "bank") {
            return payment.byBankDeposit

        } else if (paymentMethod.choosenPayment == "mobile") {
            return payment.byMobileCard

        } else {
            return payment.byInCenter

        }
    },

    view: function (vnode) {
        return m('.db.f5',
            m('.db.f5.mt3.b ', "Phương thức thanh toán"),
            m('hr'),
            //tabs container
            m('.db.pa3', paymentMethod.method.map(
                p => m('label.db',
                    {
                        onclick: function (e) {
                            paymentMethod.choosenPayment = p.payby;
                            vnode.attrs.cart.payBy = p.text;
                            console.log(paymentMethod.choosenPayment)
                        }
                    }, m('input[type=radio][name=payment]',{checked: vnode.attrs.cart.payBy==p.text}), m('span', p.text)
                )
            )),
            m('.db', m('.db', m(paymentMethod.paymentView(), vnode.attrs.cart))
            )
        )
    }


};

module.exports = paymentMethod;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/17/17.
 */
const m = __webpack_require__(0);
const cartStep = {
    oninit: function (vnode) {
        cartStep.step = vnode.attrs.step;

    },
    step: 0,
    //chon san pham
    //Nhap thong tin
    //Phuong thuc thanh toan
    //Cam on
    //ma don hang 170417-stt
    view: function (vnode) {
        return m('ul.list.breadcrumb', [
            m('li', m('a.link' + ((vnode.attrs.step == 0) ? ".b" : ""), "Giỏ hàng")),
            m('li', m('a.link' + ((vnode.attrs.step == 1) ? ".b" : ""), "Nhập thông tin")),
            m('li', m('a.link' + ((vnode.attrs.step == 2) ? ".b" : ""), "Thanh toán")),
            m('li', m('a.link' + ((vnode.attrs.step == 3) ? ".b" : ""), "Cám ơn"))
        ])
    }

};
module.exports = cartStep;


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/5/17.
 */
const m = __webpack_require__(0);
const service = __webpack_require__(1);


const product = {
    oninit: function (vnode) {
        if (vnode.attrs.product.itemLink != '') {
            product.view = product.defaultView;
        } else {
            product.view = product.emptyView;
        }
    },

    data: {},
    view: function (vnode) {
        return m('h2', 'is loading')
    },
    //
    defaultView: function (vnode) {
        return m('.fl.w-100.bg-black-10.mb2',
            m('.fl.w-10-l.w-10-m.w-20.mb1',
                m('a.db.w-100.ba', {href: vnode.attrs.product.itemLink}, m('img.db.w-100', {src: vnode.attrs.product.itemImg}))
            ),
            m('.fl.w-90-l.w-90-m.w-80.pa2.f6',
                [
                    m('.fl.w-60-l.w-60-m.w-100.pa2',

                        m('.db', `Màu sắc - Size: ${vnode.attrs.product.itemDetail.color_size}`),

                        m('.db', `Thành tiền: NDT ${vnode.attrs.product.itemQty * vnode.attrs.product.itemPrc} --- VND ${vnode.attrs.product.itemQty * vnode.attrs.product.itemPrc * 3.1}`),
                        m('.db', m('a', {href: vnode.attrs.product.itemLink}, "Link sản phẩm")),
                        m('hr'),
                        m('.db', "Tin nhăn"),
                        m('textarea.w-100',
                            {
                                oninput: function (e) {
                                    vnode.attrs.product.msg = e.target.value;

                                },
                                onblur: function (e) {
                                    vnode.attrs.update()
                                }
                            }
                            , vnode.attrs.product.msg)
                    ),


                    m('.fl.w-20-l.w-20-m.w-50', m('.db', 'Đơn giá'), m('.db', vnode.attrs.product.itemPrc)),
                    m('.fl.w-20-l.w-20-m.w-50',
                        m('.db',
                            m('.db', 'Số lượng'),
                            m('.db', m('input[type=number][min=0][max=100].w-100', {
                                    value: vnode.attrs.product.itemQty,
                                    oninput: function (e) {
                                        vnode.attrs.product.itemQty = e.target.value;
                                        vnode.attrs.update();
                                    }
                                })
                            )
                        )
                    )
                    //m('tr', m('td.tr', '='), m('td', vnode.attrs.product.itemQty * vnode.attrs.product.itemPrc)),
                ]
            )
        )
    },
    emptyView: function (vnode) {
        return m('h2', "Bạn không có sản phẩm nào")
    }

};


module.exports = product;

// let product = function (ordPrd) {
//   this.shop = ordPrd.shop;
//
//   this.itemId = ordPrd.itemId;
//   this.itemName = ordPrd.itemName;
//   this.itemLink = ordPrd.itemLink;
//   this.itemImg = ordPrd.itemImg;
//   this.itemPrc = ordPrd.itemPrc;
//   this.itemQty = ordPrd.itemQty;
//
//   this.msg = ordPrd.msg;
//
//   this.itemDetail = ordPrd.itemDetail;
//
// };


/***/ }),
/* 97 */
/***/ (function(module, exports) {

/**
 * Created by huy on 4/10/17.
 */

let sample = {
  "sessionId": "5GhmgOJIOTP0V4jfC9hxjoPKF-zxJsQj",
  "userId": "",
  "orderCode": "17042107",
  "isSubmited": false,
  "products": [
    {
      "shop": "forever21",
      "itemId": "2000269309",
      "itemName": "纯色一字肩七分袖连衣裙",
      "itemLink": "http://www.forever21.cn/Product/Product.aspx?BR=f21",
      "itemImg": "http://www.forever21.cn/images/1_front_58/00269309-01.jpg",
      "itemPrc": "169.00",
      "itemQty": "1",
      "msg": "fdsfd",
      "itemDetail": {
        "type": "forever21",
        "item_id": "2000269309",
        "item_title": "纯色一字肩七分袖连衣裙",
        "item_image": "http://www.forever21.cn/images/1_front_58/00269309-01.jpg",
        "item_link": "http://www.forever21.cn/Product/Product.aspx?BR=f21",
        "Category": "promo_offshoulder",
        "ProductID": "2000269309",
        "VariantID": "",
        "item_price": "169.00",
        "comment": "fdsfd",
        "color_size": "Light blue(淡蓝色);S",
        "seller_id": "forever21",
        "seller_name": "forever21",
        "quantity": "1",
        "version": "20140225"
      }
    },
    {
      "shop": "forever21",
      "itemId": "2000269309",
      "itemName": "纯色一字肩七分袖连衣裙",
      "itemLink": "http://www.forever21.cn/Product/Product.aspx?BR=f21",
      "itemImg": "http://www.forever21.cn/images/1_front_58/00269309-01.jpg",
      "itemPrc": "169.00",
      "itemQty": "1",
      "msg": "fdsfd",
      "itemDetail": {
        "type": "forever21",
        "item_id": "2000269309",
        "item_title": "纯色一字肩七分袖连衣裙",
        "item_image": "http://www.forever21.cn/images/1_front_58/00269309-01.jpg",
        "item_link": "http://www.forever21.cn/Product/Product.aspx?BR=f21",
        "Category": "promo_offshoulder",
        "ProductID": "2000269309",
        "VariantID": "",
        "item_price": "169.00",
        "comment": "fdsfd",
        "color_size": "Light blue(淡蓝色);S",
        "seller_id": "forever21",
        "seller_name": "forever21",
        "quantity": "1",
        "version": "20140225"
      }
    },{
      "shop": "forever21",
      "itemId": "2000269309",
      "itemName": "纯色一字肩七分袖连衣裙",
      "itemLink": "http://www.forever21.cn/Product/Product.aspx?BR=f21",
      "itemImg": "http://www.forever21.cn/images/1_front_58/00269309-01.jpg",
      "itemPrc": "169.00",
      "itemQty": "1",
      "msg": "fdsfd",
      "itemDetail": {
        "type": "forever21",
        "item_id": "2000269309",
        "item_title": "纯色一字肩七分袖连衣裙",
        "item_image": "http://www.forever21.cn/images/1_front_58/00269309-01.jpg",
        "item_link": "http://www.forever21.cn/Product/Product.aspx?BR=f21",
        "Category": "promo_offshoulder",
        "ProductID": "2000269309",
        "VariantID": "",
        "item_price": "169.00",
        "comment": "fdsfd",
        "color_size": "Light blue(淡蓝色);S",
        "seller_id": "forever21",
        "seller_name": "forever21",
        "quantity": "1",
        "version": "20140225"
      }
    },
    {
      "shop": "forever21",
      "itemId": "2000269309",
      "itemName": "纯色一字肩七分袖连衣裙",
      "itemLink": "http://www.forever21.cn/Product/Product.aspx?BR=f21",
      "itemImg": "http://www.forever21.cn/images/1_front_58/00269309-01.jpg",
      "itemPrc": "169.00",
      "itemQty": "1",
      "msg": "fdsfd",
      "itemDetail": {
        "type": "forever21",
        "item_id": "2000269309",
        "item_title": "纯色一字肩七分袖连衣裙",
        "item_image": "http://www.forever21.cn/images/1_front_58/00269309-01.jpg",
        "item_link": "http://www.forever21.cn/Product/Product.aspx?BR=f21",
        "Category": "promo_offshoulder",
        "ProductID": "2000269309",
        "VariantID": "",
        "item_price": "169.00",
        "comment": "fdsfd",
        "color_size": "Light blue(淡蓝色);S",
        "seller_id": "forever21",
        "seller_name": "forever21",
        "quantity": "1",
        "version": "20140225"
      }
    }
  ]
};
module.exports = sample;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/24/17.
 */
const m = __webpack_require__(0);
const appService = __webpack_require__(1)
const orderHistory = {
        oninit: function (vnode) {
            orderHistory.data.orderCode = vnode.attrs.orderCode
            orderHistory.get_data()
        },
        data: {
            historyLog: [],
            orderCode: ""
        },
        get_data: () => {
            orderHistory.data.orderCode ?
                appService.service('history-log').find({
                    query: {
                        $limit: 1000,
                        orderCode: orderHistory.data.orderCode
                    }
                }).then(
                    result => {
                        orderHistory.data.historyLog = result.data;
                        m.redraw();
                    }
                ).catch(
                    err => console.log(err)
                ) : ""
        },
        view: vnode => m('.db.ba.bg-black-10',
            m('.db.f5.underline.ma2', 'Lịch sử hóa đơn'),
            orderHistory.data.historyLog ?
                m('.db.pa2',
                    m('ul',
                        orderHistory.data.historyLog.map(
                            msg => m('li',
                                m('b', `${msg.sender}`),
                                m('span', `(${(new Date(msg.createdAt)).toLocaleString()}) : `),
                                m('span', `${msg.text}`)
                            )
                        )
                    ),
                    m('form', {
                            onsubmit: e => {
                                e.preventDefault()
                                appService.service('history-log').create({
                                    sender: 'Khách',
                                    orderCode: orderHistory.data.orderCode,
                                    text: e.target.message.value
                                }).then(result => {
                                    orderHistory.get_data()
                                }).catch(err => console.log(err))
                            }
                        },
                        m('input[type=text][name=message]', {
                            placeholder: "Tin nhắn của bạn"
                        }),
                        m('input[type=submit][value=Gửi]')
                    )
                ) : ""
        )
    }
    ;
//sender , orderCode , createdAt, text
module.exports = orderHistory;

/***/ }),
/* 99 */
/***/ (function(module, exports) {

/**
 * Created by huy on 4/19/17.
 */
var sampleProduct = {
    type: 'forever21',
    item_id: '2000269309',
    item_title: '纯色一字肩七分袖连衣裙',
    item_image: 'http://www.forever21.cn/images/1_front_58/00269309-01.jpg',
    item_link: 'http://www.forever21.cn/Product/Product.aspx?BR=f21',
    Category: 'promo_offshoulder',
    ProductID: '2000269309',
    VariantID: '',
    item_price: '169.00',
    comment: 'fdsfd',
    color_size: 'Light blue(淡蓝色);S',
    seller_id: 'forever21',
    seller_name: 'forever21',
    quantity: '1',
    version: '20140225'
}
module.exports = sampleProduct;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 4/5/17.
 */
const m = __webpack_require__(0);
const panel = {
    menuGuest: __webpack_require__(27),
    notify: __webpack_require__(29),
    menuMember: __webpack_require__(28)
};
const client = __webpack_require__(1)

const home = __webpack_require__(32);
const order = __webpack_require__(33);
const cart = __webpack_require__(23);
const shop = __webpack_require__(30);
const profile = __webpack_require__(31)
const admin = __webpack_require__(22)

const form = {
    login: __webpack_require__(24),
    register: __webpack_require__(25),
    signup: __webpack_require__(26)
};

let app = {
    oninit: function (vnode) {

    },
    view: (vnode) => {
        return m('.db#content.db.w-100.w-80-l', [
            m('.db', m(panel.menuGuest)),
            m('main', vnode.children)
        ]);
    },
};
let memberApp = {
    oninit: function (vnode) {

    },
    view: (vnode) => {
        return m('.db#content.db.w-100.w-80-l', [
            m('.db', m(panel.menuMember)),
            m('main', vnode.children)
        ])
    },
}
client.authenticate().then(
    () => {
        m.route(document.getElementById('app'), '/', {
            '/': {view: () => m(memberApp, m(cart))},

            '/cart': {view: () => m(memberApp, m(cart))},
            '/shop': {view: () => m(memberApp, m(shop))},
            '/order/:orderCode': {view: () => m(memberApp, m(order))},
            '/order': {view: () => m(memberApp, m(order))},
            '/admin': {view: () => m(memberApp, m(admin))},
            '/my-info': {view: () => m(memberApp, m(profile, {}))}
        })
    }
).catch(err => {
    m.route(document.getElementById('app'), '/', {
        '/': {view: () => m(app, m(cart))},

        '/cart': {view: () => m(app, m(cart))},
        '/shop': {view: () => m(app, m(shop))},
        '/order/:orderCode': {view: () => m(app, m(order))},
        '/order': {view: () => m(app, m(order))},
        '/login': {view: () => m(app, m(form.login))},
        '/register': {view: () => m(app, m(form.signup))},
        '/signup': {view: () => m(app, m(form.signup))}
    })
})



/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by huy on 5/6/17.
 */
const m = __webpack_require__(0);

const otherInfo = {
    oninit: vnode => {
        vnode.attrs.data.otherInfo = vnode.attrs.data.otherInfo || {
                prepaid: 0,
                shipFromChina: 0
            }
        //something
    },
    cal_totalPrice: function (prdList) {
        if (prdList) {
            let totalPrice = 0;
            let totalQuantity = 0;
            prdList.forEach(function (t) {
                totalQuantity = totalQuantity + Number(t.itemQty);
                totalPrice = totalPrice + t.itemQty * t.itemPrc
            });
            return {totalPrice: totalPrice, totalQuantity: totalQuantity};
        } else {
            return {totalPrice: 0, totalQuantity: 0};
        }
    },
    view: vnode => m(
        '.db.pa1.mb2',
        m('.db.underline', 'Đã trả'),
        m('label.db',
            m('span', 'Trả trước(*VND)'),
            m('input.db[type=Number]', {
                value: vnode.attrs.data.otherInfo.prepaid || 0,
                oninput: e => {
                    vnode.attrs.data.otherInfo.prepaid = e.target.value
                }
            })
        ),
        m('.db.underline.b.mb2', m('span', 'Tổng chi phí:'), m('span', otherInfo.cal_totalPrice(vnode.attrs.data.products).totalPrice + vnode.attrs.data.otherInfo.shipFromChina)),
        m('label.db',
            m('span.db', 'Tiền Ship từ Trung Quốc(*VND)'),
            m('input[type=Number]', {
                value: vnode.attrs.data.otherInfo.shipFromChina || 0,
                oninput: e => {
                    vnode.attrs.data.otherInfo.shipFromChina = e.target.value
                }
            })
        ),
        m('label.db',
            m('span.db  ', 'Giá trị hóa đơn(*VND)'),
            m('input[type=Number][disabled]', {
                value: otherInfo.cal_totalPrice(vnode.attrs.data.products).totalPrice
            })
        ),

        m('.db.underline', m('span', 'Tiền phải trả:'), m('span', Number(otherInfo.cal_totalPrice(vnode.attrs.data.products).totalPrice) + Number(vnode.attrs.data.otherInfo.shipFromChina) - Number(vnode.attrs.data.otherInfo.prepaid)))
    )
};

module.exports = otherInfo;

/***/ })
/******/ ]);