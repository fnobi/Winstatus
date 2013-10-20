(function (exports) {
    var Winstatus = function (opts) {
        this.windowWidth = 0;
        this.windowHeight = 0;
        this.scrollX = 0;
        this.scrollY = 0;

        this.initListeners();
    };
    inherits(Winstatus, EventEmitter);

    Winstatus.prototype.initListeners = function () {
        var self = this;
        var windowView = new LightView(window);
        var documentView = new LightView(document);

        windowView.on('load', function () {
            self.updateWindowSize();
            self.updateScroll();
        });

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
