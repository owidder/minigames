'use strict';

angular.module(__global.appName).controller('GameDStartController', function ($scope) {
    $scope.gameId = "gD";
    $scope.gameName = "S2t";

    $scope.highscore = $scope.$root.rootData.highscore_D;
    $scope.bgClass = "bg_gray";
    $scope.section1 = "Bring the bubbles in order! " +
        "Ascending, descending, clockwise, counterlockwise? Your choice!";
    $scope.section2 = "Hint: Look for the numberless bubble getting green and touch it!";
});
