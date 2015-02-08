var com_geekAndPoke_Ngm1 = com_geekAndPoke_Ngm1 || {};

com_geekAndPoke_Ngm1.app = (function() {

    var app = angular.module('ngm1', [
        'ngRoute',
        'controllers'
    ]);

    app.config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false);

        $routeProvider.
            when('/g1', {
                templateUrl: 'partials/gameA.html',
                controller: 'GameAController'
            })
            .when('/gameOver', {
                templateUrl: 'partials/gameOver.html',
                controller: 'GameOverController'
            })
            .when('/menu', {
                templateUrl: 'partials/menu.html',
                controller: 'MenuController'
            })
            .otherwise({
                redirectTo: '/g1'
            });
    });

    return app;

})();