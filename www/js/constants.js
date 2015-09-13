'use strict';

angular.module(__global.appName).factory("constants", function(util) {
    var c;
    var gameIds = [];

    var _constants =  {
        MAX_NUMBER_OF_GROUPS: 10,
        _GAME_A_ID: "A",
        _GAME_B_ID: "B",
        _GAME_C_ID: "C",
        _GAME_D_ID: "D",
        GAME_IDS: gameIds
    };

    for(c in _constants) {
        if(util.startsWith(c, "_GAME_")) {
            gameIds.push(_constants[c]);
        }
    }

    return _constants;
});
