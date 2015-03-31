'use strict';

com_geekAndPoke_Ngm1.funcs = (function() {
    function _if(boolean, trueBody) {
        if(boolean) {
            trueBody();
        }

        function _else(falseBody) {
            if(!boolean) {
                falseBody();
            }
        }

        return {
            else: _else
        }
    }

    function forEachWithIndex(a, fkt) {
        var i, elem;
        for(i = 0; i < a.length; i++) {
            elem = a[i];
            fkt(elem, i);
        }
    }

    function forEachKeyAndVal(v, fkt) {
        var i;
        for(i in v) {
            if(v.hasOwnProperty(i)) {
                fkt(i, v[i]);
            }
        }
    }

    function forEachKey(v, fkt) {
        forEachKeyAndVal(v, function(key, val) {
            fkt(key);
        });
    }

    function forEachVal(v, fkt) {
        forEachKeyAndVal(v, function(key, val) {
            fkt(val);
        });
    }

    function syncFor(ctr, end, asyncBody) {
        if(ctr == end) {
            return;
        }
        asyncBody().then(function() {
            syncFor(ctr+1, end, asyncBody);
        });
    }

    return {
        if: _if,
        forEachKeyAndVal: forEachKeyAndVal,
        forEachKey: forEachKey,
        forEachVal: forEachVal,
        forEachWithIndex: forEachWithIndex
    }
})();
