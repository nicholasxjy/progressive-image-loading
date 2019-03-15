var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */

var FUNC_ERROR_TEXT = 'Expected a function';
/** Used as references for various `Number` constants. */

var NAN = 0 / 0;
/** `Object#toString` result references. */

var symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */

var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */

var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */

var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */

var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */

var freeParseInt = parseInt;
/** Detect free variable `global` from Node.js. */

var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
/** Detect free variable `self`. */

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root = freeGlobal || freeSelf || Function('return this')();
/** Used for built-in method references. */

var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var objectToString = objectProto.toString;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max,
    nativeMin = Math.min;
/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */

var now = function () {
  return root.Date.now();
};
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */


function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  wait = toNumber(wait) || 0;

  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time; // Start the timer for the trailing edge.

    timerId = setTimeout(timerExpired, wait); // Invoke the leading edge.

    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;
    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime; // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.

    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    } // Restart the timer.


    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined; // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }

      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */


function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */


function isObjectLike(value) {
  return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */


function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */


function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  if (isSymbol(value)) {
    return NAN;
  }

  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }

  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }

  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

var lodash_debounce = debounce;

function blurImage(img, canvas, w, h, radius, includeAlphaChannel) {
  var mulTable = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259],
      shgTable = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];

  if (typeof img === 'string') {
    img = document.getElementById(img);
  }

  if (typeof canvas === 'string') {
    canvas = document.getElementById(canvas);
  }

  radius = radius ? radius : 10; // canvas.style.width  = w + "px";
  // canvas.style.height = h + "px";

  canvas.width = w;
  canvas.height = h;
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, w, h);
  context.drawImage(img, 0, 0);
  if (isNaN(radius) || radius < 1) return;

  var BlurStack = function BlurStack() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
  };

  var stackBlurCanvasRGB = function stackBlurCanvasRGB(context, topX, topY, width, height, radius, includeAlphaChannel) {
    radius |= 0;
    var imageData;

    try {
      imageData = context.getImageData(topX, topY, width, height);
    } catch (e) {
      throw new Error('unable to access image data: ' + e);
    }

    var pixels = imageData.data;
    var x, y, i, p, yp, yi, yw, rSum, gSum, bSum, aSum, rOutSum, gOutSum, bOutSum, aOutSum, rInSum, gInSum, bInSum, aInSum, pr, pg, pb, pa, rbs;
    var div = radius + radius + 1,
        widthMinus1 = width - 1,
        heightMinus1 = height - 1,
        radiusPlus1 = radius + 1,
        sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2,
        stackEnd;
    var stackStart = new BlurStack();
    var stack = stackStart;

    for (i = 1; i < div; i++) {
      stack = stack.next = new BlurStack();
      if (i == radiusPlus1) stackEnd = stack;
    }

    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;
    yw = yi = 0;
    var mulSum = mulTable[radius];
    var shgSum = shgTable[radius];

    for (y = 0; y < height; y++) {
      rInSum = gInSum = bInSum = aInSum = rSum = gSum = bSum = aSum = 0;
      rOutSum = radiusPlus1 * (pr = pixels[yi]);
      gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
      bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
      if (includeAlphaChannel) aOutSum = radiusPlus1 * (pa = pixels[yi + 3]);
      rSum += sumFactor * pr;
      gSum += sumFactor * pg;
      bSum += sumFactor * pb;
      if (includeAlphaChannel) aSum += sumFactor * pa;
      stack = stackStart;

      for (i = 0; i < radiusPlus1; i++) {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        if (includeAlphaChannel) stack.a = pa;
        stack = stack.next;
      }

      for (i = 1; i < radiusPlus1; i++) {
        p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
        rSum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
        gSum += (stack.g = pg = pixels[p + 1]) * rbs;
        bSum += (stack.b = pb = pixels[p + 2]) * rbs;
        if (includeAlphaChannel) aSum += (stack.a = pa = pixels[p + 3]) * rbs;
        rInSum += pr;
        gInSum += pg;
        bInSum += pb;
        if (includeAlphaChannel) aInSum += pa;
        stack = stack.next;
      }

      stackIn = stackStart;
      stackOut = stackEnd;

      for (x = 0; x < width; x++) {
        if (includeAlphaChannel) {
          pixels[yi + 3] = pa = aSum * mulSum >> shgSum;

          if (pa != 0) {
            pa = 255 / pa;
            pixels[yi] = (rSum * mulSum >> shgSum) * pa;
            pixels[yi + 1] = (gSum * mulSum >> shgSum) * pa;
            pixels[yi + 2] = (bSum * mulSum >> shgSum) * pa;
          } else {
            pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
          }
        } else {
          pixels[yi] = rSum * mulSum >> shgSum;
          pixels[yi + 1] = gSum * mulSum >> shgSum;
          pixels[yi + 2] = bSum * mulSum >> shgSum;
        }

        rSum -= rOutSum;
        gSum -= gOutSum;
        bSum -= bOutSum;
        if (includeAlphaChannel) aSum -= aOutSum;
        rOutSum -= stackIn.r;
        gOutSum -= stackIn.g;
        bOutSum -= stackIn.b;
        if (includeAlphaChannel) aOutSum -= stackIn.a;
        p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
        rInSum += stackIn.r = pixels[p];
        gInSum += stackIn.g = pixels[p + 1];
        bInSum += stackIn.b = pixels[p + 2];
        if (includeAlphaChannel) aInSum += stackIn.a = pixels[p + 3];
        rSum += rInSum;
        gSum += gInSum;
        bSum += bInSum;
        if (includeAlphaChannel) aSum += aInSum;
        stackIn = stackIn.next;
        rOutSum += pr = stackOut.r;
        gOutSum += pg = stackOut.g;
        bOutSum += pb = stackOut.b;
        if (includeAlphaChannel) aOutSum += pa = stackOut.a;
        rInSum -= pr;
        gInSum -= pg;
        bInSum -= pb;
        if (includeAlphaChannel) aInSum -= pa;
        stackOut = stackOut.next;
        yi += 4;
      }

      yw += width;
    }

    for (x = 0; x < width; x++) {
      gInSum = bInSum = aInSum = rInSum = gSum = bSum = aSum = rSum = 0;
      yi = x << 2;
      rOutSum = radiusPlus1 * (pr = pixels[yi]);
      gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
      bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
      if (includeAlphaChannel) aOutSum = radiusPlus1 * (pa = pixels[yi + 3]);
      rSum += sumFactor * pr;
      gSum += sumFactor * pg;
      bSum += sumFactor * pb;
      if (includeAlphaChannel) aSum += sumFactor * pa;
      stack = stackStart;

      for (i = 0; i < radiusPlus1; i++) {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        if (includeAlphaChannel) stack.a = pa;
        stack = stack.next;
      }

      yp = width;

      for (i = 1; i <= radius; i++) {
        yi = yp + x << 2;
        rSum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
        gSum += (stack.g = pg = pixels[yi + 1]) * rbs;
        bSum += (stack.b = pb = pixels[yi + 2]) * rbs;
        if (includeAlphaChannel) aSum += (stack.a = pa = pixels[yi + 3]) * rbs;
        rInSum += pr;
        gInSum += pg;
        bInSum += pb;
        if (includeAlphaChannel) aInSum += pa;
        stack = stack.next;

        if (i < heightMinus1) {
          yp += width;
        }
      }

      yi = x;
      stackIn = stackStart;
      stackOut = stackEnd;

      for (y = 0; y < height; y++) {
        p = yi << 2;

        if (includeAlphaChannel) {
          pixels[p + 3] = pa = aSum * mulSum >> shgSum;

          if (pa > 0) {
            pa = 255 / pa;
            pixels[p] = (rSum * mulSum >> shgSum) * pa;
            pixels[p + 1] = (gSum * mulSum >> shgSum) * pa;
            pixels[p + 2] = (bSum * mulSum >> shgSum) * pa;
          } else {
            pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
          }
        } else {
          pixels[p] = rSum * mulSum >> shgSum;
          pixels[p + 1] = gSum * mulSum >> shgSum;
          pixels[p + 2] = bSum * mulSum >> shgSum;
        }

        rSum -= rOutSum;
        gSum -= gOutSum;
        bSum -= bOutSum;
        if (includeAlphaChannel) aSum -= aOutSum;
        rOutSum -= stackIn.r;
        gOutSum -= stackIn.g;
        bOutSum -= stackIn.b;
        if (includeAlphaChannel) aOutSum -= stackIn.a;
        p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
        rSum += rInSum += stackIn.r = pixels[p];
        gSum += gInSum += stackIn.g = pixels[p + 1];
        bSum += bInSum += stackIn.b = pixels[p + 2];
        if (includeAlphaChannel) aSum += aInSum += stackIn.a = pixels[p + 3];
        stackIn = stackIn.next;
        rOutSum += pr = stackOut.r;
        gOutSum += pg = stackOut.g;
        bOutSum += pb = stackOut.b;
        if (includeAlphaChannel) aOutSum += pa = stackOut.a;
        rInSum -= pr;
        gInSum -= pg;
        bInSum -= pb;
        if (includeAlphaChannel) aInSum -= pa;
        stackOut = stackOut.next;
        yi += width;
      }
    }

    context.putImageData(imageData, topX, topY);
  };

  stackBlurCanvasRGB(context, 0, 0, w, h, radius, includeAlphaChannel);
}

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".nprogressive-image-item {\n  position: relative;\n  z-index: 10;\n}\n\n.nprogressive-image {\n  display: none;\n}\n\n.nprogressive-image-item > canvas {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 11;\n  visibility: visible;\n  opacity: 1;\n  -webkit-transition: all 0.1s ease 0.4s;\n  transition: all 0.1s ease 0.4s;\n}\n.nprogressive-source-image {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 12;\n  visibility: hidden;\n  opacity: 0;\n  -webkit-transition: all 0.4s ease;\n  transition: all 0.4s ease;\n}\n.nprogressive-image-item.is--loaded .nprogressive-source-image {\n  visibility: visible;\n  opacity: 1;\n}\n.nprogressive-image-item.is--loaded > canvas {\n  visibility: hidden;\n  opacity: 0;\n}\n";
styleInject(css);

var defaultOption = {
  container: '',
  items: '',
  offsetTop: 10,
  blurRadius: 10,
  widthAttr: 'data-width',
  heightAttr: 'data-height'
};

function isInViewport(el) {
  var rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}

var NProgressiveImage =
/*#__PURE__*/
function () {
  function NProgressiveImage(option) {
    if (!option.container) {
      throw new Error('container need to be set!');
    }

    if (typeof option.container === 'string') {
      this.container = document.querySelector(option.container);
    } else {
      this.container = option.container;
    }

    if (option.items && Array.isArray(option.items)) {
      this.items = option.items;
    } else if (option.items && typeof option.items === 'string') {
      this.items = this.container.querySelectorAll(option.items);
    } else {
      this.items = this.container.querySelectorAll('img');
    }

    this.option = Object.assign({}, defaultOption, option);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.init();
    this.attachEvents(); // for first check

    this.loadItems();
  }

  var _proto = NProgressiveImage.prototype;

  _proto.init = function init() {
    //
    var items = [];
    var rect = this.container.getBoundingClientRect();
    var len = this.items.length;

    for (var i = 0; i < len; i++) {
      var item = this.items[i];
      var wrapperObj = this.createItemTemplate(item);

      var _this$setDimension = this.setDimension(wrapperObj, item, rect.width),
          w = _this$setDimension.w,
          h = _this$setDimension.h; //blur image


      blurImage(item, wrapperObj.canvas, parseInt(w / 10), parseInt(h / 10), this.option.blurRadius);
      items.push({
        el: wrapperObj.div,
        src: item.getAttribute('data-src'),
        isLoaded: false,
        isError: false
      });
    }

    this.items = items;
  };

  _proto.createItemTemplate = function createItemTemplate(item) {
    var div = document.createElement('div');
    div.classList.add('nprogressive-image-item');
    var canvas = document.createElement('canvas');
    item.parentNode.replaceChild(div, item);
    div.appendChild(item);
    div.appendChild(canvas);
    return {
      div: div,
      canvas: canvas
    };
  };

  _proto.setDimension = function setDimension(wrapperObj, item, width) {
    var originalWidth = parseInt(item.getAttribute('data-width'), 10) || 0;
    var originalHeight = parseInt(item.getAttribute('data-height'), 10) || 0;
    var w = originalWidth;
    var h = originalHeight;

    if (originalWidth >= width) {
      w = width;
      h = parseInt(originalHeight * w / originalWidth);
    }

    wrapperObj.div.style.width = w + 'px';
    wrapperObj.div.style.height = h + 'px';
    wrapperObj.canvas.width = parseInt(w / 10);
    wrapperObj.canvas.height = parseInt(h / 10);
    return {
      w: w,
      h: h
    };
  };

  _proto.attachEvents = function attachEvents() {
    window.addEventListener('scroll', this.handleScroll, false);
    window.addEventListener('resize', this.handleResize, false);
  };

  _proto.handleScroll = function handleScroll() {
    this.loadItems();
  };

  _proto.handleResize = function handleResize() {
    this.loadItems();
  };

  _proto.loadItems = function loadItems() {
    var items = this.items;

    for (var i = 0, len = items.length; i < len; i++) {
      if (!items[i].isLoaded && !items[i].isError) {
        if (isInViewport(items[i].el)) {
          // here load origin image
          this.loadImage(items[i]);
        }
      }
    }
  };

  _proto.loadImage = function loadImage(item) {
    item.el.classList.add('is--loading');
    var img = new Image();

    img.onload = function () {
      img.classList.add('nprogressive-source-image');
      item.isLoaded = true;
      item.el.appendChild(img);
      item.el.classList.add('is--loaded');
    };

    img.onerror = function () {
      item.isError = true;
    };

    img.src = item.src;
  };

  _proto.destroy = function destroy() {
    window.addEventListener('scroll', lodash_debounce(this.handleScroll, 250), false);
    window.addEventListener('resize', lodash_debounce(this.handleResize, 250), false);
  };

  return NProgressiveImage;
}();

export default NProgressiveImage;
