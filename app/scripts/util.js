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

    ns.util = {
        clearSvg: clearSvg,
        isDefined: isDefined
    };
};
