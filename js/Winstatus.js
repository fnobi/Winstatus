var LightView = function (el) {
    this.el = el;
};

LightView.prototype.on = function (type, fn) {
    var el = this.el;

    if (el.addEventListener) {
        el.addEventListener(type, fn, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, fn);
    }
};

var EventEmitter = new Function ();

EventEmitter.prototype.initEventEmitter = function () {
    this._listeners = {};
};

EventEmitter.prototype.initEventEmitterType = function (type) {
    if (!type) {
        return;
    }
    this._listeners[type] = [];
};

EventEmitter.prototype.hasEventListener = function (type, fn) {
    if (!this.listener) {
        return false;
    }

    if (type && !this.listener[type]) {
        return false;
    }

    return true;
};

EventEmitter.prototype.addListener = function (type, fn) {
    if (!this._listeners) {
        this.initEventEmitter();
    }
    if (!this._listeners[type]) {
        this.initEventEmitterType(type);
    }
    this._listeners[type].push(fn);

    this.emit('newListener', type, fn);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function (type, fn) {
    fn._onceListener = true;
    this.addListener(type, fn);
};

EventEmitter.prototype.removeListener = function (type, fn) {
    if (!this._listeners) {
        return;
    }
    if (!this._listeners[type]) {
        return;
    }
    if (!this._listeners[type].forEach) {
        return;
    }

    if (!type) {
        this.initEventEmitter();
        this.emit('removeListener', type, fn);
        return;
    }
    if (!fn) {
        this.initEventEmitterType(type);
        this.emit('removeListener', type, fn);
        return;
    }

    var self = this;
    this._listeners[type].forEach(function (listener, index) {
        if (listener === fn) {
            self._listeners[type].splice(index, 1);
        }
    });
    this.emit('removeListener', type, fn);
};

EventEmitter.prototype.emit = function (type) {
    if (!this._listeners) {
        return;
    }
    if (!this._listeners[type]) {
        return;
    }
    if (!this._listeners[type].forEach) {
        return;
    }

    var self = this,
        args = [].slice.call(arguments, 1);

    this._listeners[type].forEach(function (listener) {
        listener.apply(self, args);
        if (listener._onceListener) {
            self.removeListener(type, listener);
        }
    });
};

EventEmitter.prototype.listeners = function (type) {
    if (!type) {
        return undefined;
    }
    return this._listeners[type];
};

// jquery style alias
EventEmitter.prototype.trigger = EventEmitter.prototype.emit;
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
var inherits = function (Child, Parent) {
    for (var i in Parent.prototype) {
        if (Child.prototype[i]) {
            continue;
        }
        Child.prototype[i] = Parent.prototype[i];
    }
};
(function (exports) {
    var Winstatus = function (opts) {
        this.windowW = 0;
        this.windowH = 0;
        this.scrollX = 0;
        this.scrollY = 0;

        this.initListeners();
    };
    inherits(Winstatus, EventEmitter);

    Winstatus.prototype.initListeners = function () {
        var self = this;
        var windowView = new LightView(window);
        var documentView = new LightView(document);

        windowView.on('resize', function () {
            self.updateWindowSize();
        });
        windowView.on('scroll', function () {
            self.updateScroll();
        });
        documentView.on('scroll', function () {
            self.updateScroll();
        });
    };

    Winstatus.prototype.updateWindowSize = function () {
        this.windowWidth = window.innerWidth || document.body.clientWidth || 0;
        this.windowHeight = window.innerHeight || document.body.clientHeight || 0;
        this.emit('resize', this);
        this.emit('change', this);
    };

    Winstatus.prototype.updateScroll = function () {
        this.scrollX = (document.body.scrollLeft || document.documentElement.scrollLeft || window.scrollLeft || 0);
        this.scrollY = (document.body.scrollTop || document.documentElement.scrollTop || window.scrollTop || 0);
        this.emit('scroll', this);
        this.emit('change', this);
    };

    exports.Winstatus = Winstatus;
})(window);
