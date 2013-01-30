(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"initialize": function(exports, require, module) {
  var _ref, _ref1, _ref2, _ref3, _ref4;

  if ((_ref = this.Hipster) == null) {
    this.Hipster = {};
  }

  if ((_ref1 = Hipster.Routers) == null) {
    Hipster.Routers = {};
  }

  if ((_ref2 = Hipster.Views) == null) {
    Hipster.Views = {};
  }

  if ((_ref3 = Hipster.Models) == null) {
    Hipster.Models = {};
  }

  if ((_ref4 = Hipster.Collections) == null) {
    Hipster.Collections = {};
  }

  $(function() {
    var AppView, Scope, scope;
    require('../lib/app_helpers');
    Scope = require('./scope');
    Hipster.Views.AppView = new (AppView = require('views/app_view'));
    Backbone.history.start({
      pushState: true
    });
    scope = new Scope();
    return window.scope = scope;
  });
  
}});

window.require.define({"lib/app_helpers": function(exports, require, module) {
  
  (function() {
    Swag.Config.partialsPath = '../views/templates/';
    return (function() {
      var console, dummy, method, methods, _results;
      console = window.console = window.console || {};
      method = void 0;
      dummy = function() {};
      methods = 'assert,count,debug,dir,dirxml,error,exception,\
                     group,groupCollapsed,groupEnd,info,log,markTimeline,\
                     profile,profileEnd,time,timeEnd,trace,warn'.split(',');
      _results = [];
      while (method = methods.pop()) {
        _results.push(console[method] = console[method] || dummy);
      }
      return _results;
    })();
  })();
  
}});

window.require.define({"lib/view": function(exports, require, module) {
  var View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.tagName = 'section';

    View.prototype.template = function() {};

    View.prototype.initialize = function() {
      return this.render();
    };

    View.prototype.getRenderData = function() {
      var _ref;
      return (_ref = this.model) != null ? _ref.toJSON() : void 0;
    };

    View.prototype.render = function() {
      this.beforeRender();
      this.$el.html(this.template(this.getRenderData()));
      this.afterRender();
      return this;
    };

    View.prototype.beforeRender = function() {};

    View.prototype.afterRender = function() {};

    View.prototype.destroy = function() {
      this.undelegateEvents();
      this.$el.removeData().unbind();
      this.remove();
      return Backbone.View.prototype.remove.call(this);
    };

    return View;

  })(Backbone.View);
  
}});

window.require.define({"lib/view_collection": function(exports, require, module) {
  var View, ViewCollection, methods,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('./view');

  ViewCollection = (function(_super) {

    __extends(ViewCollection, _super);

    function ViewCollection() {
      this.renderOne = __bind(this.renderOne, this);
      return ViewCollection.__super__.constructor.apply(this, arguments);
    }

    ViewCollection.prototype.collection = new Backbone.Collection();

    ViewCollection.prototype.view = new View();

    ViewCollection.prototype.views = [];

    ViewCollection.prototype.length = function() {
      return this.views.length;
    };

    ViewCollection.prototype.add = function(views, options) {
      var view, _i, _len;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        if (!this.get(view.cid)) {
          this.views.push(view);
          if (!options.silent) {
            this.trigger('add', view, this);
          }
        }
      }
      return this;
    };

    ViewCollection.prototype.get = function(cid) {
      return this.find(function(view) {
        return view.cid === cid;
      }) || null;
    };

    ViewCollection.prototype.remove = function(views, options) {
      var view, _i, _len;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        this.destroy(view);
        if (!options.silent) {
          this.trigger('remove', view, this);
        }
      }
      return this;
    };

    ViewCollection.prototype.destroy = function(view, options) {
      var _views;
      if (view == null) {
        view = this;
      }
      if (options == null) {
        options = {};
      }
      _views = this.filter(_view)(function() {
        return view.cid !== _view.cid;
      });
      this.views = _views;
      view.undelegateEvents();
      view.$el.removeData().unbind();
      view.remove();
      Backbone.View.prototype.remove.call(view);
      if (!options.silent) {
        this.trigger('remove', view, this);
      }
      return this;
    };

    ViewCollection.prototype.reset = function(views, options) {
      var view, _i, _j, _len, _len1, _ref;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      _ref = this.views;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        this.destroy(view, options);
      }
      if (views.length !== 0) {
        for (_j = 0, _len1 = views.length; _j < _len1; _j++) {
          view = views[_j];
          this.add(view, options);
        }
        if (!options.silent) {
          this.trigger('reset', view, this);
        }
      }
      return this;
    };

    ViewCollection.prototype.renderOne = function(model) {
      var view;
      view = new this.view({
        model: model
      });
      this.$el.append(view.render().el);
      this.add(view);
      return this;
    };

    ViewCollection.prototype.renderAll = function() {
      this.collection.each(this.renderOne);
      return this;
    };

    return ViewCollection;

  })(View);

  methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  _.each(methods, function(method) {
    return ViewCollection.prototype[method] = function() {
      return _[method].apply(_, [this.views].concat(_.toArray(arguments)));
    };
  });

  module.exports = ViewCollection;
  
}});

window.require.define({"routers/app_router": function(exports, require, module) {
  var AppRouter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = AppRouter = (function(_super) {

    __extends(AppRouter, _super);

    function AppRouter() {
      return AppRouter.__super__.constructor.apply(this, arguments);
    }

    AppRouter.prototype.routes = {
      '': function() {}
    };

    return AppRouter;

  })(Backbone.Router);
  
}});

window.require.define({"scope": function(exports, require, module) {
  var Scope,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Scope = (function() {

    function Scope(options) {
      this.headingChanged = __bind(this.headingChanged, this);

      this.positionChanged = __bind(this.positionChanged, this);

      this.step = __bind(this.step, this);
      this.scaleFactor = 20000;
      this.debug = false;
      this.objects = [];
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
      this.camera.position.set(200, 200, 200);
      this.scene = new THREE.Scene();
      this.renderer = new THREE.CSS3DRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.domElement.style.position = 'absolute';
      this.renderer.domElement.style.top = 0;
      document.body.appendChild(this.renderer.domElement);
      this.setupAnimationFrame();
      this.startPositionDetection();
      requestAnimationFrame(this.step);
    }

    Scope.prototype.step = function() {
      var _ref;
      window.requestAnimationFrame(this.step);
      if (!(this.items != null) || !(this.longitude != null) || !(this.latitude != null) || !(this.heading != null)) {
        return;
      }
      this.camera.rotation.y = this.heading.toRad();
      if ((_ref = this.everySecond) == null) {
        this.everySecond = -1;
      }
      if (((this.everySecond += 1) % 120) === 0) {
        this.camera.position.set(this.longitude * this.scaleFactor, 0, this.latitude * this.scaleFactor, 0);
      }
      if (this.debug) {
        this.heading += 2;
        this.heading %= 360;
      }
      this.renderer.render(this.scene, this.camera);
      return console.info("yeah");
    };

    Scope.prototype.getCulture = function(lat, lon) {
      var pointArgument, url,
        _this = this;
      url = "http://kn-reise.delving.org/organizations/kn-reise/api/search?query=delving_spec:kulturit&qf=europeana_dataProvider_facet:Oslo%20Museum&qf=dc_type_facet:StillImage&format=json&rows=50&";
      pointArgument = "pt=" + lat + "," + lon;
      url += pointArgument;
      return $.getJSON(url, function(data) {
        var element, image, item, items, object, _i, _len, _ref, _results;
        items = data.result.items;
        console.info(items);
        _this.items = _.map(items, function(entry) {
          var fields;
          fields = entry.item.fields;
          return {
            longitude: parseFloat(fields.abm_long[0]),
            latitude: parseFloat(fields.abm_lat[0]),
            thumbnail: fields.delving_thumbnail[0]
          };
        });
        console.info(_this.items);
        _ref = _this.items;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          console.info("Adding object");
          element = document.createElement('div');
          element.style.width = '20px';
          element.style.height = '20px';
          element.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();
          image = document.createElement('img');
          image.style.position = 'absolute';
          image.src = item.thumbnail;
          console.info(item.thumbnail);
          element.appendChild(image);
          object = new THREE.CSS3DObject(element);
          object.position.set(item.longitude * _this.scaleFactor, (Math.random() * 500) - 250, item.latitude * _this.scaleFactor, 0);
          _this.objects.push(object);
          _results.push(_this.scene.add(object));
        }
        return _results;
      });
    };

    Scope.prototype.positionChanged = function(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      $("#pos").html(position.coords.latitude + "," + position.coords.longitude);
      return this.getCulture(this.latitude, this.longitude);
    };

    Scope.prototype.headingChanged = function(e) {
      var headingDebug;
      if (e.webkitCompassHeading != null) {
        this.heading = -parseFloat(e.webkitCompassHeading);
      } else {
        this.heading = 0;
        this.debug = true;
      }
      console.info(this.heading);
      headingDebug = 'heading: ' + this.heading + '\n' + 'headingAccuracy: ' + e.webkitCompassAccuracy;
      return $("#heading").html(headingDebug);
    };

    Scope.prototype.startPositionDetection = function() {
      navigator.geolocation.getCurrentPosition(this.positionChanged);
      this.watchID = navigator.geolocation.watchPosition(this.positionChanged);
      return window.addEventListener('deviceorientation', this.headingChanged, false);
    };

    Scope.prototype.featureDetect = function() {
      return alert("implementme");
    };

    Scope.prototype.haversineDistance = function(lat1, lon1, lat2, lon2) {
      var R, a, c, d, dLat, dLon;
      R = 6371;
      dLat = (lat2 - lat1).toRad();
      dLon = (lon2 - lon1).toRad();
      lat1 = lat1.toRad();
      lat2 = lat2.toRad();
      a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return d = R * c;
    };

    Scope.prototype.bearing = function(lat1, lon1, lat2, lon2) {
      var brng, dLat, dLon, x, y;
      dLat = (lat2 - lat1).toRad();
      dLon = (lon2 - lon1).toRad();
      y = Math.sin(dLon) * Math.cos(lat2);
      x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
      return brng = Math.atan2(y, x).toDeg();
    };

    Scope.prototype.setupAnimationFrame = function() {
      var requestAnimationFrame;
      requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      return window.requestAnimationFrame = requestAnimationFrame;
    };

    return Scope;

  })();

  if (typeof Number.prototype.toRad === 'undefined') {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    };
  }

  if (typeof Number.prototype.toDeg === 'undefined') {
    Number.prototype.toDeg = function() {
      return this * 180 / Math.PI;
    };
  }

  window.requestAnimFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function() {
      return window.setTimeout(callback, 1000 / 60);
    };
  };

  module.exports = Scope;
  
}});

window.require.define({"views/app_view": function(exports, require, module) {
  var AppRouter, AppView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  AppRouter = require('../routers/app_router');

  module.exports = AppView = (function(_super) {

    __extends(AppView, _super);

    function AppView() {
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.el = 'body.application';

    AppView.prototype.initialize = function() {
      var _ref;
      this.router = new AppRouter();
      return typeof Hipster !== "undefined" && Hipster !== null ? (_ref = Hipster.Routers) != null ? _ref.AppRouter = this.router : void 0 : void 0;
    };

    return AppView;

  })(View);
  
}});

