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
            .when('/gameOver', {
                templateUrl: 'partials/gameOver.html',
                controller: 'GameOverController'
            })
            .when('/gAStart', {
                templateUrl: 'partials/gameAStart.html',
                controller: 'GameAStartController'
            })
            .otherwise({
                redirectTo: '/gameOver'
            });
    });

    return app;

})();