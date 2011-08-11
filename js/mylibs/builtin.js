// Fix very old releases of IE6 to properly support the undefined keyword
window["undefined"] = window.undefined;

// Patch definitions form standard DOM constants if missing. IE6/7 needs them.
if (typeof Node == "undefined") {
	window.Node = {
		ELEMENT_NODE: 1,
		TEXT_NODE:2,
		DOCUMENT_NODE:9,
		COMMENT_NODE:8,
		DOCUMENT_FRAGMENT_NODE:11,
		ATTRIBUTE_NODE:2
	};
};


 /**
  * Array support function
  * http://hexmen.com/blog/2006/12/push-and-pop/ 
  */
 Array.prototype.__push = function() {
    var n = this.length >>> 0;
    for (var i = 0; i < arguments.length; i++) {
        this[n] = arguments[i];
        n = n + 1 >>> 0;
    }
    this.length = n;
    return n;
};

/**
 * Array support function
 * http://hexmen.com/blog/2006/12/push-and-pop/ 
 */
Array.prototype.__pop = function() {
    var n = this.length >>> 0, value;
    if (n) {
        value = this[--n];
        delete this[n];
    }
    this.length = n;
    return value;
};

/**
 * http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf
 * @param {Object} elt
 * @param {Object}  from
 * @return zero based index, or -1 if not found
 */
Array.prototype.__indexOf = function(elt /*, from*/) {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)? Math.ceil(from) : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++) {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
};

/**
 * http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:lastIndexOf
 * @param {Object} elt
 * @param {Object}  [from]
 * @return zero based index, or -1 if not found
 */
Array.prototype.__lastIndexOf = function(elt /*, from*/)
{
    var len = this.length;

    var from = Number(arguments[1]);
    if (isNaN(from))    {
      from = len - 1;
    }
    else
    {
      from = (from < 0)? Math.ceil(from) : Math.floor(from);
      if (from < 0)
        from += len;
      else if (from >= len)
        from = len - 1;
    }

    for (; from > -1; from--) {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
};

/**
 * Production steps of ECMA-262, Edition 5, 15.4.4.18
 */
Array.prototype.__forEach = function( callbackfn, thisArg ) {

  var T,
    O = Object(this),
    len = O.length >>> 0,
    k = 0;
  
  // If no callback function or if callback is not a callable function
  if ( !callbackfn || !callbackfn.call ) {
    throw new TypeError();
  }

  // If the optional thisArg context param was provided,
  // Set as this context 
  if ( thisArg ) {
    T = thisArg;
  }

  while( k < len ) {
  
    // Store property key string object reference
    var Pk = String( k ),
      // Determine if property key is present in this object context
      kPresent = O.hasOwnProperty( Pk ),
      kValue;

    if ( kPresent ) {
      // Dereference and store the value of this Property key
      kValue = O[ Pk ];

      // Invoke the callback function with call, passing arguments:
      // context, property value, property key, thisArg object context
      callbackfn.call( T, kValue, k, O );
    }

    k++;
  }
};

Array.__contains = function(value) {
  for(var i=0,e; e = this[i]; ++i) if (e == value) return true;
  return false;
};

/* add support where needed */
if (!Array.prototype.push) Array.prototype.push = Array.prototype.__push;
if (!Array.prototype.pop) Array.prototype.pop = Array.prototype.__pop;
if (!Array.prototype.indexOf) Array.prototype.indexOf = Array.prototype.__indexOf;
if (!Array.prototype.lastIndexOf) Array.prototype.lastIndexOf = Array.prototype.__lastIndexOf;
if (!Array.prototype.forEach) Array.prototype.forEach = Array.prototype.__forEach;


Element.prototype.hasClassName = function(name) {
  return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function(name) {
  if (!this.hasClassName(name)) {
    this.className = this.className ? [this.className, name].join(' ') : name;
  }
};

Element.prototype.removeClassName = function(name) {
  if (this.hasClassName(name)) {
    var c = this.className;
    this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
  }
};

