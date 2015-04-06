com_geekAndPoke_Ngm1.const = function () {
    var util = com_geekAndPoke_Ngm1.util;

    var constant;
    var gameIds = [];

    var constants =  {
        MAX_NUMBER_OF_GROUPS: 10,
        _GAME_A_ID: "A",
        _GAME_B_ID: "B",
        _GAME_C_ID: "C",
        _GAME_D_ID: "D",
        GAME_IDS: gameIds
    };

    for(constant in constants) {
        if(util.startsWith(constant, "_GAME_")) {
            gameIds.push(constants[constant]);
        }
    }

    return constants;
}();