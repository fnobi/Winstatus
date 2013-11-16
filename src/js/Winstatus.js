(function (exports) {
    var Winstatus = function (opts) {
        this.windowWidth = 0;
        this.windowHeight = 0;
        this.scrollX = 0;
        this.scrollY = 0;

        this.throttle = opts.throttle;

        this.initListeners();
    };
    inherits(Winstatus, EventEmitter);

    Winstatus.prototype.initListeners = function () {
        var self = this;
        var throttle = this.throttle;
        var windowView = new LightView(window);
        var documentView = new LightView(document);

        function resize () {
            if (self.resizeThrottle) {
                clearTimeout(self.resizeThrottle);
            }
            self.resizeThrottle = setTimeout(function () {
                self.updateWindowSize();
                self.resizeThrottle = null;
            }, throttle);
        }

        function scroll () {
            if (self.scrollThrottle) {
                clearTimeout(self.scrollThrottle);
            }
            self.scrollThrottle = setTimeout(function () {
                self.updateScroll();
                self.scrollThrottle = null;
            });
        }

        windowView.on('load', function () {
            resize();
            scroll();
        });

        windowView.on('resize', resize);
        windowView.on('scroll', scroll);
        documentView.on('scroll', scroll);
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
