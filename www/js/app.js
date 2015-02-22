var com_geekAndPoke_Ngm1 = com_geekAndPoke_Ngm1 || {};

com_geekAndPoke_Ngm1.app = (function() {

    var app = angular.module('ngm1', [
        'ngRoute',
        'controllers'
    ]);

    app.config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false);

        $routeProvider.
            when('/gA', {
                templateUrl: 'partials/gameA.html',
                controller: 'GameAController'
            })
            .when('/gB', {
                templateUrl: 'partials/gameB.html',
                controller: 'GameBController'
            })
            .when('/gC', {
                templateUrl: 'partials/gameC.html',
                controller: 'GameCController'
            })
            .when('/gameOver', {
                templateUrl: 'partials/gameOver.html',
                controller: 'GameOverController'
            })
            .when('/gAStart', {
                templateUrl: 'partials/gameAStart.html',
                controller: 'GameStartController'
            })
            .when('/gBStart', {
                templateUrl: 'partials/gameBStart.html',
                controller: 'GameStartController'
            })
            .otherwise({
                redirectTo: '/gameOver'
            });
    });

    return app;

})();