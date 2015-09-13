angular.module(__global.appName, [
    'ngMaterial',
    'ngMdIcons',
    'ngRoute'
]).config(function ($routeProvider, $locationProvider) {
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
        .when('/gD', {
            templateUrl: 'partials/gameD.html',
            controller: 'GameDController'
        })
        .when('/gameOver', {
            templateUrl: 'partials/gameOver.html',
            controller: 'GameOverController'
        })
        .when('/gAStart', {
            templateUrl: 'partials/gameStart.html',
            controller: 'GameAStartController'
        })
        .when('/gBStart', {
            templateUrl: 'partials/gameStart.html',
            controller: 'GameBStartController'
        })
        .when('/gCStart', {
            templateUrl: 'partials/gameStart.html',
            controller: 'GameCStartController'
        })
        .when('/gDStart', {
            templateUrl: 'partials/gameStart.html',
            controller: 'GameDStartController'
        })
        .otherwise({
            redirectTo: '/gameOver'
        });
});
