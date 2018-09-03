// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var global = arguments[3];
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);

},{}],"ui/alerts.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.codeErrorAlert = function () {
    alert("Your code has errors. Fix them before continuing.");
};
},{}],"ui/message-view.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var MessageVueManager = new Vue({
    el: "#vue-app-message-display",
    data: {
        messages: []
    },
    methods: {
        typeToClass: function typeToClass(type) {
            return "has-text-" + type;
        }
    }
});

var clearMessages = exports.clearMessages = function clearMessages() {
    MessageVueManager.messages.splice(0, MessageVueManager.messages.length);
};

var addMessage = exports.addMessage = function addMessage(message) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'danger';

    MessageVueManager.messages.push({ text: message, type: type });
};
},{}],"puzzles/base-puzzle-setup.ts":[function(require,module,exports) {
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

var Puzzle = function () {
    function Puzzle(states, initialStateData) {
        _classCallCheck(this, Puzzle);

        this.states = states;
        this.addState(exports.GenericStatus.NoError, initialStateData);
    }

    _createClass(Puzzle, [{
        key: "addState",
        value: function addState(status, data) {
            if (data === undefined) {
                data = this.stateData;
            }
            this.states.push(new State(deepClone(data), status));
        }
    }]);

    return Puzzle;
}();

exports.Puzzle = Puzzle;

var State = function State(data, status) {
    _classCallCheck(this, State);

    this.data = data;
    this.status = status;
};

exports.State = State;

var Status = function Status(event, severityLevel) {
    _classCallCheck(this, Status);

    this.event = event;
    this.severityLevel = severityLevel;
};

exports.Status = Status;
// https://basarat.gitbooks.io/typescript/docs/styleguide/styleguide.html#enum
var GenericEvent;
(function (GenericEvent) {
    GenericEvent["Success"] = "success";
    GenericEvent["None"] = "";
})(GenericEvent = exports.GenericEvent || (exports.GenericEvent = {}));
var SeverityLevel;
(function (SeverityLevel) {
    SeverityLevel["NoError"] = "no_error";
    SeverityLevel["NonFatalError"] = "non_fatal_error";
    SeverityLevel["FatalError"] = "fatal_error";
})(SeverityLevel = exports.SeverityLevel || (exports.SeverityLevel = {}));
exports.GenericStatus = {
    NoError: new Status(GenericEvent.None, SeverityLevel.NoError),
    Success: new Status(GenericEvent.Success, SeverityLevel.NoError)
};
},{}],"puzzles/crossing-puzzles/common-setup.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Side;
(function (Side) {
    Side["Left"] = "left";
    Side["Right"] = "right";
})(Side = exports.Side || (exports.Side = {}));
//The syntax for calling this can be made better using an interface
exports.checkSuccess = function (crossers) {
    //find returns undefined if there are no matches (no crossers on the left side)
    //! converts undefined to true
    return !crossers.find(function (crosser) {
        return crosser.side === Side.Left;
    });
};
exports.crossersOnCorrectSide = function (crossers, correctSide) {
    var result = crossers.find(function (crosser) {
        return crosser.side !== correctSide;
    });
    if (result !== undefined) {
        return result;
    }
    return undefined;
};
exports.switchSides = function (crossers) {
    var moveDirection = void 0;
    /*
    This code has the implicit assumption that:
        1] There is at least 1 moving passenger
        2] All moving passengers are on the same side
    */
    if (crossers[0].side === Side.Left) {
        moveDirection = Side.Right;
    } else {
        moveDirection = Side.Left;
    }
    crossers.map(function (crosser) {
        return crosser.side = moveDirection;
    });
};
},{}],"puzzles/crossing-puzzles/bridge-setup.ts":[function(require,module,exports) {
"use strict";
/*
Potential TODO - create a sub folders called 'bridge puzzles' and 'river puzzles' and put this under 'bridge puzzles'
Common classes can be extracted into the 'crossing-puzzles', which contains 'bridge puzzles' and 'river puzzles'
*/
/*
This is a barebones implementation of the ghoul puzzle.
If similar puzzles are implemented in the future, then this framework can be fleshed out.
*/

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var base_puzzle_setup_1 = require("../base-puzzle-setup");
var common_setup_1 = require("./common-setup");

var GhoulPuzzle = function (_base_puzzle_setup_1$) {
    _inherits(GhoulPuzzle, _base_puzzle_setup_1$);

    function GhoulPuzzle(adventurers) {
        var timePassed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var timeLimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 17;
        var currentSide = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : common_setup_1.Side.Left;
        var states = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

        _classCallCheck(this, GhoulPuzzle);

        var _this = _possibleConstructorReturn(this, (GhoulPuzzle.__proto__ || Object.getPrototypeOf(GhoulPuzzle)).call(this, states, new GhoulStateData(adventurers, timePassed, null)));

        _this.adventurers = adventurers;
        _this.timePassed = timePassed;
        _this.timeLimit = timeLimit;
        _this.currentSide = currentSide;
        _this.states = states;
        return _this;
    }

    _createClass(GhoulPuzzle, [{
        key: "stateData",
        get: function get() {
            return new GhoulStateData(this.adventurers, this.timePassed, this.currentSide);
        }
    }, {
        key: "outOfTime",
        get: function get() {
            if (puzzle.timePassed > puzzle.timeLimit) {
                return true;
            }
            return false;
        }
    }]);

    return GhoulPuzzle;
}(base_puzzle_setup_1.Puzzle);

var GhoulState = function (_base_puzzle_setup_1$2) {
    _inherits(GhoulState, _base_puzzle_setup_1$2);

    function GhoulState(data, status) {
        _classCallCheck(this, GhoulState);

        var _this2 = _possibleConstructorReturn(this, (GhoulState.__proto__ || Object.getPrototypeOf(GhoulState)).call(this, data, status));

        _this2.data = data;
        _this2.status = status;
        return _this2;
    }

    return GhoulState;
}(base_puzzle_setup_1.State);

exports.GhoulState = GhoulState;

var GhoulStateData = function GhoulStateData(adventurers, timePassed, moveDirection) {
    _classCallCheck(this, GhoulStateData);

    this.adventurers = adventurers;
    this.timePassed = timePassed;
    this.moveDirection = moveDirection;
};

var Adventurer = function Adventurer(name, timeToCross) {
    var side = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : common_setup_1.Side.Left;
    var hasTorch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, Adventurer);

    this.name = name;
    this.timeToCross = timeToCross;
    this.side = side;
    this.hasTorch = hasTorch;
};

exports.GhoulStatus = {
    SuccessStatus: new base_puzzle_setup_1.Status('Success - Everyone crossed the bridge.', base_puzzle_setup_1.SeverityLevel.NoError)
};
exports.crossBridge = function () {
    if (puzzle.outOfTime) {
        return;
    }

    for (var _len = arguments.length, adventurers = Array(_len), _key = 0; _key < _len; _key++) {
        adventurers[_key] = arguments[_key];
    }

    var preCrossingStatus = preCrossingErrors(adventurers);
    if (preCrossingStatus !== null) {
        puzzle.addState(preCrossingStatus);
        return;
    }
    common_setup_1.switchSides(adventurers);
    puzzle.currentSide = adventurers[0].side;
    puzzle.timePassed += Math.max.apply(Math, _toConsumableArray(adventurers.map(function (adventurer) {
        return adventurer.timeToCross;
    })));
    if (puzzle.outOfTime) {
        puzzle.addState(new base_puzzle_setup_1.Status('Time limit exceeded', base_puzzle_setup_1.SeverityLevel.FatalError));
    } else if (common_setup_1.checkSuccess(puzzle.adventurers)) {
        puzzle.addState(exports.GhoulStatus.SuccessStatus);
    } else {
        puzzle.addState(base_puzzle_setup_1.GenericStatus.NoError);
    }
};
exports.giveTorch = function (adventurer) {
    if (puzzle.outOfTime) {
        return;
    }
    if (adventurer.hasTorch === true) {
        puzzle.addState(new base_puzzle_setup_1.Status(adventurer.name + ' already has the torch', base_puzzle_setup_1.SeverityLevel.NonFatalError));
    } else {
        var _puzzle$adventurers$f = puzzle.adventurers.filter(function (adventurer) {
            return adventurer.hasTorch === true;
        }).map(function (adventurer) {
            return adventurer.side;
        }),
            _puzzle$adventurers$f2 = _slicedToArray(_puzzle$adventurers$f, 1),
            curTorchSide = _puzzle$adventurers$f2[0];

        var proposedTorchSide = adventurer.side;
        if (curTorchSide !== proposedTorchSide) {
            puzzle.addState(new base_puzzle_setup_1.Status('The torch can only be transferred to adventurers on the same side', base_puzzle_setup_1.SeverityLevel.NonFatalError));
            return;
        }
        puzzle.adventurers.map(function (adventurer) {
            return adventurer.hasTorch = false;
        });
        adventurer.hasTorch = true;
        puzzle.addState(base_puzzle_setup_1.GenericStatus.NoError);
    }
};
function preCrossingErrors(adventurers) {
    var misplacedCharacter = common_setup_1.crossersOnCorrectSide(adventurers, puzzle.currentSide);
    if (misplacedCharacter !== undefined) {
        return new base_puzzle_setup_1.Status(misplacedCharacter.name + ' not on correct side', base_puzzle_setup_1.SeverityLevel.NonFatalError);
    }
    if (adventurers.length > 2) {
        return new base_puzzle_setup_1.Status('only a max of 2 adventurers can cross the bridge at once', base_puzzle_setup_1.SeverityLevel.NonFatalError);
    }
    if (adventurers.length === 0) {
        return new base_puzzle_setup_1.Status('an adventurer is needed to cross the bridge', base_puzzle_setup_1.SeverityLevel.NonFatalError);
    }
    if (!adventurers.find(function (adventurer) {
        return adventurer.hasTorch;
    })) {
        return new base_puzzle_setup_1.Status('at least 1 adventurer must have a torch to cross the bridge', base_puzzle_setup_1.SeverityLevel.NonFatalError);
    }
    return null;
}
exports.initGhoulPuzzle = function () {
    var Alice = new Adventurer('Alice', 1, common_setup_1.Side.Left, true);
    var Bob = new Adventurer('Bob', 2);
    var Charlie = new Adventurer('Charlie', 5);
    var Doris = new Adventurer('Doris', 10);
    var adventurers = [Alice, Bob, Charlie, Doris];
    puzzle = new GhoulPuzzle(adventurers);
    exports.states = puzzle.states;
    return adventurers;
};
var puzzle = void 0;
},{"../base-puzzle-setup":"puzzles/base-puzzle-setup.ts","./common-setup":"puzzles/crossing-puzzles/common-setup.ts"}],"puzzles/base-animator.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createDraw = function () {
    var id = 'animation-container';
    var animationContainer = document.getElementById(id);
    animationContainer.style.background = "";
    while (animationContainer.firstChild) {
        animationContainer.removeChild(animationContainer.firstChild);
    }
    //@ts-ignore
    return SVG(id);
};
},{}],"puzzles/crossing-puzzles/common-animator.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_setup_1 = require("./common-setup");
exports.sortIntoLeftAndRightSides = function (crossers) {
    function sortIntoSide(crossers, side) {
        return crossers.filter(function (crosser) {
            return crosser.side == side;
        }).map(function (crosser) {
            return crossers.indexOf(crosser);
        });
    }
    return [sortIntoSide(crossers, common_setup_1.Side.Left), sortIntoSide(crossers, common_setup_1.Side.Right)];
};
exports.getMovingCrossers = function (currentCrossers, prevCrossers) {
    return currentCrossers.filter(function (crosser) {
        return crosser.side !== prevCrossers[currentCrossers.indexOf(crosser)].side;
    }).map(function (crosser) {
        return currentCrossers.indexOf(crosser);
    });
};
exports.getBaseDimensions = function (draw) {
    var boundingRect = draw.native().getBoundingClientRect();
    return [boundingRect.width, boundingRect.height];
};
exports.getCenterY = function (imageHeight, totalHeight) {
    return totalHeight / 2 - imageHeight / 2;
};
function sleep(milliseconds) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt("return", new Promise(function (resolve) {
                            return setTimeout(resolve, milliseconds);
                        }));

                    case 1:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
}
exports.sleep = sleep;
},{"./common-setup":"puzzles/crossing-puzzles/common-setup.ts"}],"puzzles/crossing-puzzles/bridge-animator.ts":[function(require,module,exports) {
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_animator_1 = require("../base-animator");
var common_animator_1 = require("./common-animator");
var common_setup_1 = require("./common-setup");
var base_puzzle_setup_1 = require("../base-puzzle-setup");
var bridge_setup_1 = require("./bridge-setup");

var BridgeAnimator = function () {
    function BridgeAnimator(addMessage, specificDir) {
        var draw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : base_animator_1.createDraw();

        _classCallCheck(this, BridgeAnimator);

        this.addMessage = addMessage;
        this.specificDir = specificDir;
        this.draw = draw;
        this.drawings = new Map();
        this.fileExtension = '.svg';
        this.numCharsOnSide = 4;
        this.bridgeHeightToWidthRatio = 140 / 512;
        this.draw.clear();

        var _common_animator_1$ge = common_animator_1.getBaseDimensions(this.draw);

        var _common_animator_1$ge2 = _slicedToArray(_common_animator_1$ge, 2);

        this.baseWidth = _common_animator_1$ge2[0];
        this.baseHeight = _common_animator_1$ge2[1];

        this.characterSideLength = this.baseWidth / 16;
        this.sideWidth = this.characterSideLength * this.numCharsOnSide;
        this.bridgeHeight = (this.baseWidth - 2 * this.sideWidth) * this.bridgeHeightToWidthRatio;
        this.bridgeYCoord = this.baseHeight - this.bridgeHeight;
        this.timePassedText = this.draw.text("Time passed: " + 0);
        this.timePassedText.font({
            family: 'Helvetica',
            size: 30
        });
        this.torchHeight = this.characterSideLength;
        this.torch = this.createTorch();
    }

    _createClass(BridgeAnimator, [{
        key: "createTorch",
        value: function createTorch() {
            return this.draw.image(this.specificDir + 'torch' + this.fileExtension).size(this.characterSideLength / 2, this.characterSideLength);
        }
    }, {
        key: "animate",
        value: function animate() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var i, currentAdventurer, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, state;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.setupBackground();
                                for (i = 0; i < bridge_setup_1.states[0].data.adventurers.length; i++) {
                                    currentAdventurer = bridge_setup_1.states[0].data.adventurers[i];

                                    this.drawings.set(i, this.draw.image(this.specificDir + currentAdventurer.name + this.fileExtension).size(this.characterSideLength, this.characterSideLength));
                                }
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 5;
                                _iterator = bridge_setup_1.states[Symbol.iterator]();

                            case 7:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 16;
                                    break;
                                }

                                state = _step.value;
                                _context.next = 11;
                                return this.drawFrame(state);

                            case 11:
                                _context.next = 13;
                                return common_animator_1.sleep(500);

                            case 13:
                                _iteratorNormalCompletion = true;
                                _context.next = 7;
                                break;

                            case 16:
                                _context.next = 22;
                                break;

                            case 18:
                                _context.prev = 18;
                                _context.t0 = _context["catch"](5);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 22:
                                _context.prev = 22;
                                _context.prev = 23;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 25:
                                _context.prev = 25;

                                if (!_didIteratorError) {
                                    _context.next = 28;
                                    break;
                                }

                                throw _iteratorError;

                            case 28:
                                return _context.finish(25);

                            case 29:
                                return _context.finish(22);

                            case 30:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[5, 18, 22, 30], [23,, 25, 29]]);
            }));
        }
    }, {
        key: "drawFrame",
        value: function drawFrame(state) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var i, _common_animator_1$so, _common_animator_1$so2, leftBankIDs, rightBankIDs, showSuccess, throwFatalError, moveDirection, prevState, movingPassengerIDs;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                //the index of the current state
                                i = bridge_setup_1.states.indexOf(state);
                                _common_animator_1$so = common_animator_1.sortIntoLeftAndRightSides(state.data.adventurers), _common_animator_1$so2 = _slicedToArray(_common_animator_1$so, 2), leftBankIDs = _common_animator_1$so2[0], rightBankIDs = _common_animator_1$so2[1];

                                if (!(i === 0)) {
                                    _context2.next = 7;
                                    break;
                                }

                                this.drawBridgeSide(common_setup_1.Side.Left, leftBankIDs);
                                this.drawBridgeSide(common_setup_1.Side.Right, rightBankIDs);
                                _context2.next = 18;
                                break;

                            case 7:
                                showSuccess = false;
                                throwFatalError = false;

                                if (state.status === bridge_setup_1.GhoulStatus.SuccessStatus) {
                                    showSuccess = true;
                                } else if (state.status.severityLevel === base_puzzle_setup_1.SeverityLevel.FatalError) {
                                    throwFatalError = true;
                                } else if (state.status.severityLevel === base_puzzle_setup_1.SeverityLevel.NonFatalError) {
                                    this.addMessage('Warning: ' + state.status.event, 'warning');
                                }
                                //Get move direction
                                moveDirection = state.data.moveDirection;

                                if (moveDirection === common_setup_1.Side.Left) {
                                    this.drawBridgeSide(common_setup_1.Side.Right, rightBankIDs);
                                } else {
                                    this.drawBridgeSide(common_setup_1.Side.Left, leftBankIDs);
                                }
                                prevState = bridge_setup_1.states[i - 1];
                                movingPassengerIDs = common_animator_1.getMovingCrossers(state.data.adventurers, prevState.data.adventurers);
                                _context2.next = 16;
                                return this.animateCrossing(movingPassengerIDs, moveDirection, state);

                            case 16:
                                if (moveDirection === common_setup_1.Side.Left) {
                                    this.drawBridgeSide(common_setup_1.Side.Left, leftBankIDs);
                                } else {
                                    this.drawBridgeSide(common_setup_1.Side.Right, rightBankIDs);
                                }
                                if (throwFatalError) {
                                    this.displayFatalError(state.status.event);
                                } else if (showSuccess) {
                                    this.addMessage(state.status.event, 'success');
                                }

                            case 18:
                                this.updateTimePassed(state.data.timePassed);
                                this.updateTorch(state);

                            case 20:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
    }, {
        key: "displayFatalError",
        value: function displayFatalError(message) {
            //If custom error images are needed then put images in the path represented by "baseDir + commonDir"
            //and go to river-puzzle-setup.ts and change the error codes to the names of the images
            var ghostSideLen = this.characterSideLength * 3;
            this.draw.image(this.specificDir + 'ghost' + this.fileExtension).size(ghostSideLen, ghostSideLen).move(this.baseWidth / 2 - ghostSideLen / 2, this.bridgeYCoord - ghostSideLen - ghostSideLen / 2);
            this.addMessage("Error: " + message);
        }
    }, {
        key: "updateTimePassed",
        value: function updateTimePassed(timePassed) {
            this.timePassedText.text("Time Passed: " + timePassed);
        }
    }, {
        key: "updateTorch",
        value: function updateTorch(state) {
            var _state$data$adventure = state.data.adventurers.filter(function (adventurer) {
                return adventurer.hasTorch;
            }).map(function (adventurer) {
                return adventurer.name;
            }),
                _state$data$adventure2 = _slicedToArray(_state$data$adventure, 1),
                adventurerName = _state$data$adventure2[0];

            var _state$data$adventure3 = state.data.adventurers.filter(function (adventurer) {
                return adventurer.name === adventurerName;
            }).map(function (adventurer) {
                return state.data.adventurers.indexOf(adventurer);
            }),
                _state$data$adventure4 = _slicedToArray(_state$data$adventure3, 1),
                adventurerID = _state$data$adventure4[0];

            var image = this.drawings.get(adventurerID);
            this.moveTorch(image);
        }
    }, {
        key: "moveTorch",
        value: function moveTorch(image) {
            this.torch.move(image.x() + this.characterSideLength / 4, this.bridgeYCoord - this.characterSideLength - this.torchHeight);
        }
    }, {
        key: "animateCrossing",
        value: function animateCrossing(IDs, moveDirection, state) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var animationTime, movingChars, increment, startXCoord, endXCoord, xCoord, xShift, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, id, currentDrawing, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _id;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                animationTime = 1200;

                                if (!(moveDirection === null)) {
                                    _context3.next = 3;
                                    break;
                                }

                                throw "Internal Error - moveDirection cannot be null. Report this to the developer.";

                            case 3:
                                if (!(IDs.length === 0)) {
                                    _context3.next = 5;
                                    break;
                                }

                                return _context3.abrupt("return");

                            case 5:
                                movingChars = this.draw.group();
                                increment = this.characterSideLength;
                                startXCoord = this.sideWidth;
                                endXCoord = this.baseWidth - this.sideWidth;

                                if (moveDirection === common_setup_1.Side.Left) {
                                    increment *= -1;
                                    startXCoord = this.baseWidth - this.sideWidth;
                                    endXCoord = this.sideWidth;
                                }
                                xCoord = startXCoord;
                                xShift = endXCoord - startXCoord;
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context3.prev = 15;

                                for (_iterator2 = IDs[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    id = _step2.value;
                                    currentDrawing = this.drawings.get(id);

                                    currentDrawing.move(xCoord, this.bridgeYCoord - this.characterSideLength);
                                    movingChars.add(currentDrawing);
                                    if (state.data.adventurers[id].hasTorch) {
                                        this.moveTorch(currentDrawing);
                                        movingChars.add(this.torch);
                                    }
                                    xCoord += increment;
                                }
                                _context3.next = 23;
                                break;

                            case 19:
                                _context3.prev = 19;
                                _context3.t0 = _context3["catch"](15);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context3.t0;

                            case 23:
                                _context3.prev = 23;
                                _context3.prev = 24;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 26:
                                _context3.prev = 26;

                                if (!_didIteratorError2) {
                                    _context3.next = 29;
                                    break;
                                }

                                throw _iteratorError2;

                            case 29:
                                return _context3.finish(26);

                            case 30:
                                return _context3.finish(23);

                            case 31:
                                movingChars.animate(animationTime, '-', 0).move(xShift, 0);
                                _context3.next = 34;
                                return common_animator_1.sleep(animationTime);

                            case 34:
                                movingChars.remove();
                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context3.prev = 38;
                                for (_iterator3 = IDs[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    _id = _step3.value;

                                    this.drawings.set(_id, this.draw.image(this.specificDir + bridge_setup_1.states[0].data.adventurers[_id].name + this.fileExtension).size(this.characterSideLength, this.characterSideLength));
                                }
                                _context3.next = 46;
                                break;

                            case 42:
                                _context3.prev = 42;
                                _context3.t1 = _context3["catch"](38);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context3.t1;

                            case 46:
                                _context3.prev = 46;
                                _context3.prev = 47;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 49:
                                _context3.prev = 49;

                                if (!_didIteratorError3) {
                                    _context3.next = 52;
                                    break;
                                }

                                throw _iteratorError3;

                            case 52:
                                return _context3.finish(49);

                            case 53:
                                return _context3.finish(46);

                            case 54:
                                this.torch = this.createTorch();

                            case 55:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[15, 19, 23, 31], [24,, 26, 30], [38, 42, 46, 54], [47,, 49, 53]]);
            }));
        }
    }, {
        key: "drawBridgeSide",
        value: function drawBridgeSide(side, IDs) {
            var currentCoord = void 0;
            var increment = this.characterSideLength;
            if (side === common_setup_1.Side.Left) {
                currentCoord = 0;
            } else {
                currentCoord = this.baseWidth;
                //check if this works w/ pass by ref or value
                increment *= -1;
                currentCoord += increment;
            }
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = IDs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var id = _step4.value;

                    this.drawings.get(id).move(currentCoord, this.bridgeYCoord - this.characterSideLength);
                    currentCoord += increment;
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }, {
        key: "setupBackground",
        value: function setupBackground() {
            var bridgeWidth = this.baseWidth - 2 * this.sideWidth;
            this.draw.image(this.specificDir + 'bridge' + this.fileExtension).size(bridgeWidth, this.bridgeHeight).move(this.sideWidth, this.bridgeYCoord);
            var leftSide = this.draw.rect().size(this.sideWidth, this.bridgeHeight).move(0, this.bridgeYCoord).fill("#A9A9A9");
            leftSide.clone().move(this.baseWidth - this.sideWidth, this.bridgeYCoord);
        }
    }]);

    return BridgeAnimator;
}();

exports.BridgeAnimator = BridgeAnimator;
},{"../base-animator":"puzzles/base-animator.ts","./common-animator":"puzzles/crossing-puzzles/common-animator.ts","./common-setup":"puzzles/crossing-puzzles/common-setup.ts","../base-puzzle-setup":"puzzles/base-puzzle-setup.ts","./bridge-setup":"puzzles/crossing-puzzles/bridge-setup.ts"}],"puzzles/crossing-puzzles/river-setup.ts":[function(require,module,exports) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var base_puzzle_setup_1 = require("../base-puzzle-setup");
var common_setup_1 = require("./common-setup");

var RiverPuzzle = function (_base_puzzle_setup_1$) {
    _inherits(RiverPuzzle, _base_puzzle_setup_1$);

    function RiverPuzzle(passengers, boat, rules) {
        var fatalErrorRaised = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var states = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

        _classCallCheck(this, RiverPuzzle);

        var _this = _possibleConstructorReturn(this, (RiverPuzzle.__proto__ || Object.getPrototypeOf(RiverPuzzle)).call(this, states, new RiverStateData(passengers, boat)));

        _this.passengers = passengers;
        _this.boat = boat;
        _this.rules = rules;
        _this.fatalErrorRaised = fatalErrorRaised;
        _this.states = states;
        return _this;
    }

    _createClass(RiverPuzzle, [{
        key: "stateData",
        get: function get() {
            return new RiverStateData(this.passengers, this.boat);
        }
    }]);

    return RiverPuzzle;
}(base_puzzle_setup_1.Puzzle);

var RiverState = function (_base_puzzle_setup_1$2) {
    _inherits(RiverState, _base_puzzle_setup_1$2);

    function RiverState(data, status) {
        _classCallCheck(this, RiverState);

        var _this2 = _possibleConstructorReturn(this, (RiverState.__proto__ || Object.getPrototypeOf(RiverState)).call(this, data, status));

        _this2.data = data;
        _this2.status = status;
        return _this2;
    }

    return RiverState;
}(base_puzzle_setup_1.State);

exports.RiverState = RiverState;

var RiverStateData = function RiverStateData(passengers, boat) {
    _classCallCheck(this, RiverStateData);

    this.passengers = passengers;
    this.boat = boat;
};

var RiverErrorData = function RiverErrorData(oldType, newType, side) {
    _classCallCheck(this, RiverErrorData);

    this.oldType = oldType;
    this.newType = newType;
    this.side = side;
};

exports.RiverErrorData = RiverErrorData;

var RiverStatus = function (_base_puzzle_setup_1$3) {
    _inherits(RiverStatus, _base_puzzle_setup_1$3);

    function RiverStatus(event, severityLevel, errorData) {
        _classCallCheck(this, RiverStatus);

        var _this3 = _possibleConstructorReturn(this, (RiverStatus.__proto__ || Object.getPrototypeOf(RiverStatus)).call(this, event, severityLevel));

        _this3.event = event;
        _this3.severityLevel = severityLevel;
        _this3.errorData = errorData;
        return _this3;
    }

    return RiverStatus;
}(base_puzzle_setup_1.Status);

exports.RiverStatus = RiverStatus;
exports.RiverStatuses = {
    SuccessStatus: new base_puzzle_setup_1.Status('Success - Everyone crossed the river.', base_puzzle_setup_1.SeverityLevel.NoError)
};

var Boat = function Boat(rowerTypes, weightLimit) {
    var side = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : common_setup_1.Side.Left;

    _classCallCheck(this, Boat);

    this.rowerTypes = rowerTypes;
    this.weightLimit = weightLimit;
    this.side = side;
};

var Passenger = function Passenger(type, weight) {
    var side = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : common_setup_1.Side.Left;

    _classCallCheck(this, Passenger);

    this.type = type;
    this.weight = weight;
    this.side = side;
};

exports.Passenger = Passenger;

var RiverCrossingRule = function RiverCrossingRule() {
    _classCallCheck(this, RiverCrossingRule);
};

var SameSideRule = function (_RiverCrossingRule) {
    _inherits(SameSideRule, _RiverCrossingRule);

    function SameSideRule(type1, type2, type3) {
        _classCallCheck(this, SameSideRule);

        var _this4 = _possibleConstructorReturn(this, (SameSideRule.__proto__ || Object.getPrototypeOf(SameSideRule)).call(this));

        _this4.type1 = type1;
        _this4.type2 = type2;
        _this4.type3 = type3;
        return _this4;
    }

    _createClass(SameSideRule, [{
        key: "check",
        value: function check(puzzle) {
            var _this5 = this;

            var _loop = function _loop(side) {
                var isTypeOnSide = function isTypeOnSide(passenger, side, type) {
                    return passenger.side === side && passenger.type === type;
                };
                var type1_on_side = puzzle.passengers.some(function (passenger) {
                    return isTypeOnSide(passenger, side, _this5.type1);
                });
                var type_2_on_side = puzzle.passengers.some(function (passenger) {
                    return isTypeOnSide(passenger, side, _this5.type2);
                });
                var type_3_on_side = puzzle.passengers.some(function (passenger) {
                    return isTypeOnSide(passenger, side, _this5.type3);
                });
                if (type1_on_side && type_2_on_side && !type_3_on_side) {
                    var message = _this5.type1 + ' and ' + _this5.type2 + ' are both on ' + side + ' side without ' + _this5.type3;
                    if (_this5.type2 === 'apple') {
                        return {
                            v: new RiverStatus(message, base_puzzle_setup_1.SeverityLevel.FatalError, new RiverErrorData(_this5.type2, 'apple_eaten', side))
                        };
                    } else {
                        return {
                            v: new RiverStatus(message, base_puzzle_setup_1.SeverityLevel.FatalError, new RiverErrorData(_this5.type2, 'skull', side))
                        };
                    }
                    /*
                    if(this.type1 == 'goat') {
                        return new Status(message, herbivoreCode)
                    } else if (this.type1 === 'wolf') {
                        return new Status(message, violenceCode)
                    } else {
                        return new Status(message, unsortedCode)
                    }
                    */
                }
            };

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.values(common_setup_1.Side)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var side = _step.value;

                    var _ret = _loop(side);

                    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
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

            return base_puzzle_setup_1.GenericStatus.NoError;
        }
    }]);

    return SameSideRule;
}(RiverCrossingRule);

var RelativeAmountRule = function (_RiverCrossingRule2) {
    _inherits(RelativeAmountRule, _RiverCrossingRule2);

    function RelativeAmountRule(type1, type2) {
        _classCallCheck(this, RelativeAmountRule);

        var _this6 = _possibleConstructorReturn(this, (RelativeAmountRule.__proto__ || Object.getPrototypeOf(RelativeAmountRule)).call(this));

        _this6.type1 = type1;
        _this6.type2 = type2;
        return _this6;
    }

    _createClass(RelativeAmountRule, [{
        key: "check",
        value: function check(puzzle) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Object.values(common_setup_1.Side)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var side = _step2.value;

                    var amount_of_type1_on_side = 0;
                    var amount_of_type2_on_side = 0;
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = puzzle.passengers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var passenger = _step3.value;

                            if (passenger.type === this.type1 && passenger.side === side) {
                                amount_of_type1_on_side++;
                            } else if (passenger.type === this.type2 && passenger.side === side) {
                                amount_of_type2_on_side++;
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

                    if (amount_of_type1_on_side > amount_of_type2_on_side && amount_of_type2_on_side > 0) {
                        var message = this.type1 + "s outnumber " + this.type2 + "s on the " + side + " side";
                        return new RiverStatus(message, base_puzzle_setup_1.SeverityLevel.FatalError, new RiverErrorData(this.type2, 'skull', side));
                        /*
                        if(this.type1 === 'vampire') {
                            return new Status(message, violenceCode)
                        } else {
                            return new Status(message, unsortedCode)
                        }
                        */
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

            return base_puzzle_setup_1.GenericStatus.NoError;
        }
    }]);

    return RelativeAmountRule;
}(RiverCrossingRule);

exports.moveBoat = function () {
    if (puzzle.fatalErrorRaised) {
        return;
    }

    for (var _len = arguments.length, passengers = Array(_len), _key = 0; _key < _len; _key++) {
        passengers[_key] = arguments[_key];
    }

    var preCrossingStatus = preCrossingErrors(passengers);
    if (preCrossingStatus !== null) {
        puzzle.addState(preCrossingStatus);
        return;
    }
    common_setup_1.switchSides(passengers);
    puzzle.boat.side = passengers[0].side;
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = puzzle.rules[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var rule = _step4.value;

            var postCrossingStatus = rule.check(puzzle);
            if (postCrossingStatus !== base_puzzle_setup_1.GenericStatus.NoError) {
                puzzle.fatalErrorRaised = true;
                puzzle.addState(postCrossingStatus);
                return;
            }
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    if (common_setup_1.checkSuccess(puzzle.passengers)) {
        puzzle.addState(exports.RiverStatuses.SuccessStatus);
    } else {
        puzzle.addState(base_puzzle_setup_1.GenericStatus.NoError);
    }
};
function preCrossingErrors(passengers) {
    var rowerOnBoat = false;
    var totalPassengerWeight = 0;
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = passengers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var passenger = _step5.value;

            totalPassengerWeight += passenger.weight;
            if (puzzle.boat.rowerTypes.indexOf(passenger.type) > -1) {
                rowerOnBoat = true;
            }
            if (passenger.side != puzzle.boat.side) {
                //addState(puzzle, new Status(passenger.type + ' not on correct side', nonFatalCode));
                return new base_puzzle_setup_1.Status(passenger.type + ' not on correct side', base_puzzle_setup_1.SeverityLevel.NonFatalError);
            }
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }

    var misplacedPassenger = common_setup_1.crossersOnCorrectSide(passengers, puzzle.boat.side);
    if (misplacedPassenger !== undefined) {
        return new base_puzzle_setup_1.Status(misplacedPassenger.type + ' not on correct side', base_puzzle_setup_1.SeverityLevel.NonFatalError);
    }
    if (totalPassengerWeight > puzzle.boat.weightLimit) {
        //addState(puzzle, new Status('boat weight limit exceeded', nonFatalCode));
        return new base_puzzle_setup_1.Status('boat weight limit exceeded', base_puzzle_setup_1.SeverityLevel.NonFatalError);
    }
    if (!rowerOnBoat) {
        //addState(puzzle, new Status('no rower on boat', nonFatalCode));
        return new base_puzzle_setup_1.Status('no rower on boat', base_puzzle_setup_1.SeverityLevel.NonFatalError);
    }
    return null;
}
exports.initGoatPuzzle = function () {
    var boat = new Boat(['farmer'], 2);
    var passengers = [new Passenger("goat", 1), new Passenger("apple", 1), new Passenger("wolf", 1), new Passenger("farmer", 1)];
    var rules = [new SameSideRule('wolf', 'goat', 'farmer'), new SameSideRule('goat', 'apple', 'farmer')];
    puzzle = new RiverPuzzle(passengers, boat, rules);
    exports.states = puzzle.states;
    return puzzle.passengers;
};
exports.initVampirePuzzle = function () {
    var boat = new Boat(["vampire", "priest"], 2);
    var passengers = [];
    var vampires = [];
    var priests = [];
    for (var i = 0; i < 3; i++) {
        vampires.push(new Passenger("vampire", 1));
    }
    passengers.push.apply(passengers, vampires);
    for (var _i = 0; _i < 3; _i++) {
        priests.push(new Passenger("priest", 1));
    }
    passengers.push.apply(passengers, priests);
    var rules = [new RelativeAmountRule("vampire", "priest")];
    puzzle = new RiverPuzzle(passengers, boat, rules);
    exports.states = puzzle.states;
    return [vampires, priests];
};
exports.initSoldierPuzzle = function () {
    var boat = new Boat(["soldier", "boy"], 3);
    var passengers = [];
    var soldiers = [];
    var boys = [];
    for (var i = 0; i < 6; i++) {
        soldiers.push(new Passenger("soldier", 2));
    }
    passengers.push.apply(passengers, soldiers);
    for (var _i2 = 0; _i2 < 2; _i2++) {
        boys.push(new Passenger("boy", 1));
    }
    passengers.push.apply(passengers, boys);
    var rules = [];
    puzzle = new RiverPuzzle(passengers, boat, rules);
    exports.states = puzzle.states;
    return [soldiers, boys];
};
exports.initHusbandPuzzle = function () {
    var boat = new Boat(["Bob", "Bob_Wife", "Charlie", "Charlie_Wife"], 2);
    var passengers = [new Passenger("Bob", 1), new Passenger("Bob_Wife", 1), new Passenger("Charlie", 1), new Passenger("Charlie_Wife", 1)];
    var rules = [new SameSideRule('Bob_Wife', 'Charlie', 'Bob'), new SameSideRule('Charlie_Wife', 'Bob', 'Charlie')];
    puzzle = new RiverPuzzle(passengers, boat, rules);
    exports.states = puzzle.states;
    return puzzle.passengers;
};
var puzzle = void 0;
//export var states = puzzle.states
},{"../base-puzzle-setup":"puzzles/base-puzzle-setup.ts","./common-setup":"puzzles/crossing-puzzles/common-setup.ts"}],"puzzles/crossing-puzzles/river-animator.ts":[function(require,module,exports) {
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_puzzle_setup_1 = require("../base-puzzle-setup");
var base_animator_1 = require("../base-animator");
var river_setup_1 = require("./river-setup");
var common_animator_1 = require("./common-animator");
var common_setup_1 = require("./common-setup");
//let states: State[]
/*
//TODO - avoid having to repeat directory for assets
let baseDir = './assets/river-crossing/';
let commonDir = 'common/';
let specificDir: string
*/
var grassColor = "#80FF72";
var waterColor = "#7EE8FA";
//File extension for images
var extension = '.svg';
var drawings = new Map();
//"animation-container" is the id of the div that contains svg
//SVG() is a method supplied by svg.js
//Normally SVG is undefined - but in reality, it isn't because it's supplied by an external script tag
//@ts-ignore
//let draw: svgjs.Doc = SVG('animation-container')
var boat = void 0;
var boatSideLength = void 0;
var boatSideLengthInCharacters = 2;
var boatYCoord = void 0;
var maxCharactersInColumn = 4;
var maxColumns = 2;
var gap = 10;
var characterSideLength = void 0;
var baseHeight = void 0;
var baseWidth = void 0;
var riverBankWidth = void 0;
var leftBankXCoord = void 0;
var rightBankXCoord = void 0;
var animationTime = 1200;
//let addMessage: (message: string, type?: string) => void

var RiverAnimator = function () {
    //private readonly draw: svgjs.Doc = createDraw()
    function RiverAnimator(addMessage, specificDir) {
        var draw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : base_animator_1.createDraw();

        _classCallCheck(this, RiverAnimator);

        this.addMessage = addMessage;
        this.specificDir = specificDir;
        this.draw = draw;
        this.baseDir = './assets/river-crossing/';
        this.commonDir = 'common/';
        //Reset SVG - removes all child elements
        this.draw.clear();
        //Reset the drawing pool
        drawings.clear();
    }

    _createClass(RiverAnimator, [{
        key: "animate",
        value: function animate() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var i, currentPassenger, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, state;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.calculateDimensions();
                                this.initBackground();
                                this.initBoat();
                                /*
                                TODO - There's probably a better way to write this
                                Use the passengers from the first state (states[0]) to initialize the drawings.
                                Each passenger has a type. The type determines the filename of the drawing for the passenger.
                                E.g - if passenger type is "goat", then the filename is "goat.svg" (if extension equals 'svg')
                                     Normally passengers don't have an unique ID.
                                If 2 passengers are on the same side and have the same type then they are indistinguishable
                                This code assigns each passenger a unique ID equal to its index in states[0].passengers and a drawing based on the type name
                                The ID and drawing are stored in a map.
                                */
                                //states[0].data.passengers
                                for (i = 0; i < river_setup_1.states[0].data.passengers.length; i++) {
                                    currentPassenger = river_setup_1.states[0].data.passengers[i];

                                    drawings.set(i, this.draw.image(this.baseDir + this.specificDir + currentPassenger.type + extension).size(characterSideLength, characterSideLength));
                                }
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 7;
                                _iterator = river_setup_1.states[Symbol.iterator]();

                            case 9:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 18;
                                    break;
                                }

                                state = _step.value;
                                _context.next = 13;
                                return this.drawFrame(state);

                            case 13:
                                _context.next = 15;
                                return common_animator_1.sleep(500);

                            case 15:
                                _iteratorNormalCompletion = true;
                                _context.next = 9;
                                break;

                            case 18:
                                _context.next = 24;
                                break;

                            case 20:
                                _context.prev = 20;
                                _context.t0 = _context["catch"](7);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 24:
                                _context.prev = 24;
                                _context.prev = 25;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 27:
                                _context.prev = 27;

                                if (!_didIteratorError) {
                                    _context.next = 30;
                                    break;
                                }

                                throw _iteratorError;

                            case 30:
                                return _context.finish(27);

                            case 31:
                                return _context.finish(24);

                            case 32:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[7, 20, 24, 32], [25,, 27, 31]]);
            }));
        }
    }, {
        key: "initBoat",
        value: function initBoat() {
            boatSideLength = characterSideLength * boatSideLengthInCharacters + gap;
            boatYCoord = common_animator_1.getCenterY(boatSideLength, baseHeight);
            //The boat's filename is hardcoded
            //Move the boat to the end of the left river bank
            boat = this.draw.image(this.baseDir + this.commonDir + 'raft.svg').size(boatSideLength, boatSideLength).move(leftBankXCoord + riverBankWidth, boatYCoord);
        }
    }, {
        key: "drawFrame",
        value: function drawFrame(state) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var i, _common_animator_1$so, _common_animator_1$so2, leftBankIDs, rightBankIDs, showSuccess, throwFatalError, moveDirection, prevState, movingPassengerIDs;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                //the index of the current state
                                i = river_setup_1.states.indexOf(state);
                                _common_animator_1$so = common_animator_1.sortIntoLeftAndRightSides(state.data.passengers), _common_animator_1$so2 = _slicedToArray(_common_animator_1$so, 2), leftBankIDs = _common_animator_1$so2[0], rightBankIDs = _common_animator_1$so2[1];
                                //const leftBankIDs = [];
                                //const rightBankIDs = [];
                                /*
                                Iterate through the current state's passengers and sort the IDs based on which side a passenger is on.
                                This code works because for every state in the array states, the array passengers preserves its order.
                                For example - if a passenger was at index 0 in the first state, it will still be at index 0 in the tenth state.
                                */
                                /*
                                for (let i = 0; i < state.data.passengers.length; i++) {
                                    let currentPassenger = state.data.passengers[i];
                                    if (currentPassenger.side === 'left') {
                                        leftBankIDs.push(i)
                                    } else {
                                        rightBankIDs.push(i)
                                    }
                                }
                                */
                                //Check if it's the first state because the first state doesn't require animation

                                if (!(i === 0)) {
                                    _context2.next = 7;
                                    break;
                                }

                                drawRiverBank(leftBankXCoord, leftBankIDs);
                                drawRiverBank(rightBankXCoord, rightBankIDs);
                                _context2.next = 18;
                                break;

                            case 7:
                                showSuccess = false;
                                throwFatalError = false;

                                if (state.status === river_setup_1.RiverStatuses.SuccessStatus) {
                                    showSuccess = true;
                                } else if (state.status.severityLevel === base_puzzle_setup_1.SeverityLevel.FatalError) {
                                    throwFatalError = true;
                                } else if (state.status.severityLevel === base_puzzle_setup_1.SeverityLevel.NonFatalError) {
                                    this.addMessage('Warning: ' + state.status.event, 'warning');
                                }
                                moveDirection = state.data.boat.side;
                                //Redraw the canvas in the direction of the movement - if the movement was from right to left ('left')
                                //then redraw the right side first

                                if (moveDirection === 'left') {
                                    drawRiverBank(rightBankXCoord, rightBankIDs);
                                } else {
                                    drawRiverBank(leftBankXCoord, leftBankIDs);
                                }
                                //let movingPassengerIDs = [];
                                //Get list of passengers that have moved by checking a passenger's side
                                //in the previous state equals their side in the current state
                                prevState = river_setup_1.states[i - 1];
                                /*
                                for (let j = 0; j < prevState.data.passengers.length; j++) {
                                    if (prevState.data.passengers[j].side !== state.data.passengers[j].side) {
                                        movingPassengerIDs.push(j)
                                    }
                                }
                                */

                                movingPassengerIDs = common_animator_1.getMovingCrossers(state.data.passengers, prevState.data.passengers);
                                _context2.next = 16;
                                return this.animateCrossing(movingPassengerIDs, moveDirection);

                            case 16:
                                if (moveDirection === common_setup_1.Side.Left) {
                                    drawRiverBank(leftBankXCoord, leftBankIDs);
                                } else {
                                    drawRiverBank(rightBankXCoord, rightBankIDs);
                                }
                                if (throwFatalError) {
                                    this.displayFatalError(state.status.event, state.status.errorData, state.data.passengers);
                                } else if (showSuccess) {
                                    this.addMessage(state.status.event, 'success');
                                }

                            case 18:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
    }, {
        key: "displayFatalError",
        value: function displayFatalError(message, errorData, passengers) {
            this.replaceImage(errorData.oldType, errorData.newType, errorData.side, passengers);
            //let imageWidth = rightBankXCoord - riverBankWidth;
            //If custom error images are needed then put images in the path represented by "baseDir + commonDir"
            //and go to river-puzzle-setup.ts and change the error codes to the names of the images
            //this.draw.image(this.baseDir + this.commonDir + 'worried.svg').size(imageWidth, baseHeight).move(characterSideLength * maxColumns, 0);
            this.addMessage("Error: " + message);
        }
    }, {
        key: "replaceImage",
        value: function replaceImage(oldtype, newtype, targetSide, passengers) {
            var _this = this;

            drawings.forEach(function (drawing, key) {
                var src = drawing.src;
                if (src) {
                    if (passengers[key].side === targetSide) {
                        if (src.split('/').pop().slice(0, -extension.length) === oldtype) {
                            var oldX = drawing.x();
                            var oldY = drawing.y();
                            drawing.remove();
                            drawing = _this.draw.image(drawing.src.replace(oldtype + extension, newtype + extension)).size(characterSideLength, characterSideLength).move(oldX, oldY);
                        }
                    }
                }
            });
        }
    }, {
        key: "animateCrossing",
        value: function animateCrossing(IDs, direction) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var movingObjects, refreshBoat, yCoord, startXCoord, xCoord, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, id, currentDrawing, targetXCoord, xShift, _xCoord, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _id, _currentDrawing, _targetXCoord, _xShift, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _id2;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                //draw.group() allows animation of multiple images at once
                                movingObjects = this.draw.group();
                                //Don't redraw the boat at the end if no passengers moved

                                refreshBoat = false;

                                if (IDs.length > 0) {
                                    movingObjects.add(boat);
                                    refreshBoat = true;
                                }
                                yCoord = common_animator_1.getCenterY(characterSideLength, baseHeight);

                                if (!(direction === common_setup_1.Side.Right)) {
                                    _context3.next = 35;
                                    break;
                                }

                                //startXCoord is the endpoint of the left river bank
                                startXCoord = leftBankXCoord + riverBankWidth;
                                xCoord = startXCoord;
                                //Add the drawings one by one
                                //Each time a drawing is added, shift to the right by 1 character length + padding before adding another drawing

                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context3.prev = 10;
                                for (_iterator2 = IDs[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    id = _step2.value;
                                    currentDrawing = drawings.get(id);

                                    currentDrawing.move(xCoord, yCoord);
                                    movingObjects.add(currentDrawing);
                                    xCoord += characterSideLength + gap;
                                }
                                _context3.next = 18;
                                break;

                            case 14:
                                _context3.prev = 14;
                                _context3.t0 = _context3["catch"](10);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context3.t0;

                            case 18:
                                _context3.prev = 18;
                                _context3.prev = 19;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 21:
                                _context3.prev = 21;

                                if (!_didIteratorError2) {
                                    _context3.next = 24;
                                    break;
                                }

                                throw _iteratorError2;

                            case 24:
                                return _context3.finish(21);

                            case 25:
                                return _context3.finish(18);

                            case 26:
                                targetXCoord = rightBankXCoord - boatSideLength;
                                xShift = targetXCoord - startXCoord;

                                movingObjects.animate(animationTime, '-', 0).move(xShift, 0);
                                _context3.next = 31;
                                return common_animator_1.sleep(animationTime);

                            case 31:
                                movingObjects.remove();
                                if (refreshBoat) {
                                    boat = this.draw.image(this.baseDir + this.commonDir + 'raft.svg').size(boatSideLength, boatSideLength).y(boatYCoord).x(targetXCoord);
                                }
                                _context3.next = 62;
                                break;

                            case 35:
                                _xCoord = rightBankXCoord - characterSideLength;
                                //Add the drawings one by one
                                //Each time a drawing is added, shift to the left before adding another drawing

                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context3.prev = 39;
                                for (_iterator3 = IDs[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    _id = _step3.value;
                                    _currentDrawing = drawings.get(_id);

                                    _currentDrawing.move(_xCoord, yCoord);
                                    movingObjects.add(_currentDrawing);
                                    _xCoord -= characterSideLength + gap;
                                }
                                //The end point of the animation - in absolute terms.
                                //Equals the end point of the left river bank + the length of the boat
                                _context3.next = 47;
                                break;

                            case 43:
                                _context3.prev = 43;
                                _context3.t1 = _context3["catch"](39);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context3.t1;

                            case 47:
                                _context3.prev = 47;
                                _context3.prev = 48;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 50:
                                _context3.prev = 50;

                                if (!_didIteratorError3) {
                                    _context3.next = 53;
                                    break;
                                }

                                throw _iteratorError3;

                            case 53:
                                return _context3.finish(50);

                            case 54:
                                return _context3.finish(47);

                            case 55:
                                _targetXCoord = leftBankXCoord + riverBankWidth + boatSideLength;
                                //Distance between end point of animation and start point of animation
                                //Is negative because groups only accept relative coordinates

                                _xShift = -(rightBankXCoord - _targetXCoord);
                                //Animate objects and wait until the animation is finished

                                movingObjects.animate(animationTime, '-', 0).move(_xShift, 0);
                                _context3.next = 60;
                                return common_animator_1.sleep(animationTime);

                            case 60:
                                //remove the group and all images inside of it.
                                //Without this it is impossible to move the images individually
                                movingObjects.remove();
                                //Redraw the boat, if necessary.
                                if (refreshBoat) {
                                    boat = this.draw.image(this.baseDir + this.commonDir + 'raft.svg').size(boatSideLength, boatSideLength).y(boatYCoord).x(leftBankXCoord + boatSideLength);
                                }

                            case 62:
                                //Redraw all the images inside the group.
                                _iteratorNormalCompletion4 = true;
                                _didIteratorError4 = false;
                                _iteratorError4 = undefined;
                                _context3.prev = 65;
                                for (_iterator4 = IDs[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                    _id2 = _step4.value;

                                    drawings.set(_id2, this.draw.image(this.baseDir + this.specificDir + river_setup_1.states[0].data.passengers[_id2].type + extension).size(characterSideLength, characterSideLength));
                                }
                                _context3.next = 73;
                                break;

                            case 69:
                                _context3.prev = 69;
                                _context3.t2 = _context3["catch"](65);
                                _didIteratorError4 = true;
                                _iteratorError4 = _context3.t2;

                            case 73:
                                _context3.prev = 73;
                                _context3.prev = 74;

                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }

                            case 76:
                                _context3.prev = 76;

                                if (!_didIteratorError4) {
                                    _context3.next = 79;
                                    break;
                                }

                                throw _iteratorError4;

                            case 79:
                                return _context3.finish(76);

                            case 80:
                                return _context3.finish(73);

                            case 81:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[10, 14, 18, 26], [19,, 21, 25], [39, 43, 47, 55], [48,, 50, 54], [65, 69, 73, 81], [74,, 76, 80]]);
            }));
        }
    }, {
        key: "calculateDimensions",
        value: function calculateDimensions() {
            //Each character has a vertical and horizontal gap between every other character
            var combinedVerticalGapLength = gap * (maxCharactersInColumn - 1);
            //draw.native() returns the SVG element.
            //The simpler draw.node.clientHeight breaks on Firefox
            ///draw.n

            //characterSideLength is the width and height of every character
            //because it is calculated based on the height of the SVG, the animation
            //will break if the SVG has a large height and a small width
            var _common_animator_1$ge = common_animator_1.getBaseDimensions(this.draw);

            var _common_animator_1$ge2 = _slicedToArray(_common_animator_1$ge, 2);

            baseWidth = _common_animator_1$ge2[0];
            baseHeight = _common_animator_1$ge2[1];
            characterSideLength = Math.round((baseHeight - combinedVerticalGapLength) / maxCharactersInColumn);
            leftBankXCoord = 0;
            /*
            Here's an explanatory drawing for the left river bank. The right river bank is the same, except you reflect the drawing across the y-axis.
            Character1 gap Character3 gap (... repeat horizontally until maxColumns is reached)
            Character2 gap Character4 gap
            -----------------------------  = total width of a river bank
            (repeat vertically until maxCharactersInColumn is reached)
            */
            rightBankXCoord = baseWidth - maxColumns * characterSideLength - gap;
        }
    }, {
        key: "initBackground",
        value: function initBackground() {
            riverBankWidth = characterSideLength * maxColumns + gap;
            var leftbank = this.draw.rect(riverBankWidth, baseHeight).move(0, 0).fill(grassColor);
            leftbank.clone().x(rightBankXCoord);
            //draws the river
            this.draw.rect(baseWidth - riverBankWidth * 2, baseHeight).move(riverBankWidth, 0).fill(waterColor);
            //The parent element has padding - as such a gradient on the parent element
            // is needed to give the illustion that the SVG takes up the entire space of the parent element
            var gradientGreenLeft = riverBankWidth + parseInt(window.getComputedStyle(this.draw.node.parentElement, null).getPropertyValue('padding-left').replace(/px/g, ''));
            var gradientGreenRight = this.draw.node.parentElement.offsetWidth - gradientGreenLeft;
            this.draw.node.parentElement.style.background = "linear-gradient(to right, " + grassColor + " 0%, " + grassColor + " " + gradientGreenLeft + "px, " + waterColor + " " + gradientGreenLeft + "px, " + waterColor + " " + gradientGreenRight + "px, " + grassColor + " " + gradientGreenRight + "px, " + grassColor + " 100%)";
        }
    }]);

    return RiverAnimator;
}();

exports.RiverAnimator = RiverAnimator;
function drawRiverBank(xCoord, IDs) {
    var totalCharactersDrawn = 0;
    var currentXCoord = xCoord;
    columnLoop: for (var currentColumn = 0; currentColumn < maxColumns; currentColumn++) {
        var currentYCoord = 0;
        for (var currentRow = 0; currentRow < maxCharactersInColumn; currentRow++) {
            if (totalCharactersDrawn === IDs.length) {
                break columnLoop;
            }
            drawings.get(IDs[totalCharactersDrawn]).move(currentXCoord, currentYCoord);
            currentYCoord += characterSideLength + gap;
            totalCharactersDrawn++;
        }
        currentXCoord += characterSideLength;
    }
}
},{"../base-puzzle-setup":"puzzles/base-puzzle-setup.ts","../base-animator":"puzzles/base-animator.ts","./river-setup":"puzzles/crossing-puzzles/river-setup.ts","./common-animator":"puzzles/crossing-puzzles/common-animator.ts","./common-setup":"puzzles/crossing-puzzles/common-setup.ts"}],"puzzles/puzzle-manager.ts":[function(require,module,exports) {
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = this && this.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var alerts_1 = require("../ui/alerts");
//@ts-ignore - no module defs for JS file
var MessageDisplay = __importStar(require("../ui/message-view"));

var TutorialData =
//static riverCrossingBaseDir = "./assets/river-crossing/";
function TutorialData(objective, images, rules, code) {
    var active = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

    _classCallCheck(this, TutorialData);

    this.objective = objective;
    this.images = images;
    this.rules = rules;
    this.code = code;
    this.active = active;
};

var PuzzleSetup = function () {
    function PuzzleSetup(specificSetupCode, tutorialData) {
        _classCallCheck(this, PuzzleSetup);

        this.tutorialData = tutorialData;
        this.setupCode = function () {
            MessageDisplay.clearMessages();
            specificSetupCode();
        };
    }

    _createClass(PuzzleSetup, [{
        key: "endCode",
        value: function endCode(runtimeError) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var animator, lineNum, extractedlineNum;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                animator = this.createAnimator();
                                _context.next = 3;
                                return animator.animate();

                            case 3:
                                if (runtimeError !== undefined) {
                                    lineNum = void 0;
                                    extractedlineNum = /<anonymous>:(\d+)/.exec(JSON.stringify(runtimeError, Object.getOwnPropertyNames(runtimeError)));
                                    //@ts-ignore Error has no property lineNumber (lineNumber is a non standard FF field)

                                    if (runtimeError.lineNumber !== undefined) {
                                        //@ts-ignore Same as previous line
                                        lineNum = runtimeError.lineNumber - 2;
                                    } else if (extractedlineNum !== null) {
                                        lineNum = parseInt(extractedlineNum[1]) - 2;
                                    } else {
                                        alerts_1.codeErrorAlert();
                                    }
                                    //@ts-ignore - ignore lineNum used before initialized (already know that)
                                    if (lineNum !== undefined) {
                                        MessageDisplay.addMessage("Exception at line " + lineNum + ": " + '"' + runtimeError.message + '"');
                                    }
                                }

                            case 4:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }]);

    return PuzzleSetup;
}();

var StandardSetup = function (_PuzzleSetup) {
    _inherits(StandardSetup, _PuzzleSetup);

    function StandardSetup(assetsDir, specificSetupCode, tutorialData) {
        _classCallCheck(this, StandardSetup);

        var _this = _possibleConstructorReturn(this, (StandardSetup.__proto__ || Object.getPrototypeOf(StandardSetup)).call(this, specificSetupCode, tutorialData));

        _this.assetsDir = assetsDir;
        return _this;
    }

    _createClass(StandardSetup, [{
        key: "createAnimator",
        value: function createAnimator() {
            return new this.animatorConstructor(MessageDisplay.addMessage, this.assetsDir);
        }
    }]);

    return StandardSetup;
}(PuzzleSetup);

var bridge_setup_1 = require("./crossing-puzzles/bridge-setup");
var bridge_animator_1 = require("./crossing-puzzles/bridge-animator");

var BridgeSetup = function (_StandardSetup) {
    _inherits(BridgeSetup, _StandardSetup);

    function BridgeSetup(specificSetupCode, assetsDir, tutorialData) {
        _classCallCheck(this, BridgeSetup);

        var _this2 = _possibleConstructorReturn(this, (BridgeSetup.__proto__ || Object.getPrototypeOf(BridgeSetup)).call(this, assetsDir, specificSetupCode, tutorialData));

        _this2.__environment__ = { giveTorch: bridge_setup_1.giveTorch, crossBridge: bridge_setup_1.crossBridge };
        _this2.animatorConstructor = bridge_animator_1.BridgeAnimator;
        _this2.tutorialData.images = _this2.tutorialData.images.map(function (image) {
            return _this2.assetsDir + image;
        });
        return _this2;
    }

    return BridgeSetup;
}(StandardSetup);

"";
var river_setup_1 = require("./crossing-puzzles/river-setup");
var river_animator_1 = require("./crossing-puzzles/river-animator");

var RiverSetup = function (_StandardSetup2) {
    _inherits(RiverSetup, _StandardSetup2);

    function RiverSetup(specificSetupCode, assetsDir, tutorialData) {
        _classCallCheck(this, RiverSetup);

        var _this3 = _possibleConstructorReturn(this, (RiverSetup.__proto__ || Object.getPrototypeOf(RiverSetup)).call(this, assetsDir, specificSetupCode, tutorialData));

        _this3.__environment__ = { moveBoat: river_setup_1.moveBoat };
        _this3.animatorConstructor = river_animator_1.RiverAnimator;
        _this3.tutorialData.images = _this3.tutorialData.images.map(function (image) {
            return './assets/river-crossing/' + _this3.assetsDir + image;
        });
        return _this3;
    }

    return RiverSetup;
}(StandardSetup);

var goatCabbageWolfDir = "goat-apple-wolf/";
exports.goatCabbageWolf = new RiverSetup(function () {
    var _river_setup_1$initGo = river_setup_1.initGoatPuzzle(),
        _river_setup_1$initGo2 = _slicedToArray(_river_setup_1$initGo, 4),
        goat = _river_setup_1$initGo2[0],
        apple = _river_setup_1$initGo2[1],
        wolf = _river_setup_1$initGo2[2],
        farmer = _river_setup_1$initGo2[3];

    Object.assign(exports.goatCabbageWolf.__environment__, { goat: goat, apple: apple, wolf: wolf, farmer: farmer });
}, goatCabbageWolfDir, new TutorialData("Get the wolf, goat, farmer, and apple to the right side of the river using the boat.", ["wolf.svg", "goat.svg", "farmer.svg", "apple.svg"], ["The wolf cannot be left alone with the goat.", "The goat cannot be left alone with the apple.", "Only the farmer can row the boat.", "The boat can hold up to 2 objects."], ["<p><code>moveBoat</code> is a function that moves the boat to the opposite side of the river. It accepts any number of the following objects: <code>wolf</code>, <code>goat</code>,<code>apple</code>, or <code>farmer</code>." + " An example use would be <code>moveBoat(farmer, goat)</code>.</p>"]));
var vampirePriestDir = "vampire-priest/";
exports.vampirePriest = new RiverSetup(function () {
    var _river_setup_1$initVa = river_setup_1.initVampirePuzzle(),
        _river_setup_1$initVa2 = _slicedToArray(_river_setup_1$initVa, 2),
        vampires = _river_setup_1$initVa2[0],
        priests = _river_setup_1$initVa2[1];

    Object.assign(exports.vampirePriest.__environment__, { vampires: vampires, priests: priests });
}, vampirePriestDir, new TutorialData("Get the priests and vampires to the other side of the river using the boat.", ["priest.svg", "vampire.svg"], ["The boat can hold a maximum of 2 people.", "The number of vampires cannot exceed the number of priests on either side of the river."], ["<p><code>priests</code> and <code>vampires</code> are arrays that contain 3 vampire and priest objects each. <code>priests[0]</code> and <code>vampires[0]</code> are the first priest and vampire respectively. <code>priests[1]</code> and <code>vampires[1]</code> are the second priest and vampire respectively. Repeat for all priests and vampires.</p>", "<p><code>moveBoat</code> is a function that accepts any number of priest and vampire objects. An example usage would be <code>moveBoat(priests[0], vampires[0])</code> or <code>moveBoat(vampires[0], vampires[1])</code>.</p>"]));
var soldierBoyDir = "soldier-boy/";
exports.soldierBoy = new RiverSetup(function () {
    var _river_setup_1$initSo = river_setup_1.initSoldierPuzzle(),
        _river_setup_1$initSo2 = _slicedToArray(_river_setup_1$initSo, 2),
        soldiers = _river_setup_1$initSo2[0],
        boys = _river_setup_1$initSo2[1];

    Object.assign(exports.soldierBoy.__environment__, { soldiers: soldiers, boys: boys });
}, soldierBoyDir, new TutorialData("Get the soldiers and boys to the other side of the river using the boat.", ["soldier.svg", "boy.svg"], ["The boat can carry 2 boys, a solder and a boy, but not 2 soldiers."], ["<p><code>soldiers</code> and <code>boys</code> are arrays that contain 6 soldiers and 2 boys respectively. <code>soldiers[0]</code> and <code>boys[0]</code> are the first soldier and boy respectively. <code>soldiers[1]</code> and <code>boys[1]</code> are the second soldier and boy respectively. Repeat for all remaining soldiers.</p>", "<p><code>moveBoat</code> is a function that accepts any number of soldier and boy objects. An example usage would be <code>moveBoat(soldiers[0], boys[0])</code> or <code>moveBoat(soldiers[0], soldiers[1])</code>.</p>"]));
var husbandWifeDir = "husband-wife/";
exports.husbandWife = new RiverSetup(function () {
    var _river_setup_1$initHu = river_setup_1.initHusbandPuzzle(),
        _river_setup_1$initHu2 = _slicedToArray(_river_setup_1$initHu, 4),
        Bob = _river_setup_1$initHu2[0],
        Bob_Wife = _river_setup_1$initHu2[1],
        Charlie = _river_setup_1$initHu2[2],
        Charlie_Wife = _river_setup_1$initHu2[3];

    Object.assign(exports.husbandWife.__environment__, { Bob: Bob, Bob_Wife: Bob_Wife, Charlie: Charlie, Charlie_Wife: Charlie_Wife });
}, husbandWifeDir, new TutorialData("Get the husbands and wives to the other side of the river using the boat.", ["Bob.svg", "Bob_Wife.svg", "Charlie.svg", "Charlie_Wife.svg"], ["Charlie cannot be left alone with Bob's wife.", "Bob cannot be left alone with Charlie's Wife.", "The boat can hold up to 2 people."], ["<p><code>moveBoat</code> is a function that moves the boat to the opposite side of the river. It accepts any number of the following objects: <code>Bob</code>, <code>Bob_Wife</code>,<code>Charlie</code>, or <code>Charlie_Wife</code>." + " An example use would be <code>moveBoat(Bob, Charlie_Wife)</code>.</p>"]));
var ghoulDir = "./assets/bridge-crossing/ghoul-adventurer/";
exports.ghoul = new BridgeSetup(function () {
    var _bridge_setup_1$initG = bridge_setup_1.initGhoulPuzzle(),
        _bridge_setup_1$initG2 = _slicedToArray(_bridge_setup_1$initG, 4),
        Alice = _bridge_setup_1$initG2[0],
        Bob = _bridge_setup_1$initG2[1],
        Charlie = _bridge_setup_1$initG2[2],
        Doris = _bridge_setup_1$initG2[3];

    Object.assign(exports.ghoul.__environment__, { Alice: Alice, Bob: Bob, Charlie: Charlie, Doris: Doris });
}, ghoulDir, new TutorialData("Get all four adventurers to the other side of the bridge.", ["Alice.svg", "Bob.svg", "Charlie.svg", "Doris.svg"], [""], []));
},{"../ui/alerts":"ui/alerts.ts","../ui/message-view":"ui/message-view.js","./crossing-puzzles/bridge-setup":"puzzles/crossing-puzzles/bridge-setup.ts","./crossing-puzzles/bridge-animator":"puzzles/crossing-puzzles/bridge-animator.ts","./crossing-puzzles/river-setup":"puzzles/crossing-puzzles/river-setup.ts","./crossing-puzzles/river-animator":"puzzles/crossing-puzzles/river-animator.ts"}],"ui/modal-controller.js":[function(require,module,exports) {
exports.initModal = function (data) {
    new Vue({
        el: "#vue-app-modal",
        data: data,
        methods: {
            continueToPuzzle: function continueToPuzzle() {
                this.active = false;
            },

            returnToMenu: function returnToMenu() {
                window.history.back();
            }
        }
    });
};
},{}],"main.js":[function(require,module,exports) {
'use strict';

require('regenerator-runtime/runtime');

var _alerts = require('./ui/alerts');

var _puzzleManager = require('./puzzles/puzzle-manager');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } //Required for support of async/await on older browsers


//Setup Ace Editor
var editor = ace.edit('editor');
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setShowPrintMargin(false);
editor.getSession().setUseWrapMode(true);
editor.setFontSize(20);

var puzzles = new Map();
puzzles.set("Animals and Vegetables", _puzzleManager.goatCabbageWolf);
puzzles.set("Priests and Vampires", _puzzleManager.vampirePriest);
puzzles.set("Soldiers and Boys", _puzzleManager.soldierBoy);
puzzles.set("Husbands and Wives", _puzzleManager.husbandWife);
puzzles.set("Ghouls and Adventurers", _puzzleManager.ghoul);

//set current puzzle
var currentPuzzle = puzzles.get(sessionStorage.getItem('puzzleID'));

//Setup Modal Controller
var modalController = require('./ui/modal-controller');
modalController.initModal(currentPuzzle.tutorialData);

var runButtonVueManager = new Vue({
    el: "#vue-run-button",
    data: {
        runningCode: false
    },
    methods: {
        runUserCode: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, annotation;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.runningCode = true;

                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 4;
                                _iterator = editor.getSession().getAnnotations()[Symbol.iterator]();

                            case 6:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 15;
                                    break;
                                }

                                annotation = _step.value;

                                if (!(annotation.type === 'warning' || annotation.type === 'error')) {
                                    _context.next = 12;
                                    break;
                                }

                                (0, _alerts.codeErrorAlert)();
                                this.runningCode = false;
                                return _context.abrupt('return');

                            case 12:
                                _iteratorNormalCompletion = true;
                                _context.next = 6;
                                break;

                            case 15:
                                _context.next = 21;
                                break;

                            case 17:
                                _context.prev = 17;
                                _context.t0 = _context['catch'](4);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 21:
                                _context.prev = 21;
                                _context.prev = 22;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 24:
                                _context.prev = 24;

                                if (!_didIteratorError) {
                                    _context.next = 27;
                                    break;
                                }

                                throw _iteratorError;

                            case 27:
                                return _context.finish(24);

                            case 28:
                                return _context.finish(21);

                            case 29:

                                currentPuzzle.setupCode();

                                _context.prev = 30;

                                new (Function.prototype.bind.apply(Function, [null].concat(_toConsumableArray(Object.keys(currentPuzzle.__environment__)), [editor.getValue()])))().apply(undefined, _toConsumableArray(Object.values(currentPuzzle.__environment__)));

                                _context.next = 34;
                                return currentPuzzle.endCode();

                            case 34:
                                _context.next = 40;
                                break;

                            case 36:
                                _context.prev = 36;
                                _context.t1 = _context['catch'](30);
                                _context.next = 40;
                                return currentPuzzle.endCode(_context.t1);

                            case 40:

                                this.runningCode = false;

                            case 41:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[4, 17, 21, 29], [22,, 24, 28], [30, 36]]);
            }));

            function runUserCode() {
                return _ref.apply(this, arguments);
            }

            return runUserCode;
        }()
    }
});

runButtonVueManager.runUserCode();
},{"regenerator-runtime/runtime":"../../node_modules/regenerator-runtime/runtime.js","./ui/alerts":"ui/alerts.ts","./puzzles/puzzle-manager":"puzzles/puzzle-manager.ts","./ui/modal-controller":"ui/modal-controller.js"}]},{},["main.js"], null)
//# sourceMappingURL=/main.map