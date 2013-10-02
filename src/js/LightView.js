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
