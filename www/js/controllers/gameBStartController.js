'use strict';

angular.module(__global.appName).controller('GameBStartController', function ($scope) {
    $scope.gameId = "gB";
    $scope.gameName = "Touchi";

    $scope.highscore = $scope.$root.rootData.highscore_B;
    $scope.bgClass = "bg_orange";
    $scope.section1 = "Kill the bubbles by touching them." +
        "But only the bubbles with the highest numbers!" +
        "Dont let there be more than 30 bubbles!";
    $scope.section2 = "BEWARE THE CLOUD!!! It heralds fresh bubbles.";
});
