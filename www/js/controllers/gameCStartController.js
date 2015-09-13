com_geekAndPoke_Ngm1.menuController = (function() {

    var gameStartController = com_geekAndPoke_Ngm1.controllers.controller('GameCStartController', function ($scope) {
        $scope.gameId = "gC";
        $scope.gameName = "Sums";

        $scope.highscore = $scope.$root.rootData.highscore_C;
        $scope.bgClass = "bg_black";
        $scope.section1 = "Touch any bubble when the sum of the numbers is higher than 45 but less than 50!";
        $scope.section2 = "But NOT earlier and NOT later!";
    });

    return gameStartController;
})();
