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

    function forEachOrderedTuple(a, fkt, withLast) {
        var i, elem1, elem2;
        if(a.length > 1) {
            for(i = 0; i < a.length - 1; i++) {
                elem1 = a[i];
                elem2 = a[i+1];
                fkt(elem1, elem2, i);
            }
            if(withLast) {
                elem1 = a[a.length - 1];
                elem2 = a[0];
                fkt(elem1, elem2, a.length - 1);
            }
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
        forEachWithIndex: forEachWithIndex,
        forEachOrderedTuple: forEachOrderedTuple
    }
})();
