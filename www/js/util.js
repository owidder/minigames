com_geekAndPoke_Ngm1.util = (function () {

    function isDefined(o) {
        return typeof(o) !== 'undefined';
    }

    function isSet(o) {
        return (isDefined(o) && o != null);
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function randomNumberBetweenLowerAndUpper(lower, upper) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }

    /**
     * Push array s into array d
     * @param d
     * @param s
     */
    function pushAll(dArray, sArray) {
        var i;

        for(i = 0; i < sArray.length; i++) {
            dArray.push(sArray[i]);
        }
    }

    function clearSvg() {
        var svg = d3.select("svg");
        if(!svg.empty()) {
            svg.remove();
        }
    }

    return {
        clearSvg: clearSvg,
        isDefined: isDefined,
        isNumeric: isNumeric,
        isSet: isSet,
        randomNumberBetweenLowerAndUpper: randomNumberBetweenLowerAndUpper,
        pushAll: pushAll
    };
})();