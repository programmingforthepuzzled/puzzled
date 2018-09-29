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
},{}],"utils.ts":[function(require,module,exports) {
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
exports.default = sleep;
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
},{}],"../../node_modules/common-tags/es/TemplateTag/TemplateTag.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _templateObject = _taggedTemplateLiteral(['', ''], ['', '']);

function _taggedTemplateLiteral(strings, raw) {
  return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * @class TemplateTag
 * @classdesc Consumes a pipeline of composable transformer plugins and produces a template tag.
 */
var TemplateTag = function () {
  /**
   * constructs a template tag
   * @constructs TemplateTag
   * @param  {...Object} [...transformers] - an array or arguments list of transformers
   * @return {Function}                    - a template tag
   */
  function TemplateTag() {
    var _this = this;

    for (var _len = arguments.length, transformers = Array(_len), _key = 0; _key < _len; _key++) {
      transformers[_key] = arguments[_key];
    }

    _classCallCheck(this, TemplateTag);

    this.tag = function (strings) {
      for (var _len2 = arguments.length, expressions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        expressions[_key2 - 1] = arguments[_key2];
      }

      if (typeof strings === 'function') {
        // if the first argument passed is a function, assume it is a template tag and return
        // an intermediary tag that processes the template using the aforementioned tag, passing the
        // result to our tag
        return _this.interimTag.bind(_this, strings);
      }

      if (typeof strings === 'string') {
        // if the first argument passed is a string, just transform it
        return _this.transformEndResult(strings);
      }

      // else, return a transformed end result of processing the template with our tag
      strings = strings.map(_this.transformString.bind(_this));
      return _this.transformEndResult(strings.reduce(_this.processSubstitutions.bind(_this, expressions)));
    };

    // if first argument is an array, extrude it as a list of transformers
    if (transformers.length > 0 && Array.isArray(transformers[0])) {
      transformers = transformers[0];
    }

    // if any transformers are functions, this means they are not initiated - automatically initiate them
    this.transformers = transformers.map(function (transformer) {
      return typeof transformer === 'function' ? transformer() : transformer;
    });

    // return an ES2015 template tag
    return this.tag;
  }

  /**
   * Applies all transformers to a template literal tagged with this method.
   * If a function is passed as the first argument, assumes the function is a template tag
   * and applies it to the template, returning a template tag.
   * @param  {(Function|String|Array<String>)} strings        - Either a template tag or an array containing template strings separated by identifier
   * @param  {...*}                            ...expressions - Optional list of substitution values.
   * @return {(String|Function)}                              - Either an intermediary tag function or the results of processing the template.
   */

  _createClass(TemplateTag, [{
    key: 'interimTag',

    /**
     * An intermediary template tag that receives a template tag and passes the result of calling the template with the received
     * template tag to our own template tag.
     * @param  {Function}        nextTag          - the received template tag
     * @param  {Array<String>}   template         - the template to process
     * @param  {...*}            ...substitutions - `substitutions` is an array of all substitutions in the template
     * @return {*}                                - the final processed value
     */
    value: function interimTag(previousTag, template) {
      for (var _len3 = arguments.length, substitutions = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        substitutions[_key3 - 2] = arguments[_key3];
      }

      return this.tag(_templateObject, previousTag.apply(undefined, [template].concat(substitutions)));
    }

    /**
     * Performs bulk processing on the tagged template, transforming each substitution and then
     * concatenating the resulting values into a string.
     * @param  {Array<*>} substitutions - an array of all remaining substitutions present in this template
     * @param  {String}   resultSoFar   - this iteration's result string so far
     * @param  {String}   remainingPart - the template chunk after the current substitution
     * @return {String}                 - the result of joining this iteration's processed substitution with the result
     */

  }, {
    key: 'processSubstitutions',
    value: function processSubstitutions(substitutions, resultSoFar, remainingPart) {
      var substitution = this.transformSubstitution(substitutions.shift(), resultSoFar);
      return ''.concat(resultSoFar, substitution, remainingPart);
    }

    /**
     * Iterate through each transformer, applying the transformer's `onString` method to the template
     * strings before all substitutions are processed.
     * @param {String}  str - The input string
     * @return {String}     - The final results of processing each transformer
     */

  }, {
    key: 'transformString',
    value: function transformString(str) {
      var cb = function cb(res, transform) {
        return transform.onString ? transform.onString(res) : res;
      };
      return this.transformers.reduce(cb, str);
    }

    /**
     * When a substitution is encountered, iterates through each transformer and applies the transformer's
     * `onSubstitution` method to the substitution.
     * @param  {*}      substitution - The current substitution
     * @param  {String} resultSoFar  - The result up to and excluding this substitution.
     * @return {*}                   - The final result of applying all substitution transformations.
     */

  }, {
    key: 'transformSubstitution',
    value: function transformSubstitution(substitution, resultSoFar) {
      var cb = function cb(res, transform) {
        return transform.onSubstitution ? transform.onSubstitution(res, resultSoFar) : res;
      };
      return this.transformers.reduce(cb, substitution);
    }

    /**
     * Iterates through each transformer, applying the transformer's `onEndResult` method to the
     * template literal after all substitutions have finished processing.
     * @param  {String} endResult - The processed template, just before it is returned from the tag
     * @return {String}           - The final results of processing each transformer
     */

  }, {
    key: 'transformEndResult',
    value: function transformEndResult(endResult) {
      var cb = function cb(res, transform) {
        return transform.onEndResult ? transform.onEndResult(res) : res;
      };
      return this.transformers.reduce(cb, endResult);
    }
  }]);

  return TemplateTag;
}();

exports.default = TemplateTag;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9UZW1wbGF0ZVRhZy9UZW1wbGF0ZVRhZy5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInRyYW5zZm9ybWVycyIsInRhZyIsInN0cmluZ3MiLCJleHByZXNzaW9ucyIsImludGVyaW1UYWciLCJiaW5kIiwidHJhbnNmb3JtRW5kUmVzdWx0IiwibWFwIiwidHJhbnNmb3JtU3RyaW5nIiwicmVkdWNlIiwicHJvY2Vzc1N1YnN0aXR1dGlvbnMiLCJsZW5ndGgiLCJBcnJheSIsImlzQXJyYXkiLCJ0cmFuc2Zvcm1lciIsInByZXZpb3VzVGFnIiwidGVtcGxhdGUiLCJzdWJzdGl0dXRpb25zIiwicmVzdWx0U29GYXIiLCJyZW1haW5pbmdQYXJ0Iiwic3Vic3RpdHV0aW9uIiwidHJhbnNmb3JtU3Vic3RpdHV0aW9uIiwic2hpZnQiLCJjb25jYXQiLCJzdHIiLCJjYiIsInJlcyIsInRyYW5zZm9ybSIsIm9uU3RyaW5nIiwib25TdWJzdGl0dXRpb24iLCJlbmRSZXN1bHQiLCJvbkVuZFJlc3VsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztJQUlxQkEsVztBQUNuQjs7Ozs7O0FBTUEseUJBQTZCO0FBQUE7O0FBQUEsc0NBQWRDLFlBQWM7QUFBZEEsa0JBQWM7QUFBQTs7QUFBQTs7QUFBQSxTQXVCN0JDLEdBdkI2QixHQXVCdkIsVUFBQ0MsT0FBRCxFQUE2QjtBQUFBLHlDQUFoQkMsV0FBZ0I7QUFBaEJBLG1CQUFnQjtBQUFBOztBQUNqQyxVQUFJLE9BQU9ELE9BQVAsS0FBbUIsVUFBdkIsRUFBbUM7QUFDakM7QUFDQTtBQUNBO0FBQ0EsZUFBTyxNQUFLRSxVQUFMLENBQWdCQyxJQUFoQixRQUEyQkgsT0FBM0IsQ0FBUDtBQUNEOztBQUVELFVBQUksT0FBT0EsT0FBUCxLQUFtQixRQUF2QixFQUFpQztBQUMvQjtBQUNBLGVBQU8sTUFBS0ksa0JBQUwsQ0FBd0JKLE9BQXhCLENBQVA7QUFDRDs7QUFFRDtBQUNBQSxnQkFBVUEsUUFBUUssR0FBUixDQUFZLE1BQUtDLGVBQUwsQ0FBcUJILElBQXJCLE9BQVosQ0FBVjtBQUNBLGFBQU8sTUFBS0Msa0JBQUwsQ0FDTEosUUFBUU8sTUFBUixDQUFlLE1BQUtDLG9CQUFMLENBQTBCTCxJQUExQixRQUFxQ0YsV0FBckMsQ0FBZixDQURLLENBQVA7QUFHRCxLQXpDNEI7O0FBQzNCO0FBQ0EsUUFBSUgsYUFBYVcsTUFBYixHQUFzQixDQUF0QixJQUEyQkMsTUFBTUMsT0FBTixDQUFjYixhQUFhLENBQWIsQ0FBZCxDQUEvQixFQUErRDtBQUM3REEscUJBQWVBLGFBQWEsQ0FBYixDQUFmO0FBQ0Q7O0FBRUQ7QUFDQSxTQUFLQSxZQUFMLEdBQW9CQSxhQUFhTyxHQUFiLENBQWlCLHVCQUFlO0FBQ2xELGFBQU8sT0FBT08sV0FBUCxLQUF1QixVQUF2QixHQUFvQ0EsYUFBcEMsR0FBb0RBLFdBQTNEO0FBQ0QsS0FGbUIsQ0FBcEI7O0FBSUE7QUFDQSxXQUFPLEtBQUtiLEdBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7QUE0QkE7Ozs7Ozs7OytCQVFXYyxXLEVBQWFDLFEsRUFBNEI7QUFBQSx5Q0FBZkMsYUFBZTtBQUFmQSxxQkFBZTtBQUFBOztBQUNsRCxhQUFPLEtBQUtoQixHQUFaLGtCQUFrQmMsOEJBQVlDLFFBQVosU0FBeUJDLGFBQXpCLEVBQWxCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O3lDQVFxQkEsYSxFQUFlQyxXLEVBQWFDLGEsRUFBZTtBQUM5RCxVQUFNQyxlQUFlLEtBQUtDLHFCQUFMLENBQ25CSixjQUFjSyxLQUFkLEVBRG1CLEVBRW5CSixXQUZtQixDQUFyQjtBQUlBLGFBQU8sR0FBR0ssTUFBSCxDQUFVTCxXQUFWLEVBQXVCRSxZQUF2QixFQUFxQ0QsYUFBckMsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7b0NBTWdCSyxHLEVBQUs7QUFDbkIsVUFBTUMsS0FBSyxTQUFMQSxFQUFLLENBQUNDLEdBQUQsRUFBTUMsU0FBTjtBQUFBLGVBQ1RBLFVBQVVDLFFBQVYsR0FBcUJELFVBQVVDLFFBQVYsQ0FBbUJGLEdBQW5CLENBQXJCLEdBQStDQSxHQUR0QztBQUFBLE9BQVg7QUFFQSxhQUFPLEtBQUsxQixZQUFMLENBQWtCUyxNQUFsQixDQUF5QmdCLEVBQXpCLEVBQTZCRCxHQUE3QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7MENBT3NCSixZLEVBQWNGLFcsRUFBYTtBQUMvQyxVQUFNTyxLQUFLLFNBQUxBLEVBQUssQ0FBQ0MsR0FBRCxFQUFNQyxTQUFOO0FBQUEsZUFDVEEsVUFBVUUsY0FBVixHQUNJRixVQUFVRSxjQUFWLENBQXlCSCxHQUF6QixFQUE4QlIsV0FBOUIsQ0FESixHQUVJUSxHQUhLO0FBQUEsT0FBWDtBQUlBLGFBQU8sS0FBSzFCLFlBQUwsQ0FBa0JTLE1BQWxCLENBQXlCZ0IsRUFBekIsRUFBNkJMLFlBQTdCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O3VDQU1tQlUsUyxFQUFXO0FBQzVCLFVBQU1MLEtBQUssU0FBTEEsRUFBSyxDQUFDQyxHQUFELEVBQU1DLFNBQU47QUFBQSxlQUNUQSxVQUFVSSxXQUFWLEdBQXdCSixVQUFVSSxXQUFWLENBQXNCTCxHQUF0QixDQUF4QixHQUFxREEsR0FENUM7QUFBQSxPQUFYO0FBRUEsYUFBTyxLQUFLMUIsWUFBTCxDQUFrQlMsTUFBbEIsQ0FBeUJnQixFQUF6QixFQUE2QkssU0FBN0IsQ0FBUDtBQUNEOzs7Ozs7ZUFuSGtCL0IsVyIsImZpbGUiOiJUZW1wbGF0ZVRhZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGNsYXNzIFRlbXBsYXRlVGFnXG4gKiBAY2xhc3NkZXNjIENvbnN1bWVzIGEgcGlwZWxpbmUgb2YgY29tcG9zYWJsZSB0cmFuc2Zvcm1lciBwbHVnaW5zIGFuZCBwcm9kdWNlcyBhIHRlbXBsYXRlIHRhZy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGVUYWcge1xuICAvKipcbiAgICogY29uc3RydWN0cyBhIHRlbXBsYXRlIHRhZ1xuICAgKiBAY29uc3RydWN0cyBUZW1wbGF0ZVRhZ1xuICAgKiBAcGFyYW0gIHsuLi5PYmplY3R9IFsuLi50cmFuc2Zvcm1lcnNdIC0gYW4gYXJyYXkgb3IgYXJndW1lbnRzIGxpc3Qgb2YgdHJhbnNmb3JtZXJzXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSAgICAgICAgICAgICAgICAgICAgLSBhIHRlbXBsYXRlIHRhZ1xuICAgKi9cbiAgY29uc3RydWN0b3IoLi4udHJhbnNmb3JtZXJzKSB7XG4gICAgLy8gaWYgZmlyc3QgYXJndW1lbnQgaXMgYW4gYXJyYXksIGV4dHJ1ZGUgaXQgYXMgYSBsaXN0IG9mIHRyYW5zZm9ybWVyc1xuICAgIGlmICh0cmFuc2Zvcm1lcnMubGVuZ3RoID4gMCAmJiBBcnJheS5pc0FycmF5KHRyYW5zZm9ybWVyc1swXSkpIHtcbiAgICAgIHRyYW5zZm9ybWVycyA9IHRyYW5zZm9ybWVyc1swXTtcbiAgICB9XG5cbiAgICAvLyBpZiBhbnkgdHJhbnNmb3JtZXJzIGFyZSBmdW5jdGlvbnMsIHRoaXMgbWVhbnMgdGhleSBhcmUgbm90IGluaXRpYXRlZCAtIGF1dG9tYXRpY2FsbHkgaW5pdGlhdGUgdGhlbVxuICAgIHRoaXMudHJhbnNmb3JtZXJzID0gdHJhbnNmb3JtZXJzLm1hcCh0cmFuc2Zvcm1lciA9PiB7XG4gICAgICByZXR1cm4gdHlwZW9mIHRyYW5zZm9ybWVyID09PSAnZnVuY3Rpb24nID8gdHJhbnNmb3JtZXIoKSA6IHRyYW5zZm9ybWVyO1xuICAgIH0pO1xuXG4gICAgLy8gcmV0dXJuIGFuIEVTMjAxNSB0ZW1wbGF0ZSB0YWdcbiAgICByZXR1cm4gdGhpcy50YWc7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBhbGwgdHJhbnNmb3JtZXJzIHRvIGEgdGVtcGxhdGUgbGl0ZXJhbCB0YWdnZWQgd2l0aCB0aGlzIG1ldGhvZC5cbiAgICogSWYgYSBmdW5jdGlvbiBpcyBwYXNzZWQgYXMgdGhlIGZpcnN0IGFyZ3VtZW50LCBhc3N1bWVzIHRoZSBmdW5jdGlvbiBpcyBhIHRlbXBsYXRlIHRhZ1xuICAgKiBhbmQgYXBwbGllcyBpdCB0byB0aGUgdGVtcGxhdGUsIHJldHVybmluZyBhIHRlbXBsYXRlIHRhZy5cbiAgICogQHBhcmFtICB7KEZ1bmN0aW9ufFN0cmluZ3xBcnJheTxTdHJpbmc+KX0gc3RyaW5ncyAgICAgICAgLSBFaXRoZXIgYSB0ZW1wbGF0ZSB0YWcgb3IgYW4gYXJyYXkgY29udGFpbmluZyB0ZW1wbGF0ZSBzdHJpbmdzIHNlcGFyYXRlZCBieSBpZGVudGlmaWVyXG4gICAqIEBwYXJhbSAgey4uLip9ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmV4cHJlc3Npb25zIC0gT3B0aW9uYWwgbGlzdCBvZiBzdWJzdGl0dXRpb24gdmFsdWVzLlxuICAgKiBAcmV0dXJuIHsoU3RyaW5nfEZ1bmN0aW9uKX0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIEVpdGhlciBhbiBpbnRlcm1lZGlhcnkgdGFnIGZ1bmN0aW9uIG9yIHRoZSByZXN1bHRzIG9mIHByb2Nlc3NpbmcgdGhlIHRlbXBsYXRlLlxuICAgKi9cbiAgdGFnID0gKHN0cmluZ3MsIC4uLmV4cHJlc3Npb25zKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBzdHJpbmdzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBpZiB0aGUgZmlyc3QgYXJndW1lbnQgcGFzc2VkIGlzIGEgZnVuY3Rpb24sIGFzc3VtZSBpdCBpcyBhIHRlbXBsYXRlIHRhZyBhbmQgcmV0dXJuXG4gICAgICAvLyBhbiBpbnRlcm1lZGlhcnkgdGFnIHRoYXQgcHJvY2Vzc2VzIHRoZSB0ZW1wbGF0ZSB1c2luZyB0aGUgYWZvcmVtZW50aW9uZWQgdGFnLCBwYXNzaW5nIHRoZVxuICAgICAgLy8gcmVzdWx0IHRvIG91ciB0YWdcbiAgICAgIHJldHVybiB0aGlzLmludGVyaW1UYWcuYmluZCh0aGlzLCBzdHJpbmdzKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHN0cmluZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBpZiB0aGUgZmlyc3QgYXJndW1lbnQgcGFzc2VkIGlzIGEgc3RyaW5nLCBqdXN0IHRyYW5zZm9ybSBpdFxuICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtRW5kUmVzdWx0KHN0cmluZ3MpO1xuICAgIH1cblxuICAgIC8vIGVsc2UsIHJldHVybiBhIHRyYW5zZm9ybWVkIGVuZCByZXN1bHQgb2YgcHJvY2Vzc2luZyB0aGUgdGVtcGxhdGUgd2l0aCBvdXIgdGFnXG4gICAgc3RyaW5ncyA9IHN0cmluZ3MubWFwKHRoaXMudHJhbnNmb3JtU3RyaW5nLmJpbmQodGhpcykpO1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUVuZFJlc3VsdChcbiAgICAgIHN0cmluZ3MucmVkdWNlKHRoaXMucHJvY2Vzc1N1YnN0aXR1dGlvbnMuYmluZCh0aGlzLCBleHByZXNzaW9ucykpLFxuICAgICk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFuIGludGVybWVkaWFyeSB0ZW1wbGF0ZSB0YWcgdGhhdCByZWNlaXZlcyBhIHRlbXBsYXRlIHRhZyBhbmQgcGFzc2VzIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgdGVtcGxhdGUgd2l0aCB0aGUgcmVjZWl2ZWRcbiAgICogdGVtcGxhdGUgdGFnIHRvIG91ciBvd24gdGVtcGxhdGUgdGFnLlxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgICAgIG5leHRUYWcgICAgICAgICAgLSB0aGUgcmVjZWl2ZWQgdGVtcGxhdGUgdGFnXG4gICAqIEBwYXJhbSAge0FycmF5PFN0cmluZz59ICAgdGVtcGxhdGUgICAgICAgICAtIHRoZSB0ZW1wbGF0ZSB0byBwcm9jZXNzXG4gICAqIEBwYXJhbSAgey4uLip9ICAgICAgICAgICAgLi4uc3Vic3RpdHV0aW9ucyAtIGBzdWJzdGl0dXRpb25zYCBpcyBhbiBhcnJheSBvZiBhbGwgc3Vic3RpdHV0aW9ucyBpbiB0aGUgdGVtcGxhdGVcbiAgICogQHJldHVybiB7Kn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gdGhlIGZpbmFsIHByb2Nlc3NlZCB2YWx1ZVxuICAgKi9cbiAgaW50ZXJpbVRhZyhwcmV2aW91c1RhZywgdGVtcGxhdGUsIC4uLnN1YnN0aXR1dGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy50YWdgJHtwcmV2aW91c1RhZyh0ZW1wbGF0ZSwgLi4uc3Vic3RpdHV0aW9ucyl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBidWxrIHByb2Nlc3Npbmcgb24gdGhlIHRhZ2dlZCB0ZW1wbGF0ZSwgdHJhbnNmb3JtaW5nIGVhY2ggc3Vic3RpdHV0aW9uIGFuZCB0aGVuXG4gICAqIGNvbmNhdGVuYXRpbmcgdGhlIHJlc3VsdGluZyB2YWx1ZXMgaW50byBhIHN0cmluZy5cbiAgICogQHBhcmFtICB7QXJyYXk8Kj59IHN1YnN0aXR1dGlvbnMgLSBhbiBhcnJheSBvZiBhbGwgcmVtYWluaW5nIHN1YnN0aXR1dGlvbnMgcHJlc2VudCBpbiB0aGlzIHRlbXBsYXRlXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICByZXN1bHRTb0ZhciAgIC0gdGhpcyBpdGVyYXRpb24ncyByZXN1bHQgc3RyaW5nIHNvIGZhclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgcmVtYWluaW5nUGFydCAtIHRoZSB0ZW1wbGF0ZSBjaHVuayBhZnRlciB0aGUgY3VycmVudCBzdWJzdGl0dXRpb25cbiAgICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgICAgICAgLSB0aGUgcmVzdWx0IG9mIGpvaW5pbmcgdGhpcyBpdGVyYXRpb24ncyBwcm9jZXNzZWQgc3Vic3RpdHV0aW9uIHdpdGggdGhlIHJlc3VsdFxuICAgKi9cbiAgcHJvY2Vzc1N1YnN0aXR1dGlvbnMoc3Vic3RpdHV0aW9ucywgcmVzdWx0U29GYXIsIHJlbWFpbmluZ1BhcnQpIHtcbiAgICBjb25zdCBzdWJzdGl0dXRpb24gPSB0aGlzLnRyYW5zZm9ybVN1YnN0aXR1dGlvbihcbiAgICAgIHN1YnN0aXR1dGlvbnMuc2hpZnQoKSxcbiAgICAgIHJlc3VsdFNvRmFyLFxuICAgICk7XG4gICAgcmV0dXJuICcnLmNvbmNhdChyZXN1bHRTb0Zhciwgc3Vic3RpdHV0aW9uLCByZW1haW5pbmdQYXJ0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIHRocm91Z2ggZWFjaCB0cmFuc2Zvcm1lciwgYXBwbHlpbmcgdGhlIHRyYW5zZm9ybWVyJ3MgYG9uU3RyaW5nYCBtZXRob2QgdG8gdGhlIHRlbXBsYXRlXG4gICAqIHN0cmluZ3MgYmVmb3JlIGFsbCBzdWJzdGl0dXRpb25zIGFyZSBwcm9jZXNzZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgc3RyIC0gVGhlIGlucHV0IHN0cmluZ1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAtIFRoZSBmaW5hbCByZXN1bHRzIG9mIHByb2Nlc3NpbmcgZWFjaCB0cmFuc2Zvcm1lclxuICAgKi9cbiAgdHJhbnNmb3JtU3RyaW5nKHN0cikge1xuICAgIGNvbnN0IGNiID0gKHJlcywgdHJhbnNmb3JtKSA9PlxuICAgICAgdHJhbnNmb3JtLm9uU3RyaW5nID8gdHJhbnNmb3JtLm9uU3RyaW5nKHJlcykgOiByZXM7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtZXJzLnJlZHVjZShjYiwgc3RyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIGEgc3Vic3RpdHV0aW9uIGlzIGVuY291bnRlcmVkLCBpdGVyYXRlcyB0aHJvdWdoIGVhY2ggdHJhbnNmb3JtZXIgYW5kIGFwcGxpZXMgdGhlIHRyYW5zZm9ybWVyJ3NcbiAgICogYG9uU3Vic3RpdHV0aW9uYCBtZXRob2QgdG8gdGhlIHN1YnN0aXR1dGlvbi5cbiAgICogQHBhcmFtICB7Kn0gICAgICBzdWJzdGl0dXRpb24gLSBUaGUgY3VycmVudCBzdWJzdGl0dXRpb25cbiAgICogQHBhcmFtICB7U3RyaW5nfSByZXN1bHRTb0ZhciAgLSBUaGUgcmVzdWx0IHVwIHRvIGFuZCBleGNsdWRpbmcgdGhpcyBzdWJzdGl0dXRpb24uXG4gICAqIEByZXR1cm4geyp9ICAgICAgICAgICAgICAgICAgIC0gVGhlIGZpbmFsIHJlc3VsdCBvZiBhcHBseWluZyBhbGwgc3Vic3RpdHV0aW9uIHRyYW5zZm9ybWF0aW9ucy5cbiAgICovXG4gIHRyYW5zZm9ybVN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24sIHJlc3VsdFNvRmFyKSB7XG4gICAgY29uc3QgY2IgPSAocmVzLCB0cmFuc2Zvcm0pID0+XG4gICAgICB0cmFuc2Zvcm0ub25TdWJzdGl0dXRpb25cbiAgICAgICAgPyB0cmFuc2Zvcm0ub25TdWJzdGl0dXRpb24ocmVzLCByZXN1bHRTb0ZhcilcbiAgICAgICAgOiByZXM7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtZXJzLnJlZHVjZShjYiwgc3Vic3RpdHV0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyB0aHJvdWdoIGVhY2ggdHJhbnNmb3JtZXIsIGFwcGx5aW5nIHRoZSB0cmFuc2Zvcm1lcidzIGBvbkVuZFJlc3VsdGAgbWV0aG9kIHRvIHRoZVxuICAgKiB0ZW1wbGF0ZSBsaXRlcmFsIGFmdGVyIGFsbCBzdWJzdGl0dXRpb25zIGhhdmUgZmluaXNoZWQgcHJvY2Vzc2luZy5cbiAgICogQHBhcmFtICB7U3RyaW5nfSBlbmRSZXN1bHQgLSBUaGUgcHJvY2Vzc2VkIHRlbXBsYXRlLCBqdXN0IGJlZm9yZSBpdCBpcyByZXR1cm5lZCBmcm9tIHRoZSB0YWdcbiAgICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgLSBUaGUgZmluYWwgcmVzdWx0cyBvZiBwcm9jZXNzaW5nIGVhY2ggdHJhbnNmb3JtZXJcbiAgICovXG4gIHRyYW5zZm9ybUVuZFJlc3VsdChlbmRSZXN1bHQpIHtcbiAgICBjb25zdCBjYiA9IChyZXMsIHRyYW5zZm9ybSkgPT5cbiAgICAgIHRyYW5zZm9ybS5vbkVuZFJlc3VsdCA/IHRyYW5zZm9ybS5vbkVuZFJlc3VsdChyZXMpIDogcmVzO1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWVycy5yZWR1Y2UoY2IsIGVuZFJlc3VsdCk7XG4gIH1cbn1cbiJdfQ==
},{}],"../../node_modules/common-tags/es/TemplateTag/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _TemplateTag = require('./TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _TemplateTag2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9UZW1wbGF0ZVRhZy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLGU7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL1RlbXBsYXRlVGFnJztcbiJdfQ==
},{"./TemplateTag":"../../node_modules/common-tags/es/TemplateTag/TemplateTag.js"}],"../../node_modules/common-tags/es/trimResultTransformer/trimResultTransformer.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * TemplateTag transformer that trims whitespace on the end result of a tagged template
 * @param  {String} side = '' - The side of the string to trim. Can be 'start' or 'end' (alternatively 'left' or 'right')
 * @return {Object}           - a TemplateTag transformer
 */
var trimResultTransformer = function trimResultTransformer() {
  var side = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return {
    onEndResult: function onEndResult(endResult) {
      if (side === '') {
        return endResult.trim();
      }

      side = side.toLowerCase();

      if (side === 'start' || side === 'left') {
        return endResult.replace(/^\s*/, '');
      }

      if (side === 'end' || side === 'right') {
        return endResult.replace(/\s*$/, '');
      }

      throw new Error('Side not supported: ' + side);
    }
  };
};

exports.default = trimResultTransformer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmltUmVzdWx0VHJhbnNmb3JtZXIvdHJpbVJlc3VsdFRyYW5zZm9ybWVyLmpzIl0sIm5hbWVzIjpbInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInNpZGUiLCJvbkVuZFJlc3VsdCIsImVuZFJlc3VsdCIsInRyaW0iLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJFcnJvciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FBS0EsSUFBTUEsd0JBQXdCLFNBQXhCQSxxQkFBd0I7QUFBQSxNQUFDQyxJQUFELHVFQUFRLEVBQVI7QUFBQSxTQUFnQjtBQUM1Q0MsZUFENEMsdUJBQ2hDQyxTQURnQyxFQUNyQjtBQUNyQixVQUFJRixTQUFTLEVBQWIsRUFBaUI7QUFDZixlQUFPRSxVQUFVQyxJQUFWLEVBQVA7QUFDRDs7QUFFREgsYUFBT0EsS0FBS0ksV0FBTCxFQUFQOztBQUVBLFVBQUlKLFNBQVMsT0FBVCxJQUFvQkEsU0FBUyxNQUFqQyxFQUF5QztBQUN2QyxlQUFPRSxVQUFVRyxPQUFWLENBQWtCLE1BQWxCLEVBQTBCLEVBQTFCLENBQVA7QUFDRDs7QUFFRCxVQUFJTCxTQUFTLEtBQVQsSUFBa0JBLFNBQVMsT0FBL0IsRUFBd0M7QUFDdEMsZUFBT0UsVUFBVUcsT0FBVixDQUFrQixNQUFsQixFQUEwQixFQUExQixDQUFQO0FBQ0Q7O0FBRUQsWUFBTSxJQUFJQyxLQUFKLDBCQUFpQ04sSUFBakMsQ0FBTjtBQUNEO0FBakIyQyxHQUFoQjtBQUFBLENBQTlCOztBQW9CQSxlQUFlRCxxQkFBZiIsImZpbGUiOiJ0cmltUmVzdWx0VHJhbnNmb3JtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyIHRoYXQgdHJpbXMgd2hpdGVzcGFjZSBvbiB0aGUgZW5kIHJlc3VsdCBvZiBhIHRhZ2dlZCB0ZW1wbGF0ZVxuICogQHBhcmFtICB7U3RyaW5nfSBzaWRlID0gJycgLSBUaGUgc2lkZSBvZiB0aGUgc3RyaW5nIHRvIHRyaW0uIENhbiBiZSAnc3RhcnQnIG9yICdlbmQnIChhbHRlcm5hdGl2ZWx5ICdsZWZ0JyBvciAncmlnaHQnKVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgLSBhIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyXG4gKi9cbmNvbnN0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciA9IChzaWRlID0gJycpID0+ICh7XG4gIG9uRW5kUmVzdWx0KGVuZFJlc3VsdCkge1xuICAgIGlmIChzaWRlID09PSAnJykge1xuICAgICAgcmV0dXJuIGVuZFJlc3VsdC50cmltKCk7XG4gICAgfVxuXG4gICAgc2lkZSA9IHNpZGUudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmIChzaWRlID09PSAnc3RhcnQnIHx8IHNpZGUgPT09ICdsZWZ0Jykge1xuICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKC9eXFxzKi8sICcnKTtcbiAgICB9XG5cbiAgICBpZiAoc2lkZSA9PT0gJ2VuZCcgfHwgc2lkZSA9PT0gJ3JpZ2h0Jykge1xuICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNpZGUgbm90IHN1cHBvcnRlZDogJHtzaWRlfWApO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lcjtcbiJdfQ==
},{}],"../../node_modules/common-tags/es/trimResultTransformer/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _trimResultTransformer = require('./trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _trimResultTransformer2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmltUmVzdWx0VHJhbnNmb3JtZXIvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQix5QjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbiJdfQ==
},{"./trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/trimResultTransformer.js"}],"../../node_modules/common-tags/es/stripIndentTransformer/stripIndentTransformer.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

/**
 * strips indentation from a template literal
 * @param  {String} type = 'initial' - whether to remove all indentation or just leading indentation. can be 'all' or 'initial'
 * @return {Object}                  - a TemplateTag transformer
 */
var stripIndentTransformer = function stripIndentTransformer() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'initial';
  return {
    onEndResult: function onEndResult(endResult) {
      if (type === 'initial') {
        // remove the shortest leading indentation from each line
        var match = endResult.match(/^[^\S\n]*(?=\S)/gm);
        var indent = match && Math.min.apply(Math, _toConsumableArray(match.map(function (el) {
          return el.length;
        })));
        if (indent) {
          var regexp = new RegExp('^.{' + indent + '}', 'gm');
          return endResult.replace(regexp, '');
        }
        return endResult;
      }
      if (type === 'all') {
        // remove all indentation from each line
        return endResult.replace(/^[^\S\n]+/gm, '');
      }
      throw new Error('Unknown type: ' + type);
    }
  };
};

exports.default = stripIndentTransformer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudFRyYW5zZm9ybWVyL3N0cmlwSW5kZW50VHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsic3RyaXBJbmRlbnRUcmFuc2Zvcm1lciIsInR5cGUiLCJvbkVuZFJlc3VsdCIsImVuZFJlc3VsdCIsIm1hdGNoIiwiaW5kZW50IiwiTWF0aCIsIm1pbiIsIm1hcCIsImVsIiwibGVuZ3RoIiwicmVnZXhwIiwiUmVnRXhwIiwicmVwbGFjZSIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBLElBQU1BLHlCQUF5QixTQUF6QkEsc0JBQXlCO0FBQUEsTUFBQ0MsSUFBRCx1RUFBUSxTQUFSO0FBQUEsU0FBdUI7QUFDcERDLGVBRG9ELHVCQUN4Q0MsU0FEd0MsRUFDN0I7QUFDckIsVUFBSUYsU0FBUyxTQUFiLEVBQXdCO0FBQ3RCO0FBQ0EsWUFBTUcsUUFBUUQsVUFBVUMsS0FBVixDQUFnQixtQkFBaEIsQ0FBZDtBQUNBLFlBQU1DLFNBQVNELFNBQVNFLEtBQUtDLEdBQUwsZ0NBQVlILE1BQU1JLEdBQU4sQ0FBVTtBQUFBLGlCQUFNQyxHQUFHQyxNQUFUO0FBQUEsU0FBVixDQUFaLEVBQXhCO0FBQ0EsWUFBSUwsTUFBSixFQUFZO0FBQ1YsY0FBTU0sU0FBUyxJQUFJQyxNQUFKLFNBQWlCUCxNQUFqQixRQUE0QixJQUE1QixDQUFmO0FBQ0EsaUJBQU9GLFVBQVVVLE9BQVYsQ0FBa0JGLE1BQWxCLEVBQTBCLEVBQTFCLENBQVA7QUFDRDtBQUNELGVBQU9SLFNBQVA7QUFDRDtBQUNELFVBQUlGLFNBQVMsS0FBYixFQUFvQjtBQUNsQjtBQUNBLGVBQU9FLFVBQVVVLE9BQVYsQ0FBa0IsYUFBbEIsRUFBaUMsRUFBakMsQ0FBUDtBQUNEO0FBQ0QsWUFBTSxJQUFJQyxLQUFKLG9CQUEyQmIsSUFBM0IsQ0FBTjtBQUNEO0FBakJtRCxHQUF2QjtBQUFBLENBQS9COztBQW9CQSxlQUFlRCxzQkFBZiIsImZpbGUiOiJzdHJpcEluZGVudFRyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBzdHJpcHMgaW5kZW50YXRpb24gZnJvbSBhIHRlbXBsYXRlIGxpdGVyYWxcbiAqIEBwYXJhbSAge1N0cmluZ30gdHlwZSA9ICdpbml0aWFsJyAtIHdoZXRoZXIgdG8gcmVtb3ZlIGFsbCBpbmRlbnRhdGlvbiBvciBqdXN0IGxlYWRpbmcgaW5kZW50YXRpb24uIGNhbiBiZSAnYWxsJyBvciAnaW5pdGlhbCdcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAtIGEgVGVtcGxhdGVUYWcgdHJhbnNmb3JtZXJcbiAqL1xuY29uc3Qgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciA9ICh0eXBlID0gJ2luaXRpYWwnKSA9PiAoe1xuICBvbkVuZFJlc3VsdChlbmRSZXN1bHQpIHtcbiAgICBpZiAodHlwZSA9PT0gJ2luaXRpYWwnKSB7XG4gICAgICAvLyByZW1vdmUgdGhlIHNob3J0ZXN0IGxlYWRpbmcgaW5kZW50YXRpb24gZnJvbSBlYWNoIGxpbmVcbiAgICAgIGNvbnN0IG1hdGNoID0gZW5kUmVzdWx0Lm1hdGNoKC9eW15cXFNcXG5dKig/PVxcUykvZ20pO1xuICAgICAgY29uc3QgaW5kZW50ID0gbWF0Y2ggJiYgTWF0aC5taW4oLi4ubWF0Y2gubWFwKGVsID0+IGVsLmxlbmd0aCkpO1xuICAgICAgaWYgKGluZGVudCkge1xuICAgICAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKGBeLnske2luZGVudH19YCwgJ2dtJyk7XG4gICAgICAgIHJldHVybiBlbmRSZXN1bHQucmVwbGFjZShyZWdleHAsICcnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbmRSZXN1bHQ7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnYWxsJykge1xuICAgICAgLy8gcmVtb3ZlIGFsbCBpbmRlbnRhdGlvbiBmcm9tIGVhY2ggbGluZVxuICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKC9eW15cXFNcXG5dKy9nbSwgJycpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdHlwZTogJHt0eXBlfWApO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmlwSW5kZW50VHJhbnNmb3JtZXI7XG4iXX0=
},{}],"../../node_modules/common-tags/es/stripIndentTransformer/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _stripIndentTransformer = require('./stripIndentTransformer');

var _stripIndentTransformer2 = _interopRequireDefault(_stripIndentTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _stripIndentTransformer2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudFRyYW5zZm9ybWVyL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsMEI7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuIl19
},{"./stripIndentTransformer":"../../node_modules/common-tags/es/stripIndentTransformer/stripIndentTransformer.js"}],"../../node_modules/common-tags/es/replaceResultTransformer/replaceResultTransformer.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Replaces tabs, newlines and spaces with the chosen value when they occur in sequences
 * @param  {(String|RegExp)} replaceWhat - the value or pattern that should be replaced
 * @param  {*}               replaceWith - the replacement value
 * @return {Object}                      - a TemplateTag transformer
 */
var replaceResultTransformer = function replaceResultTransformer(replaceWhat, replaceWith) {
  return {
    onEndResult: function onEndResult(endResult) {
      if (replaceWhat == null || replaceWith == null) {
        throw new Error('replaceResultTransformer requires at least 2 arguments.');
      }
      return endResult.replace(replaceWhat, replaceWith);
    }
  };
};

exports.default = replaceResultTransformer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIvcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyLmpzIl0sIm5hbWVzIjpbInJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciIsInJlcGxhY2VXaGF0IiwicmVwbGFjZVdpdGgiLCJvbkVuZFJlc3VsdCIsImVuZFJlc3VsdCIsIkVycm9yIiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQU1BLElBQU1BLDJCQUEyQixTQUEzQkEsd0JBQTJCLENBQUNDLFdBQUQsRUFBY0MsV0FBZDtBQUFBLFNBQStCO0FBQzlEQyxlQUQ4RCx1QkFDbERDLFNBRGtELEVBQ3ZDO0FBQ3JCLFVBQUlILGVBQWUsSUFBZixJQUF1QkMsZUFBZSxJQUExQyxFQUFnRDtBQUM5QyxjQUFNLElBQUlHLEtBQUosQ0FDSix5REFESSxDQUFOO0FBR0Q7QUFDRCxhQUFPRCxVQUFVRSxPQUFWLENBQWtCTCxXQUFsQixFQUErQkMsV0FBL0IsQ0FBUDtBQUNEO0FBUjZELEdBQS9CO0FBQUEsQ0FBakM7O0FBV0EsZUFBZUYsd0JBQWYiLCJmaWxlIjoicmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZXBsYWNlcyB0YWJzLCBuZXdsaW5lcyBhbmQgc3BhY2VzIHdpdGggdGhlIGNob3NlbiB2YWx1ZSB3aGVuIHRoZXkgb2NjdXIgaW4gc2VxdWVuY2VzXG4gKiBAcGFyYW0gIHsoU3RyaW5nfFJlZ0V4cCl9IHJlcGxhY2VXaGF0IC0gdGhlIHZhbHVlIG9yIHBhdHRlcm4gdGhhdCBzaG91bGQgYmUgcmVwbGFjZWRcbiAqIEBwYXJhbSAgeyp9ICAgICAgICAgICAgICAgcmVwbGFjZVdpdGggLSB0aGUgcmVwbGFjZW1lbnQgdmFsdWVcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgLSBhIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyXG4gKi9cbmNvbnN0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciA9IChyZXBsYWNlV2hhdCwgcmVwbGFjZVdpdGgpID0+ICh7XG4gIG9uRW5kUmVzdWx0KGVuZFJlc3VsdCkge1xuICAgIGlmIChyZXBsYWNlV2hhdCA9PSBudWxsIHx8IHJlcGxhY2VXaXRoID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciByZXF1aXJlcyBhdCBsZWFzdCAyIGFyZ3VtZW50cy4nLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKHJlcGxhY2VXaGF0LCByZXBsYWNlV2l0aCk7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyO1xuIl19
},{}],"../../node_modules/common-tags/es/replaceResultTransformer/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _replaceResultTransformer = require('./replaceResultTransformer');

var _replaceResultTransformer2 = _interopRequireDefault(_replaceResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _replaceResultTransformer2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQiw0QjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcbiJdfQ==
},{"./replaceResultTransformer":"../../node_modules/common-tags/es/replaceResultTransformer/replaceResultTransformer.js"}],"../../node_modules/common-tags/es/replaceSubstitutionTransformer/replaceSubstitutionTransformer.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var replaceSubstitutionTransformer = function replaceSubstitutionTransformer(replaceWhat, replaceWith) {
  return {
    onSubstitution: function onSubstitution(substitution, resultSoFar) {
      if (replaceWhat == null || replaceWith == null) {
        throw new Error('replaceSubstitutionTransformer requires at least 2 arguments.');
      }

      // Do not touch if null or undefined
      if (substitution == null) {
        return substitution;
      } else {
        return substitution.toString().replace(replaceWhat, replaceWith);
      }
    }
  };
};

exports.default = replaceSubstitutionTransformer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIvcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyLmpzIl0sIm5hbWVzIjpbInJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lciIsInJlcGxhY2VXaGF0IiwicmVwbGFjZVdpdGgiLCJvblN1YnN0aXR1dGlvbiIsInN1YnN0aXR1dGlvbiIsInJlc3VsdFNvRmFyIiwiRXJyb3IiLCJ0b1N0cmluZyIsInJlcGxhY2UiXSwibWFwcGluZ3MiOiJBQUFBLElBQU1BLGlDQUFpQyxTQUFqQ0EsOEJBQWlDLENBQUNDLFdBQUQsRUFBY0MsV0FBZDtBQUFBLFNBQStCO0FBQ3BFQyxrQkFEb0UsMEJBQ3JEQyxZQURxRCxFQUN2Q0MsV0FEdUMsRUFDMUI7QUFDeEMsVUFBSUosZUFBZSxJQUFmLElBQXVCQyxlQUFlLElBQTFDLEVBQWdEO0FBQzlDLGNBQU0sSUFBSUksS0FBSixDQUNKLCtEQURJLENBQU47QUFHRDs7QUFFRDtBQUNBLFVBQUlGLGdCQUFnQixJQUFwQixFQUEwQjtBQUN4QixlQUFPQSxZQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBT0EsYUFBYUcsUUFBYixHQUF3QkMsT0FBeEIsQ0FBZ0NQLFdBQWhDLEVBQTZDQyxXQUE3QyxDQUFQO0FBQ0Q7QUFDRjtBQWRtRSxHQUEvQjtBQUFBLENBQXZDOztBQWlCQSxlQUFlRiw4QkFBZiIsImZpbGUiOiJyZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIgPSAocmVwbGFjZVdoYXQsIHJlcGxhY2VXaXRoKSA9PiAoe1xuICBvblN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24sIHJlc3VsdFNvRmFyKSB7XG4gICAgaWYgKHJlcGxhY2VXaGF0ID09IG51bGwgfHwgcmVwbGFjZVdpdGggPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAncmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyIHJlcXVpcmVzIGF0IGxlYXN0IDIgYXJndW1lbnRzLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIERvIG5vdCB0b3VjaCBpZiBudWxsIG9yIHVuZGVmaW5lZFxuICAgIGlmIChzdWJzdGl0dXRpb24gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHN1YnN0aXR1dGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN1YnN0aXR1dGlvbi50b1N0cmluZygpLnJlcGxhY2UocmVwbGFjZVdoYXQsIHJlcGxhY2VXaXRoKTtcbiAgICB9XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyO1xuIl19
},{}],"../../node_modules/common-tags/es/replaceSubstitutionTransformer/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _replaceSubstitutionTransformer = require('./replaceSubstitutionTransformer');

var _replaceSubstitutionTransformer2 = _interopRequireDefault(_replaceSubstitutionTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _replaceSubstitutionTransformer2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixrQztxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyJztcbiJdfQ==
},{"./replaceSubstitutionTransformer":"../../node_modules/common-tags/es/replaceSubstitutionTransformer/replaceSubstitutionTransformer.js"}],"../../node_modules/common-tags/es/replaceStringTransformer/replaceStringTransformer.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var replaceStringTransformer = function replaceStringTransformer(replaceWhat, replaceWith) {
  return {
    onString: function onString(str) {
      if (replaceWhat == null || replaceWith == null) {
        throw new Error('replaceStringTransformer requires at least 2 arguments.');
      }

      return str.replace(replaceWhat, replaceWith);
    }
  };
};

exports.default = replaceStringTransformer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIvcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyLmpzIl0sIm5hbWVzIjpbInJlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lciIsInJlcGxhY2VXaGF0IiwicmVwbGFjZVdpdGgiLCJvblN0cmluZyIsInN0ciIsIkVycm9yIiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTUEsMkJBQTJCLFNBQTNCQSx3QkFBMkIsQ0FBQ0MsV0FBRCxFQUFjQyxXQUFkO0FBQUEsU0FBK0I7QUFDOURDLFlBRDhELG9CQUNyREMsR0FEcUQsRUFDaEQ7QUFDWixVQUFJSCxlQUFlLElBQWYsSUFBdUJDLGVBQWUsSUFBMUMsRUFBZ0Q7QUFDOUMsY0FBTSxJQUFJRyxLQUFKLENBQ0oseURBREksQ0FBTjtBQUdEOztBQUVELGFBQU9ELElBQUlFLE9BQUosQ0FBWUwsV0FBWixFQUF5QkMsV0FBekIsQ0FBUDtBQUNEO0FBVDZELEdBQS9CO0FBQUEsQ0FBakM7O0FBWUEsZUFBZUYsd0JBQWYiLCJmaWxlIjoicmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyID0gKHJlcGxhY2VXaGF0LCByZXBsYWNlV2l0aCkgPT4gKHtcbiAgb25TdHJpbmcoc3RyKSB7XG4gICAgaWYgKHJlcGxhY2VXaGF0ID09IG51bGwgfHwgcmVwbGFjZVdpdGggPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAncmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyIHJlcXVpcmVzIGF0IGxlYXN0IDIgYXJndW1lbnRzLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBzdHIucmVwbGFjZShyZXBsYWNlV2hhdCwgcmVwbGFjZVdpdGgpO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHJlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lcjtcbiJdfQ==
},{}],"../../node_modules/common-tags/es/replaceStringTransformer/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _replaceStringTransformer = require('./replaceStringTransformer');

var _replaceStringTransformer2 = _interopRequireDefault(_replaceStringTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _replaceStringTransformer2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQiw0QjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyJztcbiJdfQ==
},{"./replaceStringTransformer":"../../node_modules/common-tags/es/replaceStringTransformer/replaceStringTransformer.js"}],"../../node_modules/common-tags/es/inlineArrayTransformer/inlineArrayTransformer.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaults = {
  separator: '',
  conjunction: '',
  serial: false
};

/**
 * Converts an array substitution to a string containing a list
 * @param  {String} [opts.separator = ''] - the character that separates each item
 * @param  {String} [opts.conjunction = '']  - replace the last separator with this
 * @param  {Boolean} [opts.serial = false] - include the separator before the conjunction? (Oxford comma use-case)
 *
 * @return {Object}                     - a TemplateTag transformer
 */
var inlineArrayTransformer = function inlineArrayTransformer() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;
  return {
    onSubstitution: function onSubstitution(substitution, resultSoFar) {
      // only operate on arrays
      if (Array.isArray(substitution)) {
        var arrayLength = substitution.length;
        var separator = opts.separator;
        var conjunction = opts.conjunction;
        var serial = opts.serial;
        // join each item in the array into a string where each item is separated by separator
        // be sure to maintain indentation
        var indent = resultSoFar.match(/(\n?[^\S\n]+)$/);
        if (indent) {
          substitution = substitution.join(separator + indent[1]);
        } else {
          substitution = substitution.join(separator + ' ');
        }
        // if conjunction is set, replace the last separator with conjunction, but only if there is more than one substitution
        if (conjunction && arrayLength > 1) {
          var separatorIndex = substitution.lastIndexOf(separator);
          substitution = substitution.slice(0, separatorIndex) + (serial ? separator : '') + ' ' + conjunction + substitution.slice(separatorIndex + 1);
        }
      }
      return substitution;
    }
  };
};

exports.default = inlineArrayTransformer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmxpbmVBcnJheVRyYW5zZm9ybWVyL2lubGluZUFycmF5VHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdHMiLCJzZXBhcmF0b3IiLCJjb25qdW5jdGlvbiIsInNlcmlhbCIsImlubGluZUFycmF5VHJhbnNmb3JtZXIiLCJvcHRzIiwib25TdWJzdGl0dXRpb24iLCJzdWJzdGl0dXRpb24iLCJyZXN1bHRTb0ZhciIsIkFycmF5IiwiaXNBcnJheSIsImFycmF5TGVuZ3RoIiwibGVuZ3RoIiwiaW5kZW50IiwibWF0Y2giLCJqb2luIiwic2VwYXJhdG9ySW5kZXgiLCJsYXN0SW5kZXhPZiIsInNsaWNlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFNQSxXQUFXO0FBQ2ZDLGFBQVcsRUFESTtBQUVmQyxlQUFhLEVBRkU7QUFHZkMsVUFBUTtBQUhPLENBQWpCOztBQU1BOzs7Ozs7OztBQVFBLElBQU1DLHlCQUF5QixTQUF6QkEsc0JBQXlCO0FBQUEsTUFBQ0MsSUFBRCx1RUFBUUwsUUFBUjtBQUFBLFNBQXNCO0FBQ25ETSxrQkFEbUQsMEJBQ3BDQyxZQURvQyxFQUN0QkMsV0FEc0IsRUFDVDtBQUN4QztBQUNBLFVBQUlDLE1BQU1DLE9BQU4sQ0FBY0gsWUFBZCxDQUFKLEVBQWlDO0FBQy9CLFlBQU1JLGNBQWNKLGFBQWFLLE1BQWpDO0FBQ0EsWUFBTVgsWUFBWUksS0FBS0osU0FBdkI7QUFDQSxZQUFNQyxjQUFjRyxLQUFLSCxXQUF6QjtBQUNBLFlBQU1DLFNBQVNFLEtBQUtGLE1BQXBCO0FBQ0E7QUFDQTtBQUNBLFlBQU1VLFNBQVNMLFlBQVlNLEtBQVosQ0FBa0IsZ0JBQWxCLENBQWY7QUFDQSxZQUFJRCxNQUFKLEVBQVk7QUFDVk4seUJBQWVBLGFBQWFRLElBQWIsQ0FBa0JkLFlBQVlZLE9BQU8sQ0FBUCxDQUE5QixDQUFmO0FBQ0QsU0FGRCxNQUVPO0FBQ0xOLHlCQUFlQSxhQUFhUSxJQUFiLENBQWtCZCxZQUFZLEdBQTlCLENBQWY7QUFDRDtBQUNEO0FBQ0EsWUFBSUMsZUFBZVMsY0FBYyxDQUFqQyxFQUFvQztBQUNsQyxjQUFNSyxpQkFBaUJULGFBQWFVLFdBQWIsQ0FBeUJoQixTQUF6QixDQUF2QjtBQUNBTSx5QkFDRUEsYUFBYVcsS0FBYixDQUFtQixDQUFuQixFQUFzQkYsY0FBdEIsS0FDQ2IsU0FBU0YsU0FBVCxHQUFxQixFQUR0QixJQUVBLEdBRkEsR0FHQUMsV0FIQSxHQUlBSyxhQUFhVyxLQUFiLENBQW1CRixpQkFBaUIsQ0FBcEMsQ0FMRjtBQU1EO0FBQ0Y7QUFDRCxhQUFPVCxZQUFQO0FBQ0Q7QUE1QmtELEdBQXRCO0FBQUEsQ0FBL0I7O0FBK0JBLGVBQWVILHNCQUFmIiwiZmlsZSI6ImlubGluZUFycmF5VHJhbnNmb3JtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkZWZhdWx0cyA9IHtcbiAgc2VwYXJhdG9yOiAnJyxcbiAgY29uanVuY3Rpb246ICcnLFxuICBzZXJpYWw6IGZhbHNlLFxufTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBhcnJheSBzdWJzdGl0dXRpb24gdG8gYSBzdHJpbmcgY29udGFpbmluZyBhIGxpc3RcbiAqIEBwYXJhbSAge1N0cmluZ30gW29wdHMuc2VwYXJhdG9yID0gJyddIC0gdGhlIGNoYXJhY3RlciB0aGF0IHNlcGFyYXRlcyBlYWNoIGl0ZW1cbiAqIEBwYXJhbSAge1N0cmluZ30gW29wdHMuY29uanVuY3Rpb24gPSAnJ10gIC0gcmVwbGFjZSB0aGUgbGFzdCBzZXBhcmF0b3Igd2l0aCB0aGlzXG4gKiBAcGFyYW0gIHtCb29sZWFufSBbb3B0cy5zZXJpYWwgPSBmYWxzZV0gLSBpbmNsdWRlIHRoZSBzZXBhcmF0b3IgYmVmb3JlIHRoZSBjb25qdW5jdGlvbj8gKE94Zm9yZCBjb21tYSB1c2UtY2FzZSlcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgLSBhIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyXG4gKi9cbmNvbnN0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgPSAob3B0cyA9IGRlZmF1bHRzKSA9PiAoe1xuICBvblN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24sIHJlc3VsdFNvRmFyKSB7XG4gICAgLy8gb25seSBvcGVyYXRlIG9uIGFycmF5c1xuICAgIGlmIChBcnJheS5pc0FycmF5KHN1YnN0aXR1dGlvbikpIHtcbiAgICAgIGNvbnN0IGFycmF5TGVuZ3RoID0gc3Vic3RpdHV0aW9uLmxlbmd0aDtcbiAgICAgIGNvbnN0IHNlcGFyYXRvciA9IG9wdHMuc2VwYXJhdG9yO1xuICAgICAgY29uc3QgY29uanVuY3Rpb24gPSBvcHRzLmNvbmp1bmN0aW9uO1xuICAgICAgY29uc3Qgc2VyaWFsID0gb3B0cy5zZXJpYWw7XG4gICAgICAvLyBqb2luIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXkgaW50byBhIHN0cmluZyB3aGVyZSBlYWNoIGl0ZW0gaXMgc2VwYXJhdGVkIGJ5IHNlcGFyYXRvclxuICAgICAgLy8gYmUgc3VyZSB0byBtYWludGFpbiBpbmRlbnRhdGlvblxuICAgICAgY29uc3QgaW5kZW50ID0gcmVzdWx0U29GYXIubWF0Y2goLyhcXG4/W15cXFNcXG5dKykkLyk7XG4gICAgICBpZiAoaW5kZW50KSB7XG4gICAgICAgIHN1YnN0aXR1dGlvbiA9IHN1YnN0aXR1dGlvbi5qb2luKHNlcGFyYXRvciArIGluZGVudFsxXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJzdGl0dXRpb24gPSBzdWJzdGl0dXRpb24uam9pbihzZXBhcmF0b3IgKyAnICcpO1xuICAgICAgfVxuICAgICAgLy8gaWYgY29uanVuY3Rpb24gaXMgc2V0LCByZXBsYWNlIHRoZSBsYXN0IHNlcGFyYXRvciB3aXRoIGNvbmp1bmN0aW9uLCBidXQgb25seSBpZiB0aGVyZSBpcyBtb3JlIHRoYW4gb25lIHN1YnN0aXR1dGlvblxuICAgICAgaWYgKGNvbmp1bmN0aW9uICYmIGFycmF5TGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBzZXBhcmF0b3JJbmRleCA9IHN1YnN0aXR1dGlvbi5sYXN0SW5kZXhPZihzZXBhcmF0b3IpO1xuICAgICAgICBzdWJzdGl0dXRpb24gPVxuICAgICAgICAgIHN1YnN0aXR1dGlvbi5zbGljZSgwLCBzZXBhcmF0b3JJbmRleCkgK1xuICAgICAgICAgIChzZXJpYWwgPyBzZXBhcmF0b3IgOiAnJykgK1xuICAgICAgICAgICcgJyArXG4gICAgICAgICAgY29uanVuY3Rpb24gK1xuICAgICAgICAgIHN1YnN0aXR1dGlvbi5zbGljZShzZXBhcmF0b3JJbmRleCArIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3Vic3RpdHV0aW9uO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGlubGluZUFycmF5VHJhbnNmb3JtZXI7XG4iXX0=
},{}],"../../node_modules/common-tags/es/inlineArrayTransformer/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _inlineArrayTransformer = require('./inlineArrayTransformer');

var _inlineArrayTransformer2 = _interopRequireDefault(_inlineArrayTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _inlineArrayTransformer2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmxpbmVBcnJheVRyYW5zZm9ybWVyL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsMEI7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuIl19
},{"./inlineArrayTransformer":"../../node_modules/common-tags/es/inlineArrayTransformer/inlineArrayTransformer.js"}],"../../node_modules/common-tags/es/splitStringTransformer/splitStringTransformer.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var splitStringTransformer = function splitStringTransformer(splitBy) {
  return {
    onSubstitution: function onSubstitution(substitution, resultSoFar) {
      if (splitBy != null && typeof splitBy === 'string') {
        if (typeof substitution === 'string' && substitution.includes(splitBy)) {
          substitution = substitution.split(splitBy);
        }
      } else {
        throw new Error('You need to specify a string character to split by.');
      }
      return substitution;
    }
  };
};

exports.default = splitStringTransformer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyL3NwbGl0U3RyaW5nVHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsic3BsaXRTdHJpbmdUcmFuc2Zvcm1lciIsIm9uU3Vic3RpdHV0aW9uIiwic3Vic3RpdHV0aW9uIiwicmVzdWx0U29GYXIiLCJzcGxpdEJ5IiwiaW5jbHVkZXMiLCJzcGxpdCIsIkVycm9yIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFNQSx5QkFBeUIsU0FBekJBLHNCQUF5QjtBQUFBLFNBQVk7QUFDekNDLGtCQUR5QywwQkFDMUJDLFlBRDBCLEVBQ1pDLFdBRFksRUFDQztBQUN4QyxVQUFJQyxXQUFXLElBQVgsSUFBbUIsT0FBT0EsT0FBUCxLQUFtQixRQUExQyxFQUFvRDtBQUNsRCxZQUFJLE9BQU9GLFlBQVAsS0FBd0IsUUFBeEIsSUFBb0NBLGFBQWFHLFFBQWIsQ0FBc0JELE9BQXRCLENBQXhDLEVBQXdFO0FBQ3RFRix5QkFBZUEsYUFBYUksS0FBYixDQUFtQkYsT0FBbkIsQ0FBZjtBQUNEO0FBQ0YsT0FKRCxNQUlPO0FBQ0wsY0FBTSxJQUFJRyxLQUFKLENBQVUscURBQVYsQ0FBTjtBQUNEO0FBQ0QsYUFBT0wsWUFBUDtBQUNEO0FBVndDLEdBQVo7QUFBQSxDQUEvQjs7QUFhQSxlQUFlRixzQkFBZiIsImZpbGUiOiJzcGxpdFN0cmluZ1RyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc3BsaXRTdHJpbmdUcmFuc2Zvcm1lciA9IHNwbGl0QnkgPT4gKHtcbiAgb25TdWJzdGl0dXRpb24oc3Vic3RpdHV0aW9uLCByZXN1bHRTb0Zhcikge1xuICAgIGlmIChzcGxpdEJ5ICE9IG51bGwgJiYgdHlwZW9mIHNwbGl0QnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodHlwZW9mIHN1YnN0aXR1dGlvbiA9PT0gJ3N0cmluZycgJiYgc3Vic3RpdHV0aW9uLmluY2x1ZGVzKHNwbGl0QnkpKSB7XG4gICAgICAgIHN1YnN0aXR1dGlvbiA9IHN1YnN0aXR1dGlvbi5zcGxpdChzcGxpdEJ5KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbmVlZCB0byBzcGVjaWZ5IGEgc3RyaW5nIGNoYXJhY3RlciB0byBzcGxpdCBieS4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1YnN0aXR1dGlvbjtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBzcGxpdFN0cmluZ1RyYW5zZm9ybWVyO1xuIl19
},{}],"../../node_modules/common-tags/es/splitStringTransformer/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _splitStringTransformer = require('./splitStringTransformer');

var _splitStringTransformer2 = _interopRequireDefault(_splitStringTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _splitStringTransformer2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsMEI7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL3NwbGl0U3RyaW5nVHJhbnNmb3JtZXInO1xuIl19
},{"./splitStringTransformer":"../../node_modules/common-tags/es/splitStringTransformer/splitStringTransformer.js"}],"../../node_modules/common-tags/es/removeNonPrintingValuesTransformer/removeNonPrintingValuesTransformer.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isValidValue = function isValidValue(x) {
  return x != null && !Number.isNaN(x) && typeof x !== 'boolean';
};

var removeNonPrintingValuesTransformer = function removeNonPrintingValuesTransformer() {
  return {
    onSubstitution: function onSubstitution(substitution) {
      if (Array.isArray(substitution)) {
        return substitution.filter(isValidValue);
      }
      if (isValidValue(substitution)) {
        return substitution;
      }
      return '';
    }
  };
};

exports.default = removeNonPrintingValuesTransformer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyL3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsiaXNWYWxpZFZhbHVlIiwieCIsIk51bWJlciIsImlzTmFOIiwicmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lciIsIm9uU3Vic3RpdHV0aW9uIiwic3Vic3RpdHV0aW9uIiwiQXJyYXkiLCJpc0FycmF5IiwiZmlsdGVyIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFNQSxlQUFlLFNBQWZBLFlBQWU7QUFBQSxTQUNuQkMsS0FBSyxJQUFMLElBQWEsQ0FBQ0MsT0FBT0MsS0FBUCxDQUFhRixDQUFiLENBQWQsSUFBaUMsT0FBT0EsQ0FBUCxLQUFhLFNBRDNCO0FBQUEsQ0FBckI7O0FBR0EsSUFBTUcscUNBQXFDLFNBQXJDQSxrQ0FBcUM7QUFBQSxTQUFPO0FBQ2hEQyxrQkFEZ0QsMEJBQ2pDQyxZQURpQyxFQUNuQjtBQUMzQixVQUFJQyxNQUFNQyxPQUFOLENBQWNGLFlBQWQsQ0FBSixFQUFpQztBQUMvQixlQUFPQSxhQUFhRyxNQUFiLENBQW9CVCxZQUFwQixDQUFQO0FBQ0Q7QUFDRCxVQUFJQSxhQUFhTSxZQUFiLENBQUosRUFBZ0M7QUFDOUIsZUFBT0EsWUFBUDtBQUNEO0FBQ0QsYUFBTyxFQUFQO0FBQ0Q7QUFUK0MsR0FBUDtBQUFBLENBQTNDOztBQVlBLGVBQWVGLGtDQUFmIiwiZmlsZSI6InJlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBpc1ZhbGlkVmFsdWUgPSB4ID0+XG4gIHggIT0gbnVsbCAmJiAhTnVtYmVyLmlzTmFOKHgpICYmIHR5cGVvZiB4ICE9PSAnYm9vbGVhbic7XG5cbmNvbnN0IHJlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIgPSAoKSA9PiAoe1xuICBvblN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzdWJzdGl0dXRpb24pKSB7XG4gICAgICByZXR1cm4gc3Vic3RpdHV0aW9uLmZpbHRlcihpc1ZhbGlkVmFsdWUpO1xuICAgIH1cbiAgICBpZiAoaXNWYWxpZFZhbHVlKHN1YnN0aXR1dGlvbikpIHtcbiAgICAgIHJldHVybiBzdWJzdGl0dXRpb247XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCByZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyO1xuIl19
},{}],"../../node_modules/common-tags/es/removeNonPrintingValuesTransformer/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _removeNonPrintingValuesTransformer = require('./removeNonPrintingValuesTransformer');

var _removeNonPrintingValuesTransformer2 = _interopRequireDefault(_removeNonPrintingValuesTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _removeNonPrintingValuesTransformer2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0Isc0M7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXInO1xuIl19
},{"./removeNonPrintingValuesTransformer":"../../node_modules/common-tags/es/removeNonPrintingValuesTransformer/removeNonPrintingValuesTransformer.js"}],"../../node_modules/common-tags/es/commaLists/commaLists.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _stripIndentTransformer = require('../stripIndentTransformer');

var _stripIndentTransformer2 = _interopRequireDefault(_stripIndentTransformer);

var _inlineArrayTransformer = require('../inlineArrayTransformer');

var _inlineArrayTransformer2 = _interopRequireDefault(_inlineArrayTransformer);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commaLists = new _TemplateTag2.default((0, _inlineArrayTransformer2.default)({ separator: ',' }), _stripIndentTransformer2.default, _trimResultTransformer2.default);

exports.default = commaLists;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzL2NvbW1hTGlzdHMuanMiXSwibmFtZXMiOlsiVGVtcGxhdGVUYWciLCJzdHJpcEluZGVudFRyYW5zZm9ybWVyIiwiaW5saW5lQXJyYXlUcmFuc2Zvcm1lciIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsImNvbW1hTGlzdHMiLCJzZXBhcmF0b3IiXSwibWFwcGluZ3MiOiJBQUFBLE9BQU9BLFdBQVAsTUFBd0IsZ0JBQXhCO0FBQ0EsT0FBT0Msc0JBQVAsTUFBbUMsMkJBQW5DO0FBQ0EsT0FBT0Msc0JBQVAsTUFBbUMsMkJBQW5DO0FBQ0EsT0FBT0MscUJBQVAsTUFBa0MsMEJBQWxDOztBQUVBLElBQU1DLGFBQWEsSUFBSUosV0FBSixDQUNqQkUsdUJBQXVCLEVBQUVHLFdBQVcsR0FBYixFQUF2QixDQURpQixFQUVqQkosc0JBRmlCLEVBR2pCRSxxQkFIaUIsQ0FBbkI7O0FBTUEsZUFBZUMsVUFBZiIsImZpbGUiOiJjb21tYUxpc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5cbmNvbnN0IGNvbW1hTGlzdHMgPSBuZXcgVGVtcGxhdGVUYWcoXG4gIGlubGluZUFycmF5VHJhbnNmb3JtZXIoeyBzZXBhcmF0b3I6ICcsJyB9KSxcbiAgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcixcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbWFMaXN0cztcbiJdfQ==
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../stripIndentTransformer":"../../node_modules/common-tags/es/stripIndentTransformer/index.js","../inlineArrayTransformer":"../../node_modules/common-tags/es/inlineArrayTransformer/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js"}],"../../node_modules/common-tags/es/commaLists/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _commaLists = require('./commaLists');

var _commaLists2 = _interopRequireDefault(_commaLists);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _commaLists2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsYztxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vY29tbWFMaXN0cyc7XG4iXX0=
},{"./commaLists":"../../node_modules/common-tags/es/commaLists/commaLists.js"}],"../../node_modules/common-tags/es/commaListsAnd/commaListsAnd.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _stripIndentTransformer = require('../stripIndentTransformer');

var _stripIndentTransformer2 = _interopRequireDefault(_stripIndentTransformer);

var _inlineArrayTransformer = require('../inlineArrayTransformer');

var _inlineArrayTransformer2 = _interopRequireDefault(_inlineArrayTransformer);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commaListsAnd = new _TemplateTag2.default((0, _inlineArrayTransformer2.default)({ separator: ',', conjunction: 'and' }), _stripIndentTransformer2.default, _trimResultTransformer2.default);

exports.default = commaListsAnd;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzQW5kL2NvbW1hTGlzdHNBbmQuanMiXSwibmFtZXMiOlsiVGVtcGxhdGVUYWciLCJzdHJpcEluZGVudFRyYW5zZm9ybWVyIiwiaW5saW5lQXJyYXlUcmFuc2Zvcm1lciIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsImNvbW1hTGlzdHNBbmQiLCJzZXBhcmF0b3IiLCJjb25qdW5jdGlvbiJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7O0FBRUEsSUFBTUMsZ0JBQWdCLElBQUlKLFdBQUosQ0FDcEJFLHVCQUF1QixFQUFFRyxXQUFXLEdBQWIsRUFBa0JDLGFBQWEsS0FBL0IsRUFBdkIsQ0FEb0IsRUFFcEJMLHNCQUZvQixFQUdwQkUscUJBSG9CLENBQXRCOztBQU1BLGVBQWVDLGFBQWYiLCJmaWxlIjoiY29tbWFMaXN0c0FuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuXG5jb25zdCBjb21tYUxpc3RzQW5kID0gbmV3IFRlbXBsYXRlVGFnKFxuICBpbmxpbmVBcnJheVRyYW5zZm9ybWVyKHsgc2VwYXJhdG9yOiAnLCcsIGNvbmp1bmN0aW9uOiAnYW5kJyB9KSxcbiAgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcixcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbWFMaXN0c0FuZDtcbiJdfQ==
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../stripIndentTransformer":"../../node_modules/common-tags/es/stripIndentTransformer/index.js","../inlineArrayTransformer":"../../node_modules/common-tags/es/inlineArrayTransformer/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js"}],"../../node_modules/common-tags/es/commaListsAnd/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _commaListsAnd = require('./commaListsAnd');

var _commaListsAnd2 = _interopRequireDefault(_commaListsAnd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _commaListsAnd2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzQW5kL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsaUI7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL2NvbW1hTGlzdHNBbmQnO1xuIl19
},{"./commaListsAnd":"../../node_modules/common-tags/es/commaListsAnd/commaListsAnd.js"}],"../../node_modules/common-tags/es/commaListsOr/commaListsOr.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _stripIndentTransformer = require('../stripIndentTransformer');

var _stripIndentTransformer2 = _interopRequireDefault(_stripIndentTransformer);

var _inlineArrayTransformer = require('../inlineArrayTransformer');

var _inlineArrayTransformer2 = _interopRequireDefault(_inlineArrayTransformer);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commaListsOr = new _TemplateTag2.default((0, _inlineArrayTransformer2.default)({ separator: ',', conjunction: 'or' }), _stripIndentTransformer2.default, _trimResultTransformer2.default);

exports.default = commaListsOr;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzT3IvY29tbWFMaXN0c09yLmpzIl0sIm5hbWVzIjpbIlRlbXBsYXRlVGFnIiwic3RyaXBJbmRlbnRUcmFuc2Zvcm1lciIsImlubGluZUFycmF5VHJhbnNmb3JtZXIiLCJ0cmltUmVzdWx0VHJhbnNmb3JtZXIiLCJjb21tYUxpc3RzT3IiLCJzZXBhcmF0b3IiLCJjb25qdW5jdGlvbiJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7O0FBRUEsSUFBTUMsZUFBZSxJQUFJSixXQUFKLENBQ25CRSx1QkFBdUIsRUFBRUcsV0FBVyxHQUFiLEVBQWtCQyxhQUFhLElBQS9CLEVBQXZCLENBRG1CLEVBRW5CTCxzQkFGbUIsRUFHbkJFLHFCQUhtQixDQUFyQjs7QUFNQSxlQUFlQyxZQUFmIiwiZmlsZSI6ImNvbW1hTGlzdHNPci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuXG5jb25zdCBjb21tYUxpc3RzT3IgPSBuZXcgVGVtcGxhdGVUYWcoXG4gIGlubGluZUFycmF5VHJhbnNmb3JtZXIoeyBzZXBhcmF0b3I6ICcsJywgY29uanVuY3Rpb246ICdvcicgfSksXG4gIHN0cmlwSW5kZW50VHJhbnNmb3JtZXIsXG4gIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcixcbik7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbW1hTGlzdHNPcjtcbiJdfQ==
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../stripIndentTransformer":"../../node_modules/common-tags/es/stripIndentTransformer/index.js","../inlineArrayTransformer":"../../node_modules/common-tags/es/inlineArrayTransformer/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js"}],"../../node_modules/common-tags/es/commaListsOr/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _commaListsOr = require('./commaListsOr');

var _commaListsOr2 = _interopRequireDefault(_commaListsOr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _commaListsOr2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzT3IvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixnQjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vY29tbWFMaXN0c09yJztcbiJdfQ==
},{"./commaListsOr":"../../node_modules/common-tags/es/commaListsOr/commaListsOr.js"}],"../../node_modules/common-tags/es/html/html.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _stripIndentTransformer = require('../stripIndentTransformer');

var _stripIndentTransformer2 = _interopRequireDefault(_stripIndentTransformer);

var _inlineArrayTransformer = require('../inlineArrayTransformer');

var _inlineArrayTransformer2 = _interopRequireDefault(_inlineArrayTransformer);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

var _splitStringTransformer = require('../splitStringTransformer');

var _splitStringTransformer2 = _interopRequireDefault(_splitStringTransformer);

var _removeNonPrintingValuesTransformer = require('../removeNonPrintingValuesTransformer');

var _removeNonPrintingValuesTransformer2 = _interopRequireDefault(_removeNonPrintingValuesTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var html = new _TemplateTag2.default((0, _splitStringTransformer2.default)('\n'), _removeNonPrintingValuesTransformer2.default, _inlineArrayTransformer2.default, _stripIndentTransformer2.default, _trimResultTransformer2.default);

exports.default = html;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odG1sL2h0bWwuanMiXSwibmFtZXMiOlsiVGVtcGxhdGVUYWciLCJzdHJpcEluZGVudFRyYW5zZm9ybWVyIiwiaW5saW5lQXJyYXlUcmFuc2Zvcm1lciIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInNwbGl0U3RyaW5nVHJhbnNmb3JtZXIiLCJyZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyIiwiaHRtbCJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxrQ0FBUCxNQUErQyx1Q0FBL0M7O0FBRUEsSUFBTUMsT0FBTyxJQUFJTixXQUFKLENBQ1hJLHVCQUF1QixJQUF2QixDQURXLEVBRVhDLGtDQUZXLEVBR1hILHNCQUhXLEVBSVhELHNCQUpXLEVBS1hFLHFCQUxXLENBQWI7O0FBUUEsZUFBZUcsSUFBZiIsImZpbGUiOiJodG1sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgc3BsaXRTdHJpbmdUcmFuc2Zvcm1lciBmcm9tICcuLi9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyJztcbmltcG9ydCByZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyIGZyb20gJy4uL3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXInO1xuXG5jb25zdCBodG1sID0gbmV3IFRlbXBsYXRlVGFnKFxuICBzcGxpdFN0cmluZ1RyYW5zZm9ybWVyKCdcXG4nKSxcbiAgcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lcixcbiAgaW5saW5lQXJyYXlUcmFuc2Zvcm1lcixcbiAgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcixcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgaHRtbDtcbiJdfQ==
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../stripIndentTransformer":"../../node_modules/common-tags/es/stripIndentTransformer/index.js","../inlineArrayTransformer":"../../node_modules/common-tags/es/inlineArrayTransformer/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js","../splitStringTransformer":"../../node_modules/common-tags/es/splitStringTransformer/index.js","../removeNonPrintingValuesTransformer":"../../node_modules/common-tags/es/removeNonPrintingValuesTransformer/index.js"}],"../../node_modules/common-tags/es/html/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _html = require('./html');

var _html2 = _interopRequireDefault(_html);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _html2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odG1sL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsUTtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vaHRtbCc7XG4iXX0=
},{"./html":"../../node_modules/common-tags/es/html/html.js"}],"../../node_modules/common-tags/es/codeBlock/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _html = require('../html');

var _html2 = _interopRequireDefault(_html);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _html2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb2RlQmxvY2svaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixTO3FCQUFiQSxPIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnJvbSAnLi4vaHRtbCc7XG4iXX0=
},{"../html":"../../node_modules/common-tags/es/html/index.js"}],"../../node_modules/common-tags/es/source/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _html = require('../html');

var _html2 = _interopRequireDefault(_html);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _html2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zb3VyY2UvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixTO3FCQUFiQSxPIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnJvbSAnLi4vaHRtbCc7XG4iXX0=
},{"../html":"../../node_modules/common-tags/es/html/index.js"}],"../../node_modules/common-tags/es/safeHtml/safeHtml.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _stripIndentTransformer = require('../stripIndentTransformer');

var _stripIndentTransformer2 = _interopRequireDefault(_stripIndentTransformer);

var _inlineArrayTransformer = require('../inlineArrayTransformer');

var _inlineArrayTransformer2 = _interopRequireDefault(_inlineArrayTransformer);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

var _splitStringTransformer = require('../splitStringTransformer');

var _splitStringTransformer2 = _interopRequireDefault(_splitStringTransformer);

var _replaceSubstitutionTransformer = require('../replaceSubstitutionTransformer');

var _replaceSubstitutionTransformer2 = _interopRequireDefault(_replaceSubstitutionTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var safeHtml = new _TemplateTag2.default((0, _splitStringTransformer2.default)('\n'), _inlineArrayTransformer2.default, _stripIndentTransformer2.default, _trimResultTransformer2.default, (0, _replaceSubstitutionTransformer2.default)(/&/g, '&amp;'), (0, _replaceSubstitutionTransformer2.default)(/</g, '&lt;'), (0, _replaceSubstitutionTransformer2.default)(/>/g, '&gt;'), (0, _replaceSubstitutionTransformer2.default)(/"/g, '&quot;'), (0, _replaceSubstitutionTransformer2.default)(/'/g, '&#x27;'), (0, _replaceSubstitutionTransformer2.default)(/`/g, '&#x60;'));

exports.default = safeHtml;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zYWZlSHRtbC9zYWZlSHRtbC5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInN0cmlwSW5kZW50VHJhbnNmb3JtZXIiLCJpbmxpbmVBcnJheVRyYW5zZm9ybWVyIiwidHJpbVJlc3VsdFRyYW5zZm9ybWVyIiwic3BsaXRTdHJpbmdUcmFuc2Zvcm1lciIsInJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lciIsInNhZmVIdG1sIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxXQUFQLE1BQXdCLGdCQUF4QjtBQUNBLE9BQU9DLHNCQUFQLE1BQW1DLDJCQUFuQztBQUNBLE9BQU9DLHNCQUFQLE1BQW1DLDJCQUFuQztBQUNBLE9BQU9DLHFCQUFQLE1BQWtDLDBCQUFsQztBQUNBLE9BQU9DLHNCQUFQLE1BQW1DLDJCQUFuQztBQUNBLE9BQU9DLDhCQUFQLE1BQTJDLG1DQUEzQzs7QUFFQSxJQUFNQyxXQUFXLElBQUlOLFdBQUosQ0FDZkksdUJBQXVCLElBQXZCLENBRGUsRUFFZkYsc0JBRmUsRUFHZkQsc0JBSGUsRUFJZkUscUJBSmUsRUFLZkUsK0JBQStCLElBQS9CLEVBQXFDLE9BQXJDLENBTGUsRUFNZkEsK0JBQStCLElBQS9CLEVBQXFDLE1BQXJDLENBTmUsRUFPZkEsK0JBQStCLElBQS9CLEVBQXFDLE1BQXJDLENBUGUsRUFRZkEsK0JBQStCLElBQS9CLEVBQXFDLFFBQXJDLENBUmUsRUFTZkEsK0JBQStCLElBQS9CLEVBQXFDLFFBQXJDLENBVGUsRUFVZkEsK0JBQStCLElBQS9CLEVBQXFDLFFBQXJDLENBVmUsQ0FBakI7O0FBYUEsZUFBZUMsUUFBZiIsImZpbGUiOiJzYWZlSHRtbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHNwbGl0U3RyaW5nVHJhbnNmb3JtZXIgZnJvbSAnLi4vc3BsaXRTdHJpbmdUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcic7XG5cbmNvbnN0IHNhZmVIdG1sID0gbmV3IFRlbXBsYXRlVGFnKFxuICBzcGxpdFN0cmluZ1RyYW5zZm9ybWVyKCdcXG4nKSxcbiAgaW5saW5lQXJyYXlUcmFuc2Zvcm1lcixcbiAgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcixcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuICByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIoLyYvZywgJyZhbXA7JyksXG4gIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcigvPC9nLCAnJmx0OycpLFxuICByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIoLz4vZywgJyZndDsnKSxcbiAgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyKC9cIi9nLCAnJnF1b3Q7JyksXG4gIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcigvJy9nLCAnJiN4Mjc7JyksXG4gIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcigvYC9nLCAnJiN4NjA7JyksXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBzYWZlSHRtbDtcbiJdfQ==
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../stripIndentTransformer":"../../node_modules/common-tags/es/stripIndentTransformer/index.js","../inlineArrayTransformer":"../../node_modules/common-tags/es/inlineArrayTransformer/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js","../splitStringTransformer":"../../node_modules/common-tags/es/splitStringTransformer/index.js","../replaceSubstitutionTransformer":"../../node_modules/common-tags/es/replaceSubstitutionTransformer/index.js"}],"../../node_modules/common-tags/es/safeHtml/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _safeHtml = require('./safeHtml');

var _safeHtml2 = _interopRequireDefault(_safeHtml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _safeHtml2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zYWZlSHRtbC9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLFk7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL3NhZmVIdG1sJztcbiJdfQ==
},{"./safeHtml":"../../node_modules/common-tags/es/safeHtml/safeHtml.js"}],"../../node_modules/common-tags/es/oneLine/oneLine.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

var _replaceResultTransformer = require('../replaceResultTransformer');

var _replaceResultTransformer2 = _interopRequireDefault(_replaceResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oneLine = new _TemplateTag2.default((0, _replaceResultTransformer2.default)(/(?:\n(?:\s*))+/g, ' '), _trimResultTransformer2.default);

exports.default = oneLine;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lL29uZUxpbmUuanMiXSwibmFtZXMiOlsiVGVtcGxhdGVUYWciLCJ0cmltUmVzdWx0VHJhbnNmb3JtZXIiLCJyZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIiLCJvbmVMaW5lIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxXQUFQLE1BQXdCLGdCQUF4QjtBQUNBLE9BQU9DLHFCQUFQLE1BQWtDLDBCQUFsQztBQUNBLE9BQU9DLHdCQUFQLE1BQXFDLDZCQUFyQzs7QUFFQSxJQUFNQyxVQUFVLElBQUlILFdBQUosQ0FDZEUseUJBQXlCLGlCQUF6QixFQUE0QyxHQUE1QyxDQURjLEVBRWRELHFCQUZjLENBQWhCOztBQUtBLGVBQWVFLE9BQWYiLCJmaWxlIjoib25lTGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcic7XG5cbmNvbnN0IG9uZUxpbmUgPSBuZXcgVGVtcGxhdGVUYWcoXG4gIHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcigvKD86XFxuKD86XFxzKikpKy9nLCAnICcpLFxuICB0cmltUmVzdWx0VHJhbnNmb3JtZXIsXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBvbmVMaW5lO1xuIl19
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js","../replaceResultTransformer":"../../node_modules/common-tags/es/replaceResultTransformer/index.js"}],"../../node_modules/common-tags/es/oneLine/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _oneLine = require('./oneLine');

var _oneLine2 = _interopRequireDefault(_oneLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _oneLine2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsVztxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vb25lTGluZSc7XG4iXX0=
},{"./oneLine":"../../node_modules/common-tags/es/oneLine/oneLine.js"}],"../../node_modules/common-tags/es/oneLineTrim/oneLineTrim.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

var _replaceResultTransformer = require('../replaceResultTransformer');

var _replaceResultTransformer2 = _interopRequireDefault(_replaceResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oneLineTrim = new _TemplateTag2.default((0, _replaceResultTransformer2.default)(/(?:\n\s*)/g, ''), _trimResultTransformer2.default);

exports.default = oneLineTrim;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lVHJpbS9vbmVMaW5lVHJpbS5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciIsIm9uZUxpbmVUcmltIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxXQUFQLE1BQXdCLGdCQUF4QjtBQUNBLE9BQU9DLHFCQUFQLE1BQWtDLDBCQUFsQztBQUNBLE9BQU9DLHdCQUFQLE1BQXFDLDZCQUFyQzs7QUFFQSxJQUFNQyxjQUFjLElBQUlILFdBQUosQ0FDbEJFLHlCQUF5QixZQUF6QixFQUF1QyxFQUF2QyxDQURrQixFQUVsQkQscUJBRmtCLENBQXBCOztBQUtBLGVBQWVFLFdBQWYiLCJmaWxlIjoib25lTGluZVRyaW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuXG5jb25zdCBvbmVMaW5lVHJpbSA9IG5ldyBUZW1wbGF0ZVRhZyhcbiAgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKC8oPzpcXG5cXHMqKS9nLCAnJyksXG4gIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcixcbik7XG5cbmV4cG9ydCBkZWZhdWx0IG9uZUxpbmVUcmltO1xuIl19
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js","../replaceResultTransformer":"../../node_modules/common-tags/es/replaceResultTransformer/index.js"}],"../../node_modules/common-tags/es/oneLineTrim/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _oneLineTrim = require('./oneLineTrim');

var _oneLineTrim2 = _interopRequireDefault(_oneLineTrim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _oneLineTrim2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lVHJpbS9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLGU7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL29uZUxpbmVUcmltJztcbiJdfQ==
},{"./oneLineTrim":"../../node_modules/common-tags/es/oneLineTrim/oneLineTrim.js"}],"../../node_modules/common-tags/es/oneLineCommaLists/oneLineCommaLists.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _inlineArrayTransformer = require('../inlineArrayTransformer');

var _inlineArrayTransformer2 = _interopRequireDefault(_inlineArrayTransformer);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

var _replaceResultTransformer = require('../replaceResultTransformer');

var _replaceResultTransformer2 = _interopRequireDefault(_replaceResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oneLineCommaLists = new _TemplateTag2.default((0, _inlineArrayTransformer2.default)({ separator: ',' }), (0, _replaceResultTransformer2.default)(/(?:\s+)/g, ' '), _trimResultTransformer2.default);

exports.default = oneLineCommaLists;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lQ29tbWFMaXN0cy9vbmVMaW5lQ29tbWFMaXN0cy5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsImlubGluZUFycmF5VHJhbnNmb3JtZXIiLCJ0cmltUmVzdWx0VHJhbnNmb3JtZXIiLCJyZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIiLCJvbmVMaW5lQ29tbWFMaXN0cyIsInNlcGFyYXRvciJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7QUFDQSxPQUFPQyx3QkFBUCxNQUFxQyw2QkFBckM7O0FBRUEsSUFBTUMsb0JBQW9CLElBQUlKLFdBQUosQ0FDeEJDLHVCQUF1QixFQUFFSSxXQUFXLEdBQWIsRUFBdkIsQ0FEd0IsRUFFeEJGLHlCQUF5QixVQUF6QixFQUFxQyxHQUFyQyxDQUZ3QixFQUd4QkQscUJBSHdCLENBQTFCOztBQU1BLGVBQWVFLGlCQUFmIiwiZmlsZSI6Im9uZUxpbmVDb21tYUxpc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuXG5jb25zdCBvbmVMaW5lQ29tbWFMaXN0cyA9IG5ldyBUZW1wbGF0ZVRhZyhcbiAgaW5saW5lQXJyYXlUcmFuc2Zvcm1lcih7IHNlcGFyYXRvcjogJywnIH0pLFxuICByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIoLyg/OlxccyspL2csICcgJyksXG4gIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcixcbik7XG5cbmV4cG9ydCBkZWZhdWx0IG9uZUxpbmVDb21tYUxpc3RzO1xuIl19
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../inlineArrayTransformer":"../../node_modules/common-tags/es/inlineArrayTransformer/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js","../replaceResultTransformer":"../../node_modules/common-tags/es/replaceResultTransformer/index.js"}],"../../node_modules/common-tags/es/oneLineCommaLists/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _oneLineCommaLists = require('./oneLineCommaLists');

var _oneLineCommaLists2 = _interopRequireDefault(_oneLineCommaLists);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _oneLineCommaLists2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lQ29tbWFMaXN0cy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLHFCO3FCQUFiQSxPIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnJvbSAnLi9vbmVMaW5lQ29tbWFMaXN0cyc7XG4iXX0=
},{"./oneLineCommaLists":"../../node_modules/common-tags/es/oneLineCommaLists/oneLineCommaLists.js"}],"../../node_modules/common-tags/es/oneLineCommaListsOr/oneLineCommaListsOr.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _inlineArrayTransformer = require('../inlineArrayTransformer');

var _inlineArrayTransformer2 = _interopRequireDefault(_inlineArrayTransformer);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

var _replaceResultTransformer = require('../replaceResultTransformer');

var _replaceResultTransformer2 = _interopRequireDefault(_replaceResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oneLineCommaListsOr = new _TemplateTag2.default((0, _inlineArrayTransformer2.default)({ separator: ',', conjunction: 'or' }), (0, _replaceResultTransformer2.default)(/(?:\s+)/g, ' '), _trimResultTransformer2.default);

exports.default = oneLineCommaListsOr;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lQ29tbWFMaXN0c09yL29uZUxpbmVDb21tYUxpc3RzT3IuanMiXSwibmFtZXMiOlsiVGVtcGxhdGVUYWciLCJpbmxpbmVBcnJheVRyYW5zZm9ybWVyIiwidHJpbVJlc3VsdFRyYW5zZm9ybWVyIiwicmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIiwib25lTGluZUNvbW1hTGlzdHNPciIsInNlcGFyYXRvciIsImNvbmp1bmN0aW9uIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxXQUFQLE1BQXdCLGdCQUF4QjtBQUNBLE9BQU9DLHNCQUFQLE1BQW1DLDJCQUFuQztBQUNBLE9BQU9DLHFCQUFQLE1BQWtDLDBCQUFsQztBQUNBLE9BQU9DLHdCQUFQLE1BQXFDLDZCQUFyQzs7QUFFQSxJQUFNQyxzQkFBc0IsSUFBSUosV0FBSixDQUMxQkMsdUJBQXVCLEVBQUVJLFdBQVcsR0FBYixFQUFrQkMsYUFBYSxJQUEvQixFQUF2QixDQUQwQixFQUUxQkgseUJBQXlCLFVBQXpCLEVBQXFDLEdBQXJDLENBRjBCLEVBRzFCRCxxQkFIMEIsQ0FBNUI7O0FBTUEsZUFBZUUsbUJBQWYiLCJmaWxlIjoib25lTGluZUNvbW1hTGlzdHNPci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmltcG9ydCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcblxuY29uc3Qgb25lTGluZUNvbW1hTGlzdHNPciA9IG5ldyBUZW1wbGF0ZVRhZyhcbiAgaW5saW5lQXJyYXlUcmFuc2Zvcm1lcih7IHNlcGFyYXRvcjogJywnLCBjb25qdW5jdGlvbjogJ29yJyB9KSxcbiAgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKC8oPzpcXHMrKS9nLCAnICcpLFxuICB0cmltUmVzdWx0VHJhbnNmb3JtZXIsXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBvbmVMaW5lQ29tbWFMaXN0c09yO1xuIl19
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../inlineArrayTransformer":"../../node_modules/common-tags/es/inlineArrayTransformer/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js","../replaceResultTransformer":"../../node_modules/common-tags/es/replaceResultTransformer/index.js"}],"../../node_modules/common-tags/es/oneLineCommaListsOr/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _oneLineCommaListsOr = require('./oneLineCommaListsOr');

var _oneLineCommaListsOr2 = _interopRequireDefault(_oneLineCommaListsOr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _oneLineCommaListsOr2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lQ29tbWFMaXN0c09yL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsdUI7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL29uZUxpbmVDb21tYUxpc3RzT3InO1xuIl19
},{"./oneLineCommaListsOr":"../../node_modules/common-tags/es/oneLineCommaListsOr/oneLineCommaListsOr.js"}],"../../node_modules/common-tags/es/oneLineCommaListsAnd/oneLineCommaListsAnd.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _inlineArrayTransformer = require('../inlineArrayTransformer');

var _inlineArrayTransformer2 = _interopRequireDefault(_inlineArrayTransformer);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

var _replaceResultTransformer = require('../replaceResultTransformer');

var _replaceResultTransformer2 = _interopRequireDefault(_replaceResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oneLineCommaListsAnd = new _TemplateTag2.default((0, _inlineArrayTransformer2.default)({ separator: ',', conjunction: 'and' }), (0, _replaceResultTransformer2.default)(/(?:\s+)/g, ' '), _trimResultTransformer2.default);

exports.default = oneLineCommaListsAnd;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lQ29tbWFMaXN0c0FuZC9vbmVMaW5lQ29tbWFMaXN0c0FuZC5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsImlubGluZUFycmF5VHJhbnNmb3JtZXIiLCJ0cmltUmVzdWx0VHJhbnNmb3JtZXIiLCJyZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIiLCJvbmVMaW5lQ29tbWFMaXN0c0FuZCIsInNlcGFyYXRvciIsImNvbmp1bmN0aW9uIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxXQUFQLE1BQXdCLGdCQUF4QjtBQUNBLE9BQU9DLHNCQUFQLE1BQW1DLDJCQUFuQztBQUNBLE9BQU9DLHFCQUFQLE1BQWtDLDBCQUFsQztBQUNBLE9BQU9DLHdCQUFQLE1BQXFDLDZCQUFyQzs7QUFFQSxJQUFNQyx1QkFBdUIsSUFBSUosV0FBSixDQUMzQkMsdUJBQXVCLEVBQUVJLFdBQVcsR0FBYixFQUFrQkMsYUFBYSxLQUEvQixFQUF2QixDQUQyQixFQUUzQkgseUJBQXlCLFVBQXpCLEVBQXFDLEdBQXJDLENBRjJCLEVBRzNCRCxxQkFIMkIsQ0FBN0I7O0FBTUEsZUFBZUUsb0JBQWYiLCJmaWxlIjoib25lTGluZUNvbW1hTGlzdHNBbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcic7XG5cbmNvbnN0IG9uZUxpbmVDb21tYUxpc3RzQW5kID0gbmV3IFRlbXBsYXRlVGFnKFxuICBpbmxpbmVBcnJheVRyYW5zZm9ybWVyKHsgc2VwYXJhdG9yOiAnLCcsIGNvbmp1bmN0aW9uOiAnYW5kJyB9KSxcbiAgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKC8oPzpcXHMrKS9nLCAnICcpLFxuICB0cmltUmVzdWx0VHJhbnNmb3JtZXIsXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBvbmVMaW5lQ29tbWFMaXN0c0FuZDtcbiJdfQ==
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../inlineArrayTransformer":"../../node_modules/common-tags/es/inlineArrayTransformer/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js","../replaceResultTransformer":"../../node_modules/common-tags/es/replaceResultTransformer/index.js"}],"../../node_modules/common-tags/es/oneLineCommaListsAnd/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _oneLineCommaListsAnd = require('./oneLineCommaListsAnd');

var _oneLineCommaListsAnd2 = _interopRequireDefault(_oneLineCommaListsAnd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _oneLineCommaListsAnd2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lQ29tbWFMaXN0c0FuZC9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLHdCO3FCQUFiQSxPIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnJvbSAnLi9vbmVMaW5lQ29tbWFMaXN0c0FuZCc7XG4iXX0=
},{"./oneLineCommaListsAnd":"../../node_modules/common-tags/es/oneLineCommaListsAnd/oneLineCommaListsAnd.js"}],"../../node_modules/common-tags/es/inlineLists/inlineLists.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _stripIndentTransformer = require('../stripIndentTransformer');

var _stripIndentTransformer2 = _interopRequireDefault(_stripIndentTransformer);

var _inlineArrayTransformer = require('../inlineArrayTransformer');

var _inlineArrayTransformer2 = _interopRequireDefault(_inlineArrayTransformer);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inlineLists = new _TemplateTag2.default(_inlineArrayTransformer2.default, _stripIndentTransformer2.default, _trimResultTransformer2.default);

exports.default = inlineLists;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmxpbmVMaXN0cy9pbmxpbmVMaXN0cy5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInN0cmlwSW5kZW50VHJhbnNmb3JtZXIiLCJpbmxpbmVBcnJheVRyYW5zZm9ybWVyIiwidHJpbVJlc3VsdFRyYW5zZm9ybWVyIiwiaW5saW5lTGlzdHMiXSwibWFwcGluZ3MiOiJBQUFBLE9BQU9BLFdBQVAsTUFBd0IsZ0JBQXhCO0FBQ0EsT0FBT0Msc0JBQVAsTUFBbUMsMkJBQW5DO0FBQ0EsT0FBT0Msc0JBQVAsTUFBbUMsMkJBQW5DO0FBQ0EsT0FBT0MscUJBQVAsTUFBa0MsMEJBQWxDOztBQUVBLElBQU1DLGNBQWMsSUFBSUosV0FBSixDQUNsQkUsc0JBRGtCLEVBRWxCRCxzQkFGa0IsRUFHbEJFLHFCQUhrQixDQUFwQjs7QUFNQSxlQUFlQyxXQUFmIiwiZmlsZSI6ImlubGluZUxpc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5cbmNvbnN0IGlubGluZUxpc3RzID0gbmV3IFRlbXBsYXRlVGFnKFxuICBpbmxpbmVBcnJheVRyYW5zZm9ybWVyLFxuICBzdHJpcEluZGVudFRyYW5zZm9ybWVyLFxuICB0cmltUmVzdWx0VHJhbnNmb3JtZXIsXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBpbmxpbmVMaXN0cztcbiJdfQ==
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../stripIndentTransformer":"../../node_modules/common-tags/es/stripIndentTransformer/index.js","../inlineArrayTransformer":"../../node_modules/common-tags/es/inlineArrayTransformer/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js"}],"../../node_modules/common-tags/es/inlineLists/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _inlineLists = require('./inlineLists');

var _inlineLists2 = _interopRequireDefault(_inlineLists);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _inlineLists2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmxpbmVMaXN0cy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLGU7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL2lubGluZUxpc3RzJztcbiJdfQ==
},{"./inlineLists":"../../node_modules/common-tags/es/inlineLists/inlineLists.js"}],"../../node_modules/common-tags/es/oneLineInlineLists/oneLineInlineLists.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _inlineArrayTransformer = require('../inlineArrayTransformer');

var _inlineArrayTransformer2 = _interopRequireDefault(_inlineArrayTransformer);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

var _replaceResultTransformer = require('../replaceResultTransformer');

var _replaceResultTransformer2 = _interopRequireDefault(_replaceResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oneLineInlineLists = new _TemplateTag2.default(_inlineArrayTransformer2.default, (0, _replaceResultTransformer2.default)(/(?:\s+)/g, ' '), _trimResultTransformer2.default);

exports.default = oneLineInlineLists;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lSW5saW5lTGlzdHMvb25lTGluZUlubGluZUxpc3RzLmpzIl0sIm5hbWVzIjpbIlRlbXBsYXRlVGFnIiwiaW5saW5lQXJyYXlUcmFuc2Zvcm1lciIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciIsIm9uZUxpbmVJbmxpbmVMaXN0cyJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7QUFDQSxPQUFPQyx3QkFBUCxNQUFxQyw2QkFBckM7O0FBRUEsSUFBTUMscUJBQXFCLElBQUlKLFdBQUosQ0FDekJDLHNCQUR5QixFQUV6QkUseUJBQXlCLFVBQXpCLEVBQXFDLEdBQXJDLENBRnlCLEVBR3pCRCxxQkFIeUIsQ0FBM0I7O0FBTUEsZUFBZUUsa0JBQWYiLCJmaWxlIjoib25lTGluZUlubGluZUxpc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuXG5jb25zdCBvbmVMaW5lSW5saW5lTGlzdHMgPSBuZXcgVGVtcGxhdGVUYWcoXG4gIGlubGluZUFycmF5VHJhbnNmb3JtZXIsXG4gIHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcigvKD86XFxzKykvZywgJyAnKSxcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgb25lTGluZUlubGluZUxpc3RzO1xuIl19
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../inlineArrayTransformer":"../../node_modules/common-tags/es/inlineArrayTransformer/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js","../replaceResultTransformer":"../../node_modules/common-tags/es/replaceResultTransformer/index.js"}],"../../node_modules/common-tags/es/oneLineInlineLists/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _oneLineInlineLists = require('./oneLineInlineLists');

var _oneLineInlineLists2 = _interopRequireDefault(_oneLineInlineLists);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _oneLineInlineLists2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lSW5saW5lTGlzdHMvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixzQjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vb25lTGluZUlubGluZUxpc3RzJztcbiJdfQ==
},{"./oneLineInlineLists":"../../node_modules/common-tags/es/oneLineInlineLists/oneLineInlineLists.js"}],"../../node_modules/common-tags/es/stripIndent/stripIndent.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _stripIndentTransformer = require('../stripIndentTransformer');

var _stripIndentTransformer2 = _interopRequireDefault(_stripIndentTransformer);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stripIndent = new _TemplateTag2.default(_stripIndentTransformer2.default, _trimResultTransformer2.default);

exports.default = stripIndent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudC9zdHJpcEluZGVudC5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInN0cmlwSW5kZW50VHJhbnNmb3JtZXIiLCJ0cmltUmVzdWx0VHJhbnNmb3JtZXIiLCJzdHJpcEluZGVudCJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7O0FBRUEsSUFBTUMsY0FBYyxJQUFJSCxXQUFKLENBQ2xCQyxzQkFEa0IsRUFFbEJDLHFCQUZrQixDQUFwQjs7QUFLQSxlQUFlQyxXQUFmIiwiZmlsZSI6InN0cmlwSW5kZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuXG5jb25zdCBzdHJpcEluZGVudCA9IG5ldyBUZW1wbGF0ZVRhZyhcbiAgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcixcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgc3RyaXBJbmRlbnQ7XG4iXX0=
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../stripIndentTransformer":"../../node_modules/common-tags/es/stripIndentTransformer/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js"}],"../../node_modules/common-tags/es/stripIndent/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _stripIndent = require('./stripIndent');

var _stripIndent2 = _interopRequireDefault(_stripIndent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _stripIndent2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudC9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLGU7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL3N0cmlwSW5kZW50JztcbiJdfQ==
},{"./stripIndent":"../../node_modules/common-tags/es/stripIndent/stripIndent.js"}],"../../node_modules/common-tags/es/stripIndents/stripIndents.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TemplateTag = require('../TemplateTag');

var _TemplateTag2 = _interopRequireDefault(_TemplateTag);

var _stripIndentTransformer = require('../stripIndentTransformer');

var _stripIndentTransformer2 = _interopRequireDefault(_stripIndentTransformer);

var _trimResultTransformer = require('../trimResultTransformer');

var _trimResultTransformer2 = _interopRequireDefault(_trimResultTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stripIndents = new _TemplateTag2.default((0, _stripIndentTransformer2.default)('all'), _trimResultTransformer2.default);

exports.default = stripIndents;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudHMvc3RyaXBJbmRlbnRzLmpzIl0sIm5hbWVzIjpbIlRlbXBsYXRlVGFnIiwic3RyaXBJbmRlbnRUcmFuc2Zvcm1lciIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInN0cmlwSW5kZW50cyJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7O0FBRUEsSUFBTUMsZUFBZSxJQUFJSCxXQUFKLENBQ25CQyx1QkFBdUIsS0FBdkIsQ0FEbUIsRUFFbkJDLHFCQUZtQixDQUFyQjs7QUFLQSxlQUFlQyxZQUFmIiwiZmlsZSI6InN0cmlwSW5kZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcblxuY29uc3Qgc3RyaXBJbmRlbnRzID0gbmV3IFRlbXBsYXRlVGFnKFxuICBzdHJpcEluZGVudFRyYW5zZm9ybWVyKCdhbGwnKSxcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgc3RyaXBJbmRlbnRzO1xuIl19
},{"../TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","../stripIndentTransformer":"../../node_modules/common-tags/es/stripIndentTransformer/index.js","../trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js"}],"../../node_modules/common-tags/es/stripIndents/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _stripIndents = require('./stripIndents');

var _stripIndents2 = _interopRequireDefault(_stripIndents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _stripIndents2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudHMvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixnQjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vc3RyaXBJbmRlbnRzJztcbiJdfQ==
},{"./stripIndents":"../../node_modules/common-tags/es/stripIndents/stripIndents.js"}],"../../node_modules/common-tags/es/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripIndents = exports.stripIndent = exports.oneLineInlineLists = exports.inlineLists = exports.oneLineCommaListsAnd = exports.oneLineCommaListsOr = exports.oneLineCommaLists = exports.oneLineTrim = exports.oneLine = exports.safeHtml = exports.source = exports.codeBlock = exports.html = exports.commaListsOr = exports.commaListsAnd = exports.commaLists = exports.removeNonPrintingValuesTransformer = exports.splitStringTransformer = exports.inlineArrayTransformer = exports.replaceStringTransformer = exports.replaceSubstitutionTransformer = exports.replaceResultTransformer = exports.stripIndentTransformer = exports.trimResultTransformer = exports.TemplateTag = undefined;

var _TemplateTag2 = require('./TemplateTag');

var _TemplateTag3 = _interopRequireDefault(_TemplateTag2);

var _trimResultTransformer2 = require('./trimResultTransformer');

var _trimResultTransformer3 = _interopRequireDefault(_trimResultTransformer2);

var _stripIndentTransformer2 = require('./stripIndentTransformer');

var _stripIndentTransformer3 = _interopRequireDefault(_stripIndentTransformer2);

var _replaceResultTransformer2 = require('./replaceResultTransformer');

var _replaceResultTransformer3 = _interopRequireDefault(_replaceResultTransformer2);

var _replaceSubstitutionTransformer2 = require('./replaceSubstitutionTransformer');

var _replaceSubstitutionTransformer3 = _interopRequireDefault(_replaceSubstitutionTransformer2);

var _replaceStringTransformer2 = require('./replaceStringTransformer');

var _replaceStringTransformer3 = _interopRequireDefault(_replaceStringTransformer2);

var _inlineArrayTransformer2 = require('./inlineArrayTransformer');

var _inlineArrayTransformer3 = _interopRequireDefault(_inlineArrayTransformer2);

var _splitStringTransformer2 = require('./splitStringTransformer');

var _splitStringTransformer3 = _interopRequireDefault(_splitStringTransformer2);

var _removeNonPrintingValuesTransformer2 = require('./removeNonPrintingValuesTransformer');

var _removeNonPrintingValuesTransformer3 = _interopRequireDefault(_removeNonPrintingValuesTransformer2);

var _commaLists2 = require('./commaLists');

var _commaLists3 = _interopRequireDefault(_commaLists2);

var _commaListsAnd2 = require('./commaListsAnd');

var _commaListsAnd3 = _interopRequireDefault(_commaListsAnd2);

var _commaListsOr2 = require('./commaListsOr');

var _commaListsOr3 = _interopRequireDefault(_commaListsOr2);

var _html2 = require('./html');

var _html3 = _interopRequireDefault(_html2);

var _codeBlock2 = require('./codeBlock');

var _codeBlock3 = _interopRequireDefault(_codeBlock2);

var _source2 = require('./source');

var _source3 = _interopRequireDefault(_source2);

var _safeHtml2 = require('./safeHtml');

var _safeHtml3 = _interopRequireDefault(_safeHtml2);

var _oneLine2 = require('./oneLine');

var _oneLine3 = _interopRequireDefault(_oneLine2);

var _oneLineTrim2 = require('./oneLineTrim');

var _oneLineTrim3 = _interopRequireDefault(_oneLineTrim2);

var _oneLineCommaLists2 = require('./oneLineCommaLists');

var _oneLineCommaLists3 = _interopRequireDefault(_oneLineCommaLists2);

var _oneLineCommaListsOr2 = require('./oneLineCommaListsOr');

var _oneLineCommaListsOr3 = _interopRequireDefault(_oneLineCommaListsOr2);

var _oneLineCommaListsAnd2 = require('./oneLineCommaListsAnd');

var _oneLineCommaListsAnd3 = _interopRequireDefault(_oneLineCommaListsAnd2);

var _inlineLists2 = require('./inlineLists');

var _inlineLists3 = _interopRequireDefault(_inlineLists2);

var _oneLineInlineLists2 = require('./oneLineInlineLists');

var _oneLineInlineLists3 = _interopRequireDefault(_oneLineInlineLists2);

var _stripIndent2 = require('./stripIndent');

var _stripIndent3 = _interopRequireDefault(_stripIndent2);

var _stripIndents2 = require('./stripIndents');

var _stripIndents3 = _interopRequireDefault(_stripIndents2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.TemplateTag = _TemplateTag3.default;

// transformers

// core

exports.trimResultTransformer = _trimResultTransformer3.default;
exports.stripIndentTransformer = _stripIndentTransformer3.default;
exports.replaceResultTransformer = _replaceResultTransformer3.default;
exports.replaceSubstitutionTransformer = _replaceSubstitutionTransformer3.default;
exports.replaceStringTransformer = _replaceStringTransformer3.default;
exports.inlineArrayTransformer = _inlineArrayTransformer3.default;
exports.splitStringTransformer = _splitStringTransformer3.default;
exports.removeNonPrintingValuesTransformer = _removeNonPrintingValuesTransformer3.default;

// tags

exports.commaLists = _commaLists3.default;
exports.commaListsAnd = _commaListsAnd3.default;
exports.commaListsOr = _commaListsOr3.default;
exports.html = _html3.default;
exports.codeBlock = _codeBlock3.default;
exports.source = _source3.default;
exports.safeHtml = _safeHtml3.default;
exports.oneLine = _oneLine3.default;
exports.oneLineTrim = _oneLineTrim3.default;
exports.oneLineCommaLists = _oneLineCommaLists3.default;
exports.oneLineCommaListsOr = _oneLineCommaListsOr3.default;
exports.oneLineCommaListsAnd = _oneLineCommaListsAnd3.default;
exports.inlineLists = _inlineLists3.default;
exports.oneLineInlineLists = _oneLineInlineLists3.default;
exports.stripIndent = _stripIndent3.default;
exports.stripIndents = _stripIndents3.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInN0cmlwSW5kZW50VHJhbnNmb3JtZXIiLCJyZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIiLCJyZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIiLCJyZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIiLCJpbmxpbmVBcnJheVRyYW5zZm9ybWVyIiwic3BsaXRTdHJpbmdUcmFuc2Zvcm1lciIsInJlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIiLCJjb21tYUxpc3RzIiwiY29tbWFMaXN0c0FuZCIsImNvbW1hTGlzdHNPciIsImh0bWwiLCJjb2RlQmxvY2siLCJzb3VyY2UiLCJzYWZlSHRtbCIsIm9uZUxpbmUiLCJvbmVMaW5lVHJpbSIsIm9uZUxpbmVDb21tYUxpc3RzIiwib25lTGluZUNvbW1hTGlzdHNPciIsIm9uZUxpbmVDb21tYUxpc3RzQW5kIiwiaW5saW5lTGlzdHMiLCJvbmVMaW5lSW5saW5lTGlzdHMiLCJzdHJpcEluZGVudCIsInN0cmlwSW5kZW50cyJdLCJtYXBwaW5ncyI6IkFBQUE7eUJBQ3dCLGU7eUJBQWpCQSxXOztBQUVQOzttQ0FDa0MseUI7bUNBQTNCQyxxQjtvQ0FDNEIsMEI7b0NBQTVCQyxzQjtzQ0FDOEIsNEI7c0NBQTlCQyx3Qjs0Q0FDb0Msa0M7NENBQXBDQyw4QjtzQ0FDOEIsNEI7c0NBQTlCQyx3QjtvQ0FDNEIsMEI7b0NBQTVCQyxzQjtvQ0FDNEIsMEI7b0NBQTVCQyxzQjtnREFDd0Msc0M7Z0RBQXhDQyxrQzs7QUFFUDs7d0JBQ3VCLGM7d0JBQWhCQyxVOzJCQUNtQixpQjsyQkFBbkJDLGE7MEJBQ2tCLGdCOzBCQUFsQkMsWTtrQkFDVSxRO2tCQUFWQyxJO3VCQUNlLGE7dUJBQWZDLFM7b0JBQ1ksVTtvQkFBWkMsTTtzQkFDYyxZO3NCQUFkQyxRO3FCQUNhLFc7cUJBQWJDLE87eUJBQ2lCLGU7eUJBQWpCQyxXOytCQUN1QixxQjsrQkFBdkJDLGlCO2lDQUN5Qix1QjtpQ0FBekJDLG1CO2tDQUMwQix3QjtrQ0FBMUJDLG9CO3lCQUNpQixlO3lCQUFqQkMsVztnQ0FDd0Isc0I7Z0NBQXhCQyxrQjt5QkFDaUIsZTt5QkFBakJDLFc7MEJBQ2tCLGdCOzBCQUFsQkMsWSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGNvcmVcbmV4cG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuL1RlbXBsYXRlVGFnJztcblxuLy8gdHJhbnNmb3JtZXJzXG5leHBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmV4cG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4vc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcic7XG5leHBvcnQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcbmV4cG9ydCByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIgZnJvbSAnLi9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXInO1xuZXhwb3J0IHJlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lciBmcm9tICcuL3JlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lcic7XG5leHBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuZXhwb3J0IHNwbGl0U3RyaW5nVHJhbnNmb3JtZXIgZnJvbSAnLi9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyJztcbmV4cG9ydCByZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyIGZyb20gJy4vcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lcic7XG5cbi8vIHRhZ3NcbmV4cG9ydCBjb21tYUxpc3RzIGZyb20gJy4vY29tbWFMaXN0cyc7XG5leHBvcnQgY29tbWFMaXN0c0FuZCBmcm9tICcuL2NvbW1hTGlzdHNBbmQnO1xuZXhwb3J0IGNvbW1hTGlzdHNPciBmcm9tICcuL2NvbW1hTGlzdHNPcic7XG5leHBvcnQgaHRtbCBmcm9tICcuL2h0bWwnO1xuZXhwb3J0IGNvZGVCbG9jayBmcm9tICcuL2NvZGVCbG9jayc7XG5leHBvcnQgc291cmNlIGZyb20gJy4vc291cmNlJztcbmV4cG9ydCBzYWZlSHRtbCBmcm9tICcuL3NhZmVIdG1sJztcbmV4cG9ydCBvbmVMaW5lIGZyb20gJy4vb25lTGluZSc7XG5leHBvcnQgb25lTGluZVRyaW0gZnJvbSAnLi9vbmVMaW5lVHJpbSc7XG5leHBvcnQgb25lTGluZUNvbW1hTGlzdHMgZnJvbSAnLi9vbmVMaW5lQ29tbWFMaXN0cyc7XG5leHBvcnQgb25lTGluZUNvbW1hTGlzdHNPciBmcm9tICcuL29uZUxpbmVDb21tYUxpc3RzT3InO1xuZXhwb3J0IG9uZUxpbmVDb21tYUxpc3RzQW5kIGZyb20gJy4vb25lTGluZUNvbW1hTGlzdHNBbmQnO1xuZXhwb3J0IGlubGluZUxpc3RzIGZyb20gJy4vaW5saW5lTGlzdHMnO1xuZXhwb3J0IG9uZUxpbmVJbmxpbmVMaXN0cyBmcm9tICcuL29uZUxpbmVJbmxpbmVMaXN0cyc7XG5leHBvcnQgc3RyaXBJbmRlbnQgZnJvbSAnLi9zdHJpcEluZGVudCc7XG5leHBvcnQgc3RyaXBJbmRlbnRzIGZyb20gJy4vc3RyaXBJbmRlbnRzJztcbiJdfQ==
},{"./TemplateTag":"../../node_modules/common-tags/es/TemplateTag/index.js","./trimResultTransformer":"../../node_modules/common-tags/es/trimResultTransformer/index.js","./stripIndentTransformer":"../../node_modules/common-tags/es/stripIndentTransformer/index.js","./replaceResultTransformer":"../../node_modules/common-tags/es/replaceResultTransformer/index.js","./replaceSubstitutionTransformer":"../../node_modules/common-tags/es/replaceSubstitutionTransformer/index.js","./replaceStringTransformer":"../../node_modules/common-tags/es/replaceStringTransformer/index.js","./inlineArrayTransformer":"../../node_modules/common-tags/es/inlineArrayTransformer/index.js","./splitStringTransformer":"../../node_modules/common-tags/es/splitStringTransformer/index.js","./removeNonPrintingValuesTransformer":"../../node_modules/common-tags/es/removeNonPrintingValuesTransformer/index.js","./commaLists":"../../node_modules/common-tags/es/commaLists/index.js","./commaListsAnd":"../../node_modules/common-tags/es/commaListsAnd/index.js","./commaListsOr":"../../node_modules/common-tags/es/commaListsOr/index.js","./html":"../../node_modules/common-tags/es/html/index.js","./codeBlock":"../../node_modules/common-tags/es/codeBlock/index.js","./source":"../../node_modules/common-tags/es/source/index.js","./safeHtml":"../../node_modules/common-tags/es/safeHtml/index.js","./oneLine":"../../node_modules/common-tags/es/oneLine/index.js","./oneLineTrim":"../../node_modules/common-tags/es/oneLineTrim/index.js","./oneLineCommaLists":"../../node_modules/common-tags/es/oneLineCommaLists/index.js","./oneLineCommaListsOr":"../../node_modules/common-tags/es/oneLineCommaListsOr/index.js","./oneLineCommaListsAnd":"../../node_modules/common-tags/es/oneLineCommaListsAnd/index.js","./inlineLists":"../../node_modules/common-tags/es/inlineLists/index.js","./oneLineInlineLists":"../../node_modules/common-tags/es/oneLineInlineLists/index.js","./stripIndent":"../../node_modules/common-tags/es/stripIndent/index.js","./stripIndents":"../../node_modules/common-tags/es/stripIndents/index.js"}],"puzzles/base-puzzle-setup.ts":[function(require,module,exports) {
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
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_animator_1 = require("../base-animator");
var common_animator_1 = require("./common-animator");
var utils_1 = __importDefault(require("../../utils"));
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
        this.charsOnSide = 4;
        this.bridgeHeightToWidthRatio = 140 / 512;
        this.draw.clear();

        var _common_animator_1$ge = common_animator_1.getBaseDimensions(this.draw);

        var _common_animator_1$ge2 = _slicedToArray(_common_animator_1$ge, 2);

        this.baseWidth = _common_animator_1$ge2[0];
        this.baseHeight = _common_animator_1$ge2[1];

        console.log(this.baseHeight);
        this.characterSideLength = this.baseWidth / 16;
        this.sideWidth = this.characterSideLength * this.charsOnSide;
        this.bridgeHeight = (this.baseWidth - 2 * this.sideWidth) * this.bridgeHeightToWidthRatio;
        this.bridgeYCoord = this.baseHeight - this.bridgeHeight;
        console.log(this.bridgeHeight);
        console.log(this.bridgeYCoord);
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
                                return utils_1.default(500);

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
                                return utils_1.default(animationTime);

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
},{"../base-animator":"puzzles/base-animator.ts","./common-animator":"puzzles/crossing-puzzles/common-animator.ts","../../utils":"utils.ts","./common-setup":"puzzles/crossing-puzzles/common-setup.ts","../base-puzzle-setup":"puzzles/base-puzzle-setup.ts","./bridge-setup":"puzzles/crossing-puzzles/bridge-setup.ts"}],"puzzles/crossing-puzzles/river-setup.ts":[function(require,module,exports) {
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
exports.initActorPuzzle = function () {
    var boat = new Boat(["Anne", "Anne_Agent", "Bob", "Bob_Agent"], 2);
    var passengers = [new Passenger("Anne", 1), new Passenger("Anne_Agent", 1), new Passenger("Bob", 1), new Passenger("Bob_Agent", 1)];
    var rules = [new SameSideRule('Anne', 'Bob_Agent', 'Anne_Agent'), new SameSideRule('Bob', 'Anne_Agent', 'Bob_Agent')];
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
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//The code in this file isn't great because it was my first attempt at creating an animator - look to the "bridge-animator.ts"
//for an example of better code
var base_puzzle_setup_1 = require("../base-puzzle-setup");
var base_animator_1 = require("../base-animator");
var river_setup_1 = require("./river-setup");
var common_animator_1 = require("./common-animator");
var utils_1 = __importDefault(require("../../utils"));
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
        this.textPool = [];
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
                                return utils_1.default(500);

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
            var boatSideLengthInCharacters = 2;
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
                                    this.drawRiverBank(rightBankXCoord, rightBankIDs);
                                } else {
                                    this.drawRiverBank(leftBankXCoord, leftBankIDs);
                                }
                                //this.numberPuzzle()

                                if (!(i !== 0)) {
                                    _context2.next = 12;
                                    break;
                                }

                                //Get list of passengers that have moved by checking a passenger's side
                                //in the previous state equals their side in the current state
                                prevState = river_setup_1.states[i - 1];
                                movingPassengerIDs = common_animator_1.getMovingCrossers(state.data.passengers, prevState.data.passengers);
                                _context2.next = 12;
                                return this.animateCrossing(movingPassengerIDs, moveDirection);

                            case 12:
                                if (moveDirection === common_setup_1.Side.Left) {
                                    this.drawRiverBank(leftBankXCoord, leftBankIDs);
                                } else {
                                    this.drawRiverBank(rightBankXCoord, rightBankIDs);
                                }
                                this.numberPuzzle([], undefined);
                                if (throwFatalError) {
                                    this.displayFatalError(state.status.event, state.status.errorData, state.data.passengers);
                                } else if (showSuccess) {
                                    this.addMessage(state.status.event, 'success');
                                }
                                //Put numbers on faces - if necessary
                                //Only draw numbers on soldier/priest puzzles
                                //this.numberPuzzle()

                            case 15:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
    }, {
        key: "numberPuzzle",
        value: function numberPuzzle(movingIDs, movingObjects) {
            this.textPool.map(function (text) {
                return text.remove();
            });
            this.textPool.splice(0, this.textPool.length);
            var initState = river_setup_1.states[0];
            if (initState.data.passengers.some(function (passenger) {
                return passenger.type === 'soldier';
            })) {
                this.numberPassengers('soldier', 'boy', movingIDs, movingObjects);
            } else if (initState.data.passengers.some(function (passenger) {
                return passenger.type === 'priest';
            })) {
                this.numberPassengers('vampire', 'priest', movingIDs, movingObjects);
            }
        }
    }, {
        key: "numberPassengers",
        value: function numberPassengers(type1, type2, movingIDs, movingObjects) {
            var _this = this;

            var type1s = river_setup_1.states[0].data.passengers.filter(function (passenger) {
                return passenger.type === type1;
            });
            var type2s = river_setup_1.states[0].data.passengers.filter(function (passenger) {
                return passenger.type === type2;
            });
            var createText = function createText(displayNum, drawingID) {
                var text = _this.draw.text(displayNum.toString()).move(drawings.get(drawingID).x(), drawings.get(drawingID).y()).font({
                    weight: '700'
                });
                _this.textPool.push(text);
                if (movingIDs.includes(drawingID)) {
                    movingObjects.add(text);
                }
            };
            for (var i = 0; i < type1s.length; i++) {
                createText(i, i);
            }
            for (var _i = 0; _i < type2s.length; _i++) {
                createText(_i, type1s.length + _i);
            }
        }
    }, {
        key: "displayFatalError",
        value: function displayFatalError(message, errorData, passengers) {
            //Don't want skull in wife puzzle
            if (!river_setup_1.states[0].data.passengers.find(function (passenger) {
                return ["Bob_Wife", "Charlie_Wife", "Bob", "Charlie"].includes(passenger.type);
            })) {
                this.replaceImage(errorData.oldType, errorData.newType, errorData.side, passengers);
            }
            this.addMessage("Error: " + message);
        }
    }, {
        key: "replaceImage",
        value: function replaceImage(oldtype, newtype, targetSide, passengers) {
            var _this2 = this;

            drawings.forEach(function (drawing, key) {
                //@ts-ignore drawing.src undefined
                var src = drawing.src;
                if (src) {
                    if (passengers[key].side === targetSide) {
                        if (src.split('/').pop().slice(0, -extension.length) === oldtype) {
                            var oldX = drawing.x();
                            var oldY = drawing.y();
                            drawing.remove();
                            if (oldtype === 'apple') {
                                //@ts-ignore drawing.src undefined
                                drawing = _this2.draw.image(drawing.src.replace(oldtype + extension, newtype + extension)).size(characterSideLength, characterSideLength).move(oldX, oldY);
                            } else {
                                //@ts-ignore drawing.src undefined
                                drawing = _this2.draw.image(drawing.src.replace(drawing.src.split('/').slice(-2).join('/'), 'common/' + newtype + extension)).size(characterSideLength, characterSideLength).move(oldX, oldY);
                            }
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
                                    _context3.next = 36;
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

                                this.numberPuzzle(IDs, movingObjects);
                                movingObjects.animate(animationTime, '-', 0).move(xShift, 0);
                                _context3.next = 32;
                                return utils_1.default(animationTime);

                            case 32:
                                movingObjects.remove();
                                if (refreshBoat) {
                                    boat = this.draw.image(this.baseDir + this.commonDir + 'raft.svg').size(boatSideLength, boatSideLength).y(boatYCoord).x(targetXCoord);
                                }
                                _context3.next = 64;
                                break;

                            case 36:
                                _xCoord = rightBankXCoord - characterSideLength;
                                //Add the drawings one by one
                                //Each time a drawing is added, shift to the left before adding another drawing

                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context3.prev = 40;
                                for (_iterator3 = IDs[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    _id = _step3.value;
                                    _currentDrawing = drawings.get(_id);

                                    _currentDrawing.move(_xCoord, yCoord);
                                    movingObjects.add(_currentDrawing);
                                    _xCoord -= characterSideLength + gap;
                                }
                                //The end point of the animation - in absolute terms.
                                //Equals the end point of the left river bank + the length of the boat
                                _context3.next = 48;
                                break;

                            case 44:
                                _context3.prev = 44;
                                _context3.t1 = _context3["catch"](40);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context3.t1;

                            case 48:
                                _context3.prev = 48;
                                _context3.prev = 49;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 51:
                                _context3.prev = 51;

                                if (!_didIteratorError3) {
                                    _context3.next = 54;
                                    break;
                                }

                                throw _iteratorError3;

                            case 54:
                                return _context3.finish(51);

                            case 55:
                                return _context3.finish(48);

                            case 56:
                                _targetXCoord = leftBankXCoord + riverBankWidth + boatSideLength;
                                //Distance between end point of animation and start point of animation
                                //Is negative because groups only accept relative coordinates

                                _xShift = -(rightBankXCoord - _targetXCoord);
                                //Animate objects and wait until the animation is finished

                                this.numberPuzzle(IDs, movingObjects);
                                movingObjects.animate(animationTime, '-', 0).move(_xShift, 0);
                                _context3.next = 62;
                                return utils_1.default(animationTime);

                            case 62:
                                //remove the group and all images inside of it.
                                //Without this it is impossible to move the images individually
                                movingObjects.remove();
                                //Redraw the boat, if necessary.
                                if (refreshBoat) {
                                    boat = this.draw.image(this.baseDir + this.commonDir + 'raft.svg').size(boatSideLength, boatSideLength).y(boatYCoord).x(leftBankXCoord + boatSideLength);
                                }

                            case 64:
                                //Redraw all the images inside the group.
                                _iteratorNormalCompletion4 = true;
                                _didIteratorError4 = false;
                                _iteratorError4 = undefined;
                                _context3.prev = 67;
                                for (_iterator4 = IDs[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                    _id2 = _step4.value;

                                    drawings.set(_id2, this.draw.image(this.baseDir + this.specificDir + river_setup_1.states[0].data.passengers[_id2].type + extension).size(characterSideLength, characterSideLength));
                                }
                                _context3.next = 75;
                                break;

                            case 71:
                                _context3.prev = 71;
                                _context3.t2 = _context3["catch"](67);
                                _didIteratorError4 = true;
                                _iteratorError4 = _context3.t2;

                            case 75:
                                _context3.prev = 75;
                                _context3.prev = 76;

                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }

                            case 78:
                                _context3.prev = 78;

                                if (!_didIteratorError4) {
                                    _context3.next = 81;
                                    break;
                                }

                                throw _iteratorError4;

                            case 81:
                                return _context3.finish(78);

                            case 82:
                                return _context3.finish(75);

                            case 83:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[10, 14, 18, 26], [19,, 21, 25], [40, 44, 48, 56], [49,, 51, 55], [67, 71, 75, 83], [76,, 78, 82]]);
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
    }, {
        key: "drawRiverBank",
        value: function drawRiverBank(xCoord, IDs) {
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
    }]);

    return RiverAnimator;
}();

exports.RiverAnimator = RiverAnimator;
},{"../base-puzzle-setup":"puzzles/base-puzzle-setup.ts","../base-animator":"puzzles/base-animator.ts","./river-setup":"puzzles/crossing-puzzles/river-setup.ts","./common-animator":"puzzles/crossing-puzzles/common-animator.ts","../../utils":"utils.ts","./common-setup":"puzzles/crossing-puzzles/common-setup.ts"}],"puzzles/puzzle-manager.ts":[function(require,module,exports) {
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(["\n        <strong>Function:</strong> <code>moveBoat</code><br>\n        <strong>Inputs:</strong> <code>goat</code>, <code>wolf</code>, <code>farmer</code>, <code>apple</code><br>\n        <strong>Number of Inputs:</strong> 1 to 2<br>\n        <strong>Description</strong>: Moves objects across the river on the boat.\n        "], ["\n        <strong>Function:</strong> <code>moveBoat</code><br>\n        <strong>Inputs:</strong> <code>goat</code>, <code>wolf</code>, <code>farmer</code>, <code>apple</code><br>\n        <strong>Number of Inputs:</strong> 1 to 2<br>\n        <strong>Description</strong>: Moves objects across the river on the boat.\n        "]),
    _templateObject2 = _taggedTemplateLiteral(["\n        //Moves the farmer and apple across the river\n        moveBoat(farmer, apple)\n        "], ["\n        //Moves the farmer and apple across the river\n        moveBoat(farmer, apple)\n        "]),
    _templateObject3 = _taggedTemplateLiteral(["\n        <strong>Function:</strong> <code>moveBoat</code><br>\n        <strong>Inputs:</strong> Objects within the arrays <code>vampires</code>, <code>priests</code><br>\n        <strong>Number of Inputs:</strong> 1 to 2<br>\n        <strong>Description:</strong> Moves vampires and priests across the river.\n        "], ["\n        <strong>Function:</strong> <code>moveBoat</code><br>\n        <strong>Inputs:</strong> Objects within the arrays <code>vampires</code>, <code>priests</code><br>\n        <strong>Number of Inputs:</strong> 1 to 2<br>\n        <strong>Description:</strong> Moves vampires and priests across the river.\n        "]),
    _templateObject4 = _taggedTemplateLiteral(["\n        //Moves the first vampire and second priest across the river\n        moveBoat(vampires[0], priests[1])\n        "], ["\n        //Moves the first vampire and second priest across the river\n        moveBoat(vampires[0], priests[1])\n        "]),
    _templateObject5 = _taggedTemplateLiteral(["\n    //Moves the first soldier and second boy across the river\n    moveBoat(soldiers[0], boys[1])\n\n    //This is a for loop - it is used for repeating an action\n    //Move the first soldier across the river 3 times\n    for(var i = 0; i < 3; i++) {\n        moveBoat(soldiers[0])\n    }\n    "], ["\n    //Moves the first soldier and second boy across the river\n    moveBoat(soldiers[0], boys[1])\n\n    //This is a for loop - it is used for repeating an action\n    //Move the first soldier across the river 3 times\n    for(var i = 0; i < 3; i++) {\n        moveBoat(soldiers[0])\n    }\n    "]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

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
//TODO - finish migrating multiline strings to stripIndent
var common_tags_1 = require("common-tags");

var TutorialData =
//static riverCrossingBaseDir = "./assets/river-crossing/";
function TutorialData(objective, images, imageCaptions, rules, code) {
    var active = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

    _classCallCheck(this, TutorialData);

    this.objective = objective;
    this.images = images;
    this.imageCaptions = imageCaptions;
    this.rules = rules;
    this.code = code;
    this.active = active;
};

var PuzzleSetup = function () {
    function PuzzleSetup(specificSetupCode, tutorialData, initialCode) {
        _classCallCheck(this, PuzzleSetup);

        this.tutorialData = tutorialData;
        this.initialCode = initialCode;
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

    function StandardSetup(assetsDir, specificSetupCode, tutorialData, initialCode) {
        _classCallCheck(this, StandardSetup);

        var _this = _possibleConstructorReturn(this, (StandardSetup.__proto__ || Object.getPrototypeOf(StandardSetup)).call(this, specificSetupCode, tutorialData, initialCode));

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

    function BridgeSetup(specificSetupCode, assetsDir, tutorialData, initialCode) {
        _classCallCheck(this, BridgeSetup);

        var _this2 = _possibleConstructorReturn(this, (BridgeSetup.__proto__ || Object.getPrototypeOf(BridgeSetup)).call(this, assetsDir, specificSetupCode, tutorialData, initialCode));

        _this2.__environment__ = { giveTorch: bridge_setup_1.giveTorch, crossBridge: bridge_setup_1.crossBridge };
        _this2.animatorConstructor = bridge_animator_1.BridgeAnimator;
        _this2.tutorialData.images = _this2.tutorialData.images.map(function (image) {
            return _this2.assetsDir + image;
        });
        return _this2;
    }

    return BridgeSetup;
}(StandardSetup);

var river_setup_1 = require("./crossing-puzzles/river-setup");
var river_animator_1 = require("./crossing-puzzles/river-animator");

var RiverSetup = function (_StandardSetup2) {
    _inherits(RiverSetup, _StandardSetup2);

    function RiverSetup(specificSetupCode, assetsDir, tutorialData, initialCode) {
        _classCallCheck(this, RiverSetup);

        var _this3 = _possibleConstructorReturn(this, (RiverSetup.__proto__ || Object.getPrototypeOf(RiverSetup)).call(this, assetsDir, specificSetupCode, tutorialData, initialCode));

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
}, goatCabbageWolfDir, new TutorialData("Get the wolf, goat, farmer, and apple to the right side of the river using the boat.", ["wolf.svg", "goat.svg", "farmer.svg", "apple.svg"], ["wolf", "goat", "farmer", "apple"], ["The wolf cannot be left alone with the goat.", "The goat cannot be left alone with the apple.", "Only the farmer can row the boat.", "The boat can hold up to 2 objects."], [common_tags_1.stripIndent(_templateObject)]), common_tags_1.stripIndent(_templateObject2));
var vampirePriestDir = "vampire-priest/";
exports.vampirePriest = new RiverSetup(function () {
    var _river_setup_1$initVa = river_setup_1.initVampirePuzzle(),
        _river_setup_1$initVa2 = _slicedToArray(_river_setup_1$initVa, 2),
        vampires = _river_setup_1$initVa2[0],
        priests = _river_setup_1$initVa2[1];

    Object.assign(exports.vampirePriest.__environment__, { vampires: vampires, priests: priests });
}, vampirePriestDir, new TutorialData("Get three priests and three vampires to the other side of the river using the boat.", ["priest.svg", "vampire.svg"], ["priest", "vampire"], ["The boat can hold a maximum of 2 people.", "The number of vampires cannot exceed the number of priests on either side of the river.", "Anyone can row the boat."], [common_tags_1.stripIndent(_templateObject3)]), common_tags_1.stripIndent(_templateObject4));
var soldierBoyDir = "soldier-boy/";
exports.soldierBoy = new RiverSetup(function () {
    var _river_setup_1$initSo = river_setup_1.initSoldierPuzzle(),
        _river_setup_1$initSo2 = _slicedToArray(_river_setup_1$initSo, 2),
        soldiers = _river_setup_1$initSo2[0],
        boys = _river_setup_1$initSo2[1];

    Object.assign(exports.soldierBoy.__environment__, { soldiers: soldiers, boys: boys });
}, soldierBoyDir, new TutorialData("Get six soldiers and two boys to the other side of the river using the boat.", ["soldier.svg", "boy.svg"], ["soldier", "boy"], ["The boat can carry 2 boys, a soldier and a boy, but not 2 soldiers."], ["<strong>Function:</strong> <code>moveBoat</code><br>\n<strong>Inputs:</strong> Objects within the arrays <code>soldiers</code>, <code>boys</code><br>\n<strong>Number of Inputs:</strong>  1 to 2<br>\n<strong>Description:</strong> Moves soldiers and boys across the river."]), common_tags_1.stripIndent(_templateObject5));
var agentActorDir = "agent-actor/";
exports.agentActor = new RiverSetup(function () {
    var _river_setup_1$initAc = river_setup_1.initActorPuzzle(),
        _river_setup_1$initAc2 = _slicedToArray(_river_setup_1$initAc, 4),
        Anne = _river_setup_1$initAc2[0],
        Anne_Agent = _river_setup_1$initAc2[1],
        Bob = _river_setup_1$initAc2[2],
        Bob_Agent = _river_setup_1$initAc2[3];

    Object.assign(exports.agentActor.__environment__, { Bob: Bob, Bob_Agent: Bob_Agent, Anne: Anne, Anne_Agent: Anne_Agent });
}, agentActorDir, new TutorialData("Get the actors and their paranoid agents to the other side of the river using the boat.", ["Anne.svg", "Anne_Agent.svg", "Bob.svg", "Bob_Agent.svg"], ["Anne", "Anne_Agent", "Bob", "Bob_Agent"], ["The boat can hold up to 2 people.", "No actor can be in the presence of another actor's agent unless their own agent is also present, because each agent is worried their rival will poach their client", "Anyone can row the boat."], ["<strong>Function:</strong> <code>moveBoat</code><br>\n<strong>Inputs:</strong> <code>Anne</code>,<code>Anne_Agent</code>,<code>Bob</code>,<code>Bob_Agent</code><br>\n<strong>Number of Inputs:</strong>  1 to 2<br>\n<strong>Description:</strong> Moves agents and actors across the river."]), "//Moves Anne and her agent across the river\nmoveBoat(Anne, Anne_Agent)");
var ghoulDir = "./assets/bridge-crossing/ghoul-adventurer/";
exports.ghoul = new BridgeSetup(function () {
    var _bridge_setup_1$initG = bridge_setup_1.initGhoulPuzzle(),
        _bridge_setup_1$initG2 = _slicedToArray(_bridge_setup_1$initG, 4),
        Alice = _bridge_setup_1$initG2[0],
        Bob = _bridge_setup_1$initG2[1],
        Charlie = _bridge_setup_1$initG2[2],
        Doris = _bridge_setup_1$initG2[3];

    Object.assign(exports.ghoul.__environment__, { Alice: Alice, Bob: Bob, Charlie: Charlie, Doris: Doris });
}, ghoulDir, new TutorialData("Get all four adventurers to the other side of the bridge.", ["Alice.svg", "Bob.svg", "Charlie.svg", "Doris.svg"], ["Alice", "Bob", "Charlie", "Doris"], ["Alice, Bob, Charlie, and Doris can cross the bridge in 1, 2, 5, and 10 minutes respectively", "All 4 adventurers must cross the bridge in 17 minutes or less, otherwise a ghoul appears", "The bridge can only bear the weight of 2 people at a time", "Crossing the bridge is impossible without the torch"], ["<strong>Function:</strong> <code>crossBridge</code><br>\n<strong>Inputs:</strong> <code>Alice</code>, <code>Bob</code>, <code>Charlie</code>, <code>Doris</code><br>\n<strong>Number of Inputs:</strong> 1 to 2<br>\n<strong>Description</strong>: Moves adventurers across the bridge.", "<strong>Function:</strong> <code>giveTorch</code><br>\n<strong>Inputs:</strong> <code>Alice</code>, <code>Bob</code>, <code>Charlie</code>, <code>Doris</code><br>\n<strong>Number of Inputs:</strong> 1<br>\n<strong>Description</strong>: Gives the torch to an adventurer."]), "//Moves Alice and Doris across the Bridge\ncrossBridge(Alice, Doris)\n//Gives torch to Doris\ngiveTorch(Doris)");
},{"../ui/alerts":"ui/alerts.ts","../ui/message-view":"ui/message-view.js","common-tags":"../../node_modules/common-tags/es/index.js","./crossing-puzzles/bridge-setup":"puzzles/crossing-puzzles/bridge-setup.ts","./crossing-puzzles/bridge-animator":"puzzles/crossing-puzzles/bridge-animator.ts","./crossing-puzzles/river-setup":"puzzles/crossing-puzzles/river-setup.ts","./crossing-puzzles/river-animator":"puzzles/crossing-puzzles/river-animator.ts"}],"ui/modal-controller.js":[function(require,module,exports) {
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
},{}],"app.js":[function(require,module,exports) {
"use strict";

//Wait until monaco editor is loaded - then get value
var setInitialCode = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (window.puzzledEditor) {
                            _context2.next = 5;
                            break;
                        }

                        _context2.next = 3;
                        return (0, _utils2.default)(10);

                    case 3:
                        _context2.next = 0;
                        break;

                    case 5:

                        window.puzzledEditor.setValue(currentPuzzle.initialCode);

                    case 6:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function setInitialCode() {
        return _ref2.apply(this, arguments);
    };
}();

var _alerts = require("./ui/alerts");

var _utils = require("./utils");

var _utils2 = _interopRequireDefault(_utils);

var _puzzleManager = require("./puzzles/puzzle-manager");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//Load puzzles


var puzzles = new Map();
puzzles.set("Wolves and Goats", _puzzleManager.goatCabbageWolf);
puzzles.set("Priests and Vampires", _puzzleManager.vampirePriest);
puzzles.set("Soldiers and Boys", _puzzleManager.soldierBoy);
puzzles.set("Actors and Agents", _puzzleManager.agentActor);
puzzles.set("Ghouls and Adventurers", _puzzleManager.ghoul);

//set current puzzle
var currentPuzzle = puzzles.get(sessionStorage.getItem('puzzleID'));

var runButtonID = "vue-run-button";
var runButtonVueManager = new Vue({
    el: "#" + runButtonID,
    data: {
        runningCode: false,
        text: "Run"
    },
    methods: {
        runUserCode: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var codeToExecute;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.startRunning();
                                this.runningCode = true;

                                /*
                                for (let annotation of editor.getSession().getAnnotations()) {
                                    if (annotation.type === 'warning' || annotation.type === 'error') {
                                        codeErrorAlert()
                                        this.stopRunning()
                                        return;
                                    }
                                }
                                */

                                currentPuzzle.setupCode();

                                _context.prev = 3;
                                codeToExecute = window.puzzledEditor ? window.puzzledEditor.getValue() : '';

                                new (Function.prototype.bind.apply(Function, [null].concat(_toConsumableArray(Object.keys(currentPuzzle.__environment__)), [codeToExecute])))().apply(undefined, _toConsumableArray(Object.values(currentPuzzle.__environment__)));
                                _context.next = 8;
                                return currentPuzzle.endCode();

                            case 8:
                                _context.next = 14;
                                break;

                            case 10:
                                _context.prev = 10;
                                _context.t0 = _context["catch"](3);
                                _context.next = 14;
                                return currentPuzzle.endCode(_context.t0);

                            case 14:

                                this.stopRunning();

                            case 15:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[3, 10]]);
            }));

            function runUserCode() {
                return _ref.apply(this, arguments);
            }

            return runUserCode;
        }(),
        startRunning: function startRunning() {
            this.text = " ";
            this.runningCode = true;
        },
        stopRunning: function stopRunning() {
            this.runningCode = false;
            this.text = "Run";
        }
    }
});

//Setup Modal Controller
var modalController = require('./ui/modal-controller');
modalController.initModal(currentPuzzle.tutorialData);

runButtonVueManager.runUserCode();

//Freeze button's height so it doesn't shrink when code is running
var runButton = document.getElementById(runButtonID);
runButton.style.height = runButton.clientHeight + 4 + "px";

setInitialCode();
},{"./ui/alerts":"ui/alerts.ts","./utils":"utils.ts","./puzzles/puzzle-manager":"puzzles/puzzle-manager.ts","./ui/modal-controller":"ui/modal-controller.js"}],"main.js":[function(require,module,exports) {
'use strict';

require('regenerator-runtime/runtime');

require('./app');
},{"regenerator-runtime/runtime":"../../node_modules/regenerator-runtime/runtime.js","./app":"app.js"}]},{},["main.js"], null)
//# sourceMappingURL=/main.map