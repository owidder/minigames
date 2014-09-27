module.exports = function (ns) {

    ns.app = angular.module('ngm1', [
        'ngRoute',
        'services'
    ]).config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false);

        $routeProvider
            .when('/g1', {
                templateUrl: 'views/gameA.html',
                controller: 'GameACtrl'
            })
            .when('/gameOver', {
                templateUrl: 'views/gameOver.html',
                controller: 'GameOverCtrl'
            })
            .when('/menu', {
                templateUrl: 'views/menu.html',
                controller: 'MenuCtrl'
            })
            .otherwise({
                redirectTo: '/g1'
            });
    });
};