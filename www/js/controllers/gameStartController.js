com_geekAndPoke_Ngm1.menuController = (function() {

    var gameStartController = com_geekAndPoke_Ngm1.controllers.controller('GameStartController', function ($scope) {
        $scope.highscore = $scope.$root.rootData.highscore_D;
        $scope.bgClass = "bg_gray";
        $scope.section1 = "Bring the bubbles in order!\n" +
            "Ascending, descending, clockwise, counterlockwise? Your choice!";
        $scope.section2 = "Hint: Look for the numberless bubble getting green and touch it!";
        $scope.gameId = "gD";
    });

    return gameStartController;
})();
