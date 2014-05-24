;(function(){
// POLVO :: HELPERS
(function(e){if("function"==typeof bootstrap)bootstrap("jade",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeJade=e}else"undefined"!=typeof window?window.jade=e():global.jade=e()})(function(){var define,ses,bootstrap,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 * @api private
 */

function joinClasses(val) {
  return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val;
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key) {
        if (escaped && escaped[key]){
          if (val = exports.escape(joinClasses(val))) {
            buf.push(key + '="' + val + '"');
          }
        } else {
          if (val = joinClasses(val)) {
            buf.push(key + '="' + val + '"');
          }
        }
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str =  str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(require,module,exports){
// nothing to see here... no file methods for the browser

},{}]},{},[1])(1)
});
;
// POLVO :: LOADER
function require(path, parent){
  var realpath = require.resolve(path, parent),
      m = require.mods[realpath];

  if(!m.init){
    m.factory.call(this, require.local(realpath), m.module, m.module.exports);
    m.init = true;
  }

  return m.module.exports;
}

require.mods = {}

require.local = function( path ){
  var r = function( id ){ return require( id, path ); }
  r.resolve = function( id ){ return require.resolve( id, path ); }
  return r;
}

require.register = function(path, mod, aliases){
  require.mods[path] = {
    factory: mod,
    aliases: aliases,
    module: {exports:{}}
  };
}

require.aliases = {"theoricus":"vendors/theoricus/www/src/theoricus","dancer":"vendors/dancer/dancer.js","app":"src/app","templates":"src/templates","jquery_spritefy":"vendors/jquery/jquery.spritefy.js","sketch":"vendors/sketch/sketch.js","requestAnim":"vendors/utils/requestAnim.js","draw":"src/app/lib/draw"};
require.alias = function(path){
  for(var alias in require.aliases)
    if(path.indexOf(alias) == 0)
      return require.aliases[alias] + path.match(/\/(.+)/)[0];
  return null;
}


require.resolve = function(path, parent){
  var realpath;

  if(parent){
    if(!(realpath = require.mods[parent].aliases[path]))
      realpath = require.alias( path );
  }
  else
    realpath = path;

  if(!require.mods[realpath])
      throw new Error('Module not found: ' + path);

  return realpath;
}

window.require = require;
// POLVO :: MERGED FILES
require.register('src/app/app', function(require, module, exports){
var App, Routes, Settings, Theoricus,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Theoricus = require('theoricus/theoricus');

Settings = require('app/config/settings');

Routes = require('app/config/routes');

module.exports = App = (function(_super) {
  __extends(App, _super);

  function App(Settings, Routes) {
    App.__super__.constructor.call(this, Settings, Routes);
    this.start();
  }

  return App;

})(Theoricus);

new App(Settings, Routes);

}, {"theoricus/theoricus":"vendors/theoricus/www/src/theoricus/theoricus","app/config/settings":"src/app/config/settings","app/config/routes":"src/app/config/routes"});
require.register('src/app/config/routes', function(require, module, exports){
var Routes;

module.exports = Routes = (function() {
  function Routes() {}

  Routes.routes = {
    '/pages': {
      to: "pages/index",
      at: null,
      el: "body"
    },
    '/strings': {
      lab: true,
      to: "strings/index",
      at: "/pages",
      el: "#container"
    },
    '/hole': {
      lab: true,
      to: "hole/index",
      at: "/pages",
      el: "#container"
    },
    '/magnets': {
      lab: true,
      to: "magnets/index",
      at: "/pages",
      el: "#container"
    },
    '/attract': {
      lab: true,
      to: "attract/index",
      at: "/pages",
      el: "#container"
    },
    '/repulse': {
      lab: true,
      to: "repulse/index",
      at: "/pages",
      el: "#container"
    },
    '/404': {
      to: "pages/notfound",
      at: "/pages",
      el: "#container"
    }
  };

  Routes.root = '/pages';

  Routes.notfound = '/404';

  return Routes;

})();

}, {});
require.register('src/app/config/settings', function(require, module, exports){
var Settings;

module.exports = Settings = (function() {
  function Settings() {}

  Settings.animate_at_startup = false;

  Settings.enable_auto_transitions = true;

  Settings.autobind = false;

  return Settings;

})();

}, {});
require.register('src/app/config/vendors', function(require, module, exports){
require('jquery_spritefy');

require("sketch");

require("requestAnim");

require("requestAnim");

require("dancer");

}, {"jquery_spritefy":"vendors/jquery/jquery.spritefy","sketch":"vendors/sketch/sketch","requestAnim":"vendors/utils/requestAnim","dancer":"vendors/dancer/dancer"});
require.register('src/app/controllers/app_controller', function(require, module, exports){
var AppController, Controller, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controller = require('theoricus/mvc/controller');

module.exports = AppController = (function(_super) {
  __extends(AppController, _super);

  function AppController() {
    _ref = AppController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return AppController;

})(Controller);

}, {"theoricus/mvc/controller":"vendors/theoricus/www/src/theoricus/mvc/controller"});
require.register('src/app/controllers/attract', function(require, module, exports){
var AppController, Attract, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppController = require('app/controllers/app_controller');

Attract = require('app/models/attract');

module.exports = Attract = (function(_super) {
  __extends(Attract, _super);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    DEFAULT ACTION BEHAVIOR
    Override it to take control and customize as you wish
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    EXAMPLES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  function Attract() {
    _ref = Attract.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Attract;

})(AppController);

}, {"app/controllers/app_controller":"src/app/controllers/app_controller","app/models/attract":"src/app/models/attract"});
require.register('src/app/controllers/hole', function(require, module, exports){
var AppController, Hole, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppController = require('app/controllers/app_controller');

module.exports = Hole = (function(_super) {
  __extends(Hole, _super);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    DEFAULT ACTION BEHAVIOR
    Override it to take control and customize as you wish
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    EXAMPLES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  function Hole() {
    _ref = Hole.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Hole;

})(AppController);

}, {"app/controllers/app_controller":"src/app/controllers/app_controller"});
require.register('src/app/controllers/magnets', function(require, module, exports){
var AppController, Magnet, Magnets, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppController = require('app/controllers/app_controller');

Magnet = require('app/models/magnet');

module.exports = Magnets = (function(_super) {
  __extends(Magnets, _super);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    DEFAULT ACTION BEHAVIOR
    Override it to take control and customize as you wish
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    EXAMPLES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  function Magnets() {
    _ref = Magnets.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Magnets;

})(AppController);

}, {"app/controllers/app_controller":"src/app/controllers/app_controller","app/models/magnet":"src/app/models/magnet"});
require.register('src/app/controllers/pages', function(require, module, exports){
var AppController, Page, Pages,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppController = require('app/controllers/app_controller');

Page = require('app/models/page');

module.exports = Pages = (function(_super) {
  __extends(Pages, _super);

  function Pages() {}

  Pages.prototype.collisions = function() {
    return this.render("circles/collisions");
  };

  Pages.prototype.circular_motion = function() {
    return this.render("circles/circular_motion");
  };

  return Pages;

})(AppController);

}, {"app/controllers/app_controller":"src/app/controllers/app_controller","app/models/page":"src/app/models/page"});
require.register('src/app/controllers/repulse', function(require, module, exports){
var AppController, Vector, Vectors, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppController = require('app/controllers/app_controller');

Vector = require('app/models/repulse');

module.exports = Vectors = (function(_super) {
  __extends(Vectors, _super);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    DEFAULT ACTION BEHAVIOR
    Override it to take control and customize as you wish
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    EXAMPLES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  function Vectors() {
    _ref = Vectors.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Vectors;

})(AppController);

}, {"app/controllers/app_controller":"src/app/controllers/app_controller","app/models/repulse":"src/app/models/repulse"});
require.register('src/app/controllers/strings', function(require, module, exports){
var AppController, String, Strings, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppController = require('app/controllers/app_controller');

String = require('app/models/string');

module.exports = Strings = (function(_super) {
  __extends(Strings, _super);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    DEFAULT ACTION BEHAVIOR
    Override it to take control and customize as you wish
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    EXAMPLES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  function Strings() {
    _ref = Strings.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Strings;

})(AppController);

}, {"app/controllers/app_controller":"src/app/controllers/app_controller","app/models/string":"src/app/models/string"});
require.register('src/app/lib/draw/draw', function(require, module, exports){
var Draw;

module.exports = Draw = (function() {
  function Draw() {}

  Draw.CTX = null;

  return Draw;

})();

}, {});
require.register('src/app/lib/draw/geom/circle', function(require, module, exports){
var Circle, Draw;

Draw = require("../draw");

module.exports = Circle = (function() {
  Circle.prototype.radius = 0;

  Circle.prototype.fill = "#ff0000";

  Circle.prototype.opacity = 1;

  Circle.prototype.stroke = "#000000";

  Circle.prototype.x = 0;

  Circle.prototype.y = 0;

  function Circle(radius, fill, stroke, strokeWidth) {
    this.radius = radius;
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth != null ? strokeWidth : 1;
  }

  Circle.prototype.draw = function(ctx) {
    this.ctx = ctx;
    if (!this.ctx) {
      this.ctx = Draw.CTX;
    }
    this.ctx.globalAlpha = this.opacity;
    this.ctx.fillStyle = this.fill;
    if (this.stroke) {
      this.ctx.lineWidth = this.strokeWidth;
    }
    if (this.stroke) {
      this.ctx.strokeStyle = this.stroke;
    }
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fill();
    if (this.stroke) {
      this.ctx.stroke();
    }
    return this.ctx.globalAlpha = 1;
  };

  return Circle;

})();

}, {"../draw":"src/app/lib/draw/draw"});
require.register('src/app/lib/draw/geom/vector', function(require, module, exports){
var Calc, Vector;

Calc = require("../math/calc");

module.exports = Vector = (function() {
  Vector.prototype._x = 0;

  Vector.prototype._y = 0;

  function Vector(_x, _y) {
    this._x = _x;
    this._y = _y;
    Object.defineProperties(this, {
      "x": {
        get: function() {
          return this._x;
        },
        set: function(val) {
          return this._x = val;
        }
      },
      "y": {
        get: function() {
          return this._y;
        },
        set: function(val) {
          return this._y = val;
        }
      }
    });
  }

  Vector.prototype.add = function(vector) {
    this.x += vector.x;
    return this.y += vector.y;
  };

  Vector.add = function(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v1.y);
  };

  Vector.prototype.sub = function(vector) {
    this.x -= vector.x;
    return this.y -= vector.y;
  };

  Vector.sub = function(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  };

  Vector.prototype.mult = function(n) {
    this.x *= n;
    return this.y *= n;
  };

  Vector.mult = function(n) {
    return new Vector(this.x * n, this.y * n);
  };

  Vector.prototype.div = function(n) {
    this.x /= n;
    return this.y /= n;
  };

  Vector.div = function(n) {
    return new Vector(this.x / n, this.y / n);
  };

  Vector.prototype.mag = function() {};

  Vector.prototype.norm = function() {
    var m;
    m = this.mag();
    return this.div(m);
  };

  Vector.prototype.limit = function(n) {
    if (this.mag() > n) {
      this.norm();
      return this.mult(n);
    }
  };

  Vector.rnd = function() {
    return new Vector(Math.random(), Math.random());
  };

  return Vector;

})();

}, {"../math/calc":"src/app/lib/draw/math/calc"});
require.register('src/app/lib/draw/math/calc', function(require, module, exports){
var Calc;

module.exports = Calc = (function() {
  function Calc() {}

  Calc.rnd2d = function() {
    var x, y;
    x = Math.random();
    y = Math.random();
    return {
      x: x,
      y: y
    };
  };

  Calc.dist = function(x1, y1, x2, y2) {
    var dx, dy;
    dx = x1 - x2;
    dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  };

  Calc.ang = function(x1, y1, x2, y2) {
    var angle;
    return angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  };

  Calc.deg2rad = function(deg) {
    return deg * Math.PI / 180;
  };

  Calc.rad2deg = function(rad) {
    return rad * 180 / Math.PI;
  };

  return Calc;

})();

}, {});
require.register('src/app/models/app_model', function(require, module, exports){
var AppModel, Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('theoricus/mvc/model');

module.exports = AppModel = (function(_super) {
  __extends(AppModel, _super);

  function AppModel() {
    _ref = AppModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return AppModel;

})(Model);

}, {"theoricus/mvc/model":"vendors/theoricus/www/src/theoricus/mvc/model"});
require.register('src/app/models/attract', function(require, module, exports){
var AppModel, Attract, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppModel = require('app/models/app_model');

module.exports = Attract = (function(_super) {
  __extends(Attract, _super);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    MODEL PROPERTIES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RESTFULL JSON SPECIFICATION
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  function Attract() {
    _ref = Attract.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Attract;

})(AppModel);

}, {"app/models/app_model":"src/app/models/app_model"});
require.register('src/app/models/hole', function(require, module, exports){
var AppModel, Hole, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppModel = require('app/models/app_model');

module.exports = Hole = (function(_super) {
  __extends(Hole, _super);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    MODEL PROPERTIES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RESTFULL JSON SPECIFICATION
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  function Hole() {
    _ref = Hole.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Hole;

})(AppModel);

}, {"app/models/app_model":"src/app/models/app_model"});
require.register('src/app/models/magnet', function(require, module, exports){
var AppModel, Magnet, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppModel = require('app/models/app_model');

module.exports = Magnet = (function(_super) {
  __extends(Magnet, _super);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    MODEL PROPERTIES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RESTFULL JSON SPECIFICATION
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  function Magnet() {
    _ref = Magnet.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Magnet;

})(AppModel);

}, {"app/models/app_model":"src/app/models/app_model"});
require.register('src/app/models/page', function(require, module, exports){
var AppModel, Page, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppModel = require('app/models/app_model');

module.exports = Page = (function(_super) {
  __extends(Page, _super);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    MODEL PROPERTIES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RESTFULL JSON SPECIFICATION
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  function Page() {
    _ref = Page.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Page;

})(AppModel);

}, {"app/models/app_model":"src/app/models/app_model"});
require.register('src/app/models/repulse', function(require, module, exports){
var AppModel, Vector, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppModel = require('app/models/app_model');

module.exports = Vector = (function(_super) {
  __extends(Vector, _super);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    MODEL PROPERTIES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RESTFULL JSON SPECIFICATION
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  function Vector() {
    _ref = Vector.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Vector;

})(AppModel);

}, {"app/models/app_model":"src/app/models/app_model"});
require.register('src/app/models/string', function(require, module, exports){
var AppModel, String, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppModel = require('app/models/app_model');

module.exports = String = (function(_super) {
  __extends(String, _super);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    MODEL PROPERTIES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RESTFULL JSON SPECIFICATION
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */


  function String() {
    _ref = String.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return String;

})(AppModel);

}, {"app/models/app_model":"src/app/models/app_model"});
require.register('src/app/views/app_view', function(require, module, exports){
var AppView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('theoricus/mvc/view');

require('app/config/vendors');

module.exports = AppView = (function(_super) {
  __extends(AppView, _super);

  function AppView() {
    _ref = AppView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AppView.prototype.set_triggers = function() {
    var _this = this;
    AppView.__super__.set_triggers.call(this);
    return this.el.find('a[href*="/"]').each(function(index, item) {
      return $(item).click(function(event) {
        _this.navigate($(event.delegateTarget).attr('href'));
        return false;
      });
    });
  };

  return AppView;

})(View);

}, {"theoricus/mvc/view":"vendors/theoricus/www/src/theoricus/mvc/view","app/config/vendors":"src/app/config/vendors"});
require.register('src/app/views/attract/ball', function(require, module, exports){
var Ball, Circle, Draw,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Circle = require("draw/geom/circle");

Draw = require("draw/draw");

module.exports = Ball = (function(_super) {
  __extends(Ball, _super);

  Ball.prototype.x = 0;

  Ball.prototype.y = 0;

  Ball.prototype.mass = 0;

  Ball.prototype.vx = 0;

  Ball.prototype.vy = 0;

  Ball.prototype.ax = 0;

  Ball.prototype.ay = 0;

  Ball.prototype.speed = 1;

  Ball.prototype.spring = 0.9;

  Ball.prototype.MAX_SPEED = 50;

  function Ball() {
    Ball.__super__.constructor.apply(this, arguments);
    this.mass = this.radius;
  }

  Ball.prototype.apply_force = function(fx, fy) {
    fx /= this.mass;
    fy /= this.mass;
    this.ax += fx;
    return this.ay += fy;
  };

  Ball.prototype.update = function() {
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;
    this.ax = 0;
    return this.ay = 0;
  };

  Ball.prototype.draw = function() {
    return Ball.__super__.draw.apply(this, arguments);
  };

  return Ball;

})(Circle);

}, {"draw/geom/circle":"src/app/lib/draw/geom/circle","draw/draw":"src/app/lib/draw/draw"});
require.register('src/app/views/attract/index', function(require, module, exports){
var AppView, Ball, Calc, Draw, Index, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppView = require('app/views/app_view');

Draw = require("draw/draw");

Calc = require("draw/math/calc");

Ball = require("./ball");

module.exports = Index = (function(_super) {
  var NUM_BALLS;

  __extends(Index, _super);

  function Index() {
    this.after_render = __bind(this.after_render, this);
    this.destroy = __bind(this.destroy, this);
    _ref = Index.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  NUM_BALLS = 200;

  Index.prototype.ball = null;

  Index.prototype.target = null;

  Index.prototype.balls = [];

  Index.prototype.center = null;

  Index.prototype.destroy = function() {
    this.ctx.clear();
    this.ctx.destroy();
    return Index.__super__.destroy.apply(this, arguments);
  };

  Index.prototype.after_render = function() {
    var dir, s;
    s = this;
    dir = {};
    this.balls = [];
    if (this.ctx) {
      this.ctx.clear();
      this.ctx.destroy();
    }
    return this.ctx = window.Sketch.create({
      container: this.el.get(0),
      autoclear: false,
      setup: function() {
        var ball, i, radius, _results;
        Draw.CTX = $(".sketch").get(0).getContext("2d");
        Draw.CTX.fillStyle = "rgba(0,0,0,1)";
        Draw.CTX.fillRect(0, 0, this.width, this.height);
        i = 0;
        _results = [];
        while (i < NUM_BALLS) {
          radius = 5;
          ball = new Ball(radius, "#fff", "#000");
          ball.speed = 0.1;
          ball.x = (this.width / 2) + (-(Math.random() * this.width) + (Math.random() * this.width));
          ball.y = (this.height / 2) + (-(Math.random() * this.height) + (Math.random() * this.height));
          ball.z = Math.random() * radius;
          s.balls.push(ball);
          _results.push(i++);
        }
        return _results;
      },
      update: function() {
        var ang, b, dist, fx, fy, i, mouse, rad, _i, _len, _ref1, _results;
        mouse = this.mouse;
        if (mouse.x === 0) {
          mouse.x = this.width / 2;
        }
        if (mouse.y === 0) {
          mouse.y = this.height / 2;
        }
        _ref1 = s.balls;
        _results = [];
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          b = _ref1[i];
          ang = Calc.ang(b.x, b.y, mouse.x, mouse.y);
          rad = Calc.deg2rad(ang);
          dist = Calc.dist(b.x, b.y, mouse.x, mouse.y);
          fx = (Math.cos(rad)) * 10;
          fy = (Math.sin(rad)) * 10;
          if (s.down) {
            fx *= -1;
            fy *= -1;
          } else if (dist < 50) {
            fx *= -1;
            fx *= 10;
            fy *= -1;
            fy *= 5;
          }
          if (Math.abs(b.vx) > 50) {
            b.vx *= 0.9;
          }
          if (Math.abs(b.vy) > 50) {
            b.vy *= 0.9;
          }
          b.apply_force(fx, fy);
          _results.push(b.update());
        }
        return _results;
      },
      draw: function() {
        var b, i, _i, _len, _ref1, _results;
        Draw.CTX.fillStyle = "rgba(0,0,0,0.08)";
        Draw.CTX.fillRect(0, 0, this.width, this.height);
        _ref1 = s.balls;
        _results = [];
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          b = _ref1[i];
          _results.push(b.draw());
        }
        return _results;
      },
      mousedown: function() {
        return s.down = true;
      },
      mouseup: function() {
        return s.down = false;
      }
    });
  };

  return Index;

})(AppView);

}, {"app/views/app_view":"src/app/views/app_view","draw/draw":"src/app/lib/draw/draw","draw/math/calc":"src/app/lib/draw/math/calc","./ball":"src/app/views/attract/ball"});
require.register('src/app/views/hole/index', function(require, module, exports){
var AppView, Draw, Index, Pivot, System, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppView = require('app/views/app_view');

System = require("./system");

Draw = require("draw/draw");

Pivot = require("./pivot");

module.exports = Index = (function(_super) {
  __extends(Index, _super);

  function Index() {
    this.after_render = __bind(this.after_render, this);
    this.destroy = __bind(this.destroy, this);
    _ref = Index.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Index.prototype.destroy = function() {
    this.ctx.clear();
    this.ctx.destroy();
    return Index.__super__.destroy.apply(this, arguments);
  };

  Index.prototype.after_render = function() {
    return this.ctx = window.Sketch.create({
      systems: [],
      system: {},
      pivot: {},
      container: this.el.get(0),
      autoclear: true,
      setup: function() {
        var target;
        Draw.CTX = $(".sketch").get(0).getContext("2d");
        target = {
          x: this.width / 2,
          y: this.height / 2
        };
        this.pivot = new Pivot(target);
        return this.count = 20;
      },
      mousemove: function() {
        return this.pivot.target = this.mouse;
      },
      update: function() {
        var i, p, s, speed;
        this.pivot.update();
        if (this.systems.length < 30) {
          i = this.systems.length;
          p = this.pivot;
          if (this.systems.length > 0) {
            p = this.systems[i - 1].pivot;
            speed = p.speed;
          }
          s = new System({
            x: this.pivot.x,
            y: this.pivot.y,
            follows: p,
            rad: this.count
          });
          s.mag += 0.5;
          s.setup();
          this.systems.push(s);
          return this.count += 10;
        }
      },
      draw: function() {
        var i, s, _results;
        this.pivot.draw();
        i = this.systems.length - 1;
        _results = [];
        while (i >= 0) {
          s = this.systems[i];
          s.run();
          _results.push(i--);
        }
        return _results;
      }
    });
  };

  return Index;

})(AppView);

}, {"app/views/app_view":"src/app/views/app_view","./system":"src/app/views/hole/system","draw/draw":"src/app/lib/draw/draw","./pivot":"src/app/views/hole/pivot"});
require.register('src/app/views/hole/particle', function(require, module, exports){
var Calc, Circle, Draw, Particle,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Circle = require("draw/geom/circle");

Draw = require("draw/draw");

Calc = require("draw/math/calc");

module.exports = Particle = (function(_super) {
  __extends(Particle, _super);

  Particle.prototype.dx = 0;

  Particle.prototype.dy = 0;

  Particle.prototype.mag = 1;

  Particle.prototype.dist = 0;

  Particle.prototype.pivot = {};

  function Particle(pivot, dx, dy) {
    this.pivot = pivot;
    this.dx = dx;
    this.dy = dy;
    Particle.__super__.constructor.call(this, 1, "#fff");
  }

  Particle.prototype.update = function() {
    var vx, vy;
    this.old_x = this.x;
    this.old_y = this.y;
    vx = this.pivot.x + this.dx;
    vy = this.pivot.y + this.dy;
    this.x = vx;
    this.y = vy;
    if (Math.abs(this.x - this.old_x) > 1) {
      this.opacity = 0.9;
    }
    this.dist = Calc.dist(this.pivot.x, this.pivot.y, this.x, this.y);
    this.radius = this.dist / 100 * this.mag;
    this.opacity = 1 - (this.dist / 100 / 3.2);
    if (this.opacity < 0) {
      return this.opacity = 0;
    }
  };

  return Particle;

})(Circle);

}, {"draw/geom/circle":"src/app/lib/draw/geom/circle","draw/draw":"src/app/lib/draw/draw","draw/math/calc":"src/app/lib/draw/math/calc"});
require.register('src/app/views/hole/pivot', function(require, module, exports){
var Calc, Circle, Draw, Pivot,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Circle = require("draw/geom/circle");

Draw = require("draw/draw");

Calc = require("draw/math/calc");

module.exports = Pivot = (function(_super) {
  __extends(Pivot, _super);

  Pivot.prototype.vx = 0;

  Pivot.prototype.vy = 0;

  Pivot.prototype.ax = 0;

  Pivot.prototype.ay = 0;

  Pivot.prototype.spring = 0.8;

  Pivot.prototype.target = {};

  Pivot.prototype.angle = 0;

  Pivot.prototype.rotate = true;

  Pivot.prototype.speed = 0.1;

  function Pivot(target) {
    this.target = target;
    Pivot.__super__.constructor.call(this, 0, "#FF0000");
    this.x = this.target.x;
    this.y = this.target.y;
  }

  Pivot.prototype.update = function() {
    var rad;
    if (this.speed < 0) {
      this.speed = 0.01;
    }
    this.ax = this.target.x - this.x;
    this.ay = this.target.y - this.y;
    if (this.ax < 50 || this.ay < 50) {
      if (this.rotate) {
        rad = Calc.deg2rad(this.angle);
        this.ax += (Math.cos(rad)) * 30;
        this.ay += (Math.sin(rad)) * 30;
        this.angle += 5;
      }
    }
    this.vx += this.ax * this.speed;
    this.vy += this.ay * this.speed;
    this.vx *= this.spring;
    this.vy *= this.spring;
    this.x += this.vx;
    return this.y += this.vy;
  };

  return Pivot;

})(Circle);

}, {"draw/geom/circle":"src/app/lib/draw/geom/circle","draw/draw":"src/app/lib/draw/draw","draw/math/calc":"src/app/lib/draw/math/calc"});
require.register('src/app/views/hole/system', function(require, module, exports){
var Calc, Draw, Particle, Pivot, System;

Particle = require("./particle");

Calc = require("draw/math/calc");

Draw = require("draw/draw");

Pivot = require("./pivot");

module.exports = System = (function() {
  System.prototype.NUM_PARTICLES = 50;

  System.prototype.particles = [];

  System.prototype.angle_step = 0;

  System.prototype.angle = 0;

  System.prototype.origin = {};

  System.prototype.pivot = {};

  System.prototype.mag = 1;

  function System(origin) {
    this.origin = origin;
    this.angle_step = 360 / this.NUM_PARTICLES;
    this.mouse = this.origin.mouse;
    this.pivot = new Pivot(this.origin.follows);
    this.pivot.spring = 0.3;
    this.pivot.rotate = false;
    this.pivot.speed = 0.7;
  }

  System.prototype.setup = function() {
    return this._create_particles();
  };

  System.prototype.run = function() {
    var i, p, _results;
    this.pivot.update();
    this.pivot.draw();
    i = this.particles.length - 1;
    _results = [];
    while (i >= 0) {
      p = this.particles[i];
      p.update();
      p.draw();
      _results.push(i--);
    }
    return _results;
  };

  System.prototype._create_particles = function() {
    var fx, fy, i, mag, p, rad, _results;
    this.particles = [];
    fx = 0;
    fy = 0;
    i = 0;
    _results = [];
    while (i < this.NUM_PARTICLES) {
      this.angle += this.angle_step;
      rad = Calc.deg2rad(this.angle);
      mag = this.origin.rad;
      fx = (Math.cos(rad)) * mag;
      fy = (Math.sin(rad)) * mag;
      p = new Particle(this.pivot, fx, fy);
      p.mag = this.mag;
      this.particles.push(p);
      _results.push(i++);
    }
    return _results;
  };

  return System;

})();

}, {"./particle":"src/app/views/hole/particle","draw/math/calc":"src/app/lib/draw/math/calc","draw/draw":"src/app/lib/draw/draw","./pivot":"src/app/views/hole/pivot"});
require.register('src/app/views/magnets/ball', function(require, module, exports){
var Ball, Circle, Draw,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Circle = require("draw/geom/circle");

Draw = require("draw/draw");

module.exports = Ball = (function(_super) {
  __extends(Ball, _super);

  Ball.prototype.x = 0;

  Ball.prototype.y = 0;

  Ball.prototype.mass = 0;

  Ball.prototype.vx = 0;

  Ball.prototype.vy = 0;

  Ball.prototype.ax = 0;

  Ball.prototype.ay = 0;

  Ball.prototype.speed = 1;

  Ball.prototype.collided = false;

  function Ball() {
    Ball.__super__.constructor.apply(this, arguments);
    this.mass = this.radius;
  }

  Ball.prototype.apply_force = function(fx, fy) {
    this.ax += fx;
    return this.ay += fy;
  };

  Ball.prototype.update = function() {
    this.vx += this.ax;
    this.vy += this.ay;
    if (this.vx > 2.4) {
      this.vx = 2.4;
    }
    if (this.vy > 2.4) {
      this.vy = 2.4;
    }
    this.ax = 0;
    return this.ay = 0;
  };

  Ball.prototype.draw = function() {
    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;
    Ball.__super__.draw.apply(this, arguments);
    this.ctx.fillStyle = "#FFF";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius / 10, 0, Math.PI * 2, true);
    this.ctx.closePath();
    return this.ctx.fill();
  };

  return Ball;

})(Circle);

}, {"draw/geom/circle":"src/app/lib/draw/geom/circle","draw/draw":"src/app/lib/draw/draw"});
require.register('src/app/views/magnets/index', function(require, module, exports){
var AppView, Ball, Calc, Draw, Index, Magnet, Target, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppView = require('app/views/app_view');

Ball = require("./ball");

Magnet = require("./magnet");

Target = require("./target");

Draw = require("draw/draw");

Calc = require("draw/math/calc");

module.exports = Index = (function(_super) {
  __extends(Index, _super);

  function Index() {
    this.after_render = __bind(this.after_render, this);
    _ref = Index.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Index.prototype.magnets = [];

  Index.prototype.dragging = false;

  Index.prototype.started = true;

  Index.prototype.destroy = function() {
    this.ctx.clear();
    this.ctx.destroy();
    this.ctx = null;
    this.magnets = [];
    $("body").css({
      "cursor": "default"
    });
    return Index.__super__.destroy.apply(this, arguments);
  };

  Index.prototype.after_render = function() {
    var _;
    _ = this;
    _.magnets = [];
    return this.ctx = window.Sketch.create({
      container: this.el.get(0),
      setup: function() {
        var i, m, _results;
        Draw.CTX = $(".sketch").get(0).getContext("2d");
        _.ball = new Ball(20, "#000", "#fff", 4);
        _.ball.x = 50;
        _.ball.y = this.height / 2;
        i = 0;
        _results = [];
        while (i < parseInt($(window).width() / 50)) {
          m = new Magnet(25 + (Math.random() * 35), "#FFF");
          m.x = Math.random() * this.width;
          m.y = 100 + (Math.random() * this.height - 100);
          m.setup();
          _.magnets.push(m);
          _results.push(i++);
        }
        return _results;
      },
      is_mouse_over: function(magnet) {
        if (this.mouse.x > (magnet.x - magnet.radius) && this.mouse.x < (magnet.x + magnet.radius) && this.mouse.y > (magnet.y - magnet.radius) && this.mouse.y < (magnet.y + magnet.radius)) {
          return true;
        }
        return false;
      },
      update: function() {
        var is_already_dragging, m, _i, _j, _len, _len1, _ref1, _ref2;
        if ($("body").css("cursor") === "move") {
          $("body").css({
            "cursor": "default"
          });
        }
        is_already_dragging = false;
        _ref1 = _.magnets;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          m = _ref1[_i];
          if (m.dragged) {
            is_already_dragging = true;
            break;
          }
        }
        _ref2 = _.magnets;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          m = _ref2[_j];
          m.update();
          if (_.started) {
            m.attract(_.ball);
          }
          if (this.is_mouse_over(m) && _.dragging && !is_already_dragging) {
            m.dragged = true;
          }
          if (m.dragged) {
            is_already_dragging = true;
            m.x = this.mouse.x;
            m.y = this.mouse.y;
          }
          if (this.is_mouse_over(m)) {
            $("body").css({
              "cursor": "move"
            });
          }
        }
        if (_.started) {
          return _.ball.update();
        }
      },
      check_collision: function() {
        var dist, m, _i, _len, _ref1, _results;
        _ref1 = _.magnets;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          m = _ref1[_i];
          dist = Calc.dist(m.x, m.y, _.ball.x, _.ball.y);
          if (dist < (m.radius + _.ball.radius)) {
            _.ball.vx = 0;
            _results.push(_.ball.vy = 0);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      reached_target: function() {
        var dist;
        dist = Calc.dist(_.target.x, _.target.y, _.ball.x, _.ball.y);
        if (dist < _.target.radius) {
          _.target.mass = 500;
          _.ball.vx *= 0.9;
          _.ball.vy *= 0.9;
        }
        if (dist < 2) {
          _.ball.vx = 0;
          return _.ball.vy = 0;
        }
      },
      draw: function() {
        var m, _i, _len, _ref1, _results;
        _.ball.draw();
        _ref1 = _.magnets;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          m = _ref1[_i];
          m.draw_lines_to(_.ball);
          _results.push(m.draw());
        }
        return _results;
      },
      mousedown: function() {
        return _.dragging = true;
      },
      mouseup: function() {
        var m, _i, _len, _ref1, _results;
        _.dragging = false;
        $(document.body).css({
          "cursor": "default"
        });
        _ref1 = _.magnets;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          m = _ref1[_i];
          m.setup();
          _results.push(m.dragged = false);
        }
        return _results;
      }
    });
  };

  return Index;

})(AppView);

}, {"app/views/app_view":"src/app/views/app_view","./ball":"src/app/views/magnets/ball","./magnet":"src/app/views/magnets/magnet","./target":"src/app/views/magnets/target","draw/draw":"src/app/lib/draw/draw","draw/math/calc":"src/app/lib/draw/math/calc"});
require.register('src/app/views/magnets/magnet', function(require, module, exports){
var Calc, Circle, Draw, Magnet,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Circle = require("draw/geom/circle");

Calc = require("draw/math/calc");

Draw = require("draw/draw");

module.exports = Magnet = (function(_super) {
  __extends(Magnet, _super);

  Magnet.prototype.dragged = false;

  Magnet.prototype.NUM_LINES = 0;

  Magnet.prototype.shadow = null;

  Magnet.prototype.vx = 0;

  Magnet.prototype.vy = 0;

  Magnet.prototype.spring = 0.2;

  Magnet.prototype.speed = 0.1;

  Magnet.prototype.MIN_DIST = 500;

  function Magnet() {
    Magnet.__super__.constructor.apply(this, arguments);
    this.mass = this.radius * 2;
    this.NUM_LINES = this.radius / 5;
    this.shadow = new Circle(this.radius, "#000");
  }

  Magnet.prototype.update = function() {
    if (!this.dragged) {
      this.dx = this.iddle_x - this.x;
      this.dy = this.iddle_y - this.y;
      this.ax = this.dx * this.spring;
      this.ay = this.dy * this.spring;
      this.vx += this.ax;
      this.vy += this.ay;
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;
      this.ax = 0;
      return this.ay = 0;
    }
  };

  Magnet.prototype.setup = function() {
    this.initial_x = this.x;
    this.initial_y = this.y;
    this.iddle_x = this.initial_x + (Math.random() * 10) + (-(Math.random() * 10));
    return this.iddle_y = this.initial_y + (Math.random() * 10) + (-(Math.random() * 10));
  };

  Magnet.prototype.draw = function(ctx) {
    this.ctx = ctx;
    this.shadow.x = this.x + 2;
    this.shadow.y = this.y + 2;
    this.shadow.draw(this.ctx);
    Magnet.__super__.draw.apply(this, arguments);
    return this.draw_dot();
  };

  Magnet.prototype.attract = function(ball) {
    var deg, distance, fx, fy, rad, strength;
    deg = Calc.ang(this.x, this.y, ball.x, ball.y);
    rad = Calc.deg2rad(deg);
    distance = Calc.dist(this.x, this.y, ball.x, ball.y);
    if (distance < 250) {
      distance = 250;
    }
    strength = (this.mass * ball.mass) / (distance * distance);
    fx = Math.cos(rad) * strength;
    fy = Math.sin(rad) * strength;
    return ball.apply_force(-fx, -fy);
  };

  Magnet.prototype.draw_lines_to = function(ball) {
    var dist, i, init_x, init_y, line_angle, line_dist, line_rad, opacity, target_angle, target_rad, _radius, _x, _y;
    if (!this.ctx) {
      this.ctx = Draw.CTX;
    }
    i = 0;
    opacity = 1;
    dist = Calc.dist(this.x, this.y, ball.x, ball.y);
    if (dist > this.MIN_DIST) {
      return;
    } else {
      opacity = 1 - (dist / this.MIN_DIST);
    }
    target_angle = Calc.ang(this.x, this.y, ball.x, ball.y);
    line_angle = target_angle + 90;
    line_rad = Calc.deg2rad(line_angle);
    _radius = this.radius * 0.9;
    this.ctx.globalCompositeOperation = "destination-over";
    this.ctx.strokeStyle = "rgba(255,255,255," + opacity + ")";
    this.ctx.lineWidth = 1;
    while (i < (this.NUM_LINES * 1.9)) {
      init_x = this.x + (Math.cos(line_rad)) * _radius;
      init_y = this.y + (Math.sin(line_rad)) * _radius;
      target_angle = Calc.ang(init_x, init_y, ball.x, ball.y);
      target_rad = Calc.deg2rad(target_angle);
      line_dist = Calc.dist(init_x, init_y, ball.x, ball.y);
      _x = init_x + (Math.cos(target_rad)) * line_dist;
      _y = init_y + (Math.sin(target_rad)) * line_dist;
      this.ctx.moveTo(init_x, init_y);
      this.ctx.lineTo(_x, _y);
      _radius -= this.radius / this.NUM_LINES;
      i++;
    }
    this.ctx.stroke();
    return this.ctx.globalCompositeOperation = "source-over";
  };

  Magnet.prototype.draw_dot = function() {
    this.ctx.fillStyle = "#000";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
    this.ctx.closePath();
    return this.ctx.fill();
  };

  return Magnet;

})(Circle);

}, {"draw/geom/circle":"src/app/lib/draw/geom/circle","draw/math/calc":"src/app/lib/draw/math/calc","draw/draw":"src/app/lib/draw/draw"});
require.register('src/app/views/magnets/target', function(require, module, exports){
var Calc, Circle, Target,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Circle = require("draw/geom/circle");

Calc = require("draw/math/calc");

module.exports = Target = (function(_super) {
  __extends(Target, _super);

  function Target() {
    Target.__super__.constructor.call(this, 50, "#000", "#fff", 1);
    this.mass = 500;
  }

  Target.prototype.update = function() {};

  Target.prototype.attract = function(ball) {
    var deg, distance, fx, fy, rad, strength;
    deg = Calc.ang(this.x, this.y, ball.x, ball.y);
    rad = Calc.deg2rad(deg);
    distance = Calc.dist(this.x, this.y, ball.x, ball.y);
    if (distance > 750) {
      distance = 750;
    }
    if (distance < 300) {
      distance = 300;
    }
    strength = (this.mass * ball.mass) / (distance * distance);
    fx = Math.cos(rad) * strength;
    fy = Math.sin(rad) * strength;
    if (distance < 500) {
      return ball.apply_force(-fx, -fy);
    }
  };

  Target.prototype.draw = function() {
    Target.__super__.draw.apply(this, arguments);
    this.ctx.strokeStyle = "#fff";
    this.ctx.strokeWidth = 1;
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(Math.round(this.x - 3), Math.round(this.y - 3));
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(Math.round(this.x + 3), Math.round(this.y + 3));
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(Math.round(this.x + 3), Math.round(this.y - 3));
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(Math.round(this.x - 3), Math.round(this.y + 3));
    return this.ctx.stroke();
  };

  return Target;

})(Circle);

}, {"draw/geom/circle":"src/app/lib/draw/geom/circle","draw/math/calc":"src/app/lib/draw/math/calc"});
require.register('src/app/views/pages/index', function(require, module, exports){
var AppView, Index, Menu, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppView = require('app/views/app_view');

Menu = require('app/views/pages/menu');

module.exports = Index = (function(_super) {
  __extends(Index, _super);

  function Index() {
    this.on_resize = __bind(this.on_resize, this);
    _ref = Index.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Index.prototype.after_render = function() {
    this.setup();
    return this.set_triggers();
  };

  Index.prototype.setup = function() {
    this.wrapper = $(this.el).find(".wrapper");
    this.window = $(window);
    this.menu = new Menu(".footer");
    return this.logo = this.el.find(".logo-labs");
  };

  Index.prototype.before_in = function() {
    return this.logo.css({
      opacity: 0
    });
  };

  Index.prototype.on_resize = function() {
    this.wrapper.css({
      width: this.window.width(),
      height: this.window.height()
    });
    return this.menu.on_resize();
  };

  Index.prototype["in"] = function(done) {
    var _this = this;
    this.before_in();
    TweenLite.to(this.logo, 0, {
      css: {
        opacity: 1
      },
      delay: 0.1
    });
    this.logo.spritefy("logo-labs", {
      duration: 1,
      count: 1,
      onComplete: function() {
        return _this.menu["in"](function() {
          return typeof _this.after_in === "function" ? _this.after_in() : void 0;
        });
      }
    });
    return this.logo.animation.play();
  };

  Index.prototype.goto = function(e) {
    var route;
    e.preventDefault();
    route = $(e.currentTarget).attr("href");
    return console.log(route);
  };

  return Index;

})(AppView);

}, {"app/views/app_view":"src/app/views/app_view","app/views/pages/menu":"src/app/views/pages/menu"});
require.register('src/app/views/pages/menu', function(require, module, exports){
var Menu, Routes, Template,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Template = require('templates/pages/menu');

Routes = require('app/config/routes');

module.exports = Menu = (function() {
  Menu.prototype.labs = [];

  function Menu(at) {
    this.show = __bind(this.show, this);
    this.hide = __bind(this.hide, this);
    this.out = __bind(this.out, this);
    this.over = __bind(this.over, this);
    this.on_resize = __bind(this.on_resize, this);
    var route;
    for (route in Routes.routes) {
      if (Routes.routes[route].lab) {
        this.labs.push(route.toString());
      }
    }
    this.el = $(Template({
      labs: this.labs
    }));
    $(at).append(this.el);
    this.setup();
  }

  Menu.prototype.on_resize = function() {
    this.el.css({
      top: this.window.height() - this.el.height(),
      width: this.window.width()
    });
    return this.menu.css({
      left: this.wrapper.width() / 2 - this.menu.width() / 2
    });
  };

  Menu.prototype.setup = function() {
    this.window = $(window);
    this.wrapper = $(".wrapper");
    this.arrow = this.el.find(".arrow");
    this.menu = this.el.find(".nav");
    this.on_resize();
    this.events();
    return this.arrow.css({
      top: 100
    });
  };

  Menu.prototype["in"] = function(cb) {
    return TweenLite.to(this.arrow, 0.5, {
      css: {
        top: 10
      },
      ease: Back.easeOut,
      onComplete: cb
    });
  };

  Menu.prototype.events = function() {
    this.window.bind("resize", this.on_resize);
    this.el.bind("mouseenter", this.show);
    this.el.bind("mouseleave", this.hide);
    this.menu.find("a").bind("mouseenter", this.over);
    return this.menu.find("a").bind("mouseleave", this.out);
  };

  Menu.prototype.over = function(e) {
    var bt;
    bt = $(e.currentTarget);
    if (bt.hasClass("active")) {
      return;
    }
    TweenLite.to(bt.find(".white_dot"), 0.15, {
      css: {
        width: 1,
        height: 1,
        marginLeft: -1,
        marginTop: -1
      }
    });
    return TweenLite.to(bt.find(".dot"), 0.15, {
      css: {
        opacity: 0
      }
    });
  };

  Menu.prototype.out = function(e) {
    var bt;
    bt = $(e.currentTarget);
    if (bt.hasClass("active")) {
      return;
    }
    TweenLite.to(bt.find(".white_dot"), 0.15, {
      css: {
        width: 25,
        height: 25,
        marginLeft: -(26 / 2),
        marginTop: -(26 / 2)
      }
    });
    return TweenLite.to(bt.find(".dot"), 0.15, {
      css: {
        opacity: 1
      }
    });
  };

  Menu.prototype.hide = function() {
    var amount, delay, distance, i, li, total_delay, _i, _len, _ref, _results;
    TweenLite.to(this.arrow, 0.5, {
      css: {
        top: 20
      },
      ease: Expo.easeOut,
      delay: 0.4
    });
    amount = this.menu.find("li").length;
    total_delay = amount / 2;
    delay = 0;
    distance = 0;
    this.delay_v = 0;
    _ref = this.menu.find("li a");
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      li = _ref[i];
      distance = total_delay - Math.abs(total_delay - this.delay_v);
      this.delay_v += 1;
      delay = distance / 500;
      li = $(li);
      _results.push(TweenLite.to(li, 0.4, {
        css: {
          top: 150
        },
        ease: Back.easeIn,
        delay: i * delay
      }));
    }
    return _results;
  };

  Menu.prototype.show = function() {
    var amount, delay, distance, i, li, total_delay, _i, _len, _ref, _results;
    TweenLite.to(this.arrow, 0.5, {
      css: {
        top: 150
      },
      ease: Expo.easeOut
    });
    amount = this.menu.find("li").length;
    total_delay = amount / 2;
    delay = 0;
    distance = 0;
    this.delay_v = 0;
    _ref = this.menu.find("li a");
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      li = _ref[i];
      distance = total_delay - Math.abs(total_delay - this.delay_v);
      this.delay_v += 1;
      delay = distance / 500;
      li = $(li);
      _results.push(TweenLite.to(li, 0.4, {
        css: {
          top: 20
        },
        ease: Back.easeOut,
        delay: i * delay
      }));
    }
    return _results;
  };

  return Menu;

})();

}, {"templates/pages/menu":"src/templates/pages/menu","app/config/routes":"src/app/config/routes"});
require.register('src/app/views/repulse/ball', function(require, module, exports){
var Ball, Calc, Circle, Draw,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Circle = require("draw/geom/circle");

Calc = require("draw/math/calc");

Draw = require("draw/draw");

module.exports = Ball = (function(_super) {
  __extends(Ball, _super);

  Ball.prototype.vx = 0;

  Ball.prototype.vy = 0;

  Ball.prototype.ac = 0;

  Ball.prototype.iddle_x = 0;

  Ball.prototype.iddle_y = 0;

  Ball.prototype.speed = 1;

  Ball.prototype.dx = 0;

  Ball.prototype.dy = 0;

  Ball.prototype.spring = 0.2;

  Ball.prototype.ax = 0;

  Ball.prototype.ay = 0;

  Ball.prototype.speed = 0.1;

  Ball.prototype.friction = 0.9;

  Ball.prototype.run = false;

  Ball.prototype.init_speed = 0;

  Ball.prototype.line_x = 0;

  Ball.prototype.line_y = 0;

  Ball.prototype.opacity = 1;

  function Ball() {
    Ball.__super__.constructor.apply(this, arguments);
    this.speed = this.init_speed = Math.random() * 0.1;
  }

  Ball.prototype.setup = function(ctx) {
    this.ctx = ctx;
    this.init_x = this.x;
    this.init_y = this.y;
    this.iddle_x = this.init_x + Math.random() * 10;
    this.iddle_y = this.init_y + Math.random() * 10;
    this.target_x = this.iddle_x;
    this.target_y = this.iddle_y;
    return this.max_rad = 15 + Math.random() * 40;
  };

  Ball.prototype.update = function(mouseX, mouseY) {
    var dx, dy, mouse_angle;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.mouse_dist = Calc.dist(this.x, this.y, mouseX, mouseY);
    if (this.mouse_dist < 150) {
      this.speed = 0.2;
      this.spring = 0.3;
      mouse_angle = Calc.ang(mouseX, mouseY, this.iddle_x, this.iddle_y);
      mouse_angle = Calc.deg2rad(mouse_angle);
      dx = Math.cos(mouse_angle);
      dy = Math.sin(mouse_angle);
      this.target_x = mouseX + dx * 140;
      this.line_x = mouseX + dx * 70;
      this.target_y = mouseY + dy * 140;
      this.line_y = mouseY + dy * 70;
    } else {
      this.spring = 0.2;
      this.target_y = this.iddle_y;
      this.target_x = this.iddle_x;
    }
    if (this.mouse_dist > 200) {
      this.speed = this.init_speed;
    }
    if (this.mouse_dist < 230) {
      this.radius = (this.mouse_dist * 100) / 230;
      this.radius = this.max_rad - (this.radius * this.max_rad) / 100;
    } else {
      this.radius = 1;
    }
    if (this.radius < 1) {
      this.radius = 1;
    }
    this.dx = this.target_x - this.x;
    this.dy = this.target_y - this.y;
    this.ax = this.dx * this.spring;
    this.ay = this.dy * this.spring;
    this.vx += this.ax;
    this.vy += this.ay;
    if (this.vx > 1 || this.vx < -1) {
      this.vx *= this.friction;
    }
    if (this.vy > 1 || this.vy < -1) {
      this.vy *= this.friction;
    }
    this.x += this.vx * this.speed;
    return this.y += this.vy * this.speed;
  };

  Ball.prototype.draw = function() {
    Ball.__super__.draw.apply(this, arguments);
    if (this.radius > 5) {
      this.ctx.strokeStyle = "#000000";
      this.ctx.strokeWidth = 1;
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(Math.round(this.x - 3), Math.round(this.y - 3));
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(Math.round(this.x + 3), Math.round(this.y + 3));
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(Math.round(this.x + 3), Math.round(this.y - 3));
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(Math.round(this.x - 3), Math.round(this.y + 3));
      return this.ctx.stroke();
    }
  };

  return Ball;

})(Circle);

}, {"draw/geom/circle":"src/app/lib/draw/geom/circle","draw/math/calc":"src/app/lib/draw/math/calc","draw/draw":"src/app/lib/draw/draw"});
require.register('src/app/views/repulse/index', function(require, module, exports){
var AppView, Ball, Draw, Index, Target, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppView = require('app/views/app_view');

Draw = require("draw/draw");

Ball = require("./ball");

Target = require("./target");

module.exports = Index = (function(_super) {
  var NUM_BALLS;

  __extends(Index, _super);

  function Index() {
    this.destroy = __bind(this.destroy, this);
    _ref = Index.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  NUM_BALLS = 1;

  Index.prototype.destroy = function() {
    this.ctx.clear();
    this.ctx.destroy();
    return Index.__super__.destroy.apply(this, arguments);
  };

  Index.prototype.after_render = function() {
    NUM_BALLS = ($(window).width() + $(window).height()) / 2;
    if (this.ctx) {
      this.ctx.clear();
      this.ctx.destroy();
    }
    return this.ctx = window.Sketch.create({
      container: this.el.get(0),
      setup: function() {
        var ball, i, _results;
        Draw.CTX = $(".sketch").get(0).getContext("2d");
        this.balls = [];
        i = 0;
        _results = [];
        while (i < NUM_BALLS) {
          ball = new Ball(1, "#ffffff");
          ball.x = Math.random() * this.width;
          ball.y = Math.random() * this.height;
          ball.setup(Draw.CTX);
          this.balls.push(ball);
          _results.push(i++);
        }
        return _results;
      },
      mousedown: function() {},
      update: function() {
        var ball, _i, _len, _ref1, _results;
        _ref1 = this.balls;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          ball = _ref1[_i];
          _results.push(ball.update(this.mouse.x, this.mouse.y));
        }
        return _results;
      },
      draw: function() {
        var ball, _i, _len, _ref1, _results;
        _ref1 = this.balls;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          ball = _ref1[_i];
          _results.push(ball.draw());
        }
        return _results;
      }
    });
  };

  return Index;

})(AppView);

}, {"app/views/app_view":"src/app/views/app_view","draw/draw":"src/app/lib/draw/draw","./ball":"src/app/views/repulse/ball","./target":"src/app/views/repulse/target"});
require.register('src/app/views/repulse/target', function(require, module, exports){
var Calc, Circle, Draw, Target,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Circle = require("draw/geom/circle");

Calc = require("draw/math/calc");

Draw = require("draw/draw");

module.exports = Target = (function(_super) {
  __extends(Target, _super);

  Target.prototype.vx = 0;

  Target.prototype.vy = 0;

  Target.prototype.speed = 1;

  Target.prototype.dx = 0;

  Target.prototype.dy = 0;

  Target.prototype.spring = 0.2;

  Target.prototype.ax = 0;

  Target.prototype.ay = 0;

  Target.prototype.friction = 0.7;

  function Target() {
    Target.__super__.constructor.apply(this, arguments);
  }

  Target.prototype.set_target = function(target_x, target_y) {
    this.target_x = target_x;
    this.target_y = target_y;
  };

  Target.prototype.update = function() {
    this.dx = this.target_x - this.x;
    this.dy = this.target_y - this.y;
    this.ax = this.dx * this.spring;
    this.ay = this.dy * this.spring;
    this.vx += this.ax;
    this.vy += this.ay;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;
    this.target_angle = Calc.ang(this.x, this.y, this.target_x, this.target_y);
    this.target_angle = Calc.deg2rad(this.target_angle);
    this.target_dist = Calc.dist(this.x, this.y, this.target_x, this.target_y);
    this.anx = Math.cos(this.target_angle);
    return this.any = Math.sin(this.target_angle);
  };

  Target.prototype.draw = function() {
    var radiusx, radiusy, x, y;
    Target.__super__.draw.apply(this, arguments);
    this.ctx.strokeStyle = "#000000";
    this.ctx.strokeWidth = 1;
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(Math.round(this.x - 3), Math.round(this.y - 3));
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(Math.round(this.x + 3), Math.round(this.y + 3));
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(Math.round(this.x + 3), Math.round(this.y - 3));
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(Math.round(this.x - 3), Math.round(this.y + 3));
    this.ctx.stroke();
    radiusx = this.radius;
    radiusy = this.radius;
    if (this.target_dist < this.radius) {
      radiusx = this.target_dist;
      radiusy = this.target_dist;
    }
    x = this.x + (this.anx * radiusx);
    y = this.y + (this.any * radiusy);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#000000";
    this.ctx.strokeWidth = 1;
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(this.target_x, this.target_y);
    this.ctx.stroke();
    return this.ctx.closePath();
  };

  return Target;

})(Circle);

}, {"draw/geom/circle":"src/app/lib/draw/geom/circle","draw/math/calc":"src/app/lib/draw/math/calc","draw/draw":"src/app/lib/draw/draw"});
require.register('src/app/views/strings/audio', function(require, module, exports){
var Audio;

module.exports = Audio = (function() {
  Audio.prototype.dancer = {};

  function Audio(dom) {
    this.dom = dom;
    this.dancer = new Dancer;
    this.dancer.between(0, 11, function() {});
    this.dancer.load({
      src: 'audio/wind-howl.mp3',
      loop: true
    });
    this.dancer.play();
  }

  Audio.prototype.spectrum = function() {
    return this.dancer.getSpectrum();
  };

  return Audio;

})();

}, {});
require.register('src/app/views/strings/ball', function(require, module, exports){
var Ball, Circle,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Circle = require("draw/geom/circle");

module.exports = Ball = (function(_super) {
  __extends(Ball, _super);

  Ball.prototype.x = 0;

  Ball.prototype.y = 0;

  Ball.prototype.vx = 0;

  Ball.prototype.vy = 0;

  Ball.prototype._pin = false;

  function Ball() {
    Ball.__super__.constructor.apply(this, arguments);
    this.mass = this.radius;
  }

  Ball.prototype.pos = function(x, y) {
    this.x = this.old_x = this.init_x = x;
    return this.y = this.old_y = this.init_y = y;
  };

  Ball.prototype.apply_force = function(fx, fy) {
    if (this._pin) {
      return;
    }
    this.x += fx;
    return this.y += fy;
  };

  Ball.prototype.update = function() {
    var tmp_x, tmp_y;
    if (this._pin) {
      return;
    }
    tmp_x = this.x;
    tmp_y = this.y;
    this.x += (this.x - this.old_x) * 0.95;
    this.y += (this.y - this.old_y) * 0.95;
    this.old_x = tmp_x;
    return this.old_y = tmp_y;
  };

  Ball.prototype.draw = function() {
    return Ball.__super__.draw.apply(this, arguments);
  };

  Ball.prototype.pin = function() {
    return this._pin = true;
  };

  Ball.prototype.unpin = function() {
    return this._pin = false;
  };

  return Ball;

})(Circle);

}, {"draw/geom/circle":"src/app/lib/draw/geom/circle"});
require.register('src/app/views/strings/constraint', function(require, module, exports){
var Calc, Constraint, Draw;

Calc = require("draw/math/calc");

Draw = require("draw/draw");

module.exports = Constraint = (function() {
  Constraint.prototype.p1 = {};

  Constraint.prototype.p2 = {};

  Constraint.prototype.dist = 30;

  function Constraint(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.dist = Calc.dist(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
  }

  Constraint.prototype.update = function(is_mouse_down) {
    var diff, dist, dx, dy, fx, fy;
    if (is_mouse_down == null) {
      is_mouse_down = false;
    }
    if (is_mouse_down) {
      dx = this.p2.x - this.p1.x;
      dy = this.p2.y - this.p1.y;
      dist = Calc.dist(this.p2.x, this.p2.y, this.p1.x, this.p1.y);
      diff = (this.dist - dist) / dist;
      fx = (diff * dx) * 0.5;
      fy = (diff * dy) * 0.5;
      this.p1.apply_force(-fx, -fy);
      return this.p2.apply_force(fx, fy);
    } else {
      dx = this.p1.init_x - this.p1.x;
      dy = this.p1.init_y - this.p1.y;
      this.p1.apply_force(dx * 0.001, dy * 0.001);
      dx = this.p2.init_x - this.p2.x;
      dy = this.p2.init_y - this.p2.y;
      return this.p2.apply_force(dx * 0.001, dy * 0.001);
    }
  };

  return Constraint;

})();

}, {"draw/math/calc":"src/app/lib/draw/math/calc","draw/draw":"src/app/lib/draw/draw"});
require.register('src/app/views/strings/index', function(require, module, exports){
var AppView, Audio, Ball, Calc, Constraint, Draw, Index, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppView = require('app/views/app_view');

Ball = require("./ball");

Constraint = require("./constraint");

Draw = require("draw/draw");

Calc = require("draw/math/calc");

Audio = require("./audio");

module.exports = Index = (function(_super) {
  __extends(Index, _super);

  function Index() {
    this.after_render = __bind(this.after_render, this);
    this.destroy = __bind(this.destroy, this);
    _ref = Index.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Index.prototype.NUM_COLS = 20;

  Index.prototype.NUM_ROWS = 20;

  Index.prototype.STRING_DIST = 15;

  Index.prototype.GRAVITY = 0.05;

  Index.prototype.CENTER_X = 0;

  Index.prototype.CENTER_Y = 0;

  Index.prototype.points = [];

  Index.prototype.strings = [];

  Index.prototype.audio = {};

  Index.prototype.destroy = function() {
    this.ctx.clear();
    this.ctx.destroy();
    return Index.__super__.destroy.apply(this, arguments);
  };

  Index.prototype.after_render = function() {
    var _;
    _ = this;
    this.points = [];
    this.strings = [];
    return this.ctx = window.Sketch.create({
      container: this.el.get(0),
      autoclear: true,
      setup: function() {
        var _this = this;
        _.CENTER_X = (this.width / 2) - (_.NUM_COLS * _.STRING_DIST / 2);
        _.CENTER_Y = (this.height / 2) - (_.NUM_ROWS * _.STRING_DIST / 2);
        Draw.CTX = $(".sketch").get(0).getContext("2d");
        this.build_grid();
        return this.iterate(function(ball, row, col) {
          if (row === 19) {
            return _.points[row][col].pin();
          }
        });
      },
      update: function() {
        var md, s, _i, _len, _ref1,
          _this = this;
        _ref1 = _.strings;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          s = _ref1[_i];
          s.update(this.drag);
        }
        if (this.drag) {
          md = Calc.dist(this.drag.x, this.drag.y, this.mouse.x, this.mouse.y);
          if (md < 300) {
            this.drag.x = this.mouse.x;
            this.drag.y = this.mouse.y;
          }
        }
        return this.iterate(function(ball, row, col) {
          return ball.update();
        });
      },
      draw: function() {
        var s, _i, _len, _ref1,
          _this = this;
        Draw.CTX.globalAlpha = 0.1;
        Draw.CTX.fillStyle = "#000";
        Draw.CTX.strokeStyle = '#FFFFFF';
        Draw.CTX.lineWidth = 1;
        Draw.CTX.beginPath();
        _ref1 = _.strings;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          s = _ref1[_i];
          Draw.CTX.moveTo(s.p1.x, s.p1.y);
          Draw.CTX.lineTo(s.p2.x, s.p2.y);
        }
        Draw.CTX.closePath();
        Draw.CTX.fill();
        Draw.CTX.stroke();
        Draw.CTX.globalAlpha = 1;
        return this.iterate(function(ball, row, col) {
          return ball.draw();
        });
      },
      mousedown: function() {
        var dragging_ball, range,
          _this = this;
        range = 1000;
        dragging_ball = null;
        this.iterate(function(ball, row, col) {
          var dd;
          dd = Calc.dist(ball.x, ball.y, _this.mouse.x, _this.mouse.y);
          if (dd < range) {
            range = dd;
            if (!ball._pin) {
              return dragging_ball = ball;
            }
          }
        });
        return this.drag = dragging_ball;
      },
      mouseup: function() {
        return this.drag = null;
      },
      build_grid: function() {
        var angle, ball, cols, dist, rad, rows, step, string, x, y, _results;
        angle = 0;
        step = 360 / 10;
        dist = 30;
        rows = 0;
        _results = [];
        while (rows < _.NUM_ROWS) {
          cols = 0;
          _.points[rows] = [];
          dist += 10;
          while (cols < _.NUM_COLS) {
            ball = new Ball(1, "#fff");
            angle += step;
            rad = Calc.deg2rad(angle);
            x = (this.width / 2) + (Math.cos(rad) * dist);
            y = (this.height / 2) + (Math.sin(rad) * dist);
            ball.pos(x, y);
            _.points[rows][cols] = ball;
            if (cols > 0) {
              string = new Constraint(_.points[rows][cols - 1], _.points[rows][cols]);
              _.strings.push(string);
            }
            if (rows > 0) {
              string = new Constraint(_.points[rows][cols], _.points[rows - 1][cols]);
              _.strings.push(string);
            }
            cols++;
          }
          _results.push(rows++);
        }
        return _results;
      },
      iterate: function(fn) {
        var cols, rows, _results;
        rows = 0;
        _results = [];
        while (rows < _.points.length) {
          cols = 0;
          while (cols < _.NUM_COLS) {
            fn(_.points[rows][cols], rows, cols);
            cols++;
          }
          _results.push(rows++);
        }
        return _results;
      }
    });
  };

  return Index;

})(AppView);

}, {"app/views/app_view":"src/app/views/app_view","./ball":"src/app/views/strings/ball","./constraint":"src/app/views/strings/constraint","draw/draw":"src/app/lib/draw/draw","draw/math/calc":"src/app/lib/draw/math/calc","./audio":"src/app/views/strings/audio"});
require.register('src/templates/attract/index', function(require, module, exports){
module.exports = function anonymous(locals) {
var buf = [];
;return buf.join("");
}
}, {});
require.register('src/templates/hole/index', function(require, module, exports){
module.exports = function anonymous(locals) {
var buf = [];
;return buf.join("");
}
}, {});
require.register('src/templates/magnets/index', function(require, module, exports){
module.exports = function anonymous(locals) {
var buf = [];
;return buf.join("");
}
}, {});
require.register('src/templates/pages/index', function(require, module, exports){
module.exports = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"border\"></div><div class=\"wrapper pages\"><div id=\"container\"></div><header class=\"header\"><a href=\"#\" class=\"logo-labs\"></a><div class=\"bold_line\"></div><h2 class=\"title\">Labs</h2><div class=\"thin_line\"></div></header><footer class=\"footer\"></footer></div>");;return buf.join("");
}
}, {});
require.register('src/templates/pages/menu', function(require, module, exports){
module.exports = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),labs = locals_.labs;buf.push("<div class=\"menu\"><div class=\"open\"><div class=\"arrow\"></div></div><ul class=\"nav\">");
// iterate labs
;(function(){
  var $$obj = labs;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var route = $$obj[index];

buf.push("<li> <a" + (jade.attrs({ 'href':("" + (route) + "") }, {"href":true})) + "><div class=\"white_dot\"></div><div class=\"dot\"></div></a></li>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var route = $$obj[index];

buf.push("<li> <a" + (jade.attrs({ 'href':("" + (route) + "") }, {"href":true})) + "><div class=\"white_dot\"></div><div class=\"dot\"></div></a></li>");
    }

  }
}).call(this);

buf.push("</ul></div>");;return buf.join("");
}
}, {});
require.register('src/templates/repulse/index', function(require, module, exports){
module.exports = function anonymous(locals) {
var buf = [];
;return buf.join("");
}
}, {});
require.register('src/templates/strings/index', function(require, module, exports){
module.exports = function anonymous(locals) {
var buf = [];
buf.push("<audio src=\"audio/wind-howl.mp3\" id=\"wind-audio\" loop=\"loop\"></audio>");;return buf.join("");
}
}, {});
require.register('vendors/dancer/dancer', function(require, module, exports){
/*
 * dancer - v0.4.0 - 2014-02-01
 * https://github.com/jsantell/dancer.js
 * Copyright (c) 2014 Jordan Santell
 * Licensed MIT
 */
(function() {

  var Dancer = function () {
    this.audioAdapter = Dancer._getAdapter( this );
    this.events = {};
    this.sections = [];
    this.bind( 'update', update );
  };

  Dancer.version = '0.3.2';
  Dancer.adapters = {};

  Dancer.prototype = {

    load : function ( source ) {
      var path;

      // Loading an Audio element
      if ( source instanceof HTMLElement ) {
        this.source = source;
        if ( Dancer.isSupported() === 'flash' ) {
          this.source = { src: Dancer._getMP3SrcFromAudio( source ) };
        }

      // Loading an object with src, [codecs]
      } else {
        this.source = window.Audio ? new Audio() : {};
        this.source.src = Dancer._makeSupportedPath( source.src, source.codecs );
      }

      this.audio = this.audioAdapter.load( this.source );
      return this;
    },

    /* Controls */

    play : function () {
      this.audioAdapter.play();
      return this;
    },

    pause : function () {
      this.audioAdapter.pause();
      return this;
    },

    setVolume : function ( volume ) {
      this.audioAdapter.setVolume( volume );
      return this;
    },


    /* Actions */

    createKick : function ( options ) {
      return new Dancer.Kick( this, options );
    },

    bind : function ( name, callback ) {
      if ( !this.events[ name ] ) {
        this.events[ name ] = [];
      }
      this.events[ name ].push( callback );
      return this;
    },

    unbind : function ( name ) {
      if ( this.events[ name ] ) {
        delete this.events[ name ];
      }
      return this;
    },

    trigger : function ( name ) {
      var _this = this;
      if ( this.events[ name ] ) {
        this.events[ name ].forEach(function( callback ) {
          callback.call( _this );
        });
      }
      return this;
    },


    /* Getters */

    getVolume : function () {
      return this.audioAdapter.getVolume();
    },

    getProgress : function () {
      return this.audioAdapter.getProgress();
    },

    getTime : function () {
      return this.audioAdapter.getTime();
    },

    // Returns the magnitude of a frequency or average over a range of frequencies
    getFrequency : function ( freq, endFreq ) {
      var sum = 0;
      if ( endFreq !== undefined ) {
        for ( var i = freq; i <= endFreq; i++ ) {
          sum += this.getSpectrum()[ i ];
        }
        return sum / ( endFreq - freq + 1 );
      } else {
        return this.getSpectrum()[ freq ];
      }
    },

    getWaveform : function () {
      return this.audioAdapter.getWaveform();
    },

    getSpectrum : function () {
      return this.audioAdapter.getSpectrum();
    },

    isLoaded : function () {
      return this.audioAdapter.isLoaded;
    },

    isPlaying : function () {
      return this.audioAdapter.isPlaying;
    },


    /* Sections */

    after : function ( time, callback ) {
      var _this = this;
      this.sections.push({
        condition : function () {
          return _this.getTime() > time;
        },
        callback : callback
      });
      return this;
    },

    before : function ( time, callback ) {
      var _this = this;
      this.sections.push({
        condition : function () {
          return _this.getTime() < time;
        },
        callback : callback
      });
      return this;
    },

    between : function ( startTime, endTime, callback ) {
      var _this = this;
      this.sections.push({
        condition : function () {
          return _this.getTime() > startTime && _this.getTime() < endTime;
        },
        callback : callback
      });
      return this;
    },

    onceAt : function ( time, callback ) {
      var
        _this = this,
        thisSection = null;
      this.sections.push({
        condition : function () {
          return _this.getTime() > time && !this.called;
        },
        callback : function () {
          callback.call( this );
          thisSection.called = true;
        },
        called : false
      });
      // Baking the section in the closure due to callback's this being the dancer instance
      thisSection = this.sections[ this.sections.length - 1 ];
      return this;
    }
  };

  function update () {
    for ( var i in this.sections ) {
      if ( this.sections[ i ].condition() )
        this.sections[ i ].callback.call( this );
    }
  }

  window.Dancer = Dancer;
})();

(function ( Dancer ) {

  var CODECS = {
    'mp3' : 'audio/mpeg;',
    'ogg' : 'audio/ogg; codecs="vorbis"',
    'wav' : 'audio/wav; codecs="1"',
    'aac' : 'audio/mp4; codecs="mp4a.40.2"'
  },
  audioEl = document.createElement( 'audio' );

  Dancer.options = {};

  Dancer.setOptions = function ( o ) {
    for ( var option in o ) {
      if ( o.hasOwnProperty( option ) ) {
        Dancer.options[ option ] = o[ option ];
      }
    }
  };

  Dancer.isSupported = function () {
    if ( !window.Float32Array || !window.Uint32Array ) {
      return null;
    } else if ( !isUnsupportedSafari() && ( window.AudioContext || window.webkitAudioContext )) {
      return 'webaudio';
    } else if ( audioEl && audioEl.mozSetup ) {
      return 'audiodata';
    } else if ( FlashDetect.versionAtLeast( 9 ) ) {
      return 'flash';
    } else {
      return '';
    }
  };

  Dancer.canPlay = function ( type ) {
    var canPlay = audioEl.canPlayType;
    return !!(
      Dancer.isSupported() === 'flash' ?
        type.toLowerCase() === 'mp3' :
        audioEl.canPlayType &&
        audioEl.canPlayType( CODECS[ type.toLowerCase() ] ).replace( /no/, ''));
  };

  Dancer.addPlugin = function ( name, fn ) {
    if ( Dancer.prototype[ name ] === undefined ) {
      Dancer.prototype[ name ] = fn;
    }
  };

  Dancer._makeSupportedPath = function ( source, codecs ) {
    if ( !codecs ) { return source; }

    for ( var i = 0; i < codecs.length; i++ ) {
      if ( Dancer.canPlay( codecs[ i ] ) ) {
        return source + '.' + codecs[ i ];
      }
    }
    return source;
  };

  Dancer._getAdapter = function ( instance ) {
    switch ( Dancer.isSupported() ) {
      case 'webaudio':
        return new Dancer.adapters.webaudio( instance );
      case 'audiodata':
        return new Dancer.adapters.moz( instance );
      case 'flash':
        return new Dancer.adapters.flash( instance );
      default:
        return null;
    }
  };

  Dancer._getMP3SrcFromAudio = function ( audioEl ) {
    var sources = audioEl.children;
    if ( audioEl.src ) { return audioEl.src; }
    for ( var i = sources.length; i--; ) {
      if (( sources[ i ].type || '' ).match( /audio\/mpeg/ )) return sources[ i ].src;
    }
    return null;
  };

  // Browser detection is lame, but Safari 6 has Web Audio API,
  // but does not support processing audio from a Media Element Source
  // https://gist.github.com/3265344
  function isUnsupportedSafari () {
    var
      isApple = !!( navigator.vendor || '' ).match( /Apple/ ),
      version = navigator.userAgent.match( /Version\/([^ ]*)/ );
    version = version ? parseFloat( version[ 1 ] ) : 0;
    return isApple && version <= 6;
  }

})( window.Dancer );

(function ( undefined ) {
  var Kick = function ( dancer, o ) {
    o = o || {};
    this.dancer    = dancer;
    this.frequency = o.frequency !== undefined ? o.frequency : [ 0, 10 ];
    this.threshold = o.threshold !== undefined ? o.threshold :  0.3;
    this.decay     = o.decay     !== undefined ? o.decay     :  0.02;
    this.onKick    = o.onKick;
    this.offKick   = o.offKick;
    this.isOn      = false;
    this.currentThreshold = this.threshold;

    var _this = this;
    this.dancer.bind( 'update', function () {
      _this.onUpdate();
    });
  };

  Kick.prototype = {
    on  : function () { 
      this.isOn = true;
      return this;
    },
    off : function () {
      this.isOn = false;
      return this;
    },

    set : function ( o ) {
      o = o || {};
      this.frequency = o.frequency !== undefined ? o.frequency : this.frequency;
      this.threshold = o.threshold !== undefined ? o.threshold : this.threshold;
      this.decay     = o.decay     !== undefined ? o.decay : this.decay;
      this.onKick    = o.onKick    || this.onKick;
      this.offKick   = o.offKick   || this.offKick;
    },

    onUpdate : function () {
      if ( !this.isOn ) { return; }
      var magnitude = this.maxAmplitude( this.frequency );
      if ( magnitude >= this.currentThreshold &&
          magnitude >= this.threshold ) {
        this.currentThreshold = magnitude;
        this.onKick && this.onKick.call( this.dancer, magnitude );
      } else {
        this.offKick && this.offKick.call( this.dancer, magnitude );
        this.currentThreshold -= this.decay;
      }
    },
    maxAmplitude : function ( frequency ) {
      var
        max = 0,
        fft = this.dancer.getSpectrum();

      // Sloppy array check
      if ( !frequency.length ) {
        return frequency < fft.length ?
          fft[ ~~frequency ] :
          null;
      }

      for ( var i = frequency[ 0 ], l = frequency[ 1 ]; i <= l; i++ ) {
        if ( fft[ i ] > max ) { max = fft[ i ]; }
      }
      return max;
    }
  };

  window.Dancer.Kick = Kick;
})();

(function() {
  var
    SAMPLE_SIZE = 2048,
    SAMPLE_RATE = 44100;

  var adapter = function ( dancer ) {
    this.dancer = dancer;
    this.audio = new Audio();
    this.context = window.AudioContext ?
      new window.AudioContext() :
      new window.webkitAudioContext();
  };

  adapter.prototype = {

    load : function ( _source ) {
      var _this = this;
      this.audio = _source;

      this.isLoaded = false;
      this.progress = 0;

      if (!this.context.createScriptProcessor) {
        this.context.createScriptProcessor = this.context.createJavascriptNode;
      }
      this.proc = this.context.createScriptProcessor( SAMPLE_SIZE / 2, 1, 1 );

      this.proc.onaudioprocess = function ( e ) {
        _this.update.call( _this, e );
      };
      if (!this.context.createGain) {
        this.context.createGain = this.context.createGainNode;
      }

      this.gain = this.context.createGain();

      this.fft = new FFT( SAMPLE_SIZE / 2, SAMPLE_RATE );
      this.signal = new Float32Array( SAMPLE_SIZE / 2 );

      if ( this.audio.readyState < 3 ) {
        this.audio.addEventListener( 'canplay', function () {
          connectContext.call( _this );
        });
      } else {
        connectContext.call( _this );
      }

      this.audio.addEventListener( 'progress', function ( e ) {
        if ( e.currentTarget.duration ) {
          _this.progress = e.currentTarget.seekable.end( 0 ) / e.currentTarget.duration;
        }
      });

      return this.audio;
    },

    play : function () {
      this.audio.play();
      this.isPlaying = true;
    },

    pause : function () {
      this.audio.pause();
      this.isPlaying = false;
    },

    setVolume : function ( volume ) {
      this.gain.gain.value = volume;
    },

    getVolume : function () {
      return this.gain.gain.value;
    },

    getProgress : function() {
      return this.progress;
    },

    getWaveform : function () {
      return this.signal;
    },

    getSpectrum : function () {
      return this.fft.spectrum;
    },

    getTime : function () {
      return this.audio.currentTime;
    },

    update : function ( e ) {
      if ( !this.isPlaying || !this.isLoaded ) return;

      var
        buffers = [],
        channels = e.inputBuffer.numberOfChannels,
        resolution = SAMPLE_SIZE / channels,
        sum = function ( prev, curr ) {
          return prev[ i ] + curr[ i ];
        }, i;

      for ( i = channels; i--; ) {
        buffers.push( e.inputBuffer.getChannelData( i ) );
      }

      for ( i = 0; i < resolution; i++ ) {
        this.signal[ i ] = channels > 1 ?
          buffers.reduce( sum ) / channels :
          buffers[ 0 ][ i ];
      }

      this.fft.forward( this.signal );
      this.dancer.trigger( 'update' );
    }
  };

  function connectContext () {
    this.source = this.context.createMediaElementSource( this.audio );
    this.source.connect( this.proc );
    this.source.connect( this.gain );
    this.gain.connect( this.context.destination );
    this.proc.connect( this.context.destination );

    this.isLoaded = true;
    this.progress = 1;
    this.dancer.trigger( 'loaded' );
  }

  Dancer.adapters.webaudio = adapter;

})();

(function() {

  var adapter = function ( dancer ) {
    this.dancer = dancer;
    this.audio = new Audio();
  };

  adapter.prototype = {

    load : function ( _source ) {
      var _this = this;
      this.audio = _source;

      this.isLoaded = false;
      this.progress = 0;

      if ( this.audio.readyState < 3 ) {
        this.audio.addEventListener( 'loadedmetadata', function () {
          getMetadata.call( _this );
        }, false);
      } else {
        getMetadata.call( _this );
      }

      this.audio.addEventListener( 'MozAudioAvailable', function ( e ) {
        _this.update( e );
      }, false);

      this.audio.addEventListener( 'progress', function ( e ) {
        if ( e.currentTarget.duration ) {
          _this.progress = e.currentTarget.seekable.end( 0 ) / e.currentTarget.duration;
        }
      }, false);

      return this.audio;
    },

    play : function () {
      this.audio.play();
      this.isPlaying = true;
    },

    pause : function () {
      this.audio.pause();
      this.isPlaying = false;
    },

    setVolume : function ( volume ) {
      this.audio.volume = volume;
    },

    getVolume : function () {
      return this.audio.volume;
    },

    getProgress : function () {
      return this.progress;
    },

    getWaveform : function () {
      return this.signal;
    },

    getSpectrum : function () {
      return this.fft.spectrum;
    },

    getTime : function () {
      return this.audio.currentTime;
    },

    update : function ( e ) {
      if ( !this.isPlaying || !this.isLoaded ) return;

      for ( var i = 0, j = this.fbLength / 2; i < j; i++ ) {
        this.signal[ i ] = ( e.frameBuffer[ 2 * i ] + e.frameBuffer[ 2 * i + 1 ] ) / 2;
      }

      this.fft.forward( this.signal );
      this.dancer.trigger( 'update' );
    }
  };

  function getMetadata () {
    this.fbLength = this.audio.mozFrameBufferLength;
    this.channels = this.audio.mozChannels;
    this.rate     = this.audio.mozSampleRate;
    this.fft      = new FFT( this.fbLength / this.channels, this.rate );
    this.signal   = new Float32Array( this.fbLength / this.channels );
    this.isLoaded = true;
    this.progress = 1;
    this.dancer.trigger( 'loaded' );
  }

  Dancer.adapters.moz = adapter;

})();

(function() {
  var
    SAMPLE_SIZE  = 1024,
    SAMPLE_RATE  = 44100,
    smLoaded     = false,
    smLoading    = false,
    CONVERSION_COEFFICIENT = 0.93;

  var adapter = function ( dancer ) {
    this.dancer = dancer;
    this.wave_L = [];
    this.wave_R = [];
    this.spectrum = [];
    window.SM2_DEFER = true;
  };

  adapter.prototype = {
    // `source` can be either an Audio element, if supported, or an object
    // either way, the path is stored in the `src` property
    load : function ( source ) {
      var _this = this;
      this.path = source ? source.src : this.path;

      this.isLoaded = false;
      this.progress = 0;

      !window.soundManager && !smLoading && loadSM.call( this );

      if ( window.soundManager ) {
        this.audio = soundManager.createSound({
          id       : 'dancer' + Math.random() + '',
          url      : this.path,
          stream   : true,
          autoPlay : false,
          autoLoad : true,
          whileplaying : function () {
            _this.update();
          },
          whileloading : function () {
            _this.progress = this.bytesLoaded / this.bytesTotal;
          },
          onload   : function () {
            _this.fft = new FFT( SAMPLE_SIZE, SAMPLE_RATE );
            _this.signal = new Float32Array( SAMPLE_SIZE );
            _this.waveform = new Float32Array( SAMPLE_SIZE );
            _this.isLoaded = true;
            _this.progress = 1;
            _this.dancer.trigger( 'loaded' );
          }
        });
        this.dancer.audio = this.audio;
      }

      // Returns audio if SM already loaded -- otherwise,
      // sets dancer instance's audio property after load
      return this.audio;
    },

    play : function () {
      this.audio.play();
      this.isPlaying = true;
    },

    pause : function () {
      this.audio.pause();
      this.isPlaying = false;
    },

    setVolume : function ( volume ) {
      this.audio.setVolume( volume * 100 );
    },

    getVolume : function () {
      return this.audio.volume / 100;
    },

    getProgress : function () {
      return this.progress;
    },

    getWaveform : function () {
      return this.waveform;
    },

    getSpectrum : function () {
      return this.fft.spectrum;
    },

    getTime : function () {
      return this.audio.position / 1000;
    },

    update : function () {
      if ( !this.isPlaying && !this.isLoaded ) return;
      this.wave_L = this.audio.waveformData.left;
      this.wave_R = this.audio.waveformData.right;
      var avg;
      for ( var i = 0, j = this.wave_L.length; i < j; i++ ) {
        avg = parseFloat(this.wave_L[ i ]) + parseFloat(this.wave_R[ i ]);
        this.waveform[ 2 * i ]     = avg / 2;
        this.waveform[ i * 2 + 1 ] = avg / 2;
        this.signal[ 2 * i ]       = avg * CONVERSION_COEFFICIENT;
        this.signal[ i * 2 + 1 ]   = avg * CONVERSION_COEFFICIENT;
      }

      this.fft.forward( this.signal );
      this.dancer.trigger( 'update' );
    }
  };

  function loadSM () {
    var adapter = this;
    smLoading = true;
    loadScript( Dancer.options.flashJS, function () {
      soundManager = new SoundManager();
      soundManager.flashVersion = 9;
      soundManager.flash9Options.useWaveformData = true;
      soundManager.useWaveformData = true;
      soundManager.useHighPerformance = true;
      soundManager.useFastPolling = true;
      soundManager.multiShot = false;
      soundManager.debugMode = false;
      soundManager.debugFlash = false;
      soundManager.url = Dancer.options.flashSWF;
      soundManager.onready(function () {
        smLoaded = true;
        adapter.load();
      });
      soundManager.ontimeout(function(){
        console.error( 'Error loading SoundManager2.swf' );
      });
      soundManager.beginDelayedInit();
    });
  }

  function loadScript ( url, callback ) {
    var
      script   = document.createElement( 'script' ),
      appender = document.getElementsByTagName( 'script' )[0];
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    appender.parentNode.insertBefore( script, appender );
  }

  Dancer.adapters.flash = adapter;

})();

/* 
 *  DSP.js - a comprehensive digital signal processing  library for javascript
 * 
 *  Created by Corban Brook <corbanbrook@gmail.com> on 2010-01-01.
 *  Copyright 2010 Corban Brook. All rights reserved.
 *
 */

// Fourier Transform Module used by DFT, FFT, RFFT
function FourierTransform(bufferSize, sampleRate) {
  this.bufferSize = bufferSize;
  this.sampleRate = sampleRate;
  this.bandwidth  = 2 / bufferSize * sampleRate / 2;

  this.spectrum   = new Float32Array(bufferSize/2);
  this.real       = new Float32Array(bufferSize);
  this.imag       = new Float32Array(bufferSize);

  this.peakBand   = 0;
  this.peak       = 0;

  /**
   * Calculates the *middle* frequency of an FFT band.
   *
   * @param {Number} index The index of the FFT band.
   *
   * @returns The middle frequency in Hz.
   */
  this.getBandFrequency = function(index) {
    return this.bandwidth * index + this.bandwidth / 2;
  };

  this.calculateSpectrum = function() {
    var spectrum  = this.spectrum,
        real      = this.real,
        imag      = this.imag,
        bSi       = 2 / this.bufferSize,
        sqrt      = Math.sqrt,
        rval, 
        ival,
        mag;

    for (var i = 0, N = bufferSize/2; i < N; i++) {
      rval = real[i];
      ival = imag[i];
      mag = bSi * sqrt(rval * rval + ival * ival);

      if (mag > this.peak) {
        this.peakBand = i;
        this.peak = mag;
      }

      spectrum[i] = mag;
    }
  };
}

/**
 * FFT is a class for calculating the Discrete Fourier Transform of a signal
 * with the Fast Fourier Transform algorithm.
 *
 * @param {Number} bufferSize The size of the sample buffer to be computed. Must be power of 2
 * @param {Number} sampleRate The sampleRate of the buffer (eg. 44100)
 *
 * @constructor
 */
function FFT(bufferSize, sampleRate) {
  FourierTransform.call(this, bufferSize, sampleRate);
   
  this.reverseTable = new Uint32Array(bufferSize);

  var limit = 1;
  var bit = bufferSize >> 1;

  var i;

  while (limit < bufferSize) {
    for (i = 0; i < limit; i++) {
      this.reverseTable[i + limit] = this.reverseTable[i] + bit;
    }

    limit = limit << 1;
    bit = bit >> 1;
  }

  this.sinTable = new Float32Array(bufferSize);
  this.cosTable = new Float32Array(bufferSize);

  for (i = 0; i < bufferSize; i++) {
    this.sinTable[i] = Math.sin(-Math.PI/i);
    this.cosTable[i] = Math.cos(-Math.PI/i);
  }
}

/**
 * Performs a forward transform on the sample buffer.
 * Converts a time domain signal to frequency domain spectra.
 *
 * @param {Array} buffer The sample buffer. Buffer Length must be power of 2
 *
 * @returns The frequency spectrum array
 */
FFT.prototype.forward = function(buffer) {
  // Locally scope variables for speed up
  var bufferSize      = this.bufferSize,
      cosTable        = this.cosTable,
      sinTable        = this.sinTable,
      reverseTable    = this.reverseTable,
      real            = this.real,
      imag            = this.imag,
      spectrum        = this.spectrum;

  var k = Math.floor(Math.log(bufferSize) / Math.LN2);

  if (Math.pow(2, k) !== bufferSize) { throw "Invalid buffer size, must be a power of 2."; }
  if (bufferSize !== buffer.length)  { throw "Supplied buffer is not the same size as defined FFT. FFT Size: " + bufferSize + " Buffer Size: " + buffer.length; }

  var halfSize = 1,
      phaseShiftStepReal,
      phaseShiftStepImag,
      currentPhaseShiftReal,
      currentPhaseShiftImag,
      off,
      tr,
      ti,
      tmpReal,
      i;

  for (i = 0; i < bufferSize; i++) {
    real[i] = buffer[reverseTable[i]];
    imag[i] = 0;
  }

  while (halfSize < bufferSize) {
    //phaseShiftStepReal = Math.cos(-Math.PI/halfSize);
    //phaseShiftStepImag = Math.sin(-Math.PI/halfSize);
    phaseShiftStepReal = cosTable[halfSize];
    phaseShiftStepImag = sinTable[halfSize];
    
    currentPhaseShiftReal = 1;
    currentPhaseShiftImag = 0;

    for (var fftStep = 0; fftStep < halfSize; fftStep++) {
      i = fftStep;

      while (i < bufferSize) {
        off = i + halfSize;
        tr = (currentPhaseShiftReal * real[off]) - (currentPhaseShiftImag * imag[off]);
        ti = (currentPhaseShiftReal * imag[off]) + (currentPhaseShiftImag * real[off]);

        real[off] = real[i] - tr;
        imag[off] = imag[i] - ti;
        real[i] += tr;
        imag[i] += ti;

        i += halfSize << 1;
      }

      tmpReal = currentPhaseShiftReal;
      currentPhaseShiftReal = (tmpReal * phaseShiftStepReal) - (currentPhaseShiftImag * phaseShiftStepImag);
      currentPhaseShiftImag = (tmpReal * phaseShiftStepImag) + (currentPhaseShiftImag * phaseShiftStepReal);
    }

    halfSize = halfSize << 1;
  }

  return this.calculateSpectrum();
};

/*
Copyright (c) Copyright (c) 2007, Carl S. Yestrau All rights reserved.
Code licensed under the BSD License: http://www.featureblend.com/license.txt
Version: 1.0.4
*/
var FlashDetect = new function(){
    var self = this;
    self.installed = false;
    self.raw = "";
    self.major = -1;
    self.minor = -1;
    self.revision = -1;
    self.revisionStr = "";
    var activeXDetectRules = [
        {
            "name":"ShockwaveFlash.ShockwaveFlash.7",
            "version":function(obj){
                return getActiveXVersion(obj);
            }
        },
        {
            "name":"ShockwaveFlash.ShockwaveFlash.6",
            "version":function(obj){
                var version = "6,0,21";
                try{
                    obj.AllowScriptAccess = "always";
                    version = getActiveXVersion(obj);
                }catch(err){}
                return version;
            }
        },
        {
            "name":"ShockwaveFlash.ShockwaveFlash",
            "version":function(obj){
                return getActiveXVersion(obj);
            }
        }
    ];
    /**
     * Extract the ActiveX version of the plugin.
     * 
     * @param {Object} The flash ActiveX object.
     * @type String
     */
    var getActiveXVersion = function(activeXObj){
        var version = -1;
        try{
            version = activeXObj.GetVariable("$version");
        }catch(err){}
        return version;
    };
    /**
     * Try and retrieve an ActiveX object having a specified name.
     * 
     * @param {String} name The ActiveX object name lookup.
     * @return One of ActiveX object or a simple object having an attribute of activeXError with a value of true.
     * @type Object
     */
    var getActiveXObject = function(name){
        var obj = -1;
        try{
            obj = new ActiveXObject(name);
        }catch(err){
            obj = {activeXError:true};
        }
        return obj;
    };
    /**
     * Parse an ActiveX $version string into an object.
     * 
     * @param {String} str The ActiveX Object GetVariable($version) return value. 
     * @return An object having raw, major, minor, revision and revisionStr attributes.
     * @type Object
     */
    var parseActiveXVersion = function(str){
        var versionArray = str.split(",");//replace with regex
        return {
            "raw":str,
            "major":parseInt(versionArray[0].split(" ")[1], 10),
            "minor":parseInt(versionArray[1], 10),
            "revision":parseInt(versionArray[2], 10),
            "revisionStr":versionArray[2]
        };
    };
    /**
     * Parse a standard enabledPlugin.description into an object.
     * 
     * @param {String} str The enabledPlugin.description value.
     * @return An object having raw, major, minor, revision and revisionStr attributes.
     * @type Object
     */
    var parseStandardVersion = function(str){
        var descParts = str.split(/ +/);
        var majorMinor = descParts[2].split(/\./);
        var revisionStr = descParts[3];
        return {
            "raw":str,
            "major":parseInt(majorMinor[0], 10),
            "minor":parseInt(majorMinor[1], 10), 
            "revisionStr":revisionStr,
            "revision":parseRevisionStrToInt(revisionStr)
        };
    };
    /**
     * Parse the plugin revision string into an integer.
     * 
     * @param {String} The revision in string format.
     * @type Number
     */
    var parseRevisionStrToInt = function(str){
        return parseInt(str.replace(/[a-zA-Z]/g, ""), 10) || self.revision;
    };
    /**
     * Is the major version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required major version.
     * @type Boolean
     */
    self.majorAtLeast = function(version){
        return self.major >= version;
    };
    /**
     * Is the minor version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required minor version.
     * @type Boolean
     */
    self.minorAtLeast = function(version){
        return self.minor >= version;
    };
    /**
     * Is the revision version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required revision version.
     * @type Boolean
     */
    self.revisionAtLeast = function(version){
        return self.revision >= version;
    };
    /**
     * Is the version greater than or equal to a specified major, minor and revision.
     * 
     * @param {Number} major The minimum required major version.
     * @param {Number} (Optional) minor The minimum required minor version.
     * @param {Number} (Optional) revision The minimum required revision version.
     * @type Boolean
     */
    self.versionAtLeast = function(major){
        var properties = [self.major, self.minor, self.revision];
        var len = Math.min(properties.length, arguments.length);
        for(i=0; i<len; i++){
            if(properties[i]>=arguments[i]){
                if(i+1<len && properties[i]==arguments[i]){
                    continue;
                }else{
                    return true;
                }
            }else{
                return false;
            }
        }
    };
    /**
     * Constructor, sets raw, major, minor, revisionStr, revision and installed public properties.
     */
    self.FlashDetect = function(){
        if(navigator.plugins && navigator.plugins.length>0){
            var type = 'application/x-shockwave-flash';
            var mimeTypes = navigator.mimeTypes;
            if(mimeTypes && mimeTypes[type] && mimeTypes[type].enabledPlugin && mimeTypes[type].enabledPlugin.description){
                var version = mimeTypes[type].enabledPlugin.description;
                var versionObj = parseStandardVersion(version);
                self.raw = versionObj.raw;
                self.major = versionObj.major;
                self.minor = versionObj.minor; 
                self.revisionStr = versionObj.revisionStr;
                self.revision = versionObj.revision;
                self.installed = true;
            }
        }else if(navigator.appVersion.indexOf("Mac")==-1 && window.execScript){
            var version = -1;
            for(var i=0; i<activeXDetectRules.length && version==-1; i++){
                var obj = getActiveXObject(activeXDetectRules[i].name);
                if(!obj.activeXError){
                    self.installed = true;
                    version = activeXDetectRules[i].version(obj);
                    if(version!=-1){
                        var versionObj = parseActiveXVersion(version);
                        self.raw = versionObj.raw;
                        self.major = versionObj.major;
                        self.minor = versionObj.minor; 
                        self.revision = versionObj.revision;
                        self.revisionStr = versionObj.revisionStr;
                    }
                }
            }
        }
    }();
};
FlashDetect.JS_RELEASE = "1.0.4";
}, {});
require.register('vendors/jquery/jquery.spritefy', function(require, module, exports){
(function($)
{
	/*
	 * Author: Giulian Drimba
	 * 
	*/
	
	$.fn.spritefy = function(animation_name,p_options)
	{
		var options = p_options;
		var el = this;

		resetElement();
		el.removeClass();
		el.addClass(animation_name);

		applyBaseCSS();
		applyOptions();

		var api = {}

		api.play = function()
		{
			api.status = "playing";
			applyCSS("animation-play-state","running");

			return api;
		}

		api.pause = function()
		{
			api.status = "paused";
			applyCSS("animation-play-state","paused");

			return api;
		}

		el.bind("animationstart", onAnimation);  
		el.bind("webkitAnimationStart", onAnimation);


		el.bind("animationend", onAnimation);  
		el.bind("webkitAnimationEnd", onAnimation);

		el.bind("animationiteration", onAnimation);
		el.bind("webkitAnimationIteration", onAnimation);

		function onAnimation(e) 
		{  
			switch(e.type) 
			{
		    	case "animationstart":
		    		triggerStart();
		    			break; 
		    	case "webkitAnimationStart":
		    		triggerStart();
		    		break;  
		    	case "animationend": 
		    		triggerComplete();
		    		break;
		    	case "webkitAnimationEnd":
		      		triggerComplete();
		      		break;  
		    	case "animationiteration":  
			    	triggerIteration();
			      		break;
		    	case "webkitAnimationIteration":
		      		triggerIteration();
		      		break;  
		  	}  
		} 

		function triggerComplete()
		{
			el.removeAttr("style");
			if(options.onComplete)
			{
				options.onComplete();
			}
		}

		function triggerIteration(time)
		{
			if(options.onIteration)
				options.onIteration();
		}

		function triggerStart()
		{
			if(options.onStart)
				options.onStart();
		}

		function applyOptions()
		{
			if(options.duration)
			{
				applyCSS("animation-duration",options.duration.toString()+"s");
			}

			if(options.delay)
			{
				applyCSS("animation-delay",options.delay.toString()+"s");
			}

			if(options.count)
			{
				applyCSS("animation-iteration-count",options.count.toString());
			}
		}

		function applyBaseCSS()
		{

			applyCSS("animation-name", animation_name);
			applyCSS("animation-timing-function","step-end");
			applyCSS("animation-iteration-count","infinite");
			applyCSS("animation-fill-mode","backwards");
		}

		function applyCSS(property, value)
		{
			el.css("-webkit-"+property,value);
			el.css("-moz-"+property,value);
		}

		function resetElement()
		{
			el.removeClass(animation_name);

			el.unbind("animationstart");
			el.unbind("webkitAnimationStart");
			el.unbind("animationend");  
			el.unbind("webkitAnimationEnd"); 
			el.unbind("animationiteration");
			el.unbind("webkitAnimationIteration");
		}

		$.fn.animation = api;

		api.pause();

		return api;
	}

})(jQuery)
}, {});
require.register('vendors/sketch/sketch', function(require, module, exports){

/* Copyright (C) 2013 Justin Windle, http://soulwire.co.uk */

window.Sketch = (function() {

    "use strict";

    /*
    ----------------------------------------------------------------------

        Config

    ----------------------------------------------------------------------
    */

    var MATH_PROPS = 'E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min'.split( ' ' );
    var HAS_SKETCH = '__hasSketch';
    var M = Math;

    var CANVAS = 'canvas';
    var WEBGL = 'webgl';
    var DOM = 'dom';

    var doc = document;
    var win = window;

    var instances = [];

    var defaults = {

        fullscreen: true,
        autostart: true,
        autoclear: true,
        autopause: true,
        container: doc.body,
        interval: 1,
        globals: true,
        retina: false,
        type: CANVAS
    };

    var keyMap = {

         8: 'BACKSPACE',
         9: 'TAB',
        13: 'ENTER',
        16: 'SHIFT',
        27: 'ESCAPE',
        32: 'SPACE',
        37: 'LEFT',
        38: 'UP',
        39: 'RIGHT',
        40: 'DOWN'
    };

    /*
    ----------------------------------------------------------------------

        Utilities

    ----------------------------------------------------------------------
    */

    function isArray( object ) {

        return Object.prototype.toString.call( object ) == '[object Array]';
    }

    function isFunction( object ) {

        return typeof object == 'function';
    }

    function isNumber( object ) {

        return typeof object == 'number';
    }

    function isString( object ) {

        return typeof object == 'string';
    }

    function keyName( code ) {

        return keyMap[ code ] || String.fromCharCode( code );
    }

    function extend( target, source, overwrite ) {

        for ( var key in source )

            if ( overwrite || !( key in target ) )

                target[ key ] = source[ key ];

        return target;
    }

    function proxy( method, context ) {

        return function() {

            method.apply( context, arguments );
        };
    }

    function clone( target ) {

        var object = {};

        for ( var key in target ) {

            if ( isFunction( target[ key ] ) )

                object[ key ] = proxy( target[ key ], target );

            else

                object[ key ] = target[ key ];
        }

        return object;
    }

    /*
    ----------------------------------------------------------------------

        Constructor

    ----------------------------------------------------------------------
    */

    function constructor( context ) {

        var request, handler, target, parent, bounds, index, suffix, clock, node, copy, type, key, val, min, max;

        var counter = 0;
        var touches = [];
        var setup = false;
        var ratio = win.devicePixelRatio;
        var isDiv = context.type == DOM;
        var is2D = context.type == CANVAS;

        var mouse = {
            x:  0.0, y:  0.0,
            ox: 0.0, oy: 0.0,
            dx: 0.0, dy: 0.0
        };

        var eventMap = [

            context.element,

                pointer, 'mousedown', 'touchstart',
                pointer, 'mousemove', 'touchmove',
                pointer, 'mouseup', 'touchend',
                pointer, 'click',

            doc,

                keypress, 'keydown', 'keyup',

            win,

                active, 'focus', 'blur',
                resize, 'resize'
        ];

        var keys = {}; for ( key in keyMap ) keys[ keyMap[ key ] ] = false;

        function trigger( method ) {

            if ( isFunction( method ) )

                method.apply( context, [].splice.call( arguments, 1 ) );
        }

        function bind( on ) {

            for ( index = 0; index < eventMap.length; index++ ) {

                node = eventMap[ index ];

                if ( isString( node ) )

                    target[ ( on ? 'add' : 'remove' ) + 'EventListener' ].call( target, node, handler, false );

                else if ( isFunction( node ) )

                    handler = node;

                else target = node;
            }
        }

        function update() {

            cAF( request );
            request = rAF( update );

            if ( !setup ) {

                trigger( context.setup );
                setup = isFunction( context.setup );
                trigger( context.resize );
            }

            if ( context.running && !counter ) {

                context.dt = ( clock = +new Date() ) - context.now;
                context.millis += context.dt;
                context.now = clock;

                trigger( context.update );

                if ( context.autoclear && is2D )

                    context.clear();

                trigger( context.draw );
            }

            counter = ++counter % context.interval;
        }

        function resize() {

            target = isDiv ? context.style : context.canvas;
            suffix = isDiv ? 'px' : '';

            if ( context.fullscreen ) {

                context.height = win.innerHeight;
                context.width = win.innerWidth;
            }

            target.height = context.height + suffix;
            target.width = context.width + suffix;

            if ( context.retina && is2D && ratio ) {

                target.height = context.height * ratio;
                target.width = context.width * ratio;

                target.style.height = context.height + 'px';
                target.style.width = context.width + 'px';

                context.scale( ratio, ratio );
            }

            if ( setup ) trigger( context.resize );
        }

        function align( touch, target ) {

            bounds = target.getBoundingClientRect();

            touch.x = touch.pageX - bounds.left - win.scrollX;
            touch.y = touch.pageY - bounds.top - win.scrollY;

            return touch;
        }

        function augment( touch, target ) {

            align( touch, context.element );

            target = target || {};

            target.ox = target.x || touch.x;
            target.oy = target.y || touch.y;

            target.x = touch.x;
            target.y = touch.y;

            target.dx = target.x - target.ox;
            target.dy = target.y - target.oy;

            return target;
        }

        function process( event ) {

            event.preventDefault();

            copy = clone( event );
            copy.originalEvent = event;

            if ( copy.touches ) {

                touches.length = copy.touches.length;

                for ( index = 0; index < copy.touches.length; index++ )

                    touches[ index ] = augment( copy.touches[ index ], touches[ index ] );

            } else {

                touches.length = 0;
                touches[0] = augment( copy, mouse );
            }

            extend( mouse, touches[0], true );

            return copy;
        }

        function pointer( event ) {

            event = process( event );

            min = ( max = eventMap.indexOf( type = event.type ) ) - 1;

            context.dragging =

                /down|start/.test( type ) ? true :

                /up|end/.test( type ) ? false :

                context.dragging;

            while( min )

                isString( eventMap[ min ] ) ?

                    trigger( context[ eventMap[ min-- ] ], event ) :

                isString( eventMap[ max ] ) ?

                    trigger( context[ eventMap[ max++ ] ], event ) :

                min = 0;
        }

        function keypress( event ) {

            key = event.keyCode;
            val = event.type == 'keyup';
            keys[ key ] = keys[ keyName( key ) ] = !val;

            trigger( context[ event.type ], event );
        }

        function active( event ) {

            if ( context.autopause )

                ( event.type == 'blur' ? stop : start )();

            trigger( context[ event.type ], event );
        }

        // Public API

        function start() {

            context.now = +new Date();
            context.running = true;
        }

        function stop() {

            context.running = false;
        }

        function toggle() {

            ( context.running ? stop : start )();
        }

        function clear() {

            if ( is2D )

                context.clearRect( 0, 0, context.width, context.height );
        }

        function destroy() {

            parent = context.element.parentNode;
            index = instances.indexOf( context );

            if ( parent ) parent.removeChild( context.element );
            if ( ~index ) instances.splice( index, 1 );

            bind( false );
            stop();
        }

        extend( context, {

            touches: touches,
            mouse: mouse,
            keys: keys,

            dragging: false,
            running: false,
            millis: 0,
            now: NaN,
            dt: NaN,

            destroy: destroy,
            toggle: toggle,
            clear: clear,
            start: start,
            stop: stop
        });

        instances.push( context );

        return ( context.autostart && start(), bind( true ), resize(), update(), context );
    }

    /*
    ----------------------------------------------------------------------

        Global API

    ----------------------------------------------------------------------
    */

    var element, context, Sketch = {

        CANVAS: CANVAS,
        WEB_GL: WEBGL,
        WEBGL: WEBGL,
        DOM: DOM,

        instances: instances,

        install: function( context ) {

            if ( !context[ HAS_SKETCH ] ) {

                for ( var i = 0; i < MATH_PROPS.length; i++ )

                    context[ MATH_PROPS[i] ] = M[ MATH_PROPS[i] ];

                extend( context, {

                    TWO_PI: M.PI * 2,
                    HALF_PI: M.PI / 2,
                    QUATER_PI: M.PI / 4,

                    random: function( min, max ) {

                        if ( isArray( min ) )

                            return min[ ~~( M.random() * min.length ) ];

                        if ( !isNumber( max ) )

                            max = min || 1, min = 0;

                        return min + M.random() * ( max - min );
                    },

                    lerp: function( min, max, amount ) {

                        return min + amount * ( max - min );
                    },

                    map: function( num, minA, maxA, minB, maxB ) {

                        return ( num - minA ) / ( maxA - minA ) * ( maxB - minB ) + minB;
                    }
                });

                context[ HAS_SKETCH ] = true;
            }
        },

        create: function( options ) {

            options = extend( options || {}, defaults );

            if ( options.globals ) Sketch.install( self );

            element = options.element = options.element || doc.createElement( options.type === DOM ? 'div' : 'canvas' );

            context = options.context = options.context || (function() {

                switch( options.type ) {

                    case CANVAS:

                        return element.getContext( '2d', options );

                    case WEBGL:

                        return element.getContext( 'webgl', options ) || element.getContext( 'experimental-webgl', options );

                    case DOM:

                        return element.canvas = element;
                }

            })();

            ( options.container || doc.body ).appendChild( element );

            return Sketch.augment( context, options );
        },

        augment: function( context, options ) {

            options = extend( options || {}, defaults );

            options.element = context.canvas || context;
            options.element.className += ' sketch';

            extend( context, options, true );

            return constructor( context );
        }
    };

    /*
    ----------------------------------------------------------------------

        Shims

    ----------------------------------------------------------------------
    */

    var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
    var scope = self;
    var then = 0;

    var a = 'AnimationFrame';
    var b = 'request' + a;
    var c = 'cancel' + a;

    var rAF = scope[ b ];
    var cAF = scope[ c ];

    for ( var i = 0; i < vendors.length && !rAF; i++ ) {

        rAF = scope[ vendors[ i ] + 'Request' + a ];
        cAF = scope[ vendors[ i ] + 'Cancel' + a ];
    }

    scope[ b ] = rAF = rAF || function( callback ) {

        var now = +new Date();
        var dt = M.max( 0, 16 - ( now - then ) );
        var id = setTimeout( function() {
            callback( now + dt );
        }, dt );

        then = now + dt;
        return id;
    };

    scope[ c ] = cAF = cAF || function( id ) {
        clearTimeout( id );
    };

    /*
    ----------------------------------------------------------------------

        Output

    ----------------------------------------------------------------------
    */

    return Sketch;

})();
}, {});
require.register('vendors/theoricus/node_modules/lodash/dist/lodash', function(require, module, exports){
/**
 * @license
 * Lo-Dash 1.3.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modern -o ./dist/lodash.js`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.4.4 <http://underscorejs.org/>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
 * Available under MIT license <http://lodash.com/license>
 */
;(function(window) {

  /** Used as a safe reference for `undefined` in pre ES5 environments */
  var undefined;

  /** Used to pool arrays and objects used internally */
  var arrayPool = [],
      objectPool = [];

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used internally to indicate various things */
  var indicatorObject = {};

  /** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
  var keyPrefix = +new Date + '';

  /** Used as the size when optimizations are enabled for large arrays */
  var largeArraySize = 75;

  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g;

  /**
   * Used to match ES6 template delimiters
   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-7.8.6
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to match "interpolate" template delimiters */
  var reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to detect functions containing a `this` reference */
  var reThis = (reThis = /\bthis\b/) && reThis.test(runInContext) && reThis;

  /** Used to detect and test whitespace */
  var whitespace = (
    // whitespace
    ' \t\x0B\f\xA0\ufeff' +

    // line terminators
    '\n\r\u2028\u2029' +

    // unicode category "Zs" space separators
    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
  );

  /** Used to match leading whitespace and zeros to be removed */
  var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

  /** Used to ensure capturing order of template delimiters */
  var reNoMatch = /($^)/;

  /** Used to match HTML characters */
  var reUnescapedHtml = /[&<>"']/g;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to assign default `context` object properties */
  var contextProps = [
    'Array', 'Boolean', 'Date', 'Function', 'Math', 'Number', 'Object',
    'RegExp', 'String', '_', 'attachEvent', 'clearTimeout', 'isFinite', 'isNaN',
    'parseInt', 'setImmediate', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      errorClass = '[object Error]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[funcClass] = false;
  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && module.exports == freeExports && module;

  /** Detect free variable `global`, from Node.js or Browserified code, and use it as `window` */
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    window = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * A basic implementation of `_.indexOf` without support for binary searches
   * or `fromIndex` constraints.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Mixed} value The value to search for.
   * @param {Number} [fromIndex=0] The index to search from.
   * @returns {Number} Returns the index of the matched value or `-1`.
   */
  function basicIndexOf(array, value, fromIndex) {
    var index = (fromIndex || 0) - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * An implementation of `_.contains` for cache objects that mimics the return
   * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
   *
   * @private
   * @param {Object} cache The cache object to inspect.
   * @param {Mixed} value The value to search for.
   * @returns {Number} Returns `0` if `value` is found, else `-1`.
   */
  function cacheIndexOf(cache, value) {
    var type = typeof value;
    cache = cache.cache;

    if (type == 'boolean' || value == null) {
      return cache[value];
    }
    if (type != 'number' && type != 'string') {
      type = 'object';
    }
    var key = type == 'number' ? value : keyPrefix + value;
    cache = cache[type] || (cache[type] = {});

    return type == 'object'
      ? (cache[key] && basicIndexOf(cache[key], value) > -1 ? 0 : -1)
      : (cache[key] ? 0 : -1);
  }

  /**
   * Adds a given `value` to the corresponding cache object.
   *
   * @private
   * @param {Mixed} value The value to add to the cache.
   */
  function cachePush(value) {
    var cache = this.cache,
        type = typeof value;

    if (type == 'boolean' || value == null) {
      cache[value] = true;
    } else {
      if (type != 'number' && type != 'string') {
        type = 'object';
      }
      var key = type == 'number' ? value : keyPrefix + value,
          typeCache = cache[type] || (cache[type] = {});

      if (type == 'object') {
        if ((typeCache[key] || (typeCache[key] = [])).push(value) == this.array.length) {
          cache[type] = false;
        }
      } else {
        typeCache[key] = true;
      }
    }
  }

  /**
   * Used by `_.max` and `_.min` as the default `callback` when a given
   * `collection` is a string value.
   *
   * @private
   * @param {String} value The character to inspect.
   * @returns {Number} Returns the code unit of given character.
   */
  function charAtCallback(value) {
    return value.charCodeAt(0);
  }

  /**
   * Used by `sortBy` to compare transformed `collection` values, stable sorting
   * them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {Number} Returns the sort order indicator of `1` or `-1`.
   */
  function compareAscending(a, b) {
    var ai = a.index,
        bi = b.index;

    a = a.criteria;
    b = b.criteria;

    // ensure a stable sort in V8 and other engines
    // http://code.google.com/p/v8/issues/detail?id=90
    if (a !== b) {
      if (a > b || typeof a == 'undefined') {
        return 1;
      }
      if (a < b || typeof b == 'undefined') {
        return -1;
      }
    }
    return ai < bi ? -1 : 1;
  }

  /**
   * Creates a cache object to optimize linear searches of large arrays.
   *
   * @private
   * @param {Array} [array=[]] The array to search.
   * @returns {Null|Object} Returns the cache object or `null` if caching should not be used.
   */
  function createCache(array) {
    var index = -1,
        length = array.length;

    var cache = getObject();
    cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

    var result = getObject();
    result.array = array;
    result.cache = cache;
    result.push = cachePush;

    while (++index < length) {
      result.push(array[index]);
    }
    return cache.object === false
      ? (releaseObject(result), null)
      : result;
  }

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {String} match The matched character to escape.
   * @returns {String} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return '\\' + stringEscapes[match];
  }

  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }

  /**
   * Gets an object from the object pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Object} The object from the pool.
   */
  function getObject() {
    return objectPool.pop() || {
      'array': null,
      'cache': null,
      'criteria': null,
      'false': false,
      'index': 0,
      'leading': false,
      'maxWait': 0,
      'null': false,
      'number': null,
      'object': null,
      'push': null,
      'string': null,
      'trailing': false,
      'true': false,
      'undefined': false,
      'value': null
    };
  }

  /**
   * A no-operation function.
   *
   * @private
   */
  function noop() {
    // no operation performed
  }

  /**
   * Releases the given `array` back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }

  /**
   * Releases the given `object` back to the object pool.
   *
   * @private
   * @param {Object} [object] The object to release.
   */
  function releaseObject(object) {
    var cache = object.cache;
    if (cache) {
      releaseObject(cache);
    }
    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
    if (objectPool.length < maxPoolSize) {
      objectPool.push(object);
    }
  }

  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used, instead of `Array#slice`, to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|String} collection The collection to slice.
   * @param {Number} start The start index.
   * @param {Number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new `lodash` function using the given `context` object.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} [context=window] The context object.
   * @returns {Function} Returns the `lodash` function.
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See http://es5.github.com/#x11.1.5.
    context = context ? _.defaults(window.Object(), context, _.pick(window, contextProps)) : window;

    /** Native constructor references */
    var Array = context.Array,
        Boolean = context.Boolean,
        Date = context.Date,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /**
     * Used for `Array` method references.
     *
     * Normally `Array.prototype` would suffice, however, using an array literal
     * avoids issues in Narwhal.
     */
    var arrayRef = [];

    /** Used for native method references */
    var objectProto = Object.prototype,
        stringProto = String.prototype;

    /** Used to restore the original `_` reference in `noConflict` */
    var oldDash = context._;

    /** Used to detect if a method is native */
    var reNative = RegExp('^' +
      String(objectProto.valueOf)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/valueOf|for [^\]]+/g, '.+?') + '$'
    );

    /** Native method shortcuts */
    var ceil = Math.ceil,
        clearTimeout = context.clearTimeout,
        concat = arrayRef.concat,
        floor = Math.floor,
        fnToString = Function.prototype.toString,
        getPrototypeOf = reNative.test(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
        hasOwnProperty = objectProto.hasOwnProperty,
        push = arrayRef.push,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        setImmediate = context.setImmediate,
        setTimeout = context.setTimeout,
        toString = objectProto.toString;

    /* Native method shortcuts for methods with the same name as other `lodash` methods */
    var nativeBind = reNative.test(nativeBind = toString.bind) && nativeBind,
        nativeCreate = reNative.test(nativeCreate =  Object.create) && nativeCreate,
        nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray,
        nativeIsFinite = context.isFinite,
        nativeIsNaN = context.isNaN,
        nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeSlice = arrayRef.slice;

    /** Detect various environments */
    var isIeOpera = reNative.test(context.attachEvent),
        isV8 = nativeBind && !/\n|true/.test(nativeBind + isIeOpera);

    /** Used to lookup a built-in constructor by [[Class]] */
    var ctorByClass = {};
    ctorByClass[arrayClass] = Array;
    ctorByClass[boolClass] = Boolean;
    ctorByClass[dateClass] = Date;
    ctorByClass[funcClass] = Function;
    ctorByClass[objectClass] = Object;
    ctorByClass[numberClass] = Number;
    ctorByClass[regexpClass] = RegExp;
    ctorByClass[stringClass] = String;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object, which wraps the given `value`, to enable method
     * chaining.
     *
     * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
     * and `unshift`
     *
     * Chaining is supported in custom builds as long as the `value` method is
     * implicitly or explicitly included in the build.
     *
     * The chainable wrapper functions are:
     * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
     * `compose`, `concat`, `countBy`, `createCallback`, `debounce`, `defaults`,
     * `defer`, `delay`, `difference`, `filter`, `flatten`, `forEach`, `forIn`,
     * `forOwn`, `functions`, `groupBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
     * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `push`, `range`,
     * `reject`, `rest`, `reverse`, `shuffle`, `slice`, `sort`, `sortBy`, `splice`,
     * `tap`, `throttle`, `times`, `toArray`, `transform`, `union`, `uniq`, `unshift`,
     * `unzip`, `values`, `where`, `without`, `wrap`, and `zip`
     *
     * The non-chainable wrapper functions are:
     * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `has`,
     * `identity`, `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`,
     * `isElement`, `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`,
     * `isNull`, `isNumber`, `isObject`, `isPlainObject`, `isRegExp`, `isString`,
     * `isUndefined`, `join`, `lastIndexOf`, `mixin`, `noConflict`, `parseInt`,
     * `pop`, `random`, `reduce`, `reduceRight`, `result`, `shift`, `size`, `some`,
     * `sortedIndex`, `runInContext`, `template`, `unescape`, `uniqueId`, and `value`
     *
     * The wrapper functions `first` and `last` return wrapped values when `n` is
     * passed, otherwise they return unwrapped values.
     *
     * @name _
     * @constructor
     * @alias chain
     * @category Chaining
     * @param {Mixed} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns a `lodash` instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(num) {
     *   return num * num;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
      return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
       ? value
       : new lodashWrapper(value);
    }

    /**
     * A fast path for creating `lodash` wrapper objects.
     *
     * @private
     * @param {Mixed} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns a `lodash` instance.
     */
    function lodashWrapper(value) {
      this.__wrapped__ = value;
    }
    // ensure `new lodashWrapper` is an instance of `lodash`
    lodashWrapper.prototype = lodash.prototype;

    /**
     * An object used to flag environments features.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * Detect if `Function#bind` exists and is inferred to be fast (all but V8).
     *
     * @memberOf _.support
     * @type Boolean
     */
    support.fastBind = nativeBind && !isV8;

    /**
     * By default, the template delimiters used by Lo-Dash are similar to those in
     * embedded Ruby (ERB). Change the following template settings to use alternative
     * delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': /<%-([\s\S]+?)%>/g,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': /<%([\s\S]+?)%>/g,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type String
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that, when called, invokes `func` with the `this` binding
     * of `thisArg` and prepends any `partialArgs` to the arguments passed to the
     * bound function.
     *
     * @private
     * @param {Function|String} func The function to bind or the method name.
     * @param {Mixed} [thisArg] The `this` binding of `func`.
     * @param {Array} partialArgs An array of arguments to be partially applied.
     * @param {Object} [idicator] Used to indicate binding by key or partially
     *  applying arguments from the right.
     * @returns {Function} Returns the new bound function.
     */
    function createBound(func, thisArg, partialArgs, indicator) {
      var isFunc = isFunction(func),
          isPartial = !partialArgs,
          key = thisArg;

      // juggle arguments
      if (isPartial) {
        var rightIndicator = indicator;
        partialArgs = thisArg;
      }
      else if (!isFunc) {
        if (!indicator) {
          throw new TypeError;
        }
        thisArg = func;
      }

      function bound() {
        // `Function#bind` spec
        // http://es5.github.com/#x15.3.4.5
        var args = arguments,
            thisBinding = isPartial ? this : thisArg;

        if (!isFunc) {
          func = thisArg[key];
        }
        if (partialArgs.length) {
          args = args.length
            ? (args = nativeSlice.call(args), rightIndicator ? args.concat(partialArgs) : partialArgs.concat(args))
            : partialArgs;
        }
        if (this instanceof bound) {
          // ensure `new bound` is an instance of `func`
          thisBinding = createObject(func.prototype);

          // mimic the constructor's `return` behavior
          // http://es5.github.com/#x13.2.2
          var result = func.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisBinding, args);
      }
      return bound;
    }

    /**
     * Creates a new object with the specified `prototype`.
     *
     * @private
     * @param {Object} prototype The prototype object.
     * @returns {Object} Returns the new object.
     */
    function createObject(prototype) {
      return isObject(prototype) ? nativeCreate(prototype) : {};
    }

    /**
     * Used by `escape` to convert characters to HTML entities.
     *
     * @private
     * @param {String} match The matched character to escape.
     * @returns {String} Returns the escaped character.
     */
    function escapeHtmlChar(match) {
      return htmlEscapes[match];
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized, this method returns the custom method, otherwise it returns
     * the `basicIndexOf` function.
     *
     * @private
     * @returns {Function} Returns the "indexOf" function.
     */
    function getIndexOf(array, value, fromIndex) {
      var result = (result = lodash.indexOf) === indexOf ? basicIndexOf : result;
      return result;
    }

    /**
     * Creates a function that juggles arguments, allowing argument overloading
     * for `_.flatten` and `_.uniq`, before passing them to the given `func`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @returns {Function} Returns the new function.
     */
    function overloadWrapper(func) {
      return function(array, flag, callback, thisArg) {
        // juggle arguments
        if (typeof flag != 'boolean' && flag != null) {
          thisArg = callback;
          callback = !(thisArg && thisArg[flag] === array) ? flag : undefined;
          flag = false;
        }
        if (callback != null) {
          callback = lodash.createCallback(callback, thisArg);
        }
        return func(array, flag, callback, thisArg);
      };
    }

    /**
     * A fallback implementation of `isPlainObject` which checks if a given `value`
     * is an object created by the `Object` constructor, assuming objects created
     * by the `Object` constructor have no inherited enumerable properties and that
     * there are no `Object.prototype` extensions.
     *
     * @private
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if `value` is a plain object, else `false`.
     */
    function shimIsPlainObject(value) {
      var ctor,
          result;

      // avoid non Object objects, `arguments` objects, and DOM elements
      if (!(value && toString.call(value) == objectClass) ||
          (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
        return false;
      }
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      forIn(value, function(value, key) {
        result = key;
      });
      return result === undefined || hasOwnProperty.call(value, result);
    }

    /**
     * Used by `unescape` to convert HTML entities to characters.
     *
     * @private
     * @param {String} match The matched character to unescape.
     * @returns {String} Returns the unescaped character.
     */
    function unescapeHtmlChar(match) {
      return htmlUnescapes[match];
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Checks if `value` is an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is an `arguments` object, else `false`.
     * @example
     *
     * (function() { return _.isArguments(arguments); })(1, 2, 3);
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return toString.call(value) == argsClass;
    }

    /**
     * Checks if `value` is an array.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is an array, else `false`.
     * @example
     *
     * (function() { return _.isArray(arguments); })();
     * // => false
     *
     * _.isArray([1, 2, 3]);
     * // => true
     */
    var isArray = nativeIsArray;

    /**
     * A fallback implementation of `Object.keys` which produces an array of the
     * given object's own enumerable property names.
     *
     * @private
     * @type Function
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns a new array of property names.
     */
    var shimKeys = function (object) {
      var index, iterable = object, result = [];
      if (!iterable) return result;
      if (!(objectTypes[typeof object])) return result;    
        for (index in iterable) {
          if (hasOwnProperty.call(iterable, index)) {
            result.push(index);    
          }
        }    
      return result
    };

    /**
     * Creates an array composed of the own enumerable property names of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns a new array of property names.
     * @example
     *
     * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
     * // => ['one', 'two', 'three'] (order is not guaranteed)
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      if (!isObject(object)) {
        return [];
      }
      return nativeKeys(object);
    };

    /**
     * Used to convert characters to HTML entities:
     *
     * Though the `>` character is escaped for symmetry, characters like `>` and `/`
     * don't require escaping in HTML and have no special meaning unless they're part
     * of a tag or an unquoted attribute value.
     * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
     */
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    /** Used to convert HTML entities to characters */
    var htmlUnescapes = invert(htmlEscapes);

    /*--------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources will overwrite property assignments of previous
     * sources. If a `callback` function is passed, it will be executed to produce
     * the assigned values. The `callback` is bound to `thisArg` and invoked with
     * two arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @type Function
     * @alias extend
     * @category Objects
     * @param {Object} object The destination object.
     * @param {Object} [source1, source2, ...] The source objects.
     * @param {Function} [callback] The function to customize assigning values.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * _.assign({ 'name': 'moe' }, { 'age': 40 });
     * // => { 'name': 'moe', 'age': 40 }
     *
     * var defaults = _.partialRight(_.assign, function(a, b) {
     *   return typeof a == 'undefined' ? b : a;
     * });
     *
     * var food = { 'name': 'apple' };
     * defaults(food, { 'name': 'banana', 'type': 'fruit' });
     * // => { 'name': 'apple', 'type': 'fruit' }
     */
    var assign = function (object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
        var callback = lodash.createCallback(args[--argsLength - 1], args[argsLength--], 2);
      } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
        callback = args[--argsLength];
      }
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {    
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];    
        }    
        }
      }
      return result
    };

    /**
     * Creates a clone of `value`. If `deep` is `true`, nested objects will also
     * be cloned, otherwise they will be assigned by reference. If a `callback`
     * function is passed, it will be executed to produce the cloned values. If
     * `callback` returns `undefined`, cloning will be handled by the method instead.
     * The `callback` is bound to `thisArg` and invoked with one argument; (value).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to clone.
     * @param {Boolean} [deep=false] A flag to indicate a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @param- {Array} [stackA=[]] Tracks traversed source objects.
     * @param- {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {Mixed} Returns the cloned `value`.
     * @example
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * var shallow = _.clone(stooges);
     * shallow[0] === stooges[0];
     * // => true
     *
     * var deep = _.clone(stooges, true);
     * deep[0] === stooges[0];
     * // => false
     *
     * _.mixin({
     *   'clone': _.partialRight(_.clone, function(value) {
     *     return _.isElement(value) ? value.cloneNode(false) : undefined;
     *   })
     * });
     *
     * var clone = _.clone(document.body);
     * clone.childNodes.length;
     * // => 0
     */
    function clone(value, deep, callback, thisArg, stackA, stackB) {
      var result = value;

      // allows working with "Collections" methods without using their `callback`
      // argument, `index|key`, for this method's `callback`
      if (typeof deep != 'boolean' && deep != null) {
        thisArg = callback;
        callback = deep;
        deep = false;
      }
      if (typeof callback == 'function') {
        callback = (typeof thisArg == 'undefined')
          ? callback
          : lodash.createCallback(callback, thisArg, 1);

        result = callback(result);
        if (typeof result != 'undefined') {
          return result;
        }
        result = value;
      }
      // inspect [[Class]]
      var isObj = isObject(result);
      if (isObj) {
        var className = toString.call(result);
        if (!cloneableClasses[className]) {
          return result;
        }
        var isArr = isArray(result);
      }
      // shallow clone
      if (!isObj || !deep) {
        return isObj
          ? (isArr ? slice(result) : assign({}, result))
          : result;
      }
      var ctor = ctorByClass[className];
      switch (className) {
        case boolClass:
        case dateClass:
          return new ctor(+result);

        case numberClass:
        case stringClass:
          return new ctor(result);

        case regexpClass:
          return ctor(result.source, reFlags.exec(result));
      }
      // check for circular references and return corresponding clone
      var initedStack = !stackA;
      stackA || (stackA = getArray());
      stackB || (stackB = getArray());

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == value) {
          return stackB[length];
        }
      }
      // init cloned object
      result = isArr ? ctor(result.length) : {};

      // add array properties assigned by `RegExp#exec`
      if (isArr) {
        if (hasOwnProperty.call(value, 'index')) {
          result.index = value.index;
        }
        if (hasOwnProperty.call(value, 'input')) {
          result.input = value.input;
        }
      }
      // add the source value to the stack of traversed objects
      // and associate it with its clone
      stackA.push(value);
      stackB.push(result);

      // recursively populate clone (susceptible to call stack limits)
      (isArr ? forEach : forOwn)(value, function(objValue, key) {
        result[key] = clone(objValue, deep, callback, undefined, stackA, stackB);
      });

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * Creates a deep clone of `value`. If a `callback` function is passed,
     * it will be executed to produce the cloned values. If `callback` returns
     * `undefined`, cloning will be handled by the method instead. The `callback`
     * is bound to `thisArg` and invoked with one argument; (value).
     *
     * Note: This method is loosely based on the structured clone algorithm. Functions
     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
     * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Mixed} Returns the deep cloned `value`.
     * @example
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * var deep = _.cloneDeep(stooges);
     * deep[0] === stooges[0];
     * // => false
     *
     * var view = {
     *   'label': 'docs',
     *   'node': element
     * };
     *
     * var clone = _.cloneDeep(view, function(value) {
     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
     * });
     *
     * clone.node == view.node;
     * // => false
     */
    function cloneDeep(value, callback, thisArg) {
      return clone(value, true, callback, thisArg);
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional defaults of the same property will be ignored.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The destination object.
     * @param {Object} [source1, source2, ...] The source objects.
     * @param- {Object} [guard] Allows working with `_.reduce` without using its
     *  callback's `key` and `object` arguments as sources.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var food = { 'name': 'apple' };
     * _.defaults(food, { 'name': 'banana', 'type': 'fruit' });
     * // => { 'name': 'apple', 'type': 'fruit' }
     */
    var defaults = function (object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {    
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (typeof result[index] == 'undefined') result[index] = iterable[index];    
        }    
        }
      }
      return result
    };

    /**
     * This method is similar to `_.find`, except that it returns the key of the
     * element that passes the callback check, instead of the element itself.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Mixed} Returns the key of the found element, else `undefined`.
     * @example
     *
     * _.findKey({ 'a': 1, 'b': 2, 'c': 3, 'd': 4 }, function(num) {
     *   return num % 2 == 0;
     * });
     * // => 'b'
     */
    function findKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg);
      forOwn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over `object`'s own and inherited enumerable properties, executing
     * the `callback` for each property. The `callback` is bound to `thisArg` and
     * invoked with three arguments; (value, key, object). Callbacks may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Dog(name) {
     *   this.name = name;
     * }
     *
     * Dog.prototype.bark = function() {
     *   alert('Woof, woof!');
     * };
     *
     * _.forIn(new Dog('Dagny'), function(value, key) {
     *   alert(key);
     * });
     * // => alerts 'name' and 'bark' (order is not guaranteed)
     */
    var forIn = function (collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : lodash.createCallback(callback, thisArg);    
        for (index in iterable) {
          if (callback(iterable[index], index, collection) === false) return result;    
        }    
      return result
    };

    /**
     * Iterates over an object's own enumerable properties, executing the `callback`
     * for each property. The `callback` is bound to `thisArg` and invoked with three
     * arguments; (value, key, object). Callbacks may exit iteration early by explicitly
     * returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   alert(key);
     * });
     * // => alerts '0', '1', and 'length' (order is not guaranteed)
     */
    var forOwn = function (collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : lodash.createCallback(callback, thisArg);    
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (callback(iterable[index], index, collection) === false) return result;    
        }    
      return result
    };

    /**
     * Creates a sorted array of all enumerable properties, own and inherited,
     * of `object` that have function values.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns a new array of property names that have function values.
     * @example
     *
     * _.functions(_);
     * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
     */
    function functions(object) {
      var result = [];
      forIn(object, function(value, key) {
        if (isFunction(value)) {
          result.push(key);
        }
      });
      return result.sort();
    }

    /**
     * Checks if the specified object `property` exists and is a direct property,
     * instead of an inherited property.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to check.
     * @param {String} property The property to check for.
     * @returns {Boolean} Returns `true` if key is a direct property, else `false`.
     * @example
     *
     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
     * // => true
     */
    function has(object, property) {
      return object ? hasOwnProperty.call(object, property) : false;
    }

    /**
     * Creates an object composed of the inverted keys and values of the given `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the created inverted object.
     * @example
     *
     *  _.invert({ 'first': 'moe', 'second': 'larry' });
     * // => { 'moe': 'first', 'larry': 'second' }
     */
    function invert(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        result[object[key]] = key;
      }
      return result;
    }

    /**
     * Checks if `value` is a boolean value.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is a boolean value, else `false`.
     * @example
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false || toString.call(value) == boolClass;
    }

    /**
     * Checks if `value` is a date.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is a date, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     */
    function isDate(value) {
      return value ? (typeof value == 'object' && toString.call(value) == dateClass) : false;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     */
    function isElement(value) {
      return value ? value.nodeType === 1 : false;
    }

    /**
     * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
     * length of `0` and objects with no own enumerable properties are considered
     * "empty".
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object|String} value The value to inspect.
     * @returns {Boolean} Returns `true`, if the `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({});
     * // => true
     *
     * _.isEmpty('');
     * // => true
     */
    function isEmpty(value) {
      var result = true;
      if (!value) {
        return result;
      }
      var className = toString.call(value),
          length = value.length;

      if ((className == arrayClass || className == stringClass || className == argsClass ) ||
          (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
        return !length;
      }
      forOwn(value, function() {
        return (result = false);
      });
      return result;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent to each other. If `callback` is passed, it will be executed to
     * compare values. If `callback` returns `undefined`, comparisons will be handled
     * by the method instead. The `callback` is bound to `thisArg` and invoked with
     * two arguments; (a, b).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} a The value to compare.
     * @param {Mixed} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @param- {Array} [stackA=[]] Tracks traversed `a` objects.
     * @param- {Array} [stackB=[]] Tracks traversed `b` objects.
     * @returns {Boolean} Returns `true`, if the values are equivalent, else `false`.
     * @example
     *
     * var moe = { 'name': 'moe', 'age': 40 };
     * var copy = { 'name': 'moe', 'age': 40 };
     *
     * moe == copy;
     * // => false
     *
     * _.isEqual(moe, copy);
     * // => true
     *
     * var words = ['hello', 'goodbye'];
     * var otherWords = ['hi', 'goodbye'];
     *
     * _.isEqual(words, otherWords, function(a, b) {
     *   var reGreet = /^(?:hello|hi)$/i,
     *       aGreet = _.isString(a) && reGreet.test(a),
     *       bGreet = _.isString(b) && reGreet.test(b);
     *
     *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
     * });
     * // => true
     */
    function isEqual(a, b, callback, thisArg, stackA, stackB) {
      // used to indicate that when comparing objects, `a` has at least the properties of `b`
      var whereIndicator = callback === indicatorObject;
      if (typeof callback == 'function' && !whereIndicator) {
        callback = lodash.createCallback(callback, thisArg, 2);
        var result = callback(a, b);
        if (typeof result != 'undefined') {
          return !!result;
        }
      }
      // exit early for identical values
      if (a === b) {
        // treat `+0` vs. `-0` as not equal
        return a !== 0 || (1 / a == 1 / b);
      }
      var type = typeof a,
          otherType = typeof b;

      // exit early for unlike primitive values
      if (a === a &&
          (!a || (type != 'function' && type != 'object')) &&
          (!b || (otherType != 'function' && otherType != 'object'))) {
        return false;
      }
      // exit early for `null` and `undefined`, avoiding ES3's Function#call behavior
      // http://es5.github.com/#x15.3.4.4
      if (a == null || b == null) {
        return a === b;
      }
      // compare [[Class]] names
      var className = toString.call(a),
          otherClass = toString.call(b);

      if (className == argsClass) {
        className = objectClass;
      }
      if (otherClass == argsClass) {
        otherClass = objectClass;
      }
      if (className != otherClass) {
        return false;
      }
      switch (className) {
        case boolClass:
        case dateClass:
          // coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0`, treating invalid dates coerced to `NaN` as not equal
          return +a == +b;

        case numberClass:
          // treat `NaN` vs. `NaN` as equal
          return (a != +a)
            ? b != +b
            // but treat `+0` vs. `-0` as not equal
            : (a == 0 ? (1 / a == 1 / b) : a == +b);

        case regexpClass:
        case stringClass:
          // coerce regexes to strings (http://es5.github.com/#x15.10.6.4)
          // treat string primitives and their corresponding object instances as equal
          return a == String(b);
      }
      var isArr = className == arrayClass;
      if (!isArr) {
        // unwrap any `lodash` wrapped values
        if (hasOwnProperty.call(a, '__wrapped__ ') || hasOwnProperty.call(b, '__wrapped__')) {
          return isEqual(a.__wrapped__ || a, b.__wrapped__ || b, callback, thisArg, stackA, stackB);
        }
        // exit for functions and DOM nodes
        if (className != objectClass) {
          return false;
        }
        // in older versions of Opera, `arguments` objects have `Array` constructors
        var ctorA = a.constructor,
            ctorB = b.constructor;

        // non `Object` object instances with different constructors are not equal
        if (ctorA != ctorB && !(
              isFunction(ctorA) && ctorA instanceof ctorA &&
              isFunction(ctorB) && ctorB instanceof ctorB
            )) {
          return false;
        }
      }
      // assume cyclic structures are equal
      // the algorithm for detecting cyclic structures is adapted from ES 5.1
      // section 15.12.3, abstract operation `JO` (http://es5.github.com/#x15.12.3)
      var initedStack = !stackA;
      stackA || (stackA = getArray());
      stackB || (stackB = getArray());

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == a) {
          return stackB[length] == b;
        }
      }
      var size = 0;
      result = true;

      // add `a` and `b` to the stack of traversed objects
      stackA.push(a);
      stackB.push(b);

      // recursively compare objects and arrays (susceptible to call stack limits)
      if (isArr) {
        length = a.length;
        size = b.length;

        // compare lengths to determine if a deep comparison is necessary
        result = size == a.length;
        if (!result && !whereIndicator) {
          return result;
        }
        // deep compare the contents, ignoring non-numeric properties
        while (size--) {
          var index = length,
              value = b[size];

          if (whereIndicator) {
            while (index--) {
              if ((result = isEqual(a[index], value, callback, thisArg, stackA, stackB))) {
                break;
              }
            }
          } else if (!(result = isEqual(a[size], value, callback, thisArg, stackA, stackB))) {
            break;
          }
        }
        return result;
      }
      // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
      // which, in this case, is more costly
      forIn(b, function(value, key, b) {
        if (hasOwnProperty.call(b, key)) {
          // count the number of properties.
          size++;
          // deep compare each property value.
          return (result = hasOwnProperty.call(a, key) && isEqual(a[key], value, callback, thisArg, stackA, stackB));
        }
      });

      if (result && !whereIndicator) {
        // ensure both objects have the same number of properties
        forIn(a, function(value, key, a) {
          if (hasOwnProperty.call(a, key)) {
            // `size` will be `-1` if `a` has more properties than `b`
            return (result = --size > -1);
          }
        });
      }
      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * Checks if `value` is, or can be coerced to, a finite number.
     *
     * Note: This is not the same as native `isFinite`, which will return true for
     * booleans and empty strings. See http://es5.github.com/#x15.1.2.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is finite, else `false`.
     * @example
     *
     * _.isFinite(-101);
     * // => true
     *
     * _.isFinite('10');
     * // => true
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite('');
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
    }

    /**
     * Checks if `value` is a function.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     */
    function isFunction(value) {
      return typeof value == 'function';
    }

    /**
     * Checks if `value` is the language type of Object.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // check if the value is the ECMAScript language type of Object
      // http://es5.github.com/#x8
      // and avoid a V8 bug
      // http://code.google.com/p/v8/issues/detail?id=2291
      return !!(value && objectTypes[typeof value]);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * Note: This is not the same as native `isNaN`, which will return `true` for
     * `undefined` and other values. See http://es5.github.com/#x15.1.2.4.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // `NaN` as a primitive is the only value that is not equal to itself
      // (perform the [[Class]] check first to avoid errors with some host objects in IE)
      return isNumber(value) && value != +value
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(undefined);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is a number.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(8.4 * 5);
     * // => true
     */
    function isNumber(value) {
      return typeof value == 'number' || toString.call(value) == numberClass;
    }

    /**
     * Checks if a given `value` is an object created by the `Object` constructor.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if `value` is a plain object, else `false`.
     * @example
     *
     * function Stooge(name, age) {
     *   this.name = name;
     *   this.age = age;
     * }
     *
     * _.isPlainObject(new Stooge('moe', 40));
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'name': 'moe', 'age': 40 });
     * // => true
     */
    var isPlainObject = function(value) {
      if (!(value && toString.call(value) == objectClass)) {
        return false;
      }
      var valueOf = value.valueOf,
          objProto = typeof valueOf == 'function' && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

      return objProto
        ? (value == objProto || getPrototypeOf(value) == objProto)
        : shimIsPlainObject(value);
    };

    /**
     * Checks if `value` is a regular expression.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is a regular expression, else `false`.
     * @example
     *
     * _.isRegExp(/moe/);
     * // => true
     */
    function isRegExp(value) {
      return value ? (typeof value == 'object' && toString.call(value) == regexpClass) : false;
    }

    /**
     * Checks if `value` is a string.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is a string, else `false`.
     * @example
     *
     * _.isString('moe');
     * // => true
     */
    function isString(value) {
      return typeof value == 'string' || toString.call(value) == stringClass;
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Mixed} value The value to check.
     * @returns {Boolean} Returns `true`, if the `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     */
    function isUndefined(value) {
      return typeof value == 'undefined';
    }

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined`, into the destination object. Subsequent sources
     * will overwrite property assignments of previous sources. If a `callback` function
     * is passed, it will be executed to produce the merged values of the destination
     * and source properties. If `callback` returns `undefined`, merging will be
     * handled by the method instead. The `callback` is bound to `thisArg` and
     * invoked with two arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The destination object.
     * @param {Object} [source1, source2, ...] The source objects.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @param- {Object} [deepIndicator] Indicates that `stackA` and `stackB` are
     *  arrays of traversed objects, instead of source objects.
     * @param- {Array} [stackA=[]] Tracks traversed source objects.
     * @param- {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var names = {
     *   'stooges': [
     *     { 'name': 'moe' },
     *     { 'name': 'larry' }
     *   ]
     * };
     *
     * var ages = {
     *   'stooges': [
     *     { 'age': 40 },
     *     { 'age': 50 }
     *   ]
     * };
     *
     * _.merge(names, ages);
     * // => { 'stooges': [{ 'name': 'moe', 'age': 40 }, { 'name': 'larry', 'age': 50 }] }
     *
     * var food = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var otherFood = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(food, otherFood, function(a, b) {
     *   return _.isArray(a) ? a.concat(b) : undefined;
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
     */
    function merge(object, source, deepIndicator) {
      var args = arguments,
          index = 0,
          length = 2;

      if (!isObject(object)) {
        return object;
      }
      if (deepIndicator === indicatorObject) {
        var callback = args[3],
            stackA = args[4],
            stackB = args[5];
      } else {
        var initedStack = true;
        stackA = getArray();
        stackB = getArray();

        // allows working with `_.reduce` and `_.reduceRight` without
        // using their `callback` arguments, `index|key` and `collection`
        if (typeof deepIndicator != 'number') {
          length = args.length;
        }
        if (length > 3 && typeof args[length - 2] == 'function') {
          callback = lodash.createCallback(args[--length - 1], args[length--], 2);
        } else if (length > 2 && typeof args[length - 1] == 'function') {
          callback = args[--length];
        }
      }
      while (++index < length) {
        (isArray(args[index]) ? forEach : forOwn)(args[index], function(source, key) {
          var found,
              isArr,
              result = source,
              value = object[key];

          if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
            // avoid merging previously merged cyclic sources
            var stackLength = stackA.length;
            while (stackLength--) {
              if ((found = stackA[stackLength] == source)) {
                value = stackB[stackLength];
                break;
              }
            }
            if (!found) {
              var isShallow;
              if (callback) {
                result = callback(value, source);
                if ((isShallow = typeof result != 'undefined')) {
                  value = result;
                }
              }
              if (!isShallow) {
                value = isArr
                  ? (isArray(value) ? value : [])
                  : (isPlainObject(value) ? value : {});
              }
              // add `source` and associated `value` to the stack of traversed objects
              stackA.push(source);
              stackB.push(value);

              // recursively merge objects and arrays (susceptible to call stack limits)
              if (!isShallow) {
                value = merge(value, source, indicatorObject, callback, stackA, stackB);
              }
            }
          }
          else {
            if (callback) {
              result = callback(value, source);
              if (typeof result == 'undefined') {
                result = source;
              }
            }
            if (typeof result != 'undefined') {
              value = result;
            }
          }
          object[key] = value;
        });
      }

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return object;
    }

    /**
     * Creates a shallow clone of `object` excluding the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a `callback` function is passed, it will be executed
     * for each property in the `object`, omitting the properties `callback`
     * returns truthy for. The `callback` is bound to `thisArg` and invoked
     * with three arguments; (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|String} callback|[prop1, prop2, ...] The properties to omit
     *  or the function called per iteration.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object without the omitted properties.
     * @example
     *
     * _.omit({ 'name': 'moe', 'age': 40 }, 'age');
     * // => { 'name': 'moe' }
     *
     * _.omit({ 'name': 'moe', 'age': 40 }, function(value) {
     *   return typeof value == 'number';
     * });
     * // => { 'name': 'moe' }
     */
    function omit(object, callback, thisArg) {
      var indexOf = getIndexOf(),
          isFunc = typeof callback == 'function',
          result = {};

      if (isFunc) {
        callback = lodash.createCallback(callback, thisArg);
      } else {
        var props = concat.apply(arrayRef, nativeSlice.call(arguments, 1));
      }
      forIn(object, function(value, key, object) {
        if (isFunc
              ? !callback(value, key, object)
              : indexOf(props, key) < 0
            ) {
          result[key] = value;
        }
      });
      return result;
    }

    /**
     * Creates a two dimensional array of the given object's key-value pairs,
     * i.e. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'moe': 30, 'larry': 40 });
     * // => [['moe', 30], ['larry', 40]] (order is not guaranteed)
     */
    function pairs(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates a shallow clone of `object` composed of the specified properties.
     * Property names may be specified as individual arguments or as arrays of property
     * names. If `callback` is passed, it will be executed for each property in the
     * `object`, picking the properties `callback` returns truthy for. The `callback`
     * is bound to `thisArg` and invoked with three arguments; (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Array|Function|String} callback|[prop1, prop2, ...] The function called
     *  per iteration or properties to pick, either as individual arguments or arrays.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object composed of the picked properties.
     * @example
     *
     * _.pick({ 'name': 'moe', '_userid': 'moe1' }, 'name');
     * // => { 'name': 'moe' }
     *
     * _.pick({ 'name': 'moe', '_userid': 'moe1' }, function(value, key) {
     *   return key.charAt(0) != '_';
     * });
     * // => { 'name': 'moe' }
     */
    function pick(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var index = -1,
            props = concat.apply(arrayRef, nativeSlice.call(arguments, 1)),
            length = isObject(object) ? props.length : 0;

        while (++index < length) {
          var key = props[index];
          if (key in object) {
            result[key] = object[key];
          }
        }
      } else {
        callback = lodash.createCallback(callback, thisArg);
        forIn(object, function(value, key, object) {
          if (callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * An alternative to `_.reduce`, this method transforms an `object` to a new
     * `accumulator` object which is the result of running each of its elements
     * through the `callback`, with each `callback` execution potentially mutating
     * the `accumulator` object. The `callback` is bound to `thisArg` and invoked
     * with four arguments; (accumulator, value, key, object). Callbacks may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {Mixed} [accumulator] The custom accumulator value.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Mixed} Returns the accumulated value.
     * @example
     *
     * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
     *   num *= num;
     *   if (num % 2) {
     *     return result.push(num) < 3;
     *   }
     * });
     * // => [1, 9, 25]
     *
     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     * });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function transform(object, callback, accumulator, thisArg) {
      var isArr = isArray(object);
      callback = lodash.createCallback(callback, thisArg, 4);

      if (accumulator == null) {
        if (isArr) {
          accumulator = [];
        } else {
          var ctor = object && object.constructor,
              proto = ctor && ctor.prototype;

          accumulator = createObject(proto);
        }
      }
      (isArr ? forEach : forOwn)(object, function(value, index, object) {
        return callback(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Creates an array composed of the own enumerable property values of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns a new array of property values.
     * @example
     *
     * _.values({ 'one': 1, 'two': 2, 'three': 3 });
     * // => [1, 2, 3] (order is not guaranteed)
     */
    function values(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array of elements from the specified indexes, or keys, of the
     * `collection`. Indexes may be specified as individual arguments or as arrays
     * of indexes.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Array|Number|String} [index1, index2, ...] The indexes of
     *  `collection` to retrieve, either as individual arguments or arrays.
     * @returns {Array} Returns a new array of elements corresponding to the
     *  provided indexes.
     * @example
     *
     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
     * // => ['a', 'c', 'e']
     *
     * _.at(['moe', 'larry', 'curly'], 0, 2);
     * // => ['moe', 'curly']
     */
    function at(collection) {
      var index = -1,
          props = concat.apply(arrayRef, nativeSlice.call(arguments, 1)),
          length = props.length,
          result = Array(length);

      while(++index < length) {
        result[index] = collection[props[index]];
      }
      return result;
    }

    /**
     * Checks if a given `target` element is present in a `collection` using strict
     * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
     * as the offset from the end of the collection.
     *
     * @static
     * @memberOf _
     * @alias include
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Mixed} target The value to check for.
     * @param {Number} [fromIndex=0] The index to search from.
     * @returns {Boolean} Returns `true` if the `target` element is found, else `false`.
     * @example
     *
     * _.contains([1, 2, 3], 1);
     * // => true
     *
     * _.contains([1, 2, 3], 1, 2);
     * // => false
     *
     * _.contains({ 'name': 'moe', 'age': 40 }, 'moe');
     * // => true
     *
     * _.contains('curly', 'ur');
     * // => true
     */
    function contains(collection, target, fromIndex) {
      var index = -1,
          indexOf = getIndexOf(),
          length = collection ? collection.length : 0,
          result = false;

      fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
      if (length && typeof length == 'number') {
        result = (isString(collection)
          ? collection.indexOf(target, fromIndex)
          : indexOf(collection, target, fromIndex)
        ) > -1;
      } else {
        forOwn(collection, function(value) {
          if (++index >= fromIndex) {
            return !(result = value === target);
          }
        });
      }
      return result;
    }

    /**
     * Creates an object composed of keys returned from running each element of the
     * `collection` through the given `callback`. The corresponding value of each key
     * is the number of times the key was returned by the `callback`. The `callback`
     * is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    function countBy(collection, callback, thisArg) {
      var result = {};
      callback = lodash.createCallback(callback, thisArg);

      forEach(collection, function(value, key, collection) {
        key = String(callback(value, key, collection));
        (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
      });
      return result;
    }

    /**
     * Checks if the `callback` returns a truthy value for **all** elements of a
     * `collection`. The `callback` is bound to `thisArg` and invoked with three
     * arguments; (value, index|key, collection).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Boolean} Returns `true` if all elements pass the callback check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.every(stooges, 'age');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.every(stooges, { 'age': 50 });
     * // => false
     */
    function every(collection, callback, thisArg) {
      var result = true;
      callback = lodash.createCallback(callback, thisArg);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if (!(result = !!callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return (result = !!callback(value, index, collection));
        });
      }
      return result;
    }

    /**
     * Examines each element in a `collection`, returning an array of all elements
     * the `callback` returns truthy for. The `callback` is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that passed the callback check.
     * @example
     *
     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [2, 4, 6]
     *
     * var food = [
     *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
     *   { 'name': 'carrot', 'organic': true,  'type': 'vegetable' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.filter(food, 'organic');
     * // => [{ 'name': 'carrot', 'organic': true, 'type': 'vegetable' }]
     *
     * // using "_.where" callback shorthand
     * _.filter(food, { 'type': 'fruit' });
     * // => [{ 'name': 'apple', 'organic': false, 'type': 'fruit' }]
     */
    function filter(collection, callback, thisArg) {
      var result = [];
      callback = lodash.createCallback(callback, thisArg);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            result.push(value);
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result.push(value);
          }
        });
      }
      return result;
    }

    /**
     * Examines each element in a `collection`, returning the first that the `callback`
     * returns truthy for. The `callback` is bound to `thisArg` and invoked with three
     * arguments; (value, index|key, collection).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect, findWhere
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Mixed} Returns the found element, else `undefined`.
     * @example
     *
     * _.find([1, 2, 3, 4], function(num) {
     *   return num % 2 == 0;
     * });
     * // => 2
     *
     * var food = [
     *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
     *   { 'name': 'banana', 'organic': true,  'type': 'fruit' },
     *   { 'name': 'beet',   'organic': false, 'type': 'vegetable' }
     * ];
     *
     * // using "_.where" callback shorthand
     * _.find(food, { 'type': 'vegetable' });
     * // => { 'name': 'beet', 'organic': false, 'type': 'vegetable' }
     *
     * // using "_.pluck" callback shorthand
     * _.find(food, 'organic');
     * // => { 'name': 'banana', 'organic': true, 'type': 'fruit' }
     */
    function find(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            return value;
          }
        }
      } else {
        var result;
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result = value;
            return false;
          }
        });
        return result;
      }
    }

    /**
     * Iterates over a `collection`, executing the `callback` for each element in
     * the `collection`. The `callback` is bound to `thisArg` and invoked with three
     * arguments; (value, index|key, collection). Callbacks may exit iteration early
     * by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|String} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEach(alert).join(',');
     * // => alerts each number and returns '1,2,3'
     *
     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, alert);
     * // => alerts each number value (order is not guaranteed)
     */
    function forEach(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = callback && typeof thisArg == 'undefined' ? callback : lodash.createCallback(callback, thisArg);
      if (typeof length == 'number') {
        while (++index < length) {
          if (callback(collection[index], index, collection) === false) {
            break;
          }
        }
      } else {
        forOwn(collection, callback);
      }
      return collection;
    }

    /**
     * Creates an object composed of keys returned from running each element of the
     * `collection` through the `callback`. The corresponding value of each key is
     * an array of elements passed to `callback` that returned the key. The `callback`
     * is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using "_.pluck" callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    function groupBy(collection, callback, thisArg) {
      var result = {};
      callback = lodash.createCallback(callback, thisArg);

      forEach(collection, function(value, key, collection) {
        key = String(callback(value, key, collection));
        (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
      });
      return result;
    }

    /**
     * Invokes the method named by `methodName` on each element in the `collection`,
     * returning an array of the results of each invoked method. Additional arguments
     * will be passed to each invoked method. If `methodName` is a function, it will
     * be invoked for, and `this` bound to, each element in the `collection`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function|String} methodName The name of the method to invoke or
     *  the function invoked per iteration.
     * @param {Mixed} [arg1, arg2, ...] Arguments to invoke the method with.
     * @returns {Array} Returns a new array of the results of each invoked method.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    function invoke(collection, methodName) {
      var args = nativeSlice.call(arguments, 2),
          index = -1,
          isFunc = typeof methodName == 'function',
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
      });
      return result;
    }

    /**
     * Creates an array of values by running each element in the `collection`
     * through the `callback`. The `callback` is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of the results of each `callback` execution.
     * @example
     *
     * _.map([1, 2, 3], function(num) { return num * 3; });
     * // => [3, 6, 9]
     *
     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
     * // => [3, 6, 9] (order is not guaranteed)
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(stooges, 'name');
     * // => ['moe', 'larry']
     */
    function map(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = lodash.createCallback(callback, thisArg);
      if (typeof length == 'number') {
        var result = Array(length);
        while (++index < length) {
          result[index] = callback(collection[index], index, collection);
        }
      } else {
        result = [];
        forOwn(collection, function(value, key, collection) {
          result[++index] = callback(value, key, collection);
        });
      }
      return result;
    }

    /**
     * Retrieves the maximum value of an `array`. If `callback` is passed,
     * it will be executed for each value in the `array` to generate the
     * criterion by which the value is ranked. The `callback` is bound to
     * `thisArg` and invoked with three arguments; (value, index, collection).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Mixed} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * _.max(stooges, function(stooge) { return stooge.age; });
     * // => { 'name': 'larry', 'age': 50 };
     *
     * // using "_.pluck" callback shorthand
     * _.max(stooges, 'age');
     * // => { 'name': 'larry', 'age': 50 };
     */
    function max(collection, callback, thisArg) {
      var computed = -Infinity,
          result = computed;

      if (!callback && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value > result) {
            result = value;
          }
        }
      } else {
        callback = (!callback && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current > computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the minimum value of an `array`. If `callback` is passed,
     * it will be executed for each value in the `array` to generate the
     * criterion by which the value is ranked. The `callback` is bound to `thisArg`
     * and invoked with three arguments; (value, index, collection).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Mixed} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * _.min(stooges, function(stooge) { return stooge.age; });
     * // => { 'name': 'moe', 'age': 40 };
     *
     * // using "_.pluck" callback shorthand
     * _.min(stooges, 'age');
     * // => { 'name': 'moe', 'age': 40 };
     */
    function min(collection, callback, thisArg) {
      var computed = Infinity,
          result = computed;

      if (!callback && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value < result) {
            result = value;
          }
        }
      } else {
        callback = (!callback && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current < computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the value of a specified property from all elements in the `collection`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {String} property The property to pluck.
     * @returns {Array} Returns a new array of property values.
     * @example
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * _.pluck(stooges, 'name');
     * // => ['moe', 'larry']
     */
    function pluck(collection, property) {
      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        var result = Array(length);
        while (++index < length) {
          result[index] = collection[index][property];
        }
      }
      return result || map(collection, property);
    }

    /**
     * Reduces a `collection` to a value which is the accumulated result of running
     * each element in the `collection` through the `callback`, where each successive
     * `callback` execution consumes the return value of the previous execution.
     * If `accumulator` is not passed, the first element of the `collection` will be
     * used as the initial `accumulator` value. The `callback` is bound to `thisArg`
     * and invoked with four arguments; (accumulator, value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {Mixed} [accumulator] Initial value of the accumulator.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Mixed} Returns the accumulated value.
     * @example
     *
     * var sum = _.reduce([1, 2, 3], function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function reduce(collection, callback, accumulator, thisArg) {
      if (!collection) return accumulator;
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);

      var index = -1,
          length = collection.length;

      if (typeof length == 'number') {
        if (noaccum) {
          accumulator = collection[++index];
        }
        while (++index < length) {
          accumulator = callback(accumulator, collection[index], index, collection);
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          accumulator = noaccum
            ? (noaccum = false, value)
            : callback(accumulator, value, index, collection)
        });
      }
      return accumulator;
    }

    /**
     * This method is similar to `_.reduce`, except that it iterates over a
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {Mixed} [accumulator] Initial value of the accumulator.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Mixed} Returns the accumulated value.
     * @example
     *
     * var list = [[0, 1], [2, 3], [4, 5]];
     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, callback, accumulator, thisArg) {
      var iterable = collection,
          length = collection ? collection.length : 0,
          noaccum = arguments.length < 3;

      if (typeof length != 'number') {
        var props = keys(collection);
        length = props.length;
      }
      callback = lodash.createCallback(callback, thisArg, 4);
      forEach(collection, function(value, index, collection) {
        index = props ? props[--length] : --length;
        accumulator = noaccum
          ? (noaccum = false, iterable[index])
          : callback(accumulator, iterable[index], index, collection);
      });
      return accumulator;
    }

    /**
     * The opposite of `_.filter`, this method returns the elements of a
     * `collection` that `callback` does **not** return truthy for.
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that did **not** pass the
     *  callback check.
     * @example
     *
     * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [1, 3, 5]
     *
     * var food = [
     *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
     *   { 'name': 'carrot', 'organic': true,  'type': 'vegetable' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.reject(food, 'organic');
     * // => [{ 'name': 'apple', 'organic': false, 'type': 'fruit' }]
     *
     * // using "_.where" callback shorthand
     * _.reject(food, { 'type': 'fruit' });
     * // => [{ 'name': 'carrot', 'organic': true, 'type': 'vegetable' }]
     */
    function reject(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg);
      return filter(collection, function(value, index, collection) {
        return !callback(value, index, collection);
      });
    }

    /**
     * Creates an array of shuffled `array` values, using a version of the
     * Fisher-Yates shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|String} collection The collection to shuffle.
     * @returns {Array} Returns a new shuffled collection.
     * @example
     *
     * _.shuffle([1, 2, 3, 4, 5, 6]);
     * // => [4, 1, 6, 3, 5, 2]
     */
    function shuffle(collection) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        var rand = floor(nativeRandom() * (++index + 1));
        result[index] = result[rand];
        result[rand] = value;
      });
      return result;
    }

    /**
     * Gets the size of the `collection` by returning `collection.length` for arrays
     * and array-like objects or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|String} collection The collection to inspect.
     * @returns {Number} Returns `collection.length` or number of own enumerable properties.
     * @example
     *
     * _.size([1, 2]);
     * // => 2
     *
     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
     * // => 3
     *
     * _.size('curly');
     * // => 5
     */
    function size(collection) {
      var length = collection ? collection.length : 0;
      return typeof length == 'number' ? length : keys(collection).length;
    }

    /**
     * Checks if the `callback` returns a truthy value for **any** element of a
     * `collection`. The function returns as soon as it finds passing value, and
     * does not iterate over the entire `collection`. The `callback` is bound to
     * `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Boolean} Returns `true` if any element passes the callback check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var food = [
     *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
     *   { 'name': 'carrot', 'organic': true,  'type': 'vegetable' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.some(food, 'organic');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.some(food, { 'type': 'meat' });
     * // => false
     */
    function some(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if ((result = callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return !(result = callback(value, index, collection));
        });
      }
      return !!result;
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in the `collection` through the `callback`. This method
     * performs a stable sort, that is, it will preserve the original sort order of
     * equal elements. The `callback` is bound to `thisArg` and invoked with three
     * arguments; (value, index|key, collection).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of sorted elements.
     * @example
     *
     * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
     * // => [3, 1, 2]
     *
     * // using "_.pluck" callback shorthand
     * _.sortBy(['banana', 'strawberry', 'apple'], 'length');
     * // => ['apple', 'banana', 'strawberry']
     */
    function sortBy(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      callback = lodash.createCallback(callback, thisArg);
      forEach(collection, function(value, key, collection) {
        var object = result[++index] = getObject();
        object.criteria = callback(value, key, collection);
        object.index = index;
        object.value = value;
      });

      length = result.length;
      result.sort(compareAscending);
      while (length--) {
        var object = result[length];
        result[length] = object.value;
        releaseObject(object);
      }
      return result;
    }

    /**
     * Converts the `collection` to an array.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|String} collection The collection to convert.
     * @returns {Array} Returns the new converted array.
     * @example
     *
     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
     * // => [2, 3, 4]
     */
    function toArray(collection) {
      if (collection && typeof collection.length == 'number') {
        return slice(collection);
      }
      return values(collection);
    }

    /**
     * Examines each element in a `collection`, returning an array of all elements
     * that have the given `properties`. When checking `properties`, this method
     * performs a deep comparison between values to determine if they are equivalent
     * to each other.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|String} collection The collection to iterate over.
     * @param {Object} properties The object of property values to filter by.
     * @returns {Array} Returns a new array of elements that have the given `properties`.
     * @example
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * _.where(stooges, { 'age': 40 });
     * // => [{ 'name': 'moe', 'age': 40 }]
     */
    var where = filter;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array with all falsey values of `array` removed. The values
     * `false`, `null`, `0`, `""`, `undefined` and `NaN` are all falsey.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to compact.
     * @returns {Array} Returns a new filtered array.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * Creates an array of `array` elements not present in the other arrays
     * using strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {Array} [array1, array2, ...] Arrays to check.
     * @returns {Array} Returns a new array of `array` elements not present in the
     *  other arrays.
     * @example
     *
     * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
     * // => [1, 3, 4]
     */
    function difference(array) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          seen = concat.apply(arrayRef, nativeSlice.call(arguments, 1)),
          result = [];

      var isLarge = length >= largeArraySize && indexOf === basicIndexOf;

      if (isLarge) {
        var cache = createCache(seen);
        if (cache) {
          indexOf = cacheIndexOf;
          seen = cache;
        } else {
          isLarge = false;
        }
      }
      while (++index < length) {
        var value = array[index];
        if (indexOf(seen, value) < 0) {
          result.push(value);
        }
      }
      if (isLarge) {
        releaseObject(seen);
      }
      return result;
    }

    /**
     * This method is similar to `_.find`, except that it returns the index of
     * the element that passes the callback check, instead of the element itself.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Mixed} Returns the index of the found element, else `-1`.
     * @example
     *
     * _.findIndex(['apple', 'banana', 'beet'], function(food) {
     *   return /^b/.test(food);
     * });
     * // => 1
     */
    function findIndex(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0;

      callback = lodash.createCallback(callback, thisArg);
      while (++index < length) {
        if (callback(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Gets the first element of the `array`. If a number `n` is passed, the first
     * `n` elements of the `array` are returned. If a `callback` function is passed,
     * elements at the beginning of the array are returned as long as the `callback`
     * returns truthy. The `callback` is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias head, take
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|Number|String} [callback|n] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is passed, it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Mixed} Returns the first element(s) of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.first([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [1, 2]
     *
     * var food = [
     *   { 'name': 'banana', 'organic': true },
     *   { 'name': 'beet',   'organic': false },
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.first(food, 'organic');
     * // => [{ 'name': 'banana', 'organic': true }]
     *
     * var food = [
     *   { 'name': 'apple',  'type': 'fruit' },
     *   { 'name': 'banana', 'type': 'fruit' },
     *   { 'name': 'beet',   'type': 'vegetable' }
     * ];
     *
     * // using "_.where" callback shorthand
     * _.first(food, { 'type': 'fruit' });
     * // => [{ 'name': 'apple', 'type': 'fruit' }, { 'name': 'banana', 'type': 'fruit' }]
     */
    function first(array, callback, thisArg) {
      if (array) {
        var n = 0,
            length = array.length;

        if (typeof callback != 'number' && callback != null) {
          var index = -1;
          callback = lodash.createCallback(callback, thisArg);
          while (++index < length && callback(array[index], index, array)) {
            n++;
          }
        } else {
          n = callback;
          if (n == null || thisArg) {
            return array[0];
          }
        }
        return slice(array, 0, nativeMin(nativeMax(0, n), length));
      }
    }

    /**
     * Flattens a nested array (the nesting can be to any depth). If `isShallow`
     * is truthy, `array` will only be flattened a single level. If `callback`
     * is passed, each element of `array` is passed through a `callback` before
     * flattening. The `callback` is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to flatten.
     * @param {Boolean} [isShallow=false] A flag to indicate only flattening a single level.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new flattened array.
     * @example
     *
     * _.flatten([1, [2], [3, [[4]]]]);
     * // => [1, 2, 3, 4];
     *
     * _.flatten([1, [2], [3, [[4]]]], true);
     * // => [1, 2, 3, [[4]]];
     *
     * var stooges = [
     *   { 'name': 'curly', 'quotes': ['Oh, a wise guy, eh?', 'Poifect!'] },
     *   { 'name': 'moe', 'quotes': ['Spread out!', 'You knucklehead!'] }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.flatten(stooges, 'quotes');
     * // => ['Oh, a wise guy, eh?', 'Poifect!', 'Spread out!', 'You knucklehead!']
     */
    var flatten = overloadWrapper(function flatten(array, isShallow, callback) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (callback) {
          value = callback(value, index, array);
        }
        // recursively flatten arrays (susceptible to call stack limits)
        if (isArray(value)) {
          push.apply(result, isShallow ? value : flatten(value));
        } else {
          result.push(value);
        }
      }
      return result;
    });

    /**
     * Gets the index at which the first occurrence of `value` is found using
     * strict equality for comparisons, i.e. `===`. If the `array` is already
     * sorted, passing `true` for `fromIndex` will run a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Mixed} value The value to search for.
     * @param {Boolean|Number} [fromIndex=0] The index to search from or `true` to
     *  perform a binary search on a sorted `array`.
     * @returns {Number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 1
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 4
     *
     * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      if (typeof fromIndex == 'number') {
        var length = array ? array.length : 0;
        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
      } else if (fromIndex) {
        var index = sortedIndex(array, value);
        return array[index] === value ? index : -1;
      }
      return array ? basicIndexOf(array, value, fromIndex) : -1;
    }

    /**
     * Gets all but the last element of `array`. If a number `n` is passed, the
     * last `n` elements are excluded from the result. If a `callback` function
     * is passed, elements at the end of the array are excluded from the result
     * as long as the `callback` returns truthy. The `callback` is bound to
     * `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|Number|String} [callback|n=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is passed, it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     *
     * _.initial([1, 2, 3], 2);
     * // => [1]
     *
     * _.initial([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [1]
     *
     * var food = [
     *   { 'name': 'beet',   'organic': false },
     *   { 'name': 'carrot', 'organic': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.initial(food, 'organic');
     * // => [{ 'name': 'beet',   'organic': false }]
     *
     * var food = [
     *   { 'name': 'banana', 'type': 'fruit' },
     *   { 'name': 'beet',   'type': 'vegetable' },
     *   { 'name': 'carrot', 'type': 'vegetable' }
     * ];
     *
     * // using "_.where" callback shorthand
     * _.initial(food, { 'type': 'vegetable' });
     * // => [{ 'name': 'banana', 'type': 'fruit' }]
     */
    function initial(array, callback, thisArg) {
      if (!array) {
        return [];
      }
      var n = 0,
          length = array.length;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : callback || n;
      }
      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
    }

    /**
     * Computes the intersection of all the passed-in arrays using strict equality
     * for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} [array1, array2, ...] Arrays to process.
     * @returns {Array} Returns a new array of unique elements that are present
     *  in **all** of the arrays.
     * @example
     *
     * _.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]);
     * // => [1, 2]
     */
    function intersection(array) {
      var args = arguments,
          argsLength = args.length,
          argsIndex = -1,
          caches = getArray(),
          index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [],
          seen = getArray();

      while (++argsIndex < argsLength) {
        var value = args[argsIndex];
        caches[argsIndex] = indexOf === basicIndexOf &&
          (value ? value.length : 0) >= largeArraySize &&
          createCache(argsIndex ? args[argsIndex] : seen);
      }
      outer:
      while (++index < length) {
        var cache = caches[0];
        value = array[index];

        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
          argsIndex = argsLength;
          (cache || seen).push(value);
          while (--argsIndex) {
            cache = caches[argsIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
              continue outer;
            }
          }
          result.push(value);
        }
      }
      while (argsLength--) {
        cache = caches[argsLength];
        if (cache) {
          releaseObject(cache);
        }
      }
      releaseArray(caches);
      releaseArray(seen);
      return result;
    }

    /**
     * Gets the last element of the `array`. If a number `n` is passed, the
     * last `n` elements of the `array` are returned. If a `callback` function
     * is passed, elements at the end of the array are returned as long as the
     * `callback` returns truthy. The `callback` is bound to `thisArg` and
     * invoked with three arguments;(value, index, array).
     *
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|Number|String} [callback|n] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is passed, it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Mixed} Returns the last element(s) of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     *
     * _.last([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.last([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [2, 3]
     *
     * var food = [
     *   { 'name': 'beet',   'organic': false },
     *   { 'name': 'carrot', 'organic': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.last(food, 'organic');
     * // => [{ 'name': 'carrot', 'organic': true }]
     *
     * var food = [
     *   { 'name': 'banana', 'type': 'fruit' },
     *   { 'name': 'beet',   'type': 'vegetable' },
     *   { 'name': 'carrot', 'type': 'vegetable' }
     * ];
     *
     * // using "_.where" callback shorthand
     * _.last(food, { 'type': 'vegetable' });
     * // => [{ 'name': 'beet', 'type': 'vegetable' }, { 'name': 'carrot', 'type': 'vegetable' }]
     */
    function last(array, callback, thisArg) {
      if (array) {
        var n = 0,
            length = array.length;

        if (typeof callback != 'number' && callback != null) {
          var index = length;
          callback = lodash.createCallback(callback, thisArg);
          while (index-- && callback(array[index], index, array)) {
            n++;
          }
        } else {
          n = callback;
          if (n == null || thisArg) {
            return array[length - 1];
          }
        }
        return slice(array, nativeMax(0, length - n));
      }
    }

    /**
     * Gets the index at which the last occurrence of `value` is found using strict
     * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
     * as the offset from the end of the collection.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Mixed} value The value to search for.
     * @param {Number} [fromIndex=array.length-1] The index to search from.
     * @returns {Number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 4
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var index = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to but not including `end`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Number} [start=0] The start of the range.
     * @param {Number} end The end of the range.
     * @param {Number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns a new range array.
     * @example
     *
     * _.range(10);
     * // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
     *
     * _.range(1, 11);
     * // => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
     *
     * _.range(0, 30, 5);
     * // => [0, 5, 10, 15, 20, 25]
     *
     * _.range(0, -10, -1);
     * // => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      start = +start || 0;
      step = +step || 1;

      if (end == null) {
        end = start;
        start = 0;
      }
      // use `Array(length)` so V8 will avoid the slower "dictionary" mode
      // http://youtu.be/XAqIpGU8ZZk#t=17m25s
      var index = -1,
          length = nativeMax(0, ceil((end - start) / step)),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The opposite of `_.initial`, this method gets all but the first value of
     * `array`. If a number `n` is passed, the first `n` values are excluded from
     * the result. If a `callback` function is passed, elements at the beginning
     * of the array are excluded from the result as long as the `callback` returns
     * truthy. The `callback` is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias drop, tail
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|Number|String} [callback|n=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is passed, it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     *
     * _.rest([1, 2, 3], 2);
     * // => [3]
     *
     * _.rest([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [3]
     *
     * var food = [
     *   { 'name': 'banana', 'organic': true },
     *   { 'name': 'beet',   'organic': false },
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.rest(food, 'organic');
     * // => [{ 'name': 'beet', 'organic': false }]
     *
     * var food = [
     *   { 'name': 'apple',  'type': 'fruit' },
     *   { 'name': 'banana', 'type': 'fruit' },
     *   { 'name': 'beet',   'type': 'vegetable' }
     * ];
     *
     * // using "_.where" callback shorthand
     * _.rest(food, { 'type': 'fruit' });
     * // => [{ 'name': 'beet', 'type': 'vegetable' }]
     */
    function rest(array, callback, thisArg) {
      if (typeof callback != 'number' && callback != null) {
        var n = 0,
            index = -1,
            length = array ? array.length : 0;

        callback = lodash.createCallback(callback, thisArg);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
      }
      return slice(array, n);
    }

    /**
     * Uses a binary search to determine the smallest index at which the `value`
     * should be inserted into `array` in order to maintain the sort order of the
     * sorted `array`. If `callback` is passed, it will be executed for `value` and
     * each element in `array` to compute their sort ranking. The `callback` is
     * bound to `thisArg` and invoked with one argument; (value).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to inspect.
     * @param {Mixed} value The value to evaluate.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Number} Returns the index at which the value should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([20, 30, 50], 40);
     * // => 2
     *
     * // using "_.pluck" callback shorthand
     * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 2
     *
     * var dict = {
     *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
     * };
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return dict.wordToNumber[word];
     * });
     * // => 2
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return this.wordToNumber[word];
     * }, dict);
     * // => 2
     */
    function sortedIndex(array, value, callback, thisArg) {
      var low = 0,
          high = array ? array.length : low;

      // explicitly reference `identity` for better inlining in Firefox
      callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
      value = callback(value);

      while (low < high) {
        var mid = (low + high) >>> 1;
        (callback(array[mid]) < value)
          ? low = mid + 1
          : high = mid;
      }
      return low;
    }

    /**
     * Computes the union of the passed-in arrays using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} [array1, array2, ...] Arrays to process.
     * @returns {Array} Returns a new array of unique values, in order, that are
     *  present in one or more of the arrays.
     * @example
     *
     * _.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
     * // => [1, 2, 3, 101, 10]
     */
    function union(array) {
      if (!isArray(array)) {
        arguments[0] = array ? nativeSlice.call(array) : arrayRef;
      }
      return uniq(concat.apply(arrayRef, arguments));
    }

    /**
     * Creates a duplicate-value-free version of the `array` using strict equality
     * for comparisons, i.e. `===`. If the `array` is already sorted, passing `true`
     * for `isSorted` will run a faster algorithm. If `callback` is passed, each
     * element of `array` is passed through the `callback` before uniqueness is computed.
     * The `callback` is bound to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is passed for `callback`, the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is passed for `callback`, the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {Boolean} [isSorted=false] A flag to indicate that the `array` is already sorted.
     * @param {Function|Object|String} [callback=identity] The function called per
     *  iteration. If a property name or object is passed, it will be used to create
     *  a "_.pluck" or "_.where" style callback, respectively.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a duplicate-value-free array.
     * @example
     *
     * _.uniq([1, 2, 1, 3, 1]);
     * // => [1, 2, 3]
     *
     * _.uniq([1, 1, 2, 2, 3], true);
     * // => [1, 2, 3]
     *
     * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
     * // => ['A', 'b', 'C']
     *
     * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
     * // => [1, 2.5, 3]
     *
     * // using "_.pluck" callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var uniq = overloadWrapper(function(array, isSorted, callback) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [];

      var isLarge = !isSorted && length >= largeArraySize && indexOf === basicIndexOf,
          seen = (callback || isLarge) ? getArray() : result;

      if (isLarge) {
        var cache = createCache(seen);
        if (cache) {
          indexOf = cacheIndexOf;
          seen = cache;
        } else {
          isLarge = false;
          seen = callback ? seen : (releaseArray(seen), result);
        }
      }
      while (++index < length) {
        var value = array[index],
            computed = callback ? callback(value, index, array) : value;

        if (isSorted
              ? !index || seen[seen.length - 1] !== computed
              : indexOf(seen, computed) < 0
            ) {
          if (callback || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      if (isLarge) {
        releaseArray(seen.array);
        releaseObject(seen);
      } else if (callback) {
        releaseArray(seen);
      }
      return result;
    });

    /**
     * The inverse of `_.zip`, this method splits groups of elements into arrays
     * composed of elements from each group at their corresponding indexes.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to process.
     * @returns {Array} Returns a new array of the composed arrays.
     * @example
     *
     * _.unzip([['moe', 30, true], ['larry', 40, false]]);
     * // => [['moe', 'larry'], [30, 40], [true, false]];
     */
    function unzip(array) {
      var index = -1,
          length = array ? max(pluck(array, 'length')) : 0,
          result = Array(length < 0 ? 0 : length);

      while (++index < length) {
        result[index] = pluck(array, index);
      }
      return result;
    }

    /**
     * Creates an array with all occurrences of the passed values removed using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to filter.
     * @param {Mixed} [value1, value2, ...] Values to remove.
     * @returns {Array} Returns a new filtered array.
     * @example
     *
     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
     * // => [2, 3, 4]
     */
    function without(array) {
      return difference(array, nativeSlice.call(arguments, 1));
    }

    /**
     * Groups the elements of each array at their corresponding indexes. Useful for
     * separate data sources that are coordinated through matching array indexes.
     * For a matrix of nested arrays, `_.zip.apply(...)` can transpose the matrix
     * in a similar fashion.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} [array1, array2, ...] Arrays to process.
     * @returns {Array} Returns a new array of grouped elements.
     * @example
     *
     * _.zip(['moe', 'larry'], [30, 40], [true, false]);
     * // => [['moe', 30, true], ['larry', 40, false]]
     */
    function zip(array) {
      return array ? unzip(arguments) : [];
    }

    /**
     * Creates an object composed from arrays of `keys` and `values`. Pass either
     * a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`, or
     * two arrays, one of `keys` and one of corresponding `values`.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Arrays
     * @param {Array} keys The array of keys.
     * @param {Array} [values=[]] The array of values.
     * @returns {Object} Returns an object composed of the given keys and
     *  corresponding values.
     * @example
     *
     * _.zipObject(['moe', 'larry'], [30, 40]);
     * // => { 'moe': 30, 'larry': 40 }
     */
    function zipObject(keys, values) {
      var index = -1,
          length = keys ? keys.length : 0,
          result = {};

      while (++index < length) {
        var key = keys[index];
        if (values) {
          result[key] = values[index];
        } else {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * If `n` is greater than `0`, a function is created that is restricted to
     * executing `func`, with the `this` binding and arguments of the created
     * function, only after it is called `n` times. If `n` is less than `1`,
     * `func` is executed immediately, without a `this` binding or additional
     * arguments, and its result is returned.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Number} n The number of times the function must be called before
     * it is executed.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var renderNotes = _.after(notes.length, render);
     * _.forEach(notes, function(note) {
     *   note.asyncSave({ 'success': renderNotes });
     * });
     * // `renderNotes` is run once, after all notes have saved
     */
    function after(n, func) {
      if (n < 1) {
        return func();
      }
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with the `this`
     * binding of `thisArg` and prepends any additional `bind` arguments to those
     * passed to the bound function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to bind.
     * @param {Mixed} [thisArg] The `this` binding of `func`.
     * @param {Mixed} [arg1, arg2, ...] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var func = function(greeting) {
     *   return greeting + ' ' + this.name;
     * };
     *
     * func = _.bind(func, { 'name': 'moe' }, 'hi');
     * func();
     * // => 'hi moe'
     */
    function bind(func, thisArg) {
      // use `Function#bind` if it exists and is fast
      // (in V8 `Function#bind` is slower except when partially applied)
      return support.fastBind || (nativeBind && arguments.length > 2)
        ? nativeBind.call.apply(nativeBind, arguments)
        : createBound(func, thisArg, nativeSlice.call(arguments, 2));
    }

    /**
     * Binds methods on `object` to `object`, overwriting the existing method.
     * Method names may be specified as individual arguments or as arrays of method
     * names. If no method names are provided, all the function properties of `object`
     * will be bound.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {String} [methodName1, methodName2, ...] Method names on the object to bind.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *  'label': 'docs',
     *  'onClick': function() { alert('clicked ' + this.label); }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => alerts 'clicked docs', when the button is clicked
     */
    function bindAll(object) {
      var funcs = arguments.length > 1 ? concat.apply(arrayRef, nativeSlice.call(arguments, 1)) : functions(object),
          index = -1,
          length = funcs.length;

      while (++index < length) {
        var key = funcs[index];
        object[key] = bind(object[key], object);
      }
      return object;
    }

    /**
     * Creates a function that, when called, invokes the method at `object[key]`
     * and prepends any additional `bindKey` arguments to those passed to the bound
     * function. This method differs from `_.bind` by allowing bound functions to
     * reference methods that will be redefined or don't yet exist.
     * See http://michaux.ca/articles/lazy-function-definition-pattern.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object the method belongs to.
     * @param {String} key The key of the method.
     * @param {Mixed} [arg1, arg2, ...] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'name': 'moe',
     *   'greet': function(greeting) {
     *     return greeting + ' ' + this.name;
     *   }
     * };
     *
     * var func = _.bindKey(object, 'greet', 'hi');
     * func();
     * // => 'hi moe'
     *
     * object.greet = function(greeting) {
     *   return greeting + ', ' + this.name + '!';
     * };
     *
     * func();
     * // => 'hi, moe!'
     */
    function bindKey(object, key) {
      return createBound(object, key, nativeSlice.call(arguments, 2), indicatorObject);
    }

    /**
     * Creates a function that is the composition of the passed functions,
     * where each function consumes the return value of the function that follows.
     * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
     * Each function is executed with the `this` binding of the composed function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} [func1, func2, ...] Functions to compose.
     * @returns {Function} Returns the new composed function.
     * @example
     *
     * var greet = function(name) { return 'hi ' + name; };
     * var exclaim = function(statement) { return statement + '!'; };
     * var welcome = _.compose(exclaim, greet);
     * welcome('moe');
     * // => 'hi moe!'
     */
    function compose() {
      var funcs = arguments;
      return function() {
        var args = arguments,
            length = funcs.length;

        while (length--) {
          args = [funcs[length].apply(this, args)];
        }
        return args[0];
      };
    }

    /**
     * Produces a callback bound to an optional `thisArg`. If `func` is a property
     * name, the created callback will return the property value for a given element.
     * If `func` is an object, the created callback will return `true` for elements
     * that contain the equivalent object properties, otherwise it will return `false`.
     *
     * Note: All Lo-Dash methods, that accept a `callback` argument, use `_.createCallback`.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Mixed} [func=identity] The value to convert to a callback.
     * @param {Mixed} [thisArg] The `this` binding of the created callback.
     * @param {Number} [argCount=3] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     * @example
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
     *   return !match ? func(callback, thisArg) : function(object) {
     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(stooges, 'age__gt45');
     * // => [{ 'name': 'larry', 'age': 50 }]
     *
     * // create mixins with support for "_.pluck" and "_.where" callback shorthands
     * _.mixin({
     *   'toLookup': function(collection, callback, thisArg) {
     *     callback = _.createCallback(callback, thisArg);
     *     return _.reduce(collection, function(result, value, index, collection) {
     *       return (result[callback(value, index, collection)] = value, result);
     *     }, {});
     *   }
     * });
     *
     * _.toLookup(stooges, 'name');
     * // => { 'moe': { 'name': 'moe', 'age': 40 }, 'larry': { 'name': 'larry', 'age': 50 } }
     */
    function createCallback(func, thisArg, argCount) {
      if (func == null) {
        return identity;
      }
      var type = typeof func;
      if (type != 'function') {
        if (type != 'object') {
          return function(object) {
            return object[func];
          };
        }
        var props = keys(func);
        return function(object) {
          var length = props.length,
              result = false;
          while (length--) {
            if (!(result = isEqual(object[props[length]], func[props[length]], indicatorObject))) {
              break;
            }
          }
          return result;
        };
      }
      if (typeof thisArg == 'undefined' || (reThis && !reThis.test(fnToString.call(func)))) {
        return func;
      }
      if (argCount === 1) {
        return function(value) {
          return func.call(thisArg, value);
        };
      }
      if (argCount === 2) {
        return function(a, b) {
          return func.call(thisArg, a, b);
        };
      }
      if (argCount === 4) {
        return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
      }
      return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
    }

    /**
     * Creates a function that will delay the execution of `func` until after
     * `wait` milliseconds have elapsed since the last time it was invoked. Pass
     * an `options` object to indicate that `func` should be invoked on the leading
     * and/or trailing edge of the `wait` timeout. Subsequent calls to the debounced
     * function will return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true`, `func` will be called
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to debounce.
     * @param {Number} wait The number of milliseconds to delay.
     * @param {Object} options The options object.
     *  [leading=false] A boolean to specify execution on the leading edge of the timeout.
     *  [maxWait] The maximum time `func` is allowed to be delayed before it's called.
     *  [trailing=true] A boolean to specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * var lazyLayout = _.debounce(calculateLayout, 300);
     * jQuery(window).on('resize', lazyLayout);
     *
     * jQuery('#postbox').on('click', _.debounce(sendMail, 200, {
     *   'leading': true,
     *   'trailing': false
     * });
     */
    function debounce(func, wait, options) {
      var args,
          result,
          thisArg,
          callCount = 0,
          lastCalled = 0,
          maxWait = false,
          maxTimeoutId = null,
          timeoutId = null,
          trailing = true;

      function clear() {
        clearTimeout(maxTimeoutId);
        clearTimeout(timeoutId);
        callCount = 0;
        maxTimeoutId = timeoutId = null;
      }

      function delayed() {
        var isCalled = trailing && (!leading || callCount > 1);
        clear();
        if (isCalled) {
          if (maxWait !== false) {
            lastCalled = new Date;
          }
          result = func.apply(thisArg, args);
        }
      }

      function maxDelayed() {
        clear();
        if (trailing || (maxWait !== wait)) {
          lastCalled = new Date;
          result = func.apply(thisArg, args);
        }
      }

      wait = nativeMax(0, wait || 0);
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = options.leading;
        maxWait = 'maxWait' in options && nativeMax(wait, options.maxWait || 0);
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      return function() {
        args = arguments;
        thisArg = this;
        callCount++;

        // avoid issues with Titanium and `undefined` timeout ids
        // https://github.com/appcelerator/titanium_mobile/blob/3_1_0_GA/android/titanium/src/java/ti/modules/titanium/TitaniumModule.java#L185-L192
        clearTimeout(timeoutId);

        if (maxWait === false) {
          if (leading && callCount < 2) {
            result = func.apply(thisArg, args);
          }
        } else {
          var now = new Date;
          if (!maxTimeoutId && !leading) {
            lastCalled = now;
          }
          var remaining = maxWait - (now - lastCalled);
          if (remaining <= 0) {
            clearTimeout(maxTimeoutId);
            maxTimeoutId = null;
            lastCalled = now;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        return result;
      };
    }

    /**
     * Defers executing the `func` function until the current call stack has cleared.
     * Additional arguments will be passed to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to defer.
     * @param {Mixed} [arg1, arg2, ...] Arguments to invoke the function with.
     * @returns {Number} Returns the timer id.
     * @example
     *
     * _.defer(function() { alert('deferred'); });
     * // returns from the function before `alert` is called
     */
    function defer(func) {
      var args = nativeSlice.call(arguments, 1);
      return setTimeout(function() { func.apply(undefined, args); }, 1);
    }
    // use `setImmediate` if it's available in Node.js
    if (isV8 && freeModule && typeof setImmediate == 'function') {
      defer = bind(setImmediate, context);
    }

    /**
     * Executes the `func` function after `wait` milliseconds. Additional arguments
     * will be passed to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to delay.
     * @param {Number} wait The number of milliseconds to delay execution.
     * @param {Mixed} [arg1, arg2, ...] Arguments to invoke the function with.
     * @returns {Number} Returns the timer id.
     * @example
     *
     * var log = _.bind(console.log, console);
     * _.delay(log, 1000, 'logged later');
     * // => 'logged later' (Appears after one second.)
     */
    function delay(func, wait) {
      var args = nativeSlice.call(arguments, 2);
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * passed, it will be used to determine the cache key for storing the result
     * based on the arguments passed to the memoized function. By default, the first
     * argument passed to the memoized function is used as the cache key. The `func`
     * is executed with the `this` binding of the memoized function. The result
     * cache is exposed as the `cache` property on the memoized function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] A function used to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var fibonacci = _.memoize(function(n) {
     *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
     * });
     */
    function memoize(func, resolver) {
      function memoized() {
        var cache = memoized.cache,
            key = keyPrefix + (resolver ? resolver.apply(this, arguments) : arguments[0]);

        return hasOwnProperty.call(cache, key)
          ? cache[key]
          : (cache[key] = func.apply(this, arguments));
      }
      memoized.cache = {};
      return memoized;
    }

    /**
     * Creates a function that is restricted to execute `func` once. Repeat calls to
     * the function will return the value of the first call. The `func` is executed
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` executes `createApplication` once
     */
    function once(func) {
      var ran,
          result;

      return function() {
        if (ran) {
          return result;
        }
        ran = true;
        result = func.apply(this, arguments);

        // clear the `func` variable so the function may be garbage collected
        func = null;
        return result;
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with any additional
     * `partial` arguments prepended to those passed to the new function. This
     * method is similar to `_.bind`, except it does **not** alter the `this` binding.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {Mixed} [arg1, arg2, ...] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) { return greeting + ' ' + name; };
     * var hi = _.partial(greet, 'hi');
     * hi('moe');
     * // => 'hi moe'
     */
    function partial(func) {
      return createBound(func, nativeSlice.call(arguments, 1));
    }

    /**
     * This method is similar to `_.partial`, except that `partial` arguments are
     * appended to those passed to the new function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {Mixed} [arg1, arg2, ...] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var defaultsDeep = _.partialRight(_.merge, _.defaults);
     *
     * var options = {
     *   'variable': 'data',
     *   'imports': { 'jq': $ }
     * };
     *
     * defaultsDeep(options, _.templateSettings);
     *
     * options.variable
     * // => 'data'
     *
     * options.imports
     * // => { '_': _, 'jq': $ }
     */
    function partialRight(func) {
      return createBound(func, nativeSlice.call(arguments, 1), null, indicatorObject);
    }

    /**
     * Creates a function that, when executed, will only call the `func` function
     * at most once per every `wait` milliseconds. Pass an `options` object to
     * indicate that `func` should be invoked on the leading and/or trailing edge
     * of the `wait` timeout. Subsequent calls to the throttled function will
     * return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true`, `func` will be called
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to throttle.
     * @param {Number} wait The number of milliseconds to throttle executions to.
     * @param {Object} options The options object.
     *  [leading=true] A boolean to specify execution on the leading edge of the timeout.
     *  [trailing=true] A boolean to specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * var throttled = _.throttle(updatePosition, 100);
     * jQuery(window).on('scroll', throttled);
     *
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? options.leading : leading;
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      options = getObject();
      options.leading = leading;
      options.maxWait = wait;
      options.trailing = trailing;

      var result = debounce(func, wait, options);
      releaseObject(options);
      return result;
    }

    /**
     * Creates a function that passes `value` to the `wrapper` function as its
     * first argument. Additional arguments passed to the function are appended
     * to those passed to the `wrapper` function. The `wrapper` is executed with
     * the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Mixed} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var hello = function(name) { return 'hello ' + name; };
     * hello = _.wrap(hello, function(func) {
     *   return 'before, ' + func('moe') + ', after';
     * });
     * hello();
     * // => 'before, hello moe, after'
     */
    function wrap(value, wrapper) {
      return function() {
        var args = [value];
        push.apply(args, arguments);
        return wrapper.apply(this, args);
      };
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
     * corresponding HTML entities.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {String} string The string to escape.
     * @returns {String} Returns the escaped string.
     * @example
     *
     * _.escape('Moe, Larry & Curly');
     * // => 'Moe, Larry &amp; Curly'
     */
    function escape(string) {
      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
    }

    /**
     * This method returns the first argument passed to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Mixed} value Any value.
     * @returns {Mixed} Returns `value`.
     * @example
     *
     * var moe = { 'name': 'moe' };
     * moe === _.identity(moe);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Adds functions properties of `object` to the `lodash` function and chainable
     * wrapper.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Object} object The object of function properties to add to `lodash`.
     * @example
     *
     * _.mixin({
     *   'capitalize': function(string) {
     *     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
     *   }
     * });
     *
     * _.capitalize('moe');
     * // => 'Moe'
     *
     * _('moe').capitalize();
     * // => 'Moe'
     */
    function mixin(object) {
      forEach(functions(object), function(methodName) {
        var func = lodash[methodName] = object[methodName];

        lodash.prototype[methodName] = function() {
          var value = this.__wrapped__,
              args = [value];

          push.apply(args, arguments);
          var result = func.apply(lodash, args);
          return (value && typeof value == 'object' && value === result)
            ? this
            : new lodashWrapper(result);
        };
      });
    }

    /**
     * Reverts the '_' variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      context._ = oldDash;
      return this;
    }

    /**
     * Converts the given `value` into an integer of the specified `radix`.
     * If `radix` is `undefined` or `0`, a `radix` of `10` is used unless the
     * `value` is a hexadecimal, in which case a `radix` of `16` is used.
     *
     * Note: This method avoids differences in native ES3 and ES5 `parseInt`
     * implementations. See http://es5.github.com/#E.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {String} value The value to parse.
     * @param {Number} [radix] The radix used to interpret the value to parse.
     * @returns {Number} Returns the new integer value.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     */
    var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
      // Firefox and Opera still follow the ES3 specified implementation of `parseInt`
      return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
    };

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is passed, a number between `0` and the given number will be returned.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Number} [min=0] The minimum possible value.
     * @param {Number} [max=1] The maximum possible value.
     * @returns {Number} Returns a random number.
     * @example
     *
     * _.random(0, 5);
     * // => a number between 0 and 5
     *
     * _.random(5);
     * // => also a number between 0 and 5
     */
    function random(min, max) {
      if (min == null && max == null) {
        max = 1;
      }
      min = +min || 0;
      if (max == null) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      var rand = nativeRandom();
      return (min % 1 || max % 1)
        ? min + nativeMin(rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1))), max)
        : min + floor(rand * (max - min + 1));
    }

    /**
     * Resolves the value of `property` on `object`. If `property` is a function,
     * it will be invoked with the `this` binding of `object` and its result returned,
     * else the property value is returned. If `object` is falsey, then `undefined`
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Object} object The object to inspect.
     * @param {String} property The property to get the value of.
     * @returns {Mixed} Returns the resolved value.
     * @example
     *
     * var object = {
     *   'cheese': 'crumpets',
     *   'stuff': function() {
     *     return 'nonsense';
     *   }
     * };
     *
     * _.result(object, 'cheese');
     * // => 'crumpets'
     *
     * _.result(object, 'stuff');
     * // => 'nonsense'
     */
    function result(object, property) {
      var value = object ? object[property] : undefined;
      return isFunction(value) ? object[property]() : value;
    }

    /**
     * A micro-templating method that handles arbitrary delimiters, preserves
     * whitespace, and correctly escapes quotes within interpolated code.
     *
     * Note: In the development build, `_.template` utilizes sourceURLs for easier
     * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
     *
     * For more information on precompiling templates see:
     * http://lodash.com/#custom-builds
     *
     * For more information on Chrome extension sandboxes see:
     * http://developer.chrome.com/stable/extensions/sandboxingEval.html
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {String} text The template text.
     * @param {Object} data The data object used to populate the text.
     * @param {Object} options The options object.
     *  escape - The "escape" delimiter regexp.
     *  evaluate - The "evaluate" delimiter regexp.
     *  interpolate - The "interpolate" delimiter regexp.
     *  sourceURL - The sourceURL of the template's compiled source.
     *  variable - The data object variable name.
     * @returns {Function|String} Returns a compiled function when no `data` object
     *  is given, else it returns the interpolated text.
     * @example
     *
     * // using a compiled template
     * var compiled = _.template('hello <%= name %>');
     * compiled({ 'name': 'moe' });
     * // => 'hello moe'
     *
     * var list = '<% _.forEach(people, function(name) { %><li><%= name %></li><% }); %>';
     * _.template(list, { 'people': ['moe', 'larry'] });
     * // => '<li>moe</li><li>larry</li>'
     *
     * // using the "escape" delimiter to escape HTML in data property values
     * _.template('<b><%- value %></b>', { 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
     * _.template('hello ${ name }', { 'name': 'curly' });
     * // => 'hello curly'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * _.template('<% print("hello " + epithet); %>!', { 'epithet': 'stooge' });
     * // => 'hello stooge!'
     *
     * // using custom template delimiters
     * _.templateSettings = {
     *   'interpolate': /{{([\s\S]+?)}}/g
     * };
     *
     * _.template('hello {{ name }}!', { 'name': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     *   var __t, __p = '', __e = _.escape;
     *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
     *   return __p;
     * }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(text, data, options) {
      // based on John Resig's `tmpl` implementation
      // http://ejohn.org/blog/javascript-micro-templating/
      // and Laura Doktorova's doT.js
      // https://github.com/olado/doT
      var settings = lodash.templateSettings;
      text || (text = '');

      // avoid missing dependencies when `iteratorTemplate` is not defined
      options = defaults({}, options, settings);

      var imports = defaults({}, options.imports, settings.imports),
          importsKeys = keys(imports),
          importsValues = values(imports);

      var isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // compile the regexp to match each delimiter
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // escape characters that cannot be included in string literals
        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // replace delimiters with snippets
        if (escapeValue) {
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // the JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value
        return match;
      });

      source += "';\n";

      // if `variable` is not specified, wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain
      var variable = options.variable,
          hasVariable = variable;

      if (!hasVariable) {
        variable = 'obj';
        source = 'with (' + variable + ') {\n' + source + '\n}\n';
      }
      // cleanup code by stripping empty strings
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // frame code as the function body
      source = 'function(' + variable + ') {\n' +
        (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
        "var __t, __p = '', __e = _.escape" +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      // Use a sourceURL for easier debugging and wrap in a multi-line comment to
      // avoid issues with Narwhal, IE conditional compilation, and the JS engine
      // embedded in Adobe products.
      // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
      var sourceURL = '\n/*\n//@ sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

      try {
        var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
      } catch(e) {
        e.source = source;
        throw e;
      }
      if (data) {
        return result(data);
      }
      // provide the compiled function's source via its `toString` method, in
      // supported environments, or the `source` property as a convenience for
      // inlining compiled templates during the build process
      result.source = source;
      return result;
    }

    /**
     * Executes the `callback` function `n` times, returning an array of the results
     * of each `callback` execution. The `callback` is bound to `thisArg` and invoked
     * with one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Number} n The number of times to execute the callback.
     * @param {Function} callback The function called per iteration.
     * @param {Mixed} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of the results of each `callback` execution.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) { mage.castSpell(n); });
     * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
     *
     * _.times(3, function(n) { this.cast(n); }, mage);
     * // => also calls `mage.castSpell(n)` three times
     */
    function times(n, callback, thisArg) {
      n = (n = +n) > -1 ? n : 0;
      var index = -1,
          result = Array(n);

      callback = lodash.createCallback(callback, thisArg, 1);
      while (++index < n) {
        result[index] = callback(index);
      }
      return result;
    }

    /**
     * The inverse of `_.escape`, this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
     * corresponding characters.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {String} string The string to unescape.
     * @returns {String} Returns the unescaped string.
     * @example
     *
     * _.unescape('Moe, Larry &amp; Curly');
     * // => 'Moe, Larry & Curly'
     */
    function unescape(string) {
      return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
    }

    /**
     * Generates a unique ID. If `prefix` is passed, the ID will be appended to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {String} [prefix] The value to prefix the ID with.
     * @returns {String} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return String(prefix == null ? '' : prefix) + id;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Invokes `interceptor` with the `value` as the first argument, and then
     * returns `value`. The purpose of this method is to "tap into" a method chain,
     * in order to perform operations on intermediate results within the chain.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {Mixed} value The value to pass to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {Mixed} Returns `value`.
     * @example
     *
     * _([1, 2, 3, 4])
     *  .filter(function(num) { return num % 2 == 0; })
     *  .tap(alert)
     *  .map(function(num) { return num * num; })
     *  .value();
     * // => // [2, 4] (alerted)
     * // => [4, 16]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * Produces the `toString` result of the wrapped value.
     *
     * @name toString
     * @memberOf _
     * @category Chaining
     * @returns {String} Returns the string result.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return String(this.__wrapped__);
    }

    /**
     * Extracts the wrapped value.
     *
     * @name valueOf
     * @memberOf _
     * @alias value
     * @category Chaining
     * @returns {Mixed} Returns the wrapped value.
     * @example
     *
     * _([1, 2, 3]).valueOf();
     * // => [1, 2, 3]
     */
    function wrapperValueOf() {
      return this.__wrapped__;
    }

    /*--------------------------------------------------------------------------*/

    // add functions that return wrapped values when chaining
    lodash.after = after;
    lodash.assign = assign;
    lodash.at = at;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.compact = compact;
    lodash.compose = compose;
    lodash.countBy = countBy;
    lodash.createCallback = createCallback;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.forEach = forEach;
    lodash.forIn = forIn;
    lodash.forOwn = forOwn;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.map = map;
    lodash.max = max;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.min = min;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.range = range;
    lodash.reject = reject;
    lodash.rest = rest;
    lodash.shuffle = shuffle;
    lodash.sortBy = sortBy;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.unzip = unzip;
    lodash.values = values;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.zip = zip;
    lodash.zipObject = zipObject;

    // add aliases
    lodash.collect = map;
    lodash.drop = rest;
    lodash.each = forEach;
    lodash.extend = assign;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;

    // add functions to `lodash.prototype`
    mixin(lodash);

    // add Underscore compat
    lodash.chain = lodash;
    lodash.prototype.chain = function() { return this; };

    /*--------------------------------------------------------------------------*/

    // add functions that return unwrapped values when chaining
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.contains = contains;
    lodash.escape = escape;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.has = has;
    lodash.identity = identity;
    lodash.indexOf = indexOf;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isNaN = isNaN;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isUndefined = isUndefined;
    lodash.lastIndexOf = lastIndexOf;
    lodash.mixin = mixin;
    lodash.noConflict = noConflict;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.result = result;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.template = template;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;

    // add aliases
    lodash.all = every;
    lodash.any = some;
    lodash.detect = find;
    lodash.findWhere = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.include = contains;
    lodash.inject = reduce;

    forOwn(lodash, function(func, methodName) {
      if (!lodash.prototype[methodName]) {
        lodash.prototype[methodName] = function() {
          var args = [this.__wrapped__];
          push.apply(args, arguments);
          return func.apply(lodash, args);
        };
      }
    });

    /*--------------------------------------------------------------------------*/

    // add functions capable of returning wrapped and unwrapped values when chaining
    lodash.first = first;
    lodash.last = last;

    // add aliases
    lodash.take = first;
    lodash.head = first;

    forOwn(lodash, function(func, methodName) {
      if (!lodash.prototype[methodName]) {
        lodash.prototype[methodName]= function(callback, thisArg) {
          var result = func(this.__wrapped__, callback, thisArg);
          return callback == null || (thisArg && typeof callback != 'function')
            ? result
            : new lodashWrapper(result);
        };
      }
    });

    /*--------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type String
     */
    lodash.VERSION = '1.3.1';

    // add "Chaining" functions to the wrapper
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.value = wrapperValueOf;
    lodash.prototype.valueOf = wrapperValueOf;

    // add `Array` functions that return unwrapped values
    forEach(['join', 'pop', 'shift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        return func.apply(this.__wrapped__, arguments);
      };
    });

    // add `Array` functions that return the wrapped value
    forEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        func.apply(this.__wrapped__, arguments);
        return this;
      };
    });

    // add `Array` functions that return new wrapped values
    forEach(['concat', 'slice', 'splice'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        return new lodashWrapper(func.apply(this.__wrapped__, arguments));
      };
    });

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  var _ = runInContext();

  // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash was injected by a third-party script and not intended to be
    // loaded as a module. The global assignment can be reverted in the Lo-Dash
    // module via its `noConflict()` method.
    window._ = _;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return _;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && !freeExports.nodeType) {
    // in Node.js or RingoJS v0.8.0+
    if (freeModule) {
      (freeModule.exports = _)._ = _;
    }
    // in Narwhal or RingoJS v0.7.0-
    else {
      freeExports._ = _;
    }
  }
  else {
    // in a browser or Rhino
    window._ = _;
  }
}(this));

}, {});
require.register('vendors/theoricus/www/src/theoricus/config/config', function(require, module, exports){
/**
  Config module
  @module config
*/

/**
  Config class.
  @class Config
*/

var Config;

module.exports = Config = (function() {
  /**
    If true, execute the __default__ {{#crossLink "View"}} __view's__ {{/crossLink}} transitions at startup, otherwise, skip them and render the views without transitions.
  
    @property {Boolean} animate_at_startup
  */

  Config.prototype.animate_at_startup = false;

  /**
    If true, automatically insert __default__ fadeIn/fadeOut transitions for the {{#crossLink "View"}} __views__ {{/crossLink}}.
  
    @property {Boolean} enable_auto_transitions
  */


  Config.prototype.enable_auto_transitions = true;

  /**
    If true, skip all the {{#crossLink "View"}} __view's__ {{/crossLink}} __default__ transitions.
  
    @property {Boolean} disable_transitions
  */


  Config.prototype.disable_transitions = null;

  /**
  Config constructor, initializing the app's config settings defined in `settings.coffee`
  
  @class Config
  @constructor
  @param the {Theoricus} Shortcut for app's instance
  @param Settings {Object} App settings defined in the `settings.coffee`.
  */


  function Config(the, Settings) {
    var _ref, _ref1, _ref2, _ref3;
    this.the = the;
    this.Settings = Settings;
    this.disable_transitions = (_ref = this.Settings.disable_transitions) != null ? _ref : false;
    this.animate_at_startup = (_ref1 = this.Settings.animate_at_startup) != null ? _ref1 : true;
    this.enable_auto_transitions = (_ref2 = this.Settings.enable_auto_transitions) != null ? _ref2 : true;
    this.autobind = (_ref3 = this.Settings.autobind) != null ? _ref3 : false;
    this.vendors = this.Settings.vendors;
  }

  return Config;

})();

}, {});
require.register('vendors/theoricus/www/src/theoricus/core/factory', function(require, module, exports){
/**
  Core module
  @module core
*/

var Controller, Factory, Model, View;

Model = require('theoricus/mvc/model');

View = require('theoricus/mvc/view');

Controller = require('theoricus/mvc/controller');

/**
  Factory is responsible for loading/creating the MVC classes, templates and stylesheets using AMD loader.

  @class Factory
*/


module.exports = Factory = (function() {
  /**
    Stores the loaded controllers for subsequent calls.
    @property controllers {Array}
  */

  Factory.prototype.controllers = {};

  /**
  @class Factory
  @constructor
  @param the {Theoricus} Shortcut for app's instance
  */


  function Factory(the) {
    this.the = the;
    Model.Factory = this;
  }

  /**
  Loads and returns an instantiated {{#crossLink "Model"}} __Model__ {{/crossLink}} given the name. 
  
  If a model by given name was not found, returns an instance of `AppModel`.
  
  @method model
  @param name {String} Model name.
  @param init {Object} Default properties to be setted in the model instance.
  @param fn {Function} Callback function returning the model instance.
  */


  Factory.model = Factory.prototype.model = function(name, init, fn) {
    var ModelClass, classname, classpath, model, msg, prop, value;
    if (init == null) {
      init = {};
    }
    classname = name.camelize();
    classpath = ("app/models/" + name).toLowerCase();
    if ((ModelClass = require(classpath)) === null) {
      console.error("Model not found '" + classpath + "'");
      return fn(null);
    }
    if (!((model = new ModelClass) instanceof Model)) {
      msg = "" + classpath + " is not a Model instance, you probably forgot to ";
      msg += "extend thoricus/mvc/Model";
      console.error(msg);
      return fn(null);
    }
    model.classpath = classpath;
    model.classname = classname;
    for (prop in init) {
      value = init[prop];
      model[prop] = value;
    }
    return fn(model);
  };

  /**
  Loads and returns an instantiated {{#crossLink "View"}} __View__  {{/crossLink}} given the name. 
  
  If a {{#crossLink "View"}} __view__  {{/crossLink}} by given name was not found, returns an instance of `AppView`.
  
  @method view
  @param path {String} Path to the view file.
  @param fn {Function} Callback function returning the view instance.
  */


  Factory.prototype.view = function(path, fn) {
    var ViewClass, classname, classpath, msg, namespace, parts, view;
    classname = (parts = path.split('/')).pop().camelize();
    namespace = parts[parts.length - 1];
    classpath = "app/views/" + path;
    if ((ViewClass = require(classpath)) === null) {
      console.error("View not found '" + classpath + "'");
      return fn(null);
    }
    if (!((view = new ViewClass) instanceof View)) {
      msg = "" + classpath + " is not a View instance, you probably forgot to ";
      msg += "extend thoricus/mvc/View";
      console.error(msg);
      return fn(null);
    }
    if (view == null) {
      view = new AppView;
    }
    view._boot(this.the);
    view.classpath = classpath;
    view.classname = classname;
    view.namespace = namespace;
    return fn(view);
  };

  /**
  Returns an instantiated {{#crossLink "Controller"}}__Controller__{{/crossLink}} given the name.
  
  If the {{#crossLink "Controller"}}__controller__{{/crossLink}} was not loaded yeat, load it using AMD loader, otherwise, get it from `@controllers` object.
  
  Throws an error if no controller is found.
  
  @method controller
  @param name {String} Controller name.
  @param fn {Function} Callback function returning the controller instance.
  */


  Factory.prototype.controller = function(name, fn) {
    var ControllerClass, classname, classpath, controller, msg;
    classname = name.camelize();
    classpath = "app/controllers/" + name;
    if (this.controllers[classpath] != null) {
      return fn(this.controllers[classpath]);
    } else {
      if ((ControllerClass = require(classpath)) === null) {
        console.error("Controller not found '" + classpath + "'");
        return fn(null);
      }
      if (!((controller = new ControllerClass) instanceof Controller)) {
        msg = "" + classpath + " is not a Controller instance, you probably ";
        msg += "forgot to extend thoricus/mvc/Controller";
        console.error(msg);
        return fn(null);
      }
      controller.classpath = classpath;
      controller.classname = classname;
      controller._boot(this.the);
      this.controllers[classpath] = controller;
      return fn(this.controllers[classpath]);
    }
  };

  /**
  Returns an AMD compiled template.
  
  @method template
  @param path {String} Path to the template.
  @param fn {Function} Callback function returning the template string.
  
  @example
  */


  Factory.template = Factory.prototype.template = function(path, fn) {
    var classpath, template;
    classpath = 'templates/' + path;
    if ((template = require(classpath)) === null) {
      console.error('Template not found: ' + classpath);
      return fn(null);
    }
    return fn(template);
  };

  return Factory;

})();

}, {"theoricus/mvc/model":"vendors/theoricus/www/src/theoricus/mvc/model","theoricus/mvc/view":"vendors/theoricus/www/src/theoricus/mvc/view","theoricus/mvc/controller":"vendors/theoricus/www/src/theoricus/mvc/controller"});
require.register('vendors/theoricus/www/src/theoricus/core/process', function(require, module, exports){
/**
  Core module
  @module core
*/

var Process, StringUtil, View;

StringUtil = require('theoricus/utils/string_util');

View = require('theoricus/mvc/view');

/**
  Responsible for executing the {{#crossLink "Controller"}}__controller__{{/crossLink}} render action based on the {{#crossLink "Route"}}__Route__{{/crossLink}} information.

  @class Process
*/


module.exports = Process = (function() {
  /**
  {{#crossLink "Controller"}}__Controller__{{/crossLink}} instance, responsible for rendering the {{#crossLink "View"}}__views__{{/crossLink}} based on the __action__ defined in the {{#crossLink "Route"}}__Route's__{{/crossLink}} {{#crossLink "Route/to:property"}} __to__ {{/crossLink}} property.
  
  @property {Controller} controller
  */

  Process.prototype.controller = null;

  /**
  {{#crossLink "Route"}}{{/crossLink}} storing the information which will be used load the {{#crossLink "Controller"}}{{/crossLink}} and render the {{#crossLink "View"}} __view__ {{/crossLink}}.
  
  @property {Route} route
  */


  Process.prototype.route = null;

  /**
  Stores the dependency url defined in the {{#crossLink "Route"}}__Route's__{{/crossLink}} {{#crossLink "Route/at:property"}} __at__{{/crossLink}} property.
  
  @property {String} dependency
  */


  Process.prototype.dependency = null;

  /**
  Will be setted to __`true`__ in the __`run`__ method, right before the action execution, and set to __`false`__ right after the action is executed. 
  
  This way the {{#crossLink "Router/navigate:method"}} __navigate__ {{/crossLink}} method can abort the {{#crossLink "Process"}} __process__ {{/crossLink}} prematurely as needed.
  
  @property {Boolean} is_in_the_middle_of_running_an_action
  */


  Process.prototype.is_in_the_middle_of_running_an_action = false;

  /**
  Stores the {{#crossLink "Route"}} __Route__ {{/crossLink}} parameters.
  
  @example
  If there is a route defined with a parameter `id` like this:
  
      '/works/:id': #parameters are defined in the ':{value}' format.
          to: "pages/container"
          at: null
          el: "body"
  
  And the url changes to:
  
      '/works/1'
  
  
  The `params` will stores an `Object` like this:
  
      {id:1}
  
  
  @property {Object} params
  */


  Process.prototype.params = null;

  /**
  @class Process
  @constructor
  @param @the {Theoricus} Shortcut for app's instance.
  @param @processes {Processes} {{#crossLink "Processes"}}__Processes__{{/crossLink}}, responsible for delegating the current {{#crossLink "Route"}}__route__{{/crossLink}} to its respective {{#crossLink "Process"}}__process__{{/crossLink}}.
  @param @route {Route} {{#crossLink "Processes"}}__Route__{{/crossLink}} storing the current URL information.
  @param @at {Route} {{#crossLink "Processes"}}__Route__{{/crossLink}} dependency defined in the {{#crossLink "Route/at:property"}} __at__ {{/crossLink}} property.
  @param @url {String} Current url state.
  @param @parent_process {Process}
  @param fn {Function} Callback to be called after the `dependency` have been setted, and the {{#crossLink "Controller"}}__controller__{{/crossLink}} loaded.
  */


  function Process(the, processes, route, at, url, parent_process, fn) {
    var _this = this;
    this.the = the;
    this.processes = processes;
    this.route = route;
    this.at = at;
    this.url = url;
    this.parent_process = parent_process;
    this.initialize();
    this.the.factory.controller(this.route.controller_name, function(controller) {
      _this.controller = controller;
      return fn(_this, _this.controller);
    });
  }

  /**
  Evaluates the `@route` dependency.
  
  @method initialize
  */


  Process.prototype.initialize = function() {
    if (this.url === null && (this.parent_process != null)) {
      this.url = this.route.rewrite_url_with_parms(this.route.match, this.parent_process.params);
    }
    this.params = this.route.extract_params(this.url);
    if (this.at) {
      return this.dependency = this.route.rewrite_url_with_parms(this.at, this.params);
    }
  };

  /**
  Executes the {{#crossLink "Controller"}}__controller's__{{/crossLink}} __action__ defined in the {{#crossLink "Route/to:property"}} __to__ {{/crossLink}} property, if it isn't declared executes a default one based on the name convention.
  
  @param after_run {Function} Callback to be called after the view was rendered.
  */


  Process.prototype.run = function(after_run) {
    var action,
      _this = this;
    if (this.controller == null) {
      return;
    }
    this.is_in_the_middle_of_running_an_action = true;
    if (!this.controller[action = this.route.action_name]) {
      this.controller[action] = this.controller._build_action(this);
    }
    this.controller.process = this;
    this.after_run = function() {
      _this.controller.process = null;
      return after_run();
    };
    this.controller.after_render = this.after_run;
    this.controller[action](this.params);
    return this.is_in_the_middle_of_running_an_action = false;
  };

  /**
  Executes the {{#crossLink "View"}}__view's__{{/crossLink}} transition {{#crossLink "View/out:method"}} __out__ {{/crossLink}} method, wait for it to empty the dom element and then call the `@after_destroy` callback.
  
  @method destroy
  @param @after_destroy {Function} Callback to be called after the view was removed.
  */


  Process.prototype.destroy = function(after_destroy) {
    var action_name, controller_name, msg,
      _this = this;
    this.after_destroy = after_destroy;
    if (!(this.view instanceof View)) {
      controller_name = this.route.controller_name.camelize();
      action_name = this.route.action_name;
      msg = "Can't destroy View because it isn't a proper View instance. ";
      msg += "Check your `" + controller_name + "` controller, the action ";
      msg += "`" + action_name + "` must return a View instance.";
      console.error(msg);
      return;
    }
    return this.view.out(function() {
      _this.view.destroy();
      return typeof _this.after_destroy === "function" ? _this.after_destroy() : void 0;
    });
  };

  return Process;

})();

}, {"theoricus/utils/string_util":"vendors/theoricus/www/src/theoricus/utils/string_util","theoricus/mvc/view":"vendors/theoricus/www/src/theoricus/mvc/view"});
require.register('vendors/theoricus/www/src/theoricus/core/processes', function(require, module, exports){
/**
  Core module
  @module core
*/

var Factory, Process, Processes, Router, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Router = require('theoricus/core/router');

Process = require('theoricus/core/process');

_ = require('lodash');

Factory = null;

module.exports = Processes = (function() {
  /**
  Block the url state to be changed. Useful if there is a current {{#crossLink "Process"}}__Process__{{/crossLink}} being executed.
  
  @property {Boolean} locked
  */

  Processes.prototype.locked = false;

  Processes.prototype.disable_transitions = null;

  /**
    Stores the current {{#crossLink "Processes"}}__processes__{{/crossLink}} that are active.
  
    @property active_processes {Array}
  */


  Processes.prototype.active_processes = [];

  /**
    Stores the current {{#crossLink "Processes"}}__processes__{{/crossLink}} that doesn't need to be active.
  
    @property dead_processes {Array}
  */


  Processes.prototype.dead_processes = [];

  /**
    Stores the new {{#crossLink "Process"}}__process__{{/crossLink}} dependencies.
  
    @property pending_processes {Array}
  */


  Processes.prototype.pending_processes = [];

  /**
  Responsible for handling the url change. 
  
  When the URL changes, it initializes the {{#crossLink "Process"}}__process__{{/crossLink}} responsible for the current {{#crossLink "Route"}}__route__{{/crossLink}} (which is responsible for the current URL).
  
  Stores the new {{#crossLink "Process"}}__process__{{/crossLink}} dependency processes at `@pending_processes`
  
  Destroy the current {{#crossLink "Process"}}__processes__{{/crossLink}} that are active, but are not dependency of the new {{#crossLink "Process"}}__process__{{/crossLink}}.
  
  Runs the {{#crossLink "Process"}}__processes__{{/crossLink}} that are not active yet. 
  
  __Execution order__
  
  1. `_on_router_change` : 
  
      The URL changed, it will create a new {{#crossLink "Process"}}__process__{{/crossLink}} to handle the current Route.
  
  2. `_filter_pending_processes`
  
      Will search for all the new {{#crossLink "Process"}}__process__{{/crossLink}} dependencies recursively, and store them at `pending_processes`
  
  3. `_filter_dead_processes`
  
      Will search for all the {{#crossLink "Process"}}__process__{{/crossLink}} that doesn't need to be active.
  
  4. `_destroy_dead_processes` - one by one, waiting or not for callback (timing can be sync/async)
  
      Will destroy the {{#crossLink "Process"}}__process__{{/crossLink}} that doesn't need to be active.
  
  6. `_run_pending_process` - one by one, waiting or not for callback (timing can be sync/async)
  
      Will run the {{#crossLink "Process"}}__process__{{/crossLink}} that are required, but not active yet.
  
  @class Processes
  @constructor
  @param @the {Theoricus} Shortcut for app's instance.
  @param @Routes {Object} App routes defined in the `routes.coffee`
  */


  function Processes(the, Routes) {
    var _this = this;
    this.the = the;
    this.Routes = Routes;
    this._run_pending_processes = __bind(this._run_pending_processes, this);
    this._destroy_dead_processes = __bind(this._destroy_dead_processes, this);
    this._on_router_change = __bind(this._on_router_change, this);
    Factory = this.the.factory;
    if (this.the.config.animate_at_startup === false) {
      this.disable_transitions = this.the.config.disable_transitions;
      this.the.config.disable_transitions = true;
    }
    $(document).ready(function() {
      return _this.router = new Router(_this.the, _this.Routes, _this._on_router_change);
    });
  }

  /**
  Executed when the url changes, it creates a {{#crossLink "Process"}}__Process__{{/crossLink}} to manipulate the {{#crossLink "Route"}}__route__{{/crossLink}}, removes the current {{#crossLink "Process"}}__process__{{/crossLink}}, and run the new {{#crossLink "Process"}}__process__{{/crossLink}} alongside its dependencies.
  
  @method _on_router_change
  @param route {Route} {{#crossLink "Route"}}__Route__{{/crossLink}} containing the {{#crossLink "Controller"}}__controller__{{/crossLink}} and url state information.
  @param url {String} Current url state.
  */


  Processes.prototype._on_router_change = function(route, url) {
    var _this = this;
    if (this.locked) {
      return this.router.navigate(this.last_process.url, 0, 1);
    }
    this.locked = true;
    this.the.crawler.is_rendered = false;
    return new Process(this.the, this, route, route.at, url, null, function(process, controller) {
      _this.last_process = process;
      _this.pending_processes = [];
      return _this._filter_pending_processes(process, function() {
        _this._filter_dead_processes();
        return _this._destroy_dead_processes();
      });
    });
  };

  /**
    Searchs and stores the {{#crossLink "Process"}}__Process__{{/crossLink}} dependencies recursively.
  
    @method _filter_pending_processes
    @param process {Process} {{#crossLink "Process"}}__Process__{{/crossLink}} to search the dependencies.
    @param after_filter {Function} Callback to be called when all the dependencies are stored.
  */


  Processes.prototype._filter_pending_processes = function(process, after_filter) {
    var _this = this;
    this.pending_processes.push(process);
    if (process.dependency != null) {
      return this._find_dependency(process, function(dependency) {
        var a, b;
        if (dependency != null) {
          return _this._filter_pending_processes(dependency, after_filter);
        } else {
          a = process.dependecy;
          b = process.route.at;
          console.error("Dependency not found for " + a + " and/or " + b);
          return console.log(process);
        }
      });
    } else {
      return after_filter();
    }
  };

  /**
  Finds the dependency of the given {{#crossLink "Process"}}__Process__{{/crossLink}}
  
  @method _find_dependency
  @param process {Process} {{#crossLink "Process"}}__Process__{{/crossLink}} to find the dependency.
  @param after_find {Function} Callback to be called after the dependency has been found.
  */


  Processes.prototype._find_dependency = function(process, after_find) {
    var at, dep, dependency, params,
      _this = this;
    dependency = process.dependency;
    dep = _.find(this.active_processes, function(item) {
      return item.url === dependency;
    });
    if (dep != null) {
      return after_find(dep);
    }
    dep = _.find(this.router.routes, function(item) {
      return item.test(dependency);
    });
    if (dep != null) {
      params = dep.extract_params(process.dependency);
      at = dep.rewrite_url_with_parms(dep.at, params);
      return new Process(this.the, this, dep, at, dependency, process, function(process) {
        return after_find(process);
      });
    }
    return after_find(null);
  };

  /**
  Check which of the {{#crossLink "Process"}}__processes__{{/crossLink}} needs to stay active in order to render current {{#crossLink "Process"}}__process__{{/crossLink}}.
  The ones that doesn't, are pushed to `@dead_processes`.
  
  @method _filter_dead_processes
  */


  Processes.prototype._filter_dead_processes = function() {
    var active, process, url, _i, _len, _ref, _results;
    this.dead_processes = [];
    _ref = this.active_processes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      active = _ref[_i];
      process = _.find(this.pending_processes, function(item) {
        return item.url === active.url;
      });
      if (process != null) {
        url = process.url;
        if ((url != null) && url !== active.url) {
          _results.push(this.dead_processes.push(active));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(this.dead_processes.push(active));
      }
    }
    return _results;
  };

  /**
  Destroy the dead {{#crossLink "Process"}}__processes__{{/crossLink}} (doesn't need to be active) one by one, then run the pending {{#crossLink "Process"}}__process__{{/crossLink}}.
  
  @method _destroy_dead_processes
  */


  Processes.prototype._destroy_dead_processes = function() {
    var process;
    if (this.dead_processes.length) {
      process = this.dead_processes.pop();
      this.active_processes = _.reject(this.active_processes, function(p) {
        return p.route.match === process.route.match;
      });
      return process.destroy(this._destroy_dead_processes);
    } else {
      return this._run_pending_processes();
    }
  };

  /**
  Run the {{#crossLink "Process"}}__processes__{{/crossLink}} that are not active yet.
  
  @method _run_pending_processes
  */


  Processes.prototype._run_pending_processes = function() {
    var found, process, _base;
    if (this.pending_processes.length) {
      process = this.pending_processes.pop();
      found = _.find(this.active_processes, function(found_process) {
        return found_process.route.match === process.route.match;
      });
      if (found == null) {
        this.active_processes.push(process);
        return process.run(this._run_pending_processes);
      } else {
        return this._run_pending_processes();
      }
    } else {
      this.locked = false;
      this.the.crawler.is_rendered = true;
      if (this.disable_transitions != null) {
        this.the.config.disable_transitions = this.disable_transitions;
        this.disable_transitions = null;
      }
      if (this.active_processes.length) {
        return typeof (_base = _.last(this.active_processes)).on_activate === "function" ? _base.on_activate() : void 0;
      }
    }
  };

  return Processes;

})();

}, {"theoricus/core/router":"vendors/theoricus/www/src/theoricus/core/router","theoricus/core/process":"vendors/theoricus/www/src/theoricus/core/process","lodash":"vendors/theoricus/node_modules/lodash/dist/lodash"});
require.register('vendors/theoricus/www/src/theoricus/core/route', function(require, module, exports){
/**
  Core module
  @module core
*/

/**
  
  Responsible for manipulating and validating the url state.

  Stores the data defined in the application config `routes.coffee` file.

  @class Route
*/

var Route;

module.exports = Route = (function() {
  /**
  
    Match named params.
  
    @static
    @property named_param_reg {RegExp}
    @example
      "works/:id".match Route.named_param_reg # matchs ':id'
  */

  Route.named_param_reg = /:\w+/g;

  /**
  
    Match wildcard params.
  
    @static
    @property splat_param_reg {RegExp}
  
    @example
      "works/*anything/from/here".match Route.named_param_reg # matchs '*anything/from/here'
  */


  Route.splat_param_reg = /\*\w+/g;

  /**
  
    Regex responsible for parsing the url state.
  
    @property matcher {RegExp}
  */


  Route.prototype.matcher = null;

  /**
  
    Url state.
  
    @property match {String}
  */


  Route.prototype.match = null;

  /**
  
    Controller '/' action to which the route will be sent.
    
    @property to {String}
  */


  Route.prototype.to = null;

  /**
  
    Route to be called as a dependency.
    
    @property at {String}
  */


  Route.prototype.at = null;

  /**
  
    CSS selector to define where the template will be rendered.
    
    @property el {String}
  */


  Route.prototype.el = null;

  /**
  
    Store the controller name extracted from url.
    
    @property controller_name {String}
  */


  Route.prototype.controller_name = null;

  /**
  
    Store the controllers' action name extracted from url.
    
    @property action_name {String}
  */


  Route.prototype.action_name = null;

  /**
  
    Store the controllers' action parameters extracted from url.
    
    @property param_names {String}
  */


  Route.prototype.param_names = null;

  /**
    @class Route
    @constructor
    @param @match {String} Url state.
    @param @to {String} {{#crossLink "Controller"}}__Controller's__{{/crossLink}} action (controller/action)  to which the route will be sent.
    @param @at {String} {{#crossLink "Route"}}__Route__{{/crossLink}} to be called as a dependency.
    @param @el {String} CSS selector to define where the template will be rendered.
  */


  function Route(match, to, at, el) {
    var _ref;
    this.match = match;
    this.to = to;
    this.at = at;
    this.el = el;
    this.matcher = this.match.replace(Route.named_param_reg, '([^\/]+)');
    this.matcher = this.matcher.replace(Route.splat_param_reg, '(.*?)');
    this.matcher = new RegExp("^" + this.matcher + "$", 'm');
    _ref = to.split('/'), this.controller_name = _ref[0], this.action_name = _ref[1];
  }

  /**
  
    Extract the url named parameters.
  
    @method extract_params
    @param url {String}
  
    @example
  For a route `pages/:id`, extract the `:id` from `pages/1`
  
    extract_params('pages/1') # returns {id:1}
  */


  Route.prototype.extract_params = function(url) {
    var index, key, param_names, params, params_values, val, value, _i, _j, _len, _len1, _ref;
    params = {};
    if ((param_names = this.match.match(/(:|\*)\w+/g)) != null) {
      for (index = _i = 0, _len = param_names.length; _i < _len; index = ++_i) {
        value = param_names[index];
        param_names[index] = value.substr(1);
      }
    } else {
      param_names = [];
    }
    params_values = (_ref = url.match(this.matcher)) != null ? _ref.slice(1 || []) : void 0;
    if (params_values != null) {
      for (index = _j = 0, _len1 = params_values.length; _j < _len1; index = ++_j) {
        val = params_values[index];
        key = param_names[index];
        params[key] = val;
      }
    }
    return params;
  };

  /**
    Returns a string with the url param names replaced by param values.
  
    @method rewrite_url_with_parms
    @param url {String}
    @param params {Object}
  
    @example
        rewrite_url_with_parms('pages/:id', {id:1}) # returns 'pages/1'
  */


  Route.prototype.rewrite_url_with_parms = function(url, params) {
    var key, reg, value;
    for (key in params) {
      value = params[key];
      reg = new RegExp("[:\\*]+" + key, 'g');
      url = url.replace(reg, value);
    }
    return url;
  };

  /**
  
    Test given url using the {{#crossLink "Route/matcher:property"}} __@matcher__ {{/crossLink}} regexp.
    
    @method test
    @param url {String} Url to be tested.
  */


  Route.prototype.test = function(url) {
    return this.matcher.test(url);
  };

  return Route;

})();

}, {});
require.register('vendors/theoricus/www/src/theoricus/core/router', function(require, module, exports){
/**
  Core module
  @module core
*/

var Factory, Route, Router, StringUril,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

StringUril = require('theoricus/utils/string_util');

Route = require('theoricus/core/route');

require('../../../vendors/history');

Factory = null;

/**
  Proxies browser's History API, routing request to and from the aplication.

  @class Router
*/


module.exports = Router = (function() {
  /**
    Array storing all the routes defined in the application's route file (routes.coffee)
  
    @property {Array} routes
  */

  Router.prototype.routes = [];

  /**
    If false, doesn't handle the url route.
  
    @property {Boolean} trigger
  */


  Router.prototype.trigger = true;

  /**
  @class Router
  @constructor
  @param @the {Theoricus} Shortcut for app's instance.
  @param @Routes {Theoricus} Routes defined in the app's `routes.coffee` file.
  @param @on_change {Function} state/url handler.
  */


  function Router(the, Routes, on_change) {
    var opts, route, _ref,
      _this = this;
    this.the = the;
    this.Routes = Routes;
    this.on_change = on_change;
    this.run = __bind(this.run, this);
    Factory = this.the.factory;
    _ref = this.Routes.routes;
    for (route in _ref) {
      opts = _ref[route];
      this.map(route, opts.to, opts.at, opts.el, this);
    }
    History.Adapter.bind(window, 'statechange', function() {
      return _this.route(History.getState());
    });
    setTimeout(function() {
      var url;
      url = window.location.pathname;
      if (url === "/") {
        url = _this.Routes.root;
      }
      return _this.run(url);
    }, 1);
  }

  /**
    Create and store a {{#crossLink "Route"}}__route__{{/crossLink}} within `routes` array.
    @method map
    @param route {String} Url state.
    @param to {String} {{#crossLink "Controller"}}__Controller's__{{/crossLink}} action (controller/action) to which the {{#crossLink "Route"}}__route__{{/crossLink}} will be sent.
    @param at {String} Url state to be called as a dependency.
    @param el {String} CSS selector to define where the template will be rendered in the DOM.
  */


  Router.prototype.map = function(route, to, at, el) {
    this.routes.push(route = new Route(route, to, at, el, this));
    return route;
  };

  /**
    Handles the url state.
  
    Calls the `@on_change` method passing as parameter the {{#crossLink "Route"}}__Route__{{/crossLink}} storing the current url state information.
  
    @method route
    @param state {Object} HTML5 pushstate state
  */


  Router.prototype.route = function(state) {
    var Controller, action_name, controller_name, e, route, url, url_parts, _i, _j, _len, _len1, _ref, _ref1;
    if (this.trigger) {
      url = state.hash || state.title;
      url = url.replace('.', '');
      if (this.the.base_path != null) {
        url = url.replace(this.the.base_path, '');
      }
      if ((url.slice(0, 1)) === '.') {
        url = url.slice(1);
      }
      if ((url.slice(0, 1)) !== '/') {
        url = "/" + url;
      }
      if (url === "/") {
        url = this.Routes.root;
      }
      _ref = this.routes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        route = _ref[_i];
        if (route.test(url)) {
          return this.on_change(route, url);
        }
      }
      url_parts = (url.replace(/^\//m, '')).split('/');
      controller_name = url_parts[0];
      action_name = url_parts[1] || 'index';
      try {
        Controller = require.resolve('app/controllers/' + controller_name);
        route = this.map(url, "" + controller_name + "/" + action_name, null, 'body');
        return this.on_change(route, url);
      } catch (_error) {
        e = _error;
        _ref1 = this.routes;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          route = _ref1[_j];
          if (route.test(this.Routes.notfound)) {
            return this.on_change(route, url);
          }
        }
      }
    }
    return this.trigger = true;
  };

  /**
    Tells Theoricus to navigate to another view.
  
    @method navigate
    @param url {String} New url state.
    @param [trigger=true] {String} If false, doesn't change the View.
    @param [replace=false] {String} If true, pushes a new state to the browser.
  */


  Router.prototype.navigate = function(url, trigger, replace) {
    var action;
    if (trigger == null) {
      trigger = true;
    }
    if (replace == null) {
      replace = false;
    }
    if (!window.history.pushState) {
      return window.location = url;
    }
    this.trigger = trigger;
    action = replace ? "replaceState" : "pushState";
    return History[action](null, null, url);
  };

  /**
    {{#crossLink "Router/navigate:method"}} __Navigate__ {{/crossLink}} to the initial url state.
  
    @method run
    @param url {String} New url state.
    @param [trigger=true] {String} If false, doesn't handle the url's state.
  */


  Router.prototype.run = function(url, trigger) {
    if (trigger == null) {
      trigger = true;
    }
    if (this.the.base_path != null) {
      url = url.replace(this.the.base_path, '');
    }
    url = url.replace(/\/$/g, '');
    this.trigger = trigger;
    return this.route({
      title: url
    });
  };

  /**
    If `index` is negative go back through browser history `index` times, if `index` is positive go forward through browser history `index` times.
  
    @method go
    @param index {Number}
  */


  Router.prototype.go = function(index) {
    return History.go(index);
  };

  /**
    Go back once through browser history.
  
    @method back
  */


  Router.prototype.back = function() {
    return History.back();
  };

  /**
    Go forward once through browser history.
  
    @method forward
  */


  Router.prototype.forward = function() {
    return History.forward();
  };

  return Router;

})();

}, {"theoricus/utils/string_util":"vendors/theoricus/www/src/theoricus/utils/string_util","theoricus/core/route":"vendors/theoricus/www/src/theoricus/core/route","../../../vendors/history":"vendors/theoricus/www/vendors/history"});
require.register('vendors/theoricus/www/src/theoricus/mvc/controller', function(require, module, exports){
/**
  MVC module
  @module mvc
*/

var Controller, Fetcher, Model, View;

Model = require('theoricus/mvc/model');

View = require('theoricus/mvc/view');

Fetcher = require('theoricus/mvc/lib/fetcher');

/**
  The controller is responsible for rendering the view.

  It receives the URL params, to be used for Model instantiation.

  The controller actions are mapped with the URL states (routes) in the app `routes` file.

  @class Controller
*/


module.exports = Controller = (function() {
  function Controller() {}

  /*
  @param [theoricus.Theoricus] @the   Shortcut for app's instance
  */


  /**
    This function is executed by the Factory. It saves a `@the` reference inside the controller.
  
    @method _boot
    @param @the {Theoricus} Shortcut for app's instance
  */


  Controller.prototype._boot = function(the) {
    this.the = the;
    return this;
  };

  /**
    Build a default action ( renders the view passing all model records as data) in case the controller doesn't have an action implemented for the current `process` call.
  
    @method _build_action
    @param process {Process} Current {{#crossLink "Process"}}{{/crossLink}} being executed.
  */


  Controller.prototype._build_action = function(process) {
    var _this = this;
    return function(params, fn) {
      var action_name, controller_name, model_name;
      controller_name = process.route.controller_name;
      action_name = process.route.action_name;
      model_name = controller_name.singularize();
      return _this.the.factory.model(model_name, null, function(model) {
        var view_folder, view_name;
        if (model == null) {
          return;
        }
        view_folder = controller_name;
        view_name = action_name;
        if (model.all != null) {
          return _this.render("" + view_folder + "/" + view_name, model.all());
        } else {
          return _this.render("" + view_folder + "/" + view_name);
        }
      });
    };
  };

  /*
  Renders to some view
  
  @param [String] path  Path to view on the app tree
  @param [String] data  data to be rendered on the template
  */


  /**
    Responsible for rendering the View.
  
    Usually, this method is executed in the controller action mapped with the `route`.
    
    @method render
    @param path {String} View's file path. 
    @param data {Object} Data to be passed to the view. 
  
    @example
        index:(id)-> # Controller action
            render "app/views/index", Model.first()
  */


  Controller.prototype.render = function(path, data) {
    var _this = this;
    return this.the.factory.view(path, function(view) {
      if (view == null) {
        return;
      }
      _this.process.view = view;
      view.process = _this.process;
      view.after_in = _this.after_render;
      if (data instanceof Fetcher) {
        if (data.loaded) {
          return view._render(data.records);
        } else {
          return data.onload = function(records) {
            return view._render(records);
          };
        }
      } else {
        return view._render(data);
      }
    });
  };

  /**
    Shortcut for application navigate.
  
    Navigate to the given URL.
  
    @method navigate
    @param url {String} URL to navigate to.
  */


  Controller.prototype.navigate = function(url) {
    if (this.process.is_in_the_middle_of_running_an_action) {
      this.process.processes.active_processes.pop();
      this.process.processes.pending_processes = [];
      this.after_render();
    }
    return this.the.processes.router.navigate(url);
  };

  return Controller;

})();

}, {"theoricus/mvc/model":"vendors/theoricus/www/src/theoricus/mvc/model","theoricus/mvc/view":"vendors/theoricus/www/src/theoricus/mvc/view","theoricus/mvc/lib/fetcher":"vendors/theoricus/www/src/theoricus/mvc/lib/fetcher"});
require.register('vendors/theoricus/www/src/theoricus/mvc/lib/binder', function(require, module, exports){
var Binder;

module.exports = Binder = (function() {
  var bind_name_reg, bind_reg, collect, context_reg, parse;

  function Binder() {}

  context_reg = '(<!-- @[\\w]+ -->)([^<]+)(<!-- \/@[\\w]+ -->)';

  bind_reg = "(<!-- @~KEY -->)([^<]+)(<!-- \/@~KEY -->)";

  bind_name_reg = /(<!-- @)([\w]+)( -->)/;

  Binder.prototype.binds = null;

  Binder.prototype.bind = function(dom, just_clean_attrs) {
    return parse((this.binds = {}), dom, just_clean_attrs);
  };

  Binder.prototype.update = function(field, val) {
    var current, item, node, search, updated, _i, _len, _ref, _results;
    if (this.binds == null) {
      return;
    }
    if (this.binds[field] == null) {
      return;
    }
    _ref = this.binds[field] || [];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      node = $(item.target);
      switch (item.type) {
        case 'node':
          current = node.html();
          search = new RegExp(bind_reg.replace(/\~KEY/g, field), 'g');
          updated = current.replace(search, "$1" + val + "$3");
          node.html(updated);
          break;
        case 'attr':
          _results.push(node.attr(item.attr, val));
          break;
        default:
          _results.push(void 0);
      }
    }
    return _results;
  };

  parse = function(binds, dom, just_clean_attrs) {
    return dom.children().each(function() {
      var attr, key, keys, match_all, match_single, name, text, value, _i, _j, _len, _len1, _ref;
      _ref = this.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        name = attr.nodeName;
        value = attr.nodeValue;
        match_single = new RegExp(context_reg);
        if (match_single.test(value)) {
          key = (value.match(bind_name_reg))[2];
          ($(this)).attr(name, (value.match(match_single))[2]);
          if (just_clean_attrs === false) {
            collect(binds, this, 'attr', key, name);
          }
        }
      }
      if (just_clean_attrs === false) {
        match_all = new RegExp(context_reg, 'g');
        text = ($(this)).clone().children().remove().end().html();
        text = "" + text;
        keys = (text.match(match_all)) || [];
        for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
          key = keys[_j];
          key = (key.match(bind_name_reg))[2];
          collect(binds, this, 'node', key);
        }
      }
      return parse(binds, $(this), just_clean_attrs);
    });
  };

  collect = function(binds, target, type, variable, attr) {
    var bind, tmp;
    bind = (binds[variable] != null ? binds[variable] : binds[variable] = []);
    tmp = {
      type: type,
      target: target
    };
    if (attr != null) {
      tmp.attr = attr;
    }
    return bind.push(tmp);
  };

  return Binder;

})();

}, {});
require.register('vendors/theoricus/www/src/theoricus/mvc/lib/fetcher', function(require, module, exports){
var Fetcher;

module.exports = Fetcher = (function() {
  function Fetcher() {}

  Fetcher.prototype.loaded = null;

  Fetcher.prototype.onload = null;

  Fetcher.prototype.onerror = null;

  Fetcher.prototype.data = null;

  return Fetcher;

})();

}, {});
require.register('vendors/theoricus/www/src/theoricus/mvc/model', function(require, module, exports){
var ArrayUtil, Binder, Fetcher, Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

ArrayUtil = require('theoricus/utils/array_util');

Binder = require('theoricus/mvc/lib/binder');

Fetcher = require('theoricus/mvc/lib/fetcher');

module.exports = Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.Factory = null;

  Model._fields = [];

  Model._collection = [];

  Model.rest = function(host, resources) {
    var k, v, _ref1, _results;
    if (resources == null) {
      _ref1 = [host, null], resources = _ref1[0], host = _ref1[1];
    }
    _results = [];
    for (k in resources) {
      v = resources[k];
      _results.push(this[k] = this._build_rest.apply(this, [k].concat(v.concat(host))));
    }
    return _results;
  };

  Model.fields = function(fields, opts) {
    var key, type, _results;
    if (opts == null) {
      opts = {
        validate: true
      };
    }
    _results = [];
    for (key in fields) {
      type = fields[key];
      _results.push(this._build_gs(key, type, opts));
    }
    return _results;
  };

  /*
  Builds a method to fetch the given service.
  
  Notice the method is being returned inside a private scope
  that contains all the variables needed to fetch the data.
  
  
  @param [String] key   
  @param [String] method  
  @param [String] url   
  @param [String] domain
  */


  Model._build_rest = function(key, method, url, domain) {
    var call;
    return call = function() {
      var args, data, found, r_url;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if ((domain != null) && domain.substring(domain.length - 1) === "/") {
        domain = domain.substring(0, domain.length - 1);
      }
      if (key === "read" && this._collection.length) {
        found = ArrayUtil.find(this._collection, {
          id: args[0]
        });
        if (found != null) {
          return found.item;
        }
      }
      if (args.length) {
        if (typeof args[args.length - 1] === 'object') {
          data = args.pop();
        } else {
          data = '';
        }
      }
      r_url = url;
      while ((/:[a-z]+/.exec(r_url)) != null) {
        r_url = url.replace(/:[a-z]+/, args.shift() || null);
      }
      if (domain != null) {
        r_url = "" + domain + "/" + r_url;
      }
      return this._request(method, r_url, data);
    };
  };

  /*
  General request method
  
  @param [String] method  URL request method
  @param [String] url   URL to be requested
  @param [Object] data  Data to be send
  */


  Model._request = function(method, url, data) {
    var fetcher, req,
      _this = this;
    if (data == null) {
      data = '';
    }
    fetcher = new Fetcher;
    req = {
      url: url,
      type: method,
      data: data
    };
    if (/\.json/.test(url)) {
      req.dataType = 'json';
    }
    req = $.ajax(req);
    req.done(function(data) {
      fetcher.loaded = true;
      return _this._instantiate([].concat(data), function(results) {
        fetcher.records = results;
        return typeof fetcher.onload === "function" ? fetcher.onload(fetcher.records) : void 0;
      });
    });
    req.error(function(error) {
      fetcher.error = true;
      if (fetcher.onerror != null) {
        return fetcher.onerror(error);
      } else {
        return console.error(error);
      }
    });
    return fetcher;
  };

  /*
  Builds local getters/setters for the given params
  
  @param [String] field
  @param [String] type
  */


  Model._build_gs = function(field, type, opts) {
    var classname, getter, ltype, setter, stype, _val;
    _val = null;
    classname = (("" + this).match(/function\s(\w+)/))[1];
    stype = (("" + type).match(/function\s(\w+)/))[1];
    ltype = stype.toLowerCase();
    getter = function() {
      return _val;
    };
    setter = function(value) {
      var is_valid, msg, prop;
      switch (ltype) {
        case 'string':
          is_valid = typeof value === 'string';
          break;
        case 'number':
          is_valid = typeof value === 'number';
          break;
        default:
          is_valid = value instanceof type;
      }
      if (is_valid || opts.validate === false) {
        _val = value;
        return this.update(field, _val);
      } else {
        prop = "" + classname + "." + field;
        msg = "Property '" + prop + "' must to be " + stype + ".";
        throw new Error(msg);
      }
    };
    return Object.defineProperty(this.prototype, field, {
      get: getter,
      set: setter
    });
  };

  /*
  Instantiate one Model instance for each of the items present in data.
  
  And array with 10 items will result in 10 new models, that will be 
  cached into @_collection variable
  
  @param [Object] data  Data to be parsed
  */


  Model._instantiate = function(data, callback) {
    var at, classname, record, records, _i, _len, _results,
      _this = this;
    classname = (("" + this).match(/function\s(\w+)/))[1];
    records = [];
    _results = [];
    for (at = _i = 0, _len = data.length; _i < _len; at = ++_i) {
      record = data[at];
      _results.push(Model.Factory.model(classname, record, function(_model) {
        records.push(_model);
        if (records.length === data.length) {
          _this._collection = (_this._collection || []).concat(records);
          return callback((records.length === 1 ? records[0] : records));
        }
      }));
    }
    return _results;
  };

  return Model;

})(Binder);

}, {"theoricus/utils/array_util":"vendors/theoricus/www/src/theoricus/utils/array_util","theoricus/mvc/lib/binder":"vendors/theoricus/www/src/theoricus/mvc/lib/binder","theoricus/mvc/lib/fetcher":"vendors/theoricus/www/src/theoricus/mvc/lib/fetcher"});
require.register('vendors/theoricus/www/src/theoricus/mvc/view', function(require, module, exports){
/**
  MVC module
  @module mvc
*/

var Factory, Model, View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Model = require('theoricus/mvc/model');

Factory = null;

/**
  The View class is responsible for manipulating the templates (DOM).

  @class View
*/


module.exports = View = (function() {
  function View() {
    this.set_triggers = __bind(this.set_triggers, this);
    this._on_resize = __bind(this._on_resize, this);
    this._render = __bind(this._render, this);
  }

  /**
    Sets the title of the document.
  
    @property title {String}
  */


  View.prototype.title = null;

  /**
    Stores template's html as jQuery object.
  
    @property el {Object}
  */


  View.prototype.el = null;

  /**
   File's path relative to the app's folder.
  
   @property classpath {String}
  */


  View.prototype.classpath = null;

  /**
    Stores the class name
  
    @property classname {String}
  */


  View.prototype.classname = null;

  /**
    Namespace is the folder path relative to the `views` folder.
  
    @property namespace {String}
  */


  View.prototype.namespace = null;

  /**
    {{#crossLink "Process"}}{{/crossLink}} responsible for running the controller's action that rendered this view.
  
    @property process {Process}
  */


  View.prototype.process = null;

  /**
    Object responsible for binding the DOM events on the view. Use the format `selector event: handler` to define an event. It is called after the `template` was rendered in the document.
  
    @property events {Object}
    @example
        events:  
            ".bt-alert click":"on_alert"
  */


  View.prototype.events = null;

  /**
    Responsible for storing the template's data and the URL params.
    
    @property data {Object}
  */


  View.prototype.data = null;

  /**
    This function is executed by the Factory. It saves a `@the.factory` reference inside the view.
  
    @method _boot
    @param @the {Theoricus} Shortcut for app's instance
  */


  View.prototype._boot = function(the) {
    this.the = the;
    Factory = this.the.factory;
    return this;
  };

  /**
    Responsible for rendering the view, passing the data to the `template`.
  
    @method _render
    @param data {Object} Data object to be passed to the template, usually it is and instance of the {{#crossLink "Model"}}{{/crossLink}}
    @param [template=null] {String} The path of the template to be rendered.
  */


  View.prototype._render = function(data, template) {
    var tmpl_folder, tmpl_name,
      _this = this;
    if (data == null) {
      data = {};
    }
    this.data = {
      view: this,
      params: this.process.params,
      data: data
    };
    if (typeof this.before_render === "function") {
      this.before_render(this.data);
    }
    this.process.on_activate = function() {
      if (typeof _this.on_activate === "function") {
        _this.on_activate();
      }
      if (_this.title != null) {
        return document.title = _this.title;
      }
    };
    this.el = $(this.process.route.el);
    if (template == null) {
      tmpl_folder = this.namespace.replace(/\./g, '/');
      tmpl_name = this.classname.underscore();
      template = "" + tmpl_folder + "/" + tmpl_name;
    }
    return this.render_template(template);
  };

  /**
    If there is a `before_render` method implemented, it will be executed before the view's template is appended to the document.
  
    @method before_render
    @param data {Object} Reference to the `@data`
  */


  /**
    Responsible for loading the given template, and appending it to view's `el` element.
  
    @method render_template
    @param template {String} Path to the template to be rendered.
  */


  View.prototype.render_template = function(template) {
    var _this = this;
    return this.the.factory.template(template, function(template) {
      var dom;
      dom = template(_this.data);
      dom = _this.el.append(dom);
      if (_this.data instanceof Model) {
        _this.data.bind(dom, !_this.the.config.autobind);
      }
      if (typeof _this.set_triggers === "function") {
        _this.set_triggers();
      }
      if (typeof _this.after_render === "function") {
        _this.after_render(_this.data);
      }
      _this["in"]();
      if (_this.on_resize != null) {
        $(window).unbind('resize', _this._on_resize);
        $(window).bind('resize', _this._on_resize);
        return _this.on_resize();
      }
    });
  };

  /**
    If there is an `after_render` method implemented, it will be executed after the view's template is appended to the document. 
  
    Useful for caching DOM elements as jQuery objects.
  
    @method after_render
    @param data {Object} Reference to the `@data`
  */


  /**
    If there is an `@on_resize` method implemented, it will be executed whenever the window triggers the `scroll` event.
  
    @method on_resize
  */


  View.prototype._on_resize = function() {
    return typeof this.on_resize === "function" ? this.on_resize() : void 0;
  };

  /**
    Process the `@events`, automatically binding them.
  
    @method set_triggers
  */


  View.prototype.set_triggers = function() {
    var all, ev, funk, sel, _ref, _ref1, _results;
    if (this.events == null) {
      return;
    }
    _ref = this.events;
    _results = [];
    for (sel in _ref) {
      funk = _ref[sel];
      _ref1 = sel.match(/(.*)[\s|\t]+([\S]+)$/m), all = _ref1[0], sel = _ref1[1], ev = _ref1[2];
      (this.el.find(sel)).unbind(ev, null, this[funk]);
      _results.push((this.el.find(sel)).bind(ev, null, this[funk]));
    }
    return _results;
  };

  /**
    If there is a `@before_in` method implemented, it will be called before the view execute its intro animations. 
  
    Useful to setting up the DOM elements properties before animating them.
  
    @method before_in
  */


  /**
    The `in` method is where the view intro animations are defined. It is executed after the `@after_render` method.
  
    The `@after_in` method must be called at the end of the animations, so Theoricus knows that the View finished animating.
  
    @method in
  */


  View.prototype["in"] = function() {
    var animate,
      _this = this;
    if (typeof this.before_in === "function") {
      this.before_in();
    }
    animate = this.the.config.enable_auto_transitions;
    animate &= !this.the.config.disable_transitions;
    if (!animate) {
      return typeof this.after_in === "function" ? this.after_in() : void 0;
    } else {
      this.el.css("opacity", 0);
      return this.el.animate({
        opacity: 1
      }, 300, function() {
        return typeof _this.after_in === "function" ? _this.after_in() : void 0;
      });
    }
  };

  /**
    If there is an`@after_in` method implemented, it will be called after the view finish its intro animations.
  
    Will only be executed if the {{#crossLink "Config"}}{{/crossLink}} property `disable_transitions` is `false`.
  
    @method after_in
  */


  /**
    If there is an`@before_out` method implemented, it will be called before the view executes its exit animations.
  
    @method before_out
  */


  /**
    The `@out` method is responsible for the view's exit animations. 
  
    At the end of the animations, the `after_out` callback must be called.
  
    @method out
    @param after_out {Function} Callback to be called when the animation ends.
  */


  View.prototype.out = function(after_out) {
    var animate;
    if (typeof this.before_out === "function") {
      this.before_out();
    }
    animate = this.the.config.enable_auto_transitions;
    animate &= !this.the.config.disable_transitions;
    if (!animate) {
      return after_out();
    } else {
      return this.el.animate({
        opacity: 0
      }, 300, after_out);
    }
  };

  /**
    If there is an`@before_destroy` method implemented, it will be called before removing the view's template from the document.
  
    @method before_destroy
  */


  /**
    Destroy the view after executing the `@out` method, the default behaviour empties its `el` element and unbind the `window.resize` event.
  
    If overwritten, the `super` method must be called.
  
    Useful for removing variables assignments that needs to be removed from memory by the Garbage Collector, avoiding Memory Leaks.
  
    @method destroy
  */


  View.prototype.destroy = function() {
    if (this.on_resize != null) {
      $(window).unbind('resize', this._on_resize);
    }
    if (typeof this.before_destroy === "function") {
      this.before_destroy();
    }
    return this.el.empty();
  };

  /**
    Shortcut for application navigate.
  
    Navigate to the given URL.
  
    @method navigate
    @param url {String} URL to navigate to.
  */


  View.prototype.navigate = function(url) {
    return this.the.processes.router.navigate(url);
  };

  return View;

})();

}, {"theoricus/mvc/model":"vendors/theoricus/www/src/theoricus/mvc/model"});
require.register('vendors/theoricus/www/src/theoricus/theoricus', function(require, module, exports){
/**
  Theoricus module
  @module theoricus
*/

var Config, Factory, Processes, Theoricus;

Config = require('theoricus/config/config');

Factory = require('theoricus/core/factory');

Processes = require('theoricus/core/processes');

require('../../vendors/inflection');

require('../../vendors/jquery');

require('../../vendors/json2');

/**
  Theoricus main class.
  @class Theoricus
*/


module.exports = Theoricus = (function() {
  /**
    Base path for your application, in case it runs in a subfolder. If not, this
    can be left blank, meaning your application will run in the `web_root` dir
    on your server.
  
    @property {String} base_path
  */

  Theoricus.prototype.base_path = '';

  /**
    Instance of {{#crossLink "Factory"}}__Factory__{{/crossLink}} class.
    @property {Factory} factory
  */


  Theoricus.prototype.factory = null;

  /**
    Instance of {{#crossLink "Config"}}__Config__{{/crossLink}} class, fed by the application's `config.coffee` file.
    @property {Config} config
  */


  Theoricus.prototype.config = null;

  /**
    Instance of {{#crossLink "Processes"}}__Processes__{{/crossLink}} class, responsible for handling the url change.
    @property {Processes} processes
  */


  Theoricus.prototype.processes = null;

  /**
    Reference to `window.crawler` object, this object contains a property called `is_rendered` which is set to true whenever the current {{#crossLink "Process"}}__process__{{/crossLink}} finishes rendering.
  
    This object is used specially for server-side indexing of Theoricus's apps, though the use of <a href="http://github.com/serpentem/snapshooter">Snapshooter</a>.
    @property {Crawler} crawler
  */


  Theoricus.prototype.crawler = (window.crawler = {
    is_rendered: false
  });

  /**
    Theoricus constructor, must to be invoked by the application with a `super`
    call.
    @class Theoricus
    @constructor
    @param Settings {Object} Settings defined in the application's `config.coffee` file.
    @param Routes {Object} Routes defined in the application's `routes.coffee` file.
  */


  function Theoricus(Settings, Routes) {
    this.Settings = Settings;
    this.Routes = Routes;
    this.config = new Config(this, this.Settings);
    this.factory = new Factory(this);
  }

  /**
    Starts the Theoricus engine, plugging the {{#crossLink "Processes"}}__Processes__{{/crossLink}} onto the {{#crossLink "Router"}}__Router__{{/crossLink}} system.
    @method start
  */


  Theoricus.prototype.start = function() {
    return this.processes = new Processes(this, this.Routes);
  };

  return Theoricus;

})();

}, {"theoricus/config/config":"vendors/theoricus/www/src/theoricus/config/config","theoricus/core/factory":"vendors/theoricus/www/src/theoricus/core/factory","theoricus/core/processes":"vendors/theoricus/www/src/theoricus/core/processes","../../vendors/inflection":"vendors/theoricus/www/vendors/inflection","../../vendors/jquery":"vendors/theoricus/www/vendors/jquery","../../vendors/json2":"vendors/theoricus/www/vendors/json2"});
require.register('vendors/theoricus/www/src/theoricus/utils/array_util', function(require, module, exports){
/**
  utils module
  @module utils
*/

var ArrayUtil, ObjectUtil;

ObjectUtil = require('theoricus/utils/object_util');

/**
  ArrayUtil class.
  @class ArrayUtil
*/


module.exports = ArrayUtil = (function() {
  function ArrayUtil() {}

  /**
  
  Search for a record within the given source array that contains the `search` filter.
  
  @method find
  @static
  @param src {Array} Source array.
  @param search {Object} Object to be found within the source array.
  @example
    fruits = {name: "orange", id:0}, {name: "banana", id:1}, {name: "watermelon", id:2}
    ArrayUtil.find fruits, {name: "orange"} # returns {name: "orange", id:0}
  */


  ArrayUtil.find = function(src, search) {
    var i, v, _i, _len;
    for (i = _i = 0, _len = src.length; _i < _len; i = ++_i) {
      v = src[i];
      if (!(search instanceof Object)) {
        if (v === search) {
          return {
            item: v,
            index: i
          };
        }
      } else {
        if (ObjectUtil.find(v, search) != null) {
          return {
            item: v,
            index: i
          };
        }
      }
    }
    return null;
  };

  /**
  
  Delete a record within the given source array that contains the `search` filter.
  
  @method delete
  @static
  @param src {Array} Source array.
  @param search {Object} Object to be found within the source array.
  @example
    fruits = [{name: "orange", id:0}, {name: "banana", id:1}, {name: "watermelon", id:2}]
    ArrayUtil.delete fruits, {name: "banana"}
    console.log fruits #[{name: "orange", id:0}, {name: "watermelon", id:2}]
  */


  ArrayUtil["delete"] = function(src, search) {
    var item;
    item = ArrayUtil.find(src, search);
    if (item != null) {
      return src.splice(item.index, 1);
    }
  };

  return ArrayUtil;

})();

}, {"theoricus/utils/object_util":"vendors/theoricus/www/src/theoricus/utils/object_util"});
require.register('vendors/theoricus/www/src/theoricus/utils/object_util', function(require, module, exports){
/**
  utils module
  @module utils
*/

/**
  ObjectUtil class.
  @class ObjectUtil
*/

var ObjectUtil;

module.exports = ObjectUtil = (function() {
  function ObjectUtil() {}

  /**
  
  Check if source object has given `search` properties.
  
  @method find
  @static
  @param src {Object} Source object.
  @param search {Object} Object to be found within the source object.
  @param [strong_typing=false] {Boolean}
  @example
    obj = {name:"Drimba", age:22, skills:{language:"coffeescript", editor:"sublime"}}
    ObjectUtil.find obj, {age:22} #returns {name:"Drimba", age:22, skills:{language:"coffeescript", editor:"sublime"}}
  */


  ObjectUtil.find = function(src, search, strong_typing) {
    var k, v;
    if (strong_typing == null) {
      strong_typing = false;
    }
    for (k in search) {
      v = search[k];
      if (v instanceof Object) {
        return ObjectUtil.find(src[k], v);
      } else if (strong_typing) {
        if (src[k] === v) {
          return src;
        }
      } else {
        if (("" + src[k]) === ("" + v)) {
          return src;
        }
      }
    }
    return null;
  };

  return ObjectUtil;

})();

}, {});
require.register('vendors/theoricus/www/src/theoricus/utils/string_util', function(require, module, exports){
/**
  utils module
  @module utils
*/

/**
  StringUtil class.
  @class StringUtil
*/

var StringUtil;

module.exports = StringUtil = (function() {
  /**
  
  Capitalize first letter of the given string
  
  @method ucfirst
  @static
  @param str {String}
  @example
    StringUtil.ucfirst "theoricus" #returns 'Theoricus'
  */

  function StringUtil() {}

  StringUtil.ucfirst = function(str) {
    var a, b;
    a = str.substr(0, 1).toUpperCase();
    b = str.substr(1);
    return a + b;
  };

  /**
  
  Convert String to CamelCase pattern.
  
  @method camelize
  @static
  @param str {String}
  @example
    StringUtil.camelize "giddy_up" #returns 'GiddyUp'
  */


  StringUtil.camelize = function(str) {
    var buffer, part, parts, _i, _len;
    parts = [].concat(str.split("_"));
    buffer = "";
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      part = parts[_i];
      buffer += StringUtil.ucfirst(part);
    }
    return buffer;
  };

  /**
  
  Split CamelCase words using underscore.
  
  @method underscore
  @static
  @param str {String}
  @example
    StringUtil.underscore "GiddyUp" #returns '_giddy_up'
  */


  StringUtil.underscore = function(str) {
    str = str.replace(/([A-Z])/g, "_$1").toLowerCase();
    return str = str.substr(1) === "_" ? str.substr(1) : str;
  };

  return StringUtil;

})();

}, {});
require.register('vendors/theoricus/www/vendors/history', function(require, module, exports){
/*
  History.JS 1.7.1
  https://github.com/browserstate/history.js/blob/master/scripts/bundled/html4%2Bhtml5/native.history.js
*/ 
window.JSON||(window.JSON={}),function(){function f(a){return a<10?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)d=rep[c],typeof d=="string"&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var JSON=window.JSON,cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),function(a,b){"use strict";var c=a.History=a.History||{};if(typeof c.Adapter!="undefined")throw new Error("History.js Adapter has already been loaded...");c.Adapter={handlers:{},_uid:1,uid:function(a){return a._uid||(a._uid=c.Adapter._uid++)},bind:function(a,b,d){var e=c.Adapter.uid(a);c.Adapter.handlers[e]=c.Adapter.handlers[e]||{},c.Adapter.handlers[e][b]=c.Adapter.handlers[e][b]||[],c.Adapter.handlers[e][b].push(d),a["on"+b]=function(a,b){return function(d){c.Adapter.trigger(a,b,d)}}(a,b)},trigger:function(a,b,d){d=d||{};var e=c.Adapter.uid(a),f,g;c.Adapter.handlers[e]=c.Adapter.handlers[e]||{},c.Adapter.handlers[e][b]=c.Adapter.handlers[e][b]||[];for(f=0,g=c.Adapter.handlers[e][b].length;f<g;++f)c.Adapter.handlers[e][b][f].apply(this,[d])},extractEventData:function(a,c){var d=c&&c[a]||b;return d},onDomLoad:function(b){var c=a.setTimeout(function(){b()},2e3);a.onload=function(){clearTimeout(c),b()}}},typeof c.init!="undefined"&&c.init()}(window),function(a,b){"use strict";var c=a.document,d=a.setTimeout||d,e=a.clearTimeout||e,f=a.setInterval||f,g=a.History=a.History||{};if(typeof g.initHtml4!="undefined")throw new Error("History.js HTML4 Support has already been loaded...");g.initHtml4=function(){if(typeof g.initHtml4.initialized!="undefined")return!1;g.initHtml4.initialized=!0,g.enabled=!0,g.savedHashes=[],g.isLastHash=function(a){var b=g.getHashByIndex(),c;return c=a===b,c},g.saveHash=function(a){return g.isLastHash(a)?!1:(g.savedHashes.push(a),!0)},g.getHashByIndex=function(a){var b=null;return typeof a=="undefined"?b=g.savedHashes[g.savedHashes.length-1]:a<0?b=g.savedHashes[g.savedHashes.length+a]:b=g.savedHashes[a],b},g.discardedHashes={},g.discardedStates={},g.discardState=function(a,b,c){var d=g.getHashByState(a),e;return e={discardedState:a,backState:c,forwardState:b},g.discardedStates[d]=e,!0},g.discardHash=function(a,b,c){var d={discardedHash:a,backState:c,forwardState:b};return g.discardedHashes[a]=d,!0},g.discardedState=function(a){var b=g.getHashByState(a),c;return c=g.discardedStates[b]||!1,c},g.discardedHash=function(a){var b=g.discardedHashes[a]||!1;return b},g.recycleState=function(a){var b=g.getHashByState(a);return g.discardedState(a)&&delete g.discardedStates[b],!0},g.emulated.hashChange&&(g.hashChangeInit=function(){g.checkerFunction=null;var b="",d,e,h,i;return g.isInternetExplorer()?(d="historyjs-iframe",e=c.createElement("iframe"),e.setAttribute("id",d),e.style.display="none",c.body.appendChild(e),e.contentWindow.document.open(),e.contentWindow.document.close(),h="",i=!1,g.checkerFunction=function(){if(i)return!1;i=!0;var c=g.getHash()||"",d=g.unescapeHash(e.contentWindow.document.location.hash)||"";return c!==b?(b=c,d!==c&&(h=d=c,e.contentWindow.document.open(),e.contentWindow.document.close(),e.contentWindow.document.location.hash=g.escapeHash(c)),g.Adapter.trigger(a,"hashchange")):d!==h&&(h=d,g.setHash(d,!1)),i=!1,!0}):g.checkerFunction=function(){var c=g.getHash();return c!==b&&(b=c,g.Adapter.trigger(a,"hashchange")),!0},g.intervalList.push(f(g.checkerFunction,g.options.hashChangeInterval)),!0},g.Adapter.onDomLoad(g.hashChangeInit)),g.emulated.pushState&&(g.onHashChange=function(b){var d=b&&b.newURL||c.location.href,e=g.getHashByUrl(d),f=null,h=null,i=null,j;return g.isLastHash(e)?(g.busy(!1),!1):(g.doubleCheckComplete(),g.saveHash(e),e&&g.isTraditionalAnchor(e)?(g.Adapter.trigger(a,"anchorchange"),g.busy(!1),!1):(f=g.extractState(g.getFullUrl(e||c.location.href,!1),!0),g.isLastSavedState(f)?(g.busy(!1),!1):(h=g.getHashByState(f),j=g.discardedState(f),j?(g.getHashByIndex(-2)===g.getHashByState(j.forwardState)?g.back(!1):g.forward(!1),!1):(g.pushState(f.data,f.title,f.url,!1),!0))))},g.Adapter.bind(a,"hashchange",g.onHashChange),g.pushState=function(b,d,e,f){if(g.getHashByUrl(e))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(f!==!1&&g.busy())return g.pushQueue({scope:g,callback:g.pushState,args:arguments,queue:f}),!1;g.busy(!0);var h=g.createStateObject(b,d,e),i=g.getHashByState(h),j=g.getState(!1),k=g.getHashByState(j),l=g.getHash();return g.storeState(h),g.expectedStateId=h.id,g.recycleState(h),g.setTitle(h),i===k?(g.busy(!1),!1):i!==l&&i!==g.getShortUrl(c.location.href)?(g.setHash(i,!1),!1):(g.saveState(h),g.Adapter.trigger(a,"statechange"),g.busy(!1),!0)},g.replaceState=function(a,b,c,d){if(g.getHashByUrl(c))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(d!==!1&&g.busy())return g.pushQueue({scope:g,callback:g.replaceState,args:arguments,queue:d}),!1;g.busy(!0);var e=g.createStateObject(a,b,c),f=g.getState(!1),h=g.getStateByIndex(-2);return g.discardState(f,e,h),g.pushState(e.data,e.title,e.url,!1),!0}),g.emulated.pushState&&g.getHash()&&!g.emulated.hashChange&&g.Adapter.onDomLoad(function(){g.Adapter.trigger(a,"hashchange")})},typeof g.init!="undefined"&&g.init()}(window),function(a,b){"use strict";var c=a.console||b,d=a.document,e=a.navigator,f=a.sessionStorage||!1,g=a.setTimeout,h=a.clearTimeout,i=a.setInterval,j=a.clearInterval,k=a.JSON,l=a.alert,m=a.History=a.History||{},n=a.history;k.stringify=k.stringify||k.encode,k.parse=k.parse||k.decode;if(typeof m.init!="undefined")throw new Error("History.js Core has already been loaded...");m.init=function(){return typeof m.Adapter=="undefined"?!1:(typeof m.initCore!="undefined"&&m.initCore(),typeof m.initHtml4!="undefined"&&m.initHtml4(),!0)},m.initCore=function(){if(typeof m.initCore.initialized!="undefined")return!1;m.initCore.initialized=!0,m.options=m.options||{},m.options.hashChangeInterval=m.options.hashChangeInterval||100,m.options.safariPollInterval=m.options.safariPollInterval||500,m.options.doubleCheckInterval=m.options.doubleCheckInterval||500,m.options.storeInterval=m.options.storeInterval||1e3,m.options.busyDelay=m.options.busyDelay||250,m.options.debug=m.options.debug||!1,m.options.initialTitle=m.options.initialTitle||d.title,m.intervalList=[],m.clearAllIntervals=function(){var a,b=m.intervalList;if(typeof b!="undefined"&&b!==null){for(a=0;a<b.length;a++)j(b[a]);m.intervalList=null}},m.debug=function(){(m.options.debug||!1)&&m.log.apply(m,arguments)},m.log=function(){var a=typeof c!="undefined"&&typeof c.log!="undefined"&&typeof c.log.apply!="undefined",b=d.getElementById("log"),e,f,g,h,i;a?(h=Array.prototype.slice.call(arguments),e=h.shift(),typeof c.debug!="undefined"?c.debug.apply(c,[e,h]):c.log.apply(c,[e,h])):e="\n"+arguments[0]+"\n";for(f=1,g=arguments.length;f<g;++f){i=arguments[f];if(typeof i=="object"&&typeof k!="undefined")try{i=k.stringify(i)}catch(j){}e+="\n"+i+"\n"}return b?(b.value+=e+"\n-----\n",b.scrollTop=b.scrollHeight-b.clientHeight):a||l(e),!0},m.getInternetExplorerMajorVersion=function(){var a=m.getInternetExplorerMajorVersion.cached=typeof m.getInternetExplorerMajorVersion.cached!="undefined"?m.getInternetExplorerMajorVersion.cached:function(){var a=3,b=d.createElement("div"),c=b.getElementsByTagName("i");while((b.innerHTML="<!--[if gt IE "+ ++a+"]><i></i><![endif]-->")&&c[0]);return a>4?a:!1}();return a},m.isInternetExplorer=function(){var a=m.isInternetExplorer.cached=typeof m.isInternetExplorer.cached!="undefined"?m.isInternetExplorer.cached:Boolean(m.getInternetExplorerMajorVersion());return a},m.emulated={pushState:!Boolean(a.history&&a.history.pushState&&a.history.replaceState&&!/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(e.userAgent)&&!/AppleWebKit\/5([0-2]|3[0-2])/i.test(e.userAgent)),hashChange:Boolean(!("onhashchange"in a||"onhashchange"in d)||m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<8)},m.enabled=!m.emulated.pushState,m.bugs={setHash:Boolean(!m.emulated.pushState&&e.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)),safariPoll:Boolean(!m.emulated.pushState&&e.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)),ieDoubleCheck:Boolean(m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<8),hashEscape:Boolean(m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<7)},m.isEmptyObject=function(a){for(var b in a)return!1;return!0},m.cloneObject=function(a){var b,c;return a?(b=k.stringify(a),c=k.parse(b)):c={},c},m.getRootUrl=function(){var a=d.location.protocol+"//"+(d.location.hostname||d.location.host);if(d.location.port||!1)a+=":"+d.location.port;return a+="/",a},m.getBaseHref=function(){var a=d.getElementsByTagName("base"),b=null,c="";return a.length===1&&(b=a[0],c=b.href.replace(/[^\/]+$/,"")),c=c.replace(/\/+$/,""),c&&(c+="/"),c},m.getBaseUrl=function(){var a=m.getBaseHref()||m.getBasePageUrl()||m.getRootUrl();return a},m.getPageUrl=function(){var a=m.getState(!1,!1),b=(a||{}).url||d.location.href,c;return c=b.replace(/\/+$/,"").replace(/[^\/]+$/,function(a,b,c){return/\./.test(a)?a:a+"/"}),c},m.getBasePageUrl=function(){var a=d.location.href.replace(/[#\?].*/,"").replace(/[^\/]+$/,function(a,b,c){return/[^\/]$/.test(a)?"":a}).replace(/\/+$/,"")+"/";return a},m.getFullUrl=function(a,b){var c=a,d=a.substring(0,1);return b=typeof b=="undefined"?!0:b,/[a-z]+\:\/\//.test(a)||(d==="/"?c=m.getRootUrl()+a.replace(/^\/+/,""):d==="#"?c=m.getPageUrl().replace(/#.*/,"")+a:d==="?"?c=m.getPageUrl().replace(/[\?#].*/,"")+a:b?c=m.getBaseUrl()+a.replace(/^(\.\/)+/,""):c=m.getBasePageUrl()+a.replace(/^(\.\/)+/,"")),c.replace(/\#$/,"")},m.getShortUrl=function(a){var b=a,c=m.getBaseUrl(),d=m.getRootUrl();return m.emulated.pushState&&(b=b.replace(c,"")),b=b.replace(d,"/"),m.isTraditionalAnchor(b)&&(b="./"+b),b=b.replace(/^(\.\/)+/g,"./").replace(/\#$/,""),b},m.store={},m.idToState=m.idToState||{},m.stateToId=m.stateToId||{},m.urlToId=m.urlToId||{},m.storedStates=m.storedStates||[],m.savedStates=m.savedStates||[],m.normalizeStore=function(){m.store.idToState=m.store.idToState||{},m.store.urlToId=m.store.urlToId||{},m.store.stateToId=m.store.stateToId||{}},m.getState=function(a,b){typeof a=="undefined"&&(a=!0),typeof b=="undefined"&&(b=!0);var c=m.getLastSavedState();return!c&&b&&(c=m.createStateObject()),a&&(c=m.cloneObject(c),c.url=c.cleanUrl||c.url),c},m.getIdByState=function(a){var b=m.extractId(a.url),c;if(!b){c=m.getStateString(a);if(typeof m.stateToId[c]!="undefined")b=m.stateToId[c];else if(typeof m.store.stateToId[c]!="undefined")b=m.store.stateToId[c];else{for(;;){b=(new Date).getTime()+String(Math.random()).replace(/\D/g,"");if(typeof m.idToState[b]=="undefined"&&typeof m.store.idToState[b]=="undefined")break}m.stateToId[c]=b,m.idToState[b]=a}}return b},m.normalizeState=function(a){var b,c;if(!a||typeof a!="object")a={};if(typeof a.normalized!="undefined")return a;if(!a.data||typeof a.data!="object")a.data={};b={},b.normalized=!0,b.title=a.title||"",b.url=m.getFullUrl(m.unescapeString(a.url||d.location.href)),b.hash=m.getShortUrl(b.url),b.data=m.cloneObject(a.data),b.id=m.getIdByState(b),b.cleanUrl=b.url.replace(/\??\&_suid.*/,""),b.url=b.cleanUrl,c=!m.isEmptyObject(b.data);if(b.title||c)b.hash=m.getShortUrl(b.url).replace(/\??\&_suid.*/,""),/\?/.test(b.hash)||(b.hash+="?"),b.hash+="&_suid="+b.id;return b.hashedUrl=m.getFullUrl(b.hash),(m.emulated.pushState||m.bugs.safariPoll)&&m.hasUrlDuplicate(b)&&(b.url=b.hashedUrl),b},m.createStateObject=function(a,b,c){var d={data:a,title:b,url:c};return d=m.normalizeState(d),d},m.getStateById=function(a){a=String(a);var c=m.idToState[a]||m.store.idToState[a]||b;return c},m.getStateString=function(a){var b,c,d;return b=m.normalizeState(a),c={data:b.data,title:a.title,url:a.url},d=k.stringify(c),d},m.getStateId=function(a){var b,c;return b=m.normalizeState(a),c=b.id,c},m.getHashByState=function(a){var b,c;return b=m.normalizeState(a),c=b.hash,c},m.extractId=function(a){var b,c,d;return c=/(.*)\&_suid=([0-9]+)$/.exec(a),d=c?c[1]||a:a,b=c?String(c[2]||""):"",b||!1},m.isTraditionalAnchor=function(a){var b=!/[\/\?\.]/.test(a);return b},m.extractState=function(a,b){var c=null,d,e;return b=b||!1,d=m.extractId(a),d&&(c=m.getStateById(d)),c||(e=m.getFullUrl(a),d=m.getIdByUrl(e)||!1,d&&(c=m.getStateById(d)),!c&&b&&!m.isTraditionalAnchor(a)&&(c=m.createStateObject(null,null,e))),c},m.getIdByUrl=function(a){var c=m.urlToId[a]||m.store.urlToId[a]||b;return c},m.getLastSavedState=function(){return m.savedStates[m.savedStates.length-1]||b},m.getLastStoredState=function(){return m.storedStates[m.storedStates.length-1]||b},m.hasUrlDuplicate=function(a){var b=!1,c;return c=m.extractState(a.url),b=c&&c.id!==a.id,b},m.storeState=function(a){return m.urlToId[a.url]=a.id,m.storedStates.push(m.cloneObject(a)),a},m.isLastSavedState=function(a){var b=!1,c,d,e;return m.savedStates.length&&(c=a.id,d=m.getLastSavedState(),e=d.id,b=c===e),b},m.saveState=function(a){return m.isLastSavedState(a)?!1:(m.savedStates.push(m.cloneObject(a)),!0)},m.getStateByIndex=function(a){var b=null;return typeof a=="undefined"?b=m.savedStates[m.savedStates.length-1]:a<0?b=m.savedStates[m.savedStates.length+a]:b=m.savedStates[a],b},m.getHash=function(){var a=m.unescapeHash(d.location.hash);return a},m.unescapeString=function(b){var c=b,d;for(;;){d=a.unescape(c);if(d===c)break;c=d}return c},m.unescapeHash=function(a){var b=m.normalizeHash(a);return b=m.unescapeString(b),b},m.normalizeHash=function(a){var b=a.replace(/[^#]*#/,"").replace(/#.*/,"");return b},m.setHash=function(a,b){var c,e,f;return b!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.setHash,args:arguments,queue:b}),!1):(c=m.escapeHash(a),m.busy(!0),e=m.extractState(a,!0),e&&!m.emulated.pushState?m.pushState(e.data,e.title,e.url,!1):d.location.hash!==c&&(m.bugs.setHash?(f=m.getPageUrl(),m.pushState(null,null,f+"#"+c,!1)):d.location.hash=c),m)},m.escapeHash=function(b){var c=m.normalizeHash(b);return c=a.escape(c),m.bugs.hashEscape||(c=c.replace(/\%21/g,"!").replace(/\%26/g,"&").replace(/\%3D/g,"=").replace(/\%3F/g,"?")),c},m.getHashByUrl=function(a){var b=String(a).replace(/([^#]*)#?([^#]*)#?(.*)/,"$2");return b=m.unescapeHash(b),b},m.setTitle=function(a){var b=a.title,c;b||(c=m.getStateByIndex(0),c&&c.url===a.url&&(b=c.title||m.options.initialTitle));try{d.getElementsByTagName("title")[0].innerHTML=b.replace("<","&lt;").replace(">","&gt;").replace(" & "," &amp; ")}catch(e){}return d.title=b,m},m.queues=[],m.busy=function(a){typeof a!="undefined"?m.busy.flag=a:typeof m.busy.flag=="undefined"&&(m.busy.flag=!1);if(!m.busy.flag){h(m.busy.timeout);var b=function(){var a,c,d;if(m.busy.flag)return;for(a=m.queues.length-1;a>=0;--a){c=m.queues[a];if(c.length===0)continue;d=c.shift(),m.fireQueueItem(d),m.busy.timeout=g(b,m.options.busyDelay)}};m.busy.timeout=g(b,m.options.busyDelay)}return m.busy.flag},m.busy.flag=!1,m.fireQueueItem=function(a){return a.callback.apply(a.scope||m,a.args||[])},m.pushQueue=function(a){return m.queues[a.queue||0]=m.queues[a.queue||0]||[],m.queues[a.queue||0].push(a),m},m.queue=function(a,b){return typeof a=="function"&&(a={callback:a}),typeof b!="undefined"&&(a.queue=b),m.busy()?m.pushQueue(a):m.fireQueueItem(a),m},m.clearQueue=function(){return m.busy.flag=!1,m.queues=[],m},m.stateChanged=!1,m.doubleChecker=!1,m.doubleCheckComplete=function(){return m.stateChanged=!0,m.doubleCheckClear(),m},m.doubleCheckClear=function(){return m.doubleChecker&&(h(m.doubleChecker),m.doubleChecker=!1),m},m.doubleCheck=function(a){return m.stateChanged=!1,m.doubleCheckClear(),m.bugs.ieDoubleCheck&&(m.doubleChecker=g(function(){return m.doubleCheckClear(),m.stateChanged||a(),!0},m.options.doubleCheckInterval)),m},m.safariStatePoll=function(){var b=m.extractState(d.location.href),c;if(!m.isLastSavedState(b))c=b;else return;return c||(c=m.createStateObject()),m.Adapter.trigger(a,"popstate"),m},m.back=function(a){return a!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.back,args:arguments,queue:a}),!1):(m.busy(!0),m.doubleCheck(function(){m.back(!1)}),n.go(-1),!0)},m.forward=function(a){return a!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.forward,args:arguments,queue:a}),!1):(m.busy(!0),m.doubleCheck(function(){m.forward(!1)}),n.go(1),!0)},m.go=function(a,b){var c;if(a>0)for(c=1;c<=a;++c)m.forward(b);else{if(!(a<0))throw new Error("History.go: History.go requires a positive or negative integer passed.");for(c=-1;c>=a;--c)m.back(b)}return m};if(m.emulated.pushState){var o=function(){};m.pushState=m.pushState||o,m.replaceState=m.replaceState||o}else m.onPopState=function(b,c){var e=!1,f=!1,g,h;return m.doubleCheckComplete(),g=m.getHash(),g?(h=m.extractState(g||d.location.href,!0),h?m.replaceState(h.data,h.title,h.url,!1):(m.Adapter.trigger(a,"anchorchange"),m.busy(!1)),m.expectedStateId=!1,!1):(e=m.Adapter.extractEventData("state",b,c)||!1,e?f=m.getStateById(e):m.expectedStateId?f=m.getStateById(m.expectedStateId):f=m.extractState(d.location.href),f||(f=m.createStateObject(null,null,d.location.href)),m.expectedStateId=!1,m.isLastSavedState(f)?(m.busy(!1),!1):(m.storeState(f),m.saveState(f),m.setTitle(f),m.Adapter.trigger(a,"statechange"),m.busy(!1),!0))},m.Adapter.bind(a,"popstate",m.onPopState),m.pushState=function(b,c,d,e){if(m.getHashByUrl(d)&&m.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(e!==!1&&m.busy())return m.pushQueue({scope:m,callback:m.pushState,args:arguments,queue:e}),!1;m.busy(!0);var f=m.createStateObject(b,c,d);return m.isLastSavedState(f)?m.busy(!1):(m.storeState(f),m.expectedStateId=f.id,n.pushState(f.id,f.title,f.url),m.Adapter.trigger(a,"popstate")),!0},m.replaceState=function(b,c,d,e){if(m.getHashByUrl(d)&&m.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(e!==!1&&m.busy())return m.pushQueue({scope:m,callback:m.replaceState,args:arguments,queue:e}),!1;m.busy(!0);var f=m.createStateObject(b,c,d);return m.isLastSavedState(f)?m.busy(!1):(m.storeState(f),m.expectedStateId=f.id,n.replaceState(f.id,f.title,f.url),m.Adapter.trigger(a,"popstate")),!0};if(f){try{m.store=k.parse(f.getItem("History.store"))||{}}catch(p){m.store={}}m.normalizeStore()}else m.store={},m.normalizeStore();m.Adapter.bind(a,"beforeunload",m.clearAllIntervals),m.Adapter.bind(a,"unload",m.clearAllIntervals),m.saveState(m.storeState(m.extractState(d.location.href,!0))),f&&(m.onUnload=function(){var a,b;try{a=k.parse(f.getItem("History.store"))||{}}catch(c){a={}}a.idToState=a.idToState||{},a.urlToId=a.urlToId||{},a.stateToId=a.stateToId||{};for(b in m.idToState){if(!m.idToState.hasOwnProperty(b))continue;a.idToState[b]=m.idToState[b]}for(b in m.urlToId){if(!m.urlToId.hasOwnProperty(b))continue;a.urlToId[b]=m.urlToId[b]}for(b in m.stateToId){if(!m.stateToId.hasOwnProperty(b))continue;a.stateToId[b]=m.stateToId[b]}m.store=a,m.normalizeStore(),f.setItem("History.store",k.stringify(a))},m.intervalList.push(i(m.onUnload,m.options.storeInterval)),m.Adapter.bind(a,"beforeunload",m.onUnload),m.Adapter.bind(a,"unload",m.onUnload));if(!m.emulated.pushState){m.bugs.safariPoll&&m.intervalList.push(i(m.safariStatePoll,m.options.safariPollInterval));if(e.vendor==="Apple Computer, Inc."||(e.appCodeName||"")==="Mozilla")m.Adapter.bind(a,"hashchange",function(){m.Adapter.trigger(a,"popstate")}),m.getHash()&&m.Adapter.onDomLoad(function(){m.Adapter.trigger(a,"hashchange")})}},m.init()}(window)
}, {});
require.register('vendors/theoricus/www/vendors/inflection', function(require, module, exports){
/*
Copyright (c) 2010 Ryan Schuft (ryan.schuft@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
  This code is based in part on the work done in Ruby to support
  infection as part of Ruby on Rails in the ActiveSupport's Inflector
  and Inflections classes.  It was initally ported to Javascript by
  Ryan Schuft (ryan.schuft@gmail.com) in 2007.

  The code is available at http://code.google.com/p/inflection-js/

  The basic usage is:
    1. Include this script on your web page.
    2. Call functions on any String object in Javascript

  Currently implemented functions:

    String.pluralize(plural) == String
      renders a singular English language noun into its plural form
      normal results can be overridden by passing in an alternative

    String.singularize(singular) == String
      renders a plural English language noun into its singular form
      normal results can be overridden by passing in an alterative

    String.camelize(lowFirstLetter) == String
      renders a lower case underscored word into camel case
      the first letter of the result will be upper case unless you pass true
      also translates "/" into "::" (underscore does the opposite)

    String.underscore() == String
      renders a camel cased word into words seperated by underscores
      also translates "::" back into "/" (camelize does the opposite)

    String.humanize(lowFirstLetter) == String
      renders a lower case and underscored word into human readable form
      defaults to making the first letter capitalized unless you pass true

    String.capitalize() == String
      renders all characters to lower case and then makes the first upper

    String.dasherize() == String
      renders all underbars and spaces as dashes

    String.titleize() == String
      renders words into title casing (as for book titles)

    String.demodulize() == String
      renders class names that are prepended by modules into just the class

    String.tableize() == String
      renders camel cased singular words into their underscored plural form

    String.classify() == String
      renders an underscored plural word into its camel cased singular form

    String.foreign_key(dropIdUbar) == String
      renders a class name (camel cased singular noun) into a foreign key
      defaults to seperating the class from the id with an underbar unless
      you pass true

    String.ordinalize() == String
      renders all numbers found in the string into their sequence like "22nd"
*/

/*
  This sets up a container for some constants in its own namespace
  We use the window (if available) to enable dynamic loading of this script
  Window won't necessarily exist for non-browsers.
*/
if (window && !window.InflectionJS)
{
    window.InflectionJS = null;
}

/*
  This sets up some constants for later use
  This should use the window namespace variable if available
*/
InflectionJS =
{
    /*
      This is a list of nouns that use the same form for both singular and plural.
      This list should remain entirely in lower case to correctly match Strings.
    */
    uncountable_words: [
        'equipment', 'information', 'rice', 'money', 'species', 'series',
        'fish', 'sheep', 'moose', 'deer', 'news'
    ],

    /*
      These rules translate from the singular form of a noun to its plural form.
    */
    plural_rules: [
        [new RegExp('(m)an$', 'gi'),                 '$1en'],
        [new RegExp('(pe)rson$', 'gi'),              '$1ople'],
        [new RegExp('(child)$', 'gi'),               '$1ren'],
        [new RegExp('^(ox)$', 'gi'),                 '$1en'],
        [new RegExp('(ax|test)is$', 'gi'),           '$1es'],
        [new RegExp('(octop|vir)us$', 'gi'),         '$1i'],
        [new RegExp('(alias|status)$', 'gi'),        '$1es'],
        [new RegExp('(bu)s$', 'gi'),                 '$1ses'],
        [new RegExp('(buffal|tomat|potat)o$', 'gi'), '$1oes'],
        [new RegExp('([ti])um$', 'gi'),              '$1a'],
        [new RegExp('sis$', 'gi'),                   'ses'],
        [new RegExp('(?:([^f])fe|([lr])f)$', 'gi'),  '$1$2ves'],
        [new RegExp('(hive)$', 'gi'),                '$1s'],
        [new RegExp('([^aeiouy]|qu)y$', 'gi'),       '$1ies'],
        [new RegExp('(x|ch|ss|sh)$', 'gi'),          '$1es'],
        [new RegExp('(matr|vert|ind)ix|ex$', 'gi'),  '$1ices'],
        [new RegExp('([m|l])ouse$', 'gi'),           '$1ice'],
        [new RegExp('(quiz)$', 'gi'),                '$1zes'],
        [new RegExp('s$', 'gi'),                     's'],
        [new RegExp('$', 'gi'),                      's']
    ],

    /*
      These rules translate from the plural form of a noun to its singular form.
    */
    singular_rules: [
        [new RegExp('(m)en$', 'gi'),                                                       '$1an'],
        [new RegExp('(pe)ople$', 'gi'),                                                    '$1rson'],
        [new RegExp('(child)ren$', 'gi'),                                                  '$1'],
        [new RegExp('([ti])a$', 'gi'),                                                     '$1um'],
        [new RegExp('((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$','gi'), '$1$2sis'],
        [new RegExp('(hive)s$', 'gi'),                                                     '$1'],
        [new RegExp('(tive)s$', 'gi'),                                                     '$1'],
        [new RegExp('(curve)s$', 'gi'),                                                    '$1'],
        [new RegExp('([lr])ves$', 'gi'),                                                   '$1f'],
        [new RegExp('([^fo])ves$', 'gi'),                                                  '$1fe'],
        [new RegExp('([^aeiouy]|qu)ies$', 'gi'),                                           '$1y'],
        [new RegExp('(s)eries$', 'gi'),                                                    '$1eries'],
        [new RegExp('(m)ovies$', 'gi'),                                                    '$1ovie'],
        [new RegExp('(x|ch|ss|sh)es$', 'gi'),                                              '$1'],
        [new RegExp('([m|l])ice$', 'gi'),                                                  '$1ouse'],
        [new RegExp('(bus)es$', 'gi'),                                                     '$1'],
        [new RegExp('(o)es$', 'gi'),                                                       '$1'],
        [new RegExp('(shoe)s$', 'gi'),                                                     '$1'],
        [new RegExp('(cris|ax|test)es$', 'gi'),                                            '$1is'],
        [new RegExp('(octop|vir)i$', 'gi'),                                                '$1us'],
        [new RegExp('(alias|status)es$', 'gi'),                                            '$1'],
        [new RegExp('^(ox)en', 'gi'),                                                      '$1'],
        [new RegExp('(vert|ind)ices$', 'gi'),                                              '$1ex'],
        [new RegExp('(matr)ices$', 'gi'),                                                  '$1ix'],
        [new RegExp('(quiz)zes$', 'gi'),                                                   '$1'],
        [new RegExp('s$', 'gi'),                                                           '']
    ],

    /*
      This is a list of words that should not be capitalized for title case
    */
    non_titlecased_words: [
        'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at',
        'by', 'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over',
        'with', 'for'
    ],

    /*
      These are regular expressions used for converting between String formats
    */
    id_suffix: new RegExp('(_ids|_id)$', 'g'),
    underbar: new RegExp('_', 'g'),
    space_or_underbar: new RegExp('[\ _]', 'g'),
    uppercase: new RegExp('([A-Z])', 'g'),
    underbar_prefix: new RegExp('^_'),
    
    /*
      This is a helper method that applies rules based replacement to a String
      Signature:
        InflectionJS.apply_rules(str, rules, skip, override) == String
      Arguments:
        str - String - String to modify and return based on the passed rules
        rules - Array: [RegExp, String] - Regexp to match paired with String to use for replacement
        skip - Array: [String] - Strings to skip if they match
        override - String (optional) - String to return as though this method succeeded (used to conform to APIs)
      Returns:
        String - passed String modified by passed rules
      Examples:
        InflectionJS.apply_rules("cows", InflectionJs.singular_rules) === 'cow'
    */
    apply_rules: function(str, rules, skip, override)
    {
        if (override)
        {
            str = override;
        }
        else
        {
            var ignore = (skip.indexOf(str.toLowerCase()) > -1);
            if (!ignore)
            {
                for (var x = 0; x < rules.length; x++)
                {
                    if (str.match(rules[x][0]))
                    {
                        str = str.replace(rules[x][0], rules[x][1]);
                        break;
                    }
                }
            }
        }
        return str;
    }
};

/*
  This lets us detect if an Array contains a given element
  Signature:
    Array.indexOf(item, fromIndex, compareFunc) == Integer
  Arguments:
    item - Object - object to locate in the Array
    fromIndex - Integer (optional) - starts checking from this position in the Array
    compareFunc - Function (optional) - function used to compare Array item vs passed item
  Returns:
    Integer - index position in the Array of the passed item
  Examples:
    ['hi','there'].indexOf("guys") === -1
    ['hi','there'].indexOf("hi") === 0
*/
if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function(item, fromIndex, compareFunc)
    {
        if (!fromIndex)
        {
            fromIndex = -1;
        }
        var index = -1;
        for (var i = fromIndex; i < this.length; i++)
        {
            if (this[i] === item || compareFunc && compareFunc(this[i], item))
            {
                index = i;
                break;
            }
        }
        return index;
    };
}

/*
  You can override this list for all Strings or just one depending on if you
  set the new values on prototype or on a given String instance.
*/
if (!String.prototype._uncountable_words)
{
    String.prototype._uncountable_words = InflectionJS.uncountable_words;
}

/*
  You can override this list for all Strings or just one depending on if you
  set the new values on prototype or on a given String instance.
*/
if (!String.prototype._plural_rules)
{
    String.prototype._plural_rules = InflectionJS.plural_rules;
}

/*
  You can override this list for all Strings or just one depending on if you
  set the new values on prototype or on a given String instance.
*/
if (!String.prototype._singular_rules)
{
    String.prototype._singular_rules = InflectionJS.singular_rules;
}

/*
  You can override this list for all Strings or just one depending on if you
  set the new values on prototype or on a given String instance.
*/
if (!String.prototype._non_titlecased_words)
{
    String.prototype._non_titlecased_words = InflectionJS.non_titlecased_words;
}

/*
  This function adds plurilization support to every String object
    Signature:
      String.pluralize(plural) == String
    Arguments:
      plural - String (optional) - overrides normal output with said String
    Returns:
      String - singular English language nouns are returned in plural form
    Examples:
      "person".pluralize() == "people"
      "octopus".pluralize() == "octopi"
      "Hat".pluralize() == "Hats"
      "person".pluralize("guys") == "guys"
*/
if (!String.prototype.pluralize)
{
    String.prototype.pluralize = function(plural)
    {
        return InflectionJS.apply_rules(
            this,
            this._plural_rules,
            this._uncountable_words,
            plural
        );
    };
}

/*
  This function adds singularization support to every String object
    Signature:
      String.singularize(singular) == String
    Arguments:
      singular - String (optional) - overrides normal output with said String
    Returns:
      String - plural English language nouns are returned in singular form
    Examples:
      "people".singularize() == "person"
      "octopi".singularize() == "octopus"
      "Hats".singularize() == "Hat"
      "guys".singularize("person") == "person"
*/
if (!String.prototype.singularize)
{
    String.prototype.singularize = function(singular)
    {
        return InflectionJS.apply_rules(
            this,
            this._singular_rules,
            this._uncountable_words,
            singular
        );
    };
}

/*
  This function adds camelization support to every String object
    Signature:
      String.camelize(lowFirstLetter) == String
    Arguments:
      lowFirstLetter - boolean (optional) - default is to capitalize the first
        letter of the results... passing true will lowercase it
    Returns:
      String - lower case underscored words will be returned in camel case
        additionally '/' is translated to '::'
    Examples:
      "message_properties".camelize() == "MessageProperties"
      "message_properties".camelize(true) == "messageProperties"
*/
if (!String.prototype.camelize)
{
     String.prototype.camelize = function(lowFirstLetter)
     {
        var str = this.toLowerCase();
        var str_path = str.split('/');
        for (var i = 0; i < str_path.length; i++)
        {
            var str_arr = str_path[i].split('_');
            var initX = ((lowFirstLetter && i + 1 === str_path.length) ? (1) : (0));
            for (var x = initX; x < str_arr.length; x++)
            {
                str_arr[x] = str_arr[x].charAt(0).toUpperCase() + str_arr[x].substring(1);
            }
            str_path[i] = str_arr.join('');
        }
        str = str_path.join('::');
        return str;
    };
}

/*
  This function adds underscore support to every String object
    Signature:
      String.underscore() == String
    Arguments:
      N/A
    Returns:
      String - camel cased words are returned as lower cased and underscored
        additionally '::' is translated to '/'
    Examples:
      "MessageProperties".camelize() == "message_properties"
      "messageProperties".underscore() == "message_properties"
*/
if (!String.prototype.underscore)
{
     String.prototype.underscore = function()
     {
        var str = this;
        var str_path = str.split('::');
        for (var i = 0; i < str_path.length; i++)
        {
            str_path[i] = str_path[i].replace(InflectionJS.uppercase, '_$1');
            str_path[i] = str_path[i].replace(InflectionJS.underbar_prefix, '');
        }
        str = str_path.join('/').toLowerCase();
        return str;
    };
}

/*
  This function adds humanize support to every String object
    Signature:
      String.humanize(lowFirstLetter) == String
    Arguments:
      lowFirstLetter - boolean (optional) - default is to capitalize the first
        letter of the results... passing true will lowercase it
    Returns:
      String - lower case underscored words will be returned in humanized form
    Examples:
      "message_properties".humanize() == "Message properties"
      "message_properties".humanize(true) == "message properties"
*/
if (!String.prototype.humanize)
{
    String.prototype.humanize = function(lowFirstLetter)
    {
        var str = this.toLowerCase();
        str = str.replace(InflectionJS.id_suffix, '');
        str = str.replace(InflectionJS.underbar, ' ');
        if (!lowFirstLetter)
        {
            str = str.capitalize();
        }
        return str;
    };
}

/*
  This function adds capitalization support to every String object
    Signature:
      String.capitalize() == String
    Arguments:
      N/A
    Returns:
      String - all characters will be lower case and the first will be upper
    Examples:
      "message_properties".capitalize() == "Message_properties"
      "message properties".capitalize() == "Message properties"
*/
if (!String.prototype.capitalize)
{
    String.prototype.capitalize = function()
    {
        var str = this.toLowerCase();
        str = str.substring(0, 1).toUpperCase() + str.substring(1);
        return str;
    };
}

/*
  This function adds dasherization support to every String object
    Signature:
      String.dasherize() == String
    Arguments:
      N/A
    Returns:
      String - replaces all spaces or underbars with dashes
    Examples:
      "message_properties".capitalize() == "message-properties"
      "Message Properties".capitalize() == "Message-Properties"
*/
if (!String.prototype.dasherize)
{
    String.prototype.dasherize = function()
    {
        var str = this;
        str = str.replace(InflectionJS.space_or_underbar, '-');
        return str;
    };
}

/*
  This function adds titleize support to every String object
    Signature:
      String.titleize() == String
    Arguments:
      N/A
    Returns:
      String - capitalizes words as you would for a book title
    Examples:
      "message_properties".titleize() == "Message Properties"
      "message properties to keep".titleize() == "Message Properties to Keep"
*/
if (!String.prototype.titleize)
{
    String.prototype.titleize = function()
    {
        var str = this.toLowerCase();
        str = str.replace(InflectionJS.underbar, ' ');
        var str_arr = str.split(' ');
        for (var x = 0; x < str_arr.length; x++)
        {
            var d = str_arr[x].split('-');
            for (var i = 0; i < d.length; i++)
            {
                if (this._non_titlecased_words.indexOf(d[i].toLowerCase()) < 0)
                {
                    d[i] = d[i].capitalize();
                }
            }
            str_arr[x] = d.join('-');
        }
        str = str_arr.join(' ');
        str = str.substring(0, 1).toUpperCase() + str.substring(1);
        return str;
    };
}

/*
  This function adds demodulize support to every String object
    Signature:
      String.demodulize() == String
    Arguments:
      N/A
    Returns:
      String - removes module names leaving only class names (Ruby style)
    Examples:
      "Message::Bus::Properties".demodulize() == "Properties"
*/
if (!String.prototype.demodulize)
{
    String.prototype.demodulize = function()
    {
        var str = this;
        var str_arr = str.split('::');
        str = str_arr[str_arr.length - 1];
        return str;
    };
}

/*
  This function adds tableize support to every String object
    Signature:
      String.tableize() == String
    Arguments:
      N/A
    Returns:
      String - renders camel cased words into their underscored plural form
    Examples:
      "MessageBusProperty".tableize() == "message_bus_properties"
*/
if (!String.prototype.tableize)
{
    String.prototype.tableize = function()
    {
        var str = this;
        str = str.underscore().pluralize();
        return str;
    };
}

/*
  This function adds classification support to every String object
    Signature:
      String.classify() == String
    Arguments:
      N/A
    Returns:
      String - underscored plural nouns become the camel cased singular form
    Examples:
      "message_bus_properties".classify() == "MessageBusProperty"
*/
if (!String.prototype.classify)
{
    String.prototype.classify = function()
    {
        var str = this;
        str = str.camelize().singularize();
        return str;
    };
}

/*
  This function adds foreign key support to every String object
    Signature:
      String.foreign_key(dropIdUbar) == String
    Arguments:
      dropIdUbar - boolean (optional) - default is to seperate id with an
        underbar at the end of the class name, you can pass true to skip it
    Returns:
      String - camel cased singular class names become underscored with id
    Examples:
      "MessageBusProperty".foreign_key() == "message_bus_property_id"
      "MessageBusProperty".foreign_key(true) == "message_bus_propertyid"
*/
if (!String.prototype.foreign_key)
{
    String.prototype.foreign_key = function(dropIdUbar)
    {
        var str = this;
        str = str.demodulize().underscore() + ((dropIdUbar) ? ('') : ('_')) + 'id';
        return str;
    };
}

/*
  This function adds ordinalize support to every String object
    Signature:
      String.ordinalize() == String
    Arguments:
      N/A
    Returns:
      String - renders all found numbers their sequence like "22nd"
    Examples:
      "the 1 pitch".ordinalize() == "the 1st pitch"
*/
if (!String.prototype.ordinalize)
{
    String.prototype.ordinalize = function()
    {
        var str = this;
        var str_arr = str.split(' ');
        for (var x = 0; x < str_arr.length; x++)
        {
            var i = parseInt(str_arr[x]);
            if (i === NaN)
            {
                var ltd = str_arr[x].substring(str_arr[x].length - 2);
                var ld = str_arr[x].substring(str_arr[x].length - 1);
                var suf = "th";
                if (ltd != "11" && ltd != "12" && ltd != "13")
                {
                    if (ld === "1")
                    {
                        suf = "st";
                    }
                    else if (ld === "2")
                    {
                        suf = "nd";
                    }
                    else if (ld === "3")
                    {
                        suf = "rd";
                    }
                }
                str_arr[x] += suf;
            }
        }
        str = str_arr.join(' ');
        return str;
    };
}
}, {});
require.register('vendors/theoricus/www/vendors/jquery', function(require, module, exports){
/*!
 * jQuery JavaScript Library v1.7.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Mar 21 12:46:34 2012 -0700
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			fired = true;
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		pixelMargin: true
	};

	// jQuery.boxModel DEPRECATED in 1.3, use jQuery.support.boxModel instead
	jQuery.boxModel = support.boxModel = (document.compatMode === "CSS1Compat");

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			marginDiv, conMarginTop, style, html, positionTopLeftWidthHeight,
			paddingMarginBorderVisibility, paddingMarginBorder,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		paddingMarginBorder = "padding:0;margin:0;border:";
		positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;";
		paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;";
		style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;";
		html = "<div " + style + "display:block;'><div style='" + paddingMarginBorder + "0;display:block;overflow:hidden;'></div></div>" +
			"<table " + style + "' cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='" + paddingMarginBorder + "0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check if div with explicit width and no margin-right incorrectly
		// gets computed margin-right based on width of container. For more
		// info see bug #3333
		// Fails in WebKit before Feb 2011 nightlies
		// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
		if ( window.getComputedStyle ) {
			div.innerHTML = "";
			marginDiv = document.createElement( "div" );
			marginDiv.style.width = "0";
			marginDiv.style.marginRight = "0";
			div.style.width = "2px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.width = div.style.padding = "1px";
			div.style.border = 0;
			div.style.overflow = "hidden";
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div style='width:5px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
		}

		div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		if ( window.getComputedStyle ) {
			div.style.marginTop = "1%";
			support.pixelMargin = ( window.getComputedStyle( div, null ) || { marginTop: 0 } ).marginTop !== "1%";
		}

		if ( typeof container.style.zoom !== "undefined" ) {
			container.style.zoom = 1;
		}

		body.removeChild( container );
		marginDiv = div = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise( object );
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /(?:^|\s)hover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: selector && quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process events on disabled elements (#6911, #8165)
				if ( cur.disabled !== true ) {
					selMatch = {};
					matches = [];
					jqcur[0] = cur;
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = (
								handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
							);
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},
		
		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

					/* falls through */
				case "last":
					while ( (node = node.nextSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					doneName = match[0];
					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}
// Expose origPOS
// "global" as in regardless of relation to brackets/parens
Expr.match.globalPOS = origPOS;

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.globalPOS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					null;
			}


			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						jQuery.ajax({
							type: "GET",
							global: false,
							url: elem.src,
							async: false,
							dataType: "script"
						});
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );

	// Clear flags for bubbling special change/submit events, they must
	// be reattached when the newly cloned events are first activated
	dest.removeAttribute( "_submit_attached" );
	dest.removeAttribute( "_change_attached" );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType, script, j,
				ret = [];

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div"),
						safeChildNodes = safeFragment.childNodes,
						remove;

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Clear elements from DocumentFragment (safeFragment or otherwise)
					// to avoid hoarding elements. Fixes #11356
					if ( div ) {
						div.parentNode.removeChild( div );

						// Guard against -1 index exceptions in FF3.6
						if ( safeChildNodes.length > 0 ) {
							remove = safeChildNodes[ safeChildNodes.length - 1 ];

							if ( remove && remove.parentNode ) {
								remove.parentNode.removeChild( remove );
							}
						}
					}
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				script = ret[i];
				if ( scripts && jQuery.nodeName( script, "script" ) && (!script.type || rscriptType.test( script.type )) ) {
					scripts.push( script.parentNode ? script.parentNode.removeChild( script ) : script );

				} else {
					if ( script.nodeType === 1 ) {
						var jsTags = jQuery.grep( script.getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( script );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnum = /^[\-+]?(?:\d*\.)?\d+$/i,
	rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
	rrelNum = /^([\-+])=([\-+.\de]+)/,
	rmargin = /^margin/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },

	// order is important!
	cssExpand = [ "Top", "Right", "Bottom", "Left" ],

	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	return jQuery.access( this, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	}, name, value, arguments.length > 1 );
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {},
			ret, name;

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// DEPRECATED in 1.3, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle, width,
			style = elem.style;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {

			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// WebKit uses "computed value (percentage if specified)" instead of "used value" for margins
		// which is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !jQuery.support.pixelMargin && computedStyle && rmargin.test( name ) && rnumnonpx.test( ret ) ) {
			width = style.width;
			style.width = ret;
			ret = computedStyle.width;
			style.width = width;
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( rnumnonpx.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		i = name === "width" ? 1 : 0,
		len = 4;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i += 2 ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ];
	}

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test(val) ) {
		return val;
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i += 2 ) {
			val += parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ]) ) || 0;
			}
		}
	}

	return val + "px";
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWidthOrHeight( elem, name, extra );
				} else {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				}
			}
		},

		set: function( elem, value ) {
			return rnum.test( value ) ?
				value + "px" :
				value;
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "margin-right" );
					} else {
						return elem.style.marginRight;
					}
				});
			}
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {

	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};
});




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = ( typeof s.data === "string" ) && /^application\/x\-www\-form\-urlencoded/.test( s.contentType );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( _ ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( (display === "" && jQuery.css(elem, "display") === "none") ||
						!jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e, hooks, replace,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			// first pass over propertys to expand / normalize
			for ( p in prop ) {
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				if ( ( hooks = jQuery.cssHooks[ name ] ) && "expand" in hooks ) {
					replace = hooks.expand( prop[ name ] );
					delete prop[ name ];

					// not quite $.extend, this wont overwrite keys already present.
					// also - reusing 'p' from above because we have the correct "name"
					for ( p in replace ) {
						if ( ! ( p in prop ) ) {
							prop[ p ] = replace[ p ];
						}
					}
				}
			}

			for ( name in prop ) {
				val = prop[ name ];
				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				if ( self.options.hide ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.start );
				} else if ( self.options.show ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.end );
				}
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Ensure props that can't be negative don't go there on undershoot easing
jQuery.each( fxAttrs.concat.apply( [], fxAttrs ), function( i, prop ) {
	// exclude marginTop, marginLeft, marginBottom and marginRight from this list
	if ( prop.indexOf( "margin" ) ) {
		jQuery.fx.step[ prop ] = function( fx ) {
			jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( jQuery.support.boxModel ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var getOffset,
	rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	getOffset = function( elem, doc, docElem, box ) {
		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow( doc ),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	getOffset = function( elem, doc, docElem ) {
		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var elem = this[0],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return null;
	}

	if ( elem === doc.body ) {
		return jQuery.offset.bodyOffset( elem );
	}

	return getOffset( elem, doc, doc.documentElement );
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					jQuery.support.boxModel && win.document.documentElement[ method ] ||
						win.document.body[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	var clientProp = "client" + name,
		scrollProp = "scroll" + name,
		offsetProp = "offset" + name;

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( value ) {
		return jQuery.access( this, function( elem, type, value ) {
			var doc, docElemProp, orig, ret;

			if ( jQuery.isWindow( elem ) ) {
				// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
				doc = elem.document;
				docElemProp = doc.documentElement[ clientProp ];
				return jQuery.support.boxModel && docElemProp ||
					doc.body && doc.body[ clientProp ] || docElemProp;
			}

			// Get document width or height
			if ( elem.nodeType === 9 ) {
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				doc = elem.documentElement;

				// when a window > document, IE6 reports a offset[Width/Height] > client[Width/Height]
				// so we can't use max, as it'll choose the incorrect offset[Width/Height]
				// instead we use the correct client[Width/Height]
				// support:IE6
				if ( doc[ clientProp ] >= doc[ scrollProp ] ) {
					return doc[ clientProp ];
				}

				return Math.max(
					elem.body[ scrollProp ], doc[ scrollProp ],
					elem.body[ offsetProp ], doc[ offsetProp ]
				);
			}

			// Get width or height on the element
			if ( value === undefined ) {
				orig = jQuery.css( elem, type );
				ret = parseFloat( orig );
				return jQuery.isNumeric( ret ) ? ret : orig;
			}

			// Set the width or height on the element
			jQuery( elem ).css( type, value );
		}, type, value, arguments.length, null );
	};
});


// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );

}, {});
require.register('vendors/theoricus/www/vendors/json2', function(require, module, exports){
/*
  JSON 2
  https://raw.github.com/douglascrockford/JSON-js/40f3377a631eaedeec877379f9cb338046cac0e0/json2.js
*/

/*
    json2.js
    2011-10-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
}, {});
require.register('vendors/utils/requestAnim', function(require, module, exports){
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
}, {});
// POLVO :: INITIALIZER
require('src/app/app');
/*
//@ sourceMappingURL=data:application/json;charset=utf-8;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJhcHAuanMiLAogICJzZWN0aW9ucyI6IFsKICAgIHsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjI2NSwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvYXBwLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJUaGVvcmljdXMgPSByZXF1aXJlICd0aGVvcmljdXMvdGhlb3JpY3VzJ1xuXG5TZXR0aW5ncyA9IHJlcXVpcmUgJ2FwcC9jb25maWcvc2V0dGluZ3MnXG5Sb3V0ZXMgPSByZXF1aXJlICdhcHAvY29uZmlnL3JvdXRlcydcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBBcHAgZXh0ZW5kcyBUaGVvcmljdXNcblxuICBjb25zdHJ1Y3RvcjooIFNldHRpbmdzLCBSb3V0ZXMgKS0+XG4gICAgIyBkb24ndCBmb3JnZXQgdG8gZXh0ZW5kIFRoZW9yaWN1cyBhbmQgcGFzcyBTZXR0aW5ncyBhbmQgUm91dGVzICFcbiAgICBzdXBlciBTZXR0aW5ncywgUm91dGVzXG4gICAgQHN0YXJ0KClcblxuIyBpbml0aWFsaXplIHlvdXIgYXBwXG5uZXcgQXBwIFNldHRpbmdzLCBSb3V0ZXMiXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSw0QkFBQTtHQUFBO2tTQUFBOztBQUFBLENBQUEsRUFBWSxJQUFBLEVBQVosWUFBWTs7QUFFWixDQUZBLEVBRVcsSUFBQSxDQUFYLGFBQVc7O0FBQ1gsQ0FIQSxFQUdTLEdBQVQsQ0FBUyxZQUFBOztBQUVULENBTEEsRUFLdUIsR0FBakIsQ0FBTjtDQUVFOztDQUFZLENBQUEsQ0FBQSxHQUFBLEVBQUEsS0FBRTtDQUVaLENBQWdCLEVBQWhCLEVBQUEsRUFBQSw2QkFBTTtDQUFOLEdBQ0EsQ0FBQTtDQUhGLEVBQVk7O0NBQVo7O0NBRmlDOztBQVEvQixDQWJKLENBYWtCLENBQWQsQ0FBQSxFQUFBLEVBQUEiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjoyOTEsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL2NvbmZpZy9yb3V0ZXMuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUm91dGVzXG5cbiAgIyBhbGwgcm91dGVzXG4gIEByb3V0ZXMgPVxuXG4gICAgIyBtYWluIHJvdXRlXG4gICAgJy9wYWdlcyc6XG4gICAgICB0bzogXCJwYWdlcy9pbmRleFwiXG4gICAgICBhdDogbnVsbFxuICAgICAgZWw6IFwiYm9keVwiXG5cbiAgICAnL3N0cmluZ3MnOlxuICAgICAgbGFiOnRydWVcbiAgICAgIHRvOiBcInN0cmluZ3MvaW5kZXhcIlxuICAgICAgYXQ6IFwiL3BhZ2VzXCJcbiAgICAgIGVsOiBcIiNjb250YWluZXJcIlxuXG4gICAgJy9ob2xlJzpcbiAgICAgIGxhYjp0cnVlXG4gICAgICB0bzogXCJob2xlL2luZGV4XCJcbiAgICAgIGF0OiBcIi9wYWdlc1wiXG4gICAgICBlbDogXCIjY29udGFpbmVyXCJcblxuICAgICcvbWFnbmV0cyc6XG4gICAgICBsYWI6dHJ1ZVxuICAgICAgdG86IFwibWFnbmV0cy9pbmRleFwiXG4gICAgICBhdDogXCIvcGFnZXNcIlxuICAgICAgZWw6IFwiI2NvbnRhaW5lclwiXG5cbiAgICAnL2F0dHJhY3QnOlxuICAgICAgbGFiOnRydWVcbiAgICAgIHRvOiBcImF0dHJhY3QvaW5kZXhcIlxuICAgICAgYXQ6IFwiL3BhZ2VzXCJcbiAgICAgIGVsOiBcIiNjb250YWluZXJcIlxuXG4gICAgJy9yZXB1bHNlJzpcbiAgICAgIGxhYjp0cnVlXG4gICAgICB0bzogXCJyZXB1bHNlL2luZGV4XCJcbiAgICAgIGF0OiBcIi9wYWdlc1wiXG4gICAgICBlbDogXCIjY29udGFpbmVyXCJcblxuICAgICcvNDA0JzpcbiAgICAgIHRvOiBcInBhZ2VzL25vdGZvdW5kXCJcbiAgICAgIGF0OiBcIi9wYWdlc1wiXG4gICAgICBlbDogXCIjY29udGFpbmVyXCJcblxuICAjIGRlZmF1bHQgcm91dGVcbiAgQHJvb3QgPSAnL3BhZ2VzJ1xuXG4gICMgbm90IGZvdW5kIHJvdXRlXG4gIEBub3Rmb3VuZCA9ICcvNDA0JyJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLEVBQUE7O0FBQUEsQ0FBQSxFQUF1QixHQUFqQixDQUFOO0NBR0U7O0NBQUEsQ0FBQSxDQUdFLEdBSEQ7Q0FHQyxDQUNFLEVBREYsSUFBQTtDQUNFLENBQUEsSUFBQSxPQUFBO0NBQUEsQ0FDQSxFQURBLEVBQ0E7Q0FEQSxDQUVBLElBQUE7TUFIRjtDQUFBLENBTUUsRUFERixNQUFBO0NBQ0UsQ0FBSSxDQUFKLENBQUEsRUFBQTtDQUFBLENBQ0EsSUFBQSxTQURBO0NBQUEsQ0FFQSxJQUFBLEVBRkE7Q0FBQSxDQUdBLElBQUEsTUFIQTtNQU5GO0NBQUEsQ0FZRSxFQURGLEdBQUE7Q0FDRSxDQUFJLENBQUosQ0FBQSxFQUFBO0NBQUEsQ0FDQSxJQUFBLE1BREE7Q0FBQSxDQUVBLElBQUEsRUFGQTtDQUFBLENBR0EsSUFBQSxNQUhBO01BWkY7Q0FBQSxDQWtCRSxFQURGLE1BQUE7Q0FDRSxDQUFJLENBQUosQ0FBQSxFQUFBO0NBQUEsQ0FDQSxJQUFBLFNBREE7Q0FBQSxDQUVBLElBQUEsRUFGQTtDQUFBLENBR0EsSUFBQSxNQUhBO01BbEJGO0NBQUEsQ0F3QkUsRUFERixNQUFBO0NBQ0UsQ0FBSSxDQUFKLENBQUEsRUFBQTtDQUFBLENBQ0EsSUFBQSxTQURBO0NBQUEsQ0FFQSxJQUFBLEVBRkE7Q0FBQSxDQUdBLElBQUEsTUFIQTtNQXhCRjtDQUFBLENBOEJFLEVBREYsTUFBQTtDQUNFLENBQUksQ0FBSixDQUFBLEVBQUE7Q0FBQSxDQUNBLElBQUEsU0FEQTtDQUFBLENBRUEsSUFBQSxFQUZBO0NBQUEsQ0FHQSxJQUFBLE1BSEE7TUE5QkY7Q0FBQSxDQW9DRSxFQURGLEVBQUE7Q0FDRSxDQUFBLElBQUEsVUFBQTtDQUFBLENBQ0EsSUFBQSxFQURBO0NBQUEsQ0FFQSxJQUFBLE1BRkE7TUFwQ0Y7Q0FIRixHQUFBOztDQUFBLENBNENBLENBQVEsQ0FBUixFQUFDLEVBNUNEOztDQUFBLENBK0NBLENBQVksR0FBWCxFQUFEOztDQS9DQTs7Q0FIRiIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjM0OSwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvY29uZmlnL3NldHRpbmdzLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFNldHRpbmdzXG5cbiAgIyBBbmltYXRlcyBhbGwgbGV2ZWxzIG9uIHN0YXJ0IHVwIG9yIGp1c3QgcmVuZGVycyBldmVyeXRoaW5nXG4gIEBhbmltYXRlX2F0X3N0YXJ0dXA6IGZhbHNlXG5cbiAgIyBlbmFibGVzIC8gZGlzYWJsZXMgYXV0byBmYWRlaW4tZmFkZW91dCBhcyB0cmFuc2l0aW9uc1xuICBAZW5hYmxlX2F1dG9fdHJhbnNpdGlvbnM6IHRydWVcblxuICAjIGVuYWJsZXMgLyBkaXNhYmxlcyBhdXRvdGljIGJhZGluZyBiZXR3ZWVuIG1vZGVsIHggaG1sICh2ZXJ5IGV4cGVyaW1lbnRhbClcbiAgQGF1dG9iaW5kOiBmYWxzZSJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLElBQUE7O0FBQUEsQ0FBQSxFQUF1QixHQUFqQixDQUFOO0NBR0U7O0NBQUEsQ0FBQSxDQUFxQixFQUFyQixHQUFDLFVBQUQ7O0NBQUEsQ0FHQSxDQUEwQixDQUgxQixJQUdDLGVBQUQ7O0NBSEEsQ0FNQSxDQUFXLEVBTlgsR0FNQzs7Q0FORDs7Q0FIRiIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjM2NiwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvY29uZmlnL3ZlbmRvcnMuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbInJlcXVpcmUgJ2pxdWVyeV9zcHJpdGVmeSdcbnJlcXVpcmUgXCJza2V0Y2hcIlxucmVxdWlyZSBcInJlcXVlc3RBbmltXCJcbnJlcXVpcmUgXCJyZXF1ZXN0QW5pbVwiXG5yZXF1aXJlIFwiZGFuY2VyXCJcbiJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxDQUFRLE1BQVIsVUFBQTs7QUFDQSxDQURBLE1BQ0EsQ0FBQTs7QUFDQSxDQUZBLE1BRUEsTUFBQTs7QUFDQSxDQUhBLE1BR0EsTUFBQTs7QUFDQSxDQUpBLE1BSUEsQ0FBQSIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjM3OCwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvY29udHJvbGxlcnMvYXBwX2NvbnRyb2xsZXIuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIkNvbnRyb2xsZXIgPSByZXF1aXJlICd0aGVvcmljdXMvbXZjL2NvbnRyb2xsZXInXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQXBwQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXJcbiJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLDJCQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFhLElBQUEsR0FBYixnQkFBYTs7QUFFYixDQUZBLEVBRXVCLEdBQWpCLENBQU47Q0FBaUI7Ozs7O0NBQUE7O0NBQUE7O0NBQTRCIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6Mzk4LAogICAgImNvbHVtbiI6MAogIH0sCiAgIm1hcCI6IHsKICAgICJ2ZXJzaW9uIjogMywKICAgICJmaWxlIjogImFwcC5qcyIsCiAgICAic291cmNlcyI6IFsic3JjL2FwcC9jb250cm9sbGVycy9hdHRyYWN0LmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJBcHBDb250cm9sbGVyID0gcmVxdWlyZSAnYXBwL2NvbnRyb2xsZXJzL2FwcF9jb250cm9sbGVyJ1xuQXR0cmFjdCA9IHJlcXVpcmUgJ2FwcC9tb2RlbHMvYXR0cmFjdCdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBBdHRyYWN0IGV4dGVuZHMgQXBwQ29udHJvbGxlclxuXG4gICMjIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBERUZBVUxUIEFDVElPTiBCRUhBVklPUlxuICAgIE92ZXJyaWRlIGl0IHRvIHRha2UgY29udHJvbCBhbmQgY3VzdG9taXplIGFzIHlvdSB3aXNoXG4gIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiAjIyNcblxuICAjIDxhY3Rpb24tbmFtZT46KCktPlxuICAjICAgaWYgQXR0cmFjdC5hbGw/XG4gICMgICAgIEByZW5kZXIgXCJhdHRyYWN0LzxhY3Rpb24tbmFtZT5cIiwgQXR0cmFjdC5hbGwoKVxuICAjICAgZWxzZVxuICAjICAgICBAcmVuZGVyIFwiYXR0cmFjdC88YWN0aW9uLW5hbWU+XCIsIG51bGxcblxuICAjIyMgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgRVhBTVBMRVNcbiAgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+ICMjI1xuXG4gICMgbGlzdDooKS0+XG4gICMgICBAcmVuZGVyIFwiYXR0cmFjdC9saXN0XCIsIEF0dHJhY3QuYWxsKClcblxuICAjIGNyZWF0ZTooKS0+XG4gICMgICBAcmVuZGVyIFwiYXR0cmFjdC9jcmVhdGVcIiwgbnVsbCJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLHdCQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFnQixJQUFBLE1BQWhCLG1CQUFnQjs7QUFDaEIsQ0FEQSxFQUNVLElBQVYsYUFBVTs7QUFFVixDQUhBLEVBR3VCLEdBQWpCLENBQU47Q0FFRTs7Q0FBQTs7Ozs7Q0FBQTs7Q0FXQTs7OztDQVhBOzs7OztDQUFBOztDQUFBOztDQUZxQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjQzMywKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvY29udHJvbGxlcnMvaG9sZS5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiQXBwQ29udHJvbGxlciA9IHJlcXVpcmUgJ2FwcC9jb250cm9sbGVycy9hcHBfY29udHJvbGxlcidcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBIb2xlIGV4dGVuZHMgQXBwQ29udHJvbGxlclxuXG4gICMjIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBERUZBVUxUIEFDVElPTiBCRUhBVklPUlxuICAgIE92ZXJyaWRlIGl0IHRvIHRha2UgY29udHJvbCBhbmQgY3VzdG9taXplIGFzIHlvdSB3aXNoXG4gIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiAjIyNcblxuICAjIDxhY3Rpb24tbmFtZT46KCktPlxuICAjICAgaWYgUGFydGljbGUuYWxsP1xuICAjICAgICBAcmVuZGVyIFwicGFydGljbGVzLzxhY3Rpb24tbmFtZT5cIiwgUGFydGljbGUuYWxsKClcbiAgIyAgIGVsc2VcbiAgIyAgICAgQHJlbmRlciBcInBhcnRpY2xlcy88YWN0aW9uLW5hbWU+XCIsIG51bGxcblxuICAjIyMgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgRVhBTVBMRVNcbiAgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+ICMjI1xuXG4gICMgbGlzdDooKS0+XG4gICMgICBAcmVuZGVyIFwicGFydGljbGVzL2xpc3RcIiwgUGFydGljbGUuYWxsKClcblxuICAjIGNyZWF0ZTooKS0+XG4gICMgICBAcmVuZGVyIFwicGFydGljbGVzL2NyZWF0ZVwiLCBudWxsIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBLElBQUEscUJBQUE7R0FBQTtrU0FBQTs7QUFBQSxDQUFBLEVBQWdCLElBQUEsTUFBaEIsbUJBQWdCOztBQUVoQixDQUZBLEVBRXVCLEdBQWpCLENBQU47Q0FFRTs7Q0FBQTs7Ozs7Q0FBQTs7Q0FXQTs7OztDQVhBOzs7OztDQUFBOztDQUFBOztDQUZrQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjQ2NiwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvY29udHJvbGxlcnMvbWFnbmV0cy5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiQXBwQ29udHJvbGxlciA9IHJlcXVpcmUgJ2FwcC9jb250cm9sbGVycy9hcHBfY29udHJvbGxlcidcbk1hZ25ldCA9IHJlcXVpcmUgJ2FwcC9tb2RlbHMvbWFnbmV0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIE1hZ25ldHMgZXh0ZW5kcyBBcHBDb250cm9sbGVyXG5cbiAgIyMjIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIERFRkFVTFQgQUNUSU9OIEJFSEFWSU9SXG4gICAgT3ZlcnJpZGUgaXQgdG8gdGFrZSBjb250cm9sIGFuZCBjdXN0b21pemUgYXMgeW91IHdpc2hcbiAgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+ICMjI1xuXG4gICMgPGFjdGlvbi1uYW1lPjooKS0+XG4gICMgICBpZiBNYWduZXQuYWxsP1xuICAjICAgICBAcmVuZGVyIFwibWFnbmV0cy88YWN0aW9uLW5hbWU+XCIsIE1hZ25ldC5hbGwoKVxuICAjICAgZWxzZVxuICAjICAgICBAcmVuZGVyIFwibWFnbmV0cy88YWN0aW9uLW5hbWU+XCIsIG51bGxcblxuICAjIyMgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgRVhBTVBMRVNcbiAgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+ICMjI1xuXG4gICMgbGlzdDooKS0+XG4gICMgICBAcmVuZGVyIFwibWFnbmV0cy9saXN0XCIsIE1hZ25ldC5hbGwoKVxuXG4gICMgY3JlYXRlOigpLT5cbiAgIyAgIEByZW5kZXIgXCJtYWduZXRzL2NyZWF0ZVwiLCBudWxsIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBLElBQUEsZ0NBQUE7R0FBQTtrU0FBQTs7QUFBQSxDQUFBLEVBQWdCLElBQUEsTUFBaEIsbUJBQWdCOztBQUNoQixDQURBLEVBQ1MsR0FBVCxDQUFTLFlBQUE7O0FBRVQsQ0FIQSxFQUd1QixHQUFqQixDQUFOO0NBRUU7O0NBQUE7Ozs7O0NBQUE7O0NBV0E7Ozs7Q0FYQTs7Ozs7Q0FBQTs7Q0FBQTs7Q0FGcUMiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjo1MDEsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL2NvbnRyb2xsZXJzL3BhZ2VzLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJBcHBDb250cm9sbGVyID0gcmVxdWlyZSAnYXBwL2NvbnRyb2xsZXJzL2FwcF9jb250cm9sbGVyJ1xuUGFnZSA9IHJlcXVpcmUgJ2FwcC9tb2RlbHMvcGFnZSdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYWdlcyBleHRlbmRzIEFwcENvbnRyb2xsZXJcblxuCWNvbnN0cnVjdG9yOigpLT5cblxuCWNvbGxpc2lvbnM6KCktPlxuCQlAcmVuZGVyIFwiY2lyY2xlcy9jb2xsaXNpb25zXCJcblxuCWNpcmN1bGFyX21vdGlvbjooKS0+XG4JCUByZW5kZXIgXCJjaXJjbGVzL2NpcmN1bGFyX21vdGlvblwiXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxzQkFBQTtHQUFBO2tTQUFBOztBQUFBLENBQUEsRUFBZ0IsSUFBQSxNQUFoQixtQkFBZ0I7O0FBQ2hCLENBREEsRUFDTyxDQUFQLEdBQU8sVUFBQTs7QUFFUCxDQUhBLEVBR3VCLEdBQWpCLENBQU47Q0FFQzs7Q0FBWSxDQUFBLENBQUEsWUFBQTs7Q0FBWixFQUVXLE1BQUEsQ0FBWDtDQUNFLEdBQUEsRUFBRCxLQUFBLFNBQUE7Q0FIRCxFQUVXOztDQUZYLEVBS2dCLE1BQUEsTUFBaEI7Q0FDRSxHQUFBLEVBQUQsS0FBQSxjQUFBO0NBTkQsRUFLZ0I7O0NBTGhCOztDQUZvQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjUyOCwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvY29udHJvbGxlcnMvcmVwdWxzZS5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiQXBwQ29udHJvbGxlciA9IHJlcXVpcmUgJ2FwcC9jb250cm9sbGVycy9hcHBfY29udHJvbGxlcidcblZlY3RvciA9IHJlcXVpcmUgJ2FwcC9tb2RlbHMvcmVwdWxzZSdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBWZWN0b3JzIGV4dGVuZHMgQXBwQ29udHJvbGxlclxuXG4gICMjIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBERUZBVUxUIEFDVElPTiBCRUhBVklPUlxuICAgIE92ZXJyaWRlIGl0IHRvIHRha2UgY29udHJvbCBhbmQgY3VzdG9taXplIGFzIHlvdSB3aXNoXG4gIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiAjIyNcblxuICAjIDxhY3Rpb24tbmFtZT46KCktPlxuICAjICAgaWYgVmVjdG9yLmFsbD9cbiAgIyAgICAgQHJlbmRlciBcInZlY3RvcnMvPGFjdGlvbi1uYW1lPlwiLCBWZWN0b3IuYWxsKClcbiAgIyAgIGVsc2VcbiAgIyAgICAgQHJlbmRlciBcInZlY3RvcnMvPGFjdGlvbi1uYW1lPlwiLCBudWxsXG5cbiAgIyMjIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIEVYQU1QTEVTXG4gIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiAjIyNcblxuICAjIGxpc3Q6KCktPlxuICAjICAgQHJlbmRlciBcInZlY3RvcnMvbGlzdFwiLCBWZWN0b3IuYWxsKClcblxuICAjIGNyZWF0ZTooKS0+XG4gICMgICBAcmVuZGVyIFwidmVjdG9ycy9jcmVhdGVcIiwgbnVsbCJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLGdDQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFnQixJQUFBLE1BQWhCLG1CQUFnQjs7QUFDaEIsQ0FEQSxFQUNTLEdBQVQsQ0FBUyxhQUFBOztBQUVULENBSEEsRUFHdUIsR0FBakIsQ0FBTjtDQUVFOztDQUFBOzs7OztDQUFBOztDQVdBOzs7O0NBWEE7Ozs7O0NBQUE7O0NBQUE7O0NBRnFDIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6NTYzLAogICAgImNvbHVtbiI6MAogIH0sCiAgIm1hcCI6IHsKICAgICJ2ZXJzaW9uIjogMywKICAgICJmaWxlIjogImFwcC5qcyIsCiAgICAic291cmNlcyI6IFsic3JjL2FwcC9jb250cm9sbGVycy9zdHJpbmdzLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJBcHBDb250cm9sbGVyID0gcmVxdWlyZSAnYXBwL2NvbnRyb2xsZXJzL2FwcF9jb250cm9sbGVyJ1xuU3RyaW5nID0gcmVxdWlyZSAnYXBwL21vZGVscy9zdHJpbmcnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3RyaW5ncyBleHRlbmRzIEFwcENvbnRyb2xsZXJcblxuICAjIyMgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgREVGQVVMVCBBQ1RJT04gQkVIQVZJT1JcbiAgICBPdmVycmlkZSBpdCB0byB0YWtlIGNvbnRyb2wgYW5kIGN1c3RvbWl6ZSBhcyB5b3Ugd2lzaFxuICB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gIyMjXG5cbiAgIyA8YWN0aW9uLW5hbWU+OigpLT5cbiAgIyAgIGlmIFN0cmluZy5hbGw/XG4gICMgICAgIEByZW5kZXIgXCJzdHJpbmdzLzxhY3Rpb24tbmFtZT5cIiwgU3RyaW5nLmFsbCgpXG4gICMgICBlbHNlXG4gICMgICAgIEByZW5kZXIgXCJzdHJpbmdzLzxhY3Rpb24tbmFtZT5cIiwgbnVsbFxuXG4gICMjIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBFWEFNUExFU1xuICB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gIyMjXG5cbiAgIyBsaXN0OigpLT5cbiAgIyAgIEByZW5kZXIgXCJzdHJpbmdzL2xpc3RcIiwgU3RyaW5nLmFsbCgpXG5cbiAgIyBjcmVhdGU6KCktPlxuICAjICAgQHJlbmRlciBcInN0cmluZ3MvY3JlYXRlXCIsIG51bGwiXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxnQ0FBQTtHQUFBO2tTQUFBOztBQUFBLENBQUEsRUFBZ0IsSUFBQSxNQUFoQixtQkFBZ0I7O0FBQ2hCLENBREEsRUFDUyxHQUFULENBQVMsWUFBQTs7QUFFVCxDQUhBLEVBR3VCLEdBQWpCLENBQU47Q0FFRTs7Q0FBQTs7Ozs7Q0FBQTs7Q0FXQTs7OztDQVhBOzs7OztDQUFBOztDQUFBOztDQUZxQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjU5OCwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvbGliL2RyYXcvZHJhdy5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEcmF3XG5cbiAgQENUWDpudWxsIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBLElBQUE7O0FBQUEsQ0FBQSxFQUF1QixHQUFqQixDQUFOO0NBRUU7O0NBQUEsQ0FBQSxDQUFBLENBQUM7O0NBQUQ7O0NBRkYiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjo2MTEsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL2xpYi9kcmF3L2dlb20vY2lyY2xlLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJEcmF3ID0gcmVxdWlyZShcIi4uL2RyYXdcIilcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDaXJjbGVcblxuICByYWRpdXM6MFxuICBmaWxsOlwiI2ZmMDAwMFwiXG4gIG9wYWNpdHk6MVxuICBzdHJva2U6XCIjMDAwMDAwXCJcbiAgeDowXG4gIHk6MFxuXG4gIGNvbnN0cnVjdG9yOihAcmFkaXVzLCBAZmlsbCwgQHN0cm9rZSwgQHN0cm9rZVdpZHRoID0gMSktPlxuXG5cbiAgZHJhdzooQGN0eCktPlxuICAgIEBjdHggPSBEcmF3LkNUWCB1bmxlc3MgQGN0eFxuICAgIEBjdHguZ2xvYmFsQWxwaGEgPSBAb3BhY2l0eVxuICAgIEBjdHguZmlsbFN0eWxlID0gQGZpbGxcbiAgICBAY3R4LmxpbmVXaWR0aCA9IEBzdHJva2VXaWR0aCBpZiBAc3Ryb2tlXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IEBzdHJva2UgaWYgQHN0cm9rZVxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LmFyYyBAeCwgQHksIEByYWRpdXMsIDAsIE1hdGguUEkqMix0cnVlXG4gICAgQGN0eC5jbG9zZVBhdGgoKVxuICAgIEBjdHguZmlsbCgpXG4gICAgQGN0eC5zdHJva2UoKSBpZiBAc3Ryb2tlXG4gICAgQGN0eC5nbG9iYWxBbHBoYSA9IDFcblxuXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxRQUFBOztBQUFBLENBQUEsRUFBTyxDQUFQLEdBQU8sRUFBQTs7QUFFUCxDQUZBLEVBRXVCLEdBQWpCLENBQU47Q0FFRSxFQUFPLEdBQVA7O0NBQUEsRUFDSyxDQUFMLEtBREE7O0NBQUEsRUFFUSxJQUFSOztDQUZBLEVBR08sR0FBUCxHQUhBOztDQUFBLEVBSUU7O0NBSkYsRUFLRTs7Q0FFVSxDQUFBLENBQUEsQ0FBQSxFQUFBLEtBQUEsS0FBRTtDQUEwQyxFQUExQyxDQUFELEVBQTJDO0NBQUEsRUFBakMsQ0FBRDtDQUFrQyxFQUExQixDQUFELEVBQTJCO0NBQUEsRUFBakIsQ0FBRDtDQVB0QyxFQU9ZOztDQVBaLEVBVUssQ0FBTCxLQUFPO0NBQ0wsRUFESyxDQUFEO0FBQ21CLENBQXZCLEVBQUEsQ0FBQTtDQUFBLEVBQUEsQ0FBQyxFQUFEO01BQUE7Q0FBQSxFQUNJLENBQUosR0FEQSxJQUNBO0NBREEsRUFFSSxDQUFKLEtBQUE7Q0FDQSxHQUFBLEVBQUE7Q0FBQSxFQUFJLENBQUgsRUFBRCxHQUFBLEVBQUE7TUFIQTtDQUlBLEdBQUEsRUFBQTtDQUFBLEVBQUksQ0FBSCxFQUFELEtBQUE7TUFKQTtDQUFBLEVBS0ksQ0FBSixLQUFBO0NBTEEsQ0FNYSxDQUFULENBQUosRUFBQTtDQU5BLEVBT0ksQ0FBSixLQUFBO0NBUEEsRUFRSSxDQUFKO0NBQ0EsR0FBQSxFQUFBO0NBQUEsRUFBSSxDQUFILEVBQUQ7TUFUQTtDQVVDLEVBQUcsQ0FBSCxPQUFEO0NBckJGLEVBVUs7O0NBVkw7O0NBSkYiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjo2NjQsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL2xpYi9kcmF3L2dlb20vdmVjdG9yLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJDYWxjID0gcmVxdWlyZSBcIi4uL21hdGgvY2FsY1wiXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVmVjdG9yXG5cbiAgX3g6MFxuICBfeTowXG5cbiAgY29uc3RydWN0b3I6KEBfeCwgQF95KS0+XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyBALFxuICAgICAgXCJ4XCI6XG4gICAgICAgIGdldDooKS0+IEBfeFxuICAgICAgICBzZXQ6KHZhbCktPiBAX3ggPSB2YWxcblxuICAgICAgXCJ5XCI6XG4gICAgICAgIGdldDooKS0+IEBfeVxuICAgICAgICBzZXQ6KHZhbCktPiBAX3kgPSB2YWxcblxuICBhZGQ6KHZlY3RvciktPlxuICAgIEB4ICs9IHZlY3Rvci54XG4gICAgQHkgKz0gdmVjdG9yLnlcblxuICBAYWRkOih2MSx2MiktPiBuZXcgVmVjdG9yICh2MS54ICsgdjIueCksKHYxLnkgKyB2MS55KVxuXG4gIHN1YjoodmVjdG9yKS0+XG4gICAgQHggLT0gdmVjdG9yLnhcbiAgICBAeSAtPSB2ZWN0b3IueVxuXG4gIEBzdWI6KHYxLHYyKS0+IG5ldyBWZWN0b3IgdjEueCAtIHYyLngsdjEueSAtIHYyLnlcblxuICBtdWx0OihuKS0+XG4gICAgQHggKj0gblxuICAgIEB5ICo9IG5cblxuICBAbXVsdDoobiktPiBuZXcgVmVjdG9yIEB4ICogbixAeSAqIG5cblxuICBkaXY6KG4pLT5cbiAgICBAeCAvPSBuXG4gICAgQHkgLz0gblxuXG4gIEBkaXY6KG4pLT4gbmV3IFZlY3RvciBAeCAvIG4sQHkgLyBuXG5cbiAgbWFnOigpLT5cbiAgICAjIE1hdGguYXRhbjIgQHgsIEB5XG5cbiAgbm9ybTooKS0+XG4gICAgbSA9IEBtYWcoKVxuICAgIEBkaXYobSlcblxuICBsaW1pdDoobiktPlxuICAgIGlmIEBtYWcoKSA+IG5cbiAgICAgIEBub3JtKClcbiAgICAgIEBtdWx0IG5cblxuICBAcm5kOigpLT4gbmV3IFZlY3RvciBNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpXG5cbiJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLFFBQUE7O0FBQUEsQ0FBQSxFQUFPLENBQVAsR0FBTyxPQUFBOztBQUVQLENBRkEsRUFFdUIsR0FBakIsQ0FBTjtDQUVFLENBQUEsQ0FBRzs7Q0FBSCxDQUNBLENBQUc7O0NBRVMsQ0FBQSxDQUFBLGFBQUU7Q0FFWixDQUFBLENBRlksQ0FBRDtDQUVYLENBQUEsQ0FGaUIsQ0FBRDtDQUVoQixDQUNFLEVBREYsRUFBTSxVQUFOO0NBQ0UsQ0FDRSxDQURGLEdBQUE7Q0FDRSxDQUFJLENBQUosS0FBQSxDQUFJO0NBQU0sR0FBQSxhQUFEO0NBQVQsUUFBSTtDQUFKLENBQ0ksQ0FBSixLQUFBLENBQUs7Q0FBUSxDQUFELENBQU0sQ0FBTCxhQUFEO0NBRFosUUFDSTtRQUZOO0NBQUEsQ0FLRSxDQURGLEdBQUE7Q0FDRSxDQUFJLENBQUosS0FBQSxDQUFJO0NBQU0sR0FBQSxhQUFEO0NBQVQsUUFBSTtDQUFKLENBQ0ksQ0FBSixLQUFBLENBQUs7Q0FBUSxDQUFELENBQU0sQ0FBTCxhQUFEO0NBRFosUUFDSTtRQU5OO0NBREYsS0FBQTtDQUxGLEVBR1k7O0NBSFosRUFjQSxHQUFJLEdBQUM7Q0FDSCxHQUFBLEVBQVk7Q0FDWCxHQUFBLEVBQVcsS0FBWjtDQWhCRixFQWNJOztDQWRKLENBa0JBLENBQUEsR0FBQyxHQUFLO0NBQXFCLENBQUUsQ0FBSyxDQUFmLEVBQUEsS0FBQTtDQWxCbkIsRUFrQks7O0NBbEJMLEVBb0JBLEdBQUksR0FBQztDQUNILEdBQUEsRUFBWTtDQUNYLEdBQUEsRUFBVyxLQUFaO0NBdEJGLEVBb0JJOztDQXBCSixDQXdCQSxDQUFBLEdBQUMsR0FBSztDQUFvQixDQUFFLENBQUssQ0FBZCxFQUFBLEtBQUE7Q0F4Qm5CLEVBd0JLOztDQXhCTCxFQTBCSyxDQUFMLEtBQU07Q0FDSixHQUFBO0NBQ0MsR0FBQSxPQUFEO0NBNUJGLEVBMEJLOztDQTFCTCxDQThCQSxDQUFNLENBQU4sRUFBQyxHQUFNO0NBQWdCLENBQU8sQ0FBRixDQUFaLEVBQUEsS0FBQTtDQTlCaEIsRUE4Qk07O0NBOUJOLEVBZ0NBLE1BQUs7Q0FDSCxHQUFBO0NBQ0MsR0FBQSxPQUFEO0NBbENGLEVBZ0NJOztDQWhDSixDQW9DQSxDQUFBLEdBQUMsR0FBSztDQUFnQixDQUFPLENBQUYsQ0FBWixFQUFBLEtBQUE7Q0FwQ2YsRUFvQ0s7O0NBcENMLEVBc0NBLE1BQUk7O0NBdENKLEVBeUNLLENBQUwsS0FBSztDQUNILE9BQUE7Q0FBQSxFQUFJLENBQUo7Q0FDQyxFQUFELENBQUMsT0FBRDtDQTNDRixFQXlDSzs7Q0F6Q0wsRUE2Q00sRUFBTixJQUFPO0NBQ0wsRUFBRyxDQUFIO0NBQ0UsR0FBQyxFQUFEO0NBQ0MsR0FBQSxTQUFEO01BSEU7Q0E3Q04sRUE2Q007O0NBN0NOLENBa0RBLENBQUEsR0FBQyxHQUFJO0NBQWdCLENBQWUsRUFBdEIsRUFBQSxLQUFBO0NBbERkLEVBa0RLOztDQWxETDs7Q0FKRiIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjc1NywKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvbGliL2RyYXcvbWF0aC9jYWxjLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENhbGNcblxuICBAcm5kMmQ6KCktPlxuXG4gICAgeCA9IE1hdGgucmFuZG9tKClcbiAgICB5ID0gTWF0aC5yYW5kb20oKVxuXG4gICAgeDp4LHk6eVxuXG4gIEBkaXN0Oih4MSx5MSx4Mix5MiktPlxuICAgIGR4ID0geDEgLSB4MlxuICAgIGR5ID0geTEgLSB5MlxuICAgIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSlcblxuICBAYW5nOih4MSx5MSx4Mix5MiktPlxuICAgIGFuZ2xlID0gTWF0aC5hdGFuMih5MiAtIHkxLCB4MiAtIHgxKSAqICgxODAgLyBNYXRoLlBJKTtcblxuICBAZGVnMnJhZDooZGVnKS0+XG4gICAgZGVnICogTWF0aC5QSSAvIDE4MFxuXG4gIEByYWQyZGVnOihyYWQpLT5cbiAgICByYWQgKiAxODAgLyBNYXRoLlBJOyJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBOztBQUFBLENBQUEsRUFBdUIsR0FBakIsQ0FBTjtDQUVFOztDQUFBLENBQUEsQ0FBTyxDQUFOLENBQUQsSUFBTztDQUVMLEdBQUEsSUFBQTtDQUFBLEVBQUksQ0FBSixFQUFJO0NBQUosRUFDSSxDQUFKLEVBQUk7V0FFSjtDQUFBLENBQUUsSUFBRjtDQUFBLENBQU0sSUFBRjtDQUxDO0NBQVAsRUFBTzs7Q0FBUCxDQU9BLENBQU0sQ0FBTCxLQUFNO0NBQ0wsS0FBQSxFQUFBO0NBQUEsQ0FBQSxDQUFLLENBQUw7Q0FBQSxDQUNBLENBQUssQ0FBTDtDQUNLLENBQUssQ0FBSyxDQUFYLE9BQUo7Q0FWRixFQU9NOztDQVBOLENBWUEsQ0FBQSxDQUFDLEtBQUs7Q0FDSixJQUFBLEdBQUE7Q0FBYSxDQUFNLENBQVgsQ0FBSSxDQUFaLE1BQUE7Q0FiRixFQVlLOztDQVpMLENBZUEsQ0FBUyxDQUFSLEdBQUQsRUFBVTtDQUNHLENBQVgsQ0FBQSxDQUFVLE9BQVY7Q0FoQkYsRUFlUzs7Q0FmVCxDQWtCQSxDQUFTLENBQVIsR0FBRCxFQUFVO0NBQ1MsRUFBakIsQ0FBZ0IsT0FBaEI7Q0FuQkYsRUFrQlM7O0NBbEJUOztDQUZGIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6Nzk4LAogICAgImNvbHVtbiI6MAogIH0sCiAgIm1hcCI6IHsKICAgICJ2ZXJzaW9uIjogMywKICAgICJmaWxlIjogImFwcC5qcyIsCiAgICAic291cmNlcyI6IFsic3JjL2FwcC9tb2RlbHMvYXBwX21vZGVsLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJNb2RlbCA9IHJlcXVpcmUgJ3RoZW9yaWN1cy9tdmMvbW9kZWwnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQXBwTW9kZWwgZXh0ZW5kcyBNb2RlbFxuIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBLElBQUEsaUJBQUE7R0FBQTtrU0FBQTs7QUFBQSxDQUFBLEVBQVEsRUFBUixFQUFRLGNBQUE7O0FBRVIsQ0FGQSxFQUV1QixHQUFqQixDQUFOO0NBQWlCOzs7OztDQUFBOztDQUFBOztDQUF1QiIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjgxOCwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvbW9kZWxzL2F0dHJhY3QuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIkFwcE1vZGVsID0gcmVxdWlyZSAnYXBwL21vZGVscy9hcHBfbW9kZWwnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQXR0cmFjdCBleHRlbmRzIEFwcE1vZGVsXG5cbiAgIyMjIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIE1PREVMIFBST1BFUlRJRVNcbiAgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+ICMjI1xuXG4gICMgQGZpZWxkc1xuICAjICAgJ2lkJyAgIDogTnVtYmVyXG4gICMgICAnbmFtZScgOiBTdHJpbmdcbiAgIyAgICdhZ2UnICA6IE51bWJlclxuXG5cblxuICAjIyMgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgUkVTVEZVTEwgSlNPTiBTUEVDSUZJQ0FUSU9OXG4gIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiAjIyNcblxuICAjIEByZXN0XG4gICMgICAnYWxsJyAgICA6IFsnR0VUJywgJy9hdHRyYWN0cy5qc29uJ11cbiAgIyAgICdjcmVhdGUnIDogWydQT1NUJywnL2F0dHJhY3RzLmpzb24nXVxuICAjICAgJ3JlYWQnICAgOiBbJ0dFVCcsICcvYXR0cmFjdHMvOmlkLmpzb24nXVxuICAjICAgJ3VwZGF0ZScgOiBbJ1BVVCcsICcvYXR0cmFjdHMvOmlkLmpzb24nXVxuICAjICAgJ2RlbGV0ZScgOiBbJ0RFTEVURScsICcvYXR0cmFjdHMvOmlkLmpzb24nXSJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLG1CQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFXLElBQUEsQ0FBWCxjQUFXOztBQUVYLENBRkEsRUFFdUIsR0FBakIsQ0FBTjtDQUVFOztDQUFBOzs7O0NBQUE7O0NBV0E7Ozs7Q0FYQTs7Ozs7Q0FBQTs7Q0FBQTs7Q0FGcUMiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjo4NTAsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL21vZGVscy9ob2xlLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJBcHBNb2RlbCA9IHJlcXVpcmUgJ2FwcC9tb2RlbHMvYXBwX21vZGVsJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEhvbGUgZXh0ZW5kcyBBcHBNb2RlbFxuXG4gICMjIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBNT0RFTCBQUk9QRVJUSUVTXG4gIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiAjIyNcblxuICAjIEBmaWVsZHNcbiAgIyAgICdpZCcgICA6IE51bWJlclxuICAjICAgJ25hbWUnIDogU3RyaW5nXG4gICMgICAnYWdlJyAgOiBOdW1iZXJcblxuXG5cbiAgIyMjIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIFJFU1RGVUxMIEpTT04gU1BFQ0lGSUNBVElPTlxuICB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gIyMjXG5cbiAgIyBAcmVzdFxuICAjICAgJ2FsbCcgICAgOiBbJ0dFVCcsICcvcGFydGljbGVzLmpzb24nXVxuICAjICAgJ2NyZWF0ZScgOiBbJ1BPU1QnLCcvcGFydGljbGVzLmpzb24nXVxuICAjICAgJ3JlYWQnICAgOiBbJ0dFVCcsICcvcGFydGljbGVzLzppZC5qc29uJ11cbiAgIyAgICd1cGRhdGUnIDogWydQVVQnLCAnL3BhcnRpY2xlcy86aWQuanNvbiddXG4gICMgICAnZGVsZXRlJyA6IFsnREVMRVRFJywgJy9wYXJ0aWNsZXMvOmlkLmpzb24nXSJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLGdCQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFXLElBQUEsQ0FBWCxjQUFXOztBQUVYLENBRkEsRUFFdUIsR0FBakIsQ0FBTjtDQUVFOztDQUFBOzs7O0NBQUE7O0NBV0E7Ozs7Q0FYQTs7Ozs7Q0FBQTs7Q0FBQTs7Q0FGa0MiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjo4ODIsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL21vZGVscy9tYWduZXQuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIkFwcE1vZGVsID0gcmVxdWlyZSAnYXBwL21vZGVscy9hcHBfbW9kZWwnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTWFnbmV0IGV4dGVuZHMgQXBwTW9kZWxcblxuICAjIyMgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XG4gICAgTU9ERUwgUFJPUEVSVElFU1xuICB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gIyMjXG5cbiAgIyBAZmllbGRzXG4gICMgICAnaWQnICAgOiBOdW1iZXJcbiAgIyAgICduYW1lJyA6IFN0cmluZ1xuICAjICAgJ2FnZScgIDogTnVtYmVyXG5cblxuXG4gICMjIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBSRVNURlVMTCBKU09OIFNQRUNJRklDQVRJT05cbiAgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+ICMjI1xuXG4gICMgQHJlc3RcbiAgIyAgICdhbGwnICAgIDogWydHRVQnLCAnL21hZ25ldHMuanNvbiddXG4gICMgICAnY3JlYXRlJyA6IFsnUE9TVCcsJy9tYWduZXRzLmpzb24nXVxuICAjICAgJ3JlYWQnICAgOiBbJ0dFVCcsICcvbWFnbmV0cy86aWQuanNvbiddXG4gICMgICAndXBkYXRlJyA6IFsnUFVUJywgJy9tYWduZXRzLzppZC5qc29uJ11cbiAgIyAgICdkZWxldGUnIDogWydERUxFVEUnLCAnL21hZ25ldHMvOmlkLmpzb24nXSJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLGtCQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFXLElBQUEsQ0FBWCxjQUFXOztBQUVYLENBRkEsRUFFdUIsR0FBakIsQ0FBTjtDQUVFOztDQUFBOzs7O0NBQUE7O0NBV0E7Ozs7Q0FYQTs7Ozs7Q0FBQTs7Q0FBQTs7Q0FGb0MiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjo5MTQsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL21vZGVscy9wYWdlLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJBcHBNb2RlbCA9IHJlcXVpcmUgJ2FwcC9tb2RlbHMvYXBwX21vZGVsJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhZ2UgZXh0ZW5kcyBBcHBNb2RlbFxuXG4gICMjIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBNT0RFTCBQUk9QRVJUSUVTXG4gIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiAjIyNcblxuICAjIEBmaWVsZHNcbiAgIyAgICdpZCcgICA6IE51bWJlclxuICAjICAgJ25hbWUnIDogU3RyaW5nXG4gICMgICAnYWdlJyAgOiBOdW1iZXJcblxuXG5cbiAgIyMjIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIFJFU1RGVUxMIEpTT04gU1BFQ0lGSUNBVElPTlxuICB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gIyMjXG5cbiAgIyBAcmVzdFxuICAjICAgJ2FsbCcgICAgOiBbJ0dFVCcsICcvcGFnZXMuanNvbiddXG4gICMgICAnY3JlYXRlJyA6IFsnUE9TVCcsJy9wYWdlcy5qc29uJ11cbiAgIyAgICdyZWFkJyAgIDogWydHRVQnLCAnL3BhZ2VzLzppZC5qc29uJ11cbiAgIyAgICd1cGRhdGUnIDogWydQVVQnLCAnL3BhZ2VzLzppZC5qc29uJ11cbiAgIyAgICdkZWxldGUnIDogWydERUxFVEUnLCAnL3BhZ2VzLzppZC5qc29uJ10iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxnQkFBQTtHQUFBO2tTQUFBOztBQUFBLENBQUEsRUFBVyxJQUFBLENBQVgsY0FBVzs7QUFFWCxDQUZBLEVBRXVCLEdBQWpCLENBQU47Q0FFRTs7Q0FBQTs7OztDQUFBOztDQVdBOzs7O0NBWEE7Ozs7O0NBQUE7O0NBQUE7O0NBRmtDIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6OTQ2LAogICAgImNvbHVtbiI6MAogIH0sCiAgIm1hcCI6IHsKICAgICJ2ZXJzaW9uIjogMywKICAgICJmaWxlIjogImFwcC5qcyIsCiAgICAic291cmNlcyI6IFsic3JjL2FwcC9tb2RlbHMvcmVwdWxzZS5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiQXBwTW9kZWwgPSByZXF1aXJlICdhcHAvbW9kZWxzL2FwcF9tb2RlbCdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBWZWN0b3IgZXh0ZW5kcyBBcHBNb2RlbFxuXG4gICMjIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBNT0RFTCBQUk9QRVJUSUVTXG4gIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiAjIyNcblxuICAjIEBmaWVsZHNcbiAgIyAgICdpZCcgICA6IE51bWJlclxuICAjICAgJ25hbWUnIDogU3RyaW5nXG4gICMgICAnYWdlJyAgOiBOdW1iZXJcblxuXG5cbiAgIyMjIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIFJFU1RGVUxMIEpTT04gU1BFQ0lGSUNBVElPTlxuICB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gIyMjXG5cbiAgIyBAcmVzdFxuICAjICAgJ2FsbCcgICAgOiBbJ0dFVCcsICcvdmVjdG9ycy5qc29uJ11cbiAgIyAgICdjcmVhdGUnIDogWydQT1NUJywnL3ZlY3RvcnMuanNvbiddXG4gICMgICAncmVhZCcgICA6IFsnR0VUJywgJy92ZWN0b3JzLzppZC5qc29uJ11cbiAgIyAgICd1cGRhdGUnIDogWydQVVQnLCAnL3ZlY3RvcnMvOmlkLmpzb24nXVxuICAjICAgJ2RlbGV0ZScgOiBbJ0RFTEVURScsICcvdmVjdG9ycy86aWQuanNvbiddIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBLElBQUEsa0JBQUE7R0FBQTtrU0FBQTs7QUFBQSxDQUFBLEVBQVcsSUFBQSxDQUFYLGNBQVc7O0FBRVgsQ0FGQSxFQUV1QixHQUFqQixDQUFOO0NBRUU7O0NBQUE7Ozs7Q0FBQTs7Q0FXQTs7OztDQVhBOzs7OztDQUFBOztDQUFBOztDQUZvQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjk3OCwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvbW9kZWxzL3N0cmluZy5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiQXBwTW9kZWwgPSByZXF1aXJlICdhcHAvbW9kZWxzL2FwcF9tb2RlbCdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTdHJpbmcgZXh0ZW5kcyBBcHBNb2RlbFxuXG4gICMjIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cbiAgICBNT0RFTCBQUk9QRVJUSUVTXG4gIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fiAjIyNcblxuICAjIEBmaWVsZHNcbiAgIyAgICdpZCcgICA6IE51bWJlclxuICAjICAgJ25hbWUnIDogU3RyaW5nXG4gICMgICAnYWdlJyAgOiBOdW1iZXJcblxuXG5cbiAgIyMjIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxuICAgIFJFU1RGVUxMIEpTT04gU1BFQ0lGSUNBVElPTlxuICB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4gIyMjXG5cbiAgIyBAcmVzdFxuICAjICAgJ2FsbCcgICAgOiBbJ0dFVCcsICcvc3RyaW5ncy5qc29uJ11cbiAgIyAgICdjcmVhdGUnIDogWydQT1NUJywnL3N0cmluZ3MuanNvbiddXG4gICMgICAncmVhZCcgICA6IFsnR0VUJywgJy9zdHJpbmdzLzppZC5qc29uJ11cbiAgIyAgICd1cGRhdGUnIDogWydQVVQnLCAnL3N0cmluZ3MvOmlkLmpzb24nXVxuICAjICAgJ2RlbGV0ZScgOiBbJ0RFTEVURScsICcvc3RyaW5ncy86aWQuanNvbiddIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBLElBQUEsa0JBQUE7R0FBQTtrU0FBQTs7QUFBQSxDQUFBLEVBQVcsSUFBQSxDQUFYLGNBQVc7O0FBRVgsQ0FGQSxFQUV1QixHQUFqQixDQUFOO0NBRUU7O0NBQUE7Ozs7Q0FBQTs7Q0FXQTs7OztDQVhBOzs7OztDQUFBOztDQUFBOztDQUZvQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjEwMTAsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL3ZpZXdzL2FwcF92aWV3LmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJWaWV3ID0gcmVxdWlyZSAndGhlb3JpY3VzL212Yy92aWV3J1xucmVxdWlyZSAnYXBwL2NvbmZpZy92ZW5kb3JzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEFwcFZpZXcgZXh0ZW5kcyBWaWV3XG5cbiAgc2V0X3RyaWdnZXJzOiAtPlxuICAgIHN1cGVyKClcblxuICAgICMgYXV0b21hZ2ljYWxseSByb3V0ZSBsaW5rcyBzdGFydGluZyB3aXRoIFwiL1wiXG4gICAgQGVsLmZpbmQoICdhW2hyZWYqPVwiL1wiXScgKS5lYWNoICggaW5kZXgsIGl0ZW0gKSA9PlxuICAgICAgJCggaXRlbSApLmNsaWNrICggZXZlbnQgKSA9PlxuICAgICAgICBAbmF2aWdhdGUgJCggZXZlbnQuZGVsZWdhdGVUYXJnZXQgKS5hdHRyICdocmVmJ1xuICAgICAgICByZXR1cm4gb2ZmXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxlQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFPLENBQVAsR0FBTyxhQUFBOztBQUNQLENBREEsTUFDQSxhQUFBOztBQUVBLENBSEEsRUFHdUIsR0FBakIsQ0FBTjtDQUVFOzs7OztDQUFBOztDQUFBLEVBQWMsTUFBQSxHQUFkO0NBQ0UsT0FBQSxJQUFBO0NBQUEsR0FBQSxvQ0FBQTtDQUdDLENBQUUsQ0FBNkIsQ0FBL0IsQ0FBK0IsSUFBRSxFQUFsQyxHQUFBO0NBQ0UsRUFBZ0IsQ0FBaEIsQ0FBQSxJQUFrQixJQUFsQjtDQUNFLEdBQVUsQ0FBVCxDQUFTLEVBQVYsTUFBVTtDQUNWLElBQUEsVUFBTztDQUZULE1BQWdCO0NBRGxCLElBQWdDO0NBSmxDLEVBQWM7O0NBQWQ7O0NBRnFDIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6MTA0MywKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvdmlld3MvYXR0cmFjdC9iYWxsLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJDaXJjbGUgPSByZXF1aXJlIFwiZHJhdy9nZW9tL2NpcmNsZVwiXG5EcmF3ID0gcmVxdWlyZSBcImRyYXcvZHJhd1wiXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQmFsbCBleHRlbmRzIENpcmNsZVxuXG4gIHg6IDBcbiAgeTogMFxuICBtYXNzOiAwXG4gIHZ4OiAwXG4gIHZ5OiAwXG4gIGF4OiAwXG4gIGF5OiAwXG4gIHNwZWVkOiAxXG4gIHNwcmluZzogMC45XG4gIE1BWF9TUEVFRCA6IDUwXG5cbiAgY29uc3RydWN0b3I6LT5cbiAgICBzdXBlclxuICAgIEBtYXNzID0gQHJhZGl1c1xuXG4gIGFwcGx5X2ZvcmNlOihmeCwgZnkpLT5cblxuICAgIGZ4IC89IEBtYXNzXG4gICAgZnkgLz0gQG1hc3NcblxuICAgIEBheCArPSBmeFxuICAgIEBheSArPSBmeVxuXG4gIHVwZGF0ZTooKS0+XG5cbiAgICBAdnggKz0gQGF4XG4gICAgQHZ5ICs9IEBheVxuXG4gICAgQHggKz0gQHZ4ICogQHNwZWVkXG4gICAgQHkgKz0gQHZ5ICogQHNwZWVkXG5cbiAgICBAYXggPSAwXG4gICAgQGF5ID0gMFxuXG4gIGRyYXc6LT5cbiAgICBzdXBlclxuXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxjQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFTLEdBQVQsQ0FBUyxXQUFBOztBQUNULENBREEsRUFDTyxDQUFQLEdBQU8sSUFBQTs7QUFFUCxDQUhBLEVBR3VCLEdBQWpCLENBQU47Q0FFRTs7Q0FBQSxFQUFHOztDQUFILEVBQ0c7O0NBREgsRUFFTSxDQUFOOztDQUZBLENBR0EsQ0FBSTs7Q0FISixDQUlBLENBQUk7O0NBSkosQ0FLQSxDQUFJOztDQUxKLENBTUEsQ0FBSTs7Q0FOSixFQU9PLEVBQVA7O0NBUEEsRUFRUSxHQUFSOztDQVJBLENBQUEsQ0FTWSxNQUFaOztDQUVZLENBQUEsQ0FBQSxXQUFBO0NBQ1YsR0FBQSxLQUFBLDhCQUFBO0NBQUEsRUFDUSxDQUFSLEVBREE7Q0FaRixFQVdZOztDQVhaLENBZVksQ0FBQSxNQUFDLEVBQWI7Q0FFRSxDQUFBLEVBQUE7Q0FBQSxDQUNBLEVBQUE7Q0FEQSxDQUdBLEVBQUE7Q0FDQyxDQUFELEVBQUMsT0FBRDtDQXJCRixFQWVZOztDQWZaLEVBdUJPLEdBQVAsR0FBTztDQUVMLENBQUEsRUFBQTtDQUFBLENBQ0EsRUFBQTtDQURBLENBR00sQ0FBTSxDQUFaLENBSEE7Q0FBQSxDQUlNLENBQU0sQ0FBWixDQUpBO0NBQUEsQ0FNQSxDQUFNLENBQU47Q0FDQyxDQUFELENBQU0sQ0FBTCxPQUFEO0NBaENGLEVBdUJPOztDQXZCUCxFQWtDSyxDQUFMLEtBQUs7Q0FBQSxRQUNILEVBQUEscUJBQUE7Q0FuQ0YsRUFrQ0s7O0NBbENMOztDQUZrQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjExMDUsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL3ZpZXdzL2F0dHJhY3QvaW5kZXguY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIkFwcFZpZXcgPSByZXF1aXJlICdhcHAvdmlld3MvYXBwX3ZpZXcnXG5EcmF3ID0gcmVxdWlyZSBcImRyYXcvZHJhd1wiXG5DYWxjID0gcmVxdWlyZSBcImRyYXcvbWF0aC9jYWxjXCJcbkJhbGwgPSByZXF1aXJlIFwiLi9iYWxsXCJcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBJbmRleCBleHRlbmRzIEFwcFZpZXdcblxuICBOVU1fQkFMTFMgPSAyMDBcblxuICBiYWxsOiBudWxsXG4gIHRhcmdldDogbnVsbFxuXG4gIGJhbGxzOiBbXVxuICBjZW50ZXI6IG51bGxcblxuICBkZXN0cm95Oj0+XG4gICAgQGN0eC5jbGVhcigpXG4gICAgQGN0eC5kZXN0cm95KClcbiAgICBzdXBlclxuXG4gIGFmdGVyX3JlbmRlcjooKT0+XG5cbiAgICBzID0gQFxuICAgIGRpciA9IHt9XG4gICAgQGJhbGxzID0gW11cblxuICAgIGlmIEBjdHhcbiAgICAgIEBjdHguY2xlYXIoKVxuICAgICAgQGN0eC5kZXN0cm95KClcblxuICAgIEBjdHggPSB3aW5kb3cuU2tldGNoLmNyZWF0ZVxuXG4gICAgICBjb250YWluZXI6IEBlbC5nZXQoMClcbiAgICAgIGF1dG9jbGVhcjogZmFsc2VcblxuICAgICAgc2V0dXA6KCktPlxuXG4gICAgICAgIERyYXcuQ1RYID0gJChcIi5za2V0Y2hcIikuZ2V0KDApLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgICAgICBEcmF3LkNUWC5maWxsU3R5bGUgPSBcInJnYmEoMCwwLDAsMSlcIjtcbiAgICAgICAgRHJhdy5DVFguZmlsbFJlY3QoMCwgMCwgQHdpZHRoLCBAaGVpZ2h0KTtcblxuICAgICAgICBpID0gMFxuXG4gICAgICAgIHdoaWxlIGkgPCBOVU1fQkFMTFNcblxuICAgICAgICAgIHJhZGl1cyA9IDVcbiAgICAgICAgICBiYWxsID0gbmV3IEJhbGwgcmFkaXVzLCBcIiNmZmZcIiwgXCIjMDAwXCJcbiAgICAgICAgICBiYWxsLnNwZWVkID0gMC4xXG4gICAgICAgICAgYmFsbC54ID0gKEB3aWR0aCAvIDIpICsgKC0oTWF0aC5yYW5kb20oKSAqIEB3aWR0aCkgKyAoTWF0aC5yYW5kb20oKSAqIEB3aWR0aCkpXG4gICAgICAgICAgYmFsbC55ID0gKEBoZWlnaHQgLyAyKSArICgtKE1hdGgucmFuZG9tKCkgKiBAaGVpZ2h0KSArIChNYXRoLnJhbmRvbSgpICogQGhlaWdodCkpXG4gICAgICAgICAgYmFsbC56ID0gTWF0aC5yYW5kb20oKSAqIHJhZGl1c1xuICAgICAgICAgIHMuYmFsbHMucHVzaCBiYWxsXG4gICAgICAgICAgaSsrXG5cblxuICAgICAgdXBkYXRlOigpLT5cblxuICAgICAgICBtb3VzZSA9IEBtb3VzZVxuXG4gICAgICAgIG1vdXNlLnggPSBAd2lkdGggLyAyIGlmIG1vdXNlLnggaXMgMFxuICAgICAgICBtb3VzZS55ID0gQGhlaWdodCAvIDIgaWYgbW91c2UueSBpcyAwXG5cbiAgICAgICAgZm9yIGIsIGkgaW4gcy5iYWxsc1xuXG4gICAgICAgICAgYW5nID0gQ2FsYy5hbmcgYi54LCBiLnksIG1vdXNlLngsIG1vdXNlLnlcbiAgICAgICAgICByYWQgPSBDYWxjLmRlZzJyYWQgYW5nXG4gICAgICAgICAgZGlzdCA9IENhbGMuZGlzdCBiLngsIGIueSwgbW91c2UueCwgbW91c2UueVxuXG4gICAgICAgICAgZnggPSAoTWF0aC5jb3MgcmFkKSAqIDEwXG4gICAgICAgICAgZnkgPSAoTWF0aC5zaW4gcmFkKSAqIDEwXG5cbiAgICAgICAgICBpZiBzLmRvd25cbiAgICAgICAgICAgIGZ4ICo9IC0xXG4gICAgICAgICAgICBmeSAqPSAtMVxuXG4gICAgICAgICAgZWxzZSBpZiBkaXN0IDwgNTBcbiAgICAgICAgICAgIGZ4ICo9IC0xXG4gICAgICAgICAgICBmeCAqPSAxMFxuICAgICAgICAgICAgZnkgKj0gLTFcbiAgICAgICAgICAgIGZ5ICo9IDVcblxuICAgICAgICAgIGlmIE1hdGguYWJzKGIudngpID4gNTBcbiAgICAgICAgICAgIGIudnggKj0gMC45XG4gICAgICAgICAgaWYgTWF0aC5hYnMoYi52eSkgPiA1MFxuICAgICAgICAgICAgYi52eSAqPSAwLjlcblxuICAgICAgICAgIGIuYXBwbHlfZm9yY2UgZngsIGZ5XG5cbiAgICAgICAgICBiLnVwZGF0ZSgpXG5cblxuICAgICAgZHJhdzooKS0+XG4gICAgICAgIERyYXcuQ1RYLmZpbGxTdHlsZSA9IFwicmdiYSgwLDAsMCwwLjA4KVwiXG4gICAgICAgIERyYXcuQ1RYLmZpbGxSZWN0KDAsIDAsIEB3aWR0aCwgQGhlaWdodClcblxuICAgICAgICBmb3IgYiwgaSBpbiBzLmJhbGxzXG5cbiAgICAgICAgICBiLmRyYXcoKVxuXG4gICAgICBtb3VzZWRvd246LT5cbiAgICAgICAgcy5kb3duID0gdHJ1ZVxuXG4gICAgICBtb3VzZXVwOi0+XG4gICAgICAgIHMuZG93biA9IGZhbHNlXG5cbiJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLGtDQUFBO0dBQUE7O2tTQUFBOztBQUFBLENBQUEsRUFBVSxJQUFWLGFBQVU7O0FBQ1YsQ0FEQSxFQUNPLENBQVAsR0FBTyxJQUFBOztBQUNQLENBRkEsRUFFTyxDQUFQLEdBQU8sU0FBQTs7QUFDUCxDQUhBLEVBR08sQ0FBUCxHQUFPLENBQUE7O0FBRVAsQ0FMQSxFQUt1QixHQUFqQixDQUFOO0NBRUUsS0FBQSxHQUFBOztDQUFBOzs7Ozs7O0NBQUE7O0NBQUEsQ0FBQSxDQUFZLE1BQVo7O0NBQUEsRUFFTSxDQUFOOztDQUZBLEVBR1EsQ0FIUixFQUdBOztDQUhBLENBQUEsQ0FLTyxFQUFQOztDQUxBLEVBTVEsQ0FOUixFQU1BOztDQU5BLEVBUVEsSUFBUixFQUFRO0NBQ04sRUFBSSxDQUFKLENBQUE7Q0FBQSxFQUNJLENBQUosR0FBQTtDQUZNLFFBR04sRUFBQSx5QkFBQTtDQVhGLEVBUVE7O0NBUlIsRUFhYSxNQUFBLEdBQWI7Q0FFRSxLQUFBLEVBQUE7Q0FBQSxFQUFJLENBQUo7Q0FBQSxDQUFBLENBQ0EsQ0FBQTtDQURBLENBQUEsQ0FFUyxDQUFULENBQUE7Q0FFQSxFQUFBLENBQUE7Q0FDRSxFQUFJLENBQUgsQ0FBRCxDQUFBO0NBQUEsRUFDSSxDQUFILEVBQUQsQ0FBQTtNQU5GO0NBUUMsRUFBRCxDQUFDLEVBQVksS0FBYjtDQUVFLENBQVcsQ0FBQSxDQUFDLEVBQVosR0FBQTtDQUFBLENBQ1csR0FEWCxDQUNBLEdBQUE7Q0FEQSxDQUdNLENBQUEsRUFBTixDQUFBLEdBQU07Q0FFSixXQUFBLGFBQUE7Q0FBQSxFQUFBLENBQUksSUFBSixDQUFXLENBQUE7Q0FBWCxFQUVRLENBQUosSUFBSixDQUFBLE1BRkE7Q0FBQSxDQUdxQixDQUFiLENBQUosQ0FBSixDQUFBLEVBQUE7Q0FIQSxFQUtJLEtBQUo7Q0FFQTtDQUFNLEVBQUksTUFBVixPQUFNO0NBRUosRUFBUyxHQUFULElBQUE7Q0FBQSxDQUN3QixDQUFiLENBQVgsRUFBVyxJQUFYO0NBREEsRUFFYSxDQUFULENBQUosS0FBQTtBQUMwQixDQUgxQixFQUdTLENBQUwsQ0FBTSxDQUFpQixJQUEzQjtBQUMyQixDQUozQixFQUlTLENBQUwsRUFBTSxJQUFWO0NBSkEsRUFLUyxDQUFMLEVBQUssSUFBVDtDQUxBLEdBTUEsQ0FBTyxLQUFQO0FBQ0EsQ0FQQTtDQUZGLFFBQUE7eUJBVEk7Q0FITixNQUdNO0NBSE4sQ0F3Qk8sQ0FBQSxHQUFQLEdBQU87Q0FFTCxXQUFBLGtEQUFBO0NBQUEsRUFBUSxDQUFDLENBQVQsR0FBQTtDQUVBLEdBQXdCLENBQUssR0FBN0I7Q0FBQSxFQUFVLENBQUMsQ0FBTixLQUFMO1VBRkE7Q0FHQSxHQUF5QixDQUFLLEdBQTlCO0NBQUEsRUFBVSxDQUFDLENBQU4sQ0FBSyxJQUFWO1VBSEE7Q0FLQTtDQUFBO2NBQUEsc0NBQUE7d0JBQUE7Q0FFRSxDQUFvQixDQUFwQixDQUFVLENBQW9CLEtBQTlCO0NBQUEsRUFDQSxDQUFVLEdBQUosR0FBTjtDQURBLENBRXNCLENBQWYsQ0FBUCxDQUFnQyxLQUFoQztDQUZBLENBSUEsQ0FBSyxDQUFLLE1BQVY7Q0FKQSxDQUtBLENBQUssQ0FBSyxNQUFWO0NBRUEsR0FBRyxNQUFIO0FBQ1MsQ0FBUCxDQUFBLEVBQU0sUUFBTjtBQUNPLENBRFAsQ0FDQSxFQUFNLFFBQU47RUFGRixDQUllLENBQVAsRUFKUixNQUFBO0FBS1MsQ0FBUCxDQUFBLEVBQU0sUUFBTjtDQUFBLENBQ0EsRUFBTSxRQUFOO0FBQ08sQ0FGUCxDQUVBLEVBQU0sUUFBTjtDQUZBLENBR0EsRUFBTSxRQUFOO1lBZkY7Q0FpQkEsQ0FBRyxDQUFBLENBQUEsTUFBSDtDQUNFLENBQUEsQ0FBQSxDQUFRLFFBQVI7WUFsQkY7Q0FtQkEsQ0FBRyxDQUFBLENBQUEsTUFBSDtDQUNFLENBQUEsQ0FBQSxDQUFRLFFBQVI7WUFwQkY7Q0FBQSxDQXNCQSxRQUFBLENBQUE7Q0F0QkEsS0F3QkE7Q0ExQkY7eUJBUEs7Q0F4QlAsTUF3Qk87Q0F4QlAsQ0E0REssQ0FBQSxDQUFMLEVBQUEsR0FBSztDQUNILFdBQUEsbUJBQUE7Q0FBQSxFQUFRLENBQUosSUFBSixDQUFBLFNBQUE7Q0FBQSxDQUNxQixDQUFiLENBQUosQ0FBSixDQUFBLEVBQUE7Q0FFQTtDQUFBO2NBQUEsc0NBQUE7d0JBQUE7Q0FFRSxHQUFBO0NBRkY7eUJBSkc7Q0E1REwsTUE0REs7Q0E1REwsQ0FvRVUsQ0FBQSxHQUFWLEdBQUE7Q0FDRyxFQUFRLENBQVQsV0FBQTtDQXJFRixNQW9FVTtDQXBFVixDQXVFUSxDQUFBLEdBQVIsQ0FBQSxFQUFRO0NBQ0wsRUFBUSxDQUFULFdBQUE7Q0F4RUYsTUF1RVE7Q0FuRkMsS0FVSjtDQXZCVCxFQWFhOztDQWJiOztDQUZtQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjEyNDIsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL3ZpZXdzL2hvbGUvaW5kZXguY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIkFwcFZpZXcgPSByZXF1aXJlICdhcHAvdmlld3MvYXBwX3ZpZXcnXG5TeXN0ZW0gPSByZXF1aXJlIFwiLi9zeXN0ZW1cIlxuRHJhdyA9IHJlcXVpcmUgXCJkcmF3L2RyYXdcIlxuUGl2b3QgPSByZXF1aXJlIFwiLi9waXZvdFwiXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSW5kZXggZXh0ZW5kcyBBcHBWaWV3XG5cbiAgZGVzdHJveTo9PlxuICAgIEBjdHguY2xlYXIoKVxuICAgIEBjdHguZGVzdHJveSgpXG4gICAgc3VwZXJcblxuICBhZnRlcl9yZW5kZXI6PT5cblxuICAgIEBjdHggPSB3aW5kb3cuU2tldGNoLmNyZWF0ZVxuXG4gICAgICBzeXN0ZW1zOiBbXVxuICAgICAgc3lzdGVtOiB7fVxuICAgICAgcGl2b3Q6IHt9XG5cbiAgICAgIGNvbnRhaW5lcjpAZWwuZ2V0KDApXG5cbiAgICAgIGF1dG9jbGVhcjp0cnVlXG5cbiAgICAgIHNldHVwOi0+XG5cbiAgICAgICAgRHJhdy5DVFggPSAkKFwiLnNrZXRjaFwiKS5nZXQoMCkuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgICAgIHRhcmdldCA9ICh4OkB3aWR0aCAvIDIsIHk6QGhlaWdodCAvIDIpXG4gICAgICAgIEBwaXZvdCA9IG5ldyBQaXZvdCB0YXJnZXRcbiAgICAgICAgQGNvdW50ID0gMjBcblxuICAgICAgbW91c2Vtb3ZlOi0+XG4gICAgICAgIEBwaXZvdC50YXJnZXQgPSBAbW91c2VcblxuICAgICAgdXBkYXRlOi0+XG5cbiAgICAgICAgQHBpdm90LnVwZGF0ZSgpXG5cbiAgICAgICAgaWYgQHN5c3RlbXMubGVuZ3RoIDwgMzBcblxuICAgICAgICAgIGkgPSBAc3lzdGVtcy5sZW5ndGhcblxuICAgICAgICAgIHAgPSBAcGl2b3RcblxuICAgICAgICAgIGlmIEBzeXN0ZW1zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHAgPSBAc3lzdGVtc1tpIC0gMV0ucGl2b3RcbiAgICAgICAgICAgIHNwZWVkID0gcC5zcGVlZFxuXG4gICAgICAgICAgcyA9IG5ldyBTeXN0ZW0geDpAcGl2b3QueCwgeTpAcGl2b3QueSwgZm9sbG93czpwLCByYWQ6IEBjb3VudFxuICAgICAgICAgIHMubWFnICs9IDAuNVxuICAgICAgICAgIHMuc2V0dXAoKVxuICAgICAgICAgIEBzeXN0ZW1zLnB1c2ggc1xuICAgICAgICAgIEBjb3VudCArPSAxMFxuXG4gICAgICBkcmF3Oi0+XG5cbiAgICAgICAgQHBpdm90LmRyYXcoKVxuXG4gICAgICAgIGkgPSBAc3lzdGVtcy5sZW5ndGggLSAxXG5cbiAgICAgICAgd2hpbGUgaSA+PSAwXG5cbiAgICAgICAgICBzID0gQHN5c3RlbXNbaV1cblxuICAgICAgICAgIHMucnVuKClcblxuICAgICAgICAgIGktLVxuXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxxQ0FBQTtHQUFBOztrU0FBQTs7QUFBQSxDQUFBLEVBQVUsSUFBVixhQUFVOztBQUNWLENBREEsRUFDUyxHQUFULENBQVMsR0FBQTs7QUFDVCxDQUZBLEVBRU8sQ0FBUCxHQUFPLElBQUE7O0FBQ1AsQ0FIQSxFQUdRLEVBQVIsRUFBUSxFQUFBOztBQUVSLENBTEEsRUFLdUIsR0FBakIsQ0FBTjtDQUVFOzs7Ozs7O0NBQUE7O0NBQUEsRUFBUSxJQUFSLEVBQVE7Q0FDTixFQUFJLENBQUosQ0FBQTtDQUFBLEVBQ0ksQ0FBSixHQUFBO0NBRk0sUUFHTixFQUFBLHlCQUFBO0NBSEYsRUFBUTs7Q0FBUixFQUthLE1BQUEsR0FBYjtDQUVHLEVBQUQsQ0FBQyxFQUFZLEtBQWI7Q0FFRSxDQUFTLElBQVQsQ0FBQTtDQUFBLENBQ1EsSUFBUjtDQURBLENBRU8sR0FBUCxDQUFBO0NBRkEsQ0FJVSxDQUFBLENBQUMsRUFBWCxHQUFBO0NBSkEsQ0FNVSxFQU5WLEVBTUEsR0FBQTtDQU5BLENBUU0sQ0FBQSxFQUFOLENBQUEsR0FBTTtDQUVKLEtBQUEsTUFBQTtDQUFBLEVBQUEsQ0FBSSxJQUFKLENBQVcsQ0FBQTtDQUFYLEVBQ1UsR0FBVixFQUFBO0NBQVUsQ0FBRSxDQUFTLENBQVIsQ0FBRCxLQUFGO0NBQUEsQ0FBZ0IsQ0FBVSxDQUFULEVBQUQsSUFBRjtDQUR4QixTQUFBO0NBQUEsRUFFYSxDQUFaLENBQUQsQ0FBYSxFQUFiO0NBQ0MsRUFBUSxDQUFSLENBQUQsVUFBQTtDQWJGLE1BUU07Q0FSTixDQWVVLENBQUEsR0FBVixHQUFBO0NBQ0csRUFBZSxDQUFmLENBQUssQ0FBTixTQUFBO0NBaEJGLE1BZVU7Q0FmVixDQWtCTyxDQUFBLEdBQVAsR0FBTztDQUVMLFdBQUEsRUFBQTtDQUFBLEdBQUMsQ0FBSyxDQUFOLEVBQUE7Q0FFQSxDQUFBLENBQXFCLENBQWxCLEVBQUEsQ0FBUSxDQUFYO0NBRUUsRUFBSSxDQUFDLEVBQUwsQ0FBWSxHQUFaO0NBQUEsRUFFSSxDQUFDLENBRkwsS0FFQTtDQUVBLEVBQXFCLENBQWxCLEVBQUEsQ0FBUSxHQUFYO0NBQ0UsRUFBSSxDQUFDLENBQUwsRUFBYSxLQUFiO0NBQUEsRUFDUSxFQUFSLE9BQUE7WUFORjtDQUFBLEVBUVEsQ0FBQSxFQUFBLElBQVI7Q0FBZSxDQUFFLEVBQUMsQ0FBSyxPQUFSO0NBQUEsQ0FBYyxFQUFDLENBQUssT0FBUjtDQUFaLENBQWdDLEtBQVIsS0FBQTtDQUF4QixDQUF3QyxDQUFMLENBQU0sQ0FBekMsT0FBbUM7Q0FSbEQsV0FRUTtDQVJSLEVBU0EsQ0FBUyxNQUFUO0NBVEEsSUFVQSxLQUFBO0NBVkEsR0FXQyxHQUFPLEdBQVI7Q0FDQyxHQUFBLENBQUQsWUFBQTtVQWxCRztDQWxCUCxNQWtCTztDQWxCUCxDQXNDSyxDQUFBLENBQUwsRUFBQSxHQUFLO0NBRUgsV0FBQSxFQUFBO0NBQUEsR0FBQyxDQUFLLEdBQU47Q0FBQSxFQUVJLENBQUMsRUFBRCxDQUFRLENBQVo7Q0FFQTtDQUFNLEVBQU4sQ0FBVyxZQUFMO0NBRUosRUFBSSxDQUFDLEdBQVEsR0FBYjtDQUFBLEVBRUEsT0FBQTtBQUVBLENBSkE7Q0FGRixRQUFBO3lCQU5HO0NBdENMLE1Bc0NLO0NBMUNJLEtBRUo7Q0FQVCxFQUthOztDQUxiOztDQUZtQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjEzMzQsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL3ZpZXdzL2hvbGUvcGFydGljbGUuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIkNpcmNsZSA9IHJlcXVpcmUgXCJkcmF3L2dlb20vY2lyY2xlXCJcbkRyYXcgPSByZXF1aXJlIFwiZHJhdy9kcmF3XCJcbkNhbGMgPSByZXF1aXJlIFwiZHJhdy9tYXRoL2NhbGNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcnRpY2xlIGV4dGVuZHMgQ2lyY2xlXG5cbiAgZHg6IDAgIyBYIGRpcmVjdGlvblxuICBkeTogMCAjIFkgZGlyZWN0aW9uXG5cbiAgbWFnOiAxXG4gIGRpc3Q6IDBcbiAgcGl2b3Q6IHt9XG5cbiAgY29uc3RydWN0b3I6KEBwaXZvdCwgQGR4LCBAZHkpLT5cblxuICAgIHN1cGVyIDEsIFwiI2ZmZlwiXG5cbiAgdXBkYXRlOi0+XG5cbiAgICBAb2xkX3ggPSBAeFxuICAgIEBvbGRfeSA9IEB5XG5cbiAgICB2eCA9IEBwaXZvdC54ICsgQGR4XG4gICAgdnkgPSBAcGl2b3QueSArIEBkeVxuXG4gICAgQHggPSB2eFxuICAgIEB5ID0gdnlcblxuICAgIGlmIE1hdGguYWJzKEB4IC0gQG9sZF94KSA+IDFcbiAgICAgIEBvcGFjaXR5ID0gMC45XG5cbiAgICBAZGlzdCA9IENhbGMuZGlzdCBAcGl2b3QueCwgQHBpdm90LnksIEB4LCBAeVxuXG4gICAgQHJhZGl1cyA9IEBkaXN0IC8gMTAwICogQG1hZ1xuICAgIEBvcGFjaXR5ID0gMSAtIChAZGlzdCAvIDEwMCAvIDMuMilcblxuICAgIGlmIEBvcGFjaXR5IDwgMFxuICAgICAgQG9wYWNpdHkgPSAwXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSx3QkFBQTtHQUFBO2tTQUFBOztBQUFBLENBQUEsRUFBUyxHQUFULENBQVMsV0FBQTs7QUFDVCxDQURBLEVBQ08sQ0FBUCxHQUFPLElBQUE7O0FBQ1AsQ0FGQSxFQUVPLENBQVAsR0FBTyxTQUFBOztBQUVQLENBSkEsRUFJdUIsR0FBakIsQ0FBTjtDQUVFOztDQUFBLENBQUEsQ0FBSTs7Q0FBSixDQUNBLENBQUk7O0NBREosRUFHQTs7Q0FIQSxFQUlNLENBQU47O0NBSkEsQ0FBQSxDQUtPLEVBQVA7O0NBRVksQ0FBQSxDQUFBLEVBQUEsYUFBRTtDQUVaLEVBRlksQ0FBRCxDQUVYO0NBQUEsQ0FBQSxDQUZvQixDQUFEO0NBRW5CLENBQUEsQ0FGeUIsQ0FBRDtDQUV4QixDQUFTLEVBQVQsRUFBQSxvQ0FBTTtDQVRSLEVBT1k7O0NBUFosRUFXTyxHQUFQLEdBQU87Q0FFTCxLQUFBLEVBQUE7Q0FBQSxFQUFTLENBQVQsQ0FBQTtDQUFBLEVBQ1MsQ0FBVCxDQUFBO0NBREEsQ0FHQSxDQUFLLENBQUwsQ0FBVztDQUhYLENBSUEsQ0FBSyxDQUFMLENBQVc7Q0FKWCxDQUFBLENBTUssQ0FBTDtDQU5BLENBQUEsQ0FPSyxDQUFMO0NBRUEsRUFBRyxDQUFILENBQUc7Q0FDRCxFQUFXLENBQVYsRUFBRCxDQUFBO01BVkY7Q0FBQSxDQVk0QixDQUFwQixDQUFSLENBQXdCO0NBWnhCLEVBY1UsQ0FBVixFQUFBO0NBZEEsRUFlVyxDQUFYLEdBQUE7Q0FFQSxFQUFjLENBQWQsR0FBRztDQUNBLEVBQVUsQ0FBVixHQUFELE1BQUE7TUFwQkc7Q0FYUCxFQVdPOztDQVhQOztDQUZzQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjEzODksCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL3ZpZXdzL2hvbGUvcGl2b3QuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIkNpcmNsZSA9IHJlcXVpcmUgXCJkcmF3L2dlb20vY2lyY2xlXCJcbkRyYXcgPSByZXF1aXJlIFwiZHJhdy9kcmF3XCJcbkNhbGMgPSByZXF1aXJlIFwiZHJhdy9tYXRoL2NhbGNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBpdm90IGV4dGVuZHMgQ2lyY2xlXG5cbiAgdng6IDBcbiAgdnk6IDBcbiAgYXg6IDBcbiAgYXk6IDBcbiAgc3ByaW5nOiAwLjhcbiAgdGFyZ2V0OiB7fVxuICBhbmdsZTogMFxuICByb3RhdGU6IHRydWVcbiAgc3BlZWQ6IDAuMVxuXG4gIGNvbnN0cnVjdG9yOihAdGFyZ2V0KS0+XG5cbiAgICBzdXBlciAwLCBcIiNGRjAwMDBcIlxuICAgIEB4ID0gQHRhcmdldC54XG4gICAgQHkgPSBAdGFyZ2V0LnlcblxuICB1cGRhdGU6LT5cblxuICAgIGlmIEBzcGVlZCA8IDBcbiAgICAgIEBzcGVlZCA9IDAuMDFcblxuICAgIEBheCA9IEB0YXJnZXQueCAtIEB4XG4gICAgQGF5ID0gQHRhcmdldC55IC0gQHlcblxuICAgIGlmIEBheCA8IDUwIG9yIEBheSA8IDUwXG5cbiAgICAgIGlmIEByb3RhdGVcblxuICAgICAgICByYWQgPSBDYWxjLmRlZzJyYWQgQGFuZ2xlXG4gIFxuICAgICAgICBAYXggKz0gKE1hdGguY29zIHJhZCkgKiAzMFxuICAgICAgICBAYXkgKz0gKE1hdGguc2luIHJhZCkgKiAzMFxuICBcbiAgICAgICAgQGFuZ2xlICs9IDVcblxuXG4gICAgQHZ4ICs9IEBheCAqIEBzcGVlZFxuICAgIEB2eSArPSBAYXkgKiBAc3BlZWRcblxuICAgIEB2eCAqPSBAc3ByaW5nXG4gICAgQHZ5ICo9IEBzcHJpbmdcblxuICAgIEB4ICs9IEB2eFxuICAgIEB5ICs9IEB2eSJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLHFCQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFTLEdBQVQsQ0FBUyxXQUFBOztBQUNULENBREEsRUFDTyxDQUFQLEdBQU8sSUFBQTs7QUFDUCxDQUZBLEVBRU8sQ0FBUCxHQUFPLFNBQUE7O0FBRVAsQ0FKQSxFQUl1QixHQUFqQixDQUFOO0NBRUU7O0NBQUEsQ0FBQSxDQUFJOztDQUFKLENBQ0EsQ0FBSTs7Q0FESixDQUVBLENBQUk7O0NBRkosQ0FHQSxDQUFJOztDQUhKLEVBSVEsR0FBUjs7Q0FKQSxDQUFBLENBS1EsR0FBUjs7Q0FMQSxFQU1PLEVBQVA7O0NBTkEsRUFPUSxDQVBSLEVBT0E7O0NBUEEsRUFRTyxFQUFQOztDQUVZLENBQUEsQ0FBQSxHQUFBLFNBQUU7Q0FFWixFQUZZLENBQUQsRUFFWDtDQUFBLENBQVMsRUFBVCxLQUFBLDhCQUFNO0NBQU4sRUFDSyxDQUFMLEVBQVk7Q0FEWixFQUVLLENBQUwsRUFBWTtDQWRkLEVBVVk7O0NBVlosRUFnQk8sR0FBUCxHQUFPO0NBRUwsRUFBQSxLQUFBO0NBQUEsRUFBWSxDQUFaLENBQUc7Q0FDRCxFQUFTLENBQVIsQ0FBRCxDQUFBO01BREY7Q0FBQSxDQUdBLENBQU0sQ0FBTixFQUFhO0NBSGIsQ0FJQSxDQUFNLENBQU4sRUFBYTtDQUViLENBQUcsQ0FBTSxDQUFUO0NBRUUsR0FBRyxFQUFIO0NBRUUsRUFBQSxDQUFVLENBQUosRUFBQSxDQUFOO0NBQUEsQ0FFQSxDQUFRLENBQVAsSUFBRDtDQUZBLENBR0EsQ0FBUSxDQUFQLElBQUQ7Q0FIQSxHQUtDLENBQUQsR0FBQTtRQVRKO01BTkE7Q0FBQSxDQWtCQSxDQUFhLENBQWIsQ0FsQkE7Q0FBQSxDQW1CQSxDQUFhLENBQWIsQ0FuQkE7Q0FBQSxDQXFCQSxFQUFBLEVBckJBO0NBQUEsQ0FzQkEsRUFBQSxFQXRCQTtDQUFBLENBQUEsRUF3QkE7Q0FDQyxHQUFBLE9BQUQ7Q0EzQ0YsRUFnQk87O0NBaEJQOztDQUZtQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjE0NTYsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL3ZpZXdzL2hvbGUvc3lzdGVtLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJQYXJ0aWNsZSA9IHJlcXVpcmUgXCIuL3BhcnRpY2xlXCJcbkNhbGMgPSByZXF1aXJlIFwiZHJhdy9tYXRoL2NhbGNcIlxuRHJhdyA9IHJlcXVpcmUgXCJkcmF3L2RyYXdcIlxuUGl2b3QgPSByZXF1aXJlIFwiLi9waXZvdFwiXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3lzdGVtXG5cbiAgTlVNX1BBUlRJQ0xFUzogNTBcbiAgcGFydGljbGVzOiBbXVxuICBhbmdsZV9zdGVwOiAwXG4gIGFuZ2xlOiAwXG5cbiAgb3JpZ2luOiB7fVxuICBwaXZvdDoge31cbiAgbWFnOiAxXG5cbiAgY29uc3RydWN0b3I6KEBvcmlnaW4pLT5cblxuICAgIEBhbmdsZV9zdGVwID0gMzYwIC8gQE5VTV9QQVJUSUNMRVNcbiAgICBAbW91c2UgPSBAb3JpZ2luLm1vdXNlXG4gICAgQHBpdm90ID0gbmV3IFBpdm90IEBvcmlnaW4uZm9sbG93c1xuICAgIEBwaXZvdC5zcHJpbmcgPSAwLjNcbiAgICBAcGl2b3Qucm90YXRlID0gZmFsc2VcbiAgICBAcGl2b3Quc3BlZWQgPSAwLjdcblxuICBzZXR1cDotPlxuICAgIEBfY3JlYXRlX3BhcnRpY2xlcygpXG5cbiAgcnVuOi0+XG5cbiAgICBAcGl2b3QudXBkYXRlKClcbiAgICBAcGl2b3QuZHJhdygpXG5cbiAgICBpID0gQHBhcnRpY2xlcy5sZW5ndGggLSAxXG5cbiAgICB3aGlsZSBpID49IDBcblxuICAgICAgcCA9IEBwYXJ0aWNsZXNbaV1cblxuICAgICAgcC51cGRhdGUoKVxuXG4gICAgICBwLmRyYXcoKVxuXG4gICAgICBpLS1cblxuICBfY3JlYXRlX3BhcnRpY2xlczotPlxuXG4gICAgQHBhcnRpY2xlcyA9IFtdXG5cbiAgICBmeCA9IDBcbiAgICBmeSA9IDBcblxuICAgIGkgPSAwXG5cbiAgICB3aGlsZSBpIDwgQE5VTV9QQVJUSUNMRVNcblxuICAgICAgQGFuZ2xlICs9IEBhbmdsZV9zdGVwXG5cbiAgICAgIHJhZCA9IENhbGMuZGVnMnJhZCBAYW5nbGVcblxuICAgICAgbWFnID0gQG9yaWdpbi5yYWRcblxuICAgICAgZnggPSAoTWF0aC5jb3MgcmFkKSAqIG1hZ1xuICAgICAgZnkgPSAoTWF0aC5zaW4gcmFkKSAqIG1hZ1xuXG4gICAgICBwID0gbmV3IFBhcnRpY2xlIEBwaXZvdCwgZngsIGZ5XG4gICAgICBwLm1hZyA9IEBtYWdcblxuICAgICAgQHBhcnRpY2xlcy5wdXNoIHBcblxuICAgICAgaSsrXG5cblxuXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSwrQkFBQTs7QUFBQSxDQUFBLEVBQVcsSUFBQSxDQUFYLElBQVc7O0FBQ1gsQ0FEQSxFQUNPLENBQVAsR0FBTyxTQUFBOztBQUNQLENBRkEsRUFFTyxDQUFQLEdBQU8sSUFBQTs7QUFDUCxDQUhBLEVBR1EsRUFBUixFQUFRLEVBQUE7O0FBRVIsQ0FMQSxFQUt1QixHQUFqQixDQUFOO0NBRUUsQ0FBQSxDQUFlLFVBQWY7O0NBQUEsQ0FBQSxDQUNXLE1BQVg7O0NBREEsRUFFWSxPQUFaOztDQUZBLEVBR08sRUFBUDs7Q0FIQSxDQUFBLENBS1EsR0FBUjs7Q0FMQSxDQUFBLENBTU8sRUFBUDs7Q0FOQSxFQU9BOztDQUVZLENBQUEsQ0FBQSxHQUFBLFVBQUU7Q0FFWixFQUZZLENBQUQsRUFFWDtDQUFBLEVBQWMsQ0FBZCxNQUFBLEdBQUE7Q0FBQSxFQUNTLENBQVQsQ0FBQSxDQUFnQjtDQURoQixFQUVhLENBQWIsQ0FBQSxDQUEwQixDQUFiO0NBRmIsRUFHZ0IsQ0FBaEIsQ0FBTSxDQUFOO0NBSEEsRUFJZ0IsQ0FBaEIsQ0FBTSxDQUFOO0NBSkEsRUFLZSxDQUFmLENBQU07Q0FoQlIsRUFTWTs7Q0FUWixFQWtCTSxFQUFOLElBQU07Q0FDSCxHQUFBLE9BQUQsTUFBQTtDQW5CRixFQWtCTTs7Q0FsQk4sRUFxQkEsTUFBSTtDQUVGLE9BQUEsTUFBQTtDQUFBLEdBQUEsQ0FBTSxDQUFOO0NBQUEsR0FDQSxDQUFNO0NBRE4sRUFHSSxDQUFKLEVBQUksR0FBVTtDQUVkO0NBQU0sRUFBTixDQUFXLFFBQUw7Q0FFSixFQUFJLENBQUMsRUFBTCxHQUFlO0NBQWYsS0FFQTtDQUZBLEdBSUEsRUFBQTtBQUVBLENBTkE7Q0FGRixJQUFBO3FCQVBFO0NBckJKLEVBcUJJOztDQXJCSixFQXNDa0IsTUFBQSxRQUFsQjtDQUVFLE9BQUEsd0JBQUE7Q0FBQSxDQUFBLENBQWEsQ0FBYixLQUFBO0NBQUEsQ0FFQSxDQUFLLENBQUw7Q0FGQSxDQUdBLENBQUssQ0FBTDtDQUhBLEVBS0ksQ0FBSjtDQUVBO0NBQU0sRUFBSSxDQUFDLFFBQUwsQ0FBTjtDQUVFLEdBQUMsQ0FBRCxDQUFBLElBQUE7Q0FBQSxFQUVBLENBQVUsQ0FBSixDQUFOLENBQU07Q0FGTixFQUlBLENBQU8sRUFBUDtDQUpBLENBTUEsQ0FBSyxDQUFLLEVBQVY7Q0FOQSxDQU9BLENBQUssQ0FBSyxFQUFWO0NBUEEsQ0FTeUIsQ0FBakIsQ0FBQSxDQUFBLENBQVIsRUFBUTtDQVRSLEVBVUEsQ0FBUyxFQUFUO0NBVkEsR0FZQyxFQUFELEdBQVU7QUFFVixDQWRBO0NBRkYsSUFBQTtxQkFUZ0I7Q0F0Q2xCLEVBc0NrQjs7Q0F0Q2xCOztDQVBGIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6MTUzNywKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvdmlld3MvbWFnbmV0cy9iYWxsLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJDaXJjbGUgPSByZXF1aXJlIFwiZHJhdy9nZW9tL2NpcmNsZVwiXG5EcmF3ID0gcmVxdWlyZSBcImRyYXcvZHJhd1wiXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQmFsbCBleHRlbmRzIENpcmNsZVxuXG4gIHg6IDBcbiAgeTogMFxuICBtYXNzOiAwXG4gIHZ4OiAwXG4gIHZ5OiAwXG4gIGF4OiAwXG4gIGF5OiAwXG4gIHNwZWVkOiAxXG4gIGNvbGxpZGVkOiBmYWxzZVxuXG4gIGNvbnN0cnVjdG9yOi0+XG4gICAgc3VwZXJcbiAgICBAbWFzcyA9IEByYWRpdXNcblxuICBhcHBseV9mb3JjZTooZngsIGZ5KS0+XG5cbiAgICBAYXggKz0gZnhcbiAgICBAYXkgKz0gZnlcblxuICB1cGRhdGU6LT5cblxuICAgIEB2eCArPSBAYXhcbiAgICBAdnkgKz0gQGF5XG5cbiAgICBpZiBAdnggPiAyLjRcbiAgICAgIEB2eCA9IDIuNFxuXG4gICAgaWYgQHZ5ID4gMi40XG4gICAgICBAdnkgPSAyLjRcblxuXG4gICAgQGF4ID0gMFxuICAgIEBheSA9IDBcblxuICBkcmF3Oi0+XG5cbiAgICBAeCArPSBAdnggKiBAc3BlZWRcbiAgICBAeSArPSBAdnkgKiBAc3BlZWRcblxuICAgIHN1cGVyXG5cbiAgICBAY3R4LmZpbGxTdHlsZSA9IFwiI0ZGRlwiXG4gICAgQGN0eC5iZWdpblBhdGgoKVxuICAgIEBjdHguYXJjIEB4LCBAeSwgQHJhZGl1cyAvIDEwLCAwLCBNYXRoLlBJKjIsdHJ1ZVxuICAgIEBjdHguY2xvc2VQYXRoKClcbiAgICBAY3R4LmZpbGwoKVxuICAgICJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLGNBQUE7R0FBQTtrU0FBQTs7QUFBQSxDQUFBLEVBQVMsR0FBVCxDQUFTLFdBQUE7O0FBQ1QsQ0FEQSxFQUNPLENBQVAsR0FBTyxJQUFBOztBQUVQLENBSEEsRUFHdUIsR0FBakIsQ0FBTjtDQUVFOztDQUFBLEVBQUc7O0NBQUgsRUFDRzs7Q0FESCxFQUVNLENBQU47O0NBRkEsQ0FHQSxDQUFJOztDQUhKLENBSUEsQ0FBSTs7Q0FKSixDQUtBLENBQUk7O0NBTEosQ0FNQSxDQUFJOztDQU5KLEVBT08sRUFBUDs7Q0FQQSxFQVFVLEVBUlYsR0FRQTs7Q0FFWSxDQUFBLENBQUEsV0FBQTtDQUNWLEdBQUEsS0FBQSw4QkFBQTtDQUFBLEVBQ1EsQ0FBUixFQURBO0NBWEYsRUFVWTs7Q0FWWixDQWNZLENBQUEsTUFBQyxFQUFiO0NBRUUsQ0FBQSxFQUFBO0NBQ0MsQ0FBRCxFQUFDLE9BQUQ7Q0FqQkYsRUFjWTs7Q0FkWixFQW1CTyxHQUFQLEdBQU87Q0FFTCxDQUFBLEVBQUE7Q0FBQSxDQUNBLEVBQUE7Q0FFQSxDQUFHLENBQU0sQ0FBVDtDQUNFLENBQUEsQ0FBTSxDQUFMLEVBQUQ7TUFKRjtDQU1BLENBQUcsQ0FBTSxDQUFUO0NBQ0UsQ0FBQSxDQUFNLENBQUwsRUFBRDtNQVBGO0NBQUEsQ0FVQSxDQUFNLENBQU47Q0FDQyxDQUFELENBQU0sQ0FBTCxPQUFEO0NBaENGLEVBbUJPOztDQW5CUCxFQWtDSyxDQUFMLEtBQUs7Q0FFSCxDQUFNLENBQU0sQ0FBWixDQUFBO0NBQUEsQ0FDTSxDQUFNLENBQVosQ0FEQTtDQUFBLEdBR0EsS0FBQSx1QkFBQTtDQUhBLEVBS0ksQ0FBSixFQUxBLEdBS0E7Q0FMQSxFQU1JLENBQUosS0FBQTtDQU5BLENBT2EsQ0FBVCxDQUFKLEVBQWlCO0NBUGpCLEVBUUksQ0FBSixLQUFBO0NBQ0MsRUFBRyxDQUFILE9BQUQ7Q0E3Q0YsRUFrQ0s7O0NBbENMOztDQUZrQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjE2MDYsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL3ZpZXdzL21hZ25ldHMvaW5kZXguY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIkFwcFZpZXcgPSByZXF1aXJlICdhcHAvdmlld3MvYXBwX3ZpZXcnXG5CYWxsID0gcmVxdWlyZSBcIi4vYmFsbFwiXG5NYWduZXQgPSByZXF1aXJlIFwiLi9tYWduZXRcIlxuVGFyZ2V0ID0gcmVxdWlyZSBcIi4vdGFyZ2V0XCJcbkRyYXcgPSByZXF1aXJlIFwiZHJhdy9kcmF3XCJcbkNhbGMgPSByZXF1aXJlIFwiZHJhdy9tYXRoL2NhbGNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEluZGV4IGV4dGVuZHMgQXBwVmlld1xuXG4gIG1hZ25ldHM6IFtdXG4gIGRyYWdnaW5nOiBmYWxzZVxuICBzdGFydGVkOiB0cnVlXG5cbiAgZGVzdHJveTotPlxuICAgIEBjdHguY2xlYXIoKVxuICAgIEBjdHguZGVzdHJveSgpXG4gICAgQGN0eCA9IG51bGxcbiAgICBAbWFnbmV0cyA9IFtdXG4gICAgJChcImJvZHlcIikuY3NzIFwiY3Vyc29yXCI6XCJkZWZhdWx0XCJcbiAgICBzdXBlclxuXG4gIGFmdGVyX3JlbmRlcjo9PlxuXG5cbiAgICBfID0gQFxuXG4gICAgXy5tYWduZXRzID0gW11cblxuICAgIEBjdHggPSB3aW5kb3cuU2tldGNoLmNyZWF0ZVxuXG4gICAgICBjb250YWluZXI6QGVsLmdldCgwKVxuXG4gICAgICBzZXR1cDotPlxuXG4gICAgICAgIERyYXcuQ1RYID0gJChcIi5za2V0Y2hcIikuZ2V0KDApLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgICAgICBfLmJhbGwgPSBuZXcgQmFsbCAyMCwgXCIjMDAwXCIsIFwiI2ZmZlwiLCA0XG4gICAgICAgIF8uYmFsbC54ID0gNTBcbiAgICAgICAgXy5iYWxsLnkgPSBAaGVpZ2h0IC8gMlxuXG4gICAgICAgIGkgPSAwXG5cbiAgICAgICAgd2hpbGUgaSA8IHBhcnNlSW50KCQod2luZG93KS53aWR0aCgpIC8gNTApXG4gICAgICAgICMgd2hpbGUgaSA8IDFcblxuICAgICAgICAgIG0gPSBuZXcgTWFnbmV0IDI1ICsgKE1hdGgucmFuZG9tKCkgKiAzNSksIFwiI0ZGRlwiXG4gICAgICAgICAgbS54ID0gTWF0aC5yYW5kb20oKSAqIEB3aWR0aFxuICAgICAgICAgIG0ueSA9IDEwMCArIChNYXRoLnJhbmRvbSgpICogQGhlaWdodCAtIDEwMClcbiAgICAgICAgICBtLnNldHVwKClcbiAgICAgICAgICBfLm1hZ25ldHMucHVzaCBtXG4gICAgICAgICAgaSsrXG5cblxuICAgICAgaXNfbW91c2Vfb3ZlcjoobWFnbmV0KS0+XG5cbiAgICAgICAgaWYgQG1vdXNlLnggPiAobWFnbmV0LnggLSBtYWduZXQucmFkaXVzKSBhbmQgQG1vdXNlLnggPCAobWFnbmV0LnggKyBtYWduZXQucmFkaXVzKSBhbmQgQG1vdXNlLnkgPiAobWFnbmV0LnkgLSBtYWduZXQucmFkaXVzKSBhbmQgQG1vdXNlLnkgPCAobWFnbmV0LnkgKyBtYWduZXQucmFkaXVzKVxuICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgIHVwZGF0ZTotPlxuXG4gICAgICAgIGlmICQoXCJib2R5XCIpLmNzcyhcImN1cnNvclwiKSBpcyBcIm1vdmVcIlxuICAgICAgICAgICQoXCJib2R5XCIpLmNzcyBcImN1cnNvclwiOlwiZGVmYXVsdFwiXG5cbiAgICAgICAgaXNfYWxyZWFkeV9kcmFnZ2luZyA9IGZhbHNlXG5cbiAgICAgICAgZm9yIG0gaW4gXy5tYWduZXRzXG4gICAgICAgICAgaWYgbS5kcmFnZ2VkXG4gICAgICAgICAgICBpc19hbHJlYWR5X2RyYWdnaW5nID0gdHJ1ZVxuICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICBmb3IgbSBpbiBfLm1hZ25ldHNcbiAgICAgICAgICBtLnVwZGF0ZSgpIFxuICAgICAgICAgIGlmIF8uc3RhcnRlZFxuICAgICAgICAgICAgbS5hdHRyYWN0IF8uYmFsbFxuXG5cblxuICAgICAgICAgIGlmIEBpc19tb3VzZV9vdmVyKG0pIGFuZCBfLmRyYWdnaW5nIGFuZCAhaXNfYWxyZWFkeV9kcmFnZ2luZ1xuICAgICAgICAgICAgbS5kcmFnZ2VkID0gdHJ1ZVxuXG4gICAgICAgICAgaWYgbS5kcmFnZ2VkXG4gICAgICAgICAgICBpc19hbHJlYWR5X2RyYWdnaW5nID0gdHJ1ZVxuICAgICAgICAgICAgbS54ID0gQG1vdXNlLnhcbiAgICAgICAgICAgIG0ueSA9IEBtb3VzZS55XG5cbiAgICAgICAgICBpZiBAaXNfbW91c2Vfb3ZlcihtKVxuICAgICAgICAgICAgJChcImJvZHlcIikuY3NzIFwiY3Vyc29yXCI6XCJtb3ZlXCJcblxuICAgICAgICBpZiBfLnN0YXJ0ZWRcbiAgICAgICAgICBfLmJhbGwudXBkYXRlKClcblxuICAgICAgICAjIEBjaGVja19jb2xsaXNpb24oKVxuICAgICAgICAjIEByZWFjaGVkX3RhcmdldCgpXG5cbiAgICAgIGNoZWNrX2NvbGxpc2lvbjotPlxuXG4gICAgICAgIGZvciBtIGluIF8ubWFnbmV0c1xuXG4gICAgICAgICAgZGlzdCA9IENhbGMuZGlzdCBtLngsIG0ueSwgXy5iYWxsLngsIF8uYmFsbC55XG5cbiAgICAgICAgICBpZiBkaXN0IDwgKG0ucmFkaXVzICsgXy5iYWxsLnJhZGl1cylcbiAgICAgICAgICAgIF8uYmFsbC52eCA9IDBcbiAgICAgICAgICAgIF8uYmFsbC52eSA9IDBcblxuICAgICAgcmVhY2hlZF90YXJnZXQ6LT5cblxuICAgICAgICBkaXN0ID0gQ2FsYy5kaXN0IF8udGFyZ2V0LngsIF8udGFyZ2V0LnksIF8uYmFsbC54LCBfLmJhbGwueVxuXG4gICAgICAgIGlmIGRpc3QgPCBfLnRhcmdldC5yYWRpdXNcbiAgICAgICAgICBfLnRhcmdldC5tYXNzID0gNTAwXG4gICAgICAgICAgXy5iYWxsLnZ4ICo9IDAuOVxuICAgICAgICAgIF8uYmFsbC52eSAqPSAwLjlcblxuICAgICAgICBpZiBkaXN0IDwgMlxuICAgICAgICAgIF8uYmFsbC52eCA9IDBcbiAgICAgICAgICBfLmJhbGwudnkgPSAwXG5cbiAgICAgIGRyYXc6LT5cbiAgICAgICAgXy5iYWxsLmRyYXcoKVxuXG4gICAgICAgIGZvciBtIGluIF8ubWFnbmV0c1xuICAgICAgICAgIG0uZHJhd19saW5lc190byBfLmJhbGxcbiAgICAgICAgICBtLmRyYXcoKSBcblxuICAgICAgbW91c2Vkb3duOi0+XG5cbiAgICAgICAgXy5kcmFnZ2luZyA9IHRydWVcblxuICAgICAgbW91c2V1cDotPlxuXG4gICAgICAgIF8uZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgICAkKGRvY3VtZW50LmJvZHkpLmNzcyBcImN1cnNvclwiOlwiZGVmYXVsdFwiXG4gICAgICAgIGZvciBtIGluIF8ubWFnbmV0cyAgXG4gICAgICAgICAgbS5zZXR1cCgpXG4gICAgICAgICAgbS5kcmFnZ2VkID0gZmFsc2VcblxuIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBLElBQUEsa0RBQUE7R0FBQTs7a1NBQUE7O0FBQUEsQ0FBQSxFQUFVLElBQVYsYUFBVTs7QUFDVixDQURBLEVBQ08sQ0FBUCxHQUFPLENBQUE7O0FBQ1AsQ0FGQSxFQUVTLEdBQVQsQ0FBUyxHQUFBOztBQUNULENBSEEsRUFHUyxHQUFULENBQVMsR0FBQTs7QUFDVCxDQUpBLEVBSU8sQ0FBUCxHQUFPLElBQUE7O0FBQ1AsQ0FMQSxFQUtPLENBQVAsR0FBTyxTQUFBOztBQUVQLENBUEEsRUFPdUIsR0FBakIsQ0FBTjtDQUVFOzs7Ozs7Q0FBQTs7Q0FBQSxDQUFBLENBQVMsSUFBVDs7Q0FBQSxFQUNVLEVBRFYsR0FDQTs7Q0FEQSxFQUVTLENBRlQsR0FFQTs7Q0FGQSxFQUlRLElBQVIsRUFBUTtDQUNOLEVBQUksQ0FBSixDQUFBO0NBQUEsRUFDSSxDQUFKLEdBQUE7Q0FEQSxFQUVBLENBQUE7Q0FGQSxDQUFBLENBR1csQ0FBWCxHQUFBO0NBSEEsRUFJQSxDQUFBLEVBQUE7Q0FBYyxDQUFTLElBQVQsRUFBQSxDQUFBO0NBSmQsS0FJQTtDQUxNLFFBTU4sRUFBQSx5QkFBQTtDQVZGLEVBSVE7O0NBSlIsRUFZYSxNQUFBLEdBQWI7Q0FHRSxPQUFBO0NBQUEsRUFBSSxDQUFKO0NBQUEsQ0FBQSxDQUVZLENBQVosR0FBQTtDQUVDLEVBQUQsQ0FBQyxFQUFZLEtBQWI7Q0FFRSxDQUFVLENBQUEsQ0FBQyxFQUFYLEdBQUE7Q0FBQSxDQUVNLENBQUEsRUFBTixDQUFBLEdBQU07Q0FFSixXQUFBLEVBQUE7Q0FBQSxFQUFBLENBQUksSUFBSixDQUFXLENBQUE7Q0FBWCxDQUVhLENBQUEsQ0FBYixFQUFhLEVBQWI7Q0FGQSxDQUFBLENBR1csQ0FBTCxJQUFOO0NBSEEsRUFJVyxDQUFMLEVBQUssRUFBWDtDQUpBLEVBTUksS0FBSjtDQUVBO0NBQU0sQ0FBSSxDQUFBLEVBQVMsQ0FBQSxFQUFULFFBQUo7Q0FHSixDQUFlLENBQVAsQ0FBQSxFQUFBLElBQVI7Q0FBQSxFQUNNLENBQUksQ0FEVixDQUNNLElBQU47Q0FEQSxFQUVNLENBQVcsRUFBSixJQUFiO0NBRkEsSUFHQSxLQUFBO0NBSEEsR0FJQSxHQUFTLEdBQVQ7QUFDQSxDQUxBO0NBSEYsUUFBQTt5QkFWSTtDQUZOLE1BRU07Q0FGTixDQXVCYyxDQUFBLEdBQWQsR0FBZSxJQUFmO0NBRUUsRUFBYyxDQUFYLENBQU0sQ0FBWSxFQUFyQjtDQUNFLEdBQUEsYUFBTztVQURUO0NBR0EsSUFBQSxVQUFPO0NBNUJULE1BdUJjO0NBdkJkLENBOEJPLENBQUEsR0FBUCxHQUFPO0NBRUwsV0FBQSw2Q0FBQTtDQUFBLEVBQUcsQ0FBQSxDQUEyQixDQUEzQixFQUFIO0NBQ0UsRUFBQSxHQUFBLElBQUE7Q0FBYyxDQUFTLE1BQVQsQ0FBQSxHQUFBO0NBQWQsV0FBQTtVQURGO0NBQUEsRUFHc0IsRUFIdEIsR0FHQSxXQUFBO0NBRUE7Q0FBQSxZQUFBLCtCQUFBO3lCQUFBO0NBQ0UsR0FBRyxHQUFILEdBQUE7Q0FDRSxFQUFzQixDQUF0QixRQUFBLE9BQUE7Q0FDQSxpQkFGRjtZQURGO0NBQUEsUUFMQTtDQVVBO0NBQUEsWUFBQSxpQ0FBQTt5QkFBQTtDQUNFLEtBQUEsSUFBQTtDQUNBLEdBQUcsR0FBSCxHQUFBO0NBQ0UsR0FBQSxHQUFBLEtBQUE7WUFGRjtBQU15QyxDQUF6QyxHQUFHLElBQUEsRUFBSCxHQUFHLE1BQUg7Q0FDRSxFQUFZLENBQVosR0FBQSxLQUFBO1lBUEY7Q0FTQSxHQUFHLEdBQUgsR0FBQTtDQUNFLEVBQXNCLENBQXRCLFFBQUEsT0FBQTtDQUFBLEVBQ00sQ0FBQyxDQUFLLE9BQVo7Q0FEQSxFQUVNLENBQUMsQ0FBSyxPQUFaO1lBWkY7Q0FjQSxHQUFHLE1BQUgsR0FBRztDQUNELEVBQUEsR0FBQSxNQUFBO0NBQWMsQ0FBUyxJQUFULEVBQUEsTUFBQTtDQUFkLGFBQUE7WUFoQko7Q0FBQSxRQVZBO0NBNEJBLEdBQUcsR0FBSCxDQUFBO0NBQ0csR0FBSyxFQUFOLFdBQUE7VUEvQkc7Q0E5QlAsTUE4Qk87Q0E5QlAsQ0FrRWdCLENBQUEsR0FBaEIsR0FBZ0IsTUFBaEI7Q0FFRSxXQUFBLHNCQUFBO0NBQUE7Q0FBQTtjQUFBLDhCQUFBO3lCQUFBO0NBRUUsQ0FBc0IsQ0FBZixDQUFQLE1BQUE7Q0FFQSxFQUFVLENBQVAsRUFBUSxJQUFYO0NBQ0UsQ0FBQSxDQUFZLENBQU4sUUFBTjtDQUFBLENBQ0EsQ0FBWSxDQUFOO01BRlIsTUFBQTtDQUFBO1lBSkY7Q0FBQTt5QkFGYztDQWxFaEIsTUFrRWdCO0NBbEVoQixDQTRFZSxDQUFBLEdBQWYsR0FBZSxLQUFmO0NBRUUsR0FBQSxRQUFBO0NBQUEsQ0FBNkIsQ0FBdEIsQ0FBUCxFQUF5QixFQUF6QjtDQUVBLEVBQVUsQ0FBUCxFQUFlLEVBQWxCO0NBQ0UsRUFBZ0IsQ0FBaEIsRUFBUSxJQUFSO0NBQUEsQ0FDQSxDQURBLENBQ00sTUFBTjtDQURBLENBRUEsQ0FGQSxDQUVNLE1BQU47VUFMRjtDQU9BLEVBQVUsQ0FBUCxJQUFIO0NBQ0UsQ0FBQSxDQUFZLENBQU4sTUFBTjtDQUNDLENBQUQsQ0FBWSxDQUFOLGFBQU47VUFYVztDQTVFZixNQTRFZTtDQTVFZixDQXlGSyxDQUFBLENBQUwsRUFBQSxHQUFLO0NBQ0gsV0FBQSxnQkFBQTtDQUFBLEdBQU0sSUFBTjtDQUVBO0NBQUE7Y0FBQSw4QkFBQTt5QkFBQTtDQUNFLEdBQUEsTUFBQSxHQUFBO0NBQUEsR0FDQTtDQUZGO3lCQUhHO0NBekZMLE1BeUZLO0NBekZMLENBZ0dVLENBQUEsR0FBVixHQUFBO0NBRUcsRUFBWSxLQUFiLE9BQUE7Q0FsR0YsTUFnR1U7Q0FoR1YsQ0FvR1EsQ0FBQSxHQUFSLENBQUEsRUFBUTtDQUVOLFdBQUEsZ0JBQUE7Q0FBQSxFQUFhLEVBQWIsR0FBQTtDQUFBLEVBQ0EsQ0FBQSxJQUFBO0NBQXFCLENBQVMsTUFBVCxDQUFBLENBQUE7Q0FEckIsU0FDQTtDQUNBO0NBQUE7Y0FBQSw4QkFBQTt5QkFBQTtDQUNFLElBQUEsS0FBQTtDQUFBLEVBQ1ksSUFBWjtDQUZGO3lCQUpNO0NBcEdSLE1Bb0dRO0NBN0dDLEtBT0o7Q0FuQlQsRUFZYTs7Q0FaYjs7Q0FGbUMiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjoxNzg4LAogICAgImNvbHVtbiI6MAogIH0sCiAgIm1hcCI6IHsKICAgICJ2ZXJzaW9uIjogMywKICAgICJmaWxlIjogImFwcC5qcyIsCiAgICAic291cmNlcyI6IFsic3JjL2FwcC92aWV3cy9tYWduZXRzL21hZ25ldC5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiQ2lyY2xlID0gcmVxdWlyZSBcImRyYXcvZ2VvbS9jaXJjbGVcIlxuQ2FsYyA9IHJlcXVpcmUgXCJkcmF3L21hdGgvY2FsY1wiXG5EcmF3ID0gcmVxdWlyZSBcImRyYXcvZHJhd1wiXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTWFnbmV0IGV4dGVuZHMgQ2lyY2xlXG5cbiAgZHJhZ2dlZDogZmFsc2VcbiAgTlVNX0xJTkVTOiAwXG4gIHNoYWRvdzogbnVsbFxuICB2eDogMFxuICB2eTogMFxuICBzcHJpbmc6IDAuMlxuICBzcGVlZDogMC4xXG5cbiAgTUlOX0RJU1Q6IDUwMFxuXG4gIGNvbnN0cnVjdG9yOi0+XG4gICAgc3VwZXJcbiAgICBAbWFzcyA9IEByYWRpdXMgKiAyXG4gICAgQE5VTV9MSU5FUyA9IEByYWRpdXMgLyA1XG4gICAgQHNoYWRvdyA9IG5ldyBDaXJjbGUgQHJhZGl1cywgXCIjMDAwXCJcblxuICB1cGRhdGU6LT5cblxuICAgIHVubGVzcyBAZHJhZ2dlZFxuXG4gICAgICBAZHggPSBAaWRkbGVfeCAtIEB4XG4gICAgICBAZHkgPSBAaWRkbGVfeSAtIEB5XG4gICAgICBAYXggPSBAZHggKiBAc3ByaW5nXG4gICAgICBAYXkgPSBAZHkgKiBAc3ByaW5nXG4gICAgICBAdnggKz0gQGF4XG4gICAgICBAdnkgKz0gQGF5XG5cbiAgICAgIEB4ICs9IEB2eCAqIEBzcGVlZFxuICAgICAgQHkgKz0gQHZ5ICogQHNwZWVkXG5cbiAgICAgIEBheCA9IDBcbiAgICAgIEBheSA9IDBcblxuICBzZXR1cDotPlxuICAgIEBpbml0aWFsX3ggPSBAeFxuICAgIEBpbml0aWFsX3kgPSBAeVxuICAgIEBpZGRsZV94ID0gQGluaXRpYWxfeCArIChNYXRoLnJhbmRvbSgpICogMTApICsgKC0oTWF0aC5yYW5kb20oKSAqIDEwKSlcbiAgICBAaWRkbGVfeSA9IEBpbml0aWFsX3kgKyAoTWF0aC5yYW5kb20oKSAqIDEwKSArICgtKE1hdGgucmFuZG9tKCkgKiAxMCkpXG5cbiAgZHJhdzooQGN0eCktPlxuICAgIEBzaGFkb3cueCA9IEB4ICsgMlxuICAgIEBzaGFkb3cueSA9IEB5ICsgMlxuICAgIEBzaGFkb3cuZHJhdyhAY3R4KVxuICAgIHN1cGVyXG4gICAgQGRyYXdfZG90KClcblxuICBhdHRyYWN0OihiYWxsKS0+XG5cbiAgICBkZWcgPSBDYWxjLmFuZyBAeCwgQHksIGJhbGwueCwgYmFsbC55XG4gICAgcmFkID0gQ2FsYy5kZWcycmFkIGRlZ1xuICAgIGRpc3RhbmNlID0gQ2FsYy5kaXN0IEB4LCBAeSwgYmFsbC54LCBiYWxsLnlcblxuICAgIGlmIGRpc3RhbmNlIDwgMjUwXG4gICAgICBkaXN0YW5jZSA9IDI1MFxuXG4gICAgc3RyZW5ndGggPSAoQG1hc3MgKiBiYWxsLm1hc3MpIC8gKGRpc3RhbmNlICogZGlzdGFuY2UpXG4gICAgZnggPSBNYXRoLmNvcyhyYWQpICogc3RyZW5ndGhcbiAgICBmeSA9IE1hdGguc2luKHJhZCkgKiBzdHJlbmd0aFxuXG4gICAgIyBpZiBkaXN0YW5jZSA8IEBNSU5fRElTVFxuICAgIGJhbGwuYXBwbHlfZm9yY2UgLWZ4LCAtZnlcblxuICBkcmF3X2xpbmVzX3RvOihiYWxsKS0+XG4gICAgQGN0eCA9IERyYXcuQ1RYIHVubGVzcyBAY3R4XG4gICAgaSA9IDBcbiAgICBvcGFjaXR5ID0gMVxuXG4gICAgZGlzdCA9IENhbGMuZGlzdCBAeCwgQHksIGJhbGwueCwgYmFsbC55XG5cbiAgICBpZiBkaXN0ID4gQE1JTl9ESVNUXG4gICAgICByZXR1cm5cbiAgICBlbHNlXG4gICAgICBvcGFjaXR5ID0gMSAtIChkaXN0L0BNSU5fRElTVClcblxuICAgIHRhcmdldF9hbmdsZSA9IENhbGMuYW5nIEB4LCBAeSwgYmFsbC54LCBiYWxsLnlcblxuICAgIGxpbmVfYW5nbGUgPSB0YXJnZXRfYW5nbGUgKyA5MFxuICAgIGxpbmVfcmFkID0gQ2FsYy5kZWcycmFkIGxpbmVfYW5nbGVcblxuICAgIF9yYWRpdXMgPSBAcmFkaXVzICogMC45XG5cbiAgICBAY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZGVzdGluYXRpb24tb3ZlclwiXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgyNTUsMjU1LDI1NSwje29wYWNpdHl9KVwiXG4gICAgQGN0eC5saW5lV2lkdGggPSAxXG4gICAgXG4gICAgd2hpbGUgaSA8IChATlVNX0xJTkVTICogMS45KVxuXG4gICAgICBpbml0X3ggPSBAeCArIChNYXRoLmNvcyBsaW5lX3JhZCkgKiBfcmFkaXVzXG4gICAgICBpbml0X3kgPSBAeSArIChNYXRoLnNpbiBsaW5lX3JhZCkgKiBfcmFkaXVzXG5cbiAgICAgIHRhcmdldF9hbmdsZSA9IENhbGMuYW5nIGluaXRfeCwgaW5pdF95LCBiYWxsLngsIGJhbGwueVxuICAgICAgdGFyZ2V0X3JhZCA9IENhbGMuZGVnMnJhZCB0YXJnZXRfYW5nbGVcbiAgICAgIGxpbmVfZGlzdCA9IENhbGMuZGlzdCBpbml0X3gsIGluaXRfeSwgYmFsbC54LCBiYWxsLnlcblxuICAgICAgX3ggPSBpbml0X3ggKyAoTWF0aC5jb3MgdGFyZ2V0X3JhZCkgKiBsaW5lX2Rpc3RcbiAgICAgIF95ID0gaW5pdF95ICsgKE1hdGguc2luIHRhcmdldF9yYWQpICogbGluZV9kaXN0XG4gICAgICBcbiAgICAgIEBjdHgubW92ZVRvIGluaXRfeCwgaW5pdF95XG4gICAgICBAY3R4LmxpbmVUbyBfeCwgX3lcblxuICAgICAgX3JhZGl1cyAtPSBAcmFkaXVzIC8gQE5VTV9MSU5FU1xuXG5cbiAgICAgIGkrK1xuXG4gICAgQGN0eC5zdHJva2UoKVxuICAgIEBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJzb3VyY2Utb3ZlclwiXG5cblxuICBkcmF3X2RvdDotPlxuXG4gICAgQGN0eC5maWxsU3R5bGUgPSBcIiMwMDBcIlxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LmFyYyBAeCwgQHksIDEwLCAwLCBNYXRoLlBJKjIsIHRydWVcbiAgICBAY3R4LmNsb3NlUGF0aCgpXG4gICAgQGN0eC5maWxsKClcblxuXG5cblxuIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBLElBQUEsc0JBQUE7R0FBQTtrU0FBQTs7QUFBQSxDQUFBLEVBQVMsR0FBVCxDQUFTLFdBQUE7O0FBQ1QsQ0FEQSxFQUNPLENBQVAsR0FBTyxTQUFBOztBQUNQLENBRkEsRUFFTyxDQUFQLEdBQU8sSUFBQTs7QUFFUCxDQUpBLEVBSXVCLEdBQWpCLENBQU47Q0FFRTs7Q0FBQSxFQUFTLEVBQVQsRUFBQTs7Q0FBQSxFQUNXLE1BQVg7O0NBREEsRUFFUSxDQUZSLEVBRUE7O0NBRkEsQ0FHQSxDQUFJOztDQUhKLENBSUEsQ0FBSTs7Q0FKSixFQUtRLEdBQVI7O0NBTEEsRUFNTyxFQUFQOztDQU5BLEVBUVUsS0FBVjs7Q0FFWSxDQUFBLENBQUEsYUFBQTtDQUNWLEdBQUEsS0FBQSxnQ0FBQTtDQUFBLEVBQ1EsQ0FBUixFQUFRO0NBRFIsRUFFYSxDQUFiLEVBQWEsR0FBYjtDQUZBLENBRzhCLENBQWhCLENBQWQsRUFBQTtDQWRGLEVBVVk7O0NBVlosRUFnQk8sR0FBUCxHQUFPO0FBRUUsQ0FBUCxHQUFBLEdBQUE7Q0FFRSxDQUFBLENBQU0sQ0FBTCxFQUFELENBQU07Q0FBTixDQUNBLENBQU0sQ0FBTCxFQUFELENBQU07Q0FETixDQUVBLENBQU0sQ0FBTCxFQUFEO0NBRkEsQ0FHQSxDQUFNLENBQUwsRUFBRDtDQUhBLENBSUEsRUFBQyxFQUFEO0NBSkEsQ0FLQSxFQUFDLEVBQUQ7Q0FMQSxDQU9NLENBQU0sQ0FBWCxDQVBELENBT0E7Q0FQQSxDQVFNLENBQU0sQ0FBWCxDQVJELENBUUE7Q0FSQSxDQVVBLENBQU0sQ0FBTCxFQUFEO0NBQ0MsQ0FBRCxDQUFNLENBQUwsU0FBRDtNQWZHO0NBaEJQLEVBZ0JPOztDQWhCUCxFQWlDTSxFQUFOLElBQU07Q0FDSixFQUFhLENBQWIsS0FBQTtDQUFBLEVBQ2EsQ0FBYixLQUFBO0FBQ2lELENBRmpELENBRXdCLENBQWIsQ0FBWCxFQUF5QixDQUF6QixFQUFXO0FBQ3NDLENBQWhELENBQXVCLENBQWIsQ0FBVixFQUF3QixDQUF6QixFQUFXLEVBQVg7Q0FyQ0YsRUFpQ007O0NBakNOLEVBdUNLLENBQUwsS0FBTztDQUNMLEVBREssQ0FBRDtDQUNKLEVBQVksQ0FBWixFQUFPO0NBQVAsRUFDWSxDQUFaLEVBQU87Q0FEUCxFQUVBLENBQUEsRUFBTztDQUZQLEdBR0EsS0FBQSx5QkFBQTtDQUNDLEdBQUEsSUFBRCxHQUFBO0NBNUNGLEVBdUNLOztDQXZDTCxFQThDUSxDQUFBLEdBQVIsRUFBUztDQUVQLE9BQUEsNEJBQUE7Q0FBQSxDQUFtQixDQUFuQixDQUFBO0NBQUEsRUFDQSxDQUFBLEdBQU07Q0FETixDQUV5QixDQUFkLENBQVgsSUFBQTtDQUVBLEVBQWMsQ0FBZCxJQUFHO0NBQ0QsRUFBVyxHQUFYLEVBQUE7TUFMRjtDQUFBLEVBT1csQ0FBWCxJQUFBO0NBUEEsQ0FRQSxDQUFLLENBQUwsSUFSQTtDQUFBLENBU0EsQ0FBSyxDQUFMLElBVEE7QUFZa0IsQ0FBYixDQUFMLEVBQUksT0FBSjtDQTVERixFQThDUTs7Q0E5Q1IsRUE4RGMsQ0FBQSxLQUFDLElBQWY7Q0FDRSxPQUFBLG9HQUFBO0FBQXVCLENBQXZCLEVBQUEsQ0FBQTtDQUFBLEVBQUEsQ0FBQyxFQUFEO01BQUE7Q0FBQSxFQUNJLENBQUo7Q0FEQSxFQUVVLENBQVYsR0FBQTtDQUZBLENBSXFCLENBQWQsQ0FBUDtDQUVBLEVBQVUsQ0FBVixJQUFBO0NBQ0UsV0FBQTtNQURGO0NBR0UsRUFBVSxDQUFLLEVBQWYsQ0FBQSxDQUFjO01BVGhCO0NBQUEsQ0FXNEIsQ0FBYixDQUFmLFFBQUE7Q0FYQSxDQUFBLENBYWEsQ0FBYixNQUFBLEVBQWE7Q0FiYixFQWNXLENBQVgsR0FBVyxDQUFYLEVBQVc7Q0FkWCxFQWdCVSxDQUFWLEVBQVUsQ0FBVjtDQWhCQSxFQWtCSSxDQUFKLGNBbEJBLE1Ba0JBO0NBbEJBLEVBbUJJLENBQUosR0FBb0IsSUFBcEIsUUFBb0I7Q0FuQnBCLEVBb0JJLENBQUosS0FBQTtDQUVBLEVBQVUsQ0FBRSxLQUFELEVBQUw7Q0FFSixFQUFTLENBQUMsRUFBVixDQUFBLENBQWU7Q0FBZixFQUNTLENBQUMsRUFBVixDQURBLENBQ2U7Q0FEZixDQUdnQyxDQUFqQixDQUFJLEVBQW5CLE1BQUE7Q0FIQSxFQUlhLENBQUksRUFBakIsQ0FBYSxHQUFiLEVBQWE7Q0FKYixDQUs4QixDQUFsQixDQUFJLEVBQWhCLEdBQUE7Q0FMQSxDQU9BLENBQUssQ0FBYyxFQUFuQixHQVBBLENBT2U7Q0FQZixDQVFBLENBQUssQ0FBYyxFQUFuQixHQVJBLENBUWU7Q0FSZixDQVVvQixDQUFoQixDQUFILEVBQUQ7Q0FWQSxDQVdBLENBQUksQ0FBSCxFQUFEO0NBWEEsRUFhcUIsQ0FBVixFQUFYLENBQUEsRUFiQTtBQWdCQSxDQWhCQSxDQUFBLElBZ0JBO0NBeENGLElBc0JBO0NBdEJBLEVBMENJLENBQUosRUFBQTtDQUNDLEVBQUcsQ0FBSCxPQUFELGFBQUE7Q0ExR0YsRUE4RGM7O0NBOURkLEVBNkdTLEtBQVQsQ0FBUztDQUVQLEVBQUksQ0FBSixFQUFBLEdBQUE7Q0FBQSxFQUNJLENBQUosS0FBQTtDQURBLENBRWEsQ0FBVCxDQUFKO0NBRkEsRUFHSSxDQUFKLEtBQUE7Q0FDQyxFQUFHLENBQUgsT0FBRDtDQW5IRixFQTZHUzs7Q0E3R1Q7O0NBRm9DIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6MTkyMCwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvdmlld3MvbWFnbmV0cy90YXJnZXQuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIkNpcmNsZSA9IHJlcXVpcmUgXCJkcmF3L2dlb20vY2lyY2xlXCJcbkNhbGMgPSByZXF1aXJlIFwiZHJhdy9tYXRoL2NhbGNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRhcmdldCBleHRlbmRzIENpcmNsZVxuXG4gIGNvbnN0cnVjdG9yOi0+XG4gICAgc3VwZXIgNTAsIFwiIzAwMFwiLCBcIiNmZmZcIiwgMVxuICAgIEBtYXNzID0gNTAwXG5cbiAgdXBkYXRlOi0+XG5cbiAgYXR0cmFjdDooYmFsbCktPlxuXG4gICAgZGVnID0gQ2FsYy5hbmcgQHgsIEB5LCBiYWxsLngsIGJhbGwueVxuICAgIHJhZCA9IENhbGMuZGVnMnJhZCBkZWdcbiAgICBkaXN0YW5jZSA9IENhbGMuZGlzdCBAeCwgQHksIGJhbGwueCwgYmFsbC55XG5cbiAgICBpZiBkaXN0YW5jZSA+IDc1MFxuICAgICAgZGlzdGFuY2UgPSA3NTBcblxuICAgIGlmIGRpc3RhbmNlIDwgMzAwXG4gICAgICBkaXN0YW5jZSA9IDMwMFxuXG4gICAgc3RyZW5ndGggPSAoQG1hc3MgKiBiYWxsLm1hc3MpIC8gKGRpc3RhbmNlICogZGlzdGFuY2UpXG4gICAgZnggPSBNYXRoLmNvcyhyYWQpICogc3RyZW5ndGhcbiAgICBmeSA9IE1hdGguc2luKHJhZCkgKiBzdHJlbmd0aFxuXG4gICAgaWYgZGlzdGFuY2UgPCA1MDBcbiAgICAgIGJhbGwuYXBwbHlfZm9yY2UgLWZ4LCAtZnlcblxuICBkcmF3Oi0+XG4gICAgc3VwZXJcblxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBcIiNmZmZcIlxuICAgIEBjdHguc3Ryb2tlV2lkdGggPSAxXG4gICAgQGN0eC5tb3ZlVG8gQHgsICBAeVxuICAgIEBjdHgubGluZVRvIE1hdGgucm91bmQoQHggLSAzKSwgTWF0aC5yb3VuZChAeSAtIDMpXG4gICAgQGN0eC5tb3ZlVG8gQHgsICBAeVxuICAgIEBjdHgubGluZVRvIE1hdGgucm91bmQoQHggKyAzKSwgTWF0aC5yb3VuZChAeSArIDMpXG4gICAgQGN0eC5tb3ZlVG8gQHgsICBAeVxuICAgIEBjdHgubGluZVRvIE1hdGgucm91bmQoQHggKyAzKSwgTWF0aC5yb3VuZChAeSAtIDMpXG4gICAgQGN0eC5tb3ZlVG8gQHgsICBAeVxuICAgIEBjdHgubGluZVRvIE1hdGgucm91bmQoQHggLSAzKSwgTWF0aC5yb3VuZChAeSArIDMpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxnQkFBQTtHQUFBO2tTQUFBOztBQUFBLENBQUEsRUFBUyxHQUFULENBQVMsV0FBQTs7QUFDVCxDQURBLEVBQ08sQ0FBUCxHQUFPLFNBQUE7O0FBRVAsQ0FIQSxFQUd1QixHQUFqQixDQUFOO0NBRUU7O0NBQVksQ0FBQSxDQUFBLGFBQUE7Q0FDVixDQUFBLEVBQUEsRUFBQSxrQ0FBTTtDQUFOLEVBQ1EsQ0FBUjtDQUZGLEVBQVk7O0NBQVosRUFJTyxHQUFQLEdBQU87O0NBSlAsRUFNUSxDQUFBLEdBQVIsRUFBUztDQUVQLE9BQUEsNEJBQUE7Q0FBQSxDQUFtQixDQUFuQixDQUFBO0NBQUEsRUFDQSxDQUFBLEdBQU07Q0FETixDQUV5QixDQUFkLENBQVgsSUFBQTtDQUVBLEVBQWMsQ0FBZCxJQUFHO0NBQ0QsRUFBVyxHQUFYLEVBQUE7TUFMRjtDQU9BLEVBQWMsQ0FBZCxJQUFHO0NBQ0QsRUFBVyxHQUFYLEVBQUE7TUFSRjtDQUFBLEVBVVcsQ0FBWCxJQUFBO0NBVkEsQ0FXQSxDQUFLLENBQUwsSUFYQTtDQUFBLENBWUEsQ0FBSyxDQUFMLElBWkE7Q0FjQSxFQUFjLENBQWQsSUFBRztBQUNpQixDQUFiLENBQUwsRUFBSSxPQUFKLEVBQUE7TUFqQkk7Q0FOUixFQU1ROztDQU5SLEVBeUJLLENBQUwsS0FBSztDQUNILEdBQUEsS0FBQSx5QkFBQTtDQUFBLEVBRUksQ0FBSixFQUZBLEtBRUE7Q0FGQSxFQUdJLENBQUosT0FBQTtDQUhBLENBSWlCLENBQWIsQ0FBSixFQUFBO0NBSkEsQ0FLZ0MsQ0FBNUIsQ0FBSixDQUFZLENBQVo7Q0FMQSxDQU1pQixDQUFiLENBQUosRUFBQTtDQU5BLENBT2dDLENBQTVCLENBQUosQ0FBWSxDQUFaO0NBUEEsQ0FRaUIsQ0FBYixDQUFKLEVBQUE7Q0FSQSxDQVNnQyxDQUE1QixDQUFKLENBQVksQ0FBWjtDQVRBLENBVWlCLENBQWIsQ0FBSixFQUFBO0NBVkEsQ0FXZ0MsQ0FBNUIsQ0FBSixDQUFZLENBQVo7Q0FDQyxFQUFHLENBQUgsRUFBRCxLQUFBO0NBdENGLEVBeUJLOztDQXpCTDs7Q0FGb0MiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjoxOTc4LAogICAgImNvbHVtbiI6MAogIH0sCiAgIm1hcCI6IHsKICAgICJ2ZXJzaW9uIjogMywKICAgICJmaWxlIjogImFwcC5qcyIsCiAgICAic291cmNlcyI6IFsic3JjL2FwcC92aWV3cy9wYWdlcy9pbmRleC5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiQXBwVmlldyA9IHJlcXVpcmUgJ2FwcC92aWV3cy9hcHBfdmlldydcbk1lbnUgPSByZXF1aXJlICdhcHAvdmlld3MvcGFnZXMvbWVudSdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBJbmRleCBleHRlbmRzIEFwcFZpZXdcblxuCWFmdGVyX3JlbmRlcjooKS0+XG4JCUBzZXR1cCgpXG4JCUBzZXRfdHJpZ2dlcnMoKVxuXG4Jc2V0dXA6KCktPlxuCQlAd3JhcHBlciA9ICQoQGVsKS5maW5kIFwiLndyYXBwZXJcIlxuCQlAd2luZG93ID0gJCB3aW5kb3dcbgkJQG1lbnUgPSBuZXcgTWVudSBcIi5mb290ZXJcIlxuCQlAbG9nbyA9IEBlbC5maW5kIFwiLmxvZ28tbGFic1wiXG5cbgliZWZvcmVfaW46KCktPlxuCQlAbG9nby5jc3Mge29wYWNpdHk6MH1cblxuCW9uX3Jlc2l6ZTooKT0+XG4JCUB3cmFwcGVyLmNzc1xuCQkJd2lkdGg6IEB3aW5kb3cud2lkdGgoKVxuCQkJaGVpZ2h0OiBAd2luZG93LmhlaWdodCgpXG5cbgkJQG1lbnUub25fcmVzaXplKClcblxuXG4JaW46KGRvbmUpLT5cbgkJQGJlZm9yZV9pbigpXG4JCVR3ZWVuTGl0ZS50byBAbG9nbywgMCwge2Nzczp7b3BhY2l0eToxfSwgZGVsYXk6MC4xfVxuCQlAbG9nby5zcHJpdGVmeSBcImxvZ28tbGFic1wiLFxuCQkJZHVyYXRpb246MVxuCQkJY291bnQ6MVxuCQkJb25Db21wbGV0ZTooKT0+XG4JCQkJQG1lbnUuaW4gKCk9PlxuCQkJCQlAYWZ0ZXJfaW4/KClcblxuCQlAbG9nby5hbmltYXRpb24ucGxheSgpXG5cbglnb3RvOihlKS0+XG4JCWUucHJldmVudERlZmF1bHQoKVxuCQlyb3V0ZSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyIFwiaHJlZlwiXG4JCWNvbnNvbGUubG9nIHJvdXRlXG4JCSMgQG5hdmlnYXRlIHJvdXRlXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxzQkFBQTtHQUFBOztrU0FBQTs7QUFBQSxDQUFBLEVBQVUsSUFBVixhQUFVOztBQUNWLENBREEsRUFDTyxDQUFQLEdBQU8sZUFBQTs7QUFFUCxDQUhBLEVBR3VCLEdBQWpCLENBQU47Q0FFQzs7Ozs7O0NBQUE7O0NBQUEsRUFBYSxNQUFBLEdBQWI7Q0FDQyxHQUFBLENBQUE7Q0FDQyxHQUFBLE9BQUQsQ0FBQTtDQUZELEVBQWE7O0NBQWIsRUFJTSxFQUFOLElBQU07Q0FDTCxDQUFXLENBQUEsQ0FBWCxHQUFBLEdBQVc7Q0FBWCxFQUNVLENBQVYsRUFBQTtDQURBLEVBRVksQ0FBWixLQUFZO0NBQ1gsQ0FBVSxDQUFILENBQVAsT0FBRCxDQUFRO0NBUlQsRUFJTTs7Q0FKTixFQVVVLE1BQVY7Q0FDRSxFQUFELENBQUMsT0FBRDtDQUFVLENBQVMsSUFBUixDQUFBO0NBREYsS0FDVDtDQVhELEVBVVU7O0NBVlYsRUFhVSxNQUFWO0NBQ0MsRUFBQSxDQUFBLEdBQVE7Q0FDUCxDQUFPLEVBQUMsQ0FBUixDQUFBO0NBQUEsQ0FDUSxFQUFDLEVBQVQ7Q0FGRCxLQUFBO0NBSUMsR0FBQSxLQUFELEVBQUE7Q0FsQkQsRUFhVTs7Q0FiVixFQXFCRyxDQUFBLEtBQUM7Q0FDSCxPQUFBLElBQUE7Q0FBQSxHQUFBLEtBQUE7Q0FBQSxDQUNBLEVBQUEsS0FBUztDQUFjLENBQUssQ0FBSixHQUFBO0NBQUksQ0FBUyxLQUFSLENBQUE7UUFBTjtDQUFBLENBQXdCLENBQXhCLEVBQWtCLENBQUE7Q0FEekMsS0FDQTtDQURBLENBR0MsRUFERCxJQUFBLEdBQUE7Q0FDQyxDQUFTLElBQVQsRUFBQTtDQUFBLENBQ00sR0FBTixDQUFBO0NBREEsQ0FFVyxDQUFBLEdBQVgsR0FBVyxDQUFYO0NBQ0UsRUFBUSxDQUFKLENBQUosSUFBUSxNQUFUO0NBQ0UsRUFBRCxFQUFDO0NBREYsUUFBUztDQUhWLE1BRVc7Q0FMWixLQUVBO0NBT0MsR0FBQSxLQUFjLEVBQWY7Q0EvQkQsRUFxQkc7O0NBckJILEVBaUNLLENBQUwsS0FBTTtDQUNMLElBQUEsR0FBQTtDQUFBLEdBQUEsVUFBQTtDQUFBLEVBQ1EsQ0FBUixDQUFBLENBQVEsT0FBQTtDQUNBLEVBQVIsRUFBQSxFQUFPLElBQVA7Q0FwQ0QsRUFpQ0s7O0NBakNMOztDQUZvQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjIwNTYsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL3ZpZXdzL3BhZ2VzL21lbnUuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIlRlbXBsYXRlID0gcmVxdWlyZSAndGVtcGxhdGVzL3BhZ2VzL21lbnUnXG5Sb3V0ZXMgPSByZXF1aXJlICdhcHAvY29uZmlnL3JvdXRlcydcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBNZW51XG5cbglsYWJzOltdXG4JY29uc3RydWN0b3I6KGF0KS0+XG4JCWZvciByb3V0ZSBvZiBSb3V0ZXMucm91dGVzXG4JCQlAbGFicy5wdXNoIHJvdXRlLnRvU3RyaW5nKCkgaWYgUm91dGVzLnJvdXRlc1tyb3V0ZV0ubGFiXG4JCUBlbCA9ICQoVGVtcGxhdGUoe2xhYnM6QGxhYnN9KSlcbgkJJChhdCkuYXBwZW5kIEBlbFxuCQlAc2V0dXAoKVxuXG4Jb25fcmVzaXplOigpPT5cbgkJQGVsLmNzc1xuCQkJdG9wOiBAd2luZG93LmhlaWdodCgpIC0gQGVsLmhlaWdodCgpXG4JCQl3aWR0aDogQHdpbmRvdy53aWR0aCgpXG5cbgkJQG1lbnUuY3NzXG5cbgkJCWxlZnQ6IEB3cmFwcGVyLndpZHRoKCkgLyAyIC0gQG1lbnUud2lkdGgoKSAvIDJcblxuCXNldHVwOigpLT5cbgkJQHdpbmRvdyA9ICQod2luZG93KVxuCQlAd3JhcHBlciA9ICQgXCIud3JhcHBlclwiXG4JCUBhcnJvdyA9IEBlbC5maW5kIFwiLmFycm93XCJcbgkJQG1lbnUgPSBAZWwuZmluZCBcIi5uYXZcIlxuXG4JCUBvbl9yZXNpemUoKVxuCQlAZXZlbnRzKClcblxuCQlAYXJyb3cuY3NzXG4JCQl0b3A6MTAwXG5cbglpbjooY2IpLT5cbgkJVHdlZW5MaXRlLnRvIEBhcnJvdywgMC41LCB7Y3NzOnt0b3A6MTB9LCBlYXNlOkJhY2suZWFzZU91dCwgb25Db21wbGV0ZTpjYn1cblxuCWV2ZW50czooKS0+XG4JCUB3aW5kb3cuYmluZCBcInJlc2l6ZVwiLCBAb25fcmVzaXplXG4JCUBlbC5iaW5kIFwibW91c2VlbnRlclwiLCBAc2hvd1xuCQlAZWwuYmluZCBcIm1vdXNlbGVhdmVcIiwgQGhpZGVcbgkJQG1lbnUuZmluZChcImFcIikuYmluZCBcIm1vdXNlZW50ZXJcIiwgQG92ZXJcbgkJQG1lbnUuZmluZChcImFcIikuYmluZCBcIm1vdXNlbGVhdmVcIiwgQG91dFxuXG4Jb3ZlcjooZSk9PlxuCQlidCA9ICQoZS5jdXJyZW50VGFyZ2V0KVxuXG4JCXJldHVybiBpZiBidC5oYXNDbGFzcyBcImFjdGl2ZVwiXG4JCVR3ZWVuTGl0ZS50byBidC5maW5kKFwiLndoaXRlX2RvdFwiKSwgMC4xNSwge2Nzczp7d2lkdGg6MSwgaGVpZ2h0OjEsIG1hcmdpbkxlZnQ6LTEsIG1hcmdpblRvcDotMX19XG4JCVR3ZWVuTGl0ZS50byBidC5maW5kKFwiLmRvdFwiKSwgMC4xNSwge2Nzczp7b3BhY2l0eTowfX1cblxuCW91dDooZSk9PlxuCQlidCA9ICQoZS5jdXJyZW50VGFyZ2V0KVxuCQlyZXR1cm4gaWYgYnQuaGFzQ2xhc3MgXCJhY3RpdmVcIlxuCQlUd2VlbkxpdGUudG8gYnQuZmluZChcIi53aGl0ZV9kb3RcIiksIDAuMTUsIHtjc3M6e3dpZHRoOjI1LCBoZWlnaHQ6MjUsIG1hcmdpbkxlZnQ6LSgyNiAvIDIpLCBtYXJnaW5Ub3A6LSgyNi8yKX19XG4JCVR3ZWVuTGl0ZS50byBidC5maW5kKFwiLmRvdFwiKSwgMC4xNSwge2Nzczp7b3BhY2l0eToxfX1cblxuCWhpZGU6KCk9PlxuXG4JCVR3ZWVuTGl0ZS50byBAYXJyb3csIDAuNSwge2Nzczp7dG9wOjIwfSwgZWFzZTpFeHBvLmVhc2VPdXQsIGRlbGF5OjAuNH1cblxuCQlhbW91bnQgPSBAbWVudS5maW5kKFwibGlcIikubGVuZ3RoXG4JCXRvdGFsX2RlbGF5ID0gYW1vdW50IC8gMlxuCQlkZWxheSA9IDBcbgkJZGlzdGFuY2UgPSAwXG4JCUBkZWxheV92ID0gMFxuXG4JCWZvciBsaSwgaSBpbiBAbWVudS5maW5kIFwibGkgYVwiXG4JCQlkaXN0YW5jZSA9IHRvdGFsX2RlbGF5IC0gTWF0aC5hYnModG90YWxfZGVsYXkgLSBAZGVsYXlfdilcbgkJCUBkZWxheV92ICs9IDFcbgkJCWRlbGF5ID0gZGlzdGFuY2UgLyA1MDBcbgkJCWxpID0gJChsaSlcbgkJCVR3ZWVuTGl0ZS50byBsaSwgMC40LCB7Y3NzOnt0b3A6MTUwfSwgZWFzZTpCYWNrLmVhc2VJbiwgZGVsYXk6aSAqIGRlbGF5fVxuXG4Jc2hvdzooKT0+XG5cbgkJVHdlZW5MaXRlLnRvIEBhcnJvdywgMC41LCB7Y3NzOnt0b3A6MTUwfSwgZWFzZTpFeHBvLmVhc2VPdXR9XG5cbgkJYW1vdW50ID0gQG1lbnUuZmluZChcImxpXCIpLmxlbmd0aFxuCQl0b3RhbF9kZWxheSA9IGFtb3VudCAvIDJcbgkJZGVsYXkgPSAwXG4JCWRpc3RhbmNlID0gMFxuCQlAZGVsYXlfdiA9IDBcblxuCQlmb3IgbGksIGkgaW4gQG1lbnUuZmluZCBcImxpIGFcIlxuCQkJZGlzdGFuY2UgPSB0b3RhbF9kZWxheSAtIE1hdGguYWJzKHRvdGFsX2RlbGF5IC0gQGRlbGF5X3YpXG4JCQlAZGVsYXlfdiArPSAxXG4JCQlkZWxheSA9IGRpc3RhbmNlIC8gNTAwXG4JCQlsaSA9ICQobGkpXG4JCQlUd2VlbkxpdGUudG8gbGksIDAuNCwge2Nzczp7dG9wOjIwfSwgZWFzZTpCYWNrLmVhc2VPdXQsIGRlbGF5OmkgKiBkZWxheX1cbiJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLGtCQUFBO0dBQUEsK0VBQUE7O0FBQUEsQ0FBQSxFQUFXLElBQUEsQ0FBWCxjQUFXOztBQUNYLENBREEsRUFDUyxHQUFULENBQVMsWUFBQTs7QUFFVCxDQUhBLEVBR3VCLEdBQWpCLENBQU47Q0FFQyxDQUFBLENBQUssQ0FBTDs7Q0FDWSxDQUFBLENBQUEsV0FBQztDQUNaLGtDQUFBO0NBQUEsa0NBQUE7Q0FBQSxnQ0FBQTtDQUFBLGtDQUFBO0NBQUEsNENBQUE7Q0FBQSxJQUFBLEdBQUE7QUFBQSxDQUFBLEVBQUEsTUFBQSxhQUFBO0NBQ0MsRUFBQSxDQUErQixDQUFjLENBQTdDO0NBQUEsR0FBQyxDQUFlLEdBQWhCO1FBREQ7Q0FBQSxJQUFBO0NBQUEsQ0FFQSxDQUFNLENBQU4sSUFBUTtDQUFTLENBQU0sRUFBTCxFQUFBO0NBQVosS0FBRTtDQUZSLENBR0EsRUFBQSxFQUFBO0NBSEEsR0FJQSxDQUFBO0NBTkQsRUFDWTs7Q0FEWixFQVFVLE1BQVY7Q0FDQyxDQUFHLENBQUgsQ0FBQTtDQUNDLENBQUssQ0FBTCxDQUFNLEVBQU47Q0FBQSxDQUNPLEVBQUMsQ0FBUixDQUFBO0NBRkQsS0FBQTtDQUlDLEVBQUQsQ0FBQyxPQUFEO0NBRUMsQ0FBTSxDQUFtQixDQUF6QixDQUFNLENBQU4sQ0FBYztDQVBOLEtBS1Q7Q0FiRCxFQVFVOztDQVJWLEVBaUJNLEVBQU4sSUFBTTtDQUNMLEVBQVUsQ0FBVixFQUFBO0NBQUEsRUFDVyxDQUFYLEdBQUEsR0FBVztDQURYLENBRVksQ0FBSCxDQUFULENBQUEsR0FBUztDQUZULENBR1csQ0FBSCxDQUFSLEVBQVE7Q0FIUixHQUtBLEtBQUE7Q0FMQSxHQU1BLEVBQUE7Q0FFQyxFQUFELENBQUMsQ0FBSyxNQUFOO0NBQ0MsQ0FBSSxDQUFKLEdBQUE7Q0FWSSxLQVNMO0NBMUJELEVBaUJNOztDQWpCTixDQTZCRyxDQUFBLE1BQUM7Q0FDTyxDQUFWLENBQUEsQ0FBYyxDQUFkLElBQVMsRUFBVDtDQUEwQixDQUFLLENBQUosR0FBQTtDQUFJLENBQUssQ0FBSixLQUFBO1FBQU47Q0FBQSxDQUFvQixFQUFMLEVBQUEsQ0FBZjtDQUFBLENBQTZDLElBQVgsSUFBQTtDQUQxRCxLQUNGO0NBOUJELEVBNkJHOztDQTdCSCxFQWdDTyxHQUFQLEdBQU87Q0FDTixDQUF1QixFQUF2QixFQUFPLEVBQVAsQ0FBQTtDQUFBLENBQ0csRUFBSCxRQUFBO0NBREEsQ0FFRyxFQUFILFFBQUE7Q0FGQSxDQUdtQyxDQUFuQyxDQUFBLFFBQUE7Q0FDQyxDQUFrQyxDQUFuQyxDQUFDLE9BQUQsQ0FBQTtDQXJDRCxFQWdDTzs7Q0FoQ1AsRUF1Q0ssQ0FBTCxLQUFNO0NBQ0wsQ0FBQSxNQUFBO0NBQUEsQ0FBQSxDQUFLLENBQUwsU0FBSztDQUVMLENBQVksRUFBWixJQUFVO0NBQVYsV0FBQTtNQUZBO0NBQUEsQ0FHQSxFQUFBLEtBQVMsR0FBSTtDQUE2QixDQUFLLENBQUosR0FBQTtDQUFJLENBQU8sR0FBTixHQUFBO0NBQUQsQ0FBaUIsSUFBUCxFQUFBO0FBQXNCLENBQWhDLENBQStCLE1BQVgsRUFBQTtBQUEwQixDQUE5QyxDQUE2QyxNQUFWLENBQUE7UUFBeEM7Q0FIMUMsS0FHQTtDQUNVLENBQVYsRUFBYSxFQUFBLEdBQUosRUFBVDtDQUFvQyxDQUFLLENBQUosR0FBQTtDQUFJLENBQVMsS0FBUixDQUFBO1FBQU47Q0FMaEMsS0FLSjtDQTVDRCxFQXVDSzs7Q0F2Q0wsRUE4Q0EsTUFBSztDQUNKLENBQUEsTUFBQTtDQUFBLENBQUEsQ0FBSyxDQUFMLFNBQUs7Q0FDTCxDQUFZLEVBQVosSUFBVTtDQUFWLFdBQUE7TUFEQTtDQUFBLENBRUEsRUFBQSxLQUFTLEdBQUk7Q0FBNkIsQ0FBSyxDQUFKLEdBQUE7Q0FBSSxDQUFPLEdBQU4sR0FBQTtDQUFELENBQWtCLElBQVAsRUFBQTtBQUF1QixDQUFsQyxDQUFpQyxDQUFPLEtBQWxCLEVBQUE7QUFBaUMsQ0FBdkQsQ0FBc0QsQ0FBSyxLQUFmLENBQUE7UUFBakQ7Q0FGMUMsS0FFQTtDQUNVLENBQVYsRUFBYSxFQUFBLEdBQUosRUFBVDtDQUFvQyxDQUFLLENBQUosR0FBQTtDQUFJLENBQVMsS0FBUixDQUFBO1FBQU47Q0FKakMsS0FJSDtDQWxERCxFQThDSTs7Q0E5Q0osRUFvREssQ0FBTCxLQUFLO0NBRUosT0FBQSw2REFBQTtDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsSUFBUztDQUFpQixDQUFLLENBQUosR0FBQTtDQUFJLENBQUssQ0FBSixLQUFBO1FBQU47Q0FBQSxDQUFvQixFQUFMLEVBQUEsQ0FBZjtDQUFBLENBQXdDLENBQXhDLEVBQWtDLENBQUE7Q0FBNUQsS0FBQTtDQUFBLEVBRVMsQ0FBVCxFQUFBO0NBRkEsRUFHYyxDQUFkLEVBQWMsS0FBZDtDQUhBLEVBSVEsQ0FBUixDQUFBO0NBSkEsRUFLVyxDQUFYLElBQUE7Q0FMQSxFQU1XLENBQVgsR0FBQTtDQUVBO0NBQUE7VUFBQSx5Q0FBQTtvQkFBQTtDQUNDLEVBQVcsQ0FBa0IsRUFBN0IsQ0FBeUIsQ0FBekIsR0FBVztDQUFYLEdBQ0MsRUFBRCxDQUFBO0NBREEsRUFFUSxFQUFSLENBQUEsRUFBUTtDQUZSLENBR0EsQ0FBSyxHQUFMO0NBSEEsQ0FJQSxDQUFBLE1BQVM7Q0FBYSxDQUFLLENBQUosS0FBQTtDQUFJLENBQUssQ0FBSixPQUFBO1VBQU47Q0FBQSxDQUFxQixFQUFMLEVBQWhCLEVBQWdCO0NBQWhCLENBQXdDLENBQUksRUFBVixHQUFBO0NBSnhELE9BSUE7Q0FMRDtxQkFWSTtDQXBETCxFQW9ESzs7Q0FwREwsRUFxRUssQ0FBTCxLQUFLO0NBRUosT0FBQSw2REFBQTtDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsSUFBUztDQUFpQixDQUFLLENBQUosR0FBQTtDQUFJLENBQUssQ0FBSixLQUFBO1FBQU47Q0FBQSxDQUFxQixFQUFMLEVBQUEsQ0FBaEI7Q0FBMUIsS0FBQTtDQUFBLEVBRVMsQ0FBVCxFQUFBO0NBRkEsRUFHYyxDQUFkLEVBQWMsS0FBZDtDQUhBLEVBSVEsQ0FBUixDQUFBO0NBSkEsRUFLVyxDQUFYLElBQUE7Q0FMQSxFQU1XLENBQVgsR0FBQTtDQUVBO0NBQUE7VUFBQSx5Q0FBQTtvQkFBQTtDQUNDLEVBQVcsQ0FBa0IsRUFBN0IsQ0FBeUIsQ0FBekIsR0FBVztDQUFYLEdBQ0MsRUFBRCxDQUFBO0NBREEsRUFFUSxFQUFSLENBQUEsRUFBUTtDQUZSLENBR0EsQ0FBSyxHQUFMO0NBSEEsQ0FJQSxDQUFBLE1BQVM7Q0FBYSxDQUFLLENBQUosS0FBQTtDQUFJLENBQUssQ0FBSixPQUFBO1VBQU47Q0FBQSxDQUFvQixFQUFMLEdBQWYsQ0FBZTtDQUFmLENBQXdDLENBQUksRUFBVixHQUFBO0NBSnhELE9BSUE7Q0FMRDtxQkFWSTtDQXJFTCxFQXFFSzs7Q0FyRUw7O0NBTEQiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjoyMjM4LAogICAgImNvbHVtbiI6MAogIH0sCiAgIm1hcCI6IHsKICAgICJ2ZXJzaW9uIjogMywKICAgICJmaWxlIjogImFwcC5qcyIsCiAgICAic291cmNlcyI6IFsic3JjL2FwcC92aWV3cy9yZXB1bHNlL2JhbGwuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIkNpcmNsZSA9IHJlcXVpcmUgXCJkcmF3L2dlb20vY2lyY2xlXCJcbkNhbGMgPSByZXF1aXJlIFwiZHJhdy9tYXRoL2NhbGNcIlxuRHJhdyA9IHJlcXVpcmUoXCJkcmF3L2RyYXdcIilcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBCYWxsIGV4dGVuZHMgQ2lyY2xlXG5cbiAgdng6MFxuICB2eTowXG4gIGFjOjBcbiAgaWRkbGVfeDowXG4gIGlkZGxlX3k6MFxuICBzcGVlZCA6IDFcbiAgZHg6MFxuICBkeTowXG4gIHNwcmluZzowLjJcbiAgYXg6MFxuICBheTowXG4gIHNwZWVkOjAuMVxuICBmcmljdGlvbjowLjlcbiAgcnVuOmZhbHNlXG4gIGluaXRfc3BlZWQ6MFxuICBsaW5lX3g6MFxuICBsaW5lX3k6MFxuICBvcGFjaXR5OjFcblxuICBjb25zdHJ1Y3RvcjooKS0+XG4gICAgc3VwZXJcbiAgICBAc3BlZWQgPSBAaW5pdF9zcGVlZCA9IE1hdGgucmFuZG9tKCkgKiAwLjFcblxuICBzZXR1cDooQGN0eCktPlxuICAgIEBpbml0X3ggPSBAeFxuICAgIEBpbml0X3kgPSBAeVxuICAgIEBpZGRsZV94ID0gQGluaXRfeCArIE1hdGgucmFuZG9tKCkgKiAxMFxuICAgIEBpZGRsZV95ID0gQGluaXRfeSArIE1hdGgucmFuZG9tKCkgKiAxMFxuICAgIEB0YXJnZXRfeCA9IEBpZGRsZV94XG4gICAgQHRhcmdldF95ID0gQGlkZGxlX3lcbiAgICBAbWF4X3JhZCA9IDE1ICsgTWF0aC5yYW5kb20oKSAqIDQwXG4gICAgIyBAYW5nbGUgPSBDYWxjLmFuZyBAeCxAeSxAaWRkbGVfeCxAaWRkbGVfeVxuXG4gIHVwZGF0ZTooQG1vdXNlWCwgQG1vdXNlWSktPlxuICAgICMgY29uc29sZS5sb2cgQ2FsYy5kaXN0IEB4LEB5LEBpZGRsZV94LEBpZGRsZV95XG4gICAgIyBjb25zb2xlLmxvZyBDYWxjLmFuZyBAeCxAeSxAaWRkbGVfeCxAaWRkbGVfeVxuICAgICMgQGRpc3RhbmNlID0gQ2FsYy5kaXN0IEB4LEB5LEBpZGRsZV94LEBpZGRsZV95XG5cbiAgICBAbW91c2VfZGlzdCA9IENhbGMuZGlzdCBAeCxAeSxtb3VzZVgsbW91c2VZXG5cbiAgICBpZiBAbW91c2VfZGlzdCA8IDE1MFxuICAgICAgQHNwZWVkID0gMC4yXG4gICAgICBAc3ByaW5nPTAuM1xuICAgICAgbW91c2VfYW5nbGUgPSBDYWxjLmFuZyBtb3VzZVgsIG1vdXNlWSwgQGlkZGxlX3gsIEBpZGRsZV95IFxuICAgICAgbW91c2VfYW5nbGUgPSBDYWxjLmRlZzJyYWQgbW91c2VfYW5nbGVcbiAgICAgIGR4ID0gTWF0aC5jb3MgbW91c2VfYW5nbGVcbiAgICAgIGR5ID0gTWF0aC5zaW4gbW91c2VfYW5nbGVcbiAgICAgIEB0YXJnZXRfeCA9IChtb3VzZVggKyBkeCAqIDE0MClcbiAgICAgIEBsaW5lX3ggPSAobW91c2VYICsgZHggKiA3MClcbiAgICAgIEB0YXJnZXRfeSA9IChtb3VzZVkgKyBkeSAqIDE0MClcbiAgICAgIEBsaW5lX3kgPSAobW91c2VZICsgZHkgKiA3MClcbiAgICBlbHNlXG4gICAgICBAc3ByaW5nPTAuMlxuICAgICAgQHRhcmdldF95ID0gQGlkZGxlX3lcbiAgICAgIEB0YXJnZXRfeCA9IEBpZGRsZV94XG5cbiAgICBpZiBAbW91c2VfZGlzdCA+IDIwMFxuICAgICAgQHNwZWVkID0gQGluaXRfc3BlZWRcblxuICAgIGlmIEBtb3VzZV9kaXN0IDwgMjMwXG4gICAgICBAcmFkaXVzID0gKEBtb3VzZV9kaXN0ICogMTAwKSAvIDIzMFxuICAgICAgQHJhZGl1cyA9IEBtYXhfcmFkIC0gKEByYWRpdXMgKiBAbWF4X3JhZCkgLyAxMDBcbiAgICBlbHNlXG4gICAgICBAcmFkaXVzID0gMVxuXG4gICAgaWYgQHJhZGl1cyA8IDFcbiAgICAgIEByYWRpdXMgPSAxXG5cblxuICAgIEBkeCA9IEB0YXJnZXRfeCAtIEB4XG4gICAgQGR5ID0gQHRhcmdldF95IC0gQHlcbiAgICBAYXggPSBAZHggKiBAc3ByaW5nXG4gICAgQGF5ID0gQGR5ICogQHNwcmluZ1xuXG4gICAgQHZ4ICs9IEBheFxuICAgIEB2eSArPSBAYXlcblxuICAgIGlmIEB2eCA+IDEgb3IgQHZ4IDwgLTFcbiAgICAgIEB2eCAqPSBAZnJpY3Rpb25cbiAgICBpZiBAdnkgPiAxIG9yIEB2eSA8IC0xXG4gICAgICBAdnkgKj0gQGZyaWN0aW9uXG5cbiAgICBAeCArPSBAdnggKiBAc3BlZWRcbiAgICBAeSArPSBAdnkgKiBAc3BlZWRcblxuICBkcmF3OigpLT5cbiAgICBzdXBlclxuXG4gICAgaWYgQHJhZGl1cyA+IDVcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBcIiMwMDAwMDBcIlxuICAgICAgQGN0eC5zdHJva2VXaWR0aCA9IDFcbiAgICAgIEBjdHgubW92ZVRvIEB4LCAgQHlcbiAgICAgIEBjdHgubGluZVRvIE1hdGgucm91bmQoQHggLSAzKSwgTWF0aC5yb3VuZChAeSAtIDMpXG4gICAgICBAY3R4Lm1vdmVUbyBAeCwgIEB5XG4gICAgICBAY3R4LmxpbmVUbyBNYXRoLnJvdW5kKEB4ICsgMyksIE1hdGgucm91bmQoQHkgKyAzKVxuICAgICAgQGN0eC5tb3ZlVG8gQHgsICBAeVxuICAgICAgQGN0eC5saW5lVG8gTWF0aC5yb3VuZChAeCArIDMpLCBNYXRoLnJvdW5kKEB5IC0gMylcbiAgICAgIEBjdHgubW92ZVRvIEB4LCAgQHlcbiAgICAgIEBjdHgubGluZVRvIE1hdGgucm91bmQoQHggLSAzKSwgTWF0aC5yb3VuZChAeSArIDMpXG4gICAgICBAY3R4LnN0cm9rZSgpXG5cblxuXG5cbiJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLG9CQUFBO0dBQUE7a1NBQUE7O0FBQUEsQ0FBQSxFQUFTLEdBQVQsQ0FBUyxXQUFBOztBQUNULENBREEsRUFDTyxDQUFQLEdBQU8sU0FBQTs7QUFDUCxDQUZBLEVBRU8sQ0FBUCxHQUFPLElBQUE7O0FBRVAsQ0FKQSxFQUl1QixHQUFqQixDQUFOO0NBRUU7O0NBQUEsQ0FBQSxDQUFHOztDQUFILENBQ0EsQ0FBRzs7Q0FESCxDQUVBLENBQUc7O0NBRkgsRUFHUSxJQUFSOztDQUhBLEVBSVEsSUFBUjs7Q0FKQSxFQUtRLEVBQVI7O0NBTEEsQ0FNQSxDQUFHOztDQU5ILENBT0EsQ0FBRzs7Q0FQSCxFQVFPLEdBQVA7O0NBUkEsQ0FTQSxDQUFHOztDQVRILENBVUEsQ0FBRzs7Q0FWSCxFQVdNLEVBQU47O0NBWEEsRUFZUyxLQUFUOztDQVpBLEVBYUEsRUFiQTs7Q0FBQSxFQWNXLE9BQVg7O0NBZEEsRUFlTyxHQUFQOztDQWZBLEVBZ0JPLEdBQVA7O0NBaEJBLEVBaUJRLElBQVI7O0NBRVksQ0FBQSxDQUFBLFdBQUE7Q0FDVixHQUFBLEtBQUEsOEJBQUE7Q0FBQSxFQUNTLENBQVQsQ0FBQSxDQUF1QixJQUFkO0NBckJYLEVBbUJZOztDQW5CWixFQXVCTSxFQUFOLElBQVE7Q0FDTixFQURNLENBQUQ7Q0FDTCxFQUFVLENBQVYsRUFBQTtDQUFBLEVBQ1UsQ0FBVixFQUFBO0NBREEsQ0FBQSxDQUVXLENBQVgsRUFBVyxDQUFYO0NBRkEsQ0FBQSxDQUdXLENBQVgsRUFBVyxDQUFYO0NBSEEsRUFJWSxDQUFaLEdBSkEsQ0FJQTtDQUpBLEVBS1ksQ0FBWixHQUxBLENBS0E7Q0FDQyxDQUFVLENBQUEsQ0FBVixFQUFlLENBQWhCLElBQUE7Q0E5QkYsRUF1Qk07O0NBdkJOLENBaUNrQixDQUFYLEdBQVAsR0FBUztDQUtQLE9BQUEsV0FBQTtDQUFBLEVBTE8sQ0FBRCxFQUtOO0NBQUEsRUFMZ0IsQ0FBRCxFQUtmO0NBQUEsQ0FBMkIsQ0FBYixDQUFkLEVBQWMsSUFBZDtDQUVBLEVBQWlCLENBQWpCLE1BQUc7Q0FDRCxFQUFTLENBQVIsQ0FBRCxDQUFBO0NBQUEsRUFDUSxDQUFQLEVBQUQ7Q0FEQSxDQUUrQixDQUFqQixDQUFJLEVBQWxCLENBQWMsSUFBZDtDQUZBLEVBR2MsQ0FBSSxFQUFsQixDQUFjLElBQWQ7Q0FIQSxDQUlBLENBQUssQ0FBSSxFQUFULEtBQUs7Q0FKTCxDQUtBLENBQUssQ0FBSSxFQUFULEtBQUs7Q0FMTCxDQU1zQixDQUFULENBQVosRUFBRCxFQUFBO0NBTkEsQ0FPb0IsQ0FBVCxDQUFWLEVBQUQ7Q0FQQSxDQVFzQixDQUFULENBQVosRUFBRCxFQUFBO0NBUkEsQ0FTb0IsQ0FBVCxDQUFWLEVBQUQ7TUFWRjtDQVlFLEVBQVEsQ0FBUCxFQUFEO0NBQUEsRUFDWSxDQUFYLEVBQUQsQ0FEQSxDQUNBO0NBREEsRUFFWSxDQUFYLEVBQUQsQ0FGQSxDQUVBO01BaEJGO0NBa0JBLEVBQWlCLENBQWpCLE1BQUc7Q0FDRCxFQUFTLENBQVIsQ0FBRCxDQUFBLElBQUE7TUFuQkY7Q0FxQkEsRUFBaUIsQ0FBakIsTUFBRztDQUNELEVBQVUsQ0FBVCxFQUFELElBQVc7Q0FBWCxFQUNVLENBQVQsRUFBRCxDQUFVO01BRlo7Q0FJRSxFQUFVLENBQVQsRUFBRDtNQXpCRjtDQTJCQSxFQUFhLENBQWIsRUFBRztDQUNELEVBQVUsQ0FBVCxFQUFEO01BNUJGO0NBQUEsQ0ErQkEsQ0FBTSxDQUFOLElBQU07Q0EvQk4sQ0FnQ0EsQ0FBTSxDQUFOLElBQU07Q0FoQ04sQ0FpQ0EsQ0FBTSxDQUFOLEVBakNBO0NBQUEsQ0FrQ0EsQ0FBTSxDQUFOLEVBbENBO0NBQUEsQ0FvQ0EsRUFBQTtDQXBDQSxDQXFDQSxFQUFBO0FBRXFCLENBQXJCLENBQUcsQ0FBTSxDQUFUO0NBQ0UsQ0FBQSxFQUFDLEVBQUQsRUFBQTtNQXhDRjtBQXlDcUIsQ0FBckIsQ0FBRyxDQUFNLENBQVQ7Q0FDRSxDQUFBLEVBQUMsRUFBRCxFQUFBO01BMUNGO0NBQUEsQ0E0Q00sQ0FBTSxDQUFaLENBNUNBO0NBNkNDLENBQUssQ0FBTSxDQUFYLE9BQUQ7Q0FuRkYsRUFpQ087O0NBakNQLEVBcUZLLENBQUwsS0FBSztDQUNILEdBQUEsS0FBQSx1QkFBQTtDQUVBLEVBQWEsQ0FBYixFQUFHO0NBQ0QsRUFBSSxDQUFILEVBQUQsR0FBQSxFQUFBO0NBQUEsRUFDSSxDQUFILEVBQUQsS0FBQTtDQURBLENBRWlCLENBQWIsQ0FBSCxFQUFEO0NBRkEsQ0FHZ0MsQ0FBNUIsQ0FBSCxDQUFXLENBQVo7Q0FIQSxDQUlpQixDQUFiLENBQUgsRUFBRDtDQUpBLENBS2dDLENBQTVCLENBQUgsQ0FBVyxDQUFaO0NBTEEsQ0FNaUIsQ0FBYixDQUFILEVBQUQ7Q0FOQSxDQU9nQyxDQUE1QixDQUFILENBQVcsQ0FBWjtDQVBBLENBUWlCLENBQWIsQ0FBSCxFQUFEO0NBUkEsQ0FTZ0MsQ0FBNUIsQ0FBSCxDQUFXLENBQVo7Q0FDQyxFQUFHLENBQUgsRUFBRCxPQUFBO01BZEM7Q0FyRkwsRUFxRks7O0NBckZMOztDQUZrQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjIzNzUsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL3ZpZXdzL3JlcHVsc2UvaW5kZXguY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIkFwcFZpZXcgPSByZXF1aXJlICdhcHAvdmlld3MvYXBwX3ZpZXcnXG5EcmF3ID0gcmVxdWlyZShcImRyYXcvZHJhd1wiKVxuQmFsbCA9IHJlcXVpcmUgXCIuL2JhbGxcIlxuVGFyZ2V0ID0gcmVxdWlyZSBcIi4vdGFyZ2V0XCJcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBJbmRleCBleHRlbmRzIEFwcFZpZXdcblxuICBOVU1fQkFMTFM9IDFcblxuICBkZXN0cm95Oj0+XG4gICAgQGN0eC5jbGVhcigpXG4gICAgQGN0eC5kZXN0cm95KClcbiAgICBzdXBlclxuXG4gIGFmdGVyX3JlbmRlcjooKS0+XG5cbiAgICBOVU1fQkFMTFMgPSAoJCh3aW5kb3cpLndpZHRoKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkpIC8gMlxuXG4gICAgaWYgQGN0eFxuICAgICAgQGN0eC5jbGVhcigpXG4gICAgICBAY3R4LmRlc3Ryb3koKVxuXG4gICAgQGN0eCA9IHdpbmRvdy5Ta2V0Y2guY3JlYXRlXG5cbiAgICAgIGNvbnRhaW5lcjpAZWwuZ2V0KDApXG5cbiAgICAgIHNldHVwOigpLT5cblxuICAgICAgICBEcmF3LkNUWCA9ICQoXCIuc2tldGNoXCIpLmdldCgwKS5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAgICAgQGJhbGxzID0gW11cbiAgICAgICAgaSA9IDBcblxuICAgICAgICB3aGlsZSBpIDwgTlVNX0JBTExTXG4gICAgICAgICAgYmFsbCA9IG5ldyBCYWxsIDEsIFwiI2ZmZmZmZlwiXG4gICAgICAgICAgYmFsbC54ID0gTWF0aC5yYW5kb20oKSAqIEB3aWR0aFxuICAgICAgICAgIGJhbGwueSA9IE1hdGgucmFuZG9tKCkgKiBAaGVpZ2h0XG4gICAgICAgICAgYmFsbC5zZXR1cChEcmF3LkNUWClcbiAgICAgICAgICBAYmFsbHMucHVzaCBiYWxsXG4gICAgICAgICAgaSsrXG5cbiAgICAgIG1vdXNlZG93bjooKS0+XG5cblxuICAgICAgdXBkYXRlOigpLT5cbiAgICAgICAgYmFsbC51cGRhdGUoQG1vdXNlLngsIEBtb3VzZS55KSBmb3IgYmFsbCBpbiBAYmFsbHNcblxuICAgICAgZHJhdzooKS0+XG4gICAgICAgIGJhbGwuZHJhdygpIGZvciBiYWxsIGluIEBiYWxsc1xuXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxvQ0FBQTtHQUFBOztrU0FBQTs7QUFBQSxDQUFBLEVBQVUsSUFBVixhQUFVOztBQUNWLENBREEsRUFDTyxDQUFQLEdBQU8sSUFBQTs7QUFDUCxDQUZBLEVBRU8sQ0FBUCxHQUFPLENBQUE7O0FBQ1AsQ0FIQSxFQUdTLEdBQVQsQ0FBUyxHQUFBOztBQUVULENBTEEsRUFLdUIsR0FBakIsQ0FBTjtDQUVFLEtBQUEsR0FBQTs7Q0FBQTs7Ozs7O0NBQUE7O0NBQUEsQ0FBQSxDQUFXLE1BQVg7O0NBQUEsRUFFUSxJQUFSLEVBQVE7Q0FDTixFQUFJLENBQUosQ0FBQTtDQUFBLEVBQ0ksQ0FBSixHQUFBO0NBRk0sUUFHTixFQUFBLHlCQUFBO0NBTEYsRUFFUTs7Q0FGUixFQU9hLE1BQUEsR0FBYjtDQUVFLEVBQVksQ0FBWixDQUFhLENBQUEsR0FBYjtDQUVBLEVBQUEsQ0FBQTtDQUNFLEVBQUksQ0FBSCxDQUFELENBQUE7Q0FBQSxFQUNJLENBQUgsRUFBRCxDQUFBO01BSkY7Q0FNQyxFQUFELENBQUMsRUFBWSxLQUFiO0NBRUUsQ0FBVSxDQUFBLENBQUMsRUFBWCxHQUFBO0NBQUEsQ0FFTSxDQUFBLEVBQU4sQ0FBQSxHQUFNO0NBRUosV0FBQSxLQUFBO0NBQUEsRUFBQSxDQUFJLElBQUosQ0FBVyxDQUFBO0NBQVgsQ0FBQSxDQUVTLENBQVIsQ0FBRCxHQUFBO0NBRkEsRUFHSSxLQUFKO0NBRUE7Q0FBTSxFQUFJLE1BQVYsT0FBTTtDQUNKLENBQW1CLENBQVIsQ0FBWCxLQUFXLENBQVg7Q0FBQSxFQUNTLENBQUwsQ0FESixDQUNTLElBQVQ7Q0FEQSxFQUVTLENBQUwsRUFBSyxJQUFUO0NBRkEsRUFHQSxDQUFJLENBQUosS0FBQTtDQUhBLEdBSUMsQ0FBSyxLQUFOO0FBQ0EsQ0FMQTtDQURGLFFBQUE7eUJBUEk7Q0FGTixNQUVNO0NBRk4sQ0FpQlUsQ0FBQSxHQUFWLEdBQUE7Q0FqQkEsQ0FvQk8sQ0FBQSxHQUFQLEdBQU87Q0FDTCxXQUFBLG1CQUFBO0NBQUE7Q0FBQTtjQUFBLDhCQUFBOzRCQUFBO0NBQUEsQ0FBc0IsRUFBbEIsQ0FBYyxDQUFsQjtDQUFBO3lCQURLO0NBcEJQLE1Bb0JPO0NBcEJQLENBdUJLLENBQUEsQ0FBTCxFQUFBLEdBQUs7Q0FDSCxXQUFBLG1CQUFBO0NBQUE7Q0FBQTtjQUFBLDhCQUFBOzRCQUFBO0NBQUEsR0FBSTtDQUFKO3lCQURHO0NBdkJMLE1BdUJLO0NBakNJLEtBUUo7Q0FmVCxFQU9hOztDQVBiOztDQUZtQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjI0NjEsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL3ZpZXdzL3JlcHVsc2UvdGFyZ2V0LmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJDaXJjbGUgPSByZXF1aXJlIFwiZHJhdy9nZW9tL2NpcmNsZVwiXG5DYWxjID0gcmVxdWlyZSBcImRyYXcvbWF0aC9jYWxjXCJcbkRyYXcgPSByZXF1aXJlKFwiZHJhdy9kcmF3XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVGFyZ2V0IGV4dGVuZHMgQ2lyY2xlXG5cbiAgdng6MFxuICB2eTowXG4gIHNwZWVkOjFcbiAgZHg6MFxuICBkeTowXG4gIHNwcmluZzowLjJcbiAgYXg6MFxuICBheTowXG4gIGZyaWN0aW9uOjAuN1xuXG4gIGNvbnN0cnVjdG9yOigpLT5cbiAgICBzdXBlclxuXG4gIHNldF90YXJnZXQ6KEB0YXJnZXRfeCwgQHRhcmdldF95KS0+XG5cbiAgdXBkYXRlOigpLT5cblxuICAgIEBkeCA9IEB0YXJnZXRfeCAtIEB4XG4gICAgQGR5ID0gQHRhcmdldF95IC0gQHlcbiAgICBAYXggPSBAZHggKiBAc3ByaW5nXG4gICAgQGF5ID0gQGR5ICogQHNwcmluZ1xuICAgIEB2eCArPSBAYXhcbiAgICBAdnkgKz0gQGF5XG5cbiAgICBAdnggKj0gQGZyaWN0aW9uXG4gICAgQHZ5ICo9IEBmcmljdGlvblxuICAgIEB4ICs9IEB2eCAqIEBzcGVlZFxuICAgIEB5ICs9IEB2eSAqIEBzcGVlZFxuXG4gICAgQHRhcmdldF9hbmdsZSA9IENhbGMuYW5nIEB4LCBAeSwgQHRhcmdldF94LCBAdGFyZ2V0X3lcbiAgICBAdGFyZ2V0X2FuZ2xlID0gQ2FsYy5kZWcycmFkIEB0YXJnZXRfYW5nbGVcbiAgICBAdGFyZ2V0X2Rpc3QgPSBDYWxjLmRpc3QgQHgsQHksQHRhcmdldF94LEB0YXJnZXRfeVxuICAgIEBhbnggPSBNYXRoLmNvcyBAdGFyZ2V0X2FuZ2xlXG4gICAgQGFueSA9IE1hdGguc2luIEB0YXJnZXRfYW5nbGVcblxuICBkcmF3OigpLT5cbiAgICBzdXBlclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBcIiMwMDAwMDBcIlxuICAgIEBjdHguc3Ryb2tlV2lkdGggPSAxXG4gICAgQGN0eC5tb3ZlVG8gQHgsICBAeVxuICAgIEBjdHgubGluZVRvIE1hdGgucm91bmQoQHggLSAzKSwgTWF0aC5yb3VuZChAeSAtIDMpXG4gICAgQGN0eC5tb3ZlVG8gQHgsICBAeVxuICAgIEBjdHgubGluZVRvIE1hdGgucm91bmQoQHggKyAzKSwgTWF0aC5yb3VuZChAeSArIDMpXG4gICAgQGN0eC5tb3ZlVG8gQHgsICBAeVxuICAgIEBjdHgubGluZVRvIE1hdGgucm91bmQoQHggKyAzKSwgTWF0aC5yb3VuZChAeSAtIDMpXG4gICAgQGN0eC5tb3ZlVG8gQHgsICBAeVxuICAgIEBjdHgubGluZVRvIE1hdGgucm91bmQoQHggLSAzKSwgTWF0aC5yb3VuZChAeSArIDMpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gICAgcmFkaXVzeCA9IEByYWRpdXNcbiAgICByYWRpdXN5ID0gQHJhZGl1c1xuXG4gICAgaWYgQHRhcmdldF9kaXN0IDwgQHJhZGl1c1xuICAgICAgcmFkaXVzeCA9IEB0YXJnZXRfZGlzdFxuICAgICAgcmFkaXVzeSA9IEB0YXJnZXRfZGlzdFxuXG5cbiAgICB4ID0gQHggKyAoQGFueCAqIHJhZGl1c3gpXG4gICAgeSA9IEB5ICsgKEBhbnkgKiByYWRpdXN5KVxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gXCIjMDAwMDAwXCJcbiAgICBAY3R4LnN0cm9rZVdpZHRoID0gMVxuICAgIEBjdHgubW92ZVRvIEB4LCBAeVxuICAgIEBjdHgubGluZVRvIHgsIHlcbiAgICBAY3R4LnN0cm9rZSgpXG4gICAgQGN0eC5jbG9zZVBhdGgoKVxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gXCIjZmZmZmZmXCJcbiAgICBAY3R4Lm1vdmVUbyB4LCB5XG4gICAgQGN0eC5saW5lVG8gQHRhcmdldF94LCBAdGFyZ2V0X3lcbiAgICBAY3R4LnN0cm9rZSgpXG4gICAgQGN0eC5jbG9zZVBhdGgoKVxuXG4gICAgXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxzQkFBQTtHQUFBO2tTQUFBOztBQUFBLENBQUEsRUFBUyxHQUFULENBQVMsV0FBQTs7QUFDVCxDQURBLEVBQ08sQ0FBUCxHQUFPLFNBQUE7O0FBQ1AsQ0FGQSxFQUVPLENBQVAsR0FBTyxJQUFBOztBQUVQLENBSkEsRUFJdUIsR0FBakIsQ0FBTjtDQUVFOztDQUFBLENBQUEsQ0FBRzs7Q0FBSCxDQUNBLENBQUc7O0NBREgsRUFFTSxFQUFOOztDQUZBLENBR0EsQ0FBRzs7Q0FISCxDQUlBLENBQUc7O0NBSkgsRUFLTyxHQUFQOztDQUxBLENBTUEsQ0FBRzs7Q0FOSCxDQU9BLENBQUc7O0NBUEgsRUFRUyxLQUFUOztDQUVZLENBQUEsQ0FBQSxhQUFBO0NBQ1YsR0FBQSxLQUFBLGdDQUFBO0NBWEYsRUFVWTs7Q0FWWixDQWF3QixDQUFiLEtBQUEsQ0FBRSxDQUFiO0NBQWtDLEVBQXJCLENBQUQsSUFBc0I7Q0FBQSxFQUFWLENBQUQsSUFBVztDQWJsQyxFQWFXOztDQWJYLEVBZU8sR0FBUCxHQUFPO0NBRUwsQ0FBQSxDQUFNLENBQU4sSUFBTTtDQUFOLENBQ0EsQ0FBTSxDQUFOLElBQU07Q0FETixDQUVBLENBQU0sQ0FBTixFQUZBO0NBQUEsQ0FHQSxDQUFNLENBQU4sRUFIQTtDQUFBLENBSUEsRUFBQTtDQUpBLENBS0EsRUFBQTtDQUxBLENBT0EsRUFBQSxJQVBBO0NBQUEsQ0FRQSxFQUFBLElBUkE7Q0FBQSxDQVNNLENBQU0sQ0FBWixDQVRBO0NBQUEsQ0FVTSxDQUFNLENBQVosQ0FWQTtDQUFBLENBWTZCLENBQWIsQ0FBaEIsSUFBZ0IsSUFBaEI7Q0FaQSxFQWFnQixDQUFoQixHQUFnQixLQUFoQjtDQWJBLENBYzRCLENBQWIsQ0FBZixJQUFlLEdBQWY7Q0FkQSxFQWVBLENBQUEsUUFBTztDQUNOLEVBQUQsQ0FBQyxPQUFELENBQU87Q0FqQ1QsRUFlTzs7Q0FmUCxFQW1DSyxDQUFMLEtBQUs7Q0FDSCxPQUFBLGNBQUE7Q0FBQSxHQUFBLEtBQUEseUJBQUE7Q0FBQSxFQUNJLENBQUosS0FEQSxFQUNBO0NBREEsRUFFSSxDQUFKLE9BQUE7Q0FGQSxDQUdpQixDQUFiLENBQUosRUFBQTtDQUhBLENBSWdDLENBQTVCLENBQUosQ0FBWSxDQUFaO0NBSkEsQ0FLaUIsQ0FBYixDQUFKLEVBQUE7Q0FMQSxDQU1nQyxDQUE1QixDQUFKLENBQVksQ0FBWjtDQU5BLENBT2lCLENBQWIsQ0FBSixFQUFBO0NBUEEsQ0FRZ0MsQ0FBNUIsQ0FBSixDQUFZLENBQVo7Q0FSQSxDQVNpQixDQUFiLENBQUosRUFBQTtDQVRBLENBVWdDLENBQTVCLENBQUosQ0FBWSxDQUFaO0NBVkEsRUFXSSxDQUFKLEVBQUE7Q0FYQSxFQWFVLENBQVYsRUFiQSxDQWFBO0NBYkEsRUFjVSxDQUFWLEVBZEEsQ0FjQTtDQUVBLEVBQWtCLENBQWxCLEVBQUEsS0FBRztDQUNELEVBQVUsQ0FBQyxFQUFYLENBQUEsSUFBQTtDQUFBLEVBQ1UsQ0FBQyxFQUFYLENBQUEsSUFEQTtNQWpCRjtDQUFBLEVBcUJJLENBQUosR0FBUztDQXJCVCxFQXNCSSxDQUFKLEdBQVM7Q0F0QlQsRUF1QkksQ0FBSixLQUFBO0NBdkJBLEVBd0JJLENBQUosS0F4QkEsRUF3QkE7Q0F4QkEsRUF5QkksQ0FBSixPQUFBO0NBekJBLENBMEJnQixDQUFaLENBQUosRUFBQTtDQTFCQSxDQTJCZSxDQUFYLENBQUosRUFBQTtDQTNCQSxFQTRCSSxDQUFKLEVBQUE7Q0E1QkEsRUE2QkksQ0FBSixLQUFBO0NBN0JBLEVBOEJJLENBQUosS0FBQTtDQTlCQSxFQStCSSxDQUFKLEtBL0JBLEVBK0JBO0NBL0JBLENBZ0NlLENBQVgsQ0FBSixFQUFBO0NBaENBLENBaUN1QixDQUFuQixDQUFKLEVBQUEsRUFBQTtDQWpDQSxFQWtDSSxDQUFKLEVBQUE7Q0FDQyxFQUFHLENBQUgsS0FBRCxFQUFBO0NBdkVGLEVBbUNLOztDQW5DTDs7Q0FGb0MiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjoyNTYyLAogICAgImNvbHVtbiI6MAogIH0sCiAgIm1hcCI6IHsKICAgICJ2ZXJzaW9uIjogMywKICAgICJmaWxlIjogImFwcC5qcyIsCiAgICAic291cmNlcyI6IFsic3JjL2FwcC92aWV3cy9zdHJpbmdzL2F1ZGlvLmNvZmZlZSJdLAogICAgInNvdXJjZXNDb250ZW50IjogWyJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEF1ZGlvXG5cbiAgZGFuY2VyOiB7fVxuXG4gIGNvbnN0cnVjdG9yOihAZG9tKS0+XG5cbiAgICBAZGFuY2VyID0gbmV3IERhbmNlclxuXG4gICAgQGRhbmNlci5iZXR3ZWVuIDAsIDExLCAoKS0+XG5cbiAgICAgICMgY29uc29sZS5sb2cgdGhpcy5nZXRGcmVxdWVuY3koMClcblxuICAgIEBkYW5jZXIubG9hZCB7IHNyYzogJ2F1ZGlvL3dpbmQtaG93bC5tcDMnLCBsb29wOnRydWUgfVxuXG4gICAgQGRhbmNlci5wbGF5KClcblxuICBzcGVjdHJ1bTotPlxuXG4gICAgQGRhbmNlci5nZXRTcGVjdHJ1bSgpIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBLElBQUEsQ0FBQTs7QUFBQSxDQUFBLEVBQXVCLEdBQWpCLENBQU47Q0FFRSxDQUFBLENBQVEsR0FBUjs7Q0FFWSxDQUFBLENBQUEsWUFBRTtDQUVaLEVBRlksQ0FBRDtBQUVELENBQVYsRUFBVSxDQUFWLEVBQUE7Q0FBQSxDQUVtQixDQUFJLENBQXZCLEVBQU8sQ0FBUCxFQUF1QjtDQUZ2QixHQU1BLEVBQU87Q0FBTSxDQUFPLENBQUwsR0FBQSxlQUFGO0NBQUEsQ0FBbUMsRUFBTCxFQUFBO0NBTjNDLEtBTUE7Q0FOQSxHQVFBLEVBQU87Q0FaVCxFQUVZOztDQUZaLEVBY1MsS0FBVCxDQUFTO0NBRU4sR0FBQSxFQUFNLEtBQVA7Q0FoQkYsRUFjUzs7Q0FkVDs7Q0FGRiIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjI1ODgsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL3ZpZXdzL3N0cmluZ3MvYmFsbC5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiQ2lyY2xlID0gcmVxdWlyZSBcImRyYXcvZ2VvbS9jaXJjbGVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEJhbGwgZXh0ZW5kcyBDaXJjbGVcblxuICB4OiAwXG4gIHk6IDBcbiAgdng6IDBcbiAgdnk6IDBcbiAgX3BpbjogZmFsc2VcblxuICBjb25zdHJ1Y3RvcjotPlxuICAgIHN1cGVyIFxuICAgIEBtYXNzID0gQHJhZGl1c1xuXG4gIHBvczooeCwgeSktPlxuICAgIEB4ID0gQG9sZF94ID0gQGluaXRfeCA9IHhcbiAgICBAeSA9IEBvbGRfeSA9IEBpbml0X3kgPSB5XG5cbiAgYXBwbHlfZm9yY2U6KGZ4LCBmeSktPlxuXG4gICAgcmV0dXJuIGlmIEBfcGluXG5cbiAgICBAeCArPSBmeFxuICAgIEB5ICs9IGZ5XG5cbiAgdXBkYXRlOi0+XG5cbiAgICByZXR1cm4gaWYgQF9waW5cblxuICAgIHRtcF94ID0gQHhcbiAgICB0bXBfeSA9IEB5XG5cbiAgICBAeCArPSAoQHggLSBAb2xkX3gpICogMC45NVxuICAgIEB5ICs9IChAeSAtIEBvbGRfeSkgKiAwLjk1XG5cbiAgICBAb2xkX3ggPSB0bXBfeFxuICAgIEBvbGRfeSA9IHRtcF95XG5cblxuXG4gIGRyYXc6LT5cblxuICAgIHN1cGVyXG5cbiAgcGluOi0+XG4gICAgQF9waW4gPSB0cnVlXG5cbiAgdW5waW46LT5cbiAgICBAX3BpbiA9IGZhbHNlIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBLElBQUEsUUFBQTtHQUFBO2tTQUFBOztBQUFBLENBQUEsRUFBUyxHQUFULENBQVMsV0FBQTs7QUFFVCxDQUZBLEVBRXVCLEdBQWpCLENBQU47Q0FFRTs7Q0FBQSxFQUFHOztDQUFILEVBQ0c7O0NBREgsQ0FFQSxDQUFJOztDQUZKLENBR0EsQ0FBSTs7Q0FISixFQUlNLENBQU4sQ0FKQTs7Q0FNWSxDQUFBLENBQUEsV0FBQTtDQUNWLEdBQUEsS0FBQSw4QkFBQTtDQUFBLEVBQ1EsQ0FBUixFQURBO0NBUEYsRUFNWTs7Q0FOWixDQVVRLENBQVIsTUFBSztDQUNILEVBQUssQ0FBTCxDQUFLLENBQVM7Q0FDYixFQUFJLENBQUosQ0FBSSxDQUFTLEtBQWQ7Q0FaRixFQVVJOztDQVZKLENBY1ksQ0FBQSxNQUFDLEVBQWI7Q0FFRSxHQUFBO0NBQUEsV0FBQTtNQUFBO0NBQUEsQ0FBQSxFQUVBO0NBQ0MsR0FBQSxPQUFEO0NBbkJGLEVBY1k7O0NBZFosRUFxQk8sR0FBUCxHQUFPO0NBRUwsT0FBQSxJQUFBO0NBQUEsR0FBQTtDQUFBLFdBQUE7TUFBQTtDQUFBLEVBRVEsQ0FBUixDQUFBO0NBRkEsRUFHUSxDQUFSLENBQUE7Q0FIQSxFQUtZLENBQVosQ0FBTTtDQUxOLEVBTVksQ0FBWixDQUFNO0NBTk4sRUFRUyxDQUFULENBQUE7Q0FDQyxFQUFRLENBQVIsQ0FBRCxNQUFBO0NBaENGLEVBcUJPOztDQXJCUCxFQW9DSyxDQUFMLEtBQUs7Q0FBQSxRQUVILEVBQUEscUJBQUE7Q0F0Q0YsRUFvQ0s7O0NBcENMLEVBd0NBLE1BQUk7Q0FDRCxFQUFPLENBQVAsT0FBRDtDQXpDRixFQXdDSTs7Q0F4Q0osRUEyQ00sRUFBTixJQUFNO0NBQ0gsRUFBTyxDQUFQLE9BQUQ7Q0E1Q0YsRUEyQ007O0NBM0NOOztDQUZrQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjI2NTYsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJzcmMvYXBwL3ZpZXdzL3N0cmluZ3MvY29uc3RyYWludC5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiQ2FsYyA9IHJlcXVpcmUgXCJkcmF3L21hdGgvY2FsY1wiXG5EcmF3ID0gcmVxdWlyZSBcImRyYXcvZHJhd1wiXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ29uc3RyYWludFxuXG4gIHAxOiB7fVxuICBwMjoge31cbiAgZGlzdDogMzBcblxuICBjb25zdHJ1Y3RvcjooQHAxLCBAcDIpLT5cblxuICAgIEBkaXN0ID0gQ2FsYy5kaXN0IEBwMS54LCBAcDEueSwgQHAyLngsIEBwMi55XG5cbiAgdXBkYXRlOihpc19tb3VzZV9kb3duID0gZmFsc2UpLT5cblxuICAgIGlmIGlzX21vdXNlX2Rvd25cblxuICAgICAgZHggPSBAcDIueCAtIEBwMS54XG4gICAgICBkeSA9IEBwMi55IC0gQHAxLnlcblxuICAgICAgZGlzdCA9IENhbGMuZGlzdCBAcDIueCwgQHAyLnksIEBwMS54LCBAcDEueVxuXG4gICAgICBkaWZmID0gKEBkaXN0IC0gZGlzdCkgLyBkaXN0XG5cbiAgICAgIGZ4ID0gKGRpZmYgKiBkeCkgKiAwLjVcbiAgICAgIGZ5ID0gKGRpZmYgKiBkeSkgKiAwLjVcblxuICAgICAgQHAxLmFwcGx5X2ZvcmNlIC1meCwgLWZ5XG4gICAgICBAcDIuYXBwbHlfZm9yY2UgZngsIGZ5XG5cbiAgICBlbHNlXG5cbiAgICAgIGR4ID0gQHAxLmluaXRfeCAtIEBwMS54XG4gICAgICBkeSA9IEBwMS5pbml0X3kgLSBAcDEueVxuICAgICAgQHAxLmFwcGx5X2ZvcmNlIGR4ICogMC4wMDEsIGR5ICogMC4wMDFcblxuICAgICAgZHggPSBAcDIuaW5pdF94IC0gQHAyLnhcbiAgICAgIGR5ID0gQHAyLmluaXRfeSAtIEBwMi55XG4gICAgICBAcDIuYXBwbHlfZm9yY2UgZHggKiAwLjAwMSwgZHkgKiAwLjAwMVxuXG5cbiJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLGtCQUFBOztBQUFBLENBQUEsRUFBTyxDQUFQLEdBQU8sU0FBQTs7QUFDUCxDQURBLEVBQ08sQ0FBUCxHQUFPLElBQUE7O0FBRVAsQ0FIQSxFQUd1QixHQUFqQixDQUFOO0NBRUUsQ0FBQSxDQUFJOztDQUFKLENBQ0EsQ0FBSTs7Q0FESixDQUFBLENBRU0sQ0FBTjs7Q0FFWSxDQUFBLENBQUEsaUJBQUU7Q0FFWixDQUFBLENBRlksQ0FBRDtDQUVYLENBQUEsQ0FGaUIsQ0FBRDtDQUVoQixDQUFxQixDQUFiLENBQVI7Q0FORixFQUlZOztDQUpaLEVBUU8sR0FBUCxHQUFRLElBQUQ7Q0FFTCxPQUFBLGtCQUFBOztHQUZzQixHQUFoQjtNQUVOO0NBQUEsR0FBQSxTQUFBO0NBRUUsQ0FBQSxDQUFLLENBQUMsRUFBTjtDQUFBLENBQ0EsQ0FBSyxDQUFDLEVBQU47Q0FEQSxDQUdvQixDQUFiLENBQVAsRUFBQTtDQUhBLEVBS08sQ0FBUCxFQUFBO0NBTEEsQ0FPQSxDQUFLLENBQUMsRUFBTjtDQVBBLENBUUEsQ0FBSyxDQUFDLEVBQU47QUFFaUIsQ0FWakIsQ0FVRyxFQUFGLEVBQUQsS0FBQTtDQUNDLENBQUUsRUFBRixPQUFELEVBQUE7TUFiRjtDQWlCRSxDQUFBLENBQUssQ0FBQyxFQUFOO0NBQUEsQ0FDQSxDQUFLLENBQUMsRUFBTjtDQURBLENBRUcsQ0FBa0IsQ0FBcEIsQ0FBRCxDQUFBLEtBQUE7Q0FGQSxDQUlBLENBQUssQ0FBQyxFQUFOO0NBSkEsQ0FLQSxDQUFLLENBQUMsRUFBTjtDQUNDLENBQUUsQ0FBa0IsQ0FBcEIsQ0FBRCxNQUFBLEVBQUE7TUF6Qkc7Q0FSUCxFQVFPOztDQVJQOztDQUxGIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6MjcwNSwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInNyYy9hcHAvdmlld3Mvc3RyaW5ncy9pbmRleC5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiQXBwVmlldyA9IHJlcXVpcmUgJ2FwcC92aWV3cy9hcHBfdmlldydcbkJhbGwgPSByZXF1aXJlIFwiLi9iYWxsXCJcbkNvbnN0cmFpbnQgPSByZXF1aXJlIFwiLi9jb25zdHJhaW50XCJcbkRyYXcgPSByZXF1aXJlIFwiZHJhdy9kcmF3XCJcbkNhbGMgPSByZXF1aXJlIFwiZHJhdy9tYXRoL2NhbGNcIlxuQXVkaW8gPSByZXF1aXJlIFwiLi9hdWRpb1wiXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSW5kZXggZXh0ZW5kcyBBcHBWaWV3XG5cbiAgTlVNX0NPTFM6IDIwXG4gIE5VTV9ST1dTOiAyMFxuXG4gIFNUUklOR19ESVNUOiAxNVxuICBHUkFWSVRZOiAwLjA1XG4gIENFTlRFUl9YOiAwXG4gIENFTlRFUl9ZOiAwXG5cbiAgcG9pbnRzOiBbXVxuICBzdHJpbmdzOiBbXVxuXG4gIGF1ZGlvOiB7fVxuXG4gIGRlc3Ryb3k6PT5cbiAgICBAY3R4LmNsZWFyKClcbiAgICBAY3R4LmRlc3Ryb3koKVxuICAgIHN1cGVyXG5cbiAgYWZ0ZXJfcmVuZGVyOj0+XG5cbiAgICBfID0gQFxuXG4gICAgQHBvaW50cyA9IFtdXG4gICAgQHN0cmluZ3MgPSBbXVxuXG4gICAgQGN0eCA9IHdpbmRvdy5Ta2V0Y2guY3JlYXRlXG5cbiAgICAgIGNvbnRhaW5lcjpAZWwuZ2V0KDApXG5cbiAgICAgIGF1dG9jbGVhcjp0cnVlXG5cbiAgICAgIHNldHVwOi0+XG5cbiAgICAgICAgXy5DRU5URVJfWCA9IChAd2lkdGggLyAyKSAtIChfLk5VTV9DT0xTICogXy5TVFJJTkdfRElTVCAvIDIpXG4gICAgICAgIF8uQ0VOVEVSX1kgPSAoQGhlaWdodCAvIDIpIC0gKF8uTlVNX1JPV1MgKiBfLlNUUklOR19ESVNUIC8gMilcblxuICAgICAgICBEcmF3LkNUWCA9ICQoXCIuc2tldGNoXCIpLmdldCgwKS5nZXRDb250ZXh0KFwiMmRcIilcbiAgICAgICAgQGJ1aWxkX2dyaWQoKVxuXG5cbiAgICAgICAgQGl0ZXJhdGUgKGJhbGwsIHJvdywgY29sKT0+XG5cbiAgICAgICAgICBpZiByb3cgaXMgMTlcbiAgICAgICAgICAgIF8ucG9pbnRzW3Jvd11bY29sXS5waW4oKVxuXG5cbiAgICAgIHVwZGF0ZTotPlxuXG4gICAgICAgIGZvciBzIGluIF8uc3RyaW5nc1xuXG4gICAgICAgICAgcy51cGRhdGUoQGRyYWcpXG5cblxuICAgICAgICBpZiAoQGRyYWcpXG5cbiAgICAgICAgICBtZCA9IENhbGMuZGlzdCBAZHJhZy54LCBAZHJhZy55LCBAbW91c2UueCwgQG1vdXNlLnlcblxuICAgICAgICAgIGlmIG1kIDwgMzAwXG4gICAgICAgICAgICBAZHJhZy54ID0gQG1vdXNlLnhcbiAgICAgICAgICAgIEBkcmFnLnkgPSBAbW91c2UueVxuXG4gICAgICAgIEBpdGVyYXRlIChiYWxsLCByb3csIGNvbCk9PlxuXG4gICAgICAgICAgYmFsbC51cGRhdGUoKVxuXG4gICAgICBkcmF3Oi0+XG5cbiAgICAgICAgRHJhdy5DVFguZ2xvYmFsQWxwaGEgPSAwLjFcbiAgICAgICAgRHJhdy5DVFguZmlsbFN0eWxlID0gXCIjMDAwXCJcbiAgICAgICAgRHJhdy5DVFguc3Ryb2tlU3R5bGUgPSAnI0ZGRkZGRidcbiAgICAgICAgRHJhdy5DVFgubGluZVdpZHRoID0gMVxuICAgICAgICBEcmF3LkNUWC5iZWdpblBhdGgoKVxuXG4gICAgICAgIGZvciBzIGluIF8uc3RyaW5nc1xuXG4gICAgICAgICAgRHJhdy5DVFgubW92ZVRvIHMucDEueCwgIHMucDEueVxuICAgICAgICAgIERyYXcuQ1RYLmxpbmVUbyBzLnAyLngsICBzLnAyLnlcblxuICAgICAgICBEcmF3LkNUWC5jbG9zZVBhdGgoKVxuICAgICAgICBEcmF3LkNUWC5maWxsKClcbiAgICAgICAgRHJhdy5DVFguc3Ryb2tlKClcbiAgICAgICAgRHJhdy5DVFguZ2xvYmFsQWxwaGEgPSAxXG5cbiAgICAgICAgQGl0ZXJhdGUgKGJhbGwsIHJvdywgY29sKT0+XG5cbiAgICAgICAgICBiYWxsLmRyYXcoKVxuXG4gICAgICBtb3VzZWRvd246LT5cblxuICAgICAgICByYW5nZSA9IDEwMDBcbiAgICAgICAgZHJhZ2dpbmdfYmFsbCA9IG51bGxcblxuICAgICAgICBAaXRlcmF0ZSAoYmFsbCwgcm93LCBjb2wpPT5cbiAgICAgICAgICBkZCA9IENhbGMuZGlzdCBiYWxsLngsIGJhbGwueSwgQG1vdXNlLngsIEBtb3VzZS55XG5cbiAgICAgICAgICBpZiBkZCA8IHJhbmdlXG5cbiAgICAgICAgICAgIHJhbmdlID0gZGRcblxuICAgICAgICAgICAgdW5sZXNzIGJhbGwuX3BpblxuICAgICAgICAgICAgICBkcmFnZ2luZ19iYWxsID0gYmFsbFxuXG5cbiAgICAgICAgQGRyYWcgPSBkcmFnZ2luZ19iYWxsXG5cbiAgICAgIG1vdXNldXA6LT5cblxuICAgICAgICBAZHJhZyA9IG51bGxcblxuICAgICAgYnVpbGRfZ3JpZDotPlxuXG4gICAgICAgIGFuZ2xlID0gMFxuICAgICAgICBzdGVwID0gMzYwIC8gMTBcbiAgICAgICAgZGlzdCA9IDMwXG5cbiAgICAgICAgcm93cyA9IDBcbiAgICAgICAgd2hpbGUgcm93cyA8IF8uTlVNX1JPV1NcblxuICAgICAgICAgIGNvbHMgPSAwXG5cbiAgICAgICAgICBfLnBvaW50c1tyb3dzXSA9IFtdXG5cbiAgICAgICAgICBkaXN0ICs9IDEwXG5cbiAgICAgICAgICB3aGlsZSBjb2xzIDwgXy5OVU1fQ09MU1xuXG4gICAgICAgICAgICBiYWxsID0gbmV3IEJhbGwgMSwgXCIjZmZmXCJcblxuICAgICAgICAgICAgYW5nbGUgKz0gc3RlcFxuICAgICAgICAgICAgcmFkID0gQ2FsYy5kZWcycmFkIGFuZ2xlXG5cblxuICAgICAgICAgICAgeCA9IChAd2lkdGggLyAyKSArIChNYXRoLmNvcyhyYWQpICogZGlzdClcbiAgICAgICAgICAgIHkgPSAoQGhlaWdodCAvIDIpICsgKE1hdGguc2luKHJhZCkgKiBkaXN0KVxuXG4gICAgICAgICAgICBiYWxsLnBvcyB4LCB5XG5cbiAgICAgICAgICAgIF8ucG9pbnRzW3Jvd3NdW2NvbHNdID0gYmFsbFxuXG5cbiAgICAgICAgICAgIGlmIGNvbHMgPiAwXG5cbiAgICAgICAgICAgICAgc3RyaW5nID0gbmV3IENvbnN0cmFpbnQgXy5wb2ludHNbcm93c11bY29scyAtIDFdLCBfLnBvaW50c1tyb3dzXVtjb2xzXVxuICAgICAgICAgICAgICBfLnN0cmluZ3MucHVzaCBzdHJpbmdcblxuICAgICAgICAgICAgaWYgcm93cyA+IDBcblxuICAgICAgICAgICAgICBzdHJpbmcgPSBuZXcgQ29uc3RyYWludCBfLnBvaW50c1tyb3dzXVtjb2xzXSwgXy5wb2ludHNbcm93cyAtIDFdW2NvbHNdXG4gICAgICAgICAgICAgIF8uc3RyaW5ncy5wdXNoIHN0cmluZ1xuXG4gICAgICAgICAgICBjb2xzKytcbiAgICAgICAgICBcblxuICAgICAgICAgIHJvd3MrK1xuXG4gICAgICBpdGVyYXRlOihmbiktPlxuXG4gICAgICAgIHJvd3MgPSAwXG5cbiAgICAgICAgd2hpbGUgcm93cyA8IF8ucG9pbnRzLmxlbmd0aFxuXG4gICAgICAgICAgY29scyA9IDBcblxuICAgICAgICAgIHdoaWxlIGNvbHMgPCBfLk5VTV9DT0xTXG5cbiAgICAgICAgICAgIGZuKF8ucG9pbnRzW3Jvd3NdW2NvbHNdLCByb3dzLCBjb2xzKVxuXG4gICAgICAgICAgICBjb2xzKytcblxuICAgICAgICAgIHJvd3MrK1xuXG5cblxuXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxxREFBQTtHQUFBOztrU0FBQTs7QUFBQSxDQUFBLEVBQVUsSUFBVixhQUFVOztBQUNWLENBREEsRUFDTyxDQUFQLEdBQU8sQ0FBQTs7QUFDUCxDQUZBLEVBRWEsSUFBQSxHQUFiLElBQWE7O0FBQ2IsQ0FIQSxFQUdPLENBQVAsR0FBTyxJQUFBOztBQUNQLENBSkEsRUFJTyxDQUFQLEdBQU8sU0FBQTs7QUFDUCxDQUxBLEVBS1EsRUFBUixFQUFRLEVBQUE7O0FBRVIsQ0FQQSxFQU91QixHQUFqQixDQUFOO0NBRUU7Ozs7Ozs7Q0FBQTs7Q0FBQSxDQUFBLENBQVUsS0FBVjs7Q0FBQSxDQUFBLENBQ1UsS0FBVjs7Q0FEQSxDQUFBLENBR2EsUUFBYjs7Q0FIQSxFQUlTLENBSlQsR0FJQTs7Q0FKQSxFQUtVLEtBQVY7O0NBTEEsRUFNVSxLQUFWOztDQU5BLENBQUEsQ0FRUSxHQUFSOztDQVJBLENBQUEsQ0FTUyxJQUFUOztDQVRBLENBQUEsQ0FXTyxFQUFQOztDQVhBLEVBYVEsSUFBUixFQUFRO0NBQ04sRUFBSSxDQUFKLENBQUE7Q0FBQSxFQUNJLENBQUosR0FBQTtDQUZNLFFBR04sRUFBQSx5QkFBQTtDQWhCRixFQWFROztDQWJSLEVBa0JhLE1BQUEsR0FBYjtDQUVFLE9BQUE7Q0FBQSxFQUFJLENBQUo7Q0FBQSxDQUFBLENBRVUsQ0FBVixFQUFBO0NBRkEsQ0FBQSxDQUdXLENBQVgsR0FBQTtDQUVDLEVBQUQsQ0FBQyxFQUFZLEtBQWI7Q0FFRSxDQUFVLENBQUEsQ0FBQyxFQUFYLEdBQUE7Q0FBQSxDQUVVLEVBRlYsRUFFQSxHQUFBO0NBRkEsQ0FJTSxDQUFBLEVBQU4sQ0FBQSxHQUFNO0NBRUosV0FBQTtDQUFBLEVBQWEsQ0FBRSxDQUFELEdBQWQsR0FBNkI7Q0FBN0IsRUFDYSxDQUFFLEVBQUQsRUFBZCxHQUE4QjtDQUQ5QixFQUdBLENBQUksSUFBSixDQUFXLENBQUE7Q0FIWCxHQUlDLElBQUQsRUFBQTtDQUdDLENBQWUsQ0FBUCxDQUFSLEdBQUQsRUFBVSxNQUFWO0NBRUUsQ0FBQSxDQUFHLENBQUEsQ0FBTyxLQUFWO0NBQ0csRUFBUSxHQUFBLGFBQVQ7WUFISztDQUFULFFBQVM7Q0FiWCxNQUlNO0NBSk4sQ0FtQk8sQ0FBQSxHQUFQLEdBQU87Q0FFTCxXQUFBLFVBQUE7V0FBQSxDQUFBO0NBQUE7Q0FBQSxZQUFBLCtCQUFBO3lCQUFBO0NBRUUsR0FBVSxFQUFWLElBQUE7Q0FGRixRQUFBO0NBS0EsR0FBSSxJQUFKO0NBRUUsQ0FBQSxDQUFLLENBQUksQ0FBOEIsS0FBdkM7Q0FFQSxDQUFHLENBQUssQ0FBTCxNQUFIO0NBQ0UsRUFBVSxDQUFULENBQWUsT0FBaEI7Q0FBQSxFQUNVLENBQVQsQ0FBZSxPQUFoQjtZQU5KO1VBTEE7Q0FhQyxDQUFlLENBQVAsQ0FBUixHQUFELEVBQVUsTUFBVjtDQUVPLEdBQUQsRUFBSixXQUFBO0NBRkYsUUFBUztDQWxDWCxNQW1CTztDQW5CUCxDQXNDSyxDQUFBLENBQUwsRUFBQSxHQUFLO0NBRUgsV0FBQSxNQUFBO1dBQUEsQ0FBQTtDQUFBLEVBQVEsQ0FBSixJQUFKLEdBQUE7Q0FBQSxFQUNRLENBQUosRUFESixFQUNBLENBQUE7Q0FEQSxFQUVRLENBQUosSUFBSixDQUZBLEVBRUE7Q0FGQSxFQUdRLENBQUosSUFBSixDQUFBO0NBSEEsRUFJUSxDQUFKLElBQUosQ0FBQTtDQUVBO0NBQUEsWUFBQSwrQkFBQTt5QkFBQTtDQUVFLENBQW9CLENBQVosQ0FBSixFQUFKLElBQUE7Q0FBQSxDQUNvQixDQUFaLENBQUosRUFBSixJQUFBO0NBSEYsUUFOQTtDQUFBLEVBV1EsQ0FBSixJQUFKLENBQUE7Q0FYQSxFQVlRLENBQUosSUFBSjtDQVpBLEVBYVEsQ0FBSixFQUFKLEVBQUE7Q0FiQSxFQWNRLENBQUosSUFBSixHQUFBO0NBRUMsQ0FBZSxDQUFQLENBQVIsR0FBRCxFQUFVLE1BQVY7Q0FFTyxHQUFELGFBQUo7Q0FGRixRQUFTO0NBeERYLE1Bc0NLO0NBdENMLENBNERVLENBQUEsR0FBVixHQUFBO0NBRUUsV0FBQSxRQUFBO1dBQUEsQ0FBQTtDQUFBLEVBQVEsQ0FBUixDQUFBLEdBQUE7Q0FBQSxFQUNnQixDQURoQixJQUNBLEtBQUE7Q0FEQSxDQUdnQixDQUFQLENBQVIsR0FBRCxDQUFBLENBQVU7Q0FDUixDQUFBLFlBQUE7Q0FBQSxDQUFBLENBQUssQ0FBSSxDQUF1QixLQUFoQztDQUVBLENBQUcsQ0FBSyxDQUFMLENBQUgsS0FBQTtDQUVFLENBQUEsQ0FBUSxFQUFSLE9BQUE7QUFFTyxDQUFQLEdBQUEsUUFBQTtDQUFBLEVBQ2tCLFVBQWhCLFFBQUE7Y0FMSjtZQUhPO0NBQVQsUUFBUztDQVdSLEVBQU8sQ0FBUCxXQUFEO0NBNUVGLE1BNERVO0NBNURWLENBOEVRLENBQUEsR0FBUixDQUFBLEVBQVE7Q0FFTCxFQUFPLENBQVAsV0FBRDtDQWhGRixNQThFUTtDQTlFUixDQWtGVyxDQUFBLEdBQVgsR0FBVyxDQUFYO0NBRUUsV0FBQSxvREFBQTtDQUFBLEVBQVEsRUFBUixHQUFBO0NBQUEsQ0FBQSxDQUNPLENBQVAsSUFBQTtDQURBLENBQUEsQ0FFTyxDQUFQLElBQUE7Q0FGQSxFQUlPLENBQVAsSUFBQTtDQUNBO0NBQWMsRUFBRCxDQUFQLElBQU4sUUFBTTtDQUVKLEVBQU8sQ0FBUCxNQUFBO0NBQUEsQ0FBQSxDQUVpQixDQUFSLEVBQUEsSUFBVDtDQUZBLENBQUEsRUFJQSxNQUFBO0NBRUEsRUFBYSxDQUFQLElBQU4sU0FBTTtDQUVKLENBQW1CLENBQVIsQ0FBWCxFQUFXLE1BQVg7Q0FBQSxHQUVTLENBQVQsT0FBQTtDQUZBLEVBR0EsQ0FBVSxDQUFKLEVBQUEsS0FBTjtDQUhBLEVBTUksQ0FBRSxDQUFELE9BQUw7Q0FOQSxFQU9JLENBQUUsRUFBRCxNQUFMO0NBUEEsQ0FTWSxDQUFaLENBQUksUUFBSjtDQVRBLEVBV3VCLENBQWQsRUFBQSxNQUFUO0NBR0EsRUFBVSxDQUFQLFFBQUg7Q0FFRSxDQUFrRCxDQUFyQyxDQUFBLEVBQWIsSUFBYSxJQUFiO0NBQUEsR0FDQSxFQUFBLENBQVMsT0FBVDtjQWpCRjtDQW1CQSxFQUFVLENBQVAsUUFBSDtDQUVFLENBQThDLENBQWpDLENBQUEsRUFBYixJQUFhLElBQWI7Q0FBQSxHQUNBLEVBQUEsQ0FBUyxPQUFUO2NBdEJGO0FBd0JBLENBeEJBLENBQUEsRUF3QkEsUUFBQTtDQWhDRixVQU1BO0FBNkJBLENBbkNBLEdBbUNBO0NBckNGLFFBQUE7eUJBUFM7Q0FsRlgsTUFrRlc7Q0FsRlgsQ0FnSVEsQ0FBQSxHQUFSLENBQUEsRUFBUztDQUVQLFdBQUEsUUFBQTtDQUFBLEVBQU8sQ0FBUCxJQUFBO0NBRUE7Q0FBYyxFQUFELENBQVAsRUFBZSxVQUFmO0NBRUosRUFBTyxDQUFQLE1BQUE7Q0FFQSxFQUFhLENBQVAsSUFBTixTQUFNO0NBRUosQ0FBQSxFQUFZLEVBQUEsTUFBWjtBQUVBLENBRkEsQ0FBQSxFQUVBLFFBQUE7Q0FORixVQUVBO0FBTUEsQ0FSQSxHQVFBO0NBVkYsUUFBQTt5QkFKTTtDQWhJUixNQWdJUTtDQXpJQyxLQU9KO0NBekJULEVBa0JhOztDQWxCYjs7Q0FGbUMiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjoxMDM1MSwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInZlbmRvcnMvdGhlb3JpY3VzL3d3dy9zcmMvdGhlb3JpY3VzL2NvbmZpZy9jb25maWcuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIiMjIypcbiAgQ29uZmlnIG1vZHVsZVxuICBAbW9kdWxlIGNvbmZpZ1xuIyMjXG5cbiMjIypcbiAgQ29uZmlnIGNsYXNzLlxuICBAY2xhc3MgQ29uZmlnXG4jIyNcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ29uZmlnXG5cbiAgIyMjKlxuICAgIElmIHRydWUsIGV4ZWN1dGUgdGhlIF9fZGVmYXVsdF9fIHt7I2Nyb3NzTGluayBcIlZpZXdcIn19IF9fdmlldydzX18ge3svY3Jvc3NMaW5rfX0gdHJhbnNpdGlvbnMgYXQgc3RhcnR1cCwgb3RoZXJ3aXNlLCBza2lwIHRoZW0gYW5kIHJlbmRlciB0aGUgdmlld3Mgd2l0aG91dCB0cmFuc2l0aW9ucy5cblxuICAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gYW5pbWF0ZV9hdF9zdGFydHVwXG4gICMjI1xuICBhbmltYXRlX2F0X3N0YXJ0dXA6IGZhbHNlXG5cbiAgIyMjKlxuICAgIElmIHRydWUsIGF1dG9tYXRpY2FsbHkgaW5zZXJ0IF9fZGVmYXVsdF9fIGZhZGVJbi9mYWRlT3V0IHRyYW5zaXRpb25zIGZvciB0aGUge3sjY3Jvc3NMaW5rIFwiVmlld1wifX0gX192aWV3c19fIHt7L2Nyb3NzTGlua319LlxuXG4gICAgQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVfYXV0b190cmFuc2l0aW9uc1xuICAjIyNcbiAgZW5hYmxlX2F1dG9fdHJhbnNpdGlvbnM6IHRydWVcblxuICAjIyMqXG4gICAgSWYgdHJ1ZSwgc2tpcCBhbGwgdGhlIHt7I2Nyb3NzTGluayBcIlZpZXdcIn19IF9fdmlldydzX18ge3svY3Jvc3NMaW5rfX0gX19kZWZhdWx0X18gdHJhbnNpdGlvbnMuXG5cbiAgICBAcHJvcGVydHkge0Jvb2xlYW59IGRpc2FibGVfdHJhbnNpdGlvbnNcbiAgIyMjXG4gIGRpc2FibGVfdHJhbnNpdGlvbnM6IG51bGxcblxuICAjIyMqXG4gIENvbmZpZyBjb25zdHJ1Y3RvciwgaW5pdGlhbGl6aW5nIHRoZSBhcHAncyBjb25maWcgc2V0dGluZ3MgZGVmaW5lZCBpbiBgc2V0dGluZ3MuY29mZmVlYFxuXG4gIEBjbGFzcyBDb25maWdcbiAgQGNvbnN0cnVjdG9yXG4gIEBwYXJhbSB0aGUge1RoZW9yaWN1c30gU2hvcnRjdXQgZm9yIGFwcCdzIGluc3RhbmNlXG4gIEBwYXJhbSBTZXR0aW5ncyB7T2JqZWN0fSBBcHAgc2V0dGluZ3MgZGVmaW5lZCBpbiB0aGUgYHNldHRpbmdzLmNvZmZlZWAuXG4gICMjI1xuICBjb25zdHJ1Y3RvcjooIEB0aGUsIEBTZXR0aW5ncyApLT5cbiAgICBAZGlzYWJsZV90cmFuc2l0aW9ucyA9IEBTZXR0aW5ncy5kaXNhYmxlX3RyYW5zaXRpb25zID8gZmFsc2VcbiAgICBAYW5pbWF0ZV9hdF9zdGFydHVwID0gQFNldHRpbmdzLmFuaW1hdGVfYXRfc3RhcnR1cCA/IHRydWVcbiAgICBAZW5hYmxlX2F1dG9fdHJhbnNpdGlvbnMgPSBAU2V0dGluZ3MuZW5hYmxlX2F1dG9fdHJhbnNpdGlvbnMgPyB0cnVlXG4gICAgQGF1dG9iaW5kID0gQFNldHRpbmdzLmF1dG9iaW5kID8gZmFsc2VcbiAgICBAdmVuZG9ycyA9IEBTZXR0aW5ncy52ZW5kb3JzXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUE7Ozs7Q0FBQTtDQUtBOzs7O0NBTEE7Q0FBQSxHQUFBLEVBQUE7O0FBU0EsQ0FUQSxFQVN1QixHQUFqQixDQUFOO0NBRUU7Ozs7O0NBQUE7Q0FBQSxFQUtvQixFQUxwQixhQUtBOztDQUVBOzs7OztDQVBBOztDQUFBLEVBWXlCLENBWnpCLG1CQVlBOztDQUVBOzs7OztDQWRBOztDQUFBLEVBbUJxQixDQW5CckIsZUFtQkE7O0NBRUE7Ozs7Ozs7O0NBckJBOztDQTZCWSxDQUFBLENBQUEsS0FBQSxRQUFHO0NBQ2IsT0FBQSxpQkFBQTtDQUFBLEVBRGEsQ0FBRDtDQUNaLEVBRG1CLENBQUQsSUFDbEI7Q0FBQSxFQUF1RCxDQUF2RCxDQUFBLGNBQUE7Q0FBQSxFQUNxRCxDQUFyRCxjQUFBO0NBREEsRUFFK0QsQ0FBL0QsbUJBQUE7Q0FGQSxFQUdpQyxDQUFqQyxDQUhBLEdBR0E7Q0FIQSxFQUlXLENBQVgsR0FBQSxDQUFvQjtDQWxDdEIsRUE2Qlk7O0NBN0JaOztDQVhGIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6MTA0MTcsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJ2ZW5kb3JzL3RoZW9yaWN1cy93d3cvc3JjL3RoZW9yaWN1cy9jb3JlL2ZhY3RvcnkuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIiMjIypcbiAgQ29yZSBtb2R1bGVcbiAgQG1vZHVsZSBjb3JlXG4jIyNcblxuTW9kZWwgPSByZXF1aXJlICd0aGVvcmljdXMvbXZjL21vZGVsJ1xuVmlldyA9IHJlcXVpcmUgJ3RoZW9yaWN1cy9tdmMvdmlldydcbkNvbnRyb2xsZXIgPSByZXF1aXJlICd0aGVvcmljdXMvbXZjL2NvbnRyb2xsZXInXG5cbiMjIypcbiAgRmFjdG9yeSBpcyByZXNwb25zaWJsZSBmb3IgbG9hZGluZy9jcmVhdGluZyB0aGUgTVZDIGNsYXNzZXMsIHRlbXBsYXRlcyBhbmQgc3R5bGVzaGVldHMgdXNpbmcgQU1EIGxvYWRlci5cblxuICBAY2xhc3MgRmFjdG9yeVxuIyMjXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRmFjdG9yeVxuXG4gICMjIypcbiAgICBTdG9yZXMgdGhlIGxvYWRlZCBjb250cm9sbGVycyBmb3Igc3Vic2VxdWVudCBjYWxscy5cbiAgICBAcHJvcGVydHkgY29udHJvbGxlcnMge0FycmF5fVxuICAjIyNcbiAgY29udHJvbGxlcnM6IHt9XG5cbiAgIyMjKlxuICBAY2xhc3MgRmFjdG9yeVxuICBAY29uc3RydWN0b3JcbiAgQHBhcmFtIHRoZSB7VGhlb3JpY3VzfSBTaG9ydGN1dCBmb3IgYXBwJ3MgaW5zdGFuY2VcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiggQHRoZSApLT5cbiAgICAjIHNldHMgdGhlIEZhY3RvcnkgaW5zaWRlIE1vZGVsIGNsYXNzLCBzdGF0aWNhbGx5XG4gICAgTW9kZWwuRmFjdG9yeSA9IEBcblxuICAjIyMqXG4gIExvYWRzIGFuZCByZXR1cm5zIGFuIGluc3RhbnRpYXRlZCB7eyNjcm9zc0xpbmsgXCJNb2RlbFwifX0gX19Nb2RlbF9fIHt7L2Nyb3NzTGlua319IGdpdmVuIHRoZSBuYW1lLiBcblxuICBJZiBhIG1vZGVsIGJ5IGdpdmVuIG5hbWUgd2FzIG5vdCBmb3VuZCwgcmV0dXJucyBhbiBpbnN0YW5jZSBvZiBgQXBwTW9kZWxgLlxuXG4gIEBtZXRob2QgbW9kZWxcbiAgQHBhcmFtIG5hbWUge1N0cmluZ30gTW9kZWwgbmFtZS5cbiAgQHBhcmFtIGluaXQge09iamVjdH0gRGVmYXVsdCBwcm9wZXJ0aWVzIHRvIGJlIHNldHRlZCBpbiB0aGUgbW9kZWwgaW5zdGFuY2UuXG4gIEBwYXJhbSBmbiB7RnVuY3Rpb259IENhbGxiYWNrIGZ1bmN0aW9uIHJldHVybmluZyB0aGUgbW9kZWwgaW5zdGFuY2UuXG4gICMjI1xuICBAbW9kZWw9QDo6bW9kZWw9KCBuYW1lLCBpbml0ID0ge30sIGZuICktPlxuICAgICMgY29uc29sZS5sb2cgXCJGYWN0b3J5Lm1vZGVsKCAnI3tuYW1lfScgKVwiXG5cbiAgICBjbGFzc25hbWUgPSBuYW1lLmNhbWVsaXplKClcbiAgICBjbGFzc3BhdGggPSBcImFwcC9tb2RlbHMvI3tuYW1lfVwiLnRvTG93ZXJDYXNlKClcblxuICAgIGlmIChNb2RlbENsYXNzID0gcmVxdWlyZSBjbGFzc3BhdGgpIGlzIG51bGxcbiAgICAgIGNvbnNvbGUuZXJyb3IgXCJNb2RlbCBub3QgZm91bmQgJyN7Y2xhc3NwYXRofSdcIlxuICAgICAgcmV0dXJuIGZuIG51bGxcblxuICAgIHVubGVzcyAobW9kZWwgPSBuZXcgTW9kZWxDbGFzcykgaW5zdGFuY2VvZiBNb2RlbFxuICAgICAgbXNnID0gXCIje2NsYXNzcGF0aH0gaXMgbm90IGEgTW9kZWwgaW5zdGFuY2UsIHlvdSBwcm9iYWJseSBmb3Jnb3QgdG8gXCJcbiAgICAgIG1zZyArPSBcImV4dGVuZCB0aG9yaWN1cy9tdmMvTW9kZWxcIlxuICAgICAgY29uc29sZS5lcnJvciBtc2dcbiAgICAgIHJldHVybiBmbiBudWxsXG5cbiAgICBtb2RlbC5jbGFzc3BhdGggPSBjbGFzc3BhdGhcbiAgICBtb2RlbC5jbGFzc25hbWUgPSBjbGFzc25hbWVcbiAgICBtb2RlbFtwcm9wXSA9IHZhbHVlIGZvciBwcm9wLCB2YWx1ZSBvZiBpbml0XG5cbiAgICBmbiBtb2RlbFxuXG4gICMjIypcbiAgTG9hZHMgYW5kIHJldHVybnMgYW4gaW5zdGFudGlhdGVkIHt7I2Nyb3NzTGluayBcIlZpZXdcIn19IF9fVmlld19fICB7ey9jcm9zc0xpbmt9fSBnaXZlbiB0aGUgbmFtZS4gXG5cbiAgSWYgYSB7eyNjcm9zc0xpbmsgXCJWaWV3XCJ9fSBfX3ZpZXdfXyAge3svY3Jvc3NMaW5rfX0gYnkgZ2l2ZW4gbmFtZSB3YXMgbm90IGZvdW5kLCByZXR1cm5zIGFuIGluc3RhbmNlIG9mIGBBcHBWaWV3YC5cblxuICBAbWV0aG9kIHZpZXdcbiAgQHBhcmFtIHBhdGgge1N0cmluZ30gUGF0aCB0byB0aGUgdmlldyBmaWxlLlxuICBAcGFyYW0gZm4ge0Z1bmN0aW9ufSBDYWxsYmFjayBmdW5jdGlvbiByZXR1cm5pbmcgdGhlIHZpZXcgaW5zdGFuY2UuXG4gICMjI1xuICB2aWV3OiggcGF0aCwgZm4gKS0+XG4gICAgIyBjb25zb2xlLmxvZyBcIkZhY3RvcnkudmlldyggJyN7cGF0aH0nIClcIlxuXG4gICAgY2xhc3NuYW1lID0gKHBhcnRzID0gcGF0aC5zcGxpdCAnLycpLnBvcCgpLmNhbWVsaXplKClcbiAgICBuYW1lc3BhY2UgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXVxuICAgIGNsYXNzcGF0aCA9IFwiYXBwL3ZpZXdzLyN7cGF0aH1cIlxuXG4gICAgaWYgKFZpZXdDbGFzcyA9IHJlcXVpcmUgY2xhc3NwYXRoKSBpcyBudWxsXG4gICAgICBjb25zb2xlLmVycm9yIFwiVmlldyBub3QgZm91bmQgJyN7Y2xhc3NwYXRofSdcIlxuICAgICAgcmV0dXJuIGZuIG51bGxcblxuICAgIHVubGVzcyAodmlldyA9IG5ldyBWaWV3Q2xhc3MpIGluc3RhbmNlb2YgVmlld1xuICAgICAgbXNnID0gXCIje2NsYXNzcGF0aH0gaXMgbm90IGEgVmlldyBpbnN0YW5jZSwgeW91IHByb2JhYmx5IGZvcmdvdCB0byBcIlxuICAgICAgbXNnICs9IFwiZXh0ZW5kIHRob3JpY3VzL212Yy9WaWV3XCJcbiAgICAgIGNvbnNvbGUuZXJyb3IgbXNnXG4gICAgICByZXR1cm4gZm4gbnVsbFxuXG4gICAgIyBkZWZhdWx0cyB0byBBcHBWaWV3IGlmIGdpdmVuIHZpZXcgaXMgbm90IGZvdW5kXG4gICAgIyAoY2FudCBzZWUgYW55IHNlbnNlIG9uIHRoaXMsIHdpbGwgcHJvYmFibHkgYmUgcmVtb3ZlZCBsYXRlcilcbiAgICB2aWV3ID0gbmV3IEFwcFZpZXcgdW5sZXNzIHZpZXc/XG5cbiAgICB2aWV3Ll9ib290IEB0aGVcbiAgICB2aWV3LmNsYXNzcGF0aCA9IGNsYXNzcGF0aFxuICAgIHZpZXcuY2xhc3NuYW1lID0gY2xhc3NuYW1lXG4gICAgdmlldy5uYW1lc3BhY2UgPSBuYW1lc3BhY2VcblxuICAgIGZuIHZpZXdcblxuXG4gICMjIypcbiAgUmV0dXJucyBhbiBpbnN0YW50aWF0ZWQge3sjY3Jvc3NMaW5rIFwiQ29udHJvbGxlclwifX1fX0NvbnRyb2xsZXJfX3t7L2Nyb3NzTGlua319IGdpdmVuIHRoZSBuYW1lLlxuXG4gIElmIHRoZSB7eyNjcm9zc0xpbmsgXCJDb250cm9sbGVyXCJ9fV9fY29udHJvbGxlcl9fe3svY3Jvc3NMaW5rfX0gd2FzIG5vdCBsb2FkZWQgeWVhdCwgbG9hZCBpdCB1c2luZyBBTUQgbG9hZGVyLCBvdGhlcndpc2UsIGdldCBpdCBmcm9tIGBAY29udHJvbGxlcnNgIG9iamVjdC5cblxuICBUaHJvd3MgYW4gZXJyb3IgaWYgbm8gY29udHJvbGxlciBpcyBmb3VuZC5cblxuICBAbWV0aG9kIGNvbnRyb2xsZXJcbiAgQHBhcmFtIG5hbWUge1N0cmluZ30gQ29udHJvbGxlciBuYW1lLlxuICBAcGFyYW0gZm4ge0Z1bmN0aW9ufSBDYWxsYmFjayBmdW5jdGlvbiByZXR1cm5pbmcgdGhlIGNvbnRyb2xsZXIgaW5zdGFuY2UuXG4gICMjI1xuICBjb250cm9sbGVyOiggbmFtZSwgZm4gKS0+XG4gICAgIyBjb25zb2xlLmxvZyBcIkZhY3RvcnkuY29udHJvbGxlciggJyN7bmFtZX0nIClcIlxuXG4gICAgY2xhc3NuYW1lID0gbmFtZS5jYW1lbGl6ZSgpXG4gICAgY2xhc3NwYXRoID0gXCJhcHAvY29udHJvbGxlcnMvI3tuYW1lfVwiXG5cbiAgICBpZiBAY29udHJvbGxlcnNbIGNsYXNzcGF0aCBdP1xuICAgICAgZm4gQGNvbnRyb2xsZXJzWyBjbGFzc3BhdGggXVxuICAgIGVsc2VcblxuICAgICAgaWYgKENvbnRyb2xsZXJDbGFzcyA9IHJlcXVpcmUgY2xhc3NwYXRoKSBpcyBudWxsXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgXCJDb250cm9sbGVyIG5vdCBmb3VuZCAnI3tjbGFzc3BhdGh9J1wiXG4gICAgICAgIHJldHVybiBmbiBudWxsXG5cbiAgICAgIHVubGVzcyAoY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyQ2xhc3MpIGluc3RhbmNlb2YgQ29udHJvbGxlclxuICAgICAgICBtc2cgPSBcIiN7Y2xhc3NwYXRofSBpcyBub3QgYSBDb250cm9sbGVyIGluc3RhbmNlLCB5b3UgcHJvYmFibHkgXCJcbiAgICAgICAgbXNnICs9IFwiZm9yZ290IHRvIGV4dGVuZCB0aG9yaWN1cy9tdmMvQ29udHJvbGxlclwiXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgbXNnXG4gICAgICAgIHJldHVybiBmbiBudWxsXG5cbiAgICAgIGNvbnRyb2xsZXIuY2xhc3NwYXRoID0gY2xhc3NwYXRoXG4gICAgICBjb250cm9sbGVyLmNsYXNzbmFtZSA9IGNsYXNzbmFtZVxuICAgICAgY29udHJvbGxlci5fYm9vdCBAdGhlXG5cbiAgICAgIEBjb250cm9sbGVyc1sgY2xhc3NwYXRoIF0gPSBjb250cm9sbGVyXG4gICAgICBmbiBAY29udHJvbGxlcnNbIGNsYXNzcGF0aCBdXG5cbiAgIyMjKlxuICBSZXR1cm5zIGFuIEFNRCBjb21waWxlZCB0ZW1wbGF0ZS5cblxuICBAbWV0aG9kIHRlbXBsYXRlXG4gIEBwYXJhbSBwYXRoIHtTdHJpbmd9IFBhdGggdG8gdGhlIHRlbXBsYXRlLlxuICBAcGFyYW0gZm4ge0Z1bmN0aW9ufSBDYWxsYmFjayBmdW5jdGlvbiByZXR1cm5pbmcgdGhlIHRlbXBsYXRlIHN0cmluZy5cblxuICBAZXhhbXBsZVxuXG4gICMjI1xuICBAdGVtcGxhdGU9QDo6dGVtcGxhdGU9KCBwYXRoLCBmbiApLT5cbiAgICAjIGNvbnNvbGUubG9nIFwiRmFjdG9yeS50ZW1wbGF0ZSggI3twYXRofSApXCJcbiAgICBjbGFzc3BhdGggPSAndGVtcGxhdGVzLycgKyBwYXRoXG5cbiAgICBpZiAodGVtcGxhdGUgPSByZXF1aXJlIGNsYXNzcGF0aCkgaXMgbnVsbFxuICAgICAgY29uc29sZS5lcnJvciAnVGVtcGxhdGUgbm90IGZvdW5kOiAnICsgY2xhc3NwYXRoXG4gICAgICByZXR1cm4gZm4gbnVsbFxuICAgIFxuICAgIGZuIHRlbXBsYXRlIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBOzs7O0NBQUE7Q0FBQSxHQUFBLDRCQUFBOztBQUtBLENBTEEsRUFLUSxFQUFSLEVBQVEsY0FBQTs7QUFDUixDQU5BLEVBTU8sQ0FBUCxHQUFPLGFBQUE7O0FBQ1AsQ0FQQSxFQU9hLElBQUEsR0FBYixnQkFBYTs7Q0FFYjs7Ozs7Q0FUQTs7QUFlQSxDQWZBLEVBZXVCLEdBQWpCLENBQU47Q0FFRTs7OztDQUFBO0NBQUEsQ0FBQSxDQUlhLFFBQWI7O0NBRUE7Ozs7O0NBTkE7O0NBV1ksQ0FBQSxDQUFBLGNBQUc7Q0FFYixFQUZhLENBQUQ7Q0FFWixFQUFnQixDQUFoQixDQUFLLEVBQUw7Q0FiRixFQVdZOztDQUlaOzs7Ozs7Ozs7O0NBZkE7O0NBQUEsQ0F5QkEsQ0FBTyxDQUFTLENBQWhCLEVBQUMsRUFBUztDQUdSLE9BQUEsaURBQUE7O0dBSDZCLEdBQVA7TUFHdEI7Q0FBQSxFQUFZLENBQVosSUFBWSxDQUFaO0NBQUEsRUFDWSxDQUFaLEtBQUEsRUFBWSxFQUFDO0NBRWIsRUFBaUIsQ0FBakIsQ0FBdUMsRUFBdEIsRUFBQSxDQUFiO0NBQ0YsRUFBaUMsRUFBakMsQ0FBQSxDQUFPLEVBQVEsVUFBQTtDQUNmLENBQU8sRUFBQSxTQUFBO01BTFQ7QUFPQSxDQUFBLEVBQWdCLENBQWhCLENBQVEsS0FBRCxFQUFvQztDQUN6QyxDQUFNLENBQU4sR0FBQSxHQUFNLDBDQUFOO0NBQUEsRUFDQSxDQUFPLEVBQVAscUJBREE7Q0FBQSxFQUVBLEVBQUEsQ0FBQSxDQUFPO0NBQ1AsQ0FBTyxFQUFBLFNBQUE7TUFYVDtDQUFBLEVBYWtCLENBQWxCLENBQUssSUFBTDtDQWJBLEVBY2tCLENBQWxCLENBQUssSUFBTDtBQUNBLENBQUEsUUFBQSxHQUFBOzBCQUFBO0NBQUEsRUFBYyxDQUFSLENBQUEsQ0FBTjtDQUFBLElBZkE7Q0FpQkcsQ0FBSCxHQUFBLE1BQUE7Q0E3Q0YsRUF5QmdCOztDQXNCaEI7Ozs7Ozs7OztDQS9DQTs7Q0FBQSxDQXdEYSxDQUFSLENBQUwsS0FBTztDQUdMLE9BQUEsb0RBQUE7Q0FBQSxFQUFZLENBQVosQ0FBYSxHQUFELENBQVo7Q0FBQSxFQUNZLENBQVosQ0FBa0IsQ0FBQSxHQUFsQjtDQURBLEVBRWEsQ0FBYixLQUFBLEdBQWE7Q0FFYixFQUFnQixDQUFoQixDQUFzQyxFQUF0QixFQUFaO0NBQ0YsRUFBZ0MsRUFBaEMsQ0FBQSxDQUFPLEVBQVEsU0FBQTtDQUNmLENBQU8sRUFBQSxTQUFBO01BTlQ7QUFRQSxDQUFBLEVBQWUsQ0FBZixLQUFPLEdBQWtDO0NBQ3ZDLENBQU0sQ0FBTixHQUFBLEdBQU0seUNBQU47Q0FBQSxFQUNBLENBQU8sRUFBUCxvQkFEQTtDQUFBLEVBRUEsRUFBQSxDQUFBLENBQU87Q0FDUCxDQUFPLEVBQUEsU0FBQTtNQVpUO0NBZ0JBLEdBQUEsUUFBQTtBQUFPLENBQVAsRUFBTyxDQUFQLEVBQUEsQ0FBQTtNQWhCQTtDQUFBLEVBa0JBLENBQUEsQ0FBQTtDQWxCQSxFQW1CaUIsQ0FBakIsS0FBQTtDQW5CQSxFQW9CaUIsQ0FBakIsS0FBQTtDQXBCQSxFQXFCaUIsQ0FBakIsS0FBQTtDQUVHLENBQUgsRUFBQSxPQUFBO0NBbEZGLEVBd0RLOztDQTZCTDs7Ozs7Ozs7Ozs7Q0FyRkE7O0NBQUEsQ0FnR21CLENBQVIsQ0FBQSxLQUFFLENBQWI7Q0FHRSxPQUFBLDhDQUFBO0NBQUEsRUFBWSxDQUFaLElBQVksQ0FBWjtDQUFBLEVBQ2EsQ0FBYixLQUFBLFNBQWE7Q0FFYixHQUFBLCtCQUFBO0NBQ0ssQ0FBSCxFQUFJLEtBQWEsRUFBQSxFQUFqQjtNQURGO0NBSUUsRUFBc0IsQ0FBbkIsQ0FBeUMsQ0FBNUMsQ0FBc0IsRUFBQSxNQUFsQjtDQUNGLEVBQXNDLEVBQXRDLEVBQU8sQ0FBUCxDQUFlLGVBQUE7Q0FDZixDQUFPLEVBQUEsV0FBQTtRQUZUO0FBSUEsQ0FBQSxFQUFxQixDQUFyQixFQUFBLElBQVEsRUFBNkMsR0FBOUM7Q0FDTCxDQUFNLENBQU4sS0FBQSxDQUFNLHFDQUFOO0NBQUEsRUFDQSxDQUFPLElBQVAsa0NBREE7Q0FBQSxFQUVBLEVBQUEsRUFBTyxDQUFQO0NBQ0EsQ0FBTyxFQUFBLFdBQUE7UUFSVDtDQUFBLEVBVXVCLEdBQXZCLEdBQUEsQ0FBVTtDQVZWLEVBV3VCLEdBQXZCLEdBQUEsQ0FBVTtDQVhWLEVBWUEsQ0FBa0IsQ0FBbEIsQ0FBQSxJQUFVO0NBWlYsRUFjNEIsQ0FBM0IsRUFBRCxHQUFjLENBZGQsQ0FjYztDQUNYLENBQUgsRUFBSSxLQUFhLEVBQUEsRUFBakI7TUF6Qk87Q0FoR1gsRUFnR1c7O0NBMkJYOzs7Ozs7Ozs7Q0EzSEE7O0NBQUEsQ0FxSUEsQ0FBVSxDQUFZLEdBQXJCLENBQUQsQ0FBYTtDQUVYLE9BQUEsV0FBQTtDQUFBLEVBQVksQ0FBWixLQUFBLEdBQVk7Q0FFWixFQUFlLENBQWYsQ0FBcUMsRUFBdEIsQ0FBWCxDQUFXO0NBQ2IsRUFBdUMsRUFBdkMsQ0FBQSxDQUFPLEVBQVAsYUFBYztDQUNkLENBQU8sRUFBQSxTQUFBO01BSlQ7Q0FNRyxDQUFILE1BQUEsR0FBQTtDQTdJRixFQXFJc0I7O0NBckl0Qjs7Q0FqQkYiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjoxMDU5NiwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInZlbmRvcnMvdGhlb3JpY3VzL3d3dy9zcmMvdGhlb3JpY3VzL2NvcmUvcHJvY2Vzcy5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiIyMjKlxuICBDb3JlIG1vZHVsZVxuICBAbW9kdWxlIGNvcmVcbiMjI1xuXG5TdHJpbmdVdGlsID0gcmVxdWlyZSAndGhlb3JpY3VzL3V0aWxzL3N0cmluZ191dGlsJ1xuVmlldyA9IHJlcXVpcmUgJ3RoZW9yaWN1cy9tdmMvdmlldydcblxuIyMjKlxuICBSZXNwb25zaWJsZSBmb3IgZXhlY3V0aW5nIHRoZSB7eyNjcm9zc0xpbmsgXCJDb250cm9sbGVyXCJ9fV9fY29udHJvbGxlcl9fe3svY3Jvc3NMaW5rfX0gcmVuZGVyIGFjdGlvbiBiYXNlZCBvbiB0aGUge3sjY3Jvc3NMaW5rIFwiUm91dGVcIn19X19Sb3V0ZV9fe3svY3Jvc3NMaW5rfX0gaW5mb3JtYXRpb24uXG5cbiAgQGNsYXNzIFByb2Nlc3NcbiMjI1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQcm9jZXNzXG5cbiAgIyMjKlxuICB7eyNjcm9zc0xpbmsgXCJDb250cm9sbGVyXCJ9fV9fQ29udHJvbGxlcl9fe3svY3Jvc3NMaW5rfX0gaW5zdGFuY2UsIHJlc3BvbnNpYmxlIGZvciByZW5kZXJpbmcgdGhlIHt7I2Nyb3NzTGluayBcIlZpZXdcIn19X192aWV3c19fe3svY3Jvc3NMaW5rfX0gYmFzZWQgb24gdGhlIF9fYWN0aW9uX18gZGVmaW5lZCBpbiB0aGUge3sjY3Jvc3NMaW5rIFwiUm91dGVcIn19X19Sb3V0ZSdzX197ey9jcm9zc0xpbmt9fSB7eyNjcm9zc0xpbmsgXCJSb3V0ZS90bzpwcm9wZXJ0eVwifX0gX190b19fIHt7L2Nyb3NzTGlua319IHByb3BlcnR5LlxuXG4gIEBwcm9wZXJ0eSB7Q29udHJvbGxlcn0gY29udHJvbGxlclxuICAjIyNcbiAgY29udHJvbGxlcjogbnVsbFxuXG4gICMjIypcbiAge3sjY3Jvc3NMaW5rIFwiUm91dGVcIn19e3svY3Jvc3NMaW5rfX0gc3RvcmluZyB0aGUgaW5mb3JtYXRpb24gd2hpY2ggd2lsbCBiZSB1c2VkIGxvYWQgdGhlIHt7I2Nyb3NzTGluayBcIkNvbnRyb2xsZXJcIn19e3svY3Jvc3NMaW5rfX0gYW5kIHJlbmRlciB0aGUge3sjY3Jvc3NMaW5rIFwiVmlld1wifX0gX192aWV3X18ge3svY3Jvc3NMaW5rfX0uXG4gIFxuICBAcHJvcGVydHkge1JvdXRlfSByb3V0ZVxuICAjIyNcbiAgcm91dGU6IG51bGxcblxuICAjIyMqXG4gIFN0b3JlcyB0aGUgZGVwZW5kZW5jeSB1cmwgZGVmaW5lZCBpbiB0aGUge3sjY3Jvc3NMaW5rIFwiUm91dGVcIn19X19Sb3V0ZSdzX197ey9jcm9zc0xpbmt9fSB7eyNjcm9zc0xpbmsgXCJSb3V0ZS9hdDpwcm9wZXJ0eVwifX0gX19hdF9fe3svY3Jvc3NMaW5rfX0gcHJvcGVydHkuXG4gIFxuICBAcHJvcGVydHkge1N0cmluZ30gZGVwZW5kZW5jeVxuICAjIyNcbiAgZGVwZW5kZW5jeTogbnVsbFxuXG4gICMjIypcbiAgV2lsbCBiZSBzZXR0ZWQgdG8gX19gdHJ1ZWBfXyBpbiB0aGUgX19gcnVuYF9fIG1ldGhvZCwgcmlnaHQgYmVmb3JlIHRoZSBhY3Rpb24gZXhlY3V0aW9uLCBhbmQgc2V0IHRvIF9fYGZhbHNlYF9fIHJpZ2h0IGFmdGVyIHRoZSBhY3Rpb24gaXMgZXhlY3V0ZWQuIFxuXG4gIFRoaXMgd2F5IHRoZSB7eyNjcm9zc0xpbmsgXCJSb3V0ZXIvbmF2aWdhdGU6bWV0aG9kXCJ9fSBfX25hdmlnYXRlX18ge3svY3Jvc3NMaW5rfX0gbWV0aG9kIGNhbiBhYm9ydCB0aGUge3sjY3Jvc3NMaW5rIFwiUHJvY2Vzc1wifX0gX19wcm9jZXNzX18ge3svY3Jvc3NMaW5rfX0gcHJlbWF0dXJlbHkgYXMgbmVlZGVkLlxuICBcbiAgQHByb3BlcnR5IHtCb29sZWFufSBpc19pbl90aGVfbWlkZGxlX29mX3J1bm5pbmdfYW5fYWN0aW9uXG4gICMjI1xuICBpc19pbl90aGVfbWlkZGxlX29mX3J1bm5pbmdfYW5fYWN0aW9uOiBmYWxzZVxuXG4gICMjIypcbiAgU3RvcmVzIHRoZSB7eyNjcm9zc0xpbmsgXCJSb3V0ZVwifX0gX19Sb3V0ZV9fIHt7L2Nyb3NzTGlua319IHBhcmFtZXRlcnMuXG5cbiAgQGV4YW1wbGVcbiAgSWYgdGhlcmUgaXMgYSByb3V0ZSBkZWZpbmVkIHdpdGggYSBwYXJhbWV0ZXIgYGlkYCBsaWtlIHRoaXM6XG5cbiAgICAgICcvd29ya3MvOmlkJzogI3BhcmFtZXRlcnMgYXJlIGRlZmluZWQgaW4gdGhlICc6e3ZhbHVlfScgZm9ybWF0LlxuICAgICAgICAgIHRvOiBcInBhZ2VzL2NvbnRhaW5lclwiXG4gICAgICAgICAgYXQ6IG51bGxcbiAgICAgICAgICBlbDogXCJib2R5XCJcbiAgXG4gIEFuZCB0aGUgdXJsIGNoYW5nZXMgdG86XG5cbiAgICAgICcvd29ya3MvMSdcblxuXG4gIFRoZSBgcGFyYW1zYCB3aWxsIHN0b3JlcyBhbiBgT2JqZWN0YCBsaWtlIHRoaXM6XG5cbiAgICAgIHtpZDoxfVxuXG5cbiAgQHByb3BlcnR5IHtPYmplY3R9IHBhcmFtc1xuICAjIyNcbiAgcGFyYW1zOiBudWxsXG5cbiAgIyMjKlxuICBAY2xhc3MgUHJvY2Vzc1xuICBAY29uc3RydWN0b3JcbiAgQHBhcmFtIEB0aGUge1RoZW9yaWN1c30gU2hvcnRjdXQgZm9yIGFwcCdzIGluc3RhbmNlLlxuICBAcGFyYW0gQHByb2Nlc3NlcyB7UHJvY2Vzc2VzfSB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzZXNcIn19X19Qcm9jZXNzZXNfX3t7L2Nyb3NzTGlua319LCByZXNwb25zaWJsZSBmb3IgZGVsZWdhdGluZyB0aGUgY3VycmVudCB7eyNjcm9zc0xpbmsgXCJSb3V0ZVwifX1fX3JvdXRlX197ey9jcm9zc0xpbmt9fSB0byBpdHMgcmVzcGVjdGl2ZSB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzXCJ9fV9fcHJvY2Vzc19fe3svY3Jvc3NMaW5rfX0uXG4gIEBwYXJhbSBAcm91dGUge1JvdXRlfSB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzZXNcIn19X19Sb3V0ZV9fe3svY3Jvc3NMaW5rfX0gc3RvcmluZyB0aGUgY3VycmVudCBVUkwgaW5mb3JtYXRpb24uXG4gIEBwYXJhbSBAYXQge1JvdXRlfSB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzZXNcIn19X19Sb3V0ZV9fe3svY3Jvc3NMaW5rfX0gZGVwZW5kZW5jeSBkZWZpbmVkIGluIHRoZSB7eyNjcm9zc0xpbmsgXCJSb3V0ZS9hdDpwcm9wZXJ0eVwifX0gX19hdF9fIHt7L2Nyb3NzTGlua319IHByb3BlcnR5LlxuICBAcGFyYW0gQHVybCB7U3RyaW5nfSBDdXJyZW50IHVybCBzdGF0ZS5cbiAgQHBhcmFtIEBwYXJlbnRfcHJvY2VzcyB7UHJvY2Vzc31cbiAgQHBhcmFtIGZuIHtGdW5jdGlvbn0gQ2FsbGJhY2sgdG8gYmUgY2FsbGVkIGFmdGVyIHRoZSBgZGVwZW5kZW5jeWAgaGF2ZSBiZWVuIHNldHRlZCwgYW5kIHRoZSB7eyNjcm9zc0xpbmsgXCJDb250cm9sbGVyXCJ9fV9fY29udHJvbGxlcl9fe3svY3Jvc3NMaW5rfX0gbG9hZGVkLlxuICAjIyNcbiAgY29uc3RydWN0b3I6KCBAdGhlLCBAcHJvY2Vzc2VzLCBAcm91dGUsIEBhdCwgQHVybCwgQHBhcmVudF9wcm9jZXNzLCBmbiApLT5cblxuICAgICMgaW5pdGlhbGl6ZSBwcm9jZXNzIGxvZ2ljXG4gICAgZG8gQGluaXRpYWxpemVcblxuICAgICMgaW5zdGFudGlhdGVzIGNvbnRyb2xsZXIgYW5kIGZpcmVzIHRoZSBjb25zdHJ1Y3RvciBjYWxsYmFja1xuICAgIEB0aGUuZmFjdG9yeS5jb250cm9sbGVyIEByb3V0ZS5jb250cm9sbGVyX25hbWUsICggQGNvbnRyb2xsZXIgKT0+XG4gICAgICBmbiBALCBAY29udHJvbGxlclxuXG4gICMjIypcbiAgRXZhbHVhdGVzIHRoZSBgQHJvdXRlYCBkZXBlbmRlbmN5LlxuICBcbiAgQG1ldGhvZCBpbml0aWFsaXplXG4gICMjI1xuICBpbml0aWFsaXplOi0+XG4gICAgaWYgQHVybCBpcyBudWxsIGFuZCBAcGFyZW50X3Byb2Nlc3M/XG4gICAgICBAdXJsID0gQHJvdXRlLnJld3JpdGVfdXJsX3dpdGhfcGFybXMgQHJvdXRlLm1hdGNoLCBAcGFyZW50X3Byb2Nlc3MucGFyYW1zXG5cbiAgICAjIGluaXRpYWxpemVzIHBhcmFtcyBvYmplY3RcbiAgICBAcGFyYW1zID0gQHJvdXRlLmV4dHJhY3RfcGFyYW1zIEB1cmxcblxuICAgICMgZXZhbHVhdGVzIGRlcGVuZGVuY3kgcm91dGVcbiAgICBpZiBAYXRcbiAgICAgIEBkZXBlbmRlbmN5ID0gQHJvdXRlLnJld3JpdGVfdXJsX3dpdGhfcGFybXMgQGF0LCBAcGFyYW1zXG5cbiAgIyMjKlxuICBFeGVjdXRlcyB0aGUge3sjY3Jvc3NMaW5rIFwiQ29udHJvbGxlclwifX1fX2NvbnRyb2xsZXInc19fe3svY3Jvc3NMaW5rfX0gX19hY3Rpb25fXyBkZWZpbmVkIGluIHRoZSB7eyNjcm9zc0xpbmsgXCJSb3V0ZS90bzpwcm9wZXJ0eVwifX0gX190b19fIHt7L2Nyb3NzTGlua319IHByb3BlcnR5LCBpZiBpdCBpc24ndCBkZWNsYXJlZCBleGVjdXRlcyBhIGRlZmF1bHQgb25lIGJhc2VkIG9uIHRoZSBuYW1lIGNvbnZlbnRpb24uXG4gIFxuICBAcGFyYW0gYWZ0ZXJfcnVuIHtGdW5jdGlvbn0gQ2FsbGJhY2sgdG8gYmUgY2FsbGVkIGFmdGVyIHRoZSB2aWV3IHdhcyByZW5kZXJlZC5cbiAgIyMjXG4gIHJ1bjooIGFmdGVyX3J1biApLT5cbiAgICByZXR1cm4gdW5sZXNzIEBjb250cm9sbGVyP1xuXG4gICAgIyBzZXRzIGlzX2luX3RoZV9taWRkbGVfb2ZfcnVubmluZ19hbl9hY3Rpb249dHJ1ZVxuICAgIEBpc19pbl90aGVfbWlkZGxlX29mX3J1bm5pbmdfYW5fYWN0aW9uID0gdHJ1ZVxuXG4gICAgIyBpZiBhY3Rpb24gaXMgbm90IGRlZmluZWQsIGRlZmluZXMgdGhlIGRlZmF1bHQgYWN0aW9uIGJlaGF2aW91ciBmb3IgaXRcbiAgICB1bmxlc3MgQGNvbnRyb2xsZXJbIGFjdGlvbiA9IEByb3V0ZS5hY3Rpb25fbmFtZSBdXG4gICAgICBAY29udHJvbGxlclsgYWN0aW9uIF0gPSBAY29udHJvbGxlci5fYnVpbGRfYWN0aW9uIEBcblxuICAgICMgaW5qZWN0IHRoZSBjdXJyZW50IHByb2Nlc3MgaW50byBjb250cm9sbGVyXG4gICAgQGNvbnRyb2xsZXIucHJvY2VzcyA9IEBcblxuICAgICMgY3JlYXRlcyBjYWxsYmFjayB0byByZXNldCB0aGluZ3NcbiAgICBAYWZ0ZXJfcnVuID0gPT5cbiAgICAgIEBjb250cm9sbGVyLnByb2Nlc3MgPSBudWxsXG4gICAgICBhZnRlcl9ydW4oKVxuXG4gICAgIyBzZXRzIHRoZSBjYWxsYmFja1xuICAgIEBjb250cm9sbGVyLmFmdGVyX3JlbmRlciA9IEBhZnRlcl9ydW5cblxuICAgICMgZXhlY3V0ZXMgYWN0aW9uXG4gICAgQGNvbnRyb2xsZXJbIGFjdGlvbiBdIEBwYXJhbXNcblxuICAgICMgc2V0cyBpc19pbl90aGVfbWlkZGxlX29mX3J1bm5pbmdfYW5fYWN0aW9uPWZhbHNlXG4gICAgQGlzX2luX3RoZV9taWRkbGVfb2ZfcnVubmluZ19hbl9hY3Rpb24gPSBmYWxzZVxuXG5cblxuICAjIyMqXG4gIEV4ZWN1dGVzIHRoZSB7eyNjcm9zc0xpbmsgXCJWaWV3XCJ9fV9fdmlldydzX197ey9jcm9zc0xpbmt9fSB0cmFuc2l0aW9uIHt7I2Nyb3NzTGluayBcIlZpZXcvb3V0Om1ldGhvZFwifX0gX19vdXRfXyB7ey9jcm9zc0xpbmt9fSBtZXRob2QsIHdhaXQgZm9yIGl0IHRvIGVtcHR5IHRoZSBkb20gZWxlbWVudCBhbmQgdGhlbiBjYWxsIHRoZSBgQGFmdGVyX2Rlc3Ryb3lgIGNhbGxiYWNrLlxuICBcbiAgQG1ldGhvZCBkZXN0cm95XG4gIEBwYXJhbSBAYWZ0ZXJfZGVzdHJveSB7RnVuY3Rpb259IENhbGxiYWNrIHRvIGJlIGNhbGxlZCBhZnRlciB0aGUgdmlldyB3YXMgcmVtb3ZlZC5cbiAgIyMjXG4gIGRlc3Ryb3k6KCBAYWZ0ZXJfZGVzdHJveSApLT5cbiAgICAjIGNhbGwgdGhlIE9VVCB0cmFuc2l0aW9uIHdpdGggdGhlIGdpdmVuIGNhbGxiYWNrXG4gICAgdW5sZXNzIChAdmlldyBpbnN0YW5jZW9mIFZpZXcpXG4gICAgICBjb250cm9sbGVyX25hbWUgPSBAcm91dGUuY29udHJvbGxlcl9uYW1lLmNhbWVsaXplKClcbiAgICAgIGFjdGlvbl9uYW1lID0gQHJvdXRlLmFjdGlvbl9uYW1lXG4gICAgICBtc2cgPSBcIkNhbid0IGRlc3Ryb3kgVmlldyBiZWNhdXNlIGl0IGlzbid0IGEgcHJvcGVyIFZpZXcgaW5zdGFuY2UuIFwiXG4gICAgICBtc2cgKz0gXCJDaGVjayB5b3VyIGAje2NvbnRyb2xsZXJfbmFtZX1gIGNvbnRyb2xsZXIsIHRoZSBhY3Rpb24gXCJcbiAgICAgIG1zZyArPSBcImAje2FjdGlvbl9uYW1lfWAgbXVzdCByZXR1cm4gYSBWaWV3IGluc3RhbmNlLlwiXG4gICAgICBjb25zb2xlLmVycm9yIG1zZ1xuICAgICAgcmV0dXJuXG5cbiAgICBAdmlldy5vdXQgPT5cbiAgICAgIEB2aWV3LmRlc3Ryb3koKVxuICAgICAgQGFmdGVyX2Rlc3Ryb3k/KCkiXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUE7Ozs7Q0FBQTtDQUFBLEdBQUEscUJBQUE7O0FBS0EsQ0FMQSxFQUthLElBQUEsR0FBYixtQkFBYTs7QUFDYixDQU5BLEVBTU8sQ0FBUCxHQUFPLGFBQUE7O0NBRVA7Ozs7O0NBUkE7O0FBYUEsQ0FiQSxFQWF1QixHQUFqQixDQUFOO0NBRUU7Ozs7O0NBQUE7Q0FBQSxFQUtZLENBTFosTUFLQTs7Q0FFQTs7Ozs7Q0FQQTs7Q0FBQSxFQVlPLENBWlAsQ0FZQTs7Q0FFQTs7Ozs7Q0FkQTs7Q0FBQSxFQW1CWSxDQW5CWixNQW1CQTs7Q0FFQTs7Ozs7OztDQXJCQTs7Q0FBQSxFQTRCdUMsRUE1QnZDLGdDQTRCQTs7Q0FFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0E5QkE7O0NBQUEsRUFxRFEsQ0FyRFIsRUFxREE7O0NBRUE7Ozs7Ozs7Ozs7O0NBdkRBOztDQWtFWSxDQUFBLENBQUEsRUFBQSxJQUFBLEtBQUEsR0FBRztDQUdiLE9BQUEsSUFBQTtDQUFBLEVBSGEsQ0FBRDtDQUdaLEVBSG1CLENBQUQsS0FHbEI7Q0FBQSxFQUgrQixDQUFELENBRzlCO0NBQUEsQ0FBQSxDQUh1QyxDQUFEO0NBR3RDLEVBSDRDLENBQUQ7Q0FHM0MsRUFIa0QsQ0FBRCxVQUdqRDtDQUFBLEdBQUcsTUFBSDtDQUFBLENBR2dELENBQTVDLENBQUosQ0FBOEIsRUFBbEIsRUFBdUMsQ0FBbkQsS0FBQTtDQUNFLEVBRGlELEVBQUEsQ0FBRCxJQUNoRDtDQUFHLENBQUgsR0FBQSxLQUFBLEdBQUE7Q0FERixJQUFnRDtDQXhFbEQsRUFrRVk7O0NBU1o7Ozs7O0NBM0VBOztDQUFBLEVBZ0ZXLE1BQUEsQ0FBWDtDQUNFLEVBQUcsQ0FBSCxDQUFXLHdCQUFYO0NBQ0UsQ0FBbUQsQ0FBbkQsQ0FBQyxDQUFZLENBQWIsUUFBa0UsUUFBM0Q7TUFEVDtDQUFBLEVBSVUsQ0FBVixDQUFnQixDQUFoQixRQUFVO0NBR1YsQ0FBQSxFQUFBO0NBQ0csQ0FBYSxDQUFBLENBQWIsQ0FBbUIsQ0FBTixJQUFkLEdBQUEsU0FBYztNQVRQO0NBaEZYLEVBZ0ZXOztDQVdYOzs7OztDQTNGQTs7Q0FBQSxFQWdHQSxNQUFNO0NBQ0osS0FBQSxFQUFBO09BQUEsS0FBQTtDQUFBLEdBQUEsbUJBQUE7Q0FBQSxXQUFBO01BQUE7Q0FBQSxFQUd5QyxDQUF6QyxpQ0FBQTtBQUdPLENBQVAsRUFBNkIsQ0FBN0IsQ0FBbUMsQ0FBZixJQUFBLENBQUE7Q0FDbEIsRUFBd0IsQ0FBdkIsRUFBRCxJQUFhLEdBQVc7TUFQMUI7Q0FBQSxFQVVzQixDQUF0QixHQUFBLEdBQVc7Q0FWWCxFQWFhLENBQWIsS0FBQTtDQUNFLEVBQXNCLENBQXRCLENBQUMsQ0FBRCxDQUFBLEdBQVc7Q0FDWCxRQUFBLElBQUE7Q0FmRixJQWFhO0NBYmIsRUFrQjJCLENBQTNCLEtBbEJBLENBa0JXLEVBQVg7Q0FsQkEsR0FxQkEsRUFBYSxJQUFBO0NBR1osRUFBd0MsQ0FBeEMsT0FBRCwwQkFBQTtDQXpIRixFQWdHSTs7Q0E2Qko7Ozs7OztDQTdIQTs7Q0FBQSxFQW1JUSxJQUFSLEVBQVcsSUFBSDtDQUVOLE9BQUEseUJBQUE7T0FBQSxLQUFBO0NBQUEsRUFGUyxDQUFELFNBRVI7QUFBTyxDQUFQLEdBQUEsUUFBeUI7Q0FDdkIsRUFBa0IsQ0FBQyxDQUFLLENBQXhCLEVBQWtCLE9BQWxCO0NBQUEsRUFDYyxDQUFDLENBQUssQ0FBcEIsS0FBQTtDQURBLEVBRUEsR0FBQSx3REFGQTtDQUFBLEVBR0EsQ0FBUSxFQUFSLFFBQVEsQ0FBQSxZQUhSO0NBQUEsRUFJQSxDQUFRLEVBQVIsS0FBUSxxQkFKUjtDQUFBLEVBS0EsRUFBQSxDQUFBLENBQU87Q0FDUCxXQUFBO01BUEY7Q0FTQyxFQUFELENBQUMsS0FBUyxFQUFWO0NBQ0UsR0FBSyxDQUFKLENBQUQsQ0FBQTtDQUNDLEVBQUQsRUFBQztDQUZILElBQVU7Q0E5SVosRUFtSVE7O0NBbklSOztDQWZGIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6MTA3ODQsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJ2ZW5kb3JzL3RoZW9yaWN1cy93d3cvc3JjL3RoZW9yaWN1cy9jb3JlL3Byb2Nlc3Nlcy5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiIyMjKlxuICBDb3JlIG1vZHVsZVxuICBAbW9kdWxlIGNvcmVcbiMjI1xuXG5Sb3V0ZXIgPSByZXF1aXJlICd0aGVvcmljdXMvY29yZS9yb3V0ZXInXG5Qcm9jZXNzID0gcmVxdWlyZSAndGhlb3JpY3VzL2NvcmUvcHJvY2Vzcydcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cbkZhY3RvcnkgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUHJvY2Vzc2VzXG5cbiAgIyB1dGlsc1xuXG4gICMgdmFyaWFibGVzXG4gICMjIypcbiAgQmxvY2sgdGhlIHVybCBzdGF0ZSB0byBiZSBjaGFuZ2VkLiBVc2VmdWwgaWYgdGhlcmUgaXMgYSBjdXJyZW50IHt7I2Nyb3NzTGluayBcIlByb2Nlc3NcIn19X19Qcm9jZXNzX197ey9jcm9zc0xpbmt9fSBiZWluZyBleGVjdXRlZC5cblxuICBAcHJvcGVydHkge0Jvb2xlYW59IGxvY2tlZFxuICAjIyNcbiAgbG9ja2VkOiBmYWxzZVxuICBkaXNhYmxlX3RyYW5zaXRpb25zOiBudWxsXG5cbiAgIyMjKlxuICAgIFN0b3JlcyB0aGUgY3VycmVudCB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzZXNcIn19X19wcm9jZXNzZXNfX3t7L2Nyb3NzTGlua319IHRoYXQgYXJlIGFjdGl2ZS5cblxuICAgIEBwcm9wZXJ0eSBhY3RpdmVfcHJvY2Vzc2VzIHtBcnJheX1cbiAgIyMjXG4gIGFjdGl2ZV9wcm9jZXNzZXM6IFtdXG5cbiAgIyMjKlxuICAgIFN0b3JlcyB0aGUgY3VycmVudCB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzZXNcIn19X19wcm9jZXNzZXNfX3t7L2Nyb3NzTGlua319IHRoYXQgZG9lc24ndCBuZWVkIHRvIGJlIGFjdGl2ZS5cblxuICAgIEBwcm9wZXJ0eSBkZWFkX3Byb2Nlc3NlcyB7QXJyYXl9XG4gICMjI1xuICBkZWFkX3Byb2Nlc3NlczogW11cblxuICAjIyMqXG4gICAgU3RvcmVzIHRoZSBuZXcge3sjY3Jvc3NMaW5rIFwiUHJvY2Vzc1wifX1fX3Byb2Nlc3NfX3t7L2Nyb3NzTGlua319IGRlcGVuZGVuY2llcy5cblxuICAgIEBwcm9wZXJ0eSBwZW5kaW5nX3Byb2Nlc3NlcyB7QXJyYXl9XG4gICMjI1xuICBwZW5kaW5nX3Byb2Nlc3NlczogW11cblxuICAjIyMqXG4gIFJlc3BvbnNpYmxlIGZvciBoYW5kbGluZyB0aGUgdXJsIGNoYW5nZS4gXG5cbiAgV2hlbiB0aGUgVVJMIGNoYW5nZXMsIGl0IGluaXRpYWxpemVzIHRoZSB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzXCJ9fV9fcHJvY2Vzc19fe3svY3Jvc3NMaW5rfX0gcmVzcG9uc2libGUgZm9yIHRoZSBjdXJyZW50IHt7I2Nyb3NzTGluayBcIlJvdXRlXCJ9fV9fcm91dGVfX3t7L2Nyb3NzTGlua319ICh3aGljaCBpcyByZXNwb25zaWJsZSBmb3IgdGhlIGN1cnJlbnQgVVJMKS5cbiAgXG4gIFN0b3JlcyB0aGUgbmV3IHt7I2Nyb3NzTGluayBcIlByb2Nlc3NcIn19X19wcm9jZXNzX197ey9jcm9zc0xpbmt9fSBkZXBlbmRlbmN5IHByb2Nlc3NlcyBhdCBgQHBlbmRpbmdfcHJvY2Vzc2VzYFxuICBcbiAgRGVzdHJveSB0aGUgY3VycmVudCB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzXCJ9fV9fcHJvY2Vzc2VzX197ey9jcm9zc0xpbmt9fSB0aGF0IGFyZSBhY3RpdmUsIGJ1dCBhcmUgbm90IGRlcGVuZGVuY3kgb2YgdGhlIG5ldyB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzXCJ9fV9fcHJvY2Vzc19fe3svY3Jvc3NMaW5rfX0uXG4gIFxuICBSdW5zIHRoZSB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzXCJ9fV9fcHJvY2Vzc2VzX197ey9jcm9zc0xpbmt9fSB0aGF0IGFyZSBub3QgYWN0aXZlIHlldC4gXG5cbiAgX19FeGVjdXRpb24gb3JkZXJfX1xuXG4gIDEuIGBfb25fcm91dGVyX2NoYW5nZWAgOiBcblxuICAgICAgVGhlIFVSTCBjaGFuZ2VkLCBpdCB3aWxsIGNyZWF0ZSBhIG5ldyB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzXCJ9fV9fcHJvY2Vzc19fe3svY3Jvc3NMaW5rfX0gdG8gaGFuZGxlIHRoZSBjdXJyZW50IFJvdXRlLlxuXG4gIDIuIGBfZmlsdGVyX3BlbmRpbmdfcHJvY2Vzc2VzYFxuXG4gICAgICBXaWxsIHNlYXJjaCBmb3IgYWxsIHRoZSBuZXcge3sjY3Jvc3NMaW5rIFwiUHJvY2Vzc1wifX1fX3Byb2Nlc3NfX3t7L2Nyb3NzTGlua319IGRlcGVuZGVuY2llcyByZWN1cnNpdmVseSwgYW5kIHN0b3JlIHRoZW0gYXQgYHBlbmRpbmdfcHJvY2Vzc2VzYFxuXG4gIDMuIGBfZmlsdGVyX2RlYWRfcHJvY2Vzc2VzYFxuXG4gICAgICBXaWxsIHNlYXJjaCBmb3IgYWxsIHRoZSB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzXCJ9fV9fcHJvY2Vzc19fe3svY3Jvc3NMaW5rfX0gdGhhdCBkb2Vzbid0IG5lZWQgdG8gYmUgYWN0aXZlLlxuXG4gIDQuIGBfZGVzdHJveV9kZWFkX3Byb2Nlc3Nlc2AgLSBvbmUgYnkgb25lLCB3YWl0aW5nIG9yIG5vdCBmb3IgY2FsbGJhY2sgKHRpbWluZyBjYW4gYmUgc3luYy9hc3luYylcblxuICAgICAgV2lsbCBkZXN0cm95IHRoZSB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzXCJ9fV9fcHJvY2Vzc19fe3svY3Jvc3NMaW5rfX0gdGhhdCBkb2Vzbid0IG5lZWQgdG8gYmUgYWN0aXZlLlxuXG4gIDYuIGBfcnVuX3BlbmRpbmdfcHJvY2Vzc2AgLSBvbmUgYnkgb25lLCB3YWl0aW5nIG9yIG5vdCBmb3IgY2FsbGJhY2sgKHRpbWluZyBjYW4gYmUgc3luYy9hc3luYylcblxuICAgICAgV2lsbCBydW4gdGhlIHt7I2Nyb3NzTGluayBcIlByb2Nlc3NcIn19X19wcm9jZXNzX197ey9jcm9zc0xpbmt9fSB0aGF0IGFyZSByZXF1aXJlZCwgYnV0IG5vdCBhY3RpdmUgeWV0LlxuXG4gIEBjbGFzcyBQcm9jZXNzZXNcbiAgQGNvbnN0cnVjdG9yXG4gIEBwYXJhbSBAdGhlIHtUaGVvcmljdXN9IFNob3J0Y3V0IGZvciBhcHAncyBpbnN0YW5jZS5cbiAgQHBhcmFtIEBSb3V0ZXMge09iamVjdH0gQXBwIHJvdXRlcyBkZWZpbmVkIGluIHRoZSBgcm91dGVzLmNvZmZlZWBcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiggQHRoZSwgQFJvdXRlcyApLT5cbiAgICBGYWN0b3J5ID0gQHRoZS5mYWN0b3J5XG5cbiAgICBpZiBAdGhlLmNvbmZpZy5hbmltYXRlX2F0X3N0YXJ0dXAgaXMgZmFsc2VcbiAgICAgIEBkaXNhYmxlX3RyYW5zaXRpb25zID0gQHRoZS5jb25maWcuZGlzYWJsZV90cmFuc2l0aW9uc1xuICAgICAgQHRoZS5jb25maWcuZGlzYWJsZV90cmFuc2l0aW9ucyA9IHRydWVcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5ID0+XG4gICAgICBAcm91dGVyID0gbmV3IFJvdXRlciBAdGhlLCBAUm91dGVzLCBAX29uX3JvdXRlcl9jaGFuZ2VcblxuICAjIyMqXG4gIEV4ZWN1dGVkIHdoZW4gdGhlIHVybCBjaGFuZ2VzLCBpdCBjcmVhdGVzIGEge3sjY3Jvc3NMaW5rIFwiUHJvY2Vzc1wifX1fX1Byb2Nlc3NfX3t7L2Nyb3NzTGlua319IHRvIG1hbmlwdWxhdGUgdGhlIHt7I2Nyb3NzTGluayBcIlJvdXRlXCJ9fV9fcm91dGVfX3t7L2Nyb3NzTGlua319LCByZW1vdmVzIHRoZSBjdXJyZW50IHt7I2Nyb3NzTGluayBcIlByb2Nlc3NcIn19X19wcm9jZXNzX197ey9jcm9zc0xpbmt9fSwgYW5kIHJ1biB0aGUgbmV3IHt7I2Nyb3NzTGluayBcIlByb2Nlc3NcIn19X19wcm9jZXNzX197ey9jcm9zc0xpbmt9fSBhbG9uZ3NpZGUgaXRzIGRlcGVuZGVuY2llcy5cbiAgXG4gIEBtZXRob2QgX29uX3JvdXRlcl9jaGFuZ2VcbiAgQHBhcmFtIHJvdXRlIHtSb3V0ZX0ge3sjY3Jvc3NMaW5rIFwiUm91dGVcIn19X19Sb3V0ZV9fe3svY3Jvc3NMaW5rfX0gY29udGFpbmluZyB0aGUge3sjY3Jvc3NMaW5rIFwiQ29udHJvbGxlclwifX1fX2NvbnRyb2xsZXJfX3t7L2Nyb3NzTGlua319IGFuZCB1cmwgc3RhdGUgaW5mb3JtYXRpb24uXG4gIEBwYXJhbSB1cmwge1N0cmluZ30gQ3VycmVudCB1cmwgc3RhdGUuXG4gICMjI1xuICBfb25fcm91dGVyX2NoYW5nZTooIHJvdXRlLCB1cmwgKT0+XG4gICAgaWYgQGxvY2tlZFxuICAgICAgcmV0dXJuIEByb3V0ZXIubmF2aWdhdGUgQGxhc3RfcHJvY2Vzcy51cmwsIDAsIDEgXG5cbiAgICBAbG9ja2VkID0gdHJ1ZVxuICAgIEB0aGUuY3Jhd2xlci5pc19yZW5kZXJlZCA9IGZhbHNlXG5cbiAgICBuZXcgUHJvY2VzcyBAdGhlLCBALCByb3V0ZSwgcm91dGUuYXQsIHVybCwgbnVsbCwgKCBwcm9jZXNzLCBjb250cm9sbGVyICk9PlxuXG4gICAgICBAbGFzdF9wcm9jZXNzID0gcHJvY2Vzc1xuXG4gICAgICBAcGVuZGluZ19wcm9jZXNzZXMgPSBbXVxuICAgICAgQF9maWx0ZXJfcGVuZGluZ19wcm9jZXNzZXMgcHJvY2VzcywgPT5cbiAgICAgICAgZG8gQF9maWx0ZXJfZGVhZF9wcm9jZXNzZXNcbiAgICAgICAgZG8gQF9kZXN0cm95X2RlYWRfcHJvY2Vzc2VzXG5cbiAgIyMjKlxuICAgIFNlYXJjaHMgYW5kIHN0b3JlcyB0aGUge3sjY3Jvc3NMaW5rIFwiUHJvY2Vzc1wifX1fX1Byb2Nlc3NfX3t7L2Nyb3NzTGlua319IGRlcGVuZGVuY2llcyByZWN1cnNpdmVseS5cblxuICAgIEBtZXRob2QgX2ZpbHRlcl9wZW5kaW5nX3Byb2Nlc3Nlc1xuICAgIEBwYXJhbSBwcm9jZXNzIHtQcm9jZXNzfSB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzXCJ9fV9fUHJvY2Vzc19fe3svY3Jvc3NMaW5rfX0gdG8gc2VhcmNoIHRoZSBkZXBlbmRlbmNpZXMuXG4gICAgQHBhcmFtIGFmdGVyX2ZpbHRlciB7RnVuY3Rpb259IENhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIGFsbCB0aGUgZGVwZW5kZW5jaWVzIGFyZSBzdG9yZWQuXG4gICMjI1xuICBfZmlsdGVyX3BlbmRpbmdfcHJvY2Vzc2VzOiggcHJvY2VzcywgYWZ0ZXJfZmlsdGVyICktPlxuXG4gICAgQHBlbmRpbmdfcHJvY2Vzc2VzLnB1c2ggcHJvY2Vzc1xuXG4gICAgIyBpZiBwcm9jZXNzIGhhcyBhIGRlcGVuZGVuY3lcbiAgICBpZiBwcm9jZXNzLmRlcGVuZGVuY3k/XG5cbiAgICAgICMgc2VhcmNoIGZvciBpdFxuICAgICAgQF9maW5kX2RlcGVuZGVuY3kgcHJvY2VzcywgKGRlcGVuZGVuY3kpID0+XG5cbiAgICAgICAgIyBpZiBkZXBlbmRlbmN5IGlzIGZvdW5kXG4gICAgICAgIGlmIGRlcGVuZGVuY3k/XG4gICAgICAgICAgIyBzZWFyY2hzIGZvciBpdHMgZGVwZW5kZW5jaWVzIHJlY3Vyc2l2ZWx5XG4gICAgICAgICAgQF9maWx0ZXJfcGVuZGluZ19wcm9jZXNzZXMgZGVwZW5kZW5jeSwgYWZ0ZXJfZmlsdGVyXG5cbiAgICAgICAgIyBvdGhlcndpc2UgcmlzZXMgYW4gZXJyb3Igb2YgZGVwZW5kZW5jeSBub3QgZm91bmRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGEgPSBwcm9jZXNzLmRlcGVuZGVjeVxuICAgICAgICAgIGIgPSBwcm9jZXNzLnJvdXRlLmF0XG5cbiAgICAgICAgICBjb25zb2xlLmVycm9yIFwiRGVwZW5kZW5jeSBub3QgZm91bmQgZm9yICN7YX0gYW5kL29yICN7Yn1cIlxuICAgICAgICAgIGNvbnNvbGUubG9nIHByb2Nlc3NcblxuICAgICMgb3RoZXJ3aXNlIGZpcmVzIGNhbGxiYWNrXG4gICAgZWxzZVxuICAgICAgZG8gYWZ0ZXJfZmlsdGVyXG5cbiAgIyMjKlxuICBGaW5kcyB0aGUgZGVwZW5kZW5jeSBvZiB0aGUgZ2l2ZW4ge3sjY3Jvc3NMaW5rIFwiUHJvY2Vzc1wifX1fX1Byb2Nlc3NfX3t7L2Nyb3NzTGlua319XG5cbiAgQG1ldGhvZCBfZmluZF9kZXBlbmRlbmN5XG4gIEBwYXJhbSBwcm9jZXNzIHtQcm9jZXNzfSB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzXCJ9fV9fUHJvY2Vzc19fe3svY3Jvc3NMaW5rfX0gdG8gZmluZCB0aGUgZGVwZW5kZW5jeS5cbiAgQHBhcmFtIGFmdGVyX2ZpbmQge0Z1bmN0aW9ufSBDYWxsYmFjayB0byBiZSBjYWxsZWQgYWZ0ZXIgdGhlIGRlcGVuZGVuY3kgaGFzIGJlZW4gZm91bmQuXG4gICMjI1xuICBfZmluZF9kZXBlbmRlbmN5OiggcHJvY2VzcywgYWZ0ZXJfZmluZCApLT5cbiAgICBkZXBlbmRlbmN5ID0gcHJvY2Vzcy5kZXBlbmRlbmN5XG5cbiAgICAjIDEgLSB0cmllcyB0byBmaW5kIGRlcGVuZGVuY3kgd2l0aGluIHRoZSBBQ1RJVkUgUFJPQ0VTU0VTXG4gICAgZGVwID0gXy5maW5kIEBhY3RpdmVfcHJvY2Vzc2VzLCAoaXRlbSktPlxuICAgICAgcmV0dXJuIGl0ZW0udXJsIGlzIGRlcGVuZGVuY3lcbiAgICByZXR1cm4gYWZ0ZXJfZmluZCBkZXAgaWYgZGVwP1xuXG4gICAgIyAyIC0gdHJpZXMgdG8gZmluZCBkZXBlbmRlbmN5IHdpdGhpbiB0aGUgUk9VVEVTICh1c2luZyBzdHJpY3Qgcm91dGUgbmFtZSlcbiAgICBkZXAgPSBfLmZpbmQgQHJvdXRlci5yb3V0ZXMsIChpdGVtKS0+XG4gICAgICByZXR1cm4gaXRlbS50ZXN0IGRlcGVuZGVuY3lcblxuICAgIGlmIGRlcD9cblxuICAgICAgIyBhc3NlbWJsZSByb3V0ZSdzIGBhdGAgZGVwZW5kZW5jeSBiYXNlZCBvbiBwYXJlbnQgdXJsIHBhcmFtc1xuICAgICAgcGFyYW1zID0gZGVwLmV4dHJhY3RfcGFyYW1zIHByb2Nlc3MuZGVwZW5kZW5jeVxuICAgICAgYXQgPSBkZXAucmV3cml0ZV91cmxfd2l0aF9wYXJtcyBkZXAuYXQsIHBhcmFtc1xuXG4gICAgICByZXR1cm4gbmV3IFByb2Nlc3MgQHRoZSwgQCwgZGVwLCBhdCwgZGVwZW5kZW5jeSwgcHJvY2VzcywgKHByb2Nlc3MpPT5cbiAgICAgICAgYWZ0ZXJfZmluZCBwcm9jZXNzXG5cbiAgICBhZnRlcl9maW5kIG51bGxcblxuXG4gICMjIypcbiAgQ2hlY2sgd2hpY2ggb2YgdGhlIHt7I2Nyb3NzTGluayBcIlByb2Nlc3NcIn19X19wcm9jZXNzZXNfX3t7L2Nyb3NzTGlua319IG5lZWRzIHRvIHN0YXkgYWN0aXZlIGluIG9yZGVyIHRvIHJlbmRlciBjdXJyZW50IHt7I2Nyb3NzTGluayBcIlByb2Nlc3NcIn19X19wcm9jZXNzX197ey9jcm9zc0xpbmt9fS5cbiAgVGhlIG9uZXMgdGhhdCBkb2Vzbid0LCBhcmUgcHVzaGVkIHRvIGBAZGVhZF9wcm9jZXNzZXNgLlxuXG4gIEBtZXRob2QgX2ZpbHRlcl9kZWFkX3Byb2Nlc3Nlc1xuICAjIyNcbiAgX2ZpbHRlcl9kZWFkX3Byb2Nlc3NlczooKS0+XG4gICAgQGRlYWRfcHJvY2Vzc2VzID0gW11cblxuICAgICMgbG9vcHMgdGhyb3VnaCBhbGwgYWN0aXZlIHByb2Nlc3NcbiAgICBmb3IgYWN0aXZlIGluIEBhY3RpdmVfcHJvY2Vzc2VzXG5cbiAgICAgICMgYW5kIGNoZWNrcyBpZiBpdCdzIHByZXNlbnQgaW4gdGhlIHBlbmRpbmdfcHJvY2Vzc2VzIGFzIHdlbGxcbiAgICAgIHByb2Nlc3MgPSBfLmZpbmQgQHBlbmRpbmdfcHJvY2Vzc2VzLCAoaXRlbSktPlxuICAgICAgICByZXR1cm4gaXRlbS51cmwgaXMgYWN0aXZlLnVybFxuXG4gICAgICBpZiBwcm9jZXNzP1xuICAgICAgICB1cmwgPSBwcm9jZXNzLnVybFxuICAgICAgICBpZiB1cmw/ICYmIHVybCAhPSBhY3RpdmUudXJsXG4gICAgICAgICAgQGRlYWRfcHJvY2Vzc2VzLnB1c2ggYWN0aXZlXG4gICAgICBlbHNlXG4gICAgICAgIEBkZWFkX3Byb2Nlc3Nlcy5wdXNoIGFjdGl2ZVxuXG4gICMjIypcbiAgRGVzdHJveSB0aGUgZGVhZCB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzXCJ9fV9fcHJvY2Vzc2VzX197ey9jcm9zc0xpbmt9fSAoZG9lc24ndCBuZWVkIHRvIGJlIGFjdGl2ZSkgb25lIGJ5IG9uZSwgdGhlbiBydW4gdGhlIHBlbmRpbmcge3sjY3Jvc3NMaW5rIFwiUHJvY2Vzc1wifX1fX3Byb2Nlc3NfX3t7L2Nyb3NzTGlua319LlxuXG4gIEBtZXRob2QgX2Rlc3Ryb3lfZGVhZF9wcm9jZXNzZXNcbiAgIyMjXG4gIF9kZXN0cm95X2RlYWRfcHJvY2Vzc2VzOigpPT5cbiAgICBpZiBAZGVhZF9wcm9jZXNzZXMubGVuZ3RoXG4gICAgICBwcm9jZXNzID0gQGRlYWRfcHJvY2Vzc2VzLnBvcCgpXG5cbiAgICAgIEBhY3RpdmVfcHJvY2Vzc2VzID0gXy5yZWplY3QgQGFjdGl2ZV9wcm9jZXNzZXMsIChwKS0+XG4gICAgICAgIHAucm91dGUubWF0Y2ggaXMgcHJvY2Vzcy5yb3V0ZS5tYXRjaFxuXG4gICAgICBwcm9jZXNzLmRlc3Ryb3kgQF9kZXN0cm95X2RlYWRfcHJvY2Vzc2VzXG5cbiAgICBlbHNlXG4gICAgICBAX3J1bl9wZW5kaW5nX3Byb2Nlc3NlcygpXG5cbiAgIyMjKlxuICBSdW4gdGhlIHt7I2Nyb3NzTGluayBcIlByb2Nlc3NcIn19X19wcm9jZXNzZXNfX3t7L2Nyb3NzTGlua319IHRoYXQgYXJlIG5vdCBhY3RpdmUgeWV0LlxuXG4gIEBtZXRob2QgX3J1bl9wZW5kaW5nX3Byb2Nlc3Nlc1xuICAjIyNcbiAgX3J1bl9wZW5kaW5nX3Byb2Nlc3NlczooKT0+XG4gICAgaWYgQHBlbmRpbmdfcHJvY2Vzc2VzLmxlbmd0aFxuXG4gICAgICBwcm9jZXNzID0gQHBlbmRpbmdfcHJvY2Vzc2VzLnBvcCgpXG4gICAgICBmb3VuZCA9IF8uZmluZCBAYWN0aXZlX3Byb2Nlc3NlcywgKGZvdW5kX3Byb2Nlc3MpLT5cbiAgICAgICAgcmV0dXJuIGZvdW5kX3Byb2Nlc3Mucm91dGUubWF0Y2ggaXMgcHJvY2Vzcy5yb3V0ZS5tYXRjaFxuXG4gICAgICB1bmxlc3MgZm91bmQ/XG4gICAgICAgIEBhY3RpdmVfcHJvY2Vzc2VzLnB1c2ggcHJvY2Vzc1xuICAgICAgICBwcm9jZXNzLnJ1biBAX3J1bl9wZW5kaW5nX3Byb2Nlc3Nlc1xuICAgICAgZWxzZVxuICAgICAgICBAX3J1bl9wZW5kaW5nX3Byb2Nlc3NlcygpXG4gICAgZWxzZVxuICAgICAgQGxvY2tlZCA9IGZhbHNlXG4gICAgICBAdGhlLmNyYXdsZXIuaXNfcmVuZGVyZWQgPSB0cnVlXG5cbiAgICAgIGlmIEBkaXNhYmxlX3RyYW5zaXRpb25zP1xuICAgICAgICBAdGhlLmNvbmZpZy5kaXNhYmxlX3RyYW5zaXRpb25zID0gQGRpc2FibGVfdHJhbnNpdGlvbnNcbiAgICAgICAgQGRpc2FibGVfdHJhbnNpdGlvbnMgPSBudWxsXG5cbiAgICAgICMgY2FsbHMgdGhlIGFjdGl2YXRlIGZvciB0aGUgbGFzdCBhY3RpdmUgcHJvY2VzcyBvbmx5XG4gICAgICBpZiBAYWN0aXZlX3Byb2Nlc3Nlcy5sZW5ndGhcbiAgICAgICAgKF8ubGFzdCBAYWN0aXZlX3Byb2Nlc3Nlcykub25fYWN0aXZhdGU/KCkiXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUE7Ozs7Q0FBQTtDQUFBLEdBQUEsa0NBQUE7R0FBQSwrRUFBQTs7QUFLQSxDQUxBLEVBS1MsR0FBVCxDQUFTLGdCQUFBOztBQUNULENBTkEsRUFNVSxJQUFWLGlCQUFVOztBQUNWLENBUEEsRUFPSSxJQUFBLENBQUE7O0FBRUosQ0FUQSxFQVNVLENBVFYsR0FTQTs7QUFFQSxDQVhBLEVBV3VCLEdBQWpCLENBQU47Q0FLRTs7Ozs7Q0FBQTtDQUFBLEVBS1EsRUFMUixDQUtBOztDQUxBLEVBTXFCLENBTnJCLGVBTUE7O0NBRUE7Ozs7O0NBUkE7O0NBQUEsQ0FBQSxDQWFrQixhQUFsQjs7Q0FFQTs7Ozs7Q0FmQTs7Q0FBQSxDQUFBLENBb0JnQixXQUFoQjs7Q0FFQTs7Ozs7Q0F0QkE7O0NBQUEsQ0FBQSxDQTJCbUIsY0FBbkI7O0NBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBN0JBOztDQW1FWSxDQUFBLENBQUEsR0FBQSxhQUFHO0NBQ2IsT0FBQSxJQUFBO0NBQUEsRUFEYSxDQUFEO0NBQ1osRUFEbUIsQ0FBRCxFQUNsQjtDQUFBLHNFQUFBO0NBQUEsd0VBQUE7Q0FBQSw0REFBQTtDQUFBLEVBQVUsQ0FBVixHQUFBO0NBRUEsRUFBTyxDQUFQLENBQXFDLENBQXZCLFlBQVg7Q0FDRCxFQUF1QixDQUF0QixFQUFELGFBQUE7Q0FBQSxFQUNJLENBQUgsRUFBRCxhQUFBO01BSkY7Q0FBQSxFQU1rQixDQUFsQixDQUFBLEdBQUEsQ0FBa0I7Q0FDZixDQUEwQixDQUFiLENBQUEsQ0FBYixDQUFELE9BQUEsSUFBYztDQURoQixJQUFrQjtDQTFFcEIsRUFtRVk7O0NBVVo7Ozs7Ozs7Q0E3RUE7O0NBQUEsQ0FvRjJCLENBQVQsRUFBQSxJQUFFLFFBQXBCO0NBQ0UsT0FBQSxJQUFBO0NBQUEsR0FBQSxFQUFBO0NBQ0UsQ0FBMkMsQ0FBcEMsQ0FBQyxFQUFNLEVBQVAsSUFBOEIsQ0FBOUI7TUFEVDtDQUFBLEVBR1UsQ0FBVixFQUFBO0NBSEEsRUFJSSxDQUFKLENBSkEsRUFJWSxJQUFaO0NBRVksQ0FBTSxDQUFkLENBQUEsQ0FBQSxFQUFBLEVBQStDLENBQUYsQ0FBN0M7Q0FFRixFQUFnQixFQUFmLENBQUQsQ0FBQSxLQUFBO0NBQUEsQ0FBQSxDQUVxQixFQUFwQixDQUFELFdBQUE7Q0FDQyxDQUFtQyxDQUFBLEVBQW5DLEVBQUQsRUFBb0MsSUFBcEMsWUFBQTtDQUNFLElBQUksR0FBRCxjQUFIO0NBQ0ksSUFBQSxVQUFELFFBQUg7Q0FGRixNQUFvQztDQUxsQyxJQUE2QztDQTNGbkQsRUFvRmtCOztDQWdCbEI7Ozs7Ozs7Q0FwR0E7O0NBQUEsQ0EyR3FDLENBQVgsSUFBQSxFQUFFLEdBQUYsYUFBMUI7Q0FFRSxPQUFBLElBQUE7Q0FBQSxHQUFBLEdBQUEsVUFBa0I7Q0FHbEIsR0FBQSxzQkFBQTtDQUdHLENBQTBCLENBQUEsQ0FBMUIsR0FBRCxFQUE0QixDQUFELEdBQTNCLEdBQUE7Q0FHRSxHQUFBLFFBQUE7Q0FBQSxHQUFHLElBQUgsVUFBQTtDQUVHLENBQXNDLEdBQXRDLEtBQUQsRUFBQSxLQUFBLFFBQUE7TUFGRixJQUFBO0NBTUUsRUFBSSxJQUFPLEVBQVgsQ0FBQTtDQUFBLENBQUEsQ0FDSSxFQUFhLEVBQU4sR0FBWDtDQURBLEVBR3lDLEVBQXpDLEVBQU8sR0FBUCxpQkFBZTtDQUNQLEVBQVIsSUFBTyxVQUFQO1VBYnVCO0NBQTNCLE1BQTJCO01BSDdCO0NBb0JFLFdBQUEsQ0FBRztNQXpCbUI7Q0EzRzFCLEVBMkcwQjs7Q0EyQjFCOzs7Ozs7O0NBdElBOztDQUFBLENBNkk0QixDQUFYLElBQUEsRUFBRSxDQUFGLE1BQWpCO0NBQ0UsT0FBQSxtQkFBQTtPQUFBLEtBQUE7Q0FBQSxFQUFhLENBQWIsR0FBb0IsR0FBcEI7Q0FBQSxDQUdnQyxDQUFoQyxDQUFBLEtBQWlDLE9BQTNCO0NBQ0osRUFBTyxDQUFJLENBQVEsS0FBbkIsR0FBTztDQURILElBQTBCO0NBRWhDLEdBQUEsT0FBQTtDQUFBLEVBQU8sT0FBQSxHQUFBO01BTFA7Q0FBQSxDQVE2QixDQUE3QixDQUFBLEVBQW9CLEdBQVU7Q0FDNUIsR0FBVyxNQUFKLEdBQUE7Q0FESCxJQUF1QjtDQUc3QixHQUFBLE9BQUE7Q0FHRSxFQUFTLEdBQVQsQ0FBbUMsR0FBMUIsSUFBQTtDQUFULENBQ0EsQ0FBSyxHQUFMLGdCQUFLO0NBRUwsQ0FBeUIsQ0FBZCxDQUFBLEdBQUEsRUFBZ0QsQ0FBaEQsR0FBQTtDQUNFLE1BQVgsR0FBQSxLQUFBO0NBRFMsTUFBK0M7TUFqQjVEO0NBb0JXLEdBQVgsTUFBQSxDQUFBO0NBbEtGLEVBNklpQjs7Q0F3QmpCOzs7Ozs7Q0FyS0E7O0NBQUEsRUEyS3VCLE1BQUEsYUFBdkI7Q0FDRSxPQUFBLHNDQUFBO0NBQUEsQ0FBQSxDQUFrQixDQUFsQixVQUFBO0NBR0E7Q0FBQTtVQUFBLGlDQUFBO3lCQUFBO0NBR0UsQ0FBcUMsQ0FBM0IsQ0FBQSxFQUFWLENBQUEsRUFBc0MsUUFBNUI7Q0FDUixFQUFPLENBQUksQ0FBUSxDQUFNLFNBQWxCO0NBREMsTUFBMkI7Q0FHckMsR0FBRyxFQUFILFNBQUE7Q0FDRSxFQUFBLElBQWEsQ0FBYjtDQUNBLEVBQVcsQ0FBUixDQUFlLENBQU0sRUFBeEIsS0FBRztDQUNELEdBQUMsRUFBRCxRQUFlO01BRGpCLElBQUE7Q0FBQTtVQUZGO01BQUEsRUFBQTtDQUtFLEdBQUMsRUFBRCxRQUFlO1FBWG5CO0NBQUE7cUJBSnFCO0NBM0t2QixFQTJLdUI7O0NBaUJ2Qjs7Ozs7Q0E1TEE7O0NBQUEsRUFpTXdCLE1BQUEsY0FBeEI7Q0FDRSxNQUFBLENBQUE7Q0FBQSxHQUFBLEVBQUEsUUFBa0I7Q0FDaEIsRUFBVSxDQUFDLEVBQVgsQ0FBQSxPQUF5QjtDQUF6QixDQUVnRCxDQUE1QixDQUFuQixFQUFELEdBQWlELE9BQWpEO0NBQ0csSUFBTSxFQUFpQixRQUF4QjtDQURrQixNQUE0QjtDQUd4QyxHQUFTLEdBQVYsTUFBUCxVQUFBO01BTkY7Q0FTRyxHQUFBLFNBQUQsU0FBQTtNQVZvQjtDQWpNeEIsRUFpTXdCOztDQVl4Qjs7Ozs7Q0E3TUE7O0NBQUEsRUFrTnVCLE1BQUEsYUFBdkI7Q0FDRSxPQUFBLGFBQUE7Q0FBQSxHQUFBLEVBQUEsV0FBcUI7Q0FFbkIsRUFBVSxDQUFDLEVBQVgsQ0FBQSxVQUE0QjtDQUE1QixDQUNrQyxDQUExQixDQUFBLENBQVIsQ0FBQSxHQUFtQyxJQUFELEdBQTFCO0NBQ04sSUFBMEIsRUFBaUIsTUFBdkIsRUFBYjtDQURELE1BQTBCO0NBR2xDLEdBQU8sRUFBUCxPQUFBO0NBQ0UsR0FBQyxHQUFELENBQUEsUUFBaUI7Q0FDVCxFQUFSLENBQWEsR0FBTixRQUFQLE9BQUE7TUFGRixFQUFBO0NBSUcsR0FBQSxXQUFELE9BQUE7UUFWSjtNQUFBO0NBWUUsRUFBVSxDQUFULENBQUQsQ0FBQTtDQUFBLEVBQ0ksQ0FBSCxFQUFELENBQVksSUFBWjtDQUVBLEdBQUcsRUFBSCwwQkFBQTtDQUNFLEVBQUksQ0FBSCxFQUFVLEVBQVgsV0FBQTtDQUFBLEVBQ3VCLENBQXRCLElBQUQsV0FBQTtRQUxGO0NBUUEsR0FBRyxFQUFILFVBQW9CO0NBQ1MsSUFBRDtRQXJCOUI7TUFEcUI7Q0FsTnZCLEVBa051Qjs7Q0FsTnZCOztDQWhCRiIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjExMDczLAogICAgImNvbHVtbiI6MAogIH0sCiAgIm1hcCI6IHsKICAgICJ2ZXJzaW9uIjogMywKICAgICJmaWxlIjogImFwcC5qcyIsCiAgICAic291cmNlcyI6IFsidmVuZG9ycy90aGVvcmljdXMvd3d3L3NyYy90aGVvcmljdXMvY29yZS9yb3V0ZS5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiIyMjKlxuICBDb3JlIG1vZHVsZVxuICBAbW9kdWxlIGNvcmVcbiMjI1xuXG5cbiMjIypcbiAgXG4gIFJlc3BvbnNpYmxlIGZvciBtYW5pcHVsYXRpbmcgYW5kIHZhbGlkYXRpbmcgdGhlIHVybCBzdGF0ZS5cblxuICBTdG9yZXMgdGhlIGRhdGEgZGVmaW5lZCBpbiB0aGUgYXBwbGljYXRpb24gY29uZmlnIGByb3V0ZXMuY29mZmVlYCBmaWxlLlxuXG4gIEBjbGFzcyBSb3V0ZVxuIyMjXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJvdXRlXG5cbiAgIyMjKlxuXG4gICAgTWF0Y2ggbmFtZWQgcGFyYW1zLlxuXG4gICAgQHN0YXRpY1xuICAgIEBwcm9wZXJ0eSBuYW1lZF9wYXJhbV9yZWcge1JlZ0V4cH1cbiAgICBAZXhhbXBsZVxuICAgICAgXCJ3b3Jrcy86aWRcIi5tYXRjaCBSb3V0ZS5uYW1lZF9wYXJhbV9yZWcgIyBtYXRjaHMgJzppZCdcbiAgIyMjXG4gIEBuYW1lZF9wYXJhbV9yZWc6IC86XFx3Ky9nXG5cbiAgIyMjKlxuXG4gICAgTWF0Y2ggd2lsZGNhcmQgcGFyYW1zLlxuXG4gICAgQHN0YXRpY1xuICAgIEBwcm9wZXJ0eSBzcGxhdF9wYXJhbV9yZWcge1JlZ0V4cH1cblxuICAgIEBleGFtcGxlXG4gICAgICBcIndvcmtzLyphbnl0aGluZy9mcm9tL2hlcmVcIi5tYXRjaCBSb3V0ZS5uYW1lZF9wYXJhbV9yZWcgIyBtYXRjaHMgJyphbnl0aGluZy9mcm9tL2hlcmUnXG4gICMjI1xuICBAc3BsYXRfcGFyYW1fcmVnOiAvXFwqXFx3Ky9nXG5cbiAgIyMjKlxuXG4gICAgUmVnZXggcmVzcG9uc2libGUgZm9yIHBhcnNpbmcgdGhlIHVybCBzdGF0ZS5cblxuICAgIEBwcm9wZXJ0eSBtYXRjaGVyIHtSZWdFeHB9XG4gICMjI1xuICBtYXRjaGVyOiBudWxsXG5cbiAgIyMjKlxuXG4gICAgVXJsIHN0YXRlLlxuXG4gICAgQHByb3BlcnR5IG1hdGNoIHtTdHJpbmd9XG4gICMjI1xuICBtYXRjaDogbnVsbFxuXG4gICMjIypcblxuICAgIENvbnRyb2xsZXIgJy8nIGFjdGlvbiB0byB3aGljaCB0aGUgcm91dGUgd2lsbCBiZSBzZW50LlxuICAgIFxuICAgIEBwcm9wZXJ0eSB0byB7U3RyaW5nfVxuICAjIyNcbiAgdG86IG51bGxcblxuICAjIyMqXG5cbiAgICBSb3V0ZSB0byBiZSBjYWxsZWQgYXMgYSBkZXBlbmRlbmN5LlxuICAgIFxuICAgIEBwcm9wZXJ0eSBhdCB7U3RyaW5nfVxuICAjIyNcbiAgYXQ6IG51bGxcblxuICAjIyMqXG5cbiAgICBDU1Mgc2VsZWN0b3IgdG8gZGVmaW5lIHdoZXJlIHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIHJlbmRlcmVkLlxuICAgIFxuICAgIEBwcm9wZXJ0eSBlbCB7U3RyaW5nfVxuICAjIyNcbiAgZWw6IG51bGxcblxuICAjIyMqXG5cbiAgICBTdG9yZSB0aGUgY29udHJvbGxlciBuYW1lIGV4dHJhY3RlZCBmcm9tIHVybC5cbiAgICBcbiAgICBAcHJvcGVydHkgY29udHJvbGxlcl9uYW1lIHtTdHJpbmd9XG4gICMjI1xuICBjb250cm9sbGVyX25hbWU6IG51bGxcblxuICAjIyMqXG5cbiAgICBTdG9yZSB0aGUgY29udHJvbGxlcnMnIGFjdGlvbiBuYW1lIGV4dHJhY3RlZCBmcm9tIHVybC5cbiAgICBcbiAgICBAcHJvcGVydHkgYWN0aW9uX25hbWUge1N0cmluZ31cbiAgIyMjXG4gIGFjdGlvbl9uYW1lOiBudWxsXG5cbiAgIyMjKlxuXG4gICAgU3RvcmUgdGhlIGNvbnRyb2xsZXJzJyBhY3Rpb24gcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB1cmwuXG4gICAgXG4gICAgQHByb3BlcnR5IHBhcmFtX25hbWVzIHtTdHJpbmd9XG4gICMjI1xuICBwYXJhbV9uYW1lczogbnVsbFxuXG4gICMjIypcbiAgICBAY2xhc3MgUm91dGVcbiAgICBAY29uc3RydWN0b3JcbiAgICBAcGFyYW0gQG1hdGNoIHtTdHJpbmd9IFVybCBzdGF0ZS5cbiAgICBAcGFyYW0gQHRvIHtTdHJpbmd9IHt7I2Nyb3NzTGluayBcIkNvbnRyb2xsZXJcIn19X19Db250cm9sbGVyJ3NfX3t7L2Nyb3NzTGlua319IGFjdGlvbiAoY29udHJvbGxlci9hY3Rpb24pICB0byB3aGljaCB0aGUgcm91dGUgd2lsbCBiZSBzZW50LlxuICAgIEBwYXJhbSBAYXQge1N0cmluZ30ge3sjY3Jvc3NMaW5rIFwiUm91dGVcIn19X19Sb3V0ZV9fe3svY3Jvc3NMaW5rfX0gdG8gYmUgY2FsbGVkIGFzIGEgZGVwZW5kZW5jeS5cbiAgICBAcGFyYW0gQGVsIHtTdHJpbmd9IENTUyBzZWxlY3RvciB0byBkZWZpbmUgd2hlcmUgdGhlIHRlbXBsYXRlIHdpbGwgYmUgcmVuZGVyZWQuXG4gICMjI1xuICBjb25zdHJ1Y3RvcjooIEBtYXRjaCwgQHRvLCBAYXQsIEBlbCApLT5cblxuICAgICMgcHJlcGFyZSByZWdleCBtYXRjaGVyIHN0ciBmb3IgcmV1c2VcbiAgICAjIEFkZCByZWdleHAgdG8gaWdub3JlIHRoZSBsYXN0IFwic2xhc2hcIlxuICAgIEBtYXRjaGVyID0gQG1hdGNoLnJlcGxhY2UgUm91dGUubmFtZWRfcGFyYW1fcmVnLCAnKFteXFwvXSspJ1xuICAgIEBtYXRjaGVyID0gQG1hdGNoZXIucmVwbGFjZSBSb3V0ZS5zcGxhdF9wYXJhbV9yZWcsICcoLio/KSdcbiAgICBAbWF0Y2hlciA9IG5ldyBSZWdFeHAgXCJeI3tAbWF0Y2hlcn0kXCIsICdtJ1xuXG4gICAgIyBmaXRsZXJzIGNvbnRyb2xsZXIgYW5kIGFjdGlvbiBuYW1lXG4gICAgW0Bjb250cm9sbGVyX25hbWUsIEBhY3Rpb25fbmFtZV0gPSB0by5zcGxpdCAnLydcblxuICAjIyMqXG4gIFxuICAgIEV4dHJhY3QgdGhlIHVybCBuYW1lZCBwYXJhbWV0ZXJzLlxuXG4gICAgQG1ldGhvZCBleHRyYWN0X3BhcmFtc1xuICAgIEBwYXJhbSB1cmwge1N0cmluZ31cblxuICAgIEBleGFtcGxlXG5Gb3IgYSByb3V0ZSBgcGFnZXMvOmlkYCwgZXh0cmFjdCB0aGUgYDppZGAgZnJvbSBgcGFnZXMvMWBcblxuICAgIGV4dHJhY3RfcGFyYW1zKCdwYWdlcy8xJykgIyByZXR1cm5zIHtpZDoxfVxuXG4gICMjI1xuICBleHRyYWN0X3BhcmFtczooIHVybCApLT5cbiAgICAjIGluaXRpYWxpemUgZW1wdHkgcGFyYW1zIG9iamVjdFxuICAgIHBhcmFtcyA9IHt9XG5cbiAgICAjIGZpbHRlcnMgcm91dGUncyBwYXJhbXMgbmFtZXNcbiAgICBpZiAocGFyYW1fbmFtZXMgPSBAbWF0Y2gubWF0Y2ggLyg6fFxcKilcXHcrL2cpP1xuICAgICAgZm9yIHZhbHVlLCBpbmRleCBpbiBwYXJhbV9uYW1lc1xuICAgICAgICBwYXJhbV9uYW1lc1tpbmRleF0gPSB2YWx1ZS5zdWJzdHIgMVxuICAgIGVsc2VcbiAgICAgIHBhcmFtX25hbWVzID0gW11cblxuICAgICMgZXh0cmFjdCB1cmwgcGFyYW1zIGJhc2VkIG9uIHJvdXRlXG4gICAgcGFyYW1zX3ZhbHVlcyA9ICh1cmwubWF0Y2ggQG1hdGNoZXIpPy5zbGljZSAxIG9yIFtdXG5cbiAgICAjIG1vdW50cyBwYXJhbXMgb2JqZWN0IHdpdGgga2V5LT52YWx1ZXMgcGFpcnNcbiAgICBpZiBwYXJhbXNfdmFsdWVzP1xuICAgICAgZm9yIHZhbCwgaW5kZXggaW4gcGFyYW1zX3ZhbHVlc1xuICAgICAgICBrZXkgPSBwYXJhbV9uYW1lc1sgaW5kZXggXVxuICAgICAgICBwYXJhbXNba2V5XSA9IHZhbFxuXG4gICAgcmV0dXJuIHBhcmFtc1xuXG4gICMjIypcbiAgICBSZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIHVybCBwYXJhbSBuYW1lcyByZXBsYWNlZCBieSBwYXJhbSB2YWx1ZXMuXG5cbiAgICBAbWV0aG9kIHJld3JpdGVfdXJsX3dpdGhfcGFybXNcbiAgICBAcGFyYW0gdXJsIHtTdHJpbmd9XG4gICAgQHBhcmFtIHBhcmFtcyB7T2JqZWN0fVxuXG4gICAgQGV4YW1wbGVcbiAgICAgICAgcmV3cml0ZV91cmxfd2l0aF9wYXJtcygncGFnZXMvOmlkJywge2lkOjF9KSAjIHJldHVybnMgJ3BhZ2VzLzEnXG5cbiAgIyMjXG4gIHJld3JpdGVfdXJsX3dpdGhfcGFybXM6KCB1cmwsIHBhcmFtcyApLT5cbiAgICBmb3Iga2V5LCB2YWx1ZSBvZiBwYXJhbXNcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAgXCJbOlxcXFwqXSsje2tleX1cIiwgJ2cnXG4gICAgICB1cmwgPSB1cmwucmVwbGFjZSByZWcsIHZhbHVlXG4gICAgcmV0dXJuIHVybFxuXG4gICMjIypcblxuICAgIFRlc3QgZ2l2ZW4gdXJsIHVzaW5nIHRoZSB7eyNjcm9zc0xpbmsgXCJSb3V0ZS9tYXRjaGVyOnByb3BlcnR5XCJ9fSBfX0BtYXRjaGVyX18ge3svY3Jvc3NMaW5rfX0gcmVnZXhwLlxuICAgIFxuICAgIEBtZXRob2QgdGVzdFxuICAgIEBwYXJhbSB1cmwge1N0cmluZ30gVXJsIHRvIGJlIHRlc3RlZC5cbiAgIyMjXG4gIHRlc3Q6KCB1cmwgKS0+XG4gICAgQG1hdGNoZXIudGVzdCB1cmwiXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUE7Ozs7Q0FBQTtDQU1BOzs7Ozs7OztDQU5BO0NBQUEsR0FBQSxDQUFBOztBQWNBLENBZEEsRUFjdUIsR0FBakIsQ0FBTjtDQUVFOzs7Ozs7Ozs7Q0FBQTtDQUFBLENBU0EsQ0FBa0IsRUFBakIsRUFURCxRQVNBOztDQUVBOzs7Ozs7Ozs7O0NBWEE7O0NBQUEsQ0FxQkEsQ0FBa0IsRUFBakIsR0FyQkQsT0FxQkE7O0NBRUE7Ozs7OztDQXZCQTs7Q0FBQSxFQTZCUyxDQTdCVCxHQTZCQTs7Q0FFQTs7Ozs7O0NBL0JBOztDQUFBLEVBcUNPLENBckNQLENBcUNBOztDQUVBOzs7Ozs7Q0F2Q0E7O0NBQUEsQ0E2Q0EsQ0FBSSxDQTdDSjs7Q0ErQ0E7Ozs7OztDQS9DQTs7Q0FBQSxDQXFEQSxDQUFJLENBckRKOztDQXVEQTs7Ozs7O0NBdkRBOztDQUFBLENBNkRBLENBQUksQ0E3REo7O0NBK0RBOzs7Ozs7Q0EvREE7O0NBQUEsRUFxRWlCLENBckVqQixXQXFFQTs7Q0FFQTs7Ozs7O0NBdkVBOztDQUFBLEVBNkVhLENBN0ViLE9BNkVBOztDQUVBOzs7Ozs7Q0EvRUE7O0NBQUEsRUFxRmEsQ0FyRmIsT0FxRkE7O0NBRUE7Ozs7Ozs7O0NBdkZBOztDQStGWSxDQUFBLENBQUEsRUFBQSxVQUFHO0NBSWIsR0FBQSxJQUFBO0NBQUEsRUFKYSxDQUFELENBSVo7Q0FBQSxDQUFBLENBSnFCLENBQUQ7Q0FJcEIsQ0FBQSxDQUowQixDQUFEO0NBSXpCLENBQUEsQ0FKK0IsQ0FBRDtDQUk5QixDQUFpRCxDQUF0QyxDQUFYLENBQWlCLEVBQWpCLEdBQVcsS0FBQTtDQUFYLENBQ21ELENBQXhDLENBQVgsQ0FBaUMsRUFBakMsUUFBVztDQURYLENBRXVDLENBQXhCLENBQWYsRUFBZSxDQUFmO0NBRkEsQ0FLcUMsQ0FBRixDQUFuQyxDQUFtQyxFQUFBO0NBeEdyQyxFQStGWTs7Q0FXWjs7Ozs7Ozs7Ozs7O0NBMUdBOztDQUFBLEVBdUhlLE1BQUUsS0FBakI7Q0FFRSxPQUFBLDZFQUFBO0NBQUEsQ0FBQSxDQUFTLENBQVQsRUFBQTtDQUdBLEdBQUEsa0RBQUE7QUFDRSxDQUFBLFVBQUEsdURBQUE7b0NBQUE7Q0FDRSxFQUFxQixFQUFULENBQVMsRUFBckIsR0FBWTtDQURkLE1BREY7TUFBQTtDQUlFLENBQUEsQ0FBYyxHQUFkLEtBQUE7TUFQRjtDQUFBLENBVWdCLEVBQWhCLENBQWdCLENBVmhCLE9BVUE7Q0FHQSxHQUFBLGlCQUFBO0FBQ0UsQ0FBQSxVQUFBLDJEQUFBO29DQUFBO0NBQ0UsRUFBQSxFQUFtQixHQUFuQixHQUFtQjtDQUFuQixFQUNPLEdBQUEsRUFBUDtDQUZGLE1BREY7TUFiQTtDQWtCQSxLQUFBLEtBQU87Q0EzSVQsRUF1SGU7O0NBc0JmOzs7Ozs7Ozs7O0NBN0lBOztDQUFBLENBd0o4QixDQUFQLEdBQUEsR0FBRSxhQUF6QjtDQUNFLE9BQUEsT0FBQTtBQUFBLENBQUEsUUFBQSxJQUFBOzJCQUFBO0NBQ0UsQ0FBa0MsQ0FBbEMsQ0FBVSxFQUFWLEdBQWtCO0NBQWxCLENBQ3VCLENBQXZCLEVBQU0sQ0FBTixDQUFNO0NBRlIsSUFBQTtDQUdBLEVBQUEsUUFBTztDQTVKVCxFQXdKdUI7O0NBTXZCOzs7Ozs7O0NBOUpBOztDQUFBLEVBcUtLLENBQUwsS0FBTztDQUNKLEVBQUQsQ0FBQyxHQUFPLElBQVI7Q0F0S0YsRUFxS0s7O0NBcktMOztDQWhCRiIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjExMjk1LAogICAgImNvbHVtbiI6MAogIH0sCiAgIm1hcCI6IHsKICAgICJ2ZXJzaW9uIjogMywKICAgICJmaWxlIjogImFwcC5qcyIsCiAgICAic291cmNlcyI6IFsidmVuZG9ycy90aGVvcmljdXMvd3d3L3NyYy90aGVvcmljdXMvY29yZS9yb3V0ZXIuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIiMjIFJvdXRlciAmIFJvdXRlIGxvZ2ljIGluc3BpcmVkIGJ5IFJvdXRlckpTOlxuIyMgaHR0cHM6Ly9naXRodWIuY29tL2hhaXRoZW1iZWxoYWovUm91dGVySnNcblxuIyMjKlxuICBDb3JlIG1vZHVsZVxuICBAbW9kdWxlIGNvcmVcbiMjI1xuXG5TdHJpbmdVcmlsID0gcmVxdWlyZSAndGhlb3JpY3VzL3V0aWxzL3N0cmluZ191dGlsJ1xuUm91dGUgPSByZXF1aXJlICd0aGVvcmljdXMvY29yZS9yb3V0ZSdcblxucmVxdWlyZSAnLi4vLi4vLi4vdmVuZG9ycy9oaXN0b3J5J1xuXG5GYWN0b3J5ID0gbnVsbFxuXG4jIyMqXG4gIFByb3hpZXMgYnJvd3NlcidzIEhpc3RvcnkgQVBJLCByb3V0aW5nIHJlcXVlc3QgdG8gYW5kIGZyb20gdGhlIGFwbGljYXRpb24uXG5cbiAgQGNsYXNzIFJvdXRlclxuIyMjXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJvdXRlclxuXG4gICMjIypcbiAgICBBcnJheSBzdG9yaW5nIGFsbCB0aGUgcm91dGVzIGRlZmluZWQgaW4gdGhlIGFwcGxpY2F0aW9uJ3Mgcm91dGUgZmlsZSAocm91dGVzLmNvZmZlZSlcblxuICAgIEBwcm9wZXJ0eSB7QXJyYXl9IHJvdXRlc1xuICAjIyNcbiAgcm91dGVzOiBbXVxuXG4gICMjIypcbiAgICBJZiBmYWxzZSwgZG9lc24ndCBoYW5kbGUgdGhlIHVybCByb3V0ZS5cblxuICAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gdHJpZ2dlclxuICAjIyNcbiAgdHJpZ2dlcjogdHJ1ZVxuXG4gICMjIypcbiAgQGNsYXNzIFJvdXRlclxuICBAY29uc3RydWN0b3JcbiAgQHBhcmFtIEB0aGUge1RoZW9yaWN1c30gU2hvcnRjdXQgZm9yIGFwcCdzIGluc3RhbmNlLlxuICBAcGFyYW0gQFJvdXRlcyB7VGhlb3JpY3VzfSBSb3V0ZXMgZGVmaW5lZCBpbiB0aGUgYXBwJ3MgYHJvdXRlcy5jb2ZmZWVgIGZpbGUuXG4gIEBwYXJhbSBAb25fY2hhbmdlIHtGdW5jdGlvbn0gc3RhdGUvdXJsIGhhbmRsZXIuXG4gICMjI1xuICBjb25zdHJ1Y3RvcjooIEB0aGUsIEBSb3V0ZXMsIEBvbl9jaGFuZ2UgKS0+XG4gICAgRmFjdG9yeSA9IEB0aGUuZmFjdG9yeVxuXG4gICAgZm9yIHJvdXRlLCBvcHRzIG9mIEBSb3V0ZXMucm91dGVzXG4gICAgICBAbWFwIHJvdXRlLCBvcHRzLnRvLCBvcHRzLmF0LCBvcHRzLmVsLCBAXG5cbiAgICBIaXN0b3J5LkFkYXB0ZXIuYmluZCB3aW5kb3csICdzdGF0ZWNoYW5nZScsID0+XG4gICAgICBAcm91dGUgSGlzdG9yeS5nZXRTdGF0ZSgpXG5cbiAgICBzZXRUaW1lb3V0ID0+XG4gICAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWVcbiAgICAgIHVybCA9IEBSb3V0ZXMucm9vdCBpZiB1cmwgPT0gXCIvXCJcbiAgICAgIEBydW4gdXJsXG4gICAgLCAxXG5cbiAgIyMjKlxuICAgIENyZWF0ZSBhbmQgc3RvcmUgYSB7eyNjcm9zc0xpbmsgXCJSb3V0ZVwifX1fX3JvdXRlX197ey9jcm9zc0xpbmt9fSB3aXRoaW4gYHJvdXRlc2AgYXJyYXkuXG4gICAgQG1ldGhvZCBtYXBcbiAgICBAcGFyYW0gcm91dGUge1N0cmluZ30gVXJsIHN0YXRlLlxuICAgIEBwYXJhbSB0byB7U3RyaW5nfSB7eyNjcm9zc0xpbmsgXCJDb250cm9sbGVyXCJ9fV9fQ29udHJvbGxlcidzX197ey9jcm9zc0xpbmt9fSBhY3Rpb24gKGNvbnRyb2xsZXIvYWN0aW9uKSB0byB3aGljaCB0aGUge3sjY3Jvc3NMaW5rIFwiUm91dGVcIn19X19yb3V0ZV9fe3svY3Jvc3NMaW5rfX0gd2lsbCBiZSBzZW50LlxuICAgIEBwYXJhbSBhdCB7U3RyaW5nfSBVcmwgc3RhdGUgdG8gYmUgY2FsbGVkIGFzIGEgZGVwZW5kZW5jeS5cbiAgICBAcGFyYW0gZWwge1N0cmluZ30gQ1NTIHNlbGVjdG9yIHRvIGRlZmluZSB3aGVyZSB0aGUgdGVtcGxhdGUgd2lsbCBiZSByZW5kZXJlZCBpbiB0aGUgRE9NLlxuICAjIyNcbiAgbWFwOiggcm91dGUsIHRvLCBhdCwgZWwgKS0+XG4gICAgQHJvdXRlcy5wdXNoIHJvdXRlID0gbmV3IFJvdXRlIHJvdXRlLCB0bywgYXQsIGVsLCBAXG4gICAgcmV0dXJuIHJvdXRlXG5cbiAgIyMjKlxuICAgIEhhbmRsZXMgdGhlIHVybCBzdGF0ZS5cblxuICAgIENhbGxzIHRoZSBgQG9uX2NoYW5nZWAgbWV0aG9kIHBhc3NpbmcgYXMgcGFyYW1ldGVyIHRoZSB7eyNjcm9zc0xpbmsgXCJSb3V0ZVwifX1fX1JvdXRlX197ey9jcm9zc0xpbmt9fSBzdG9yaW5nIHRoZSBjdXJyZW50IHVybCBzdGF0ZSBpbmZvcm1hdGlvbi5cblxuICAgIEBtZXRob2Qgcm91dGVcbiAgICBAcGFyYW0gc3RhdGUge09iamVjdH0gSFRNTDUgcHVzaHN0YXRlIHN0YXRlXG4gICMjI1xuICByb3V0ZTooIHN0YXRlICktPlxuXG4gICAgaWYgQHRyaWdnZXJcblxuICAgICAgIyB1cmwgZnJvbSBIaXN0b3J5SlNcbiAgICAgIHVybCA9IHN0YXRlLmhhc2ggfHwgc3RhdGUudGl0bGVcblxuICAgICAgIyBGSVhNRTogcXVpY2tmaXggZm9yIElFOCBidWdcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKCAnLicsICcnIClcblxuICAgICAgI3JlbW92ZSBiYXNlIHBhdGggZnJvbSBpbmNvbWluZyB1cmxcbiAgICAgICggdXJsID0gdXJsLnJlcGxhY2UgQHRoZS5iYXNlX3BhdGgsICcnICkgaWYgQHRoZS5iYXNlX3BhdGg/XG5cbiAgICAgICMgcmVtb3ZlcyB0aGUgcHJlcGVuZGVkICcuJyBmcm9tIEhpc3RvcnlKU1xuICAgICAgdXJsID0gdXJsLnNsaWNlIDEgaWYgKHVybC5zbGljZSAwLCAxKSBpcyAnLidcblxuICAgICAgIyBhZGRpbmcgYmFjayB0aGUgZmlyc3Qgc2xhc2ggJy8nIGluIGNhc2VzIGl0J3MgcmVtb3ZlZCBieSBIaXN0b3J5SlNcbiAgICAgIHVybCA9IFwiLyN7dXJsfVwiIGlmICh1cmwuc2xpY2UgMCwgMSkgaXNudCAnLydcblxuICAgICAgIyBmYWxsYmFjayB0byByb290IHVybCBpbiBjYXNlIHVzZXIgZW50ZXIgdGhlICcvJ1xuICAgICAgdXJsID0gQFJvdXRlcy5yb290IGlmIHVybCA9PSBcIi9cIlxuXG4gICAgICAjIHNlYXJjaCBpbiBhbGwgZGVmaW5lZCByb3V0ZXNcbiAgICAgIGZvciByb3V0ZSBpbiBAcm91dGVzXG4gICAgICAgIGlmIHJvdXRlLnRlc3QgdXJsXG4gICAgICAgICAgcmV0dXJuIEBvbl9jaGFuZ2Ugcm91dGUsIHVybFxuXG4gICAgICAjIGlmIG5vbmUgaXMgZm91bmQsIHRyaWVzIHRvIHJlbmRlciBiYXNlZCBvbiBkZWZhdWx0XG4gICAgICAjIGNvbnRyb2xsZXIvYWN0aW9uIHNldHRpbmdzXG4gICAgICB1cmxfcGFydHMgPSAodXJsLnJlcGxhY2UgL15cXC8vbSwgJycpLnNwbGl0ICcvJ1xuICAgICAgY29udHJvbGxlcl9uYW1lID0gdXJsX3BhcnRzWzBdXG4gICAgICBhY3Rpb25fbmFtZSA9IHVybF9wYXJ0c1sxXSBvciAnaW5kZXgnXG5cbiAgICAgIHRyeVxuICAgICAgICBDb250cm9sbGVyID0gcmVxdWlyZS5yZXNvbHZlICdhcHAvY29udHJvbGxlcnMvJyArIGNvbnRyb2xsZXJfbmFtZVxuICAgICAgICByb3V0ZSA9IEBtYXAgdXJsLCBcIiN7Y29udHJvbGxlcl9uYW1lfS8je2FjdGlvbl9uYW1lfVwiLCBudWxsLCAnYm9keSdcbiAgICAgICAgcmV0dXJuIEBvbl9jaGFuZ2Ugcm91dGUsIHVybFxuXG4gICAgICAjIG90aGVyd2lzZSByZW5kZXJzIHRoZSBub3QgZm91bmQgcm91dGVcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgZm9yIHJvdXRlIGluIEByb3V0ZXNcbiAgICAgICAgICBpZiByb3V0ZS50ZXN0IEBSb3V0ZXMubm90Zm91bmRcbiAgICAgICAgICAgIHJldHVybiBAb25fY2hhbmdlIHJvdXRlLCB1cmxcblxuICAgIEB0cmlnZ2VyID0gdHJ1ZVxuXG4gICMjIypcbiAgICBUZWxscyBUaGVvcmljdXMgdG8gbmF2aWdhdGUgdG8gYW5vdGhlciB2aWV3LlxuXG4gICAgQG1ldGhvZCBuYXZpZ2F0ZVxuICAgIEBwYXJhbSB1cmwge1N0cmluZ30gTmV3IHVybCBzdGF0ZS5cbiAgICBAcGFyYW0gW3RyaWdnZXI9dHJ1ZV0ge1N0cmluZ30gSWYgZmFsc2UsIGRvZXNuJ3QgY2hhbmdlIHRoZSBWaWV3LlxuICAgIEBwYXJhbSBbcmVwbGFjZT1mYWxzZV0ge1N0cmluZ30gSWYgdHJ1ZSwgcHVzaGVzIGEgbmV3IHN0YXRlIHRvIHRoZSBicm93c2VyLlxuICAjIyNcblxuICBuYXZpZ2F0ZTooIHVybCwgdHJpZ2dlciA9IHRydWUsIHJlcGxhY2UgPSBmYWxzZSApLT5cblxuICAgIGlmIG5vdCB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGVcbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24gPSB1cmxcblxuICAgIEB0cmlnZ2VyID0gdHJpZ2dlclxuXG4gICAgYWN0aW9uICAgPSBpZiByZXBsYWNlIHRoZW4gXCJyZXBsYWNlU3RhdGVcIiBlbHNlIFwicHVzaFN0YXRlXCJcbiAgICBIaXN0b3J5W2FjdGlvbl0gbnVsbCwgbnVsbCwgdXJsXG5cbiAgIyMjKlxuICAgIHt7I2Nyb3NzTGluayBcIlJvdXRlci9uYXZpZ2F0ZTptZXRob2RcIn19IF9fTmF2aWdhdGVfXyB7ey9jcm9zc0xpbmt9fSB0byB0aGUgaW5pdGlhbCB1cmwgc3RhdGUuXG5cbiAgICBAbWV0aG9kIHJ1blxuICAgIEBwYXJhbSB1cmwge1N0cmluZ30gTmV3IHVybCBzdGF0ZS5cbiAgICBAcGFyYW0gW3RyaWdnZXI9dHJ1ZV0ge1N0cmluZ30gSWYgZmFsc2UsIGRvZXNuJ3QgaGFuZGxlIHRoZSB1cmwncyBzdGF0ZS5cbiAgIyMjXG4gIHJ1bjooIHVybCwgdHJpZ2dlciA9IHRydWUgKT0+XG4gICAgKCB1cmwgPSB1cmwucmVwbGFjZSBAdGhlLmJhc2VfcGF0aCwgJycgKSBpZiBAdGhlLmJhc2VfcGF0aD9cblxuICAgIHVybCA9IHVybC5yZXBsYWNlIC9cXC8kL2csICcnXG5cbiAgICBAdHJpZ2dlciA9IHRyaWdnZXJcbiAgICBAcm91dGUgeyB0aXRsZTogdXJsIH1cblxuICAjIyMqXG4gICAgSWYgYGluZGV4YCBpcyBuZWdhdGl2ZSBnbyBiYWNrIHRocm91Z2ggYnJvd3NlciBoaXN0b3J5IGBpbmRleGAgdGltZXMsIGlmIGBpbmRleGAgaXMgcG9zaXRpdmUgZ28gZm9yd2FyZCB0aHJvdWdoIGJyb3dzZXIgaGlzdG9yeSBgaW5kZXhgIHRpbWVzLlxuXG4gICAgQG1ldGhvZCBnb1xuICAgIEBwYXJhbSBpbmRleCB7TnVtYmVyfVxuICAjIyNcbiAgZ286KCBpbmRleCApLT5cbiAgICBIaXN0b3J5LmdvIGluZGV4XG5cbiAgIyMjKlxuICAgIEdvIGJhY2sgb25jZSB0aHJvdWdoIGJyb3dzZXIgaGlzdG9yeS5cblxuICAgIEBtZXRob2QgYmFja1xuICAjIyNcbiAgYmFjazooKS0+XG4gICAgSGlzdG9yeS5iYWNrKClcblxuICAjIyMqXG4gICAgR28gZm9yd2FyZCBvbmNlIHRocm91Z2ggYnJvd3NlciBoaXN0b3J5LlxuXG4gICAgQG1ldGhvZCBmb3J3YXJkXG4gICMjI1xuICBmb3J3YXJkOigpLT5cbiAgICBIaXN0b3J5LmZvcndhcmQoKVxuIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUdBOzs7O0NBQUE7Q0FBQSxHQUFBLDhCQUFBO0dBQUEsK0VBQUE7O0FBS0EsQ0FMQSxFQUthLElBQUEsR0FBYixtQkFBYTs7QUFDYixDQU5BLEVBTVEsRUFBUixFQUFRLGVBQUE7O0FBRVIsQ0FSQSxNQVFBLG1CQUFBOztBQUVBLENBVkEsRUFVVSxDQVZWLEdBVUE7O0NBRUE7Ozs7O0NBWkE7O0FBaUJBLENBakJBLEVBaUJ1QixHQUFqQixDQUFOO0NBRUU7Ozs7O0NBQUE7Q0FBQSxDQUFBLENBS1EsR0FBUjs7Q0FFQTs7Ozs7Q0FQQTs7Q0FBQSxFQVlTLENBWlQsR0FZQTs7Q0FFQTs7Ozs7OztDQWRBOztDQXFCWSxDQUFBLENBQUEsR0FBQSxHQUFBLE9BQUc7Q0FDYixPQUFBLFNBQUE7T0FBQSxLQUFBO0NBQUEsRUFEYSxDQUFEO0NBQ1osRUFEbUIsQ0FBRCxFQUNsQjtDQUFBLEVBRDRCLENBQUQsS0FDM0I7Q0FBQSxnQ0FBQTtDQUFBLEVBQVUsQ0FBVixHQUFBO0NBRUE7Q0FBQSxRQUFBLElBQUE7MEJBQUE7Q0FDRSxDQUFZLENBQVosQ0FBQyxDQUFELENBQUE7Q0FERixJQUZBO0NBQUEsQ0FLNkIsQ0FBZSxDQUE1QyxFQUFBLENBQU8sRUFBcUMsSUFBNUM7Q0FDRyxJQUFBLEVBQWEsQ0FBUCxLQUFQO0NBREYsSUFBNEM7Q0FMNUMsRUFRVyxDQUFYLEtBQVcsQ0FBWDtDQUNFLEVBQUEsT0FBQTtDQUFBLEVBQUEsR0FBQSxFQUFxQjtDQUNyQixFQUFzQixDQUFBLENBQU8sQ0FBN0I7Q0FBQSxFQUFBLENBQUEsQ0FBTyxDQUFNLEVBQWI7UUFEQTtDQUVDLEVBQUQsRUFBQyxRQUFEO0NBSEYsQ0FJRSxHQUpTO0NBOUJiLEVBcUJZOztDQWVaOzs7Ozs7OztDQXBDQTs7Q0FBQSxDQTRDYSxDQUFiLEVBQUksSUFBRTtDQUNKLENBQXNDLENBQWIsQ0FBekIsQ0FBYSxDQUFOO0NBQ1AsSUFBQSxNQUFPO0NBOUNULEVBNENJOztDQUlKOzs7Ozs7OztDQWhEQTs7Q0FBQSxFQXdETSxFQUFOLElBQVE7Q0FFTixPQUFBLDRGQUFBO0NBQUEsR0FBQSxHQUFBO0NBR0UsRUFBQSxDQUFNLENBQUssQ0FBWDtDQUFBLENBR3dCLENBQXhCLEdBQUEsQ0FBTTtDQUdOLEdBQTRDLEVBQTVDLG9CQUFBO0NBQUEsQ0FBb0MsQ0FBbEMsQ0FBbUIsR0FBYixDQUFOLENBQU07UUFOUjtDQVNBLENBQW1DLENBQVYsQ0FBSixDQUFDLENBQXRCO0NBQUEsRUFBQSxFQUFNLEdBQU47UUFUQTtDQVlBLENBQWlDLENBQVYsQ0FBSixDQUFDLENBQXBCO0NBQUEsRUFBQSxLQUFBO1FBWkE7Q0FlQSxFQUFzQixDQUFBLENBQU8sQ0FBN0I7Q0FBQSxFQUFBLENBQU8sRUFBTSxFQUFiO1FBZkE7Q0FrQkE7Q0FBQSxVQUFBLGdDQUFBOzBCQUFBO0NBQ0UsRUFBRyxDQUFBLENBQUssR0FBUjtDQUNFLENBQXlCLENBQWxCLENBQUMsQ0FBRCxJQUFBLFFBQUE7VUFGWDtDQUFBLE1BbEJBO0NBQUEsQ0F3QmlDLENBQXJCLEVBQUEsQ0FBWixDQUFhLEVBQWI7Q0F4QkEsRUF5QmtCLEdBQWxCLEdBQTRCLE1BQTVCO0NBekJBLEVBMEJjLENBQWdCLEVBQTlCLENBMUJBLEVBMEJ3QixFQUF4QjtDQUVBO0NBQ0UsRUFBYSxJQUFPLENBQXBCLEVBQUEsS0FBYSxHQUFnQjtDQUE3QixDQUNrQixDQUFWLENBQUMsQ0FBVCxDQUFRLEVBQVIsR0FBUSxJQUFVO0NBQ2xCLENBQXlCLENBQWxCLENBQUMsQ0FBRCxJQUFBLE1BQUE7TUFIVCxFQUFBO0NBT0UsS0FBQSxFQURJO0NBQ0o7Q0FBQSxZQUFBLGlDQUFBOzZCQUFBO0NBQ0UsR0FBRyxDQUFLLENBQWEsRUFBbEIsRUFBSDtDQUNFLENBQXlCLENBQWxCLENBQUMsQ0FBRCxJQUFBLFVBQUE7WUFGWDtDQUFBLFFBUEY7UUEvQkY7TUFBQTtDQTBDQyxFQUFVLENBQVYsR0FBRCxJQUFBO0NBcEdGLEVBd0RNOztDQThDTjs7Ozs7Ozs7Q0F0R0E7O0NBQUEsQ0ErR2dCLENBQVAsSUFBQSxDQUFULENBQVc7Q0FFVCxLQUFBLEVBQUE7O0dBRndCLEdBQVY7TUFFZDs7R0FGd0MsR0FBVjtNQUU5QjtBQUFPLENBQVAsR0FBQSxFQUFhLENBQVEsRUFBckI7Q0FDRSxFQUF5QixHQUFaLEVBQU4sS0FBQTtNQURUO0NBQUEsRUFHVyxDQUFYLEdBQUE7Q0FIQSxFQUtjLENBQWQsRUFBQSxDQUFXLElBTFgsR0FLVztDQUNILENBQWMsQ0FBdEIsQ0FBQSxFQUFRLENBQUEsSUFBUjtDQXZIRixFQStHUzs7Q0FVVDs7Ozs7OztDQXpIQTs7Q0FBQSxDQWdJVyxDQUFYLElBQUksRUFBRTs7R0FBZSxHQUFWO01BQ1Q7Q0FBQSxHQUFBLHNCQUFBO0NBQUEsQ0FBb0MsQ0FBbEMsQ0FBbUIsRUFBbkIsQ0FBTSxFQUFBO01BQVI7Q0FBQSxDQUUwQixDQUExQixDQUFBLEVBQU0sQ0FBQTtDQUZOLEVBSVcsQ0FBWCxHQUFBO0NBQ0MsR0FBQSxDQUFELE1BQUE7Q0FBTyxDQUFTLENBQVQsRUFBRSxDQUFBO0NBTlAsS0FNRjtDQXRJRixFQWdJSTs7Q0FRSjs7Ozs7O0NBeElBOztDQUFBLENBOElBLENBQUcsRUFBQSxJQUFFO0NBQ0ssQ0FBUixHQUFBLEVBQU8sSUFBUDtDQS9JRixFQThJRzs7Q0FHSDs7Ozs7Q0FqSkE7O0NBQUEsRUFzSkssQ0FBTCxLQUFLO0NBQ0ssR0FBUixHQUFPLElBQVA7Q0F2SkYsRUFzSks7O0NBR0w7Ozs7O0NBekpBOztDQUFBLEVBOEpRLElBQVIsRUFBUTtDQUNFLE1BQUQsSUFBUDtDQS9KRixFQThKUTs7Q0E5SlI7O0NBbkJGIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6MTE1MzAsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJ2ZW5kb3JzL3RoZW9yaWN1cy93d3cvc3JjL3RoZW9yaWN1cy9tdmMvY29udHJvbGxlci5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiIyMjKlxuICBNVkMgbW9kdWxlXG4gIEBtb2R1bGUgbXZjXG4jIyNcblxuTW9kZWwgPSByZXF1aXJlICd0aGVvcmljdXMvbXZjL21vZGVsJ1xuVmlldyA9IHJlcXVpcmUgJ3RoZW9yaWN1cy9tdmMvdmlldydcbkZldGNoZXIgPSByZXF1aXJlICd0aGVvcmljdXMvbXZjL2xpYi9mZXRjaGVyJ1xuXG4jIyMqXG4gIFRoZSBjb250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIGZvciByZW5kZXJpbmcgdGhlIHZpZXcuXG5cbiAgSXQgcmVjZWl2ZXMgdGhlIFVSTCBwYXJhbXMsIHRvIGJlIHVzZWQgZm9yIE1vZGVsIGluc3RhbnRpYXRpb24uXG5cbiAgVGhlIGNvbnRyb2xsZXIgYWN0aW9ucyBhcmUgbWFwcGVkIHdpdGggdGhlIFVSTCBzdGF0ZXMgKHJvdXRlcykgaW4gdGhlIGFwcCBgcm91dGVzYCBmaWxlLlxuXG4gIEBjbGFzcyBDb250cm9sbGVyXG4jIyNcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ29udHJvbGxlclxuXG4gICMjI1xuICBAcGFyYW0gW3RoZW9yaWN1cy5UaGVvcmljdXNdIEB0aGUgICBTaG9ydGN1dCBmb3IgYXBwJ3MgaW5zdGFuY2VcbiAgIyMjXG4gICMjIypcbiAgICBUaGlzIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGJ5IHRoZSBGYWN0b3J5LiBJdCBzYXZlcyBhIGBAdGhlYCByZWZlcmVuY2UgaW5zaWRlIHRoZSBjb250cm9sbGVyLlxuXG4gICAgQG1ldGhvZCBfYm9vdFxuICAgIEBwYXJhbSBAdGhlIHtUaGVvcmljdXN9IFNob3J0Y3V0IGZvciBhcHAncyBpbnN0YW5jZVxuICAjIyNcbiAgX2Jvb3Q6ICggQHRoZSApIC0+IEBcblxuICAjIyMqXG4gICAgQnVpbGQgYSBkZWZhdWx0IGFjdGlvbiAoIHJlbmRlcnMgdGhlIHZpZXcgcGFzc2luZyBhbGwgbW9kZWwgcmVjb3JkcyBhcyBkYXRhKSBpbiBjYXNlIHRoZSBjb250cm9sbGVyIGRvZXNuJ3QgaGF2ZSBhbiBhY3Rpb24gaW1wbGVtZW50ZWQgZm9yIHRoZSBjdXJyZW50IGBwcm9jZXNzYCBjYWxsLlxuXG4gICAgQG1ldGhvZCBfYnVpbGRfYWN0aW9uXG4gICAgQHBhcmFtIHByb2Nlc3Mge1Byb2Nlc3N9IEN1cnJlbnQge3sjY3Jvc3NMaW5rIFwiUHJvY2Vzc1wifX17ey9jcm9zc0xpbmt9fSBiZWluZyBleGVjdXRlZC5cbiAgIyMjXG4gIF9idWlsZF9hY3Rpb246ICggcHJvY2VzcyApIC0+XG4gICAgKCBwYXJhbXMsIGZuICk9PlxuICAgICAgY29udHJvbGxlcl9uYW1lID0gcHJvY2Vzcy5yb3V0ZS5jb250cm9sbGVyX25hbWVcbiAgICAgIGFjdGlvbl9uYW1lID0gcHJvY2Vzcy5yb3V0ZS5hY3Rpb25fbmFtZVxuXG4gICAgICBtb2RlbF9uYW1lID0gY29udHJvbGxlcl9uYW1lLnNpbmd1bGFyaXplKClcbiAgICAgIEB0aGUuZmFjdG9yeS5tb2RlbCBtb2RlbF9uYW1lLCBudWxsLCAobW9kZWwpPT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBtb2RlbD9cblxuICAgICAgICB2aWV3X2ZvbGRlciA9IGNvbnRyb2xsZXJfbmFtZVxuICAgICAgICB2aWV3X25hbWUgICA9IGFjdGlvbl9uYW1lXG5cbiAgICAgICAgaWYgbW9kZWwuYWxsP1xuICAgICAgICAgIEByZW5kZXIgXCIje3ZpZXdfZm9sZGVyfS8je3ZpZXdfbmFtZX1cIiwgbW9kZWwuYWxsKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEByZW5kZXIgXCIje3ZpZXdfZm9sZGVyfS8je3ZpZXdfbmFtZX1cIlxuXG4gICMjI1xuICBSZW5kZXJzIHRvIHNvbWUgdmlld1xuXG4gIEBwYXJhbSBbU3RyaW5nXSBwYXRoICBQYXRoIHRvIHZpZXcgb24gdGhlIGFwcCB0cmVlXG4gIEBwYXJhbSBbU3RyaW5nXSBkYXRhICBkYXRhIHRvIGJlIHJlbmRlcmVkIG9uIHRoZSB0ZW1wbGF0ZVxuICAjIyNcblxuICAjIyMqXG4gICAgUmVzcG9uc2libGUgZm9yIHJlbmRlcmluZyB0aGUgVmlldy5cblxuICAgIFVzdWFsbHksIHRoaXMgbWV0aG9kIGlzIGV4ZWN1dGVkIGluIHRoZSBjb250cm9sbGVyIGFjdGlvbiBtYXBwZWQgd2l0aCB0aGUgYHJvdXRlYC5cbiAgICBcbiAgICBAbWV0aG9kIHJlbmRlclxuICAgIEBwYXJhbSBwYXRoIHtTdHJpbmd9IFZpZXcncyBmaWxlIHBhdGguIFxuICAgIEBwYXJhbSBkYXRhIHtPYmplY3R9IERhdGEgdG8gYmUgcGFzc2VkIHRvIHRoZSB2aWV3LiBcblxuICAgIEBleGFtcGxlXG4gICAgICAgIGluZGV4OihpZCktPiAjIENvbnRyb2xsZXIgYWN0aW9uXG4gICAgICAgICAgICByZW5kZXIgXCJhcHAvdmlld3MvaW5kZXhcIiwgTW9kZWwuZmlyc3QoKVxuICAjIyNcbiAgcmVuZGVyOiggcGF0aCwgZGF0YSApLT5cbiAgICBAdGhlLmZhY3RvcnkudmlldyBwYXRoLCAodmlldyk9PlxuICAgICAgcmV0dXJuIHVubGVzcyB2aWV3P1xuXG4gICAgICBAcHJvY2Vzcy52aWV3ID0gdmlld1xuXG4gICAgICB2aWV3LnByb2Nlc3MgPSBAcHJvY2Vzc1xuICAgICAgdmlldy5hZnRlcl9pbiA9IEBhZnRlcl9yZW5kZXJcblxuICAgICAgaWYgZGF0YSBpbnN0YW5jZW9mIEZldGNoZXJcbiAgICAgICAgaWYgZGF0YS5sb2FkZWRcbiAgICAgICAgICB2aWV3Ll9yZW5kZXIgZGF0YS5yZWNvcmRzXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkYXRhLm9ubG9hZCA9ICggcmVjb3JkcyApID0+XG4gICAgICAgICAgICB2aWV3Ll9yZW5kZXIgcmVjb3Jkc1xuICAgICAgZWxzZVxuICAgICAgICB2aWV3Ll9yZW5kZXIgZGF0YVxuXG5cbiAgIyB+PiBTaG9ydGN1dHNcblxuICAjIyMqXG4gICAgU2hvcnRjdXQgZm9yIGFwcGxpY2F0aW9uIG5hdmlnYXRlLlxuXG4gICAgTmF2aWdhdGUgdG8gdGhlIGdpdmVuIFVSTC5cblxuICAgIEBtZXRob2QgbmF2aWdhdGVcbiAgICBAcGFyYW0gdXJsIHtTdHJpbmd9IFVSTCB0byBuYXZpZ2F0ZSB0by5cbiAgIyMjXG4gIG5hdmlnYXRlOiggdXJsICktPlxuXG4gICAgIyBpZiByZWRpcmVjdCBpcyBjYWxsZWQgZHVyaW5nIHRoZSBhY3Rpb24gZXhlY3V0aW9uLCBzb21lIG9wZXJhdGlvbnMgbXVzdCB0b1xuICAgICMgYmUgcGVyZm9ybWVkIGluIG9yZGVyIHRvIGVmZmVjdGl2ZWx5IGtpbGwgdGhlIHJ1bm5pbmcgcHJvY2VzcyBwcmVtYXR1cmVseVxuICAgICMgYmVmb3JlIHRoZSByb3V0ZXIncyBuYXZpZ2F0aW9uIGdldHMgY2FsbGVkXG4gICAgIyBcbiAgICAjIGZvciB0aGlzIHRvIHdvcmssIHlvdXIgQHJlbmRlciBtZXRob2QgbXVzdCBub3QgYmUgY2FsbGVkLCBpZTpcbiAgICAjIFxuICAgICMgYWN0aW9uOi0+XG4gICAgIyAgIGlmIHVzZXJfaXNfbG9nZ2VkXG4gICAgIyAgICAgcmV0dXJuIEByZWRpcmVjdCAnL3NpZ25pbidcbiAgICAjICAgQHJlbmRlciAnL3NpZ25lZGluJ1xuICAgICMgXG4gICAgaWYgQHByb2Nlc3MuaXNfaW5fdGhlX21pZGRsZV9vZl9ydW5uaW5nX2FuX2FjdGlvblxuXG4gICAgICAjIGtpbGwgY3VycmVudCBydW5uaW5nIHByb2Nlc3NcbiAgICAgIEBwcm9jZXNzLnByb2Nlc3Nlcy5hY3RpdmVfcHJvY2Vzc2VzLnBvcCgpXG4gICAgICBAcHJvY2Vzcy5wcm9jZXNzZXMucGVuZGluZ19wcm9jZXNzZXMgPSBbXVxuXG4gICAgICAjIGZpcmVzIGFmdGVyX3JlbmRlciBwcmVtYXR1cmVseSB0byB3aXBlIHRoZSBmcmVzaCBnbHVlXG4gICAgICBAYWZ0ZXJfcmVuZGVyKClcblxuICAgICMgYW5kIHJlZGlyZWN0cyB1c2VyXG4gICAgQHRoZS5wcm9jZXNzZXMucm91dGVyLm5hdmlnYXRlIHVybCJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQTs7OztDQUFBO0NBQUEsR0FBQSw0QkFBQTs7QUFLQSxDQUxBLEVBS1EsRUFBUixFQUFRLGNBQUE7O0FBQ1IsQ0FOQSxFQU1PLENBQVAsR0FBTyxhQUFBOztBQUNQLENBUEEsRUFPVSxJQUFWLG9CQUFVOztDQUVWOzs7Ozs7Ozs7Q0FUQTs7QUFrQkEsQ0FsQkEsRUFrQnVCLEdBQWpCLENBQU47Q0FFRTs7Q0FBQTs7O0NBQUE7O0NBR0E7Ozs7OztDQUhBOztDQUFBLEVBU08sRUFBUCxJQUFVO0NBQVMsRUFBVCxDQUFEO0NBQUYsVUFBWTtDQVRuQixFQVNPOztDQUVQOzs7Ozs7Q0FYQTs7Q0FBQSxFQWlCZSxJQUFBLEVBQUUsSUFBakI7Q0FDRSxPQUFBLElBQUE7RUFBVSxDQUFWLEdBQUEsR0FBRSxFQUFGO0NBQ0UsU0FBQSw4QkFBQTtDQUFBLEVBQWtCLEVBQWEsQ0FBL0IsQ0FBeUIsUUFBekI7Q0FBQSxFQUNjLEVBQWEsQ0FBM0IsQ0FBcUIsSUFBckI7Q0FEQSxFQUdhLEdBQWIsSUFBQSxDQUFhLElBQWU7Q0FDM0IsQ0FBOEIsQ0FBM0IsQ0FBSixDQUFDLEVBQVcsRUFBMEIsQ0FBdEMsR0FBQTtDQUNFLFdBQUEsVUFBQTtDQUFBLEdBQWMsSUFBZCxLQUFBO0NBQUEsZUFBQTtVQUFBO0NBQUEsRUFFYyxLQUFkLEdBQUEsSUFGQTtDQUFBLEVBR2MsS0FBZCxDQUFBLEVBSEE7Q0FLQSxHQUFHLElBQUgsU0FBQTtDQUNHLENBQU8sQ0FBRSxFQUFULENBQUQsR0FBQSxFQUFRLE1BQVI7TUFERixJQUFBO0NBR0csQ0FBTyxDQUFFLEVBQVQsQ0FBRCxHQUFBLEVBQVEsTUFBUjtVQVRpQztDQUFyQyxNQUFxQztDQU4xQixJQUNiO0NBbEJGLEVBaUJlOztDQWlCZjs7Ozs7O0NBbENBOztDQXlDQTs7Ozs7Ozs7Ozs7OztDQXpDQTs7Q0FBQSxDQXNEZSxDQUFSLENBQUEsRUFBUCxHQUFTO0NBQ1AsT0FBQSxJQUFBO0NBQUMsQ0FBdUIsQ0FBcEIsQ0FBSCxHQUFXLEVBQWEsRUFBekI7Q0FDRSxHQUFjLEVBQWQsTUFBQTtDQUFBLGFBQUE7UUFBQTtDQUFBLEVBRWdCLENBQWhCLENBQUMsQ0FBRCxDQUFRO0NBRlIsRUFJZSxDQUFYLENBQVksQ0FBaEIsQ0FBQTtDQUpBLEVBS2dCLENBQVosQ0FBYSxDQUFqQixFQUFBLElBTEE7Q0FPQSxHQUFHLEVBQUgsQ0FBQSxLQUFtQjtDQUNqQixHQUFHLEVBQUgsRUFBQTtDQUNPLEdBQUQsR0FBSixVQUFBO01BREYsSUFBQTtDQUdPLEVBQVMsQ0FBVixFQUFKLENBQWMsRUFBRSxRQUFoQjtDQUNPLEdBQUQsR0FBSixZQUFBO0NBSkosVUFHZ0I7VUFKbEI7TUFBQSxFQUFBO0NBT08sR0FBRCxHQUFKLFFBQUE7UUFmb0I7Q0FBeEIsSUFBd0I7Q0F2RDFCLEVBc0RPOztDQXFCUDs7Ozs7Ozs7Q0EzRUE7O0NBQUEsRUFtRlMsS0FBVCxDQUFXO0NBYVQsR0FBQSxHQUFXLDhCQUFYO0NBR0UsRUFBQSxDQUFDLEVBQUQsQ0FBUSxFQUFVLE9BQWlCO0NBQW5DLENBQUEsQ0FDdUMsQ0FBdEMsRUFBRCxDQUFRLEVBQVUsUUFBbEI7Q0FEQSxHQUlDLEVBQUQsTUFBQTtNQVBGO0NBVUMsRUFBRyxDQUFILEVBQW9CLEVBQXJCLENBQWMsRUFBZDtDQTFHRixFQW1GUzs7Q0FuRlQ7O0NBcEJGIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6MTE2NzcsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJ2ZW5kb3JzL3RoZW9yaWN1cy93d3cvc3JjL3RoZW9yaWN1cy9tdmMvbGliL2JpbmRlci5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBCaW5kZXJcblxuICAjIHNvbWUgcmVnZXhlcyB1c2VkIHRvIGNhdGNoIGJpbmRzIGluamVjdGVkIGJ5IHRoZW9yaWN1cydzIGNvbXBpbGVyXG5cbiAgIyBtYXRjaCBhbnkgYmluZFxuICBjb250ZXh0X3JlZyA9ICcoPCEtLSBAW1xcXFx3XSsgLS0+KShbXjxdKykoPCEtLSBcXC9AW1xcXFx3XSsgLS0+KSdcblxuICAjIHRlbXBsYXRlIGZvciBtYXRjaGluZyBvbmUgc3BlY2lmaWMgYmluZFxuICBiaW5kX3JlZyA9IFwiKDwhLS0gQH5LRVkgLS0+KShbXjxdKykoPCEtLSBcXC9AfktFWSAtLT4pXCJcblxuICAjIG1hdGNoIHRoZSBiaW5kJ3MgdmFyaWFibGUgbmFtZVxuICBiaW5kX25hbWVfcmVnID0gLyg8IS0tIEApKFtcXHddKykoIC0tPikvXG5cbiAgIyBjb250YWluZXIgZm9yIGFsbCBmb3VuZCBiaW5kc1xuICBiaW5kczogbnVsbFxuXG4gIGJpbmQ6KCBkb20sIGp1c3RfY2xlYW5fYXR0cnMgKS0+XG4gICAgcGFyc2UgKEBiaW5kcyA9IHt9KSwgZG9tLCBqdXN0X2NsZWFuX2F0dHJzXG5cbiAgdXBkYXRlOiggZmllbGQsIHZhbCApLT5cbiAgICByZXR1cm4gdW5sZXNzIEBiaW5kcz9cbiAgICByZXR1cm4gdW5sZXNzIEBiaW5kc1tmaWVsZF0/XG5cbiAgICBmb3IgaXRlbSBpbiAoQGJpbmRzW2ZpZWxkXSB8fCBbXSlcbiAgICAgIFxuICAgICAgbm9kZSA9ICgkIGl0ZW0udGFyZ2V0KVxuICAgICAgc3dpdGNoIGl0ZW0udHlwZVxuICAgICAgICB3aGVuICdub2RlJ1xuICAgICAgICAgIGN1cnJlbnQgPSBub2RlLmh0bWwoKVxuICAgICAgICAgIHNlYXJjaCA9IG5ldyBSZWdFeHAgKGJpbmRfcmVnLnJlcGxhY2UgL1xcfktFWS9nLCBmaWVsZCksICdnJ1xuICAgICAgICAgIHVwZGF0ZWQgPSBjdXJyZW50LnJlcGxhY2Ugc2VhcmNoLCBcIiQxI3t2YWx9JDNcIlxuICAgICAgICAgIG5vZGUuaHRtbCB1cGRhdGVkXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICB3aGVuICdhdHRyJ1xuICAgICAgICAgIG5vZGUuYXR0ciBpdGVtLmF0dHIsIHZhbFxuXG4gIHBhcnNlID0gKGJpbmRzLCBkb20sIGp1c3RfY2xlYW5fYXR0cnMpLT5cbiAgICBkb20uY2hpbGRyZW4oKS5lYWNoIC0+XG4gICAgICAjIHNlYXJjaGluZyBmb3IgYmluZHMgaW4gbm9kZSBhdHRyaWJ1dGVzXG4gICAgICBmb3IgYXR0ciBpbiB0aGlzLmF0dHJpYnV0ZXNcbiAgICAgICAgbmFtZSA9IGF0dHIubm9kZU5hbWVcbiAgICAgICAgdmFsdWUgPSBhdHRyLm5vZGVWYWx1ZVxuXG4gICAgICAgICMgZ2V0IGF0dHJpYnV0ZSdzIGJpbmRzXG4gICAgICAgIG1hdGNoX3NpbmdsZSA9IG5ldyBSZWdFeHAgY29udGV4dF9yZWdcbiAgICAgICAgaWYgbWF0Y2hfc2luZ2xlLnRlc3QgdmFsdWVcbiAgICAgICAgICBrZXkgPSAodmFsdWUubWF0Y2ggYmluZF9uYW1lX3JlZylbMl1cbiAgICAgICAgICAoKCQgdGhpcykuYXR0ciBuYW1lLCAodmFsdWUubWF0Y2ggbWF0Y2hfc2luZ2xlKVsyXSlcblxuICAgICAgICAgIGlmIGp1c3RfY2xlYW5fYXR0cnMgaXMgZmFsc2VcbiAgICAgICAgICAgIGNvbGxlY3QgYmluZHMsIHRoaXMsICdhdHRyJywga2V5LCBuYW1lXG5cbiAgICAgIGlmIGp1c3RfY2xlYW5fYXR0cnMgaXMgZmFsc2VcbiAgICAgICAgIyBwcmVwYXJpbmcgbm9kZSB0byBzdGFydCB0aGUgc2VhcmNoIGZvciBiaW5kc1xuICAgICAgICBtYXRjaF9hbGwgPSBuZXcgUmVnRXhwIGNvbnRleHRfcmVnLCAnZydcbiAgICAgICAgdGV4dCA9ICgkIHRoaXMgKS5jbG9uZSgpLmNoaWxkcmVuKCkucmVtb3ZlKCkuZW5kKCkuaHRtbCgpXG4gICAgICAgIHRleHQgPSBcIiN7dGV4dH1cIlxuXG4gICAgICAgICMgZ2V0IGFsbCBiaW5kcyAobXVsdGlwbGUgYmluZHMgcGVyIG5vZGUgaXMgYWxsb3dlZClcbiAgICAgICAga2V5cyA9ICh0ZXh0Lm1hdGNoIG1hdGNoX2FsbCkgb3IgW11cblxuICAgICAgICAjIGNvbGxlY3RzIGFsbCBmb3VuZCBiaW5kcyBmb3IgdGhlIG5vZGUgdmFsdWVcbiAgICAgICAgZm9yIGtleSBpbiBrZXlzXG4gICAgICAgICAga2V5ID0gKGtleS5tYXRjaCBiaW5kX25hbWVfcmVnKVsyXVxuICAgICAgICAgIGNvbGxlY3QgYmluZHMsIHRoaXMsICdub2RlJywga2V5XG5cbiAgICAgICMga2VlcCBwYXJzaW5nIHRoZSBkb20gcmVjdXJzaXZlbHlcbiAgICAgIHBhcnNlIGJpbmRzLCAoJCB0aGlzKSwganVzdF9jbGVhbl9hdHRyc1xuXG4gIGNvbGxlY3QgPSAoYmluZHMsIHRhcmdldCwgdHlwZSwgdmFyaWFibGUsIGF0dHIpLT5cbiAgICBiaW5kID0gKGJpbmRzW3ZhcmlhYmxlXSA/PSBbXSlcbiAgICB0bXAgPSB0eXBlOiB0eXBlLCB0YXJnZXQ6IHRhcmdldFxuICAgIHRtcC5hdHRyID0gYXR0ciBpZiBhdHRyP1xuICAgIGJpbmQucHVzaCB0bXAgIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBLElBQUEsRUFBQTs7QUFBQSxDQUFBLEVBQXVCLEdBQWpCLENBQU47Q0FLRSxLQUFBLDhDQUFBOztDQUFBOztDQUFBLENBQUEsQ0FBYyxRQUFkLG9DQUFBOztDQUFBLENBR0EsQ0FBVyxLQUFYLG1DQUhBOztDQUFBLENBTUEsQ0FBZ0IsVUFBaEIsVUFOQTs7Q0FBQSxFQVNPLENBVFAsQ0FTQTs7Q0FUQSxDQVdZLENBQVAsQ0FBTCxLQUFPLE9BQUY7Q0FDRyxDQUFBLENBQVUsQ0FBUixDQUFSLE1BQUEsS0FBQTtDQVpGLEVBV0s7O0NBWEwsQ0FjZ0IsQ0FBVCxFQUFBLENBQVAsR0FBUztDQUNQLE9BQUEsc0RBQUE7Q0FBQSxHQUFBLGNBQUE7Q0FBQSxXQUFBO01BQUE7Q0FDQSxHQUFBLHFCQUFBO0NBQUEsV0FBQTtNQURBO0NBR0E7Q0FBQTtVQUFBLGlDQUFBO3VCQUFBO0NBRUUsRUFBUSxDQUFSLEVBQUE7Q0FDQSxHQUFXLFVBQUo7Q0FBUCxLQUFBLE9BQ087Q0FDSCxFQUFVLENBQUksR0FBZCxHQUFBO0NBQUEsQ0FDZ0QsQ0FBbkMsQ0FBQSxDQUFRLENBQXJCLENBQXFCLENBQVEsRUFBN0I7Q0FEQSxDQUVtQyxDQUF6QixDQUF5QixFQUF6QixDQUFWLEdBQUE7Q0FGQSxHQUdJLEdBQUosR0FBQTtDQUNBLGVBTko7Q0FBQSxLQUFBLE9BUU87Q0FDSCxDQUFxQixDQUFyQixDQUFJO0NBREQ7Q0FSUDtDQUFBO0NBQUEsTUFIRjtDQUFBO3FCQUpLO0NBZFAsRUFjTzs7Q0FkUCxDQWdDQSxDQUFRLEVBQVIsSUFBUyxPQUFEO0NBQ0YsRUFBRCxDQUFILElBQUEsQ0FBb0IsRUFBcEI7Q0FFRSxTQUFBLDRFQUFBO0NBQUE7Q0FBQSxVQUFBLGdDQUFBO3lCQUFBO0NBQ0UsRUFBTyxDQUFQLElBQUE7Q0FBQSxFQUNRLENBQUksQ0FBWixHQUFBLENBREE7Q0FBQSxFQUltQixDQUFBLEVBQUEsRUFBbkIsR0FBbUIsQ0FBbkI7Q0FDQSxHQUFHLENBQUEsR0FBSCxJQUFlO0NBQ2IsRUFBQSxFQUFZLEtBQVosR0FBTztDQUFQLENBQ3FCLEVBQW5CLENBQXlCLEtBQTFCLEVBQXFCO0NBRXRCLEdBQUcsQ0FBb0IsS0FBdkIsTUFBRztDQUNELENBQWUsQ0FBZixDQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUE7WUFMSjtVQU5GO0NBQUEsTUFBQTtDQWFBLEdBQUcsQ0FBb0IsQ0FBdkIsVUFBRztDQUVELENBQW9DLENBQXBCLENBQUEsRUFBQSxFQUFoQixDQUFBLEVBQWdCO0NBQWhCLEVBQ08sQ0FBUCxDQUFPLENBQUEsRUFBUDtDQURBLENBRU8sQ0FBQSxDQUFQLElBQUE7Q0FGQSxDQUFBLENBS08sQ0FBUCxDQUFRLEdBQVIsQ0FBUTtBQUdSLENBQUEsWUFBQSxnQ0FBQTswQkFBQTtDQUNFLEVBQUEsRUFBTyxLQUFQLEdBQU87Q0FBUCxDQUNlLENBQWYsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBO0NBRkYsUUFWRjtRQWJBO0NBNEJNLENBQVEsRUFBQSxDQUFkLFFBQUEsR0FBQTtDQTlCRixJQUFvQjtDQWpDdEIsRUFnQ1E7O0NBaENSLENBaUVBLENBQVUsQ0FBQSxDQUFBLENBQUEsQ0FBVixDQUFVLENBQUM7Q0FDVCxPQUFBLENBQUE7Q0FBQSxDQUFPLENBQUEsQ0FBUCxDQUFjLEdBQUE7Q0FBZCxFQUNBLENBQUE7Q0FBTSxDQUFNLEVBQU4sRUFBQTtDQUFBLENBQW9CLElBQVI7Q0FEbEIsS0FBQTtDQUVBLEdBQUEsUUFBQTtDQUFBLEVBQUcsQ0FBSCxFQUFBO01BRkE7Q0FHSyxFQUFMLENBQUksT0FBSjtDQXJFRixFQWlFVTs7Q0FqRVY7O0NBTEYiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjoxMTc3NywKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInZlbmRvcnMvdGhlb3JpY3VzL3d3dy9zcmMvdGhlb3JpY3VzL212Yy9saWIvZmV0Y2hlci5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBGZXRjaGVyXG4gIGxvYWRlZDogbnVsbFxuXG4gIG9ubG9hZDogbnVsbFxuICBvbmVycm9yOiBudWxsXG5cbiAgZGF0YTogbnVsbCJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQSxJQUFBLEdBQUE7O0FBQUEsQ0FBQSxFQUF1QixHQUFqQixDQUFOO0NBQ0U7O0NBQUEsRUFBUSxDQUFSLEVBQUE7O0NBQUEsRUFFUSxDQUZSLEVBRUE7O0NBRkEsRUFHUyxDQUhULEdBR0E7O0NBSEEsRUFLTSxDQUFOOztDQUxBOztDQURGIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6MTE3OTYsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJ2ZW5kb3JzL3RoZW9yaWN1cy93d3cvc3JjL3RoZW9yaWN1cy9tdmMvbW9kZWwuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIkFycmF5VXRpbCA9IHJlcXVpcmUgJ3RoZW9yaWN1cy91dGlscy9hcnJheV91dGlsJ1xuQmluZGVyID0gcmVxdWlyZSAndGhlb3JpY3VzL212Yy9saWIvYmluZGVyJ1xuRmV0Y2hlciA9IHJlcXVpcmUgJ3RoZW9yaWN1cy9tdmMvbGliL2ZldGNoZXInXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTW9kZWwgZXh0ZW5kcyBCaW5kZXJcblxuICBARmFjdG9yeSAgICAgPSBudWxsICMgd2lsbCBiZSBkZWZpbmVkIG9uIEZhY3RvcnkgY29uc3RydWN0b3JcbiAgQF9maWVsZHMgICAgID0gW11cbiAgQF9jb2xsZWN0aW9uID0gW11cblxuICAjIFNFVFVQIE1FVEhPRFMgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgQHJlc3QgPSAoIGhvc3QsIHJlc291cmNlcyApIC0+XG5cbiAgICBbcmVzb3VyY2VzLCBob3N0XSA9IFtob3N0LCBudWxsXSB1bmxlc3MgcmVzb3VyY2VzP1xuXG4gICAgZm9yIGssIHYgb2YgcmVzb3VyY2VzXG4gICAgICBAW2tdID0gQF9idWlsZF9yZXN0LmFwcGx5IEAsIFtrXS5jb25jYXQodi5jb25jYXQgaG9zdClcblxuICBAZmllbGRzID0gKCBmaWVsZHMsIG9wdHMgPSB2YWxpZGF0ZTogdHJ1ZSApIC0+XG4gICAgQF9idWlsZF9ncyBrZXksIHR5cGUsIG9wdHMgZm9yIGtleSwgdHlwZSBvZiBmaWVsZHNcblxuXG5cbiAgIyAjIFNFVFVQIEhFTFBFUlMgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgIyMjXG4gIEJ1aWxkcyBhIG1ldGhvZCB0byBmZXRjaCB0aGUgZ2l2ZW4gc2VydmljZS5cblxuICBOb3RpY2UgdGhlIG1ldGhvZCBpcyBiZWluZyByZXR1cm5lZCBpbnNpZGUgYSBwcml2YXRlIHNjb3BlXG4gIHRoYXQgY29udGFpbnMgYWxsIHRoZSB2YXJpYWJsZXMgbmVlZGVkIHRvIGZldGNoIHRoZSBkYXRhLlxuXG4gIFxuICBAcGFyYW0gW1N0cmluZ10ga2V5ICAgXG4gIEBwYXJhbSBbU3RyaW5nXSBtZXRob2QgIFxuICBAcGFyYW0gW1N0cmluZ10gdXJsICAgXG4gIEBwYXJhbSBbU3RyaW5nXSBkb21haW4gIFxuICAjIyNcbiAgQF9idWlsZF9yZXN0ID0gKCBrZXksIG1ldGhvZCwgdXJsLCBkb21haW4gKSAtPlxuICAgICMgY29uc29sZS5sb2cgJ2J1aWxkaW5nIC0+Jywga2V5LCBtZXRob2QsIHVybCwgZG9tYWluXG5cbiAgICByZXR1cm4gY2FsbCA9ICggYXJncy4uLiApIC0+XG5cbiAgICAgIGlmIGRvbWFpbj8gJiYgZG9tYWluLnN1YnN0cmluZyggZG9tYWluLmxlbmd0aCAtIDEgKSBpcyBcIi9cIlxuICAgICAgICBkb21haW4gPSBkb21haW4uc3Vic3RyaW5nIDAsIGRvbWFpbi5sZW5ndGggLSAxXG5cbiAgICAgICNjb25zb2xlLmxvZyAnY2FsbGluZyAtLT4nLCBrZXksIG1ldGhvZCwgdXJsLCBkb21haW4sIGFyZ3NcbiAgICAgIFxuICAgICAgIyB3aGVuIGFza2luZyB0byByZWFkIGEgcmVnaXN0cnksIGNoZWNrIGlmIGl0IHdhcyBhbHJlYWR5IGxvYWRlZFxuICAgICAgIyBpZiBzbywgcmV0dXJuIHRoZSBjYWNoZWQgZW50cnlcbiAgICAgIGlmIGtleSBpcyBcInJlYWRcIiBhbmQgQF9jb2xsZWN0aW9uLmxlbmd0aFxuICAgICAgICBmb3VuZCA9IEFycmF5VXRpbC5maW5kIEBfY29sbGVjdGlvbiwge2lkOiBhcmdzWzBdfVxuICAgICAgICByZXR1cm4gZm91bmQuaXRlbSBpZiBmb3VuZD9cbiAgICAgIFxuICAgICAgIyB3aGVuIGNhbGxpbmcgYSBtZXRob2QsIHlvdSBjYW4gcGFzcyBhcyBsYXN0IGFyZ3VtZW50XG4gICAgICAjIG9uZSBvYmplY3QgdGhhdCB3aWxsIGJlIHNlbnQgYXMgZGF0YSBkdXJpbmcgdGhlIFwiYWpheCBjYWxsXCJcbiAgICAgIGlmIGFyZ3MubGVuZ3RoXG4gICAgICAgIGlmICh0eXBlb2YgYXJnc1thcmdzLmxlbmd0aC0xXSBpcyAnb2JqZWN0JylcbiAgICAgICAgICBkYXRhID0gYXJncy5wb3AoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZGF0YSA9ICcnXG5cbiAgICAgICMgY3JlYXRpbmcgYSBuZXcgdmFyaWFibGUgZm9yIHJlcXVlc3QgdXJsIGluIG9yZGVyIHRvIGRvIHRoZSByZXBsYWNpbmdcbiAgICAgICMgbG9naWMgZnJvbSBzY3JhdGNoIGV2ZXJ5IHRpbWUgdGhlIG1ldGhvZCBpcyBjYWxsZWRcbiAgICAgICMgZm9yIHNvbWUgXCJ3ZWlyZFwiIHJlYXNvbiB3aXRob3V0IHRoaXMgXCJoYWNrXCIgdGhlIHVybCB3b3VsZCBcbiAgICAgICMgYnVpbGQgb24gdG9wIG9mIHRoZSBsYXN0IGJ1aWx0IHVybCwgcmVzdWx0aW5nIGluIHdyb25nIGFkZHJlc3Nlc1xuICAgICAgcl91cmwgPSB1cmxcblxuICAgICAgIyBZb3UgY2FuIHNldCB2YXJpYWJsZXMgb24gdGhlIFVSTCB1c2luZyBcIjp2YXJpYWJsZVwiXG4gICAgICAjIGFuZCB0aGV5J2xsIGJlIHJlcGxhY2UgYnkgdGhlIGFyZ3MgeW91IHBhc3MuXG4gICAgICAjIFxuICAgICAgIyBpLmUuIFxuICAgICAgIyBAcmVzdFxuICAgICAgIyAgICAgJ2FsbCcgOiBbICdHRVQnLCAnbXkvcGF0aC90by86aWQuanNvbicgXVxuICAgICAgIyBcbiAgICAgICMgY2FsbGVkIGFzIE15TW9kZWwuYWxsKCA2NiApXG4gICAgICAjIHdpbGwgcmVzdWx0IGluIGEgY2FsbCB0byBcIm15L3BhdGgvdG8vNjYuanNvblwiXG4gICAgICAjIFxuICAgICAgd2hpbGUgKC86W2Etel0rLy5leGVjIHJfdXJsKT9cbiAgICAgICAgcl91cmwgPSB1cmwucmVwbGFjZSAvOlthLXpdKy8sIGFyZ3Muc2hpZnQoKSB8fCBudWxsXG5cbiAgICAgICMgaWYgZG9tYWluIGlzIHNwZWNpZmllZCB3ZSBwcmVwZW5kIHRvIHRoZSB1cmxcbiAgICAgIHJfdXJsID0gXCIje2RvbWFpbn0vI3tyX3VybH1cIiBpZiBkb21haW4/XG5cbiAgICAgIEBfcmVxdWVzdCBtZXRob2QsIHJfdXJsLCBkYXRhXG5cblxuXG4gICMjI1xuICBHZW5lcmFsIHJlcXVlc3QgbWV0aG9kXG5cbiAgQHBhcmFtIFtTdHJpbmddIG1ldGhvZCAgVVJMIHJlcXVlc3QgbWV0aG9kXG4gIEBwYXJhbSBbU3RyaW5nXSB1cmwgICBVUkwgdG8gYmUgcmVxdWVzdGVkXG4gIEBwYXJhbSBbT2JqZWN0XSBkYXRhICBEYXRhIHRvIGJlIHNlbmRcbiAgIyMjXG4gIEBfcmVxdWVzdCA9ICggbWV0aG9kLCB1cmwsIGRhdGE9JycgKSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJbTW9kZWxdIHJlcXVlc3RcIiwgbWV0aG9kLCB1cmwsIGRhdGFcblxuICAgIGZldGNoZXIgPSBuZXcgRmV0Y2hlclxuXG4gICAgcmVxID0gXG4gICAgICB1cmwgIDogdXJsXG4gICAgICB0eXBlIDogbWV0aG9kXG4gICAgICBkYXRhIDogZGF0YVxuICAgIFxuICAgICMgaWYgdXJsIGNvbnRhaW5zIC5qc29uLCBzZXRzIGRhdGFUeXBlIHRvIGpzb25cbiAgICAjIHRoaXMgdGhlb3JpdGljYWxseSBoZWxwcyBmaXJlZm94ICggYW5kIHBlcmhhcHMgb3RoZXIgYnJvd3NlcnMgKVxuICAgICMgdG8gZGVhbCB3aXRoIHRoZSByZXF1ZXN0XG4gICAgcmVxLmRhdGFUeXBlID0gJ2pzb24nIGlmIC9cXC5qc29uLy50ZXN0KCB1cmwgKVxuICAgIFxuICAgIHJlcSA9ICQuYWpheCByZXFcblxuICAgIHJlcS5kb25lICggZGF0YSApPT5cbiAgICAgIGZldGNoZXIubG9hZGVkID0gdHJ1ZVxuICAgICAgQF9pbnN0YW50aWF0ZSAoW10uY29uY2F0IGRhdGEpLCAocmVzdWx0cyktPlxuICAgICAgICBmZXRjaGVyLnJlY29yZHMgPSByZXN1bHRzXG4gICAgICAgIGZldGNoZXIub25sb2FkPyggZmV0Y2hlci5yZWNvcmRzIClcblxuICAgIHJlcS5lcnJvciAoIGVycm9yICk9PlxuICAgICAgZmV0Y2hlci5lcnJvciA9IHRydWVcbiAgICAgIGlmIGZldGNoZXIub25lcnJvcj9cbiAgICAgICAgZmV0Y2hlci5vbmVycm9yIGVycm9yXG4gICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS5lcnJvciBlcnJvclxuXG4gICAgZmV0Y2hlclxuXG5cblxuICAjIyNcbiAgQnVpbGRzIGxvY2FsIGdldHRlcnMvc2V0dGVycyBmb3IgdGhlIGdpdmVuIHBhcmFtc1xuXG4gIEBwYXJhbSBbU3RyaW5nXSBmaWVsZFxuICBAcGFyYW0gW1N0cmluZ10gdHlwZVxuICAjIyNcbiAgQF9idWlsZF9ncyA9ICggZmllbGQsIHR5cGUsIG9wdHMgKSAtPlxuICAgIF92YWwgPSBudWxsXG5cbiAgICBjbGFzc25hbWUgPSAoXCIje0B9XCIubWF0Y2ggL2Z1bmN0aW9uXFxzKFxcdyspLylbMV1cbiAgICBzdHlwZSA9IChcIiN7dHlwZX1cIi5tYXRjaCAvZnVuY3Rpb25cXHMoXFx3KykvKVsxXVxuICAgIGx0eXBlID0gc3R5cGUudG9Mb3dlckNhc2UoKVxuXG4gICAgZ2V0dGVyID0gLT4gX3ZhbFxuICAgIHNldHRlciA9ICh2YWx1ZSkgLT5cbiAgICAgIHN3aXRjaCBsdHlwZVxuICAgICAgICB3aGVuICdzdHJpbmcnIHRoZW4gaXNfdmFsaWQgPSAodHlwZW9mIHZhbHVlIGlzICdzdHJpbmcnKVxuICAgICAgICB3aGVuICdudW1iZXInIHRoZW4gaXNfdmFsaWQgPSAodHlwZW9mIHZhbHVlIGlzICdudW1iZXInKVxuICAgICAgICBlbHNlIGlzX3ZhbGlkID0gKHZhbHVlIGluc3RhbmNlb2YgdHlwZSlcblxuICAgICAgaWYgaXNfdmFsaWQgb3Igb3B0cy52YWxpZGF0ZSBpcyBmYWxzZVxuICAgICAgICBfdmFsID0gdmFsdWVcbiAgICAgICAgQHVwZGF0ZSBmaWVsZCwgX3ZhbFxuICAgICAgZWxzZVxuICAgICAgICBwcm9wID0gXCIje2NsYXNzbmFtZX0uI3tmaWVsZH1cIlxuICAgICAgICBtc2cgPSBcIlByb3BlcnR5ICcje3Byb3B9JyBtdXN0IHRvIGJlICN7c3R5cGV9LlwiXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBtc2dcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBAOjosIGZpZWxkLCBnZXQ6Z2V0dGVyLCBzZXQ6c2V0dGVyXG5cblxuXG4gICMjI1xuICBJbnN0YW50aWF0ZSBvbmUgTW9kZWwgaW5zdGFuY2UgZm9yIGVhY2ggb2YgdGhlIGl0ZW1zIHByZXNlbnQgaW4gZGF0YS5cblxuICBBbmQgYXJyYXkgd2l0aCAxMCBpdGVtcyB3aWxsIHJlc3VsdCBpbiAxMCBuZXcgbW9kZWxzLCB0aGF0IHdpbGwgYmUgXG4gIGNhY2hlZCBpbnRvIEBfY29sbGVjdGlvbiB2YXJpYWJsZVxuXG4gIEBwYXJhbSBbT2JqZWN0XSBkYXRhICBEYXRhIHRvIGJlIHBhcnNlZFxuICAjIyNcbiAgQF9pbnN0YW50aWF0ZSA9ICggZGF0YSwgY2FsbGJhY2sgKSAtPlxuXG4gICAgY2xhc3NuYW1lID0gKFwiI3tAfVwiLm1hdGNoIC9mdW5jdGlvblxccyhcXHcrKS8pWzFdXG4gICAgcmVjb3JkcyA9IFtdXG5cbiAgICBmb3IgcmVjb3JkLCBhdCBpbiBkYXRhXG5cbiAgICAgIE1vZGVsLkZhY3RvcnkubW9kZWwgY2xhc3NuYW1lLCByZWNvcmQsIChfbW9kZWwpPT5cbiAgICAgICAgcmVjb3Jkcy5wdXNoIF9tb2RlbFxuXG4gICAgICAgIGlmIHJlY29yZHMubGVuZ3RoIGlzIGRhdGEubGVuZ3RoXG5cbiAgICAgICAgICAjIFdoZW4gY2FsbGluZyB0aGUgcmVzdCBzZXJ2aWNlIG11bHRpcGxlIHRpbWVzLCB0aGUgY29sbGVjdGlvblxuICAgICAgICAgICMgdmFyaWFibGUga2VlcHMgdGhlIG9sZCBkYXRhIGFuZCBkdXBsaWNhdGUgdGhlIHJlY29yZHNldCBiZXR3ZWVuIGFcbiAgICAgICAgICAjIHJlc3QgY2FsbCBhbmQgYW5vdGhlciBvbmUuIEZvciBub3csIGp1c3QgZmx1c2ggdGhlIG9sZCBjb2xsZWN0aW9uXG4gICAgICAgICAgIyB3aGVuIGluc3RhbnRpYXRlIGEgbmV3IG1vZGVsIGluc3RhbmNlXG5cbiAgICAgICAgICBAX2NvbGxlY3Rpb24gPSAoIEBfY29sbGVjdGlvbiB8fCBbXSApLmNvbmNhdCByZWNvcmRzXG5cbiAgICAgICAgICBjYWxsYmFjayAoaWYgcmVjb3Jkcy5sZW5ndGggaXMgMSB0aGVuIHJlY29yZHNbMF0gZWxzZSByZWNvcmRzKVxuXG4iXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUEsSUFBQSxtQ0FBQTtHQUFBOztxQkFBQTs7QUFBQSxDQUFBLEVBQVksSUFBQSxFQUFaLG1CQUFZOztBQUNaLENBREEsRUFDUyxHQUFULENBQVMsbUJBQUE7O0FBQ1QsQ0FGQSxFQUVVLElBQVYsb0JBQVU7O0FBRVYsQ0FKQSxFQUl1QixHQUFqQixDQUFOO0NBRUU7Ozs7O0NBQUE7O0NBQUEsQ0FBQSxDQUFlLENBQWYsQ0FBQyxFQUFEOztDQUFBLENBQ0EsQ0FBZSxFQUFkLEVBQUQ7O0NBREEsQ0FFQSxDQUFlLEVBQWQsTUFBRDs7Q0FGQSxDQU1BLENBQVEsQ0FBUixDQUFDLElBQVM7Q0FFUixPQUFBLGFBQUE7Q0FBQSxHQUFBLGFBQUE7Q0FBQSxDQUEyQixFQUFQLEVBQXBCLEVBQW9CO01BQXBCO0FBRUEsQ0FBQTtVQUFBLElBQUE7d0JBQUE7Q0FDRSxDQUE2QixDQUF0QixDQUFMLENBQUssQ0FBc0IsS0FBVjtDQURyQjtxQkFKTTtDQU5SLEVBTVE7O0NBTlIsQ0FhQSxDQUFVLENBQUEsQ0FBVCxDQUFELEdBQVk7Q0FDVixPQUFBLFdBQUE7O0dBRHlCLEdBQVA7Q0FBTyxDQUFVLEVBQVYsSUFBQTs7TUFDekI7QUFBQSxDQUFBO1VBQUEsR0FBQTswQkFBQTtDQUFBLENBQWdCLENBQWhCLENBQUMsS0FBRDtDQUFBO3FCQURRO0NBYlYsRUFhVTs7Q0FPVjs7Ozs7Ozs7Ozs7O0NBcEJBOztDQUFBLENBZ0NBLENBQWUsRUFBZCxDQUFjLEdBQUUsRUFBakI7Q0FHRSxHQUFBLElBQUE7Q0FBQSxFQUFjLENBQVAsS0FBTyxFQUFQO0NBRUwsU0FBQSxjQUFBO0NBQUEsS0FGYyxpREFFZDtDQUFBLEVBQWdELENBQTdDLENBQW9ELENBQXZELEdBQWMsT0FBWDtDQUNELENBQTZCLENBQXBCLEdBQVQsRUFBQSxDQUFTO1FBRFg7Q0FPQSxFQUFHLENBQUEsQ0FBTyxDQUFWLEtBQWlDO0NBQy9CLENBQXFDLENBQTdCLENBQUEsQ0FBUixHQUFBLENBQWlCLEVBQVQ7Q0FBNkIsQ0FBQyxFQUFTLE1BQVQ7Q0FBdEMsU0FBUTtDQUNSLEdBQXFCLElBQXJCLEtBQUE7Q0FBQSxHQUFBLENBQVksWUFBTDtVQUZUO1FBUEE7Q0FhQSxHQUFHLEVBQUg7QUFDTSxDQUFKLEVBQTRCLENBQXhCLENBQThCLENBQTlCLEVBQUo7Q0FDRSxFQUFPLENBQVAsTUFBQTtNQURGLElBQUE7Q0FHRSxDQUFBLENBQU8sQ0FBUCxNQUFBO1VBSko7UUFiQTtDQUFBLEVBdUJRLEVBQVIsQ0FBQTtDQVlBLEVBQUEsVUFBTSxrQkFBTjtDQUNFLENBQStCLENBQXZCLENBQTJCLENBQW5DLEVBQVEsQ0FBUixDQUFRO0NBcENWLE1BbUNBO0NBSUEsR0FBZ0MsRUFBaEMsUUFBQTtDQUFBLENBQVEsQ0FBQSxFQUFSLENBQVEsRUFBUjtRQXZDQTtDQXlDQyxDQUFpQixFQUFqQixDQUFELENBQUEsRUFBQSxLQUFBO0NBM0NGLElBQWM7Q0FuQ2hCLEVBZ0NlOztDQWtEZjs7Ozs7OztDQWxGQTs7Q0FBQSxDQXlGQSxDQUFZLENBQUEsQ0FBWCxDQUFXLEVBQVosQ0FBYztDQUdaLE9BQUEsSUFBQTtPQUFBLEtBQUE7O0dBSDhCLEdBQUw7TUFHekI7QUFBVSxDQUFWLEVBQVUsQ0FBVixHQUFBO0NBQUEsRUFFQSxDQUFBO0NBQ0UsQ0FBTyxDQUFQLEdBQUE7Q0FBQSxDQUNPLEVBQVAsRUFBQTtDQURBLENBRU8sRUFBUCxFQUFBO0NBTEYsS0FBQTtDQVVBLEVBQXlCLENBQXpCLElBQWlDO0NBQWpDLEVBQUcsR0FBSCxFQUFBO01BVkE7Q0FBQSxFQVlBLENBQUE7Q0FaQSxFQWNHLENBQUgsS0FBVztDQUNULEVBQWlCLENBQWpCLEVBQUEsQ0FBTztDQUNOLENBQWdCLENBQWUsQ0FBakIsQ0FBZCxDQUFjLENBQWlCLEVBQUMsR0FBakMsQ0FBQTtDQUNFLEVBQWtCLElBQVgsQ0FBUDtDQUNRLEVBQVIsSUFBTztDQUZULE1BQWdDO0NBRmxDLElBQVM7Q0FkVCxFQW9CRyxDQUFILENBQUEsSUFBWTtDQUNWLEVBQWdCLENBQWhCLENBQUEsQ0FBQSxDQUFPO0NBQ1AsR0FBRyxFQUFILGlCQUFBO0NBQ1UsSUFBUixFQUFPLFFBQVA7TUFERixFQUFBO0NBR1ksSUFBUixFQUFPLFFBQVA7UUFMSTtDQUFWLElBQVU7Q0F2QkEsVUE4QlY7Q0F2SEYsRUF5Rlk7O0NBa0NaOzs7Ozs7Q0EzSEE7O0NBQUEsQ0FpSUEsQ0FBYSxDQUFBLENBQVosSUFBRDtDQUNFLE9BQUEscUNBQUE7Q0FBQSxFQUFPLENBQVA7Q0FBQSxDQUVhLENBQUQsQ0FBWixDQUFhLElBQWIsUUFBYTtDQUZiLENBR1MsQ0FBRCxDQUFSLENBQUEsWUFBUztDQUhULEVBSVEsQ0FBUixDQUFBLE1BQVE7Q0FKUixFQU1TLENBQVQsRUFBQSxHQUFTO0NBQUEsWUFBRztDQU5aLElBTVM7Q0FOVCxFQU9TLENBQVQsQ0FBUyxDQUFULEdBQVU7Q0FDUixTQUFBLFNBQUE7Q0FBQSxJQUFBLFNBQU87Q0FBUCxPQUFBLEtBQ087QUFBMEIsQ0FBWixFQUFZLEVBQUEsQ0FBQSxFQUFaLEVBQUE7Q0FBZDtDQURQLE9BQUEsS0FFTztBQUEwQixDQUFaLEVBQVksRUFBQSxDQUFBLEVBQVosRUFBQTtDQUFkO0NBRlA7Q0FHTyxFQUFZLENBQVosQ0FBWSxHQUFaLEVBQUEsRUFBNkI7Q0FIcEMsTUFBQTtDQUtBLEdBQUcsQ0FBNkIsQ0FBaEMsRUFBRztDQUNELEVBQU8sQ0FBUCxDQUFBLEdBQUE7Q0FDQyxDQUFjLEVBQWQsQ0FBRCxDQUFBLFNBQUE7TUFGRixFQUFBO0NBSUUsQ0FBTyxDQUFBLENBQVAsQ0FBQSxHQUFBLENBQU87Q0FBUCxFQUNBLENBQU8sQ0FBQSxHQUFQLElBQU8sR0FBQTtDQUNQLEVBQVUsQ0FBQSxDQUFBLFNBQUE7UUFaTDtDQVBULElBT1M7Q0FjRixDQUFvQixFQUFKLENBQXZCLENBQU0sR0FBTixFQUFBLEdBQUE7Q0FBa0MsQ0FBSSxDQUFKLEdBQUE7Q0FBQSxDQUFnQixDQUFKLEdBQUE7Q0F0Qm5DLEtBc0JYO0NBdkpGLEVBaUlhOztDQTBCYjs7Ozs7Ozs7Q0EzSkE7O0NBQUEsQ0FtS0EsQ0FBZ0IsQ0FBQSxDQUFmLEdBQWUsQ0FBRSxHQUFsQjtDQUVFLE9BQUEsMENBQUE7T0FBQSxLQUFBO0NBQUEsQ0FBYSxDQUFELENBQVosQ0FBYSxJQUFiLFFBQWE7Q0FBYixDQUFBLENBQ1UsQ0FBVixHQUFBO0FBRUEsQ0FBQTtVQUFBLDJDQUFBO3lCQUFBO0NBRUUsQ0FBK0IsQ0FBUSxFQUFsQyxDQUFMLENBQWEsRUFBYjtDQUNFLEdBQUEsRUFBQSxDQUFPLENBQVA7Q0FFQSxHQUFHLENBQWtCLENBQWxCLENBQU8sQ0FBVjtDQU9FLENBQWUsQ0FBQSxDQUFrQixDQUFoQyxDQUFjLENBQUEsR0FBZixDQUFBO0NBRVMsRUFBNkIsRUFBUCxDQUFsQixDQUFPLENBQXBCLFNBQUE7VUFabUM7Q0FBdkMsTUFBdUM7Q0FGekM7cUJBTGM7Q0FuS2hCLEVBbUtnQjs7Q0FuS2hCOztDQUZtQyIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjEyMDE5LAogICAgImNvbHVtbiI6MAogIH0sCiAgIm1hcCI6IHsKICAgICJ2ZXJzaW9uIjogMywKICAgICJmaWxlIjogImFwcC5qcyIsCiAgICAic291cmNlcyI6IFsidmVuZG9ycy90aGVvcmljdXMvd3d3L3NyYy90aGVvcmljdXMvbXZjL3ZpZXcuY29mZmVlIl0sCiAgICAic291cmNlc0NvbnRlbnQiOiBbIiMjIypcbiAgTVZDIG1vZHVsZVxuICBAbW9kdWxlIG12Y1xuIyMjXG5cbk1vZGVsID0gcmVxdWlyZSAndGhlb3JpY3VzL212Yy9tb2RlbCdcbkZhY3RvcnkgPSBudWxsXG5cbiMjIypcbiAgVGhlIFZpZXcgY2xhc3MgaXMgcmVzcG9uc2libGUgZm9yIG1hbmlwdWxhdGluZyB0aGUgdGVtcGxhdGVzIChET00pLlxuXG4gIEBjbGFzcyBWaWV3XG4jIyNcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVmlld1xuXG4gICMgQHByb3BlcnR5IHBhZ2UgdGl0bGVcbiAgIyMjKlxuICAgIFNldHMgdGhlIHRpdGxlIG9mIHRoZSBkb2N1bWVudC5cblxuICAgIEBwcm9wZXJ0eSB0aXRsZSB7U3RyaW5nfVxuICAjIyNcbiAgdGl0bGU6IG51bGxcblxuICAjIyMqXG4gICAgU3RvcmVzIHRlbXBsYXRlJ3MgaHRtbCBhcyBqUXVlcnkgb2JqZWN0LlxuXG4gICAgQHByb3BlcnR5IGVsIHtPYmplY3R9XG4gICMjI1xuICBlbDogbnVsbFxuXG4gICMgQHByb3BlcnR5IFtTdHJpbmddIGNsYXNzIHBhdGhcbiAgIyMjKlxuICAgRmlsZSdzIHBhdGggcmVsYXRpdmUgdG8gdGhlIGFwcCdzIGZvbGRlci5cblxuICAgQHByb3BlcnR5IGNsYXNzcGF0aCB7U3RyaW5nfVxuICAjIyNcbiAgY2xhc3NwYXRoIDogbnVsbFxuXG4gICMgQHByb3BlcnR5IFtTdHJpbmddIGNsYXNzIG5hbWVcbiAgIyMjKlxuICAgIFN0b3JlcyB0aGUgY2xhc3MgbmFtZVxuXG4gICAgQHByb3BlcnR5IGNsYXNzbmFtZSB7U3RyaW5nfVxuICAjIyNcbiAgY2xhc3NuYW1lIDogbnVsbFxuXG4gICMjIypcbiAgICBOYW1lc3BhY2UgaXMgdGhlIGZvbGRlciBwYXRoIHJlbGF0aXZlIHRvIHRoZSBgdmlld3NgIGZvbGRlci5cblxuICAgIEBwcm9wZXJ0eSBuYW1lc3BhY2Uge1N0cmluZ31cbiAgIyMjXG4gIG5hbWVzcGFjZSA6IG51bGxcbiAgXG4gICMjIypcbiAgICB7eyNjcm9zc0xpbmsgXCJQcm9jZXNzXCJ9fXt7L2Nyb3NzTGlua319IHJlc3BvbnNpYmxlIGZvciBydW5uaW5nIHRoZSBjb250cm9sbGVyJ3MgYWN0aW9uIHRoYXQgcmVuZGVyZWQgdGhpcyB2aWV3LlxuXG4gICAgQHByb3BlcnR5IHByb2Nlc3Mge1Byb2Nlc3N9XG4gICMjI1xuICBwcm9jZXNzICAgOiBudWxsXG5cbiAgIyMjKlxuICAgIE9iamVjdCByZXNwb25zaWJsZSBmb3IgYmluZGluZyB0aGUgRE9NIGV2ZW50cyBvbiB0aGUgdmlldy4gVXNlIHRoZSBmb3JtYXQgYHNlbGVjdG9yIGV2ZW50OiBoYW5kbGVyYCB0byBkZWZpbmUgYW4gZXZlbnQuIEl0IGlzIGNhbGxlZCBhZnRlciB0aGUgYHRlbXBsYXRlYCB3YXMgcmVuZGVyZWQgaW4gdGhlIGRvY3VtZW50LlxuXG4gICAgQHByb3BlcnR5IGV2ZW50cyB7T2JqZWN0fVxuICAgIEBleGFtcGxlXG4gICAgICAgIGV2ZW50czogIFxuICAgICAgICAgICAgXCIuYnQtYWxlcnQgY2xpY2tcIjpcIm9uX2FsZXJ0XCJcblxuICAjIyNcbiAgZXZlbnRzICAgIDogbnVsbFxuXG4gICMjIypcbiAgICBSZXNwb25zaWJsZSBmb3Igc3RvcmluZyB0aGUgdGVtcGxhdGUncyBkYXRhIGFuZCB0aGUgVVJMIHBhcmFtcy5cbiAgICBcbiAgICBAcHJvcGVydHkgZGF0YSB7T2JqZWN0fVxuICAjIyNcbiAgZGF0YSAgICAgIDogbnVsbFxuXG4gICMjIypcbiAgICBUaGlzIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGJ5IHRoZSBGYWN0b3J5LiBJdCBzYXZlcyBhIGBAdGhlLmZhY3RvcnlgIHJlZmVyZW5jZSBpbnNpZGUgdGhlIHZpZXcuXG5cbiAgICBAbWV0aG9kIF9ib290XG4gICAgQHBhcmFtIEB0aGUge1RoZW9yaWN1c30gU2hvcnRjdXQgZm9yIGFwcCdzIGluc3RhbmNlXG4gICMjI1xuICBfYm9vdDooIEB0aGUgKS0+XG4gICAgRmFjdG9yeSA9IEB0aGUuZmFjdG9yeVxuICAgIEBcblxuICAjIyMqXG4gICAgUmVzcG9uc2libGUgZm9yIHJlbmRlcmluZyB0aGUgdmlldywgcGFzc2luZyB0aGUgZGF0YSB0byB0aGUgYHRlbXBsYXRlYC5cblxuICAgIEBtZXRob2QgX3JlbmRlclxuICAgIEBwYXJhbSBkYXRhIHtPYmplY3R9IERhdGEgb2JqZWN0IHRvIGJlIHBhc3NlZCB0byB0aGUgdGVtcGxhdGUsIHVzdWFsbHkgaXQgaXMgYW5kIGluc3RhbmNlIG9mIHRoZSB7eyNjcm9zc0xpbmsgXCJNb2RlbFwifX17ey9jcm9zc0xpbmt9fVxuICAgIEBwYXJhbSBbdGVtcGxhdGU9bnVsbF0ge1N0cmluZ30gVGhlIHBhdGggb2YgdGhlIHRlbXBsYXRlIHRvIGJlIHJlbmRlcmVkLlxuICAjIyNcbiAgX3JlbmRlcjooIGRhdGEgPSB7fSwgdGVtcGxhdGUgKT0+XG4gICAgQGRhdGEgPSBcbiAgICAgIHZpZXc6IEBcbiAgICAgIHBhcmFtczogQHByb2Nlc3MucGFyYW1zXG4gICAgICBkYXRhOiBkYXRhXG5cbiAgICBAYmVmb3JlX3JlbmRlcj8oQGRhdGEpXG5cbiAgICBAcHJvY2Vzcy5vbl9hY3RpdmF0ZSA9ID0+XG4gICAgICBAb25fYWN0aXZhdGU/KClcbiAgICAgIGlmIEB0aXRsZT9cbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBAdGl0bGVcblxuICAgIEBlbCA9ICQgQHByb2Nlc3Mucm91dGUuZWxcblxuICAgIHVubGVzcyB0ZW1wbGF0ZT9cbiAgICAgIHRtcGxfZm9sZGVyID0gQG5hbWVzcGFjZS5yZXBsYWNlKC9cXC4vZywgJy8nKVxuICAgICAgdG1wbF9uYW1lICAgPSBAY2xhc3NuYW1lLnVuZGVyc2NvcmUoKVxuICAgICAgdGVtcGxhdGUgPSBcIiN7dG1wbF9mb2xkZXJ9LyN7dG1wbF9uYW1lfVwiXG5cbiAgICBAcmVuZGVyX3RlbXBsYXRlIHRlbXBsYXRlXG5cbiAgIyMjKlxuICAgIElmIHRoZXJlIGlzIGEgYGJlZm9yZV9yZW5kZXJgIG1ldGhvZCBpbXBsZW1lbnRlZCwgaXQgd2lsbCBiZSBleGVjdXRlZCBiZWZvcmUgdGhlIHZpZXcncyB0ZW1wbGF0ZSBpcyBhcHBlbmRlZCB0byB0aGUgZG9jdW1lbnQuXG5cbiAgICBAbWV0aG9kIGJlZm9yZV9yZW5kZXJcbiAgICBAcGFyYW0gZGF0YSB7T2JqZWN0fSBSZWZlcmVuY2UgdG8gdGhlIGBAZGF0YWBcbiAgIyMjXG5cblxuICAjIyMqXG4gICAgUmVzcG9uc2libGUgZm9yIGxvYWRpbmcgdGhlIGdpdmVuIHRlbXBsYXRlLCBhbmQgYXBwZW5kaW5nIGl0IHRvIHZpZXcncyBgZWxgIGVsZW1lbnQuXG5cbiAgICBAbWV0aG9kIHJlbmRlcl90ZW1wbGF0ZVxuICAgIEBwYXJhbSB0ZW1wbGF0ZSB7U3RyaW5nfSBQYXRoIHRvIHRoZSB0ZW1wbGF0ZSB0byBiZSByZW5kZXJlZC5cbiAgIyMjXG4gIHJlbmRlcl90ZW1wbGF0ZTooIHRlbXBsYXRlICktPlxuICAgIEB0aGUuZmFjdG9yeS50ZW1wbGF0ZSB0ZW1wbGF0ZSwgKCB0ZW1wbGF0ZSApID0+XG5cbiAgICAgIGRvbSA9IHRlbXBsYXRlIEBkYXRhXG4gICAgICBkb20gPSBAZWwuYXBwZW5kIGRvbVxuXG4gICAgICAjIGJpbmRzIGl0ZW0gaWYgdGhlIGRhdGEgcGFzc2VkIGlzIGEgdmFsaWQgTW9kZWxcbiAgICAgIGlmIChAZGF0YSBpbnN0YW5jZW9mIE1vZGVsKVxuICAgICAgICBAZGF0YS5iaW5kIGRvbSwgIUB0aGUuY29uZmlnLmF1dG9iaW5kXG4gICAgICBcbiAgICAgIEBzZXRfdHJpZ2dlcnM/KClcbiAgICAgIEBhZnRlcl9yZW5kZXI/KEBkYXRhKVxuXG4gICAgICBAaW4oKVxuXG4gICAgICBpZiBAb25fcmVzaXplP1xuICAgICAgICAkKCB3aW5kb3cgKS51bmJpbmQgJ3Jlc2l6ZScsIEBfb25fcmVzaXplXG4gICAgICAgICQoIHdpbmRvdyApLmJpbmQgICAncmVzaXplJywgQF9vbl9yZXNpemVcbiAgICAgICAgQG9uX3Jlc2l6ZSgpXG5cbiAgIyMjKlxuICAgIElmIHRoZXJlIGlzIGFuIGBhZnRlcl9yZW5kZXJgIG1ldGhvZCBpbXBsZW1lbnRlZCwgaXQgd2lsbCBiZSBleGVjdXRlZCBhZnRlciB0aGUgdmlldydzIHRlbXBsYXRlIGlzIGFwcGVuZGVkIHRvIHRoZSBkb2N1bWVudC4gXG5cbiAgICBVc2VmdWwgZm9yIGNhY2hpbmcgRE9NIGVsZW1lbnRzIGFzIGpRdWVyeSBvYmplY3RzLlxuXG4gICAgQG1ldGhvZCBhZnRlcl9yZW5kZXJcbiAgICBAcGFyYW0gZGF0YSB7T2JqZWN0fSBSZWZlcmVuY2UgdG8gdGhlIGBAZGF0YWBcbiAgIyMjXG5cbiAgIyMjKlxuICAgIElmIHRoZXJlIGlzIGFuIGBAb25fcmVzaXplYCBtZXRob2QgaW1wbGVtZW50ZWQsIGl0IHdpbGwgYmUgZXhlY3V0ZWQgd2hlbmV2ZXIgdGhlIHdpbmRvdyB0cmlnZ2VycyB0aGUgYHNjcm9sbGAgZXZlbnQuXG5cbiAgICBAbWV0aG9kIG9uX3Jlc2l6ZVxuICAjIyNcbiAgX29uX3Jlc2l6ZTo9PlxuICAgIEBvbl9yZXNpemU/KClcblxuICAjIyMqXG4gICAgUHJvY2VzcyB0aGUgYEBldmVudHNgLCBhdXRvbWF0aWNhbGx5IGJpbmRpbmcgdGhlbS5cblxuICAgIEBtZXRob2Qgc2V0X3RyaWdnZXJzXG4gICMjI1xuICBzZXRfdHJpZ2dlcnM6ICgpID0+XG4gICAgcmV0dXJuIGlmIG5vdCBAZXZlbnRzP1xuICAgIGZvciBzZWwsIGZ1bmsgb2YgQGV2ZW50c1xuICAgICAgW2FsbCwgc2VsLCBldl0gPSBzZWwubWF0Y2ggLyguKilbXFxzfFxcdF0rKFtcXFNdKykkL21cbiAgICAgICggQGVsLmZpbmQgc2VsICkudW5iaW5kIGV2LCBudWxsLCBAW2Z1bmtdXG4gICAgICAoIEBlbC5maW5kIHNlbCApLmJpbmQgICBldiwgbnVsbCwgQFtmdW5rXVxuXG4gICMjIypcbiAgICBJZiB0aGVyZSBpcyBhIGBAYmVmb3JlX2luYCBtZXRob2QgaW1wbGVtZW50ZWQsIGl0IHdpbGwgYmUgY2FsbGVkIGJlZm9yZSB0aGUgdmlldyBleGVjdXRlIGl0cyBpbnRybyBhbmltYXRpb25zLiBcblxuICAgIFVzZWZ1bCB0byBzZXR0aW5nIHVwIHRoZSBET00gZWxlbWVudHMgcHJvcGVydGllcyBiZWZvcmUgYW5pbWF0aW5nIHRoZW0uXG5cbiAgICBAbWV0aG9kIGJlZm9yZV9pbiAgICBcbiAgIyMjXG5cbiAgIyMjKlxuICAgIFRoZSBgaW5gIG1ldGhvZCBpcyB3aGVyZSB0aGUgdmlldyBpbnRybyBhbmltYXRpb25zIGFyZSBkZWZpbmVkLiBJdCBpcyBleGVjdXRlZCBhZnRlciB0aGUgYEBhZnRlcl9yZW5kZXJgIG1ldGhvZC5cblxuICAgIFRoZSBgQGFmdGVyX2luYCBtZXRob2QgbXVzdCBiZSBjYWxsZWQgYXQgdGhlIGVuZCBvZiB0aGUgYW5pbWF0aW9ucywgc28gVGhlb3JpY3VzIGtub3dzIHRoYXQgdGhlIFZpZXcgZmluaXNoZWQgYW5pbWF0aW5nLlxuXG4gICAgQG1ldGhvZCBpblxuICAjIyNcbiAgaW46KCktPlxuICAgIEBiZWZvcmVfaW4/KClcbiAgICBhbmltYXRlICA9IEB0aGUuY29uZmlnLmVuYWJsZV9hdXRvX3RyYW5zaXRpb25zXG4gICAgYW5pbWF0ZSAmPSAhQHRoZS5jb25maWcuZGlzYWJsZV90cmFuc2l0aW9uc1xuICAgIHVubGVzcyBhbmltYXRlXG4gICAgICBAYWZ0ZXJfaW4/KClcbiAgICBlbHNlXG4gICAgICBAZWwuY3NzIFwib3BhY2l0eVwiLCAwXG4gICAgICBAZWwuYW5pbWF0ZSB7b3BhY2l0eTogMX0sIDMwMCwgPT4gQGFmdGVyX2luPygpXG5cbiAgIyMjKlxuICAgIElmIHRoZXJlIGlzIGFuYEBhZnRlcl9pbmAgbWV0aG9kIGltcGxlbWVudGVkLCBpdCB3aWxsIGJlIGNhbGxlZCBhZnRlciB0aGUgdmlldyBmaW5pc2ggaXRzIGludHJvIGFuaW1hdGlvbnMuXG5cbiAgICBXaWxsIG9ubHkgYmUgZXhlY3V0ZWQgaWYgdGhlIHt7I2Nyb3NzTGluayBcIkNvbmZpZ1wifX17ey9jcm9zc0xpbmt9fSBwcm9wZXJ0eSBgZGlzYWJsZV90cmFuc2l0aW9uc2AgaXMgYGZhbHNlYC5cblxuICAgIEBtZXRob2QgYWZ0ZXJfaW4gICAgXG4gICMjI1xuXG4gICMjIypcbiAgICBJZiB0aGVyZSBpcyBhbmBAYmVmb3JlX291dGAgbWV0aG9kIGltcGxlbWVudGVkLCBpdCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgdGhlIHZpZXcgZXhlY3V0ZXMgaXRzIGV4aXQgYW5pbWF0aW9ucy5cblxuICAgIEBtZXRob2QgYmVmb3JlX291dFxuICAjIyNcblxuICAjIyMqXG4gICAgVGhlIGBAb3V0YCBtZXRob2QgaXMgcmVzcG9uc2libGUgZm9yIHRoZSB2aWV3J3MgZXhpdCBhbmltYXRpb25zLiBcblxuICAgIEF0IHRoZSBlbmQgb2YgdGhlIGFuaW1hdGlvbnMsIHRoZSBgYWZ0ZXJfb3V0YCBjYWxsYmFjayBtdXN0IGJlIGNhbGxlZC5cblxuICAgIEBtZXRob2Qgb3V0XG4gICAgQHBhcmFtIGFmdGVyX291dCB7RnVuY3Rpb259IENhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhbmltYXRpb24gZW5kcy5cbiAgIyMjXG4gIG91dDooIGFmdGVyX291dCApLT5cbiAgICBAYmVmb3JlX291dD8oKVxuICAgIGFuaW1hdGUgPSBAdGhlLmNvbmZpZy5lbmFibGVfYXV0b190cmFuc2l0aW9uc1xuICAgIGFuaW1hdGUgJj0gIUB0aGUuY29uZmlnLmRpc2FibGVfdHJhbnNpdGlvbnNcbiAgICB1bmxlc3MgYW5pbWF0ZVxuICAgICAgYWZ0ZXJfb3V0KClcbiAgICBlbHNlXG4gICAgICBAZWwuYW5pbWF0ZSB7b3BhY2l0eTogMH0sIDMwMCwgYWZ0ZXJfb3V0XG5cbiAgIyMjKlxuICAgIElmIHRoZXJlIGlzIGFuYEBiZWZvcmVfZGVzdHJveWAgbWV0aG9kIGltcGxlbWVudGVkLCBpdCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgcmVtb3ZpbmcgdGhlIHZpZXcncyB0ZW1wbGF0ZSBmcm9tIHRoZSBkb2N1bWVudC5cblxuICAgIEBtZXRob2QgYmVmb3JlX2Rlc3Ryb3lcbiAgIyMjXG5cbiAgIyMjKlxuICAgIERlc3Ryb3kgdGhlIHZpZXcgYWZ0ZXIgZXhlY3V0aW5nIHRoZSBgQG91dGAgbWV0aG9kLCB0aGUgZGVmYXVsdCBiZWhhdmlvdXIgZW1wdGllcyBpdHMgYGVsYCBlbGVtZW50IGFuZCB1bmJpbmQgdGhlIGB3aW5kb3cucmVzaXplYCBldmVudC5cblxuICAgIElmIG92ZXJ3cml0dGVuLCB0aGUgYHN1cGVyYCBtZXRob2QgbXVzdCBiZSBjYWxsZWQuXG5cbiAgICBVc2VmdWwgZm9yIHJlbW92aW5nIHZhcmlhYmxlcyBhc3NpZ25tZW50cyB0aGF0IG5lZWRzIHRvIGJlIHJlbW92ZWQgZnJvbSBtZW1vcnkgYnkgdGhlIEdhcmJhZ2UgQ29sbGVjdG9yLCBhdm9pZGluZyBNZW1vcnkgTGVha3MuXG5cbiAgICBAbWV0aG9kIGRlc3Ryb3lcbiAgIyMjXG4gIGRlc3Ryb3k6ICgpIC0+XG4gICAgaWYgQG9uX3Jlc2l6ZT9cbiAgICAgICQoIHdpbmRvdyApLnVuYmluZCAncmVzaXplJywgQF9vbl9yZXNpemVcblxuICAgIEBiZWZvcmVfZGVzdHJveT8oKVxuICAgIEBlbC5lbXB0eSgpXG5cbiAgIyB+PiBTaG9ydGN1dHNcblxuICAjIyMqXG4gICAgU2hvcnRjdXQgZm9yIGFwcGxpY2F0aW9uIG5hdmlnYXRlLlxuXG4gICAgTmF2aWdhdGUgdG8gdGhlIGdpdmVuIFVSTC5cblxuICAgIEBtZXRob2QgbmF2aWdhdGVcbiAgICBAcGFyYW0gdXJsIHtTdHJpbmd9IFVSTCB0byBuYXZpZ2F0ZSB0by5cbiAgIyMjXG4gIG5hdmlnYXRlOiggdXJsICktPlxuICAgIEB0aGUucHJvY2Vzc2VzLnJvdXRlci5uYXZpZ2F0ZSB1cmwiXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUE7Ozs7Q0FBQTtDQUFBLEdBQUEsZ0JBQUE7R0FBQSwrRUFBQTs7QUFLQSxDQUxBLEVBS1EsRUFBUixFQUFRLGNBQUE7O0FBQ1IsQ0FOQSxFQU1VLENBTlYsR0FNQTs7Q0FFQTs7Ozs7Q0FSQTs7QUFhQSxDQWJBLEVBYXVCLEdBQWpCLENBQU47Ozs7O0NBR0U7O0NBQUE7Ozs7O0NBQUE7O0NBQUEsRUFLTyxDQUxQLENBS0E7O0NBRUE7Ozs7O0NBUEE7O0NBQUEsQ0FZQSxDQUFJLENBWko7O0NBZUE7Ozs7O0NBZkE7O0NBQUEsRUFvQlksQ0FwQlosS0FvQkE7O0NBR0E7Ozs7O0NBdkJBOztDQUFBLEVBNEJZLENBNUJaLEtBNEJBOztDQUVBOzs7OztDQTlCQTs7Q0FBQSxFQW1DWSxDQW5DWixLQW1DQTs7Q0FFQTs7Ozs7Q0FyQ0E7O0NBQUEsRUEwQ1ksQ0ExQ1osR0EwQ0E7O0NBRUE7Ozs7Ozs7O0NBNUNBOztDQUFBLEVBcURZLENBckRaLEVBcURBOztDQUVBOzs7OztDQXZEQTs7Q0FBQSxFQTREWSxDQUFaOztDQUVBOzs7Ozs7Q0E5REE7O0NBQUEsRUFvRU0sRUFBTixJQUFTO0NBQ1AsRUFETyxDQUFEO0NBQ04sRUFBVSxDQUFWLEdBQUE7Q0FESSxVQUVKO0NBdEVGLEVBb0VNOztDQUlOOzs7Ozs7O0NBeEVBOztDQUFBLENBK0VxQixDQUFiLENBQUEsR0FBUixDQUFRLENBQUU7Q0FDUixPQUFBLGNBQUE7T0FBQSxLQUFBOztHQURlLEdBQVA7TUFDUjtDQUFBLEVBQ0UsQ0FERjtDQUNFLENBQU0sRUFBTixFQUFBO0NBQUEsQ0FDUSxFQUFDLEVBQVQsQ0FBZ0I7Q0FEaEIsQ0FFTSxFQUFOLEVBQUE7Q0FIRixLQUFBOztDQUtDLEdBQUEsRUFBRDtNQUxBO0NBQUEsRUFPdUIsQ0FBdkIsR0FBUSxFQUFlLEVBQXZCOztDQUNHLElBQUEsR0FBRDtRQUFBO0NBQ0EsR0FBRyxFQUFILGFBQUE7Q0FDVyxFQUFRLEVBQWpCLEdBQVEsT0FBUjtRQUhtQjtDQVB2QixJQU91QjtDQVB2QixDQVlBLENBQU0sQ0FBTixDQUFzQixFQUFOO0NBRWhCLEdBQUEsWUFBQTtDQUNFLENBQXdDLENBQTFCLENBQUMsQ0FBRCxDQUFkLENBQWMsRUFBVSxFQUF4QjtDQUFBLEVBQ2MsQ0FBQyxFQUFmLEdBQUEsQ0FBYztDQURkLENBRVcsQ0FBQSxHQUFYLEVBQUEsQ0FGQSxFQUVXO01BakJiO0NBbUJDLEdBQUEsSUFBRCxHQUFBLElBQUE7Q0FuR0YsRUErRVE7O0NBc0JSOzs7Ozs7Q0FyR0E7O0NBNkdBOzs7Ozs7Q0E3R0E7O0NBQUEsRUFtSGdCLEtBQUEsQ0FBRSxNQUFsQjtDQUNFLE9BQUEsSUFBQTtDQUFDLENBQStCLENBQTVCLENBQUgsR0FBVyxDQUFaLENBQWtDLEVBQWxDO0NBRUUsRUFBQSxPQUFBO0NBQUEsRUFBQSxDQUFNLENBQVUsQ0FBaEIsRUFBTTtDQUFOLENBQ1MsQ0FBVCxFQUFPLENBQVA7Q0FHQSxHQUFJLENBQUMsQ0FBTCxNQUFxQjtBQUNGLENBQWpCLENBQWdCLENBQWhCLENBQUssQ0FBSixDQUEyQixFQUE1QjtRQUxGOztDQU9DLElBQUEsR0FBRDtRQVBBOztDQVFDLElBQUEsR0FBRDtRQVJBO0NBQUEsR0FVQyxDQUFBLENBQUQ7Q0FFQSxHQUFHLEVBQUgsaUJBQUE7Q0FDRSxDQUE2QixHQUFDLENBQTlCLEVBQUEsRUFBQTtDQUFBLENBQzZCLEVBQTdCLENBQThCLENBQTlCLEVBQUEsRUFBQTtDQUNDLElBQUEsSUFBRCxNQUFBO1FBakI0QjtDQUFoQyxJQUFnQztDQXBIbEMsRUFtSGdCOztDQW9CaEI7Ozs7Ozs7O0NBdklBOztDQWdKQTs7Ozs7Q0FoSkE7O0NBQUEsRUFxSlcsTUFBQSxDQUFYO0NBQ0csRUFBRCxDQUFDO0NBdEpILEVBcUpXOztDQUdYOzs7OztDQXhKQTs7Q0FBQSxFQTZKYyxNQUFBLEdBQWQ7Q0FDRSxPQUFBLGlDQUFBO0NBQUEsR0FBQSxlQUFBO0NBQUEsV0FBQTtNQUFBO0NBQ0E7Q0FBQTtVQUFBLENBQUE7d0JBQUE7Q0FDRSxDQUFDLENBQW1CLEVBQUgsQ0FBakIsRUFBaUIsZUFBQTtDQUFqQixDQUNLLENBQUgsQ0FBQyxFQUFIO0NBREEsQ0FFSyxDQUFILENBQUM7Q0FITDtxQkFGWTtDQTdKZCxFQTZKYzs7Q0FPZDs7Ozs7OztDQXBLQTs7Q0E0S0E7Ozs7Ozs7Q0E1S0E7O0NBQUEsRUFtTEcsTUFBQTtDQUNELE1BQUEsQ0FBQTtPQUFBLEtBQUE7O0NBQUMsR0FBQSxFQUFEO01BQUE7Q0FBQSxFQUNXLENBQVgsRUFBc0IsQ0FBdEIsZ0JBREE7QUFFWSxDQUZaLEVBRWdCLENBQWhCLEVBQXVCLENBQXZCLFlBRkE7QUFHTyxDQUFQLEdBQUEsR0FBQTtDQUNHLEVBQUQsQ0FBQztNQURIO0NBR0UsQ0FBRyxDQUFILENBQUMsRUFBRCxHQUFBO0NBQ0MsQ0FBRSxFQUFGLEdBQUQsTUFBQTtDQUFZLENBQVUsS0FBVCxDQUFBO0VBQWEsQ0FBMUIsS0FBQSxDQUErQjtDQUFJLEVBQUQsRUFBQztDQUFuQyxNQUErQjtNQVJoQztDQW5MSCxFQW1MRzs7Q0FVSDs7Ozs7OztDQTdMQTs7Q0FxTUE7Ozs7O0NBck1BOztDQTJNQTs7Ozs7Ozs7Q0EzTUE7O0NBQUEsRUFtTkEsTUFBTTtDQUNKLE1BQUEsQ0FBQTs7Q0FBQyxHQUFBLEVBQUQ7TUFBQTtDQUFBLEVBQ1UsQ0FBVixFQUFxQixDQUFyQixnQkFEQTtBQUVZLENBRlosRUFFZ0IsQ0FBaEIsRUFBdUIsQ0FBdkIsWUFGQTtBQUdPLENBQVAsR0FBQSxHQUFBO0NBQ0UsUUFBQSxJQUFBO01BREY7Q0FHRyxDQUFFLEVBQUYsR0FBRCxNQUFBO0NBQVksQ0FBVSxLQUFULENBQUE7Q0FIZixDQUc0QixDQUExQixLQUFBLENBQUE7TUFQQTtDQW5OSixFQW1OSTs7Q0FTSjs7Ozs7Q0E1TkE7O0NBa09BOzs7Ozs7Ozs7Q0FsT0E7O0NBQUEsRUEyT1MsSUFBVCxFQUFTO0NBQ1AsR0FBQSxrQkFBQTtDQUNFLENBQTZCLEVBQUMsRUFBOUIsRUFBQSxFQUFBO01BREY7O0NBR0MsR0FBQSxFQUFEO01BSEE7Q0FJQyxDQUFFLEVBQUYsQ0FBRCxNQUFBO0NBaFBGLEVBMk9TOztDQVNUOzs7Ozs7OztDQXBQQTs7Q0FBQSxFQTRQUyxLQUFULENBQVc7Q0FDUixFQUFHLENBQUgsRUFBb0IsRUFBckIsQ0FBYyxFQUFkO0NBN1BGLEVBNFBTOztDQTVQVDs7Q0FoQkYiCiAgfQp9LAp7CiAgIm9mZnNldCI6IHsKICAgICJsaW5lIjoxMjM4NiwKICAgICJjb2x1bW4iOjAKICB9LAogICJtYXAiOiB7CiAgICAidmVyc2lvbiI6IDMsCiAgICAiZmlsZSI6ICJhcHAuanMiLAogICAgInNvdXJjZXMiOiBbInZlbmRvcnMvdGhlb3JpY3VzL3d3dy9zcmMvdGhlb3JpY3VzL3RoZW9yaWN1cy5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiIyMjKlxuICBUaGVvcmljdXMgbW9kdWxlXG4gIEBtb2R1bGUgdGhlb3JpY3VzXG4jIyNcblxuQ29uZmlnID0gcmVxdWlyZSAndGhlb3JpY3VzL2NvbmZpZy9jb25maWcnXG5GYWN0b3J5ID0gcmVxdWlyZSAndGhlb3JpY3VzL2NvcmUvZmFjdG9yeSdcblByb2Nlc3NlcyA9IHJlcXVpcmUgJ3RoZW9yaWN1cy9jb3JlL3Byb2Nlc3NlcydcblxucmVxdWlyZSAnLi4vLi4vdmVuZG9ycy9pbmZsZWN0aW9uJ1xucmVxdWlyZSAnLi4vLi4vdmVuZG9ycy9qcXVlcnknXG5yZXF1aXJlICcuLi8uLi92ZW5kb3JzL2pzb24yJ1xuXG5cbiMjIypcbiAgVGhlb3JpY3VzIG1haW4gY2xhc3MuXG4gIEBjbGFzcyBUaGVvcmljdXNcbiMjI1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUaGVvcmljdXNcblxuICAjIyMqXG4gICAgQmFzZSBwYXRoIGZvciB5b3VyIGFwcGxpY2F0aW9uLCBpbiBjYXNlIGl0IHJ1bnMgaW4gYSBzdWJmb2xkZXIuIElmIG5vdCwgdGhpc1xuICAgIGNhbiBiZSBsZWZ0IGJsYW5rLCBtZWFuaW5nIHlvdXIgYXBwbGljYXRpb24gd2lsbCBydW4gaW4gdGhlIGB3ZWJfcm9vdGAgZGlyXG4gICAgb24geW91ciBzZXJ2ZXIuXG5cbiAgICBAcHJvcGVydHkge1N0cmluZ30gYmFzZV9wYXRoXG4gICMjI1xuICBiYXNlX3BhdGg6ICcnXG5cbiAgIyMjKlxuICAgIEluc3RhbmNlIG9mIHt7I2Nyb3NzTGluayBcIkZhY3RvcnlcIn19X19GYWN0b3J5X197ey9jcm9zc0xpbmt9fSBjbGFzcy5cbiAgICBAcHJvcGVydHkge0ZhY3Rvcnl9IGZhY3RvcnlcbiAgIyMjXG4gIGZhY3RvcnkgIDogbnVsbFxuXG4gICMjIypcbiAgICBJbnN0YW5jZSBvZiB7eyNjcm9zc0xpbmsgXCJDb25maWdcIn19X19Db25maWdfX3t7L2Nyb3NzTGlua319IGNsYXNzLCBmZWQgYnkgdGhlIGFwcGxpY2F0aW9uJ3MgYGNvbmZpZy5jb2ZmZWVgIGZpbGUuXG4gICAgQHByb3BlcnR5IHtDb25maWd9IGNvbmZpZ1xuICAjIyNcbiAgY29uZmlnICAgOiBudWxsXG5cbiAgIyMjKlxuICAgIEluc3RhbmNlIG9mIHt7I2Nyb3NzTGluayBcIlByb2Nlc3Nlc1wifX1fX1Byb2Nlc3Nlc19fe3svY3Jvc3NMaW5rfX0gY2xhc3MsIHJlc3BvbnNpYmxlIGZvciBoYW5kbGluZyB0aGUgdXJsIGNoYW5nZS5cbiAgICBAcHJvcGVydHkge1Byb2Nlc3Nlc30gcHJvY2Vzc2VzXG4gICMjI1xuICBwcm9jZXNzZXM6IG51bGxcblxuICAjIyMqXG4gICAgUmVmZXJlbmNlIHRvIGB3aW5kb3cuY3Jhd2xlcmAgb2JqZWN0LCB0aGlzIG9iamVjdCBjb250YWlucyBhIHByb3BlcnR5IGNhbGxlZCBgaXNfcmVuZGVyZWRgIHdoaWNoIGlzIHNldCB0byB0cnVlIHdoZW5ldmVyIHRoZSBjdXJyZW50IHt7I2Nyb3NzTGluayBcIlByb2Nlc3NcIn19X19wcm9jZXNzX197ey9jcm9zc0xpbmt9fSBmaW5pc2hlcyByZW5kZXJpbmcuXG5cbiAgICBUaGlzIG9iamVjdCBpcyB1c2VkIHNwZWNpYWxseSBmb3Igc2VydmVyLXNpZGUgaW5kZXhpbmcgb2YgVGhlb3JpY3VzJ3MgYXBwcywgdGhvdWdoIHRoZSB1c2Ugb2YgPGEgaHJlZj1cImh0dHA6Ly9naXRodWIuY29tL3NlcnBlbnRlbS9zbmFwc2hvb3RlclwiPlNuYXBzaG9vdGVyPC9hPi5cbiAgICBAcHJvcGVydHkge0NyYXdsZXJ9IGNyYXdsZXJcbiAgIyMjXG4gIGNyYXdsZXI6ICh3aW5kb3cuY3Jhd2xlciA9IGlzX3JlbmRlcmVkOiBmYWxzZSlcblxuICAjIyMqXG4gICAgVGhlb3JpY3VzIGNvbnN0cnVjdG9yLCBtdXN0IHRvIGJlIGludm9rZWQgYnkgdGhlIGFwcGxpY2F0aW9uIHdpdGggYSBgc3VwZXJgXG4gICAgY2FsbC5cbiAgICBAY2xhc3MgVGhlb3JpY3VzXG4gICAgQGNvbnN0cnVjdG9yXG4gICAgQHBhcmFtIFNldHRpbmdzIHtPYmplY3R9IFNldHRpbmdzIGRlZmluZWQgaW4gdGhlIGFwcGxpY2F0aW9uJ3MgYGNvbmZpZy5jb2ZmZWVgIGZpbGUuXG4gICAgQHBhcmFtIFJvdXRlcyB7T2JqZWN0fSBSb3V0ZXMgZGVmaW5lZCBpbiB0aGUgYXBwbGljYXRpb24ncyBgcm91dGVzLmNvZmZlZWAgZmlsZS5cbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiggQFNldHRpbmdzLCBAUm91dGVzICktPlxuICAgIEBjb25maWcgID0gbmV3IENvbmZpZyBALCBAU2V0dGluZ3NcbiAgICBAZmFjdG9yeSA9IG5ldyBGYWN0b3J5IEBcblxuICAjIyMqXG4gICAgU3RhcnRzIHRoZSBUaGVvcmljdXMgZW5naW5lLCBwbHVnZ2luZyB0aGUge3sjY3Jvc3NMaW5rIFwiUHJvY2Vzc2VzXCJ9fV9fUHJvY2Vzc2VzX197ey9jcm9zc0xpbmt9fSBvbnRvIHRoZSB7eyNjcm9zc0xpbmsgXCJSb3V0ZXJcIn19X19Sb3V0ZXJfX3t7L2Nyb3NzTGlua319IHN5c3RlbS5cbiAgICBAbWV0aG9kIHN0YXJ0XG4gICMjI1xuICBzdGFydDogLT5cbiAgICBAcHJvY2Vzc2VzID0gbmV3IFByb2Nlc3NlcyBALCBAUm91dGVzIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBOzs7O0NBQUE7Q0FBQSxHQUFBLGlDQUFBOztBQUtBLENBTEEsRUFLUyxHQUFULENBQVMsa0JBQUE7O0FBQ1QsQ0FOQSxFQU1VLElBQVYsaUJBQVU7O0FBQ1YsQ0FQQSxFQU9ZLElBQUEsRUFBWixpQkFBWTs7QUFFWixDQVRBLE1BU0EsbUJBQUE7O0FBQ0EsQ0FWQSxNQVVBLGVBQUE7O0FBQ0EsQ0FYQSxNQVdBLGNBQUE7O0NBR0E7Ozs7Q0FkQTs7QUFrQkEsQ0FsQkEsRUFrQnVCLEdBQWpCLENBQU47Q0FFRTs7Ozs7OztDQUFBO0NBQUEsQ0FBQSxDQU9XLE1BQVg7O0NBRUE7Ozs7Q0FUQTs7Q0FBQSxFQWFXLENBYlgsR0FhQTs7Q0FFQTs7OztDQWZBOztDQUFBLEVBbUJXLENBbkJYLEVBbUJBOztDQUVBOzs7O0NBckJBOztDQUFBLEVBeUJXLENBekJYLEtBeUJBOztDQUVBOzs7Ozs7Q0EzQkE7O0NBQUEsRUFpQ1MsR0FBTyxDQUFoQjtDQUEyQixDQUFhLEVBQWIsQ0FBQSxNQUFBO0NBakMzQixHQWlDUzs7Q0FFVDs7Ozs7Ozs7Q0FuQ0E7O0NBMkNZLENBQUEsQ0FBQSxHQUFBLEVBQUEsV0FBRztDQUNiLEVBRGEsQ0FBRCxJQUNaO0NBQUEsRUFEd0IsQ0FBRCxFQUN2QjtDQUFBLENBQXlCLENBQVYsQ0FBZixFQUFBLEVBQWU7Q0FBZixFQUNlLENBQWYsR0FBQTtDQTdDRixFQTJDWTs7Q0FJWjs7OztDQS9DQTs7Q0FBQSxFQW1ETyxFQUFQLElBQU87Q0FDSixDQUE2QixDQUFiLENBQWhCLEVBQWdCLEdBQWpCLEVBQUE7Q0FwREYsRUFtRE87O0NBbkRQOztDQXBCRiIKICB9Cn0sCnsKICAib2Zmc2V0IjogewogICAgImxpbmUiOjEyNDkxLAogICAgImNvbHVtbiI6MAogIH0sCiAgIm1hcCI6IHsKICAgICJ2ZXJzaW9uIjogMywKICAgICJmaWxlIjogImFwcC5qcyIsCiAgICAic291cmNlcyI6IFsidmVuZG9ycy90aGVvcmljdXMvd3d3L3NyYy90aGVvcmljdXMvdXRpbHMvYXJyYXlfdXRpbC5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiIyMjKlxuICB1dGlscyBtb2R1bGVcbiAgQG1vZHVsZSB1dGlsc1xuIyMjXG5cbk9iamVjdFV0aWwgPSByZXF1aXJlICd0aGVvcmljdXMvdXRpbHMvb2JqZWN0X3V0aWwnXG5cbiMjIypcbiAgQXJyYXlVdGlsIGNsYXNzLlxuICBAY2xhc3MgQXJyYXlVdGlsXG4jIyNcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQXJyYXlVdGlsXG4gIFxuICAjIyMqXG4gIFxuICBTZWFyY2ggZm9yIGEgcmVjb3JkIHdpdGhpbiB0aGUgZ2l2ZW4gc291cmNlIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIGBzZWFyY2hgIGZpbHRlci5cblxuICBAbWV0aG9kIGZpbmRcbiAgQHN0YXRpY1xuICBAcGFyYW0gc3JjIHtBcnJheX0gU291cmNlIGFycmF5LlxuICBAcGFyYW0gc2VhcmNoIHtPYmplY3R9IE9iamVjdCB0byBiZSBmb3VuZCB3aXRoaW4gdGhlIHNvdXJjZSBhcnJheS5cbiAgQGV4YW1wbGVcbiAgICBmcnVpdHMgPSB7bmFtZTogXCJvcmFuZ2VcIiwgaWQ6MH0sIHtuYW1lOiBcImJhbmFuYVwiLCBpZDoxfSwge25hbWU6IFwid2F0ZXJtZWxvblwiLCBpZDoyfVxuICAgIEFycmF5VXRpbC5maW5kIGZydWl0cywge25hbWU6IFwib3JhbmdlXCJ9ICMgcmV0dXJucyB7bmFtZTogXCJvcmFuZ2VcIiwgaWQ6MH1cbiAgIyMjXG4gIEBmaW5kOiggc3JjLCBzZWFyY2ggKS0+XG4gICAgZm9yIHYsIGkgaW4gc3JjXG4gICAgICB1bmxlc3MgKHNlYXJjaCBpbnN0YW5jZW9mIE9iamVjdClcbiAgICAgICAgcmV0dXJuIGl0ZW06IHYsIGluZGV4OmkgaWYgdiA9PSBzZWFyY2hcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHtpdGVtOiB2LCBpbmRleDppIH0gaWYgT2JqZWN0VXRpbC5maW5kKHYsIHNlYXJjaCk/XG4gICAgcmV0dXJuIG51bGxcblxuICAjIyMqXG5cbiAgRGVsZXRlIGEgcmVjb3JkIHdpdGhpbiB0aGUgZ2l2ZW4gc291cmNlIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIGBzZWFyY2hgIGZpbHRlci5cblxuICBAbWV0aG9kIGRlbGV0ZVxuICBAc3RhdGljXG4gIEBwYXJhbSBzcmMge0FycmF5fSBTb3VyY2UgYXJyYXkuXG4gIEBwYXJhbSBzZWFyY2gge09iamVjdH0gT2JqZWN0IHRvIGJlIGZvdW5kIHdpdGhpbiB0aGUgc291cmNlIGFycmF5LlxuICBAZXhhbXBsZVxuICAgIGZydWl0cyA9IFt7bmFtZTogXCJvcmFuZ2VcIiwgaWQ6MH0sIHtuYW1lOiBcImJhbmFuYVwiLCBpZDoxfSwge25hbWU6IFwid2F0ZXJtZWxvblwiLCBpZDoyfV1cbiAgICBBcnJheVV0aWwuZGVsZXRlIGZydWl0cywge25hbWU6IFwiYmFuYW5hXCJ9XG4gICAgY29uc29sZS5sb2cgZnJ1aXRzICNbe25hbWU6IFwib3JhbmdlXCIsIGlkOjB9LCB7bmFtZTogXCJ3YXRlcm1lbG9uXCIsIGlkOjJ9XVxuICAjIyNcbiAgQGRlbGV0ZTooIHNyYywgc2VhcmNoICktPlxuICAgIGl0ZW0gPSBBcnJheVV0aWwuZmluZCBzcmMsIHNlYXJjaFxuICAgIHNyYy5zcGxpY2UgaXRlbS5pbmRleCwgMSBpZiBpdGVtPyJdLAogICAgIm5hbWVzIjogW10sCiAgICAibWFwcGluZ3MiOiAiQUFBQTs7OztDQUFBO0NBQUEsR0FBQSxpQkFBQTs7QUFLQSxDQUxBLEVBS2EsSUFBQSxHQUFiLG1CQUFhOztDQUViOzs7O0NBUEE7O0FBV0EsQ0FYQSxFQVd1QixHQUFqQixDQUFOO0NBRUU7O0NBQUE7Ozs7Ozs7Ozs7OztDQUFBOztDQUFBLENBWUEsQ0FBTSxDQUFOLEVBQU0sR0FBTDtDQUNDLE9BQUEsTUFBQTtBQUFBLENBQUEsUUFBQSx5Q0FBQTtrQkFBQTtBQUNTLENBQVAsR0FBQSxFQUFBLE1BQTBCO0NBQ3hCLEdBQTJCLENBQUssQ0FBaEMsRUFBQTtDQUFBLGdCQUFPO0NBQUEsQ0FBTSxFQUFOLFFBQUE7Q0FBQSxDQUFlLEdBQU4sT0FBQTtDQUFoQixXQUFBO1VBREY7TUFBQSxFQUFBO0NBR0UsR0FBOEIsSUFBOUIsMEJBQUE7Q0FBQSxnQkFBTztDQUFBLENBQU8sRUFBTixRQUFBO0NBQUQsQ0FBZ0IsR0FBTixPQUFBO0NBQWpCLFdBQUE7VUFIRjtRQURGO0NBQUEsSUFBQTtDQUtBLEdBQUEsT0FBTztDQWxCVCxFQVlNOztDQVFOOzs7Ozs7Ozs7Ozs7O0NBcEJBOztDQUFBLENBaUNBLENBQVEsR0FBQSxFQUFQLENBQUE7Q0FDQyxHQUFBLElBQUE7Q0FBQSxDQUEyQixDQUFwQixDQUFQLEVBQU8sR0FBUztDQUNoQixHQUFBLFFBQUE7Q0FBSSxDQUFtQixDQUFwQixDQUFZLENBQWYsQ0FBQSxPQUFBO01BRk07Q0FqQ1IsRUFpQ1E7O0NBakNSOztDQWJGIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6MTI1NzUsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJ2ZW5kb3JzL3RoZW9yaWN1cy93d3cvc3JjL3RoZW9yaWN1cy91dGlscy9vYmplY3RfdXRpbC5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiIyMjKlxuICB1dGlscyBtb2R1bGVcbiAgQG1vZHVsZSB1dGlsc1xuIyMjXG5cbiMjIypcbiAgT2JqZWN0VXRpbCBjbGFzcy5cbiAgQGNsYXNzIE9iamVjdFV0aWxcbiMjI1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBPYmplY3RVdGlsXG5cbiAgIyMjKlxuXG4gIENoZWNrIGlmIHNvdXJjZSBvYmplY3QgaGFzIGdpdmVuIGBzZWFyY2hgIHByb3BlcnRpZXMuXG4gIFxuICBAbWV0aG9kIGZpbmRcbiAgQHN0YXRpY1xuICBAcGFyYW0gc3JjIHtPYmplY3R9IFNvdXJjZSBvYmplY3QuXG4gIEBwYXJhbSBzZWFyY2gge09iamVjdH0gT2JqZWN0IHRvIGJlIGZvdW5kIHdpdGhpbiB0aGUgc291cmNlIG9iamVjdC5cbiAgQHBhcmFtIFtzdHJvbmdfdHlwaW5nPWZhbHNlXSB7Qm9vbGVhbn1cbiAgQGV4YW1wbGVcbiAgICBvYmogPSB7bmFtZTpcIkRyaW1iYVwiLCBhZ2U6MjIsIHNraWxsczp7bGFuZ3VhZ2U6XCJjb2ZmZWVzY3JpcHRcIiwgZWRpdG9yOlwic3VibGltZVwifX1cbiAgICBPYmplY3RVdGlsLmZpbmQgb2JqLCB7YWdlOjIyfSAjcmV0dXJucyB7bmFtZTpcIkRyaW1iYVwiLCBhZ2U6MjIsIHNraWxsczp7bGFuZ3VhZ2U6XCJjb2ZmZWVzY3JpcHRcIiwgZWRpdG9yOlwic3VibGltZVwifX1cbiAgIyMjXG4gIEBmaW5kOiggc3JjLCBzZWFyY2gsIHN0cm9uZ190eXBpbmcgPSBmYWxzZSApLT5cblxuICAgIGZvciBrLCB2IG9mIHNlYXJjaFxuXG4gICAgICBpZiB2IGluc3RhbmNlb2YgT2JqZWN0XG4gICAgICAgIHJldHVybiBPYmplY3RVdGlsLmZpbmQgc3JjW2tdLCB2XG5cbiAgICAgIGVsc2UgaWYgc3Ryb25nX3R5cGluZ1xuICAgICAgICByZXR1cm4gc3JjIGlmIHNyY1trXSA9PSB2XG5cbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHNyYyBpZiBcIiN7c3JjW2tdfVwiIGlzIFwiI3t2fVwiXG4gICAgcmV0dXJuIG51bGwiXSwKICAgICJuYW1lcyI6IFtdLAogICAgIm1hcHBpbmdzIjogIkFBQUE7Ozs7Q0FBQTtDQUtBOzs7O0NBTEE7Q0FBQSxHQUFBLE1BQUE7O0FBU0EsQ0FUQSxFQVN1QixHQUFqQixDQUFOO0NBRUU7O0NBQUE7Ozs7Ozs7Ozs7Ozs7Q0FBQTs7Q0FBQSxDQWFBLENBQU0sQ0FBTixFQUFNLEdBQUUsQ0FBUCxHQUFLO0NBRUosR0FBQSxJQUFBOztHQUZtQyxHQUFoQjtNQUVuQjtBQUFBLENBQUEsUUFBQSxFQUFBO3FCQUFBO0NBRUUsR0FBRyxFQUFILE1BQWdCO0NBQ2QsQ0FBK0IsQ0FBSixDQUFwQixNQUFVLEtBQVY7SUFFRCxFQUhSLEVBQUEsS0FBQTtDQUlFLEVBQWtCLENBQUosQ0FBVSxHQUF4QjtDQUFBLEVBQUEsY0FBTztVQUpUO01BQUEsRUFBQTtDQU9FLENBQWMsQ0FBRSxDQUFGLENBQWUsR0FBN0I7Q0FBQSxFQUFBLGNBQU87VUFQVDtRQUZGO0NBQUEsSUFBQTtDQVVBLEdBQUEsT0FBTztDQXpCVCxFQWFNOztDQWJOOztDQVhGIgogIH0KfSwKewogICJvZmZzZXQiOiB7CiAgICAibGluZSI6MTI2MzMsCiAgICAiY29sdW1uIjowCiAgfSwKICAibWFwIjogewogICAgInZlcnNpb24iOiAzLAogICAgImZpbGUiOiAiYXBwLmpzIiwKICAgICJzb3VyY2VzIjogWyJ2ZW5kb3JzL3RoZW9yaWN1cy93d3cvc3JjL3RoZW9yaWN1cy91dGlscy9zdHJpbmdfdXRpbC5jb2ZmZWUiXSwKICAgICJzb3VyY2VzQ29udGVudCI6IFsiIyMjKlxuICB1dGlscyBtb2R1bGVcbiAgQG1vZHVsZSB1dGlsc1xuIyMjXG5cbiMjIypcbiAgU3RyaW5nVXRpbCBjbGFzcy5cbiAgQGNsYXNzIFN0cmluZ1V0aWxcbiMjI1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTdHJpbmdVdGlsXG5cbiAgIyMjKlxuXG4gIENhcGl0YWxpemUgZmlyc3QgbGV0dGVyIG9mIHRoZSBnaXZlbiBzdHJpbmdcbiAgXG4gIEBtZXRob2QgdWNmaXJzdFxuICBAc3RhdGljXG4gIEBwYXJhbSBzdHIge1N0cmluZ31cbiAgQGV4YW1wbGVcbiAgICBTdHJpbmdVdGlsLnVjZmlyc3QgXCJ0aGVvcmljdXNcIiAjcmV0dXJucyAnVGhlb3JpY3VzJ1xuICAjIyNcbiAgQHVjZmlyc3Q9KCBzdHIgKS0+XG4gICAgYSA9IHN0ci5zdWJzdHIoIDAsIDEgKS50b1VwcGVyQ2FzZSgpXG4gICAgYiA9IHN0ci5zdWJzdHIoIDEgKVxuICAgIHJldHVybiBhICsgYlxuXG4gICMjIypcbiAgXG4gIENvbnZlcnQgU3RyaW5nIHRvIENhbWVsQ2FzZSBwYXR0ZXJuLlxuICBcbiAgQG1ldGhvZCBjYW1lbGl6ZVxuICBAc3RhdGljXG4gIEBwYXJhbSBzdHIge1N0cmluZ31cbiAgQGV4YW1wbGVcbiAgICBTdHJpbmdVdGlsLmNhbWVsaXplIFwiZ2lkZHlfdXBcIiAjcmV0dXJucyAnR2lkZHlVcCdcbiAgIyMjXG4gIEBjYW1lbGl6ZT0oIHN0ciApLT5cbiAgICBwYXJ0cyA9IFtdLmNvbmNhdCggc3RyLnNwbGl0IFwiX1wiIClcbiAgICBidWZmZXIgPSBcIlwiXG4gICAgYnVmZmVyICs9IFN0cmluZ1V0aWwudWNmaXJzdCBwYXJ0IGZvciBwYXJ0IGluIHBhcnRzXG4gICAgIyBzb21lIHdlaXJkbmVzcyBoYXBwZW5pbmcgaWYgd2UgZG9uJ3QgcmV0dXJuIHRoZSBidWZmZXJcbiAgICByZXR1cm4gYnVmZmVyXG5cbiAgIyMjKlxuXG4gIFNwbGl0IENhbWVsQ2FzZSB3b3JkcyB1c2luZyB1bmRlcnNjb3JlLlxuICBcbiAgQG1ldGhvZCB1bmRlcnNjb3JlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHN0ciB7U3RyaW5nfVxuICBAZXhhbXBsZVxuICAgIFN0cmluZ1V0aWwudW5kZXJzY29yZSBcIkdpZGR5VXBcIiAjcmV0dXJucyAnX2dpZGR5X3VwJ1xuICAjIyNcbiAgQHVuZGVyc2NvcmU9KCBzdHIgKS0+XG4gICAgc3RyID0gc3RyLnJlcGxhY2UoIC8oW0EtWl0pL2csIFwiXyQxXCIgKS50b0xvd2VyQ2FzZSgpXG4gICAgc3RyID0gaWYgc3RyLnN1YnN0ciggMSApID09IFwiX1wiIHRoZW4gc3RyLnN1YnN0ciAxIGVsc2Ugc3RyIl0sCiAgICAibmFtZXMiOiBbXSwKICAgICJtYXBwaW5ncyI6ICJBQUFBOzs7O0NBQUE7Q0FLQTs7OztDQUxBO0NBQUEsR0FBQSxNQUFBOztBQVNBLENBVEEsRUFTdUIsR0FBakIsQ0FBTjtDQUVFOzs7Ozs7Ozs7O0NBQUE7Q0FBQTs7Q0FBQSxDQVVBLENBQVMsSUFBVCxFQUFXLENBQVY7Q0FDQyxHQUFBLElBQUE7Q0FBQSxDQUFtQixDQUFmLENBQUosRUFBSSxLQUFBO0NBQUosRUFDSSxDQUFKLEVBQUk7Q0FDSixFQUFXLFFBQUo7Q0FiVCxFQVVTOztDQUtUOzs7Ozs7Ozs7O0NBZkE7O0NBQUEsQ0F5QkEsQ0FBVSxLQUFWLENBQVksQ0FBWDtDQUNDLE9BQUEscUJBQUE7Q0FBQSxDQUFVLENBQUYsQ0FBUixDQUFBLENBQVE7Q0FBUixDQUFBLENBQ1MsQ0FBVCxFQUFBO0FBQ0EsQ0FBQSxRQUFBLG1DQUFBO3dCQUFBO0NBQUEsR0FBVSxFQUFWLENBQVUsR0FBVTtDQUFwQixJQUZBO0NBSUEsS0FBQSxLQUFPO0NBOUJULEVBeUJVOztDQU9WOzs7Ozs7Ozs7O0NBaENBOztDQUFBLENBMENBLENBQVksTUFBRSxDQUFiO0NBQ0MsQ0FBK0IsQ0FBL0IsQ0FBQSxDQUFNLEVBQUEsR0FBQSxDQUFBO0NBQ08sRUFBYixFQUE0QixDQUFuQixLQUFUO0NBNUNGLEVBMENZOztDQTFDWjs7Q0FYRiIKICB9Cn0KICBdCn0=
*/})()