'use strict';

angular.module(__global.appName).factory("data", function(constants, util) {
    var ScopeRootData = function() {
        var HIGHSCORE_PREFIX = "highscore_";

        var constProperty;

        this.points = 0;

        this.currentGameId = "";

        this.setHighScore = function (gameId, points) {
            var property = HIGHSCORE_PREFIX + gameId;
            this[property] = points;
        };

        var g, gameId, property;

        for(g = 0; g < constants.GAME_IDS.length; g++) {
            gameId = constants.GAME_IDS[g];
            property = HIGHSCORE_PREFIX + gameId;
            this[property] = getHighScore(gameId);
        }
    };

    function setHighScore(gameId, points, scopeRootData) {
        var current = getHighScore(gameId);

        if(points > current) {
            window.localStorage.setItem(gameId, points);
            scopeRootData.setHighScore(gameId, points);
        }
    }

    function getHighScore(gameId) {
        var highScore = window.localStorage.getItem(gameId);

        if(!util.isSet(highScore)) {
            highScore = 0;
        }

        return highScore;
    }

    return {
        ScopeRootData: ScopeRootData,
        setHighScore: setHighScore,
        getHighScore: getHighScore
    };
});
