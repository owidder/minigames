com_geekAndPoke_Ngm1.menuController = (function() {

    var gameStartController = com_geekAndPoke_Ngm1.controllers.controller('GameAStartController', function ($scope) {
        $scope.gameId = "gA";
        $scope.gameName = "Swypi";

        $scope.highscore = $scope.$root.rootData.highscore_A;
        $scope.bgClass = "bg_red";
        $scope.section1 = "Drag each colored circle with a number to the right (if higher than the last number with the same color) or to the left (if lower)." +
            " Caution: You only have 3 seconds!";
        $scope.section2 = "Same number or a color first time: Do what you want";
    });

    return gameStartController;
})();
