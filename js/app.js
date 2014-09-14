var com_geekAndPoke_Ngm1 = com_geekAndPoke_Ngm1 || {};

com_geekAndPoke_Ngm1.app = (function() {

    var app = angular.module('ngm1', [
        'ngRoute',
        'controllers'
    ]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/g1', {
                templateUrl: 'partials/gameA.html',
                controller: 'GameAController'
            }).
            otherwise({
                redirectTo: '/g1'
            });
    }]);

    return app;

})();