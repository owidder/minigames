'use strict';

angular.module(__global.appName).factory("util", function() {
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

    function startsWith(string, text) {
        return (string.indexOf(text) == 0);
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

    function createLinkArray(size) {
        var i, j, link;
        var linkArray = [];

        if (size > 0) {
            for (i = 0; i < size; i++) {
                for (j = i + 1; j < size; j++) {
                    link = {
                        source: i,
                        target: j,
                        value: 1
                    };
                    linkArray.push(link);
                }
            }
        }

        return linkArray;
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
        startsWith: startsWith,
        pushAll: pushAll,
        createLinkArray: createLinkArray
    };
});
