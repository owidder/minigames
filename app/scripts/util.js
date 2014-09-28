'use strict';

module.exports = function (ns) {

    function isDefined(o) {
        return typeof(o) !== 'undefined';
    }

    function clearSvg() {
        var svg = d3.select("svg");
        if(!svg.empty()) {
            svg.remove();
        }
    }

    function clearTimer(AppContext) {
        if(ns.util.isDefined(AppContext.timer) && AppContext.timer != null) {
            clearInterval(AppContext.timer);
            AppContext.timer = null;
        }
    }

    function storeTimer(AppContext, timer) {
        AppContext.timer = timer;
    }

    ns.util = {
        clearSvg: clearSvg,
        isDefined: isDefined,
        clearTimer: clearTimer,
        storeTimer: storeTimer
    };
};
