com_geekAndPoke_Ngm1.util = (function () {

    function isDefined(o) {
        return typeof(o) !== 'undefined';
    }

    function clearSvg() {
        var svg = d3.select("svg");
        if(!svg.empty()) {
            svg.remove();
        }
    }


    return {
        clearSvg: clearSvg,
        isDefined: isDefined
    };
})();